const { getAuthorizedResult } = require('./authorized');

const BOARDS = [
  'BISE Lahore','BISE Gujranwala','BISE Rawalpindi','BISE Multan','BISE Faisalabad',
  'BISE Sargodha','BISE Bahawalpur','BISE DG Khan','BISE Sahiwal','Federal Board (FBISE)',
  'BSEK Karachi','BIEK Karachi','BISE Hyderabad','BISE Sukkur','BISE Larkana',
  'BISE Peshawar','BISE Mardan','BISE Abbottabad','BISE Swat','BISE Bannu','BISE Kohat',
  'BISE Dera Ismail Khan','BISE Malakand','BISE Quetta (BBISE)','AJK BISE Mirpur'
];

const providers = Object.fromEntries(BOARDS.map(board => [
  board,
  async params => getAuthorizedResult(board, params)
]));

async function lookupResult(board, params) {
  const provider = providers[board];
  if (!provider) return { status: 'unavailable', board, official: false, reason: 'No board provider configured' };
  return provider(params);
}

module.exports = { lookupResult, providers, BOARDS };
