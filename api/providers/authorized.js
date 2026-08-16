const { providerUnavailable, normalizeResult } = require('./provider');

function slug(board) {
  return board.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,'');
}

/** Generic adapter for a board-provided or explicitly authorized JSON result service. */
async function getAuthorizedResult(board,{roll,name,className,year,exam}){
  const key=slug(board);
  const baseUrl=process.env[`RESULT_PROVIDER_${key}_URL`];
  const apiKey=process.env[`RESULT_PROVIDER_${key}_KEY`];
  if(!baseUrl||!apiKey)return providerUnavailable(board,`${board} authorized result provider is not configured`);

  try{
    const url=new URL(baseUrl);
    if(url.protocol!=='https:')return providerUnavailable(board,'Authorized provider URL must use HTTPS');
    url.searchParams.set('class',className);
    url.searchParams.set('year',year);
    url.searchParams.set('exam',exam);
    if(roll)url.searchParams.set('roll',roll);
    if(name)url.searchParams.set('name',name);

    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    let response;
    try{
      response=await fetch(url,{method:'GET',headers:{Accept:'application/json',Authorization:`Bearer ${apiKey}`},signal:controller.signal});
    }finally{clearTimeout(timer)}

    if(response.status===404)return {status:'not_found',board,official:true};
    if(!response.ok)return providerUnavailable(board,`Authorized provider returned HTTP ${response.status}`);
    const payload=await response.json();
    if(payload?.found===false||payload?.result===null)return {status:'not_found',board,official:true};

    const normalized=normalizeResult(payload?.result??payload,{board,className,year,exam});
    if(!normalized?.roll&&!normalized?.name)return {status:'not_found',board,official:true};
    return {status:'found',official:true,result:normalized};
  }catch(error){
    return providerUnavailable(board,error?.name==='AbortError'?'Authorized provider timed out':'Unable to reach the configured authorized provider');
  }
}

module.exports={getAuthorizedResult,slug};
