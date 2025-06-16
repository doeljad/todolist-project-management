-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "ProjectMember" ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'MEMBER';
