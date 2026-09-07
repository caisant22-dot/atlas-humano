import type {Atlas,Concept} from './anatomy';
type Tool={name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean};execute:(input:unknown)=>unknown};
function record(input:unknown):Record<string,unknown>{if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Esperado um objeto.');return input as Record<string,unknown>;}
export function atlasTools(atlas:Atlas,inspect:(concept:Concept)=>void):Tool[]{return [
 {name:'find_anatomy',description:'Encontrar estruturas anatômicas por nome ou identificador do atlas neste atlas.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true},execute(input){const data=record(input);if(typeof data.query!=='string'||!data.query.trim())throw new Error('Uma consulta não vazia é obrigatória.');const q=data.query.toLowerCase().trim();return atlas.concepts.filter(c=>c.name.toLowerCase().includes(q)||c.id.toLowerCase().includes(q)).slice(0,30).map(c=>({id:c.id,name:c.name,pieces:c.elements.length}));}},
 {name:'inspect_anatomical_structure',description:'Selecionar um conceito do atlas na anatomia 3D e abrir seu painel de detalhes.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){const data=record(input);if(typeof data.id!=='string')throw new Error('Um identificador do atlas é obrigatório.');const concept=atlas.concepts.find(c=>c.id===data.id);if(!concept)throw new Error('Essa estrutura não está presente neste atlas.');inspect(concept);return {id:concept.id,name:concept.name,selectedPieces:concept.elements.length};}}
 ];}
export function registerAtlasTools(atlas:Atlas,inspect:(concept:Concept)=>void){
 const context=(document as Document&{modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
 if(!context?.registerTool)return;const lifecycle=new AbortController();
 for(const tool of atlasTools(atlas,inspect)){try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
 return()=>lifecycle.abort();
}
