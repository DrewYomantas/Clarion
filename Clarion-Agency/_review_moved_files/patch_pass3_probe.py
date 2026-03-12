"""
Pass 3 patch — targeted replacement of POST block in upload() and _ingest_rows_into_report.
"""
import sys

path = r'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\backend\app.py'
with open(path, 'rb') as f:
    src = f.read()

CRLF = b'\r\n'

# -----------------------------------------------------------------------
# Show the GET preamble so we know exactly where the POST block starts
# -----------------------------------------------------------------------
upload_def = b'def upload():'
def_pos = src.find(upload_def)
post_marker = b"    if request.method == 'POST':" + CRLF
post_pos = src.find(post_marker, def_pos)
get_end_marker = b'    # Legacy GET /upload -> SPA handoff' + CRLF
get_end_pos = src.find(get_end_marker, post_pos)
get_return = src[get_end_pos : src.find(CRLF, get_end_pos + 1) + 2]  # the return line + CRLF

# dump preamble for verification
print("=== GET PREAMBLE (def..POST block) ===")
sys.stdout.buffer.write(src[def_pos:post_pos])
print()
print("=== GET RETURN LINE ===")
sys.stdout.buffer.write(get_return)
print()

# The exact POST block (from the if-POST marker through to just before the GET comment)
post_block_old = src[post_pos:get_end_pos]
print(f"POST block length: {len(post_block_old)} bytes")
sys.stdout.buffer.write(b'FIRST 200: ' + post_block_old[:200] + b'\n')
sys.stdout.buffer.write(b'LAST  200: ' + post_block_old[-200:] + b'\n')
