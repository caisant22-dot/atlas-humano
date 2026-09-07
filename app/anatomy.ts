export type SystemId = 'skeletal'|'muscular'|'arterial'|'venous'|'nervous'|'digestive'|'respiratory'|'urinary'|'reproductive'|'lymphatic'|'endocrine'|'integumentary'|'connective'|'sensory'|'cardiac';
export const SYSTEMS: {id:SystemId;name:string;color:string;description:string}[] = [
 {id:'skeletal',name:'Esqueleto',color:'#e2d9ba',description:'Os ossos formam a estrutura de sustentação do corpo, protegem os órgãos e servem como pontos de fixação para os músculos. Seu tecido interno também armazena minerais e produz células sanguíneas.'},
 {id:'muscular',name:'Músculos',color:'#a85b50',description:'Os músculos esqueléticos geram movimento ao puxar seus pontos de inserção. Junto com os tendões, movem articulações, estabilizam a postura e produzem calor.'},
 {id:'cardiac',name:'Coração',color:'#b96760',description:'O coração é uma bomba muscular com quatro câmaras. Suas válvulas direcionam o sangue através dos circuitos pulmonar e sistêmico.'},
 {id:'sensory',name:'Órgãos sensoriais',color:'#b0c8ce',description:'Essas estruturas contribuem para os sentidos especiais, incluindo visão, audição e equilíbrio. Seus tecidos especializados detectam estímulos e trabalham com o sistema nervoso para transmitir informações.'},
 {id:'arterial',name:'Artérias',color:'#c05245',description:'O coração impulsiona o sangue pela circulação. As artérias transportam sangue do coração para os tecidos ou, no circuito pulmonar, para os pulmões.'},
 {id:'venous',name:'Veias',color:'#527c9f',description:'As veias retornam o sangue ao coração. Redes superficiais e profundas coletam sangue dos tecidos; as veias pulmonares trazem sangue oxigenado de volta dos pulmões.'},
 {id:'nervous',name:'Sistema nervoso',color:'#d8b565',description:'O cérebro, a medula espinhal e os nervos periféricos conduzem e processam sinais. Eles sustentam a sensação, o movimento, a coordenação e a regulação automática das funções corporais.'},
 {id:'respiratory',name:'Respiratório',color:'#b98991',description:'As vias aéreas conduzem o ar até os pulmões, onde oxigênio e dióxido de carbono se movem entre o ar e o sangue. A respiração depende de mudanças de pressão produzidas pelos músculos respiratórios.'},
 {id:'digestive',name:'Digestório',color:'#b8916b',description:'O trato digestório decompõe os alimentos, absorve nutrientes e água, e move os resíduos adiante. Órgãos acessórios contribuem com bile e enzimas digestivas.'},
 {id:'urinary',name:'Urinário',color:'#b47961',description:'Os rins filtram o sangue e regulam o equilíbrio de líquidos, eletrólitos e ácido-base. A urina percorre os ureteres até a bexiga e sai pela uretra.'},
 {id:'lymphatic',name:'Linfático',color:'#879f7c',description:'Os vasos linfáticos devolvem o excesso de líquido tecidual à circulação. Os linfonodos e outros órgãos linfoides apoiam a vigilância e as respostas imunológicas.'},
 {id:'endocrine',name:'Endócrino',color:'#c5a09a',description:'Os órgãos endócrinos liberam hormônios no sangue para coordenar processos como metabolismo, crescimento, respostas ao estresse e reprodução.'},
 {id:'reproductive',name:'Reprodutor',color:'#bda098',description:'As estruturas reprodutivas masculinas representadas aqui contribuem para a produção, maturação e transporte de espermatozoides, e para a produção de hormônios sexuais.'},
 {id:'integumentary',name:'Superfície corporal',color:'#ba9b7d',description:'A superfície corporal fornece uma referência anatômica externa. O sistema tegumentar forma uma barreira protetora e contribui para a sensação e a regulação da temperatura.'},
 {id:'connective',name:'Tecido conjuntivo',color:'#aec3bb',description:'Cartilagem, ligamentos e outros tecidos conjuntivos sustentam, conectam e separam estruturas. Suas funções incluem estabilizar articulações e distribuir cargas mecânicas.'},
];
export interface Part {id:string;name:string;conceptId:string;system:SystemId;chunk:number;positions:number;normals:number;indices:number;vertexCount:number;indexCount:number;bounds:[number[],number[]]}
export interface Concept {id:string;name:string;elements:string[]}
export interface Atlas {version:string;sex?:'male';source?:string;scope?:string;parts:Part[];concepts:Concept[];chunks:{url:string;bytes:number;gzip?:string;gzipBytes?:number}[];triangles:number}
export type View = 'three-quarter'|'front'|'back'|'side';
export interface SceneState {inspectorOpen?:boolean;explode:number;visible:SystemId[];selected:string[];isolate:boolean;view:View;rotate:boolean;reset:number;labelsVisible?:boolean;quizHighlight?:string[]}
export const DEFAULT_VISIBLE:SystemId[] = ['cardiac','sensory','skeletal','muscular','arterial','venous','nervous','respiratory','digestive','urinary','lymphatic','endocrine','reproductive','connective'];
export const EXPLANATIONS:Record<string,string> = {
 'coração':'Uma bomba muscular no tórax. Seu lado direito envia sangue para os pulmões; seu lado esquerdo envia sangue pela circulação sistêmica.',
 'fígado':'Um órgão grande abaixo do lado direito do diafragma. Ele processa nutrientes absorvidos, produz bile e sintetiza muitas proteínas transportadas pelo sangue.',
 'cérebro':'O órgão central do sistema nervoso. Suas regiões interconectadas sustentam a percepção, o movimento, a memória, a linguagem e a regulação das funções corporais.',
 'estômago':'Uma câmara muscular entre o esôfago e o intestino delgado. Armazena e mistura o alimento com ácido e enzimas antes de liberá-lo no duodeno.',
 'baço':'Um órgão linfoide no abdômen superior esquerdo. Filtra o sangue, remove células sanguíneas envelhecidas e participa das respostas imunológicas.',
 'pâncreas':'Um órgão abdominal com funções digestiva e endócrina. Fornece enzimas ao intestino delgado e libera hormônios como insulina e glucagon.',
 'bexiga urinária':'Um reservatório muscular na pelve que armazena a urina que chega dos rins pelos ureteres.',
 'traqueia':'A via aérea principal que conecta a laringe aos brônquios. Seus anéis de cartilagem mantêm a via aérea aberta durante a respiração.',
 'diafragma':'Um músculo amplo que separa o tórax do abdômen. Quando se contrai, aumenta o volume torácico e ajuda a puxar o ar para os pulmões.',
 'pulmão direito':'O pulmão maior, com três lobos. Recebe sangue pela artéria pulmonar direita e realiza a troca gasosa nos alvéolos.',
 'pulmão esquerdo':'O pulmão menor, com dois lobos. Tem uma incisura cardíaca para acomodar o coração.',
 'fêmur':'O osso mais longo e forte do corpo humano. Conecta o quadril ao joelho e suporta grande parte do peso corporal.',
 'tíbia':'O osso principal da perna, localizado medialmente. Suporta o peso corporal entre o joelho e o tornozelo.',
 'úmero':'O osso do braço, entre o ombro e o cotovelo. Serve de inserção para diversos músculos do membro superior.',
 'escápula':'Osso triangular e plano na parte posterior do ombro. Serve de ancoragem para músculos que movem o braço.',
 'clavícula':'Osso longo que conecta o esterno à escápula. Transmite forças do membro superior para o esqueleto axial.',
 'aorta':'A maior artéria do corpo. Recebe sangue do ventrículo esquerdo e o distribui para todo o organismo.',
 'rim':'Órgão par que filtra o sangue, regula o equilíbrio de líquidos e eletrólitos, e produz urina.',
};
export function explanation(name:string,system:SystemId){return EXPLANATIONS[name.toLowerCase()] ?? SYSTEMS.find(s=>s.id===system)?.description ?? '';}
