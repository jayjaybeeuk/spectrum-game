#!/bin/bash
#
# Convert ZX Spectrum tape images (.tzx / .tap) to snapshots (.sna).
#
# Usage:
#   convert [-o OUTPUT_DIR] [FILE...]
#
# With no FILE arguments, every *.tzx and *.tap in the current directory is
# converted. Output .sna files are written next to their input unless
# -o OUTPUT_DIR is given.
#
# In the docker-compose setup ./public/games is mounted at /games (the working
# directory), so from the host:
#   docker compose run --rm spectrum convert              # convert everything
#   docker compose run --rm spectrum convert snake.tap    # convert one file
#
# Exits non-zero if no input files were found or any conversion failed.

set -u

usage() {
  sed -n '3,/^$/{s/^# \{0,1\}//;p;}' "$0"
}

output_dir=""
while getopts ":o:h" opt; do
  case "$opt" in
    o) output_dir="$OPTARG" ;;
    h) usage; exit 0 ;;
    \?) echo "Unknown option: -$OPTARG" >&2; usage >&2; exit 2 ;;
    :) echo "Option -$OPTARG requires an argument" >&2; exit 2 ;;
  esac
done
shift $((OPTIND - 1))

if [ $# -gt 0 ]; then
  inputs=("$@")
else
  shopt -s nullglob
  inputs=(*.tzx *.tap)
  shopt -u nullglob
fi

if [ ${#inputs[@]} -eq 0 ]; then
  echo "No .tzx or .tap files found in $(pwd)" >&2
  exit 1
fi

if [ -n "$output_dir" ] && ! mkdir -p "$output_dir"; then
  echo "Cannot create output directory: $output_dir" >&2
  exit 1
fi

converted=0
failed=0

for input_file in "${inputs[@]}"; do
  if [ ! -f "$input_file" ]; then
    echo "Skipping $input_file: not a file" >&2
    failed=$((failed + 1))
    continue
  fi

  filename=$(basename "$input_file")
  dir=${output_dir:-$(dirname "$input_file")}
  output_file="$dir/${filename%.*}.sna"

  case "$input_file" in
    *.tzx) converter=tzx2sna ;;
    *.tap) converter=tap2sna ;;
    *)
      echo "Skipping $filename: not a .tzx or .tap file" >&2
      failed=$((failed + 1))
      continue
      ;;
  esac

  echo "Converting $filename..."
  "$converter" "$input_file" "$output_file"

  if [ -f "$output_file" ]; then
    echo "Created $output_file"
    converted=$((converted + 1))
  else
    echo "Failed to convert $filename" >&2
    failed=$((failed + 1))
  fi
done

echo "Conversion complete: $converted converted, $failed failed."
[ "$failed" -eq 0 ]
