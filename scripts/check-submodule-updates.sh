#!/bin/bash
# ============================================
# Script: check-submodule-updates.sh
# Verifica se há atualizações nos submodules
# ============================================

REPO_DIR="/root/repo"
LOG_FILE="/var/log/submodule-updates.log"
UPDATES_FOUND=0

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "🔍 Verificando atualizações de submodules"
echo "   $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

cd "$REPO_DIR" || exit 1

# Fetch updates sem aplicar
git submodule foreach --quiet 'git fetch origin 2>/dev/null'

# Verificar cada submodule
for submodule in $(git config --file .gitmodules --get-regexp path | awk '{ print $2 }'); do
    cd "$REPO_DIR/$submodule" || continue

    # Pegar branch padrão
    DEFAULT_BRANCH=$(git remote show origin 2>/dev/null | grep 'HEAD branch' | awk '{print $NF}')
    [ -z "$DEFAULT_BRANCH" ] && DEFAULT_BRANCH="main"

    # Contar commits atrás
    LOCAL=$(git rev-parse HEAD 2>/dev/null)
    REMOTE=$(git rev-parse "origin/$DEFAULT_BRANCH" 2>/dev/null)

    if [ "$LOCAL" != "$REMOTE" ]; then
        BEHIND=$(git rev-list --count HEAD..origin/$DEFAULT_BRANCH 2>/dev/null || echo "?")
        echo -e "${YELLOW}📦 $submodule${NC}"
        echo -e "   └─ ${RED}$BEHIND commits atrás${NC} de origin/$DEFAULT_BRANCH"
        UPDATES_FOUND=$((UPDATES_FOUND + 1))
    else
        echo -e "${GREEN}✓${NC} $submodule (atualizado)"
    fi

    cd "$REPO_DIR"
done

echo ""
echo "=========================================="

if [ $UPDATES_FOUND -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $UPDATES_FOUND submodule(s) com atualizações disponíveis${NC}"
    echo ""
    echo "Para atualizar, execute:"
    echo "  cd $REPO_DIR"
    echo "  git submodule update --remote --merge"
    echo "  git add . && git commit -m 'Update submodules' && git push"

    # Log para histórico
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $UPDATES_FOUND updates disponíveis" >> "$LOG_FILE"
else
    echo -e "${GREEN}✅ Todos os submodules estão atualizados!${NC}"
fi

echo "=========================================="

exit $UPDATES_FOUND
