/* Google AdSense + public result resources. Replace the placeholder publisher/slot IDs after AdSense approval. */
window.PAK_ADS={
  provider:'adsense',
  enabled:true,
  autoAds:true,
  client:'ca-pub-XXXXXXXXXXXXXXXX',
  slots:{top:'XXXXXXXXXX',middle:'XXXXXXXXXX',mobile:'XXXXXXXXXX'}
};

(function initPublicResources(){
  const resources=document.createElement('section');
  resources.className='public-resources';
  resources.innerHTML=`<div class="public-resources-inner"><div class="public-announcement"><span class="public-badge">📢 RESULT UPDATE</span><h2>All Punjab educational boards (BISE) will announce the Matric (Class 10th) examination results tomorrow morning at 10 AM, Insha'Allah.</h2><p>Best wishes and prayers to all students that you receive the best rewards for your hard work.</p></div><div class="punjab-links"><div class="public-heading"><span class="eyebrow">PUNJAB BOARDS</span><h3>Official board websites</h3></div><div class="punjab-grid"><a href="https://www.biselahore.com/" target="_blank" rel="noopener noreferrer"><b>1️⃣ BISE Lahore</b><small>www.biselahore.com</small></a><a href="https://www.bisefsd.edu.pk/" target="_blank" rel="noopener noreferrer"><b>2️⃣ BISE Faisalabad</b><small>www.bisefsd.edu.pk</small></a><a href="https://www.bisegrw.edu.pk/" target="_blank" rel="noopener noreferrer"><b>3️⃣ BISE Gujranwala</b><small>www.bisegrw.edu.pk</small></a><a href="https://www.biserwp.edu.pk/" target="_blank" rel="noopener noreferrer"><b>4️⃣ BISE Rawalpindi</b><small>www.biserwp.edu.pk</small></a><a href="https://www.bisemultan.edu.pk/" target="_blank" rel="noopener noreferrer"><b>5️⃣ BISE Multan</b><small>www.bisemultan.edu.pk</small></a><a href="https://www.bisesargodha.edu.pk/" target="_blank" rel="noopener noreferrer"><b>6️⃣ BISE Sargodha</b><small>www.bisesargodha.edu.pk</small></a><a href="https://www.bisebwp.edu.pk/" target="_blank" rel="noopener noreferrer"><b>7️⃣ BISE Bahawalpur</b><small>www.bisebwp.edu.pk</small></a><a href="https://www.bisedgkhan.edu.pk/" target="_blank" rel="noopener noreferrer"><b>8️⃣ BISE DG Khan</b><small>www.bisedgkhan.edu.pk</small></a><a href="https://www.bisesahiwal.edu.pk/" target="_blank" rel="noopener noreferrer"><b>9️⃣ BISE Sahiwal</b><small>www.bisesahiwal.edu.pk</small></a></div><div class="resource-actions"><a class="resource-btn" href="https://drive.google.com/drive/folders/1DcUxsbm6SxqLqGGJ_Nx3Sci0A-sNXpiW?usp=sharing" target="_blank" rel="noopener noreferrer">📄 All Punjab Boards Result Gazette PDF ↗</a></div></div></div>`;
  const target=document.querySelector('.trust-strip');
  if(target)target.parentNode.insertBefore(resources,target);
  const style=document.createElement('style');
  style.textContent=`.public-resources{padding:18px 0 6px;background:#f7fbf8}.public-resources-inner{width:min(1180px,calc(100% - 40px));margin:auto}.public-announcement{padding:20px 22px;background:linear-gradient(135deg,#fffdf4,#fff8e5);border:1px solid #f0dfb2;border-radius:17px;box-shadow:0 10px 28px rgba(94,72,21,.05)}.public-badge{display:inline-flex;padding:6px 9px;border-radius:99px;background:#fff1c8;color:#775a17;font-size:9px;font-weight:900;letter-spacing:.08em}.public-announcement h2{margin:10px 0 6px;font-size:19px;line-height:1.45;letter-spacing:-.02em}.public-announcement p{margin:0;color:#766642;font-size:11px;line-height:1.6}.punjab-links{margin-top:13px;padding:20px 22px;background:#fff;border:1px solid #dfeae3;border-radius:17px}.public-heading h3{margin:5px 0 15px;font-size:21px;letter-spacing:-.03em}.punjab-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.punjab-grid a{display:flex;flex-direction:column;gap:5px;padding:12px;border:1px solid #e1ebe5;border-radius:11px;text-decoration:none;background:#fbfdfc;color:#163b2a;transition:.18s}.punjab-grid b{font-size:11px}.punjab-grid small{font-size:9px;color:#75847c}.resource-actions{display:grid;grid-template-columns:1fr;gap:9px;margin-top:11px}.resource-btn{display:flex;align-items:center;justify-content:center;min-height:44px;padding:0 12px;border-radius:10px;background:#08764b;color:#fff;text-decoration:none;font-size:10px;font-weight:800;text-align:center}@media(max-width:700px){.public-resources{padding-top:12px}.public-resources-inner{width:calc(100% - 24px)}.public-announcement,.punjab-links{padding:15px;border-radius:14px}.public-announcement h2{font-size:15px}.public-announcement p{font-size:10px}.punjab-grid{grid-template-columns:1fr 1fr}.punjab-grid b{font-size:10px}.punjab-grid small{font-size:8px}}`;
  document.head.appendChild(style);
})();

(function initAds(){
  const config=window.PAK_ADS||{};
  const validClient=/^ca-pub-\d+$/.test(String(config.client||''));
  if(!config.enabled||config.provider!=='adsense'||!validClient)return;
  const script=document.createElement('script');
  script.async=true;script.crossOrigin='anonymous';
  script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;
  document.head.appendChild(script);
  document.querySelectorAll('[data-ad-slot]').forEach(container=>{
    const slot=config.slots?.[container.dataset.adSlot];
    if(!/^\d+$/.test(String(slot||'')))return;
    container.innerHTML=`<ins class="adsbygoogle" style="display:block" data-ad-client="${config.client}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
    try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(_){}
  });
})();

(function addTrustLinks(){
  const footer=document.querySelector('footer .footer-inner');
  if(!footer)return;
  const group=document.createElement('div');group.className='trust-links';
  group.innerHTML='<b>Trust & Info</b><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a><a href="/disclaimer.html">Disclaimer</a>';
  footer.appendChild(group);
  const note=document.createElement('div');note.className='ad-disclosure';note.textContent='Advertising helps support this independent service. Ads never determine result information.';
  footer.parentNode.appendChild(note);
})();

(function loadResultPdf(){const s=document.createElement('script');s.src='/result-pdf.js?v=20260817';s.defer=true;document.head.appendChild(s)})();
