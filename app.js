const boards = [
  {name:'BISE Lahore', region:'Punjab', city:'Lahore', short:'LHR'},
  {name:'BISE Gujranwala', region:'Punjab', city:'Gujranwala', short:'GRW'},
  {name:'BISE Rawalpindi', region:'Punjab', city:'Rawalpindi', short:'RWP'},
  {name:'BISE Multan', region:'Punjab', city:'Multan', short:'MLT'},
  {name:'BISE Faisalabad', region:'Punjab', city:'Faisalabad', short:'FSD'},
  {name:'BISE Sargodha', region:'Punjab', city:'Sargodha', short:'SGD'},
  {name:'BISE Bahawalpur', region:'Punjab', city:'Bahawalpur', short:'BWP'},
  {name:'BISE DG Khan', region:'Punjab', city:'Dera Ghazi Khan', short:'DGK'},
  {name:'BISE Sahiwal', region:'Punjab', city:'Sahiwal', short:'SWL'},
  {name:'Federal Board (FBISE)', region:'Islamabad / Federal', city:'Islamabad', short:'FBI'},
  {name:'BISE Karachi', region:'Sindh', city:'Karachi', short:'KHI'},
  {name:'BISE Hyderabad', region:'Sindh', city:'Hyderabad', short:'HYD'},
  {name:'BISE Sukkur', region:'Sindh', city:'Sukkur', short:'SKR'},
  {name:'BISE Larkana', region:'Sindh', city:'Larkana', short:'LRK'},
  {name:'BISE Peshawar', region:'Khyber Pakhtunkhwa', city:'Peshawar', short:'PSH'},
  {name:'BISE Mardan', region:'Khyber Pakhtunkhwa', city:'Mardan', short:'MRD'},
  {name:'BISE Abbottabad', region:'Khyber Pakhtunkhwa', city:'Abbottabad', short:'ATD'},
  {name:'BISE Swat', region:'Khyber Pakhtunkhwa', city:'Swat', short:'SWT'},
  {name:'BISE Bannu', region:'Khyber Pakhtunkhwa', city:'Bannu', short:'BNN'},
  {name:'BISE Kohat', region:'Khyber Pakhtunkhwa', city:'Kohat', short:'KHT'},
  {name:'BISE Dera Ismail Khan', region:'Khyber Pakhtunkhwa', city:'Dera Ismail Khan', short:'DIK'},
  {name:'BISE Quetta', region:'Balochistan', city:'Quetta', short:'QTA'},
  {name:'BISE AJK', region:'Azad Jammu & Kashmir', city:'Muzaffarabad', short:'AJK'},
  {name:'Ziauddin Board', region:'Sindh', city:'Karachi', short:'ZB'},
];

const classes = ['9th / SSC-I','10th / SSC-II','11th / HSSC-I','12th / HSSC-II'];
const years = Array.from({length:9},(_,i)=>String(2026-i));
const exams = ['Annual','Supplementary / 2nd Annual'];
const regions = ['All Pakistan', ...new Set(boards.map(b=>b.region))];

const regionEl = document.querySelector('#region');
const boardEl = document.querySelector('#board');
const classEl = document.querySelector('#classLevel');
const yearEl = document.querySelector('#year');
const examEl = document.querySelector('#exam');
const searchTypeEl = document.querySelector('#searchType');
const boardFilterEl = document.querySelector('#boardFilter');
const boardGrid = document.querySelector('#boardGrid');
const boardCount = document.querySelector('#boardCount');
const form = document.querySelector('#resultForm');
const input = document.querySelector('#searchInput');
const label = document.querySelector('#searchLabel');
const hint = document.querySelector('#searchHint');
const modal = document.querySelector('#resultModal');
const resultContent = document.querySelector('#resultContent');

function optionMarkup(items){ return items.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join(''); }
regionEl.innerHTML = optionMarkup(regions);
boardFilterEl.innerHTML = optionMarkup(regions);
classEl.innerHTML = optionMarkup(classes);
yearEl.innerHTML = optionMarkup(years);
examEl.innerHTML = optionMarkup(exams);

function boardsForRegion(region){ return region === 'All Pakistan' ? boards : boards.filter(b=>b.region === region); }
function renderBoardOptions(region = regionEl.value, selected = null){
  const list = boardsForRegion(region);
  boardEl.innerHTML = list.map((b,i)=>`<option value="${escapeHtml(b.name)}" ${selected === b.name || (!selected && i===0) ? 'selected':''}>${escapeHtml(b.city)} — ${escapeHtml(b.name)}</option>`).join('');
}
function renderBoardDirectory(region = boardFilterEl.value){
  const list = boardsForRegion(region);
  boardCount.textContent = `${list.length} board${list.length === 1 ? '' : 's'}`;
  boardGrid.innerHTML = list.map(b=>`<button class="board" type="button" data-board="${escapeHtml(b.name)}"><span class="icon">${escapeHtml(b.short)}</span><strong>${escapeHtml(b.name)}</strong><small>${escapeHtml(b.city)} • ${escapeHtml(b.region)}</small></button>`).join('');
  boardGrid.querySelectorAll('.board').forEach(btn=>btn.addEventListener('click',()=>selectBoard(btn.dataset.board)));
}
function selectBoard(name){
  const selected = boards.find(b=>b.name === name);
  if(!selected) return;
  regionEl.value = selected.region;
  renderBoardOptions(selected.region, selected.name);
  boardFilterEl.value = selected.region;
  renderBoardDirectory(selected.region);
  document.querySelector('#check').scrollIntoView({behavior:'smooth',block:'start'});
}
renderBoardOptions('All Pakistan');
renderBoardDirectory('All Pakistan');
regionEl.addEventListener('change',()=>renderBoardOptions(regionEl.value));
boardFilterEl.addEventListener('change',()=>renderBoardDirectory(boardFilterEl.value));
searchTypeEl.addEventListener('change',()=>{
  const nameMode = searchTypeEl.value === 'name';
  label.textContent = nameMode ? 'Student Name' : 'Roll Number';
  input.type = 'text';
  input.inputMode = nameMode ? 'text' : 'numeric';
  input.placeholder = nameMode ? 'e.g. Muhammad Ali' : 'e.g. 123456';
  hint.innerHTML = nameMode ? 'Demo record: enter <b>Muhammad Ali</b> to preview the result card.' : 'Demo record: enter <b>123456</b> to preview the result card.';
  input.focus();
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const value = input.value.trim();
  if(!value) return;
  const button = form.querySelector('.primary-btn');
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span>Checking…</span><span class="arrow">↻</span>';
  try {
    const params = new URLSearchParams({
      board: boardEl.value,
      className: classEl.value,
      year: yearEl.value,
      exam: examEl.value,
      searchType: searchTypeEl.value,
      search: value
    });
    const response = await fetch(`/api/result?${params.toString()}`, {headers:{Accept:'application/json'}});
    const data = await response.json();
    showResult(Boolean(data.found), data.result, data.error);
  } catch (error) {
    showResult(false, null, 'Result service is temporarily unavailable. Please try again.');
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});

document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

function showResult(found,result,errorMessage='No result found'){
  if(!found){
    resultContent.innerHTML=`<div class="result-head"><span class="eyebrow">RESULT SEARCH</span><h2>No record found</h2><div class="result-meta">${escapeHtml(errorMessage)}</div></div><div class="notice" style="margin-top:20px"><strong>Development mode</strong><span>Try roll number <b>123456</b> or switch to Student Name and enter <b>Muhammad Ali</b>. Official board searches will be connected through authorized sources/API before launch.</span></div><div class="result-actions"><button class="secondary-btn primary" data-close>Back to search</button></div>`;
  } else {
    const totalObt = result.subjects.reduce((s,x)=>s+Number(x[1]),0);
    const total = result.subjects.reduce((s,x)=>s+Number(x[2]),0);
    const percentage = ((totalObt/total)*100).toFixed(2);
    resultContent.innerHTML=`<div class="result-head"><span class="eyebrow">DEMO RESULT • NOT AN OFFICIAL BOARD RECORD</span><h2 id="resultTitle">${escapeHtml(result.board)} Result</h2><div class="result-meta">${escapeHtml(result.className)} • ${escapeHtml(result.year)} • ${escapeHtml(result.exam)}</div></div><div class="student-card"><div><span>Student Name</span><strong>${escapeHtml(result.name)}</strong></div><div><span>Father Name</span><strong>${escapeHtml(result.father)}</strong></div><div><span>Roll Number</span><strong>${escapeHtml(result.roll)}</strong></div><div><span>Result Status</span><strong class="pass">PASS</strong></div></div><table class="marks"><thead><tr><th>Subject</th><th>Obtained</th><th>Total</th><th>Grade</th></tr></thead><tbody>${result.subjects.map(s=>`<tr><td>${escapeHtml(s[0])}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td></tr>`).join('')}</tbody></table><div class="summary"><div><span>Total Marks</span><strong>${total}</strong></div><div><span>Obtained</span><strong>${totalObt}</strong></div><div><span>Percentage</span><strong>${percentage}%</strong></div></div><div class="result-actions"><button class="secondary-btn" id="printBtn">Print Result</button><button class="secondary-btn primary" data-close>Close</button></div>`;
    resultContent.querySelector('#printBtn').addEventListener('click',()=>window.print());
  }
  resultContent.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
function escapeHtml(value){ return String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c])); }
