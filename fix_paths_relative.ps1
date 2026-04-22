$baseDir = "c:\Users\wajid ali\Desktop\gradecalculatorhub"

# Get all HTML files in subdirectories
$subDirFiles = Get-ChildItem -Path $baseDir -Recurse -Filter *.html | Where-Object { $_.DirectoryName -ne $baseDir }

foreach ($file in $subDirFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # CSS and JS exact replacements
    $content = $content -replace 'href="/assets/', 'href="../assets/'
    $content = $content -replace 'href="assets/', 'href="../assets/'
    $content = $content -replace 'href="./assets/', 'href="../assets/'
    
    $content = $content -replace 'src="/assets/', 'src="../assets/'
    $content = $content -replace 'src="assets/', 'src="../assets/'
    $content = $content -replace 'src="./assets/', 'src="../assets/'
    
    # Internal link replacements to avoid absolute paths
    $content = $content -replace 'href="/([^/"]+)/"', 'href="../$1/"'
    
    # Prefix un-prefixed folder links (e.g. gpa-calculator/ -> ../gpa-calculator/)
    # (?!http|mailto|\.\./|\./|#|javascript) matches if it does NOT start with these
    $content = $content -replace 'href="(?!(http|mailto|\.\./|\./|#|javascript))([^/"]+)/"', 'href="../$2/"'
    
    # Root path
    $content = $content -replace 'href="/"', 'href="../"'
    
    Set-Content -Path $file.FullName -Value $content
}

# Root files (index.html)
$rootFiles = Get-ChildItem -Path $baseDir -Filter *.html | Where-Object { $_.DirectoryName -eq $baseDir }

foreach ($file in $rootFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    $content = $content -replace 'href="/assets/', 'href="./assets/'
    $content = $content -replace 'href="assets/', 'href="./assets/'
    
    $content = $content -replace 'src="/assets/', 'src="./assets/'
    $content = $content -replace 'src="assets/', 'src="./assets/'
    
    $content = $content -replace 'href="/([^/"]+)/"', 'href="./$1/"'
    $content = $content -replace 'href="(?!(http|mailto|\.\./|\./|#|javascript))([^/"]+)/"', 'href="./$2/"'
    
    $content = $content -replace 'href="/"', 'href="./"'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Paths updated successfully for all HTML files."
