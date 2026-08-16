const DEMO_RESULT = {
  roll: '123456',
  name: 'Muhammad Ali',
  father: 'Muhammad Aslam',
  board: 'BISE Lahore',
  className: '10th / SSC-II',
  year: '2026',
  exam: 'Annual',
  subjects: [
    ['English', 78, 100, 'A'],
    ['Urdu', 81, 100, 'A'],
    ['Mathematics', 92, 100, 'A+'],
    ['Physics', 84, 100, 'A'],
    ['Chemistry', 79, 100, 'A'],
    ['Computer Science', 88, 100, 'A'],
    ['Islamiyat', 47, 50, 'A+']
  ]
};

const ALLOWED = {
  boards: new Set(['BISE Lahore']),
  classes: new Set(['9th / SSC-I', '10th / SSC-II', '11th / HSSC-I', '12th / HSSC-II']),
  exams: new Set(['Annual', 'Supplementary / 2nd Annual'])
};

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function clean(value, max = 100) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

module.exports = (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const input = req.method === 'GET' ? req.query : (req.body || {});
  const board = clean(input.board);
  const className = clean(input.className);
  const year = clean(input.year, 4);
  const exam = clean(input.exam);
  const searchType = input.searchType === 'name' ? 'name' : 'roll';
  const search = clean(input.search, 80);

  if (!board || !className || !year || !exam || !search) {
    return json(res, 400, { ok: false, error: 'board, className, year, exam and search are required' });
  }

  if (!ALLOWED.boards.has(board) || !ALLOWED.classes.has(className) || !ALLOWED.exams.has(exam) || !/^20\d{2}$/.test(year)) {
    return json(res, 400, { ok: false, error: 'Unsupported result search parameters' });
  }

  // Development provider only. Replace this provider with an authorized board/API adapter before production.
  const matches = searchType === 'roll'
    ? search === DEMO_RESULT.roll
    : search.toLowerCase() === DEMO_RESULT.name.toLowerCase();

  if (!matches) {
    return json(res, 404, { ok: false, found: false, source: 'demo', error: 'No result found' });
  }

  return json(res, 200, {
    ok: true,
    found: true,
    source: 'demo',
    official: false,
    notice: 'Demo record only. Not an official board result.',
    result: { ...DEMO_RESULT, board, className, year, exam }
  });
};
