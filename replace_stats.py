import os

nav_path = "/Users/mac142/Desktop/blog/index.html"
js_path = "/Users/mac142/Desktop/blog/js_stats_final.js"

with open(nav_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open(js_path, 'r', encoding='utf-8') as f:
    new_js = f.read()

# Replace the stats logic
# Starts around line 3101 with // 访客数据模拟
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "  // 访客数据模拟" in line:
        start_idx = i
        break

if start_idx != -1:
    # Look for closing })();
    # It is before </script> which is before <script> // 轮播图逻辑
    for i in range(start_idx, len(lines)):
        if "</script>" in lines[i]:
            # The })(); is likely the line before or close to it
            # Actually we can just replace until the </script> line
            end_idx = i
            break

if start_idx != -1 and end_idx != -1:
    print(f"Found stats block: {start_idx+1} to {end_idx+1}")
    
    # Remove the old block, insert new_js
    # Note: new_js does not have <script> tags, so we insert it inside the script tag?
    # Wait, lines[start_idx] is inside the <script> block?
    # Let's check context.
    # Line 3165 is </script>
    # Line 3101 is inside <script> ?
    # Let's check file content again.
    # Yes, line 3101 is `  // 访客数据模拟...`
    # The closing `})();` is at 3164.
    # The closing `</script>` is at 3165.
    
    # So we replace from start_idx to end_idx-1 (inclusive) with new_js
    
    new_lines = lines[:start_idx] + [new_js + "\n"] + lines[end_idx:]
    
    with open(nav_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Success")
else:
    print(f"Block not found. Start: {start_idx}, End: {end_idx}")

