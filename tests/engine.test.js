import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios} from '../src/scenarios.js';
import {createSession,inspect,act,evaluate,report,restore} from '../src/engine.js';
const paths={
'cyber-session':['A1','A2'],'cyber-ransom':['A1','A2','A3'],'cyber-backup':['A1','A2','A3'],'cyber-secret':['A1','A2','A3','A4'],'cyber-waf':['A1','A4','A5'],'cyber-storage':['A1','A4'],'cyber-scan':['A1','A2'],'cyber-mfa':['A1','A2','A3'],
'net-dns':['A1'],'net-dhcp':['A1'],'ot-conduit':['A1'],'ot-write':['A1'],
'cyber-egress':['A1','A3'],'cyber-tls':['A1'],
'cti-shared':['A1','A3'],'cti-expiry':['A1','A4'],
'dw-claim':['A1','A3','A5'],'dw-clone':['A1','A3'],
'dn-tor':['A1','A3'],'dn-i2p':['A1','A3','A4']};
function readAll(s,state){return s.evidence.reduce((a,e)=>inspect(s,a,e.id),state);}
test('catalog has twenty unique cases, ten cyber labs and valid references',()=>{
assert.equal(scenarios.length,20);assert.equal(new Set(scenarios.map(s=>s.id)).size,20);
for(const track of new Set(scenarios.map(s=>s.track)))assert.equal(scenarios.filter(s=>s.track===track).length,track==='Cyber'?10:2);
for(const s of scenarios){assert.equal(new Set(s.actions.map(a=>a.id)).size,s.actions.length);for(const c of s.checks)assert.ok(c.key in s.initial);for(const r of s.references)assert.equal(new URL(r).protocol,'https:');for(const a of s.actions)for(const k of Object.keys(a.effect))assert.ok(k in s.initial);}
});
for(const s of scenarios){
test(`${s.id}: initial failure, valid remediation, evidence gate, deterministic replay`,()=>{
const original=createSession(s);assert.equal(evaluate(s,original).passed,false);
let fixed=paths[s.id].reduce((a,id)=>act(s,a,id),original);
assert.equal(evaluate(s,fixed).passed,false,'actions alone cannot satisfy evidence gate');
fixed=readAll(s,fixed);assert.equal(evaluate(s,fixed).passed,true);
assert.deepEqual(original,createSession(s),'transitions do not mutate input');
assert.deepEqual(restore(s,JSON.parse(JSON.stringify(fixed))),fixed);
const forged={...fixed,state:{},assessment:{passed:false}};assert.deepEqual(restore(s,forged).state,fixed.state);
const exported=report(s,fixed);assert.equal(exported.synthetic,true);assert.equal(exported.evidence.length,3);assert.equal(exported.assessment.passed,true);
});}
test('restoring functional connectivity is insufficient when segmentation is removed',()=>{const s=scenarios[0];let v=readAll(s,act(s,createSession(s),'A2'));assert.equal(evaluate(s,v).passed,false);assert.ok(evaluate(s,v).checks.some(c=>c.label==='Resolução DNS responde'&&c.pass));v=act(s,act(s,v,'A3'),'A1');assert.equal(evaluate(s,v).passed,true);});
test('OT blanket block and PLC restart violate availability constraints',()=>{for(const [id,action] of [['ot-write','A2'],['ot-conduit','A3']]){const s=scenarios.find(s=>s.id===id);const state=readAll(s,act(s,createSession(s),action));assert.equal(evaluate(s,state).passed,false);}});
test('unsupported attribution remains wrong even with all evidence read',()=>{const s=scenarios.find(s=>s.id==='cti-shared');let v=readAll(s,createSession(s));v=act(s,act(s,v,'A2'),'A4');assert.equal(evaluate(s,v).passed,false);});
test('reading same evidence twice does not inflate journal or grade',()=>{const s=scenarios[0];let a=inspect(s,createSession(s),'E1');assert.deepEqual(inspect(s,a,'E1'),a);});
test('reject unknown actions, evidence, mismatched versions and stored events',()=>{const s=scenarios[0],v=createSession(s);assert.throws(()=>act(s,v,'bad'));assert.throws(()=>inspect(s,v,'bad'));assert.throws(()=>restore(s,{...v,version:99}));assert.throws(()=>restore(s,{...v,journal:[{type:'admin'}]}));});

test('recovery and credential rotation reject skipped prerequisites',()=>{for(const id of ['cyber-backup','cyber-secret']){const s=scenarios.find(s=>s.id===id),v=createSession(s);assert.throws(()=>act(s,v,'A2'));assert.throws(()=>act(s,v,'A3'));assert.equal(v.tick,0);}});
test('WAF tests cannot pass while protection is disabled',()=>{const s=scenarios.find(s=>s.id==='cyber-waf');let v=act(s,act(s,createSession(s),'A1'),'A2');assert.throws(()=>act(s,v,'A4'));assert.throws(()=>act(s,v,'A5'));assert.equal(evaluate(s,v).passed,false);});
