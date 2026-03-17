import re

with open('qml/main.qml', 'r') as f:
    content = f.read()

# Remove dpr logic
content = re.sub(r'\s*var dpr = Screen\.devicePixelRatio \|\| 1;\n', '\n', content)
content = re.sub(r'\s*ctx\.resetTransform\(\);\n', '\n', content)
content = re.sub(r'\s*ctx\.scale\(dpr, dpr\);\n', '\n', content)

with open('qml/main.qml', 'w') as f:
    f.write(content)
