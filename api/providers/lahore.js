const { providerUnavailable, normalizeResult } = require('./provider');

/**
 * BISE Lahore adapter.
 *
 * This adapter intentionally does not scrape the public web or invent a live
 * endpoint. Configure an authorized/licensed source through environment
 * variables when one is available.
 *
 * Expected future env vars:
 *   LAHORE_RESULT_API_URL
 *   LAHORE_RESULT_API_KEY
 */
async function getLahoreResult({ roll, name, className, year, exam }) {
  const baseUrl = process.env.LAHORE_RESULT_API_URL;
  const apiKey = process.env.LAHORE_RESULT_API_KEY;

  if (!baseUrl || !apiKey) {
    return providerUnavailable('BISE Lahore', 'Lahore authorized result API is not configured yet');
  }

  try {
    const url = new URL(baseUrl);
    url.searchParams.set('class', className);
    url.searchParams.set('year', year);
    url.searchParams.set('exam', exam);
    if (roll) url.searchParams.set('roll', roll);
    if (name) url.searchParams.set('name', name);

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (response.status === 404) {
      return { status: 'not_found', board: 'BISE Lahore', official: true };
    }

    if (!response.ok) {
      return providerUnavailable('BISE Lahore', `Authorized provider returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    const normalized = normalizeResult(payload.result ?? payload, {
      board: 'BISE Lahore', className, year, exam
    });

    if (!normalized?.roll && !normalized?.name) {
      return { status: 'not_found', board: 'BISE Lahore', official: true };
    }

    return { status: 'found', official: true, result: normalized };
  } catch (error) {
    return providerUnavailable('BISE Lahore', 'Unable to reach the configured authorized provider');
  }
}

module.exports = { getLahoreResult };
