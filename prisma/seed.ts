import { PrismaClient, Priority, TaskStatus, StoryStatus, EpicStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시딩 시작...');

  // 기본 태그 생성
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'urgent' },
      update: {},
      create: {
        name: 'urgent',
        color: '#EF4444',
        description: '긴급한 작업'
      }
    }),
    prisma.tag.upsert({
      where: { name: 'bug' },
      update: {},
      create: {
        name: 'bug',
        color: '#F59E0B',
        description: '버그 수정'
      }
    }),
    prisma.tag.upsert({
      where: { name: 'feature' },
      update: {},
      create: {
        name: 'feature',
        color: '#10B981',
        description: '새로운 기능'
      }
    }),
    prisma.tag.upsert({
      where: { name: 'documentation' },
      update: {},
      create: {
        name: 'documentation',
        color: '#6366F1',
        description: '문서화 작업'
      }
    }),
    prisma.tag.upsert({
      where: { name: 'testing' },
      update: {},
      create: {
        name: 'testing',
        color: '#8B5CF6',
        description: '테스트 관련'
      }
    })
  ]);

  console.log('✅ 태그 생성 완료:', tags.length, '개');

  // 샘플 사용자 (OAuth를 통해 실제 사용자가 생성되므로, 여기서는 시드하지 않음)
  
  console.log('🎉 데이터베이스 시딩 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });