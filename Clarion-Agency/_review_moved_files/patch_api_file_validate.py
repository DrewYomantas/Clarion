import sys
path = r'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\backend\app.py'
with open(path,'rb') as f: src=f.read()
CRLF=b'\r\n'

# Replace the 4-block file validation in api_upload with _validate_csv_file
OLD=(
    b'    access_type = get_report_access_type(current_user.id)' + CRLF +
    CRLF + CRLF + CRLF +
    b'    file = request.files.get(\'file\')' + CRLF +
    b'    if not file:' + CRLF +
    b"        return jsonify({'error': 'No file provided'}), 400" + CRLF +
    CRLF +
    b"    if file.filename == '':" + CRLF +
    b"        return jsonify({'success': False, 'error': 'No file selected.'}), 400" + CRLF +
    CRLF +
    b"    if (file.mimetype or '').lower() not in ALLOWED_CSV_MIME_TYPES:" + CRLF +
    b"        return jsonify({'error': 'Invalid file type. Please upload a CSV file.'}), 400" + CRLF +
    CRLF +
    b"    if not file.filename.lower().endswith('.csv'):" + CRLF +
    b"        return jsonify({'success': False, 'error': 'Unsupported file type. Please upload a .csv file.'}), 400"
)
NEW=(
    b'    access_type = get_report_access_type(current_user.id)' + CRLF +
    CRLF +
    b"    file = request.files.get('file')" + CRLF +
    b'    file_error = _validate_csv_file(file)' + CRLF +
    b'    if file_error:' + CRLF +
    b"        return jsonify({'success': False, 'error': file_error}), 400"
)
if OLD not in src:
    print('OLD NOT FOUND')
    idx=src.find(b'access_type = get_report_access_type(current_user.id)')
    hits=[]
    s=0
    while True:
        i=src.find(b'access_type = get_report_access_type(current_user.id)',s)
        if i<0:break
        hits.append(i); s=i+1
    print(f'{len(hits)} hits: {hits}')
    # dump around the api_upload one (largest byte pos near api_upload)
    for h in hits:
        sys.stdout.buffer.write(b'--- at '+str(h).encode()+b' ---\n')
        sys.stdout.buffer.write(src[h:h+400]+b'\n')
    sys.exit(1)
src=src.replace(OLD,NEW,1)
print('OK')
with open(path,'wb') as f: f.write(src)
print('written')
