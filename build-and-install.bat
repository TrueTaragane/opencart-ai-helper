@echo off
echo Building and installing OpenCart AI Helper...
echo.
echo Step 1: Installing dependencies...
call npm install
echo.
echo Step 2: Compiling...
call npm run compile
echo.
echo Step 3: Creating VSIX package...
call npx vsce package
echo.
echo Step 4: Installation instructions
echo.
echo Please follow these steps to install the extension:
echo 1. Open VS Code
echo 2. Go to Extensions view (Ctrl+Shift+X)
echo 3. Click on "..." in the top-right corner
echo 4. Select "Install from VSIX..."
echo 5. Navigate to %CD%\opencart-ai-helper-1.0.0.vsix
echo 6. Select the file and click "Install"
echo 7. Restart VS Code
echo.
echo The OpenCart AI Helper icon should now appear in the Activity Bar (left column)
echo.
pause
