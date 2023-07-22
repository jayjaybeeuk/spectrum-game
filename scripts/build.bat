for %%f in (games\*.bas) do (
  echo Building %%f
  python libs\zxbasic\zxbc.py "%%f" -o "public\games\%%~nf.tap" --tap --BASIC --autorun
)
