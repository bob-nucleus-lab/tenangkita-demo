const screens = {
  today: document.getElementById('screen-today'),
  prices: document.getElementById('screen-prices'),
  fuel: document.getElementById('screen-fuel'),
  plan: document.getElementById('screen-plan'),
  check: document.getElementById('screen-check')
};
const navButtons = Array.from(document.querySelectorAll('.bottom-nav button'));
const appScroll = document.getElementById('appScroll');

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle('active', key === name);
  });
  navButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.target === name);
    button.setAttribute('aria-current', button.dataset.target === name ? 'page' : 'false');
  });
  appScroll.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => {
  button.addEventListener('click', () => showScreen(button.dataset.target));
});

const priceData = [
  { item: 'Beras', area: 'Shah Alam', place: 'Pasar Seksyen 13', price: 'RM26.90', distance: '2.1 km', icon: '🌾' },
  { item: 'Ayam', area: 'Shah Alam', place: 'Pasar Tani Stadium', price: 'RM9.40/kg', distance: '3.4 km', icon: '🍗' },
  { item: 'Minyak masak', area: 'Shah Alam', place: 'Kedai Runcit Seksyen 9', price: 'RM6.90', distance: '1.8 km', icon: '🛢️' },
  { item: 'Telur', area: 'Shah Alam', place: 'Pasar Moden', price: 'RM13.20', distance: '2.8 km', icon: '🥚' },
  { item: 'Beras', area: 'Kuala Lumpur', place: 'Pasar Chow Kit', price: 'RM27.50', distance: '4.1 km', icon: '🌾' },
  { item: 'Ayam', area: 'Kuala Lumpur', place: 'Kedai Komuniti', price: 'RM9.70/kg', distance: '2.2 km', icon: '🍗' },
  { item: 'Minyak masak', area: 'Kuala Lumpur', place: 'Pasar Keramat', price: 'RM7.10', distance: '3.1 km', icon: '🛢️' },
  { item: 'Beras', area: 'Johor Bahru', place: 'Pasar Larkin', price: 'RM26.50', distance: '3.9 km', icon: '🌾' },
  { item: 'Ayam', area: 'Johor Bahru', place: 'Pasar Taman Daya', price: 'RM9.30/kg', distance: '5.1 km', icon: '🍗' },
  { item: 'Telur', area: 'Johor Bahru', place: 'Kedai Komuniti', price: 'RM12.90', distance: '2.7 km', icon: '🥚' }
];

const areaSelect = document.getElementById('areaSelect');
const itemSelect = document.getElementById('itemSelect');
const priceList = document.getElementById('priceList');
const savingHint = document.getElementById('savingHint');

function renderPrices() {
  const area = areaSelect.value;
  const item = itemSelect.value;
  const filtered = priceData.filter(row => row.area === area && (item === 'all' || row.item === item));
  priceList.innerHTML = filtered.map(row => `
    <article class="price-item">
      <span class="price-icon" aria-hidden="true">${row.icon}</span>
      <div>
        <h3>${row.item}</h3>
        <p>${row.place} • ${row.distance}</p>
      </div>
      <strong>${row.price}</strong>
    </article>
  `).join('') || '<article class="price-item"><span class="price-icon" aria-hidden="true">🔎</span><div><h3>Tiada data contoh</h3><p>Cuba pilih barang atau kawasan lain.</p></div><strong>—</strong></article>';
  savingHint.textContent = filtered.length >= 3 ? 'RM18 hingga RM42' : 'RM8 hingga RM24';
}

[areaSelect, itemSelect].forEach(control => control.addEventListener('change', renderPrices));
renderPrices();

const distanceInput = document.getElementById('distanceInput');
const daysInput = document.getElementById('daysInput');
const daysValue = document.getElementById('daysValue');
const efficiencyInput = document.getElementById('efficiencyInput');
const fuelPriceInput = document.getElementById('fuelPriceInput');
const fuelCost = document.getElementById('fuelCost');
const fuelMeaning = document.getElementById('fuelMeaning');

function calculateFuel() {
  const distance = Math.max(Number(distanceInput.value) || 0, 0);
  const days = Math.max(Number(daysInput.value) || 0, 0);
  const efficiency = Math.max(Number(efficiencyInput.value) || 1, 1);
  const price = Math.max(Number(fuelPriceInput.value) || 0, 0);
  const monthlyKm = distance * days * 4.33;
  const litres = monthlyKm / efficiency;
  const cost = litres * price;
  daysValue.textContent = days;
  fuelCost.textContent = `RM${cost.toFixed(2)}`;
  fuelMeaning.textContent = cost > 160
    ? 'Perjalanan agak tinggi. Cuba gabungkan urusan pasar, sekolah dan pembayaran dalam satu laluan.'
    : 'Gabungkan urusan kecil untuk mengurangkan perjalanan berulang.';
}

[distanceInput, daysInput, efficiencyInput, fuelPriceInput].forEach(control => control.addEventListener('input', calculateFuel));
calculateFuel();

const weeklyChecklist = document.getElementById('weeklyChecklist');
const checkedCount = document.getElementById('checkedCount');
const progressBar = document.getElementById('progressBar');

function updateChecklist() {
  const checks = Array.from(weeklyChecklist.querySelectorAll('input[type="checkbox"]'));
  const total = checks.length;
  const done = checks.filter(check => check.checked).length;
  checkedCount.textContent = done;
  progressBar.style.width = `${Math.round((done / total) * 100)}%`;
}
weeklyChecklist.addEventListener('change', updateChecklist);
updateChecklist();

const sheet = document.getElementById('trustSheet');
const backdrop = document.getElementById('sheetBackdrop');
const closeSheetButton = document.getElementById('closeSheet');
let lastFocus = null;

function openSheet() {
  lastFocus = document.activeElement;
  sheet.hidden = false;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  closeSheetButton.focus();
}

function closeSheet() {
  sheet.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll('[data-open="trustSheet"]').forEach(button => button.addEventListener('click', openSheet));
closeSheetButton.addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !sheet.hidden) closeSheet();
});

const languageBtn = document.getElementById('languageBtn');
languageBtn.addEventListener('click', () => {
  languageBtn.textContent = languageBtn.textContent === 'BM' ? 'EN' : 'BM';
  languageBtn.setAttribute('aria-label', languageBtn.textContent === 'BM' ? 'Tukar bahasa' : 'Switch language');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
