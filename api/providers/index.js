const { getLahoreResult } = require('./lahore');
const { providerUnavailable } = require('./provider');

const providers = {
  'BISE Lahore': getLahoreResult,
  // Add authorized adapters here as they become available.
  'BISE Gujranwala': async () => providerUnavailable('BISE Gujranwala'),
  'BISE Faisalabad': async () => providerUnavailable('BISE Faisalabad'),
  'BISE Rawalpindi': async () => providerUnavailable('BISE Rawalpindi'),
  'BISE Multan': async () => providerUnavailable('BISE Multan'),
  'BISE Karachi': async () => providerUnavailable('BISE Karachi'),
  'Federal Board (FBISE)': async () => providerUnavailable('Federal Board (FBISE)'),
  'BISE Peshawar': async () => providerUnavailable('BISE Peshawar')
};

async function lookupResult(board, params) {
  const provider = providers[board];
  if (!provider) return providerUnavailable(board);
  return provider(params);
}

module.exports = { lookupResult, providers };
