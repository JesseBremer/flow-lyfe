#!/bin/bash
# Kill all Next.js dev servers
pkill -f "next dev" 2>/dev/null || true
sleep 1
# Clear cache
rm -rf .next
# Start fresh
npm run dev
