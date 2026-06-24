#!/bin/bash
# Script untuk export semua source code dalam format readable

OUTPUT_FILE="ALL_SOURCE_CODE.txt"

echo "========================================" > $OUTPUT_FILE
echo "EXPORT LENGKAP SOURCE CODE APLIKASI" >> $OUTPUT_FILE
echo "Tanggal: $(date)" >> $OUTPUT_FILE
echo "========================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function untuk print file dengan header
print_file() {
    local file=$1
    echo "" >> $OUTPUT_FILE
    echo "================================================" >> $OUTPUT_FILE
    echo "FILE: $file" >> $OUTPUT_FILE
    echo "================================================" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
}

# Package configuration
echo "" >> $OUTPUT_FILE
echo "### KONFIGURASI PACKAGE ###" >> $OUTPUT_FILE
print_file "package.json"
print_file "vite.config.ts"
print_file "postcss.config.mjs"

# Styles
echo "" >> $OUTPUT_FILE
echo "### STYLES ###" >> $OUTPUT_FILE
for file in src/styles/*.css; do
    print_file "$file"
done

# Main App
echo "" >> $OUTPUT_FILE
echo "### MAIN APPLICATION ###" >> $OUTPUT_FILE
print_file "src/app/App.tsx"
print_file "src/app/routes.tsx"

# Contexts
echo "" >> $OUTPUT_FILE
echo "### CONTEXTS ###" >> $OUTPUT_FILE
for file in src/app/context/*.tsx; do
    print_file "$file"
done

# Utils
echo "" >> $OUTPUT_FILE
echo "### UTILITIES ###" >> $OUTPUT_FILE
print_file "src/app/utils/nikValidator.ts"
print_file "src/lib/api.ts"
print_file "src/lib/google-sheets.service.ts"

# Components
echo "" >> $OUTPUT_FILE
echo "### CUSTOM COMPONENTS ###" >> $OUTPUT_FILE
for file in src/app/components/*.tsx; do
    print_file "$file"
done

# Pages
echo "" >> $OUTPUT_FILE
echo "### PAGES ###" >> $OUTPUT_FILE
for file in src/app/pages/*.tsx; do
    print_file "$file"
done

# UI Components
echo "" >> $OUTPUT_FILE
echo "### UI COMPONENTS (shadcn/ui) ###" >> $OUTPUT_FILE
for file in src/app/components/ui/*.tsx src/app/components/ui/*.ts; do
    if [ -f "$file" ]; then
        print_file "$file"
    fi
done

# Backend scripts
echo "" >> $OUTPUT_FILE
echo "### BACKEND SCRIPTS ###" >> $OUTPUT_FILE
if [ -f "google-apps-script-backend.js" ]; then
    print_file "google-apps-script-backend.js"
fi
if [ -f "supabase-setup.sql" ]; then
    print_file "supabase-setup.sql"
fi

echo "" >> $OUTPUT_FILE
echo "========================================" >> $OUTPUT_FILE
echo "EXPORT SELESAI" >> $OUTPUT_FILE
echo "Total file: $(grep -c "^FILE:" $OUTPUT_FILE)" >> $OUTPUT_FILE
echo "========================================" >> $OUTPUT_FILE

echo "✅ Export selesai! File disimpan di: $OUTPUT_FILE"
echo "📊 Ukuran file: $(du -h $OUTPUT_FILE | cut -f1)"
