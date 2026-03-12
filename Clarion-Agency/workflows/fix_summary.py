path = 'C:/Users/beyon/OneDrive/Desktop/CLARION/law-firm-insights-main/Clarion-Agency/workflows/weekly_operations.py'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_label = "        print(f\"  Failed: {', '.join(dept_failed)}\")"
new_label = "        print(f\"Failed list      : {', '.join(dept_failed)}\")"

if old_label in c:
    c = c.replace(old_label, new_label)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print('OK: label fixed')
else:
    print('already correct')
