const {spawnSync}=require('node:child_process');
const result=spawnSync(process.env.PYTHON || (process.platform==='win32'?'python':'python3'),['scripts/check_site.py'],{stdio:'inherit'});
if(result.error)console.error(result.error.message);
process.exit(result.status ?? 1);
