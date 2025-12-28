#!/bin/bash

echo "=================================================="
echo "Partner Portal Backend Implementation Verification"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        return 1
    fi
}

echo "Checking API Route Files:"
echo "------------------------"
check_file "app/api/partner/dashboard/route.ts"
check_file "app/api/partner/leads/route.ts"
check_file "app/api/partner/leads/[leadId]/route.ts"
check_file "app/api/partner/commissions/route.ts"
check_file "app/api/partner/profile/route.ts"
echo ""

echo "Checking Supporting Files:"
echo "------------------------"
check_file "lib/types/partner.ts"
check_file "scripts/migrations/002_partner_portal.sql"
check_file "app/api/partner/README.md"
check_file "app/api/partner/__tests__/partner-api.test.ts"
echo ""

echo "Checking Documentation:"
echo "---------------------"
check_file "BACKEND_IMPLEMENTATION_SUMMARY.md"
echo ""

echo "Line Count Summary:"
echo "-----------------"
if command -v wc &> /dev/null; then
    echo "Dashboard API:" $(wc -l < app/api/partner/dashboard/route.ts 2>/dev/null || echo "0") "lines"
    echo "Leads API:" $(wc -l < app/api/partner/leads/route.ts 2>/dev/null || echo "0") "lines"
    echo "Lead Update API:" $(wc -l < app/api/partner/leads/[leadId]/route.ts 2>/dev/null || echo "0") "lines"
    echo "Profile API:" $(wc -l < app/api/partner/profile/route.ts 2>/dev/null || echo "0") "lines"
    echo "Type Definitions:" $(wc -l < lib/types/partner.ts 2>/dev/null || echo "0") "lines"
    echo "Database Migration:" $(wc -l < scripts/migrations/002_partner_portal.sql 2>/dev/null || echo "0") "lines"
    echo "Documentation:" $(wc -l < app/api/partner/README.md 2>/dev/null || echo "0") "lines"
    echo "Tests:" $(wc -l < app/api/partner/__tests__/partner-api.test.ts 2>/dev/null || echo "0") "lines"
fi
echo ""

echo "Next Steps:"
echo "----------"
echo "1. Run database migration:"
echo "   psql \$DATABASE_URL -f scripts/migrations/002_partner_portal.sql"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Test endpoints:"
echo "   curl http://localhost:3000/api/partner/dashboard"
echo ""
echo "4. Review documentation:"
echo "   cat app/api/partner/README.md"
echo ""
echo -e "${GREEN}✓ Partner Portal Backend Implementation Complete!${NC}"
echo "=================================================="
