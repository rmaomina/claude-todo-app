# Claude Todo App 📋

클로드코드 데모용 Todo 애플리케이션입니다. Epic-Story-Task 계층 구조로 프로젝트를 체계적으로 관리하고, GitHub OAuth 인증과 Jira 연동 기능을 제공합니다.

## 🚀 주요 기능

- **계층적 작업 관리**: Epic → Story → Task 구조로 체계적인 프로젝트 관리
- **GitHub OAuth 인증**: GitHub 계정으로 간편 로그인
- **Jira 연동**: 작업을 Jira 이슈로 동기화 
- **실시간 진행률 추적**: 각 Epic과 Story의 완료도 시각화
- **반응형 Material Design UI**: Google Material Design 기반 모던 UI
- **TypeScript & Prisma**: 타입 안전성과 데이터베이스 ORM

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Material-UI (MUI), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js (GitHub OAuth)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/mina-kim_cndf/claude-todo-app.git
cd claude-todo-app
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 설정하세요:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (필수)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Jira 연동 (선택사항)
JIRA_DOMAIN="your-domain.atlassian.net"
JIRA_EMAIL="your-email@example.com"
JIRA_API_TOKEN="your-jira-api-token"
```

### 4. GitHub OAuth 앱 설정

1. GitHub에서 OAuth 앱 생성: https://github.com/settings/applications/new
2. Application name: `Claude Todo App`
3. Homepage URL: `http://localhost:3000`
4. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. 생성된 Client ID와 Client Secret을 `.env.local`에 설정

### 5. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 애플리케이션을 확인하세요.

## 🔧 스크립트 명령어

```bash
# 개발 서버 실행 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 테스트 실행
npm test

# Prisma 관련
npm run db:generate    # Prisma 클라이언트 생성
npm run db:push       # 스키마를 데이터베이스에 적용
npm run db:migrate    # 마이그레이션 생성 및 적용
npm run db:studio     # Prisma Studio 실행
```

## 📱 사용 방법

### 1. 로그인
- GitHub 계정으로 로그인

### 2. 작업 관리
- **작업 목록**: 개별 작업들을 생성, 수정, 삭제, 완료 표시
- **계층 구조**: Epic과 Story를 생성하여 체계적으로 관리

### 3. Jira 연동 (선택사항)
- Jira 설정이 완료되면 작업을 Jira 이슈로 동기화 가능
- 각 작업 카드의 메뉴에서 "Jira 동기화" 선택

## 🚀 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정:
   - `DATABASE_URL`: PostgreSQL URL (Vercel Postgres 사용 권장)
   - `NEXTAUTH_SECRET`: 랜덤 시크릿 키
   - `NEXTAUTH_URL`: 배포된 도메인 URL
   - `GITHUB_ID`, `GITHUB_SECRET`: GitHub OAuth 앱 정보
   - `JIRA_*`: Jira 연동 정보 (선택사항)

3. GitHub OAuth 앱의 Authorization callback URL을 배포 도메인으로 업데이트

### GitHub Actions CI/CD

프로젝트에는 다음 CI/CD 파이프라인이 설정되어 있습니다:

- **린트 및 타입 체크**: ESLint와 TypeScript 검증
- **빌드**: Next.js 애플리케이션 빌드
- **테스트**: 자동화된 테스트 실행
- **보안 스캔**: 의존성 취약점 검사
- **자동 배포**: main 브랜치 푸시 시 Vercel에 자동 배포

필요한 GitHub Secrets:
- `VERCEL_TOKEN`: Vercel 액세스 토큰
- `VERCEL_ORG_ID`: Vercel 조직 ID
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

## 📊 프로젝트 구조

```
claude-todo-app/
├── .github/workflows/     # GitHub Actions 워크플로우
├── prisma/               # Prisma 스키마 및 마이그레이션
├── public/               # 정적 파일
├── src/
│   ├── app/             # Next.js App Router 페이지
│   ├── components/      # React 컴포넌트
│   │   ├── layout/     # 레이아웃 컴포넌트
│   │   └── ui/         # UI 컴포넌트
│   ├── lib/            # 유틸리티 및 설정
│   └── types/          # TypeScript 타입 정의
├── .env.local          # 환경 변수 (gitignore)
└── README.md
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 데모 목적으로 생성되었습니다.

## ⚡ 클로드코드 데모 포인트

이 프로젝트는 클로드코드의 다음 기능들을 데모하기 위해 설계되었습니다:

- **태스크 관리**: TodoWrite 도구를 활용한 체계적인 작업 추적
- **체크포인트 관리**: Epic-Story-Task 계층 구조로 프로젝트 진행도 관리
- **자동화**: GitHub Actions CI/CD 파이프라인
- **외부 서비스 연동**: GitHub OAuth, Jira 연동
- **풀스택 개발**: Frontend부터 Backend, 데이터베이스까지 통합 개발

🎯 **발표 핵심 메시지**: 클로드코드는 단순한 코딩 도구가 아닌, 프로젝트 전체 생명주기를 관리하는 종합 개발 플랫폼입니다.