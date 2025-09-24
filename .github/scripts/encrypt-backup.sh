#!/bin/bash

set -e

if [ $# -ne 3 ]; then
    echo "Usage: $0 <input_file> <output_file> <encryption_key>"
    echo "Example: $0 backup.tar.gz backup.tar.gz.age \$ENCRYPTION_KEY"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"
ENCRYPTION_KEY="$3"

echo "🔐 Encrypting backup file with age..."
echo "📁 Input: $INPUT_FILE"
echo "📁 Output: $OUTPUT_FILE"

AGE_PASSPHRASE="$ENCRYPTION_KEY" age -p -o "$OUTPUT_FILE" "$INPUT_FILE"

echo "✅ Backup encrypted successfully"
echo "📊 Original size: $(stat -c%s "$INPUT_FILE" 2>/dev/null || stat -f%z "$INPUT_FILE") bytes"
echo "📊 Encrypted size: $(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE") bytes" 