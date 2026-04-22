Add-Type -AssemblyName System.IO.Compression.FileSystem

$source = 'C:\Users\wajid ali\Desktop\gradecalculatorhub'
$dest   = 'C:\Users\wajid ali\Desktop\gradecalculatorhub_hostinger.zip'

# Remove old zip if it exists
if (Test-Path $dest) {
    Remove-Item $dest -Force
    Write-Host "Removed old ZIP."
}

# Create new zip
$zip = [System.IO.Compression.ZipFile]::Open($dest, 'Create')

# Folders/files to exclude from the zip (keep .htaccess — it's needed on server!)
$excludeNames = @('.git', 'create_zip.ps1', 'fix_links.ps1', 'fix_quotes.ps1', 'fix_root_links.ps1', 'fix_paths_relative.ps1', 'fix_for_hostinger.ps1')

function Add-FolderToZip {
    param(
        [System.IO.Compression.ZipArchive]$zipArchive,
        [string]$folderPath,
        [string]$entryPrefix
    )
    Get-ChildItem -Path $folderPath | ForEach-Object {
        $item = $_
        if ($item.PSIsContainer) {
            Add-FolderToZip -zipArchive $zipArchive -folderPath $item.FullName -entryPrefix ($entryPrefix + $item.Name + '/')
        } else {
            $entryName = $entryPrefix + $item.Name
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArchive, $item.FullName, $entryName, 'Optimal') | Out-Null
        }
    }
}

Get-ChildItem -Path $source | Where-Object { $excludeNames -notcontains $_.Name } | ForEach-Object {
    $item = $_
    if ($item.PSIsContainer) {
        Add-FolderToZip -zipArchive $zip -folderPath $item.FullName -entryPrefix ($item.Name + '/')
    } else {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $item.FullName, $item.Name, 'Optimal') | Out-Null
        Write-Host "Added: $($item.Name)"
    }
}

$zip.Dispose()

$sizeMB = [math]::Round((Get-Item $dest).Length / 1MB, 2)
Write-Host ""
Write-Host "ZIP created successfully!"
Write-Host "Location: $dest"
Write-Host "Size: $sizeMB MB"
