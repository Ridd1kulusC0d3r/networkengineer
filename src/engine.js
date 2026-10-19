// Pure, deterministic state transitions. No sockets, protocol emulation or external requests.
export function createSession(scenario) {
  return {scenarioId:scenario.id,version:scenario.version,state:structuredClone(scenario.initial),inspected:[],journal:[],note:'',tick:0};
}
function assertSession(scenario,session) {
  if(session.scenarioId!==scenario.id||session.version!==scenario.version) throw new Error('Sessão incompatível com o cenário.');
}
export function inspect(scenario,session,id) {
  assertSession(scenario,session);
  if(!scenario.evidence.some(e=>e.id===id)) throw new Error('Evidência desconhecida.');
  const next=structuredClone(session);
  if(!next.inspected.includes(id)) {
    next.inspected.push(id);next.tick++;
    next.journal.push({tick:next.tick,type:'evidence',id,message:`Evidência ${id} inspecionada`});
  }
  return next;
}
export function act(scenario,session,id) {
  assertSession(scenario,session);
  const action=scenario.actions.find(a=>a.id===id);
  if(!action) throw new Error('Ação desconhecida.');
  const next=structuredClone(session);next.tick++;
  next.state={...next.state,...action.effect};
  next.journal.push({tick:next.tick,type:'action',id,message:action.feedback,state:structuredClone(next.state)});
  return next;
}
export function evaluate(scenario,session) {
  assertSession(scenario,session);
  const checks=scenario.checks.map(c=>({label:c.label,pass:session.state[c.key]===c.equals}));
  checks.push({label:'Todas as evidências inspecionadas',pass:scenario.evidence.every(e=>session.inspected.includes(e.id))});
  return {checks,passed:checks.every(c=>c.pass),score:Math.round(100*checks.filter(c=>c.pass).length/checks.length)};
}
export function report(scenario,session) {
  return {format:'networkengineer-report',schemaVersion:1,synthetic:true,model:'rule-based',scenario:{id:scenario.id,version:scenario.version,title:scenario.title,track:scenario.track},...structuredClone(session),assessment:evaluate(scenario,session),evidence:scenario.evidence.filter(e=>session.inspected.includes(e.id)),references:scenario.references,noteAssessment:'Texto livre não é avaliado automaticamente.'};
}
// Stored states are reconstructed from validated events; never trust saved verdicts or state.
export function restore(scenario,value) {
  assertSession(scenario,value);
  if(!Array.isArray(value.journal)||value.journal.length>5000) throw new Error('Histórico inválido.');
  let session=createSession(scenario);
  for(const event of value.journal) {
    if(event.type==='action') session=act(scenario,session,event.id);
    else if(event.type==='evidence') session=inspect(scenario,session,event.id);
    else throw new Error('Evento inválido.');
  }
  session.note=typeof value.note==='string'?value.note.slice(0,8000):'';
  return session;
}
