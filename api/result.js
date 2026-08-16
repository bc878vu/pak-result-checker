const { lookupResult } = require('./providers');

const OFFICIAL_SOURCES = {
  'BISE Lahore':'https://result.biselahore.com/','BISE Gujranwala':'https://www.bisegrw.edu.pk/','BISE Rawalpindi':'https://results.biserawalpindi.edu.pk/','BISE Multan':'https://results.bisemultan.edu.pk/','BISE Faisalabad':'https://result.bisefsd.edu.pk/','BISE Sargodha':'https://www.bisesargodha.edu.pk/content/BoardResult.aspx','BISE Bahawalpur':'https://bisebwp.edu.pk/','BISE DG Khan':'https://www.bisedgkhan.edu.pk/result/res-int-all.php','BISE Sahiwal':'https://bisesahiwal.edu.pk/','Federal Board (FBISE)':'https://www.fbise.edu.pk/','BSEK Karachi':'https://www.bsek.edu.pk/','BIEK Karachi':'https://www.biek.edu.pk/Result-Declaration-default.asp','BISE Hyderabad':'https://biseh.edu.pk/','BISE Sukkur':'https://bisesuksindh.edu.pk/','BISE Larkana':'https://www.biselrk.edu.pk/ResultsHSC.aspx/Default.aspx','BISE Peshawar':'https://www.bisep.gov.pk/allresults/','BISE Mardan':'https://web.bisemdn.edu.pk/','BISE Abbottabad':'https://www.biseatd.edu.pk/exams/r_ssc_a/r_ssc_a.php','BISE Swat':'https://portal1.bisess.edu.pk/site/home/results-section','BISE Bannu':'https://portal.biseb.edu.pk/biseb_online_admission/OnlineDMC/','BISE Kohat':'https://www.bisekt.edu.pk/result','BISE Dera Ismail Khan':'https://www.bisedik.edu.pk/','BISE Malakand':'https://www.bisemalakand.edu.pk/result','BISE Quetta (BBISE)':'https://result.bbise.edu.pk/','AJK BISE Mirpur':'https://ajkbise.edu.pk/'
};

const BOARD_CLASSES={
  'BSEK Karachi':['9th / SSC-I','10th / SSC-II'],
  'BIEK Karachi':['11th / HSSC-I','12th / HSSC-II']
};
const ALL_CLASSES=['9th / SSC-I','10th / SSC-II','11th / HSSC-I','12th / HSSC-II'];
const ALL_EXAMS=['Annual','Supplementary / 2nd Annual'];
const ALLOWED={boards:new Set(Object.keys(OFFICIAL_SOURCES)),classes:new Set(ALL_CLASSES),exams:new Set(ALL_EXAMS)};
function json(res,status,body){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.end(JSON.stringify(body));}
function clean(v,max=100){return typeof v==='string'?v.trim().slice(0,max):'';}
function isValidYear(year){const n=Number(year);return Number.isInteger(n)&&n>=2018&&n<=2026;}
function classAllowed(board,className){return !(BOARD_CLASSES[board])||BOARD_CLASSES[board].includes(className);}
module.exports=async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='POST'){res.setHeader('Allow','GET, POST');return json(res,405,{ok:false,error:'Method not allowed'});}
  const input=req.method==='GET'?req.query:(req.body||{});
  const board=clean(input.board),className=clean(input.className),year=clean(input.year,4),exam=clean(input.exam),searchType=input.searchType==='name'?'name':'roll',search=clean(input.search,80);
  if(!board||!className||!year||!exam||!search)return json(res,400,{ok:false,error:'board, className, year, exam and search are required'});
  if(!ALLOWED.boards.has(board)||!ALLOWED.classes.has(className)||!ALLOWED.exams.has(exam)||!isValidYear(year))return json(res,400,{ok:false,error:'Unsupported result search parameters'});
  if(!classAllowed(board,className))return json(res,400,{ok:false,error:`${board} does not list ${className} in this checker`});
  if(searchType==='roll'&&!/^[0-9][0-9 -]{1,29}$/.test(search))return json(res,400,{ok:false,error:'Invalid roll number format'});
  if(searchType==='name'&&search.length<2)return json(res,400,{ok:false,error:'Student name is too short'});

  const provider=await lookupResult(board,{roll:searchType==='roll'?search.replace(/\s+/g,''):'',name:searchType==='name'?search:'',className,year,exam});
  if(provider.status==='found')return json(res,200,{ok:true,found:true,source:'authorized-provider',official:true,result:provider.result});
  if(provider.status==='not_found')return json(res,404,{ok:false,found:false,source:'authorized-provider',official:true,error:'No result found'});

  return json(res,503,{ok:false,found:false,source:'provider-unavailable',official:false,error:provider.reason||'Live result provider is not configured for this board yet',officialSource:OFFICIAL_SOURCES[board],officialSourceName:'Official '+board+' result portal',captchaRequired:['BISE Lahore','BSEK Karachi','BIEK Karachi','BISE Kohat'].includes(board)});
};
