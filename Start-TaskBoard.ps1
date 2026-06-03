$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend\TaskBoard.Api'
$frontend = Join-Path $root 'frontend\taskboard-ui'

Write-Host 'Starting TaskBoard API on http://localhost:5013...'
Start-Process -FilePath 'dotnet' -ArgumentList 'run', '--project', 'backend\TaskBoard.Api\TaskBoard.Api.csproj' -WorkingDirectory $root -WindowStyle Hidden

Write-Host 'Starting TaskBoard UI on http://localhost:4200...'
Start-Process -FilePath 'npm.cmd' -ArgumentList 'start', '--', '--host', '127.0.0.1', '--port', '4200' -WorkingDirectory $frontend -WindowStyle Hidden

Write-Host ''
Write-Host 'Both processes were started in the background.'
Write-Host 'Open http://localhost:4200 for the UI.'
Write-Host 'The API is available at http://localhost:5013.'
