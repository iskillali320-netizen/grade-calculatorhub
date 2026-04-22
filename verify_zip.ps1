Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = 'C:\Users\wajid ali\Desktop\gradecalculatorhub_hostinger.zip'
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$entries = $zip.Entries | Select-Object -ExpandProperty FullName | Sort-Object
$topLevel = $entries | ForEach-Object { ($_ -split '/')[0] } | Select-Object -Unique
Write-Host '=== Top-level items in ZIP ==='
foreach ($item in $topLevel) {
    Write-Host "  $item"
}
Write-Host ""
Write-Host "Total files: $($entries.Count)"
$zip.Dispose()
