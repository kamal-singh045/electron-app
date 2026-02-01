#!/bin/bash

APP_NAME="electron-app"
DB_PATH="$HOME/Library/Application Support/$APP_NAME/database.sqlite"
IMAGES_PATH="$HOME/Library/Application Support/$APP_NAME/images"

echo "⚠️  This will DELETE your local database and images."
read -p "Are you sure? (y/N): " confirm

if [ "$confirm" != "y" ]; then
  echo "❌ Aborted"
  exit 1
fi

if [ -f "$DB_PATH" ]; then
  rm "$DB_PATH"
  echo "🗑️  Database deleted"
else
  echo "ℹ️  No database found"
fi

if [ -d "$IMAGES_PATH" ]; then
  rm -rf "$IMAGES_PATH"
  echo "🗑️  Images deleted"
else
  echo "ℹ️  No images directory found"
fi

echo "✅ Reset complete"
