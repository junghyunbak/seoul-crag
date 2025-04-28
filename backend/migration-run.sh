#!/bin/bash

echo "🚀 Running TypeORM migrations..."

npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run \
  -d ./src/config/data-source.ts

if [ $? -eq 0 ]; then
  echo "✅ Migration successfully applied!"
else
  echo "❌ Migration failed!"
  exit 1
fi