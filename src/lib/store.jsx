import React,{createContext,useContext,useEffect,useState} from 'react';
import {supabase} from './supabase';
import {demo} from './model';
import {loadExerciseDb} from './exerciseDb';
const Context=createContext(null);
export const useStore=()=>useContext(Context);
export function Provider({session,children}) {
 const [data,setData]=useState(demo),[exerciseLibrary,setExerciseLibrary]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(Boolean(supabase)),[busy,setBusy]=useState(false);
 const userId=session?.user.id||'demo';
 const queueKey='jl-trainer-offline-queue';
 function optimistic(table,values,id,remove=false){setData(d=>({...d,[table]:remove?d[table].filter(r=>r.id!==id):id?d[table].map(r=>r.id===id?{...r,...values}:r):[...d[table],{id:values.id||crypto.randomUUID(),created_at:new Date().toISOString(),...values}]}));}
 async function flushQueue(){if(!supabase||!navigator.onLine)return;const q=JSON.parse(localStorage.getItem(queueKey)||'[]');if(!q.length)return;const remaining=[];for(const item of q){try{const query=item.remove?supabase.from(item.table).delete().eq('id',item.id):item.id?supabase.from(item.table).update(item.values).eq('id',item.id):supabase.from(item.table).insert(item.values);const {error}=await query;if(error)throw error;}catch(e){remaining.push(item)}}localStorage.setItem(queueKey,JSON.stringify(remaining));if(remaining.length!==q.length)await refresh();}
 async function refresh(){if(!supabase)return;setLoading(true);try{const result=await Promise.all(Object.keys(demo()).map(async table=>{const {data,error}=await supabase.from(table).select('*').limit(2000);if(error)throw new Error(`${table}: ${error.message}`);return [table,data];}));const nextData=Object.fromEntries(result);nextData.modalities=(nextData.modalities||[]).filter(item=>item.active!==false);setData(nextData);}catch(e){setError(e.message);}finally{setLoading(false);}}
 useEffect(()=>{refresh();loadExerciseDb().then(setExerciseLibrary).catch(()=>{});const online=()=>flushQueue();window.addEventListener('online',online);return()=>window.removeEventListener('online',online);},[userId]);
 async function mutate(table,values,id,remove=false){setError('');setBusy(true);try{if(supabase&&!navigator.onLine){const q=JSON.parse(localStorage.getItem(queueKey)||'[]');q.push({table,values,id,remove});localStorage.setItem(queueKey,JSON.stringify(q));optimistic(table,values,id,remove);setError('Sem internet: guardado neste dispositivo e será sincronizado quando a conexão voltar.');return true;}if(supabase){const query=remove?supabase.from(table).delete().eq('id',id):id?supabase.from(table).update(values).eq('id',id):supabase.from(table).insert(values);const {error}=await query;if(error)throw error;await refresh();}else optimistic(table,values,id,remove);return true;}catch(e){setError(e.message);return false;}finally{setBusy(false);}}
 async function rpc(name,args){if(!supabase){setError('Esta operação administrativa exige Supabase conectado.');return false;}setBusy(true);try{const {error}=await supabase.rpc(name,args);if(error)throw error;await refresh();return true;}catch(e){setError(e.message);return false;}finally{setBusy(false);}}
 const profile=data.profiles.find(p=>p.id===userId)||{id:userId,full_name:session?.user.user_metadata?.full_name||'Cliente',role:'client'};
 return <Context.Provider value={{data,exerciseLibrary,profile,userId,session,loading,busy,error,setError,mutate,rpc,refresh,isDemo:!supabase}}>{children}</Context.Provider>;
}
