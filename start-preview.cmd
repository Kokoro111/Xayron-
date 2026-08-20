@echo off
cd /d "%~dp0"
echo Starting Xayron portfolio preview at http://127.0.0.1:5173/
set "NODE_EXE=C:\Users\18519\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" (
  echo Node runtime was not found. Please reopen this project in Codex and try again.
  pause
  exit /b 1
)
"%NODE_EXE%" "%~dp0node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173
pause
