const { getLahoreResult } = require('./lahore');
const { providerUnavailable } = require('./provider');

const UNCONFIGURED_BOARDS = [
  'BISE Gujranwala','BISE Rawalpindi','BISE Multan','BISE Faisalabad','BISE Sargodha',
  'BISE Bahawalpur','BISE DG Khan','BISE Sahiwal','Federal Board (FBISE)',
  'BISE Karachi','BISE Hyderabad','BISE Sukkur','BISE Larkana','BISE Peshawar',
  'BISE Mardan','BISE Abbottabad','BISE Swat','BISE Bannu','BISE Kohat',
  'BISE Dera Ismail Khan','BISE Quetta','BISE AJK','Ziauddin Board'
];

const providers = { 'BISE Lahore': getLahoreResult };
for (const board of UNCONFIGURED_BOARDS) {
  providers[board] = async () => providerUnavailable(board, `${board} authorized result provider is not configured yet`);
}

async function lookupResult(board, params) {
  const provider = providers[board];
  if (!provider) return providerUnavailable(board, 'No provider adapter exists for this board');
  return provider(params);
}

module.exports = { lookupResult, providers, UNCONFIGURED_BOARDS };
