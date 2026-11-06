"""Apply or restore the compact QQNT Toolbox reaction patch (Python stdlib only)."""
import argparse,json,shutil
from pathlib import Path

FILES=('reaction-limit.js','reaction-catalog.js','reaction-toggle.js')

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plugin',type=Path,help='Existing QQNT-Toolbox plugin directory')
    parser.add_argument('--restore',action='store_true',help='Restore files saved before this patch')
    args=parser.parse_args()
    root=args.plugin.resolve()
    manifest=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
    if manifest.get('slug')!='qqnt_toolbox' or manifest.get('version')!='0.10.12':
        raise SystemExit('This patch supports QQNT Toolbox 0.10.12. No files changed.')
    src=root/'src'
    backup=root/'.hidden-reactions-backup'
    if args.restore:
        saved=json.loads((backup/'files.json').read_text(encoding='utf-8'))
        for name in saved:
            shutil.copy2(backup/name,src/name)
        print('Restored the previous plugin files. Fully quit QQ and reopen it.')
        return
    # Validate everything before writing to the installed plugin.
    source=Path(__file__).resolve().parent
    for name in FILES:
        if not (source/name).is_file():raise SystemExit('Missing release source: '+name)
    renderer=(src/'renderer.js').read_text(encoding='utf-8')
    old="""                    if (result && result.ok === false) {
                        throw new Error(result.reason || 'Reaction failed.');
                    }"""
    new="""                    if (result?.ok !== true) {
                        throw new Error(result?.reason || 'Reaction result was not confirmed.');
                    }
                    return result;"""
    if old in renderer:renderer=renderer.replace(old,new,1)
    if 'Reaction result was not confirmed.' not in renderer:
        raise SystemExit('Unexpected reaction bridge. No files changed.')
    backup.mkdir(exist_ok=True)
    if not (backup/'files.json').exists():
        saved=[]
        for name in (*FILES,'renderer.js'):
            if (src/name).exists():
                shutil.copy2(src/name,backup/name)
                saved.append(name)
        (backup/'files.json').write_text(json.dumps(saved),encoding='utf-8')
    try:
        for name in FILES:shutil.copy2(source/name,src/name)
        (src/'renderer.js').write_text(renderer,encoding='utf-8')
    except Exception:
        for name in json.loads((backup/'files.json').read_text(encoding='utf-8')):
            shutil.copy2(backup/name,src/name)
        raise
    print('Installed. Enable Remove reaction limit in Toolbox, then fully quit QQ and reopen it.')

if __name__=='__main__':main()
