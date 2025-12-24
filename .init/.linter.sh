#!/bin/bash
cd /home/kavia/workspace/code-generation/unified-login-interface-17708/login_page_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

