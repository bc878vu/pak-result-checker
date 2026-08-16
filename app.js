const boards = [
  {name:'BISE Lahore',region:'Punjab',short:'LHR'},
  {name:'BISE Gujranwala',region:'Punjab',short:'GRW'},
  {name:'BISE Rawalpindi',region:'Punjab',short:'RWP'},
  {name:'BISE Multan',region:'Punjab',short:'MLT'},
  {name:'BISE Faisalabad',region:'Punjab',short:'FSD'},
  {name:'BISE Sargodha',region:'Punjab',short:'SGD'},
  {name:'BISE Bahawalpur',region:'Punjab',short:'BWP'},
  {name:'BISE DG Khan',region:'Punjab',short:'DGK'},
  {name:'BISE Sahiwal',region:'Punjab',short:'SWL'},
  {name:'Federal Board (FBISE)',region:'Islamabad / Federal',short:'FBI'},
  {name:'BISE Karachi',region:'Sindh',short:'KHI'},
  {name:'BISE Hyderabad',region:'Sindh',short:'HYD'},
  {name:'BISE Sukkur',region:'Sindh',short:'SKR'},
  {name:'BISE Larkana',region:'Sindh',short:'LRK'},
  {name:'BISE Peshawar',region:'Khyber Pakhtunkhwa',short:'PSH'},
  {name:'BISE Mardan',region:'Khyber Pakhtunkhwa',short:'MRD'},
  {name:'BISE Abbottabad',region:'Khyber Pakhtunkhwa',short:'ATD'},
  {name:'BISE Swat',region:'Khyber Pakhtunkhwa',short:'SWT'},
  {name:'BISE Bannu',region:'Khyber Pakhtunkhwa',short:'BNN'},
  {name:'BISE Kohat',region:'Khyber Pakhtunkhwa',short:'KHT'},
  {name:'BISE Dera Ismail Khan',region:'Khyber Pakhtunkhwa',short:'DIK'},
  {name:'BISE Quetta',region:'Balochistan',short:'QTA'},
  {name:'BISE AJK',region:'Azad Jammu & Kashmir',short:'AJK'},
  {name:'Ziauddin Board',region:'Sindh',short:'ZB'},
];

const classes = ['9th / SSC-I','10th / SSC-II','11th / HSSC-I','12th / HSSC-II'];
const years = Array.from({length:9},(_,i)=>String(2026-i));
const exams = ['Annual','Supplementary / 2nd Annual'];

const sampleResult = {
  roll:'123456',
  name:'Muhammad Ali',
  father:'Muhammad Aslam',
  board:'BISE Lahore',
  className:'10th / SSC-II',
  year:'2026',
  exam:'Annual',
  subjects:[
    ['English','78','100','A'],
    ['Urdu','81','100','A'],
    ['Mathematics','92','100','A+'],
    ['Physics','84','100','A'],
    ['Chemistry','79','100','A'],
    ['Computer Science','88','100','A'],
    ['Islamiyat','47','50','A+'],
  ],
};

const boardEl = document.querySelector('#board');
const classEl = document.querySelector('#classLevel');
const yearEl = document.querySelector('#year');
const examEl = document.querySelector('#exam');
const boardGrid = document.querySelector('#boardGrid');
const form = document.querySelector('#resultForm');
const input = document.querySelector('#searchInput');
const label = document.querySelector('#searchLabel');
const hint = document.querySelector('#searchHint');
const modal = document.querySelector('#resultModal');
const resultContent = document.querySelector('#resultContent');

function optionMarkup(items){ return items.map(x=>`<option value="${x}">${x}</option>`).join(''); }
boardEl.innerHTML = boards.map((b,i)=>`<option value="${b.name}" ${i===0?'selected':''}>${b.name}</option>`).join('');
classEl.innerHTML = optionMarkup(classes);
yearEl.innerHTML = optionMarkup(years);
examEl.innerHTML = optionMarkup(exams);

boardGrid.innerHTML = boards.map(b=>`<button class="board" type="button" data-board="${b.name}"><span class="icon">${b.short}</span><strong>${b.name}</strong><small>${b.region}</small></button>`).join('');
boardGrid.querySelectorAll('.board').forEach(btn=>btn.addEventListener('click',()=>{
  boardEl.value = btn.dataset.board;
  document.querySelector('#check').scrollIntoView({behavior:'smooth',block:'start'});
}));

let mode = 'roll';
document.querySelectorAll('.mode').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  mode = btn.dataset.mode;
  if(mode==='roll'){
    label.textContent='Roll Number';
    input.type='text'; input.inputMode='numeric'; input.placeholder='e.g. 123456';
    hint.innerHTML='Demo record: enter <b>123456</b> to preview the result card.';
  }else{
    label.textContent='Student Name';
    input.type='text'; input.inputMode='text'; input.placeholder='e.g. Muhammad Ali';
    hint.innerHTML='Demo record: enter <b>Muhammad Ali</b> to preview the result card.';
  }
  input.focus();
}));

form.addEventListener('submit',(e)=>{
  e.preventDefault();
  const value = input.value.trim();
  const valid = mode==='roll' ? value==='123456' : value.toLowerCase()==='muhammad ali';
  if(!valid){
    showResult(false);
    return;
  }
  const result = {...sampleResult, board:boardEl.value, className:classEl.value, year:yearEl.value, exam:examEl.value};
  showResult(true,result);
});

document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

function showResult(found,result=sampleResult){
  if(!found){
    resultContent.innerHTML=`<div class="result-head"><span class="eyebrow">RESULT SEARCH</span><h2>No demo record found</h2><div class="result-meta">The current build is in development mode.</div></div><div class="notice" style="margin-top:20px"><strong>Try the demo record</strong><span>Use roll number <b>123456</b> or switch to Student Name and enter <b>Muhammad Ali</b>. Official board searches will be connected through authorized sources/API before launch.</span></div><div class="result-actions"><button class="secondary-btn primary" data-close>Back to search</button></div>`;
  }else{
    const totalObt = result.subjects.reduce((s,x)=>s+Number(x[1]),0);
    const total = result.subjects.reduce((s,x)=>s+Number(x[2]),0);
    const percentage = ((totalObt/total)*100).toFixed(2);
    resultContent.innerHTML=`
      <div class="result-head">
        <span class="eyebrow">DEMO RESULT • NOT AN OFFICIAL BOARD RECORD</span>
        <h2 id="resultTitle">${escapeHtml(result.board)} Result</h2>
        <div class="result-meta">${escapeHtml(result.className)} • ${escapeHtml(result.year)} • ${escapeHtml(result.exam)}</div>
      </div>
      <div class="student-card">
        <div><span>Student Name</span><strong>${escapeHtml(result.name)}</strong></div>
        <div><span>Father Name</span><strong>${escapeHtml(result.father)}</strong></div>
        <div><span>Roll Number</span><strong>${escapeHtml(result.roll)}</strong></div>
        <div><span>Result Status</span><strong class="pass">PASS</strong></div>
      </div>
      <table class="marks"><thead><tr><th>Subject</th><th>Obtained</th><th>Total</th><th>Grade</th></tr></thead><tbody>${result.subjects.map(s=>`<tr><td>${escapeHtml(s[0])}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td></tr>`).join('')}</tbody></table>
      <div class="summary"><div><span>Total Marks</span><strong>${total}</strong></div><div><span>Obtained</span><strong>${totalObt}</strong></div><div><span>Percentage</span><strong>${percentage}%</strong></div></div>
      <div class="result-actions"><button class="secondary-btn" id="printBtn">Print Result</button><button class="secondary-btn primary" data-close>Close</button></div>`;
    resultContent.querySelector('#printBtn').addEventListener('click',()=>window.print());
  }
  resultContent.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}

function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
function escapeHtml(value){return String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]))}
