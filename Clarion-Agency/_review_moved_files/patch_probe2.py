import sys
path = r'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\backend\app.py'
with open(path,'rb') as f: src=f.read()
CRLF=b'\r\n'

# Exact bytes at byte 415989
chunk = src[415989:415989+500]
sys.stdout.buffer.write(chunk)
