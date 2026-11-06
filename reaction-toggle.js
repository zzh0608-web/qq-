// SPDX-License-Identifier: AGPL-3.0-only
// State belongs to a message + emoji, rather than a one-shot experiment dialog.
export function createReactionToggle({now=Date.now,ttlMs=300000,maxEntries=64}={}) {
    const states=new Map();
    const busy=new Set();
    return {
        async run(key,current,send) {
            if(busy.has(key))return {skipped:true};
            const saved=states.get(key);
            const next=!(saved && saved.expires>now() ? saved.value : current);
            busy.add(key);
            try {
                const result=await send(next);
                if(result?.ok!==true)throw new Error(result?.reason||'回应结果未确认');
                states.delete(key);
                states.set(key,{value:next,expires:now()+ttlMs});
                while(states.size>maxEntries)states.delete(states.keys().next().value);
                return {ok:true,setEmoji:next};
            } finally {busy.delete(key);}
        },
        clear(){states.clear();}
    };
}
