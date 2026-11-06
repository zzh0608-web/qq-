import assert from 'node:assert/strict';
import {createReactionToggle} from './reaction-toggle.js';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';

{
 const toggle=createReactionToggle(),calls=[];
 const send=async value=>{calls.push(value);return {ok:true};};
 await toggle.run('group:1:msg:1:999',false,send);
 await toggle.run('group:1:msg:1:999',false,send);
 await toggle.run('group:1:msg:1:999',false,send);
 await toggle.run('group:1:msg:2:999',false,send);
 assert.deepEqual(calls,[true,false,true,true]);
 console.log('PASS: repeated add/cancel/add, independent messages');
}
{
 const toggle=createReactionToggle(),calls=[];
 await assert.rejects(toggle.run('msg:999',false,async value=>{calls.push(value);throw new Error('offline');}));
 await toggle.run('msg:999',false,async value=>{calls.push(value);return {ok:true};});
 assert.deepEqual(calls,[true,true]);
 console.log('PASS: failed request can be retried without corrupting state');
}
{
 const toggle=createReactionToggle();let done;
 const first=toggle.run('msg:999',false,()=>new Promise(resolve=>{done=resolve;}));
 let duplicate=false;
 assert.deepEqual(await toggle.run('msg:999',false,async()=>{duplicate=true;return {ok:true};}),{skipped:true});
 done({ok:true});await first;assert.equal(duplicate,false);
 console.log('PASS: overlapping requests are suppressed, later clicks remain available');
}
{
 const require=createRequire(import.meta.url),module={exports:{}};
 vm.runInNewContext(fs.readFileSync(new URL('reaction-catalog.js',import.meta.url),'utf8'),{require,module,exports:module.exports});
 const catalog=module.exports.loadReactionEmojiCatalog([]);
 assert.equal(catalog.length,1);assert.equal(catalog[0].id,'999');
 const request=module.exports.normalizeReactionRequest({peer:{chatType:2,peerUid:'test'},msgSeq:'123',emojiId:'999',setEmoji:true});
 assert.equal(request.emojiType,'1');
 console.log('PASS: grey face is available without local emoji assets and uses QQ system type 1');
}
