import swaggerSpec from '../swagger/swagger.js';
const paths = swaggerSpec.paths || {};
const issues = [];
for (const p of Object.keys(paths)) {
  const ops = paths[p];
  for (const method of Object.keys(ops)) {
    const op = ops[method];
    if (p.includes('{') && p.includes('}')) {
      const m = p.match(/\{(.*?)\}/);
      const pathParamName = m ? m[1] : null;
      const hasParam = (op.parameters || []).some(pr => pr.in === 'path' && pr.name === pathParamName);
      if (!hasParam) issues.push(`${method.toUpperCase()} ${p} missing path param '${pathParamName}' in operation parameters`);
    }
    if (['post', 'put', 'patch'].includes(method)) {
      if (!op.requestBody) issues.push(`${method.toUpperCase()} ${p} missing requestBody`);
    }
    if ((['post', 'put', 'delete'].includes(method)) && p.startsWith('/api/') && !p.startsWith('/api/auth')) {
      if (!op.security || op.security.length === 0) issues.push(`${method.toUpperCase()} ${p} might be unprotected (no security array)`);
    }
  }
}
if (issues.length === 0) console.log('No issues found'); else console.log('Issues:\n' + issues.join('\n'));
