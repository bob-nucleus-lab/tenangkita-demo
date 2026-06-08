const html = document.documentElement;
const phoneFrame = document.getElementById('phoneFrame');
const sections = [...document.querySelectorAll('.app-section')];
const navButtons = [...document.querySelectorAll('[data-nav]')];
const languageButton = document.getElementById('languageButton');
const trustButton = document.getElementById('trustButton');
const trustSheet = document.getElementById('trustSheet');
const sheetScrim = document.getElementById('sheetScrim');
const closeSheet = document.getElementById('closeSheet');
let currentLang = 'ms';
let currentFilter = 'all';

const priceData = {
  shahalam: [
    { item: 'beras', title: 'Beras Tempatan 5kg', place: 'Pasar Seksyen 6 Shah Alam', price: 'RM18.90', note: 'Perlu semak stok dan tarikh hari ini' },
    { item: 'ayam', title: 'Ayam standard / kg', place: 'Pasar Awam Seksyen 16', price: 'RM9.40', note: 'Harga contoh untuk paparan prototaip' },
    { item: 'minyak', title: 'Minyak masak botol 5kg', place: 'Kedai runcit berhampiran', price: 'RM29.90', note: 'Semak rasmi sebelum membeli' },
    { item: 'sayur', title: 'Sayur hijau pilihan', place: 'Pasar tani berhampiran', price: 'RM3.80', note: 'Harga berubah mengikut musim dan lokasi' }
  ],
  putrajaya: [
    { item: 'beras', title: 'Beras Tempatan 5kg', place: 'Presint 8 Putrajaya', price: 'RM19.20', note: 'Data contoh untuk reka bentuk keputusan' },
    { item: 'ayam', title: 'Ayam standard / kg', place: 'Presint 9', price: 'RM9.60', note: 'Sahkan harga di sumber rasmi' },
    { item: 'minyak', title: 'Minyak masak botol 5kg', place: 'Kedai runcit Presint 11', price: 'RM30.10', note: 'Bukan jaminan harga' }
  ],
  kl: [
    { item: 'beras', title: 'Beras Tempatan 5kg', place: 'Kuala Lumpur', price: 'RM19.50', note: 'Contoh lokasi bandar' },
    { item: 'ayam', title: 'Ayam standard / kg', place: 'Kuala Lumpur', price: 'RM9.90', note: 'Perlu semakan rasmi' },
    { item: 'sayur', title: 'Sayur hijau pilihan', place: 'Kuala Lumpur', price: 'RM4.20', note: 'Harga boleh berubah' }
  ]
};

function showScreen(id) {
  sections.forEach(section => section.classList.toggle('active', section.id === id));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.nav === id));
  const main = document.getElementById('app-main');
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
}

function setLanguage(lang) {
  currentLang = lang;
  html.dataset.lang = lang;
  html.lang = lang === 'ms' ? 'ms' : 'en';
  languageButton.textContent = lang === 'ms' ? 'BM' : 'EN';
  languageButton.setAttribute('aria-label', lang === 'ms' ? 'Switch to English' : 'Tukar ke Bahasa Malaysia');
  updatePlanProgress();
  updateCalculator();
}

function renderPrices() {
  const area = document.getElementById('areaSelect')?.value || 'shahalam';
  const list = document.getElementById('priceList');
  if (!list) return;
  const rows = (priceData[area] || []).filter(row => currentFilter === 'all' || row.item === currentFilter);
  list.innerHTML = rows.map(row => `
    <article class="list-item">
      <header>
        <div><b>${row.title}</b><small>${row.place}</small></div>
        <div class="price">${row.price}</div>
      </header>
      <div class="item-meta"><span>${row.note}</span><span>Semak rasmi</span></div>
    </article>
  `).join('') || `<div class="list-item"><b>Tiada paparan</b><small>Sila pilih kategori lain.</small></div>`;
}

function updateCalculator() {
  const rise = Number(document.getElementById('fuelRise')?.value || 0.3);
  const use = Number(document.getElementById('fuelUse')?.value || 180);
  const basket = Number(document.getElementById('basketSpend')?.value || 1456);
  const impact = Math.round(rise * use);
  const pressure = Math.max(0, Math.round((basket - 1200) / 40));
  const score = Math.max(45, Math.min(100, 100 - Math.round(impact / 7) - pressure));

  document.getElementById('fuelRiseValue').textContent = `RM${rise.toFixed(2)}`;
  document.getElementById('fuelUseValue').textContent = `${use}L`;
  document.getElementById('basketSpendValue').textContent = `RM${basket}`;
  document.getElementById('fuelImpact').textContent = `RM${impact}`;
  document.getElementById('familyScore').textContent = score;

  const ms = document.getElementById('fuelSummary');
  const en = document.getElementById('fuelSummaryEn');
  if (score >= 80) {
    ms.textContent = 'Tekanan masih terkawal. Rancang pembelian dan perjalanan untuk 7 hari akan datang.';
    en.textContent = 'Pressure remains manageable. Plan purchases and travel for the next 7 days.';
  } else if (score >= 65) {
    ms.textContent = 'Perlu perhatian. Kurangkan perjalanan tidak mendesak dan semak harga berhampiran sebelum membeli.';
    en.textContent = 'Attention needed. Reduce non-urgent travel and check nearby prices before buying.';
  } else {
    ms.textContent = 'Tekanan meningkat. Utamakan barang asas dan semak sokongan rasmi yang mungkin berkaitan.';
    en.textContent = 'Pressure is rising. Prioritise essentials and check official support that may be relevant.';
  }
}

function updatePlanProgress() {
  const checks = [...document.querySelectorAll('#weeklyPlan input[type="checkbox"]')];
  const done = checks.filter(check => check.checked).length;
  const total = checks.length;
  document.querySelectorAll('.check-item').forEach(item => {
    const input = item.querySelector('input');
    item.classList.toggle('done', Boolean(input?.checked));
  });
  document.getElementById('planProgress').style.width = `${total ? done / total * 100 : 0}%`;
  document.getElementById('planProgressText').textContent = currentLang === 'ms' ? `${done} / ${total} selesai` : `${done} / ${total} done`;
}

function openSheet() {
  phoneFrame.classList.add('sheet-open');
  trustSheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('app-lock');
  closeSheet.focus();
}
function closeTrustSheet() {
  phoneFrame.classList.remove('sheet-open');
  trustSheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('app-lock');
  trustButton.focus();
}

navButtons.forEach(button => button.addEventListener('click', () => showScreen(button.dataset.nav)));
languageButton.addEventListener('click', () => setLanguage(currentLang === 'ms' ? 'en' : 'ms'));
trustButton.addEventListener('click', openSheet);
closeSheet.addEventListener('click', closeTrustSheet);
sheetScrim.addEventListener('click', closeTrustSheet);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && phoneFrame.classList.contains('sheet-open')) closeTrustSheet(); });
document.getElementById('areaSelect')?.addEventListener('change', renderPrices);
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.toggle('active', btn === button));
    renderPrices();
  });
});
['fuelRise', 'fuelUse', 'basketSpend'].forEach(id => document.getElementById(id)?.addEventListener('input', updateCalculator));
document.getElementById('weeklyPlan')?.addEventListener('change', updatePlanProgress);

renderPrices();
updateCalculator();
updatePlanProgress();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
