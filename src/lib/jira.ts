interface JiraTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  type: 'task' | 'story' | 'epic';
  parentId?: string;
}

interface JiraConfig {
  domain: string;
  email: string;
  apiToken: string;
}

class JiraService {
  private config: JiraConfig;

  constructor(config: JiraConfig) {
    this.config = config;
  }

  private getHeaders() {
    const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  private getBaseUrl() {
    return `https://${this.config.domain}/rest/api/3`;
  }

  async createEpic(epic: { title: string; description?: string; projectKey: string }) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/issue`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fields: {
            project: { key: epic.projectKey },
            summary: epic.title,
            description: epic.description ? {
              type: 'doc',
              version: 1,
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: epic.description }]
              }]
            } : undefined,
            issuetype: { name: 'Epic' },
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create epic: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating epic in Jira:', error);
      throw error;
    }
  }

  async createStory(story: { 
    title: string; 
    description?: string; 
    projectKey: string; 
    epicKey?: string; 
  }) {
    try {
      const fields: any = {
        project: { key: story.projectKey },
        summary: story.title,
        description: story.description ? {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: story.description }]
          }]
        } : undefined,
        issuetype: { name: 'Story' },
      };

      if (story.epicKey) {
        fields.parent = { key: story.epicKey };
      }

      const response = await fetch(`${this.getBaseUrl()}/issue`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ fields })
      });

      if (!response.ok) {
        throw new Error(`Failed to create story: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating story in Jira:', error);
      throw error;
    }
  }

  async createTask(task: { 
    title: string; 
    description?: string; 
    projectKey: string; 
    storyKey?: string; 
  }) {
    try {
      const fields: any = {
        project: { key: task.projectKey },
        summary: task.title,
        description: task.description ? {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: task.description }]
          }]
        } : undefined,
        issuetype: { name: 'Task' },
      };

      if (task.storyKey) {
        fields.parent = { key: task.storyKey };
      }

      const response = await fetch(`${this.getBaseUrl()}/issue`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ fields })
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task in Jira:', error);
      throw error;
    }
  }

  async updateIssueStatus(issueKey: string, statusName: string) {
    try {
      const transitionsResponse = await fetch(`${this.getBaseUrl()}/issue/${issueKey}/transitions`, {
        headers: this.getHeaders(),
      });

      if (!transitionsResponse.ok) {
        throw new Error(`Failed to get transitions: ${transitionsResponse.statusText}`);
      }

      const transitions = await transitionsResponse.json();
      const transition = transitions.transitions.find((t: any) => 
        t.to.name.toLowerCase() === statusName.toLowerCase()
      );

      if (!transition) {
        throw new Error(`Transition to status "${statusName}" not found`);
      }

      const response = await fetch(`${this.getBaseUrl()}/issue/${issueKey}/transitions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          transition: { id: transition.id }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating issue status in Jira:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      const response = await fetch(`${this.getBaseUrl()}/project`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get projects: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting projects from Jira:', error);
      throw error;
    }
  }
}

export { JiraService };
export type { JiraTask, JiraConfig };