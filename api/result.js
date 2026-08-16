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

const OFFICIAL_SOURCES = {
  'BISE Lahore':'https://result.biselahore.com/',
  'BISE Gujranwala':'https://www.bisegrw.online/',
  'BISE Rawalpindi':'https://results.biserawalpindi.edu.pk/',
  'BISE Multan':'https://results.bisemultan.edu.pk/',
  'BISE Faisalabad':'https://result.bisefsd.edu.pk/',
  'BISE Sargodha':'https://www.bisesargodha.edu.pk/content/BoardResult.aspx',
  'BISE Bahawalpur':'https://bisebwp.edu.pk/',
  'BISE DG Khan':'https://www.bisedgkhan.edu.pk/result/res-int-all.php',
  'BISE Sahiwal':'https://bisesahiwal.edu.pk/',
  'Federal Board (FBISE)':'https://www.fbise.edu.pk/',
  'BSEK Karachi':'https://www.bsek.edu.pk/',
  'BIEK Karachi':'https://www.biek.edu.pk/Result-Declaration-default.asp',
  'BISE Hyderabad':'https://bisehyd.edu.pk/',
  'BISE Sukkur':'https://bisesuksindh.edu.pk/',
  'BISE Larkana':'https://www.biselrk.edu.pk/ResultsHSC.aspx/Default.aspx',
  'BISE Peshawar':'https://www.bisep.gov.pk/allresults/',
  'BISE Mardan':'https://web.bisemdn.edu.pk/',
  'BISE Abbottabad':'https://www.biseatd.edu.pk/exams/r_ssc_a/r_ssc_a.php',
  'BISE Swat':'https://portal1.bisess.edu.pk/site/home/results-section',
  'BISE Bannu':'https://portal.biseb.edu.pk/biseb_online_admission/OnlineDMC/',
  'BISE Kohat':'https://www.bisekt.edu.pk/result',
  'BISE Dera Ismail Khan':'https://www.bisedik.edu.pk/',
  'BISE Malakand':'https://www.bisemalakand.edu.pk/result',
  'BISE Quetta (BBISE)':'https://result.bbise.edu.pk/',
  'AJK BISE Mirpur':'https://ajkbise.edu.pk/'
};
const ALLOWED={boards:new Set(Object.keys(OFFICIAL_SOURCES)),classes:new Set(['9th / SSC-I','10th / SSC-II','11th / HSSC-I','12th / HSSC-II']),exams:new Set(['Annual','Supplementary / 2nd Annual'])};
function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.end(JSON.stringify(body));}
function clean(v,max=100){return typeof v==='string'?v.trim().slice(0,max):'';}
function demoLookup({board,className,year,exam,searchType,search}){const matches=board===DEMO_RESULT.board&&className===DEMO_RESULT.className&&year===DEMO_RESULT.year&&exam===DEMO_RESULT.exam&&(searchType==='roll'?search===DEMO_RESULT.roll:search.toLowerCase()===DEMO_RESULT.name.toLowerCase());return matches?{...DEMO_RESULT,board,className,year,exam}:null;}
module.exports=async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='POST'){res.setHeader('Allow','GET, POST');return json(res,405,{ok:false,error:'Method not allowed'});}
  const input=req.method==='GET'?req.query:(req.body||{}),board=clean(input.board),className=clean(input.className),year=clean(input.year,4),exam=clean(input.exam),searchType=input.searchType==='name'?'name':'roll',search=clean(input.search,80);
  if(!board||!className||!year||!exam||!search)return json(res,400,{ok:false,error:'board, className, year, exam and search are required'});
  if(!ALLOWED.boards.has(board)||!ALLOWED.classes.has(className)||!ALLOWED.exams.has(exam)||!/^20\d{2}$/.test(year))return json(res,400,{ok:false,error:'Unsupported result search parameters'});

  // Real results always take priority. A demo record is never exposed unless
  // explicitly enabled in the deployment environment.
  const provider=await lookupResult(board,{roll:searchType==='roll'?search:'',name:searchType==='name'?search:'',className,year,exam});
  if(provider.status==='found')return json(res,200,{ok:true,found:true,source:'authorized-provider',official:true,result:provider.result});
  if(provider.status==='not_found')return json(res,404,{ok:false,found:false,source:'authorized-provider',official:true,error:'No result found'});

  if(process.env.ENABLE_DEMO_RESULT==='true'){
    const demo=demoLookup({board,className,year,exam,searchType,search});
    if(demo)return json(res,200,{ok:true,found:true,source:'demo',official:false,notice:'Demo record only. Not an official board result.',result:demo});
  }

  return json(res,503,{ok:false,found:false,source:'provider-unavailable',official:false,error:provider.reason||'Live result provider is not configured for this board yet',officialSource:OFFICIAL_SOURCES[board],officialSourceName:'Official '+board+' result portal',captchaRequired:['BISE Lahore','BSEK Karachi','BIEK Karachi','BISE Kohat'].includes(board)});
};
