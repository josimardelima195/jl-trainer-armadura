import React,{createContext,useContext,useEffect,useState} from 'react';
import {supabase} from './supabase';
import {demo} from './model';
const Context=createContext(null);
export const useStore=()=>useContext(Context);
export function Provider({session,children}) {
 const [data,setData]=useState(demo),[error,setError]=useState(''),[loading,setLoading]=useState(Boolean(supabase)),[busy,setBusy]=useState(false);
 const userId=session?.user.id||'demo';
 async function refresh(){if(!supabase)return;setLoading(true);try{const result=await Promise.all(Object.keys(demo()).map(async table=>{const {data,error}=await supabase.from(table).select('*').limit(2000);if(error)throw new Error(`${table}: ${error.message}`);return [table,data];}));setData(Object.fromEntries(result));}catch(e){setError(e.message);}finally{setLoading(false);}}
 useEffect(()=>{refresh();},[userId]);
 async function mutate(table,values,id,remove=false){setError('');setBusy(true);try{if(supabase){const query=remove?supabase.from(table).delete().eq('id',id):id?supabase.from(table).update(values).eq('id',id):supabase.from(table).insert(values);const {error}=await query;if(error)throw error;await refresh();}else{setData(d=>({...d,[table]:remove?d[table].filter(r=>r.id!==id):id?d[table].map(r=>r.id===id?{...r,...values}:r):[...d[table],{id:crypto.randomUUID(),created_at:new Date().toISOString(),...values}]}));}return true;}catch(e){setError(e.message);return false;}finally{setBusy(false);}}
 async function rpc(name,args){if(!supabase){setError('Esta operação administrativa exige Supabase conectado.');return false;}setBusy(true);try{const {error}=await supabase.rpc(name,args);if(error)throw error;await refresh();return true;}catch(e){setError(e.message);return false;}finally{setBusy(false);}}
 const profile=data.profiles.find(p=>p.id===userId)||{id:userId,full_name:session?.user.user_metadata?.full_name||'Cliente',role:'client'};
 return <Context.Provider value={{data,profile,userId,session,loading,busy,error,setError,mutate,rpc,refresh,isDemo:!supabase}}>{children}</Context.Provider>;
}
