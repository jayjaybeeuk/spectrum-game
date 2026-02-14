#!/bin/bash

for input_file in /input/*.{tzx,tap}; do
  if [ -f "$input_file" ]; then
    filename=$(basename "$input_file")
    output_file="/output/${filename%.*}.sna"
    
    echo "Converting $filename..."
    
    case "$input_file" in
      *.tzx)
        tzx2sna "$input_file" "$output_file"
        ;;
      *.tap)
        tap2sna "$input_file" "$output_file"
        ;;
    esac

    if [ -f "$output_file" ]; then
      echo "Created ${filename%.*}.sna"
    else
      echo "Failed to convert $filename"
    fi
  done
done

echo "Conversion complete!"