# Fix the double-quote issue caused by previous fix_root_links.ps1
# Changes href="../index.html"" -> href="../index.html"
$files = Get-ChildItem -Recurse -Filter "*.html" -Path "."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Remove double quotes introduced by previous run
    $content = $content -replace 'href="(\.\./index\.html)""', 'href="$1"'
    $content = $content -replace 'href="(\./index\.html)""', 'href="$1"'

    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Fixed quotes: $($file.FullName)"
    }
}

Write-Host "`nDone fixing double quotes!"
