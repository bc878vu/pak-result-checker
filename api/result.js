const { lookupResult } = require('./providers');

const DEMO_RESULT = {
  roll: '123456', name: 'Muhammad Ali', father: 'Muhammad Aslam', board: 'BISE Lahore',
  className: '10th / SSC-II', year: '2026', exam: 'Annual', status: 'PASS',
  subjects: [
    { name: 'English', obtained: 78, total: 100, grade: 'A' }, { name: 'Urdu', obtained: 81, total: 100, grade: 'A' },
    { name: 'Mathematics', obtained: 92, total: 100, grade: 'A+' }, { name: 'Physics', obtained: 84, total: 100, grade: 'A' },
    { name: 'Chemistry', obtained: 79, total: 100, grade: 'A' }, { name: 'Computer Science', obtained: 88, total: 100, grade: 'A' },
    { name: 'Islamiyat', obtained: 47, total: 50, grade: 'A+' }
  ]
};
const OFFICIAL_SOURCES = { 'BISE Lahore': 'https://result.biselahore.com/' };
const ALLOWED = {
  boards: new Set(['BISE Lahore','BISE Gujranwala','BISE Faisalabad','BISE Rawalpindi','BISE Multan','BISE Karachi','Federal Board (FBISE)','BISE Peshawar']),
  classes: new Set(['9th / SSC-I','10th / SSC-II','11th / HSSC-I','12th / HSSC-II']), exams: new Set(['Annual','Supplementary / 2nd Annual'])
};
function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.end(JSON.stringify(body));}
function clean(v,max=100){return typeof v==='string'?v.trim().slice(0,max):'';}
function demoLookup({board,className,year,exam,searchType,search}){const matches=board===DEMO_RESULT.board&&className===DEMO_RESULT.className&&year===DEMO_RESULT.year&&exam===DEMO_RESULT.exam&&(searchType==='roll'?search===DEMO_RESULT.roll:search.toLowerCase()===DEMO_RESULT.name.toLowerCase());return matches?{...DEMO_RESULT,board,className,year,exam}:null;}
module.exports=async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='POST'){res.setHeader('Allow','GET, POST');return json(res,405,{ok:false,error:'Method not allowed'});}
  const input=req.method==='GET'?req.query:(req.body||{}),board=clean(input.board),className=clean(input.className),year=clean(input.year,4),exam=clean(input.exam),searchType=input.searchType==='name'?'name':'roll',search=clean(input.search,80);
  if(!board||!className||!year||!exam||!search)return json(res,400,{ok:false,error:'board, className, year, exam and search are required'});
  if(!ALLOWED.boards.has(board)||!ALLOWED.classes.has(className)||!ALLOWED.exams.has(exam)||!/^20\d{2}$/.test(year))return json(res,400,{ok:false,error:'Unsupported result search parameters'});
  const provider=await lookupResult(board,{roll:searchType==='roll'?search:'',name:searchType==='name'?search:'',className,year,exam});
  if(provider.status==='found')return json(res,200,{ok:true,found:true,source:'authorized-provider',official:true,result:provider.result});
  if(provider.status==='not_found')return json(res,404,{ok:false,found:false,source:'authorized-provider',official:true,error:'No result found'});
  const demo=demoLookup({board,className,year,exam,searchType,search});
  if(demo)return json(res,200,{ok:true,found:true,source:'demo',official:false,notice:'Demo record only. Not an official board result.',result:demo});
  return json(res,503,{ok:false,found:false,source:'provider-unavailable',official:false,error:provider.reason||'Live result provider is not configured for this board yet',officialSource:OFFICIAL_SOURCES[board]||null,officialSourceName:OFFICIAL_SOURCES[board]?'Official '+board+' result portal':null,captchaRequired:board==='BISE Lahore'});
};
