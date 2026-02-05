#!/usr/bin/env bash

#########################################
# Electron Local Data Reset Utility
#########################################

APP_NAME="electron-app"

# Image directories (Add more anytime)
IMAGE_DIRS=(
  "profile_images"
  "todo_images"
  "screenshots"
)

#########################################
# Colors
#########################################
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#########################################
# Flags
#########################################
DRY_RUN=false

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo -e "${BLUE}🔍 Running in DRY RUN mode (nothing will be deleted)${NC}"
fi

#########################################
# Detect OS & userData Path
#########################################

OS="$(uname -s)"

case "$OS" in
  Darwin*)
    APP_SUPPORT_PATH="$HOME/Library/Application Support/$APP_NAME"
    ;;
  Linux*)
    APP_SUPPORT_PATH="$HOME/.config/$APP_NAME"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    APP_SUPPORT_PATH="$APPDATA/$APP_NAME"
    ;;
  *)
    echo -e "${RED}❌ Unsupported OS: $OS${NC}"
    exit 1
    ;;
esac

DB_PATH="$APP_SUPPORT_PATH/database.sqlite"

echo -e "${YELLOW}⚠️  Target Directory:${NC} $APP_SUPPORT_PATH"
echo -e "${YELLOW}⚠️  This will DELETE:${NC}"
echo "  • Database"
echo "  • Image directories: ${IMAGE_DIRS[*]}"
echo ""

#########################################
# Confirmation
#########################################

read -p "Are you sure? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo -e "${BLUE}❌ Aborted${NC}"
  exit 0
fi

#########################################
# Delete Function
#########################################

delete_path() {
  local path="$1"
  local label="$2"

  if [ -e "$path" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo -e "${BLUE}[DRY RUN] Would delete $label → $path${NC}"
    else
      rm -rf "$path"
      echo -e "${GREEN}🗑️  Deleted $label${NC}"
    fi
  else
    echo -e "${YELLOW}ℹ️  $label not found${NC}"
  fi
}

#########################################
# Delete Database
#########################################

delete_path "$DB_PATH" "Database"

#########################################
# Delete Image Directories
#########################################

for dir in "${IMAGE_DIRS[@]}"; do
  delete_path "$APP_SUPPORT_PATH/$dir" "$dir"
done

echo -e "${GREEN}✅ Reset Complete${NC}"
