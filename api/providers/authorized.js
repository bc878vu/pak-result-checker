const { providerUnavailable, normalizeResult } = require('./provider');

function slug(board) {
  return board
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generic adapter for an authorized JSON result service supplied by a board
 * or an explicitly authorized provider.
 *
 * Environment variables per board:
 *   RESULT_PROVIDER_<BOARD_SLUG>_URL
 *   RESULT_PROVIDER_<BOARD_SLUG>_KEY
 *
 * Example:
 *   RESULT_PROVIDER_BISE_LAHORE_URL=https://authorized.example/result
 *   RESULT_PROVIDER_BISE_LAHORE_KEY=secret
 */
async function getAuthorizedResult(board, { roll, name, className, year, exam }) {
  const key = slug(board);
  const baseUrl = process.env[`RESULT_PROVIDER_${key}_URL`];
  const apiKey = process.env[`RESULT_PROVIDER_${key}_KEY`];

  if (!baseUrl || !apiKey) {
    return providerUnavailable(board, `${board} authorized result provider is not configured`);
  }

  try {
    const url = new URL(baseUrl);
    url.searchParams.set('class', className);
    url.searchParams.set('year', year);
    url.searchParams.set('exam', exam);
    if (roll) url.searchParams.set('roll', roll);
    if (name) url.searchParams.set('name', name);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (response.status === 404) {
      return { status: 'not_found', board, official: true };
    }
    if (!response.ok) {
      return providerUnavailable(board, `Authorized provider returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (payload?.found === false || payload?.result === null) {
      return { status: 'not_found', board, official: true };
    }

    const normalized = normalizeResult(payload?.result ?? payload, {
      board, className, year, exam
    });

    if (!normalized?.roll && !normalized?.name) {
      return { status: 'not_found', board, official: true };
    }

    return { status: 'found', official: true, result: normalized };
  } catch (error) {
    return providerUnavailable(board, 'Unable to reach the configured authorized provider');
  }
}

module.exports = { getAuthorizedResult, slug };
