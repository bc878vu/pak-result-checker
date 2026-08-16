/**
 * Common provider contract.
 * Every board adapter must return either a normalized result or a clear unavailable/error state.
 */

function providerUnavailable(board, reason = 'No authorized result source configured') {
  return {
    status: 'unavailable',
    board,
    official: false,
    reason
  };
}

function normalizeResult(raw, meta = {}) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    roll: String(raw.roll ?? '').trim(),
    name: String(raw.name ?? '').trim(),
    father: String(raw.father ?? '').trim(),
    board: String(meta.board ?? raw.board ?? '').trim(),
    className: String(meta.className ?? raw.className ?? '').trim(),
    year: String(meta.year ?? raw.year ?? '').trim(),
    exam: String(meta.exam ?? raw.exam ?? '').trim(),
    status: String(raw.status ?? 'PASS').trim(),
    subjects: Array.isArray(raw.subjects) ? raw.subjects.map(subject => ({
      name: String(subject.name ?? subject[0] ?? '').trim(),
      obtained: Number(subject.obtained ?? subject[1] ?? 0),
      total: Number(subject.total ?? subject[2] ?? 0),
      grade: String(subject.grade ?? subject[3] ?? '').trim()
    })) : []
  };
}

module.exports = { providerUnavailable, normalizeResult };
