#!/bin/bash

# Supabase URL
echo "https://jnfpxvodlmfukpagozcw.supabase.co" | npx wrangler pages secret put SUPABASE_URL --project-name thaytam-phongthuy-v2

# Get secrets from .dev.vars if exists
if [ -f .dev.vars ]; then
  echo "📝 Found .dev.vars file"
  cat .dev.vars
fi

echo ""
echo "✅ Next: Add these secrets manually:"
echo "1. SUPABASE_SERVICE_KEY"
echo "2. SUPABASE_JWT_SECRET" 
echo "3. GEMINI_API_KEY"
