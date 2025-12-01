# run-dev.ps1

# Node portable
$NodePortable = "D:\Software\node-v24.11.0-win-x64\node-v24.11.0-win-x64"

# Thêm Node portable vào PATH
$env:PATH = "$NodePortable;$env:PATH"

# Kiểm tra Node version
Write-Host "Using Node version:" (& "$NodePortable\node.exe" -v)

# Chuyển vào thư mục project
$ProjectPath = "D:\quangnv\Code\BASE_PROJECT_FE\blog-fe"
Set-Location $ProjectPath

# Cài dependencies
Write-Host "Running lint..."
& "$NodePortable\npm.cmd" run lint

# Chạy dev server React
Write-Host "Running type-check..."
& "$NodePortable\npm.cmd" run type-check

# Chạy dev server React
Write-Host "Running build..."
& "$NodePortable\npm.cmd" run build
