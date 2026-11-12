#!/usr/bin/env python3
"""Run before every commit: stamps a new version into version.js, version.json and sw.js,
and regenerates English Content.md from content.js."""
import json, re, subprocess, datetime, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
n = int(subprocess.check_output(['git', '-C', root, 'rev-list', '--count', 'HEAD']).decode()) + 1
now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None) + datetime.timedelta(hours=7)
v = 'v%d' % n
built = now.strftime('%d %b %Y, %H:%M')
open(os.path.join(root, 'version.js'), 'w').write("window.APP_VERSION = %s;\n" % json.dumps({'version': v, 'built': built}))
open(os.path.join(root, 'version.json'), 'w').write(json.dumps({'version': v, 'built': built}) + '\n')
p = os.path.join(root, 'sw.js'); s = open(p, encoding='utf-8').read()
s = re.sub(r"var CACHE = '[^']*';", "var CACHE = 'portfolio-%s';" % v, s)
open(p, 'w', encoding='utf-8').write(s)
print(v, built)
try:
    print(subprocess.check_output(['node', os.path.join(root, 'tools', 'content_md.js')]).decode().strip())
except Exception as e:
    print('WARNING: English Content.md NOT regenerated:', e)
