@IF EXIST "%~dp0\node.exe" (
"%~dp0\node.exe" "%~dp0\.\node_modules\slnode\bin\slnode" %*
) ELSE (
  node "%~dp0\.\node_modules\slnode\bin\slnode" %*
)
