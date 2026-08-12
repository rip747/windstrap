<#
.SYNOPSIS
  Runs WindStrap build commands in Docker — no Node.js/npm install needed.

.DESCRIPTION
  Wraps the docker compose services defined in compose.yaml. The first run
  builds the image automatically (this installs node_modules inside the
  container). Generated files (dist/, docs/) are written to your project folder.

.EXAMPLE
  .\windstrap.ps1              # same as build:all
  .\windstrap.ps1 build        # npm run build  -> dist/windstrap.css
  .\windstrap.ps1 docs         # npm run docs   -> docs/ pages
  .\windstrap.ps1 generate     # npm run generate
  .\windstrap.ps1 watch        # watch mode (foreground; Ctrl+C to stop)
  .\windstrap.ps1 shell        # open a shell inside the container
#>
param(
  [Parameter(Position = 0)]
  [ValidateSet('build', 'docs', 'build:all', 'generate', 'watch', 'shell')]
  [string]$Command = 'build:all'
)

switch ($Command) {
  'watch' { docker compose up watch }
  'shell' { docker compose run --rm --entrypoint sh windstrap }
  default { docker compose run --rm windstrap npm run $Command }
}
