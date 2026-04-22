# Fix directory links to include index.html for file:// protocol compatibility
$files = Get-ChildItem -Recurse -Filter "*.html" -Path "."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Replace href="../dir/" with href="../dir/index.html"
    $content = $content -replace 'href="(\.\./[^"]*?/)"', 'href="$1index.html"'

    # Replace href="./dir/" with href="./dir/index.html"
    $content = $content -replace 'href="(\./[^"]*?/)"', 'href="$1index.html"'

    # Replace bare href="../" (root home links) with href="../index.html"
    # But skip canonical/external links and already-fixed ones
    $content = $content -replace 'href="\.\./index\.html/index\.html"', 'href="../index.html"'

    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "`nDone!"
