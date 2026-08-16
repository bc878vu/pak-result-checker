/*
 * Ad configuration
 *
 * To enable Google AdSense later, replace the placeholder publisher ID and
 * add real ad slot IDs. The page is already prepared with top, middle and
 * mobile placements. Until configured, these placements stay as clean
 * reserved spaces and do not use fake ads.
 */
window.PAK_ADS = {
  provider: 'adsense',
  enabled: false,
  client: 'ca-pub-XXXXXXXXXXXXXXXX',
  slots: {
    top: 'XXXXXXXXXX',
    middle: 'XXXXXXXXXX',
    mobile: 'XXXXXXXXXX'
  }
};

(function initAds(){
  const config = window.PAK_ADS || {};
  if (!config.enabled || config.provider !== 'adsense' || !/^ca-pub-\d+$/.test(config.client)) return;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.client)}`;
  document.head.appendChild(script);

  document.querySelectorAll('[data-ad-slot]').forEach((container)=>{
    const slot = config.slots?.[container.dataset.adSlot];
    if (!/^\d+$/.test(String(slot || ''))) return;
    container.innerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-client="${config.client}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
  });
})();
