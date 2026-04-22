# Fix bare root directory links to include index.html for file:// protocol compatibility
# This handles href="../" (Home/Logo links in sub-pages) -> href="../index.html"
$files = Get-ChildItem -Recurse -Filter "*.html" -Path "."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Fix href="../" -> href="../index.html"
    $content = $content -replace 'href="\.\./(?![\w])', 'href="../index.html"'

    # Fix href="./" -> href="./index.html" (for root index.html links from same dir)
    $content = $content -replace 'href="\./(?![\w])', 'href="./index.html"'

    # Prevent double index.html if already fixed
    $content = $content -replace 'href="\.\./index\.html/index\.html"', 'href="../index.html"'
    $content = $content -replace 'href="\./index\.html/index\.html"', 'href="./index.html"'

    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "`nDone fixing root links!"
