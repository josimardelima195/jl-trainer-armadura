import {supabase} from './supabase';
export async function upload(bucket,file,userId){
 if(!supabase)throw new Error('Uploads exigem Supabase conectado.');
 const allowed=bucket==='videos'||bucket==='challenge-proofs'?['video/mp4','video/webm','video/quicktime']:bucket==='documents'||bucket==='payment-proofs'?['application/pdf','image/jpeg','image/png','image/webp']:['image/jpeg','image/png','image/webp'];
 const limit=bucket==='videos'||bucket==='challenge-proofs'?100*1024*1024:10*1024*1024;
 if(!allowed.includes(file.type)||file.size>limit)throw new Error(`Formato não permitido ou arquivo acima de ${limit/1024/1024} MB.`);
 const path=`${userId}/${crypto.randomUUID()}.${file.name.split('.').at(-1).replace(/[^a-z0-9]/gi,'')}`;
 const {error}=await supabase.storage.from(bucket).upload(path,file,{contentType:file.type});if(error)throw error;return path;
}
export async function openMedia(bucket,path,expiresIn=3600){if(!supabase)return;const {data,error}=await supabase.storage.from(bucket).createSignedUrl(path,expiresIn);if(error)throw error;return data.signedUrl;}
