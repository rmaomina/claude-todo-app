-- 데이터베이스 초기화 스크립트
-- PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 시간대 설정
SET timezone = 'UTC';

-- 데이터베이스 설정
-- Prisma가 자동으로 테이블을 생성하므로 여기서는 기본 설정만