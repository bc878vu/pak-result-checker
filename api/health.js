module.exports = (req, res) => {
  res.status(200).setHeader('Content-Type','application/json; charset=utf-8').setHeader('Cache-Control','no-store');
  res.end(JSON.stringify({ok:true,service:'pak-result-checker-api',timestamp:new Date().toISOString()}));
};
