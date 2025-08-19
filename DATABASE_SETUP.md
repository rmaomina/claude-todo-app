# 데이터베이스 설정 가이드

## 🏗️ 클라우드 기반 멀티플랫폼 Todo 시스템

### 📋 주요 기능

- **계층적 작업 관리**: Epic → Story → Task
- **워크스페이스**: 팀/프로젝트 단위 관리
- **실시간 협업**: 댓글, 첨부파일, 공유
- **태그 시스템**: 유연한 분류 및 필터링
- **알림 시스템**: 실시간 업데이트
- **활동 로그**: 모든 변경 이력 추적
- **멀티플랫폼**: Web/Mobile 동시 지원

### 🗄️ 데이터베이스 구조

#### 1. 사용자 관리
- **User**: 확장된 사용자 프로필 (타임존, 테마, 알림 설정)
- **Account/Session**: NextAuth 인증
- **Workspace**: 팀/프로젝트 단위 관리
- **WorkspaceMember**: 역할 기반 접근 제어

#### 2. 작업 관리 (3계층)
- **Epic**: 대형 프로젝트/목표 (진행률, 색상, 기간)
- **Story**: 기능 단위 (스토리 포인트, 애자일 지원)
- **Task**: 세부 작업 (서브태스크, 시간 추적, 마감일)

#### 3. 협업 기능
- **TaskShare**: 개별 작업 공유
- **Comment**: 중첩 댓글 시스템
- **Attachment**: 파일 첨부
- **Tag**: 유연한 태그 시스템

#### 4. 시스템 기능
- **Notification**: 실시간 알림
- **ActivityLog**: 상세한 변경 이력

### 🚀 로컬 개발 설정

#### 1. PostgreSQL 시작 (Docker 사용)
```bash
# PostgreSQL 컨테이너 시작
npm run docker:up

# 로그 확인
npm run docker:logs

# 중지
npm run docker:down
```

#### 2. 데이터베이스 마이그레이션
```bash
# Prisma 클라이언트 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate

# 시드 데이터 삽입
npm run db:seed
```

#### 3. 데이터베이스 관리
```bash
# Prisma Studio (GUI)
npm run db:studio

# pgAdmin (http://localhost:8080)
# Email: admin@example.com
# Password: admin
```

### 🌐 프로덕션 설정 (Vercel)

#### 1. Vercel Postgres 생성
1. Vercel 대시보드 → Storage → Create Database → Postgres
2. 환경변수 자동 설정: `DATABASE_URL`, `DIRECT_URL`

#### 2. 환경변수 설정
```env
# Vercel에서 자동 설정됨
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

#### 3. 프로덕션 마이그레이션
```bash
# 프로덕션 배포 시 자동 실행
npm run db:deploy
```

### 🔧 개발 워크플로우

#### 1. 스키마 변경 시
```bash
npm run db:migrate    # 새 마이그레이션 생성
npm run db:generate   # 클라이언트 재생성
```

#### 2. 데이터 리셋 (개발 시)
```bash
npm run db:reset      # 모든 데이터 삭제 후 재마이그레이션
```

#### 3. 상태 확인
```bash
npx prisma migrate status    # 마이그레이션 상태
npx prisma db pull          # 스키마 동기화
```

### 📱 멀티플랫폼 지원

#### Web (Next.js)
- 반응형 Material-UI 디자인
- PWA 지원 가능
- 실시간 동기화

#### Mobile App (향후 확장)
- React Native + Expo
- 동일한 PostgreSQL API 사용
- 오프라인 동기화 지원

### 🔐 보안 고려사항

- **행 수준 보안**: 사용자별 데이터 격리
- **역할 기반 접근**: 워크스페이스 권한 관리
- **OAuth 인증**: GitHub/Google 등
- **API 인증**: NextAuth 세션 검증

### 📊 성능 최적화

- **인덱스 최적화**: 자주 쿼리되는 필드
- **연결 풀링**: Vercel Postgres 자동 설정
- **쿼리 최적화**: Prisma include 최소화
- **캐싱**: Redis 추가 가능

### 🧪 테스트 데이터

시드 파일에서 다음 데이터를 생성:
- 기본 태그 (urgent, bug, feature, documentation, testing)
- 샘플 워크스페이스 및 작업 (옵션)

실제 사용자는 OAuth 로그인 시 자동 생성됩니다.