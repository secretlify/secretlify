#!/bin/bash

set -e

if [ $# -ne 3 ]; then
    echo "Usage: $0 <encrypted_file> <output_file> <private_key>"
    echo "Example: $0 backup.tar.gz.age backup.tar.gz 'AGE-SECRET-KEY-...'"
    exit 1
fi

ENCRYPTED_FILE="$1"
OUTPUT_FILE="$2"
PRIVATE_KEY="$3"

echo "🔓 Decrypting backup file with age..."
echo "📁 Input: $ENCRYPTED_FILE"
echo "📁 Output: $OUTPUT_FILE"

# Create a temporary file for the private key
KEY_FILE=$(mktemp)
echo -n "$PRIVATE_KEY" > "$KEY_FILE"
trap 'rm -f "$KEY_FILE"' EXIT

age -d -i "$KEY_FILE" -o "$OUTPUT_FILE" "$ENCRYPTED_FILE"

echo "✅ Backup decrypted successfully"
echo "📊 Encrypted size: $(stat -c%s "$ENCRYPTED_FILE" 2>/dev/null || stat -f%z "$ENCRYPTED_FILE") bytes"
echo "📊 Decrypted size: $(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE") bytes" 