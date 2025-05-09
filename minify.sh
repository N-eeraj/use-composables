for file in dist/**.{js,mjs}; do
  terser "$file" --compress --mangle --output "${file}"
done
