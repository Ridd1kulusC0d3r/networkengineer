import {scenarios} from '../src/scenarios.js';
import {writeFileSync} from 'node:fs';
let out=`# Catálogo de cenários\n\n${scenarios.length} casos executáveis por regras, todos sintéticos. Cyber contém ${scenarios.filter(s=>s.track==='Cyber').length} casos.\n\n`;
for(const s of scenarios)out+=`## ${s.id} — ${s.title}\n\n- Trilha: ${s.track}; modelo ${s.kind}; versão ${s.version}.\n- Objetivo: ${s.objective}\n- Contexto: ${s.brief}\n- Evidências: ${s.evidence.map(e=>e.source).join(', ')}.\n- Avaliação: ${s.checks.map(c=>c.label).join('; ')}; inspecionar todas as evidências.\n- Limite: ${s.explanation}\n- Referência: ${s.references.join(', ')}\n\n`;
writeFileSync('docs/SCENARIOS.md',out);
