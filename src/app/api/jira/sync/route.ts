import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { JiraService } from '@/lib/jira';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { taskId, action } = await request.json();

    if (!process.env.JIRA_DOMAIN || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
      return NextResponse.json({ error: 'Jira configuration not found' }, { status: 400 });
    }

    const jiraService = new JiraService({
      domain: process.env.JIRA_DOMAIN,
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    });

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
      include: {
        story: {
          include: {
            epic: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    let result;

    switch (action) {
      case 'create_task':
        result = await jiraService.createTask({
          title: task.title,
          description: task.description || undefined,
          projectKey: 'CLAUDE', // 기본 프로젝트 키 (환경변수로 설정 가능)
          storyKey: task.story?.title, // 실제로는 Jira key여야 함
        });
        
        await prisma.task.update({
          where: { id: taskId },
          data: { 
            description: task.description ? 
              `${task.description}\n\nJira Issue: ${result.key}` : 
              `Jira Issue: ${result.key}`
          },
        });
        break;

      case 'create_story':
        if (!task.story) {
          return NextResponse.json({ error: 'Task is not associated with a story' }, { status: 400 });
        }

        result = await jiraService.createStory({
          title: task.story.title,
          description: task.story.description || undefined,
          projectKey: 'CLAUDE',
          epicKey: task.story.epic?.title, // 실제로는 Jira key여야 함
        });

        await prisma.story.update({
          where: { id: task.story.id },
          data: { 
            description: task.story.description ? 
              `${task.story.description}\n\nJira Issue: ${result.key}` : 
              `Jira Issue: ${result.key}`
          },
        });
        break;

      case 'create_epic':
        if (!task.story?.epic) {
          return NextResponse.json({ error: 'Task is not associated with an epic' }, { status: 400 });
        }

        result = await jiraService.createEpic({
          title: task.story.epic.title,
          description: task.story.epic.description || undefined,
          projectKey: 'CLAUDE',
        });

        await prisma.epic.update({
          where: { id: task.story.epic.id },
          data: { 
            description: task.story.epic.description ? 
              `${task.story.epic.description}\n\nJira Issue: ${result.key}` : 
              `Jira Issue: ${result.key}`
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Successfully synced to Jira',
      jiraKey: result.key,
    });

  } catch (error) {
    console.error('Error syncing to Jira:', error);
    return NextResponse.json({ 
      error: 'Failed to sync to Jira',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.JIRA_DOMAIN || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
      return NextResponse.json({ 
        configured: false,
        message: 'Jira configuration not found. Please set JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN environment variables.'
      });
    }

    const jiraService = new JiraService({
      domain: process.env.JIRA_DOMAIN,
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    });

    try {
      const projects = await jiraService.getProjects();
      return NextResponse.json({
        configured: true,
        projects: projects.slice(0, 5), // 처음 5개 프로젝트만 반환
        domain: process.env.JIRA_DOMAIN,
      });
    } catch (error) {
      return NextResponse.json({
        configured: false,
        error: 'Failed to connect to Jira. Please check your configuration.',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Error checking Jira configuration:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}