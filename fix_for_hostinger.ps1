# Fix all HTML files to use absolute asset paths for Hostinger server
# Changes relative paths (../assets/ and ./assets/) to absolute (/assets/)
# Also fixes internal nav links to use clean URLs (no index.html suffix)

$files = Get-ChildItem -Recurse -Filter "*.html" -Path "."

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # ── Asset path fixes (CSS, JS, images) ──

    # ../assets/ -> /assets/  (sub-page relative)
    $content = $content -replace 'href="\.\./assets/', 'href="/assets/'
    $content = $content -replace 'src="\.\./assets/', 'src="/assets/'

    # ./assets/ -> /assets/  (root page relative)
    $content = $content -replace 'href="\./assets/', 'href="/assets/'
    $content = $content -replace 'src="\./assets/', 'src="/assets/'

    # ── Internal nav links: keep index.html for local, but add absolute nav links ──
    # Convert ../page/index.html -> /page/  (clean URL for server)
    $content = $content -replace 'href="\.\./([^"]+)/index\.html"', 'href="/$1/"'

    # Convert ./page/index.html -> /page/  (root page links)
    $content = $content -replace 'href="\./([^"]+)/index\.html"', 'href="/$1/"'

    # Convert ../index.html -> /  (home link from sub-pages)
    $content = $content -replace 'href="\.\./index\.html"', 'href="/"'

    # Convert ./index.html -> /  (home link from root page)
    $content = $content -replace 'href="\./index\.html"', 'href="/"'

    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host ""
Write-Host "Done! All paths converted to absolute for Hostinger."
