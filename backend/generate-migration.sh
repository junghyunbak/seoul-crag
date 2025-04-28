#!/bin/bash

# 첫 번째 인자를 MIGRATION_NAME으로 받는다
MIGRATION_NAME=$1

# 인자가 비어있으면 에러 출력
if [ -z "$MIGRATION_NAME" ]; then
  echo "❌  Migration name is required."
  echo "Usage: ./generate-migration.sh YourMigrationName"
  exit 1
fi

# 마이그레이션 생성 명령어 실행
npx ts-node \
  -r tsconfig-paths/register \
  ./node_modules/typeorm/cli.js \
migration:generate \
  -d ./src/config/data-source.ts \
  ./src/migrations/$MIGRATION_NAME