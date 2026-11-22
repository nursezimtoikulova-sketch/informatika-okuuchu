
{
// ===== Жөндөөлөр: мектеп өзүнө ылайыкташтырат =====
const CFG = {salt: 'NurAisha-2026', teacherPin: '2026', grades: ['5', '7', '8', '9']};

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const shuf = a => {a = [...a]; for (let i = a.length - 1; i > 0; i--) {const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]} return a};
const store = {get(k, d) {try {const v = localStorage.getItem('inf_' + k); return v ? JSON.parse(v) : d} catch (e) {return d}}, set(k, v) {try {localStorage.setItem('inf_' + k, JSON.stringify(v))} catch (e) {}}};
const toast = m => {const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 2200)};
const codeOf = (g, id) => {let h = 5381; for (const c of `${g}|${id}|${CFG.salt}`) h = (h * 33 + c.charCodeAt(0)) >>> 0; return String(1000 + h % 9000)};
const cache = {};
const load = async g => cache[g] || (cache[g] = await fetch(`data/g${g}.json`).then(r => r.json()));
const app = $('#app');
const MODE = document.documentElement.dataset.mode === 't' ? 't' : 's';
let S = store.get('session_' + MODE, null); // мугалим: {role:'t', pin}
let U = MODE === 's' ? store.get('user', null) : null; // окуучу: {login, token, name, grade, prog}
if (MODE === 's' && U) S = {role: 's', name: U.name, grade: U.grade};
const API = async (a, d = {}) => {
  const r = await fetch('api/acc', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({a, ...d})});
  const j = await r.json().catch(() => ({err: 'Сервер жооп бербеди'}));
  if (!r.ok) {const e = new Error(j.err || 'Ката'); e.code = r.status; throw e}
  return j;
};
const prog = () => {U.prog = U.prog || {}; U.prog.open = U.prog.open || {}; U.prog.res = U.prog.res || {}; return U.prog};
let saveT;
const sync = () => {store.set('user', U); clearTimeout(saveT); if (U?.token && U.token !== 'local') saveT = setTimeout(() => API('save', {login: U.login, token: U.token, prog: U.prog, grade: U.grade}).catch(() => toast('Интернет жок — кийин кайра сакталат')), 500)};
function head() {
  $('#who').textContent = S ? (S.role === 't' ? 'Мугалим' : S.name + (S.grade ? ` · ${S.grade}-класс` : '')) : '';
  $('#out').hidden = !S;
}
$('#out').onclick = () => {S = null; U = null; store.set('session_' + MODE, null); store.set('user', null); head(); home()};
$('#home').onclick = () => S?.role === 't' ? teacher() : S?.role === 's' ? student() : home();

// ===== Башкы бет =====
const HERO = `<svg viewBox="0 0 520 380" role="img" aria-label="Ноутбук жана телефон, экранда код жана блоктор">
<defs><linearGradient id="sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a4e"/><stop offset="1" stop-color="#14213d"/></linearGradient></defs>
<ellipse cx="260" cy="350" rx="230" ry="18" fill="#14213d" opacity=".12"/>
<rect x="40" y="40" width="360" height="236" rx="16" fill="#2a3550"/><rect x="54" y="54" width="332" height="208" rx="8" fill="url(#sc)"/>
<path d="M18 286h404l-22 34H40z" fill="#c9ccd6"/><path d="M18 286h404v6H18z" fill="#e6e8ee"/>
<g font-family="JetBrains Mono,monospace" font-size="15"><text x="72" y="88" fill="#ffc93c">def</text><text x="108" y="88" fill="#fff">salam(at):</text>
<text x="92" y="114" fill="#7aa2ff">print</text><text x="140" y="114" fill="#fff">("Салам,", at)</text>
<text x="72" y="148" fill="#ffc93c">for</text><text x="108" y="148" fill="#fff">i in range(3):</text>
<text x="92" y="174" fill="#fff">salam(</text><text x="146" y="174" fill="#9ef0b0">"Айша"</text><text x="196" y="174" fill="#fff">)</text></g>
<rect x="72" y="198" width="140" height="44" rx="8" fill="#0f1626"/><text x="84" y="226" font-family="JetBrains Mono" font-size="14" fill="#9ef0b0">&gt; Салам, Айша</text>
<rect x="330" y="120" width="150" height="230" rx="22" fill="#ffc94a"/><rect x="342" y="140" width="126" height="186" rx="10" fill="#fff"/>
<rect x="354" y="156" width="80" height="26" rx="6" fill="#ffc93c"/><text x="362" y="174" font-family="Inter" font-size="12" font-weight="700" fill="#14213d">баштоо</text>
<rect x="354" y="188" width="100" height="26" rx="6" fill="#7aa2ff"/><text x="362" y="206" font-family="Inter" font-size="12" fill="#fff">10 кадам жыл</text>
<rect x="354" y="220" width="100" height="26" rx="6" fill="#7aa2ff"/><text x="362" y="238" font-family="Inter" font-size="12" fill="#fff">15° бурул</text>
<rect x="354" y="252" width="84" height="26" rx="6" fill="#16a34a"/><text x="362" y="270" font-family="Inter" font-size="12" fill="#fff">кайтала 4</text>
<circle cx="405" cy="306" r="9" fill="#e6e8ee"/></svg>`;

function home() {
  history.replaceState(null, '', location.pathname);
  if (MODE === 't') {
    app.innerHTML = `<section class="hero">${ORBS}<div><div class="who">👩‍🏫 Тойкулова Нурсезим · «НурАиша» ББМ</div><h1>Көрсөт. <em>Ойнот.</em> Үйрөт.</h1><p>Сабактар, коддор, презентациялар жана чоң экранда бүт класс менен ойной турган оюндар.</p>
    <form class="card" id="ft"><label>PIN-код<input id="tp" type="password" inputmode="numeric" placeholder="••••"></label><button class="btn pri" style="margin-top:12px">Кирүү</button></form></div>${HERO}</section>`;
    $('#ft').onsubmit = async e => {e.preventDefault(); const p = $('#tp').value; let ok; try {await API('list', {pin: p}); ok = true} catch (er) {ok = er.code === 401 ? false : p === store.get('pin', CFG.teacherPin)} if (ok) {S = {role: 't', pin: p}; store.set('session_t', S); head(); teacher()} else toast('PIN туура эмес')};
    return;
  }
  app.innerHTML = `<section class="hero">${ORBS}<div><div class="who">💻 Информатика · «НурАиша»</div><h1>Үйрөн. <em>Ойно.</em> Код жаз.</h1>
  <p>Логин жана пароль менен кир — ачкан сабактарың жана жыйынтыктарың сакталат. Телефондон да, компьютерден да кире бересиң.</p>
  <div class="tabs"><button class="on" data-m="in">Кирүү</button><button data-m="reg">Катталуу</button></div>
  <form class="card" id="fa"><div id="regf" hidden><label>Атың жана фамилияң<input id="an" autocomplete="name" placeholder="Айша Токтосунова"></label>
   <label>Классың<select id="ag">${CFG.grades.map(g => `<option value="${g}">${g}-класс</option>`).join('')}</select></label></div>
   <label>Логин (латын тамгалары)<input id="al" autocomplete="username" autocapitalize="off" placeholder="aisha7"></label>
   <label>Пароль<input id="ap" type="password" autocomplete="current-password"></label>
   <button class="btn pri" style="margin-top:12px" id="ab">Кирүү</button><p class="muted">Паролду унутсаң, мугалимге айт — ал жаңысын коюп берет.</p></form></div>${HERO}</section>`;
  let m = 'in';
  $$('[data-m]').forEach(b => b.onclick = () => {m = b.dataset.m; $$('[data-m]').forEach(x => x.classList.toggle('on', x === b)); $('#regf').hidden = m !== 'reg'; $('#ab').textContent = m === 'reg' ? 'Катталуу' : 'Кирүү'});
  $('#fa').onsubmit = async e => {
    e.preventDefault();
    const d = {login: $('#al').value.trim().toLowerCase(), pass: $('#ap').value, name: $('#an').value.trim(), grade: $('#ag').value};
    if (m === 'reg' && !d.name) return toast('Атыңды жаз');
    try {
      const r = await API(m, d); U = {login: r.user.login, token: r.token, name: r.user.name, grade: r.user.grade, prog: r.user.prog};
    } catch (er) {
      if ([400, 401, 409].includes(er.code)) return toast(er.message);
      const loc = store.get('local_' + d.login, null);
      if (m === 'in' && (!loc || loc.pass !== d.pass)) return toast('Сервер жок. Бул түзмөктө мындай аккаунт жок.');
      U = loc ? loc.u : {login: d.login, token: 'local', name: d.name, grade: d.grade, prog: {}};
      if (!loc) store.set('local_' + d.login, {pass: d.pass, u: U});
      toast('Сервер туташкан эмес: маалымат ушул түзмөктө гана сакталат');
    }
    S = {role: 's', name: U.name, grade: U.grade}; sync(); head(); student();
  };
}

async function unlock(c) {
  const gs = [S.grade, ...CFG.grades.filter(x => x !== S.grade)];
  for (const g of gs) {
    const ls = await load(g); const L = ls.find(l => codeOf(g, l.id) === c);
    if (L) {const o = prog().open; o[g] = o[g] || []; if (!o[g].includes(L.id)) o[g].push(L.id); sync(); return [g, L]}
  }
  return null;
}

// ===== Окуучунун бети =====
async function student() {
  if (U.token !== 'local') API('get', {login: U.login, token: U.token}).then(r => {const before = JSON.stringify(U.prog); U.prog = r.user.prog; store.set('user', U); if (before !== JSON.stringify(U.prog) && !$('#pane')) student()}).catch(er => {if (er.code === 401) {toast(er.message); $('#out').click()}});
  const res = prog().res, o = prog().open;
  const parts = [];
  for (const g of CFG.grades) if (o[g]?.length) {const ls = await load(g); parts.push(...o[g].map(id => [g, ls.find(l => l.id === id), ls]).filter(x => x[1]))}
  const stars = Object.values(res).reduce((a, b) => a + Math.round(b / 10), 0);
  app.innerHTML = `<section class="hero slim">${ORBS}<div><div class="who">⭐ ${stars} жылдыз · ${esc(U.grade)}-класс</div><h1>Салам, <em>${esc(U.name.split(' ')[0])}</em>!</h1><p>Мугалим берген кодду жазып, жаңы сабакты ач.</p></div></section>
  <form class="row card" id="fc"><input id="cc" inputmode="numeric" maxlength="4" placeholder="Мугалим берген сабактын коду" style="flex:1;width:auto"><button class="btn pri">Ачуу</button></form>
  <h3 style="margin-top:24px">Менин сабактарым</h3>
  ${parts.length ? parts.map(([g, l, ls]) => `<div class="lesson"><div class="n" ${thumb(l.title)}><span>${ls.indexOf(l) + 1}</span></div><div><div class="t">${esc(l.title)}</div><div class="muted">${g}-класс · ${res[g + l.id] != null ? 'эң жакшы жыйынтык: ' + res[g + l.id] + '%' : 'оюн ойной элексиң'}</div></div><div class="acts"><button class="btn sm pri" data-o="${g}|${l.id}">Ачуу</button></div></div>`).join('') : '<p class="muted">Азырынча ачык сабак жок. Мугалим берген 4 орундуу кодду жогоруга жаз.</p>'}`;
  $('#fc').onsubmit = async e => {e.preventDefault(); const r = await unlock($('#cc').value.replace(/\D/g, '')); r ? lesson(r[0], r[1]) : toast('Мындай код жок. Цифраларды текшер.')};
  $$('[data-o]').forEach(b => b.onclick = () => {const [g, id] = b.dataset.o.split('|'); const p = parts.find(x => x[0] === g && x[1].id === id); lesson(g, p[1])});
}
async function teacher(g = store.get('tg', '9')) {
  store.set('tg', g);
  app.innerHTML = '<p class="muted">Жүктөлүүдө…</p>';
  const ls = await load(g);
  app.innerHTML = `<section class="hero slim">${ORBS}<div><div class="who">👩‍🏫 Мугалимдин бөлмөсү</div><h1>${g}-класс: <em>${ls.length} сабак</em></h1><div class="stat"><div>📖 ${ls.reduce((a, l) => a + l.slides.length, 0)} слайд</div><div>🔤 ${ls.reduce((a, l) => a + l.terms.length, 0)} термин</div><div>🎮 8 класс оюну</div></div></div></section><div class="row"><h2 style="margin:0;flex:1">Сабактар жана коддор</h2><button class="btn sm" id="stu">👩‍🎓 Окуучулар</button><button class="btn sm" id="pin">PIN өзгөртүү</button></div>
  <div class="tabs">${CFG.grades.map(x => `<button class="${x === g ? 'on' : ''}" data-g="${x}">${x}-класс</button>`).join('')}</div>
  <p class="muted">Сабактын кодун тактага жазыңыз же «Кодду көрсөтүү» басыңыз. Окуучу ошол код менен сабакты ачат. Ар бир класстын коддору башка.</p>
  ${ls.map((l, i) => `<div class="lesson"><div class="n" ${thumb(l.title)}><span>${i + 1}</span></div><div><div class="t">${esc(l.title)}${l.book ? '<span class="tag">китептен</span>' : ''}${l.seminar ? '<span class="tag">семинар</span>' : ''}</div>
   <div class="muted">${l.slides.length + 2} слайд · ${l.terms.length} термин · практика: ${PNAME[l.practice] || '—'}</div></div>
   <div class="acts row"><span class="code">${codeOf(g, l.id)}</span><button class="btn sm pri" data-s="${l.id}">▶ Презентация</button><button class="btn sm" data-o="${l.id}">Сабак</button><button class="btn sm" data-c="${l.id}">Кодду көрсөтүү</button></div></div>`).join('')}`;
  $$('[data-g]').forEach(b => b.onclick = () => teacher(b.dataset.g));
  $$('[data-o]').forEach(b => b.onclick = () => lesson(g, ls.find(l => l.id === b.dataset.o)));
  $$('[data-s]').forEach(b => b.onclick = () => present(ls.find(l => l.id === b.dataset.s), g));
  $$('[data-c]').forEach(b => b.onclick = () => {const l = ls.find(x => x.id === b.dataset.c); showCode(g, l)});
  $('#stu').onclick = () => students();
  $('#pin').onclick = () => {
    const f = document.createElement('form'); f.className = 'card row'; f.innerHTML = '<input id="np" inputmode="numeric" placeholder="Жаңы PIN (ушул түзмөк үчүн)" style="flex:1;width:auto"><button class="btn pri">Сактоо</button>';
    app.prepend(f); f.onsubmit = e => {e.preventDefault(); const v = $('#np').value.trim(); if (v.length >= 4) {store.set('pin', v); toast('PIN сакталды'); f.remove()}};
  };
}
function showCode(g, l) {
  const sh = $('#show'); sh.classList.add('on');
  $('.sl', sh).innerHTML = `<div class="cover" style="text-align:center"><div class="k">${g}-класс · сабактын коду</div><h1 style="font-size:clamp(70px,16vw,200px);font-family:'JetBrains Mono';color:var(--yel)">${codeOf(g, l.id)}</h1><p>${esc(l.title)}</p><p style="opacity:.7">Сайтка кир → атыңды жаз → классыңды танда → кодду жаз</p></div>`;
  $('.cnt', sh).textContent = ''; $('.bar i', sh).style.width = '100%'; deck = null;
}

// ===== Мугалим: окуучулардын тизмеси =====
async function students() {
  app.innerHTML = '<button class="btn sm" id="back">← Артка</button><h2 style="margin-top:14px">Окуучулар жана жыйынтыктар</h2><div id="sl" class="muted">Жүктөлүүдө…</div>';
  $('#back').onclick = () => teacher();
  try {
    const r = await API('list', {pin: S.pin});
    const all = {}; for (const g of CFG.grades) all[g] = await load(g);
    const us = r.users.sort((a, b) => (a.grade + a.name).localeCompare(b.grade + b.name, 'ky'));
    $('#sl').className = 'content';
    $('#sl').innerHTML = us.length ? `<table><tr><th>Класс</th><th>Аты</th><th>Логин</th><th>Ачкан сабактары</th><th>Орточо</th><th></th></tr>${us.map(u => {const res = u.prog?.res || {}, v = Object.values(res); const n = Object.values(u.prog?.open || {}).flat().length;
      return `<tr><td>${esc(u.grade)}</td><td>${esc(u.name)}</td><td>${esc(u.login)}</td><td>${n}</td><td>${v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) + '%' : '—'}</td><td><button class="btn sm" data-r="${esc(u.login)}">Пароль</button></td></tr>`}).join('')}</table>` : '<p>Азырынча катталган окуучу жок.</p>';
    $$('[data-r]').forEach(b => b.onclick = async () => {const np = String(1000 + Math.floor(Math.random() * 9000)); try {await API('reset', {pin: S.pin, login: b.dataset.r, pass: np}); b.outerHTML = `<b>Жаңы пароль: ${np}</b>`} catch (e) {toast(e.message)}});
  } catch (e) {$('#sl').textContent = e.code === 401 ? 'Сервердеги TEACHER_PIN сиздин PIN менен дал келбейт.' : 'Сервер туташкан эмес (Vercel + Upstash жөндөлгөндөн кийин иштейт).'}
}

// ===== Мугалим: чоң экрандагы класс оюндары =====
const ORBS = '<i class="orb a"></i><i class="orb b"></i><i class="orb c"></i>';
const word = t => t.replace(/\s*\(.*?\)\s*/g, ' ').trim();
const KYAB = 'АБВГДЕЁЖЗИЙКЛМНҢОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ'.split('');
function classMenu(pane, g, L) {
  const T = L.terms.filter(t => t.d.length < 200);
  const W = T.filter(t => word(t.t).length <= 16 && word(t.t).length >= 3);
  const sort = SORTS[L.practice];
  const G = [['cards', '🃏', 'Флешкарталар', 'Сабактын башында терминдерди кайталоо: термин → басса, аныктамасы.', T.length >= 1], ['race', '🏆', 'Класс жарышы', 'Аныктама жана 4 жооп. Биринчи туура айткан топко упай.', T.length >= 4],
    ['tf', '✋', 'Чынбы, жалганбы?', 'Чын — колду көтөр, жалган — отур. Бүт класс катышат.', T.length >= 4],
    ['board', '🎯', 'Упай тактасы', '16 карточка, 100–400 упай. Топ карточка тандап, суроого жооп берет.', T.length >= 4],
    ['ana', '🔀', 'Анаграмма', 'Тамгалары аралашкан терминди топтор тезирээк табат.', W.length >= 3],
    ['hang', '🔤', 'Сөздү тап', 'Топтор кезек менен тамга айтат. 6 катага чейин уруксат.', W.length >= 3],
    ['wheel', '🎡', 'Кокус дөңгөлөк', 'Окуучунун номерин же топту кокус тандайт — ал суроого жооп берет.', true],
    ['timer', '⏱️', 'Таймер', 'Чоң экрандагы таймер: 30 сек, 1, 2, 5 мүнөт.', true],
    ['sort', '🧺', 'Иргөө тактада', 'Окуучулар кезек менен чыгып, нерселерди туура топко бөлүшөт.', !!sort]];
  pane.innerHTML = `<div class="row" style="margin-bottom:12px"><b>Топтордун саны:</b><select id="tn" style="width:auto">${[2, 3, 4].map(n => `<option>${n}</option>`).join('')}</select></div>
  <div class="cards">${G.filter(x => x[4]).map(([k, e, n, d]) => `<div class="card lift"><div class="ico">${e}</div><h3>${n}</h3><p class="muted">${d}</p><button class="btn pri" data-c="${k}">Баштоо</button></div>`).join('')}</div>`;
  $$('[data-c]', pane).forEach(b => b.onclick = () => {
    const n = +$('#tn', pane).value, k = b.dataset.c;
    const sh = $('#show'); sh.classList.add('on'); deck = null; $('.cnt', sh).textContent = ''; $('.bar i', sh).style.width = '0';
    const box = $('.sl', sh); box.className = 'sl'; box.style.color = '';
    if (k === 'sort') {box.classList.add('light'); return sortG(box, T, g, L, sort)}
    if (k === 'race' || k === 'tf') return classRace(k, n, T);
    const WK = W.filter(t => /^[А-ЯЁӨҮҢа-яёөүң\s-]+$/.test(word(t.t)));
    ({cards: (b, n, t) => classCards(b, n, L.terms), board: classBoard, ana: classWord, hang: classWord, wheel: classWheel, timer: classTimer})[k](box, n, k === 'hang' ? (WK.length >= 3 ? WK : W) : k === 'ana' ? W : T, k);
  });
}
const TCOL = ['#d7263d', '#2f6fdb', '#e0a400', '#1f9a5a'];
function teamsBar(box, pts, onAdd) {
  box.insertAdjacentHTML('beforeend', `<div class="row teams">${pts.map((p, j) => `<button class="btn" data-p="${j}" style="background:${TCOL[j]};box-shadow:0 5px 0 rgba(0,0,0,.35)">${j + 1}-топ · <b>${p}</b></button>`).join('')}</div>`);
  $$('[data-p]', box).forEach(b => b.onclick = () => onAdd(+b.dataset.p));
}
const nextBtn = (box, txt, fn) => {box.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center;margin-top:18px"><button class="btn ghost-d" id="nx2">${txt}</button></div>`); $('#nx2', box).onclick = fn};
function classBoard(box, n, T) {
  const pts = Array(n).fill(0), qs = shuf(T).slice(0, 16), used = new Set();
  const board = () => {
    box.innerHTML = `<h2>🎯 Упай тактасы</h2><div class="jboard">${qs.map((q, i) => `<button data-i="${i}" ${used.has(i) ? 'disabled' : ''}>${used.has(i) ? '✓' : (i % 4 + 1) * 100}</button>`).join('')}</div>`;
    teamsBar(box, pts, j => {pts[j]++; board()});
    $$('[data-i]', box).forEach(b => b.onclick = () => ask(+b.dataset.i));
  };
  const ask = (i, shown) => {
    const q = qs[i], val = (i % 4 + 1) * 100;
    box.innerHTML = `<div class="k">${val} упай</div><h2>Бул эмне?</h2><p>«${esc(q.d)}»</p>${shown ? `<h1 class="ans">${esc(q.t)}</h1>` : ''}`;
    if (!shown) return nextBtn(box, 'Жоопту көрсөтүү', () => ask(i, true));
    box.insertAdjacentHTML('beforeend', '<p style="text-align:center;opacity:.8">Кайсы топ туура жооп берди?</p>');
    teamsBar(box, pts, j => {pts[j] += val; used.add(i); board()});
    nextBtn(box, 'Эч ким — тактага кайтуу', () => {used.add(i); board()});
  };
  board();
}
function classWord(box, n, W, mode) {
  const pts = Array(n).fill(0), qs = shuf(W).slice(0, 8); let i = 0;
  const step = () => {
    if (i >= qs.length) return over(box, pts, () => classWord(box, n, W, mode));
    const q = qs[i], w = word(q.t).toUpperCase();
    if (mode === 'ana') {
      let mix; do {mix = shuf([...w.replace(/\s/g, '')]).join('')} while (mix === w.replace(/\s/g, '') && w.length > 2);
      const draw = shown => {box.innerHTML = `<div class="k">${i + 1} / ${qs.length} · Анаграмма</div><div class="tiles">${[...(shown ? w : mix)].map(c => `<span>${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</div><p class="hint">💡 ${esc(q.d)}</p>`;
        if (!shown) return nextBtn(box, 'Жоопту көрсөтүү', () => draw(true));
        teamsBar(box, pts, j => {pts[j]++; i++; step()}); nextBtn(box, 'Кийинки →', () => {i++; step()})};
      draw(false);
    } else {
      const got = new Set(), bad = new Set();
      const draw = () => {
        const win = [...w].every(c => !/[А-ЯЁӨҮҢA-Z]/.test(c) || got.has(c)), lose = bad.size >= 6;
        box.innerHTML = `<div class="k">${i + 1} / ${qs.length} · Сөздү тап · ката: ${bad.size}/6</div><div class="tiles">${[...w].map(c => `<span class="${c === ' ' ? 'sp' : ''}">${c === ' ' ? '&nbsp;' : (got.has(c) || lose || !/[А-ЯЁӨҮҢA-Z]/.test(c) ? esc(c) : '&nbsp;')}</span>`).join('')}</div><p class="hint">💡 ${esc(q.d)}</p>
        ${win || lose ? `<h2 style="text-align:center">${win ? '🎉 Табылды!' : '😅 Жооп: ' + esc(w)}</h2>` : `<div class="abc">${[...KYAB, ...(/[A-Z]/.test(w) ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') : [])].map(c => `<button data-l="${c}" ${got.has(c) || bad.has(c) ? 'disabled' : ''} class="${bad.has(c) ? 'no' : got.has(c) ? 'ok' : ''}">${c}</button>`).join('')}</div>`}`;
        $$('[data-l]', box).forEach(b => b.onclick = () => {const c = b.dataset.l; (w.includes(c) ? got : bad).add(c); draw()});
        if (win || lose) {teamsBar(box, pts, j => {pts[j]++; i++; step()}); nextBtn(box, 'Кийинки сөз →', () => {i++; step()})}
      };
      draw();
    }
  };
  step();
}
function over(box, pts, again) {
  const mx = Math.max(...pts);
  box.innerHTML = `<div class="cover" style="text-align:center"><div class="k">Оюн бүттү</div><h1>🏆 Жеңүүчү: ${pts.map((p, j) => p === mx ? j + 1 + '-топ' : '').filter(Boolean).join(', ')}</h1></div>`;
  teamsBar(box, pts, () => {}); nextBtn(box, 'Кайра ойноо', again);
}
function classWheel(box, n) {
  box.innerHTML = `<h2>🎡 Кокус дөңгөлөк</h2><div class="row" style="justify-content:center"><label>Эмнени тандайт:<select id="wm" style="width:auto"><option value="s">Окуучунун номери</option><option value="t">Топ</option></select></label><label>Окуучулар саны:<input id="wc" type="number" value="15" min="2" max="40" style="width:90px"></label></div>
  <div class="wheel"><canvas id="wh" width="440" height="440"></canvas><i class="pin"></i></div><h1 id="wr" style="text-align:center;min-height:1.2em"></h1>`;
  const cv = $('#wh', box), c = cv.getContext('2d'); let rot = 0;
  const items = () => $('#wm', box).value === 't' ? Array.from({length: n}, (_, i) => i + 1 + '-топ') : Array.from({length: Math.max(2, Math.min(40, +$('#wc', box).value || 15))}, (_, i) => String(i + 1));
  const draw = () => {const it = items(), a = 2 * Math.PI / it.length; c.clearRect(0, 0, 440, 440);
    it.forEach((t, i) => {c.beginPath(); c.moveTo(220, 220); c.arc(220, 220, 210, rot + i * a, rot + (i + 1) * a); c.fillStyle = ['#0d5c8c', '#ffc94a', '#18c79a', '#ff7a6b', '#2a8bc4', '#f08a24'][i % 6]; c.fill();
      c.save(); c.translate(220, 220); c.rotate(rot + (i + .5) * a); c.fillStyle = '#fff'; c.font = `800 ${it.length > 20 ? 15 : 22}px Nunito`; c.textAlign = 'right'; c.fillText(t, 195, 8); c.restore()});
    c.beginPath(); c.arc(220, 220, 26, 0, 7); c.fillStyle = '#fffaf5'; c.fill()};
  draw(); $('#wm', box).onchange = draw; $('#wc', box).oninput = draw;
  nextBtn(box, '🎡 Айландыруу', () => {
    const it = items(), a = 2 * Math.PI / it.length, total = 8 * Math.PI + Math.random() * 2 * Math.PI, st = rot, t0 = performance.now();
    $('#wr', box).textContent = '';
    const an = now => {const p = Math.min(1, (now - t0) / 3500); rot = st + total * (1 - (1 - p) ** 3); draw();
      if (p < 1) return requestAnimationFrame(an);
      const ang = ((-Math.PI / 2 - rot) % (2 * Math.PI) + 4 * Math.PI) % (2 * Math.PI); $('#wr', box).textContent = '👉 ' + it[Math.floor(ang / a)]};
    requestAnimationFrame(an);
  });
}
function classCards(box, n, T) {
  const set = shuf(T); let i = 0, back = false;
  const draw = () => {
    $('.cnt', $('#show')).textContent = `${i + 1} / ${set.length}`; $('.bar i', $('#show')).style.width = ((i + 1) / set.length * 100) + '%';
    box.innerHTML = `<div class="k">🃏 Терминдерди кайталайбыз</div><div class="bigcard ${back ? 'back' : ''}" id="bc">${back ? `<p>${esc(set[i].d)}</p>` : `<h1>${esc(set[i].t)}</h1><p class="hint">Бул эмне? Ойлонуп көргүлө… (басыңыз)</p>`}</div><figure id="bf"></figure>`;
    $('#bc', box).onclick = () => {back = !back; draw()};
    nextBtn(box, i < set.length - 1 ? 'Кийинки термин →' : 'Башынан баштоо ↺', () => {i = (i + 1) % set.length; back = false; draw()});
    if (back) findImg(set[i].t).then(im => {if (im && $('#bf', box)) $('#bf', box).outerHTML = fig(im)});
  };
  draw();
}
function classTimer(box) {
  let left = 60, tm = null;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  box.innerHTML = `<h2 style="text-align:center">⏱️ Таймер</h2><div class="bigtime" id="bt">${fmt(left)}</div><div class="row" style="justify-content:center">${[30, 60, 120, 300].map(s => `<button class="btn ghost-d" data-s="${s}">${s < 60 ? s + ' сек' : s / 60 + ' мүн'}</button>`).join('')}<button class="btn pri" id="go">▶ Баштоо</button></div>`;
  const show = () => {const b = $('#bt', box); if (!b) return clearInterval(tm); b.textContent = fmt(left); b.classList.toggle('end', left <= 5)};
  $$('[data-s]', box).forEach(b => b.onclick = () => {clearInterval(tm); left = +b.dataset.s; show()});
  $('#go', box).onclick = () => {clearInterval(tm); tm = setInterval(() => {left = Math.max(0, left - 1); show(); if (!left) {clearInterval(tm); $('#bt', box) && ($('#bt', box).textContent = '⏰ Убакыт бүттү!')}}, 1000)};
}
function classRace(mode, n, T) {
  const sh = $('#show'), box = $('.sl', sh), cols = ['#c8102e', '#1d4ed8', '#16a34a', '#d97706'];
  const pts = Array(n).fill(0), qs = shuf(T).slice(0, 10); let i = 0, shown = false;
  const step = () => {
    $('.bar i', sh).style.width = (i / qs.length * 100) + '%';
    const teams = `<div class="row" style="justify-content:center;gap:14px;margin-top:26px">${pts.map((p, j) => `<button class="btn" data-p="${j}" style="background:${cols[j]};border-color:${cols[j]};color:#fff;min-width:150px;font-size:22px">${j + 1}-топ: ${p}</button>`).join('')}</div>`;
    if (i >= qs.length) {const mx = Math.max(...pts); box.innerHTML = `<div class="cover" style="text-align:center"><div class="k">Оюн бүттү</div><h1>🏆 Жеңүүчү: ${pts.map((p, j) => p === mx ? j + 1 + '-топ' : '').filter(Boolean).join(', ')}</h1>${teams}<p style="margin-top:20px"><button class="btn" id="again" style="color:#fff;border-color:#fff;background:transparent">Кайра ойноо</button></p></div>`; $('#again', box).onclick = () => classRace(mode, n, T); return}
    const q = qs[i];
    if (mode === 'race') {
      const opts = q.opts || (q.opts = shuf([q, ...shuf(T.filter(x => x !== q)).slice(0, 3)]));
      box.innerHTML = `<h2>${i + 1}. Бул эмне?</h2><p>«${esc(q.d)}»</p><div class="opts">${opts.map((o, j) => `<button class="${shown && o === q ? 'ok' : ''}">${'ABCD'[j]}) ${esc(o.t)}</button>`).join('')}</div>${teams}`;
    } else {
      const fake = q.fake ?? (q.fake = Math.random() < .5 ? shuf(T.filter(x => x !== q))[0].d : null);
      box.innerHTML = `<h2>${i + 1}. Чынбы, жалганбы?</h2><p><b style="color:var(--yel)">${esc(q.t)}</b> — ${esc(fake || q.d)}</p>${shown ? `<h1 style="color:${fake ? '#ff8a8a' : '#7ee2a0'}">${fake ? '✗ ЖАЛГАН' : '✓ ЧЫН'}</h1>${fake ? `<p style="opacity:.8">Туурасы: ${esc(q.d)}</p>` : ''}` : ''}${teams}`;
    }
    box.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center;margin-top:18px"><button class="btn" id="rv" style="color:#fff;border-color:#fff;background:transparent">${shown ? 'Кийинки суроо →' : 'Жоопту көрсөтүү'}</button></div>`);
    $('#rv', box).onclick = () => {if (shown) {shown = false; i++} else shown = true; step()};
    $$('[data-p]', box).forEach(b => b.onclick = () => {pts[b.dataset.p]++; step()});
  };
  step();
}

// ===== Реалдуу сүрөттөр (Wikipedia) =====
const IMGMAP = [[/процессор|CPU|АЛУ/i, 'Central_processing_unit'], [/RAM|оперативдүү/i, 'Random-access_memory'], [/ROM|туруктуу эс/i, 'Read-only_memory'], [/SSD/, 'Solid-state_drive'], [/HDD|катуу диск/i, 'Hard_disk_drive'], [/эс тутум/i, 'Computer_memory'],
 [/Windows/, 'Windows_11'], [/macOS/, 'MacOS'], [/Linux/, 'Linux'], [/Android/, 'Android_(operating_system)'], [/iOS/, 'IOS'], [/операциялык систем/i, 'Operating_system'],
 [/файлдык систем|папка/i, 'Directory_(computing)'], [/файл/i, 'Computer_file'], [/флешка|USB/i, 'USB_flash_drive'], [/клавиатура/i, 'Computer_keyboard'], [/чычкан/i, 'Computer_mouse'], [/монитор/i, 'Computer_monitor'], [/принтер/i, 'Printer_(computing)'],
 [/Венн/i, 'Venn_diagram'], [/чындык таблица/i, 'Truth_table'], [/логика/i, 'Logic_gate'], [/экилик|бинардык/i, 'Binary_number'],
 [/Scratch/i, 'Scratch_(programming_language)'], [/Python/i, 'Python_(programming_language)'], [/SQL|маалыматтар базасы/i, 'Database'], [/HTML/, 'HTML'], [/CSS/, 'CSS'],
 [/Arduino/i, 'Arduino'], [/робот/i, 'Robot'], [/сенсор/i, 'Sensor'], [/Tinkercad/i, 'Tinkercad'], [/SketchUp/i, 'SketchUp'], [/Simulink/i, 'Simulink'], [/3D/i, '3D_printing'],
 [/почта|e-mail|Gmail/i, 'Email'], [/Google Drive/i, 'Google_Drive'], [/Google/i, 'Google'], [/видео/i, 'Video_editing'], [/prompt|жасалма интеллект|ЖИ\b|\bAI\b|ChatGPT/i, 'Artificial_intelligence'], [/deepfake/i, 'Deepfake'],
 [/роутер|маршрутизатор|Wi-Fi/i, 'Router_(computing)'], [/топология/i, 'Network_topology'], [/интернет/i, 'Internet'], [/тармак/i, 'Computer_network'],
 [/фишинг/i, 'Phishing'], [/пароль/i, 'Password'], [/шифр/i, 'Caesar_cipher'], [/кибер|коопсуздук|вирус/i, 'Computer_security'],
 [/смартфон|мобилдик|телефон/i, 'Smartphone'], [/социалдык|мессенджер/i, 'Social_media'], [/командалык|CLI/i, 'Command-line_interface'], [/графикалык интерфейс|GUI/i, 'Graphical_user_interface'],
 [/Paint|сүрөт тарт/i, 'Microsoft_Paint'], [/Word|тексттик редактор/i, 'Microsoft_Word'], [/алгоритм|блок-схема/i, 'Flowchart'], [/модел/i, 'Scale_model'], [/глобус/i, 'Globe'],
 [/матрица/i, 'Matrix_(mathematics)'], [/сортто/i, 'Sorting_algorithm'], [/рекурсия/i, 'Recursion'], [/VR|виртуалдык реал/i, 'Virtual_reality'], [/энергия|күн панел/i, 'Solar_panel'], [/фейк|жалган маалымат/i, 'Fake_news'], [/компьютер/i, 'Personal_computer']];
const LOCAL = [[/Scratch/i, 'scratch'], [/HTML|CSS|веб-барак/i, 'html'], [/SQL|маалыматтар базасы/i, 'sql'], [/Arduino|жарык диод/i, 'arduino'], [/Paint|сүрөт тартуу/i, 'paint'], [/видео/i, 'video'], [/Tinkercad|SketchUp|3D/i, 'tinker'], [/командалык|CLI\b|терминал/i, 'terminal'], [/экилик|0 жана 1|бит\b|байт/i, 'binary'], [/процессор|CPU|АЛУ/i, 'cpu'], [/шифр|ЭСКТ/i, 'cipher'], [/фейк|жалган маалымат|спам/i, 'fake'], [/виртуалдык реал|\bVR\b/i, 'vr'], [/энергия|күн панел/i, 'solar'], [/ЖАНА \(AND\)|^ЖАНА\b/, 'and_table'], [/ЖЕ \(OR\)|^ЖЕ\b/, 'or_table'], [/ЭМЕС \(NOT\)|^ЭМЕС\b/, 'not_table'], [/чындык таблица/i, 'truth_table'], [/логикалык операция|логикалык элемент|компьютердин логикасы/i, 'gates'], [/Венн/i, 'venn'],
 [/ой жүгүртүү|логика деген|логика жана/i, 'thinking'], [/шарт|if \/ else|тармактануу/i, 'condition'], [/алгоритм|блок-схема/i, 'flowchart'], [/python/i, 'python'], [/программалоо|код жазуу|программист/i, 'coding'],
 [/RAM|оперативдүү/i, 'ram'], [/HDD/, 'hdd_ssd'], [/SSD|катуу диск/i, 'ssd'], [/флешка|USB|эс тутум карта|сактагыч|компьютерде файлдар кайда/i, 'storage'], [/эс тутум/i, 'ram'],
 [/операциялык системалардын түрлөрү|Windows, macOS|macOS|Linux/i, 'os_logos'], [/Windows/, 'laptop_win'], [/операциялык систем|\bОС\b|\bOS\b/i, 'desktop_os'], [/иш столу|Рабочий стол|графикалык интерфейс|GUI/i, 'desktop_screen'],
 [/файлдык система/i, 'filesystem'], [/кеңейтүү|файл деген|файлдын түр/i, 'extensions'], [/папка|проводник/i, 'explorer'], [/көчүрүү|Copy/i, 'copy'], [/файлдар менен иштөө|контексттик|атын өзгөртүү|өчүрүү/i, 'file_menu'],
 [/процессор|CPU|АЛУ/i, 'hardware'], [/аппараттык|Hardware|принтер|түзүлүштөр/i, 'hardware'], [/клавиатура|чычкан|киргизүү түзүлүш|чыгаруу түзүлүш/i, 'input_devices'], [/ноутбук/i, 'laptop'],
 [/программалык камсыздоо|Software|акысыз|акы төлөнүүчү|колдонмо|программалар/i, 'programs'], [/Word|Excel|PowerPoint|тексттик редактор|Paint/i, 'programs'],
 [/маалыматтын түрлөрү|тексттик маалымат|графикалык маалымат|үн маалымат|видео маалымат|мультимедиа/i, 'media_files'],
 [/модель|моделдештирүү|моделдөө/i, 'model_globe'], [/математикалык модель|диаграмма|график/i, 'model_chart'],
 [/жасалма интеллект кандай|нейрон|машиналык үйрөнүү/i, 'ai_laptop'], [/prompt|ChatGPT|\bAI\b|чат-бот/i, 'ai_robot'], [/жасалма интеллект|ЖИ\b/i, 'ai_brain'], [/робот/i, 'robot'], [/интернет буюм|IoT|үн жардамчы|акылдуу/i, 'smart_speaker'],
 [/булут|Google Drive|cloud/i, 'cloud'], [/почта|e-mail|Gmail|кат жаз/i, 'email'], [/роутер|маршрутизатор|Wi-Fi/i, 'router'], [/тармак|топология|LAN|WAN/i, 'network'], [/интернет/i, 'globe_net'],
 [/социалдык|мессенджер|баарлашуу/i, 'social'], [/мобилдик түзүлүш|планшет/i, 'phone_tablet'], [/смартфон|мобилдик/i, 'phones'], [/телефон|тиркеме/i, 'phone'],
 [/пароль|аутентификация/i, 'password'], [/фишинг|хакер|вирус|алдамчы|коркунуч|спам|фейк/i, 'hacker'], [/маалыматты коргоо|экран кулпу|жеке маалымат/i, 'security_phone'], [/антивирус|коргоо/i, 'shield_check'], [/кибер|коопсуздук|шифр|ЭСКТ/i, 'shield_lock'],
 [/практикалык иш|компьютердик класс/i, 'computer_class'], [/тест|текшерүү|тапшырма/i, 'checklist'], [/окуучу/i, 'student'], [/компьютер/i, 'desktop']];
const WEBP = new Set(["ai_brain", "ai_laptop", "ai_robot", "and_table", "checklist", "cloud", "coding", "computer_class", "condition", "copy", "desktop", "desktop_os", "desktop_screen", "email", "explorer", "extensions", "file_menu", "filesystem", "flowchart", "gates", "globe_net", "hacker", "hacker2", "hardware", "hdd_ssd", "input_devices", "laptop", "laptop_win", "media_files", "model_chart", "model_globe", "network", "not_table", "or_table", "os_logos", "password", "phone", "phone_tablet", "phones", "programs", "python", "ram", "robot", "router", "security_phone", "shield", "shield_check", "shield_lock", "smart_speaker", "social", "ssd", "storage", "student", "teacher", "thinking", "truth_table", "venn", "venn2"]);
const localImg = t => {const m = LOCAL.find(([r]) => r.test(t || '')); return m ? {src: 'photos/' + m[1] + '.jpg', fb: WEBP.has(m[1]) ? 'img/' + m[1] + '.webp' : '', local: m[1]} : null};
const thumb = t => ''; const thumbOld = t => {const m = localImg(t); return m ? `style="background-image:url(${m.src})${m.fb ? `,url(${m.fb})` : ''}"` : ''};
const findImg = async t => null;
const imgTitle = t => (IMGMAP.find(([r]) => r.test(t || '')) || [])[1];
const imgCache = store.get('imgs', {});
async function wikiImg(title) {
  if (!title) return null;
  if (title in imgCache) return imgCache[title];
  try {
    const j = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title)).then(r => r.json());
    const src = j.originalimage?.source && j.originalimage.width <= 2400 ? j.originalimage.source : j.thumbnail?.source?.replace(/\/\d+px-/, '/800px-');
    imgCache[title] = src ? {src, page: j.content_urls?.desktop?.page || ''} : null;
  } catch (e) {return null}
  store.set('imgs', imgCache); return imgCache[title];
}
const fig = im => `<figure class="ph${im.local ? ' il' : ''}"><img src="${esc(im.src)}" data-f="${esc(im.fb || '')}" alt="" loading="lazy" onerror="if(this.dataset.f){this.src=this.dataset.f;this.dataset.f=''}else this.closest('figure').remove()">${im.local ? '' : '<figcaption>Сүрөт: Wikipedia</figcaption>'}</figure>`;
async function addImgs(root, L) {
  return;
  const used = new Set(); let n = 0;
  for (const h of $$('h3', root)) {
    if (n >= 10) break;
    const loc = localImg(h.textContent), key = loc?.local || imgTitle(h.textContent);
    if (!key || used.has(key)) continue; used.add(key);
    const im = loc || await wikiImg(key); if (im && root.isConnected) {h.insertAdjacentHTML('afterend', fig(im)); n++}
  }
}

// ===== Сабак =====
const PNAME = {python: 'Python', scratch: 'Scratch-блоктор', html: 'HTML/CSS редактор', sql: 'SQL', logic: 'Логикалык элементтер', email: 'Кат жазуу', prompt: 'Prompt куруучу', cli: 'Командалык сап', paint: 'Сүрөт тартуу', text: 'Текст редактору', order: 'Алгоритм түзүү', files: 'Файлдарды иргөө', soft: 'Программаларды иргөө', pc: 'Компьютердин бөлүктөрү', net: 'Тармак', cyber: 'Коопсуздук', fake: 'Фейкти табуу', caesar: 'Шифрлөө', robot: 'Жарык диоддору', tinker: '3D/схема шилтемелери', binary: 'Экилик которгуч', util: 'Программаларды иргөө', mobile: 'Компьютер vs смартфон', sheet: 'Мини-таблица', video: 'Видео монтаж', none: '—'};
const isT = () => S?.role === 't';
function lesson(g, L, tab = 'learn') {
  const hideForS = s => s.k === 'teacher' || s.k === 'slides' || s.k === 'test' || /жооп|мугалим/i.test(s.t);
  const secs = L.sections.filter(s => isT() || !hideForS(s));
  const theory = secs.filter(s => s.k === 'theory'), tasks = secs.filter(s => s.k !== 'theory');
  const T = isT() ? [['learn', '📖 Сабак'], ['key', '⭐ Негизги'], ['class', '🎮 Класс оюндары'], ['prac', '💻 Практика'], ['tasks', '📝 Суроо, тест, план']] : [['learn', '📖 Сабак'], ['key', '⭐ Негизги'], ['games', '🃏 Флешкарта жана оюндар'], ['prac', '💻 Практика'], ['tasks', '📝 Тапшырмалар']];
  app.innerHTML = `<button class="btn sm" id="back">← Артка</button>
  <h1 style="margin-top:14px">${esc(L.title)}</h1>
  <div class="row">${isT() && L.terms.length ? '<button class="btn" id="fcs">🃏 Терминдерди кайталоо</button>' : ''}<button class="btn pri" id="pres">▶ Презентацияны ачуу</button>${isT() ? `<span class="code">${codeOf(g, L.id)}</span>` : ''}</div>
  <div class="tabs">${T.map(([k, n]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${n}</button>`).join('')}</div><div id="pane"></div>`;
  $('#back').onclick = () => isT() ? teacher(g) : student();
  $('#pres').onclick = () => present(L, g);
  if ($('#fcs')) $('#fcs').onclick = () => {const sh = $('#show'); sh.classList.add('on'); deck = null; const box = $('.sl', sh); box.className = 'sl'; classCards(box, 0, L.terms)};
  const pane = $('#pane');
  const show = k => {
    $$('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === k));
    if (k === 'learn') {
      pane.innerHTML = `<div class="content">${theory.filter(s => s.t).length > 3 ? `<div class="tabs" style="flex-wrap:wrap">${theory.map((s, i) => s.t ? `<button data-j="${i}" style="font-weight:400;font-size:14px">${esc(s.t.replace(/^\d+(\.\d+)*\.\s*/, ''))}</button>` : '').join('')}</div>` : ''}
       ${theory.map((s, i) => `${s.t ? `<h3 id="sec${i}">${esc(s.t)}</h3>` : ''}${s.h}`).join('')}</div>`;
      $$('[data-j]', pane).forEach(b => b.onclick = () => document.getElementById('sec' + b.dataset.j)?.scrollIntoView({behavior: 'smooth'}));
      addImgs($('.content', pane), L);
    }
    if (k === 'key') pane.innerHTML = `<div class="content">${L.remember.length ? `<h3>Эсте сакта</h3>${L.remember.map(r => `<div class="box y">${esc(r)}</div>`).join('')}` : ''}
       <h3>Терминдер (${L.terms.length})</h3><div class="terms">${L.terms.map(t => `<div><b>${esc(t.t)}</b>${esc(t.d)}</div>`).join('') || '<p class="muted">Бул сабакта терминдер жок.</p>'}</div></div>`;
    if (k === 'games') games(pane, g, L);
    if (k === 'class') classMenu(pane, g, L);
    if (k === 'prac') practice(pane, L);
    if (k === 'tasks') pane.innerHTML = `<div class="content">${tasks.map(s => `<h3>${esc(s.t)}${s.k === 'teacher' || s.k === 'test' || s.k === 'slides' ? '<span class="tag">мугалим үчүн</span>' : ''}</h3>${s.h}`).join('') || '<p class="muted">Бул сабакта өзүнчө тапшырма жок.</p>'}</div>`;
    window.scrollTo({top: 0});
  };
  $$('[data-t]').forEach(b => b.onclick = () => show(b.dataset.t));
  show(tab);
}

// ===== Презентация =====
let deck = null, di = 0;
function buildDeck(L, g) {
  const out = [{cover: true, h: L.title, k: (g ? g + '-класс · ' : '') + 'Информатика'}];
  const terms = L.terms.filter(t => t.d.length < 160);
  let qi = 0;
  L.slides.forEach((s, i) => {
    out.push(s);
    if ((i + 1) % 4 === 0 && terms.length >= 4 && qi < 4) {
      const t = terms[(qi * 3) % terms.length]; qi++;
      out.push({quiz: true, h: 'Мини-оюн: бул эмне?', p: t.d, ans: t.t, opts: shuf([t.t, ...shuf(terms.filter(x => x.t !== t.t)).slice(0, 3).map(x => x.t)])});
    }
  });
  if (L.remember.length) out.push({h: 'Эсте сакта!', li: L.remember.slice(0, 5)});
  if (terms.length) out.push({h: 'Негизги терминдер', li: terms.slice(0, 7).map(t => t.t + ' — ' + t.d)});
  const q = L.sections.find(s => s.k === 'questions');
  if (q) {const li = [...q.h.matchAll(/<li>(.*?)<\/li>/gs)].map(m => m[1].replace(/<[^>]+>/g, '')).slice(0, 6); if (li.length) out.push({h: 'Суроолор', li})}
  out.push({cover: true, h: 'Рахмат! Эми — оюн жана практика', k: 'Сабактын аягы'});
  return out;
}
function present(L, g) {deck = buildDeck(L, g); di = 0; $('#show').classList.add('on'); draw()}
function draw() {
  if (!deck) return;
  const s = deck[di], sh = $('#show');
  let h;
  if (s.cover) h = `<div class="cover"><div class="k">${esc(s.k)}</div><h1>${esc(s.h)}</h1></div>`;
  else if (s.quiz) h = `<h2>${esc(s.h)}</h2><p>«${esc(s.p)}»</p><div class="opts">${s.opts.map(o => `<button data-q="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  else h = `<h2>${esc(s.h)}</h2>${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.li?.length ? `<ul>${s.li.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${s.code ? `<pre>${esc(s.code)}</pre>` : ''}${s.table || ''}`;
  const sl = $('.sl', sh); sl.className = 'sl'; sl.innerHTML = h;
  if (!s.cover && !s.quiz) {const my = di; findImg(s.h + ' ' + (s.li || []).slice(0, 2).join(' ')).then(im => {if (im && deck && di === my && !s.code && !s.table) {sl.classList.add('withimg'); sl.innerHTML = `<div>${h}</div>${fig(im)}`}})}
  $('.cnt', sh).textContent = `${di + 1} / ${deck.length}`;
  $('.bar i', sh).style.width = ((di + 1) / deck.length * 100) + '%';
  $$('[data-q]', sh).forEach(b => b.onclick = () => {
    $$('[data-q]', sh).forEach(x => {if (x.dataset.q === s.ans) x.classList.add('ok')});
    if (b.dataset.q !== s.ans) b.classList.add('no');
  });
}
const go = d => {if (!deck) return; di = Math.max(0, Math.min(deck.length - 1, di + d)); draw()};
$('#show').addEventListener('click', e => {
  const a = e.target.closest('[data-a]')?.dataset.a;
  if (a === 'x') {$('#show').classList.remove('on'); if (document.fullscreenElement) document.exitFullscreen().catch(() => {})}
  if (a === 'n') go(1); if (a === 'p') go(-1);
  if (a === 'fs') {try {document.fullscreenElement ? document.exitFullscreen() : $('#show').requestFullscreen().catch(() => {})} catch (er) {}}
});
document.addEventListener('keydown', e => {
  if (!$('#show').classList.contains('on')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {e.preventDefault(); go(1)}
  if (['ArrowLeft', 'PageUp'].includes(e.key)) go(-1);
  if (e.key === 'Escape') $('#show').classList.remove('on');
});
let tx = null;
$('#show').addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive: true});
$('#show').addEventListener('touchend', e => {if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 60) go(d < 0 ? 1 : -1); tx = null});

// ===== Оюндар =====
const SORTS = {
  files: {b: ['Текст', 'Сүрөт', 'Үн/видео', 'Программа'], items: [['реферат.docx', 0], ['эссе.txt', 0], ['китеп.pdf', 0], ['табият.jpg', 1], ['логотип.png', 1], ['ыр.mp3', 2], ['кино.mp4', 2], ['оюн.exe', 3], ['setup.msi', 3], ['сүрөт.gif', 1]]},
  soft: {b: ['Акысыз', 'Акы төлөнүүчү'], items: [['LibreOffice', 0], ['Google Chrome', 0], ['Scratch', 0], ['GIMP', 0], ['Python', 0], ['Adobe Photoshop', 1], ['Microsoft Office (толук)', 1], ['Windows 11 лицензиясы', 1], ['CorelDRAW', 1], ['Blender', 0]]},
  pc: {b: ['Аппараттык (Hardware)', 'Программалык (Software)'], items: [['Процессор (CPU)', 0], ['RAM', 0], ['SSD', 0], ['Клавиатура', 0], ['Монитор', 0], ['Windows', 1], ['Браузер', 1], ['Антивирус', 1], ['Word', 1], ['Android', 1]]},
  net: {b: ['Протокол', 'Түзүлүш', 'Дарек'], items: [['HTTP/HTTPS', 0], ['SMTP', 0], ['TCP/IP', 0], ['FTP', 0], ['Роутер', 1], ['Коммутатор', 1], ['Модем', 1], ['192.168.0.1', 2], ['www.okuma.kg', 2], ['user@gmail.com', 2]]},
  cyber: {b: ['Коопсуз ✅', 'Коркунучтуу ⚠️'], items: [['Ар бир сайтка башка пароль', 0], ['Эки факторлуу текшерүүнү күйгүзүү', 0], ['SMS-кодду «банкка» айтуу', 1], ['«iPhone уттуңуз!» шилтемесин ачуу', 1], ['Тиркемени Play Market\'тен жүктөө', 0], ['Паролду досуңа берүү', 1], ['Үйүңдүн дарегин жарыялоо', 1], ['Кибербуллингди чоңдорго айтуу', 0], ['Ачык Wi-Fi\'да банкка кирүү', 1], ['Телефонду PIN менен кулпулоо', 0]]},
  fake: {b: ['Ишенсе болот', 'Текшерүү керек ⚠️'], items: [['Автору, датасы жана булагы бар макала', 0], ['«Шашылыңыз! Бүгүн гана!» деген билдирүү', 1], ['Министрликтин расмий сайтындагы жаңылык', 0], ['Аты жок каналдагы сенсациялуу видео', 1], ['Бир нече ишенимдүү булакта бирдей кабар', 0], ['«Бардыгына жөнөт, болбосо…» деген чынжыр кат', 1], ['Сүрөттүн астында булагы жок «таң калыштуу факт»', 1], ['Энциклопедиядагы макала', 0]]},
};
SORTS.util = {b: ['Системалык', 'Колдонмо', 'Утилита'], items: [['Windows', 0], ['Android', 0], ['Принтердин драйвери', 0], ['Microsoft Word', 1], ['Google Chrome', 1], ['Paint', 1], ['Telegram', 1], ['Антивирус', 2], ['7-Zip архиватору', 2], ['Дискти тазалоо', 2], ['Тапшырмалар диспетчери', 2], ['Scratch', 1]]};
SORTS.mobile = {b: ['Компьютерде', 'Смартфондо', 'Экөөндө тең'], items: [['SoC — баары бир чипте', 1], ['Өзүнчө видеокарта', 0], ['Акселерометр, GPS', 1], ['Клавиатура жана чычкан', 0], ['Процессор жана RAM', 2], ['Операциялык система', 2], ['NFC менен төлөө', 1], ['Wi-Fi', 2], ['Windows, Linux', 0], ['Android, iOS', 1], ['Киргизүү → иштетүү → чыгаруу', 2], ['SIM-карта', 1]]};
SORTS.email = {b: ['Туура', 'Туура эмес'], items: [['aisha.t2026@gmail.com', 0], ['aisha@gmail', 1], ['mektep_nuraisha@mail.ru', 0], ['айша@gmail.com', 1], ['student 7@gmail.com', 1], ['teacher@school.kg', 0]]};
SORTS.order = null;

function games(pane, g, L) {
  const T = L.terms.filter(t => t.d.length < 220);
  const sort = SORTS[L.practice];
  const list = [['cards', '🃏 Флешкарталар'], ['match', '🧩 Жуптап тап'], ['quiz', '⚡ Тез тест'], ['tf', '✅ Чынбы, жалганбы?'], ['ana', '🔀 Анаграмма']];
  if (sort) list.unshift(['sort', 'Иргөө оюну']);
  if (T.length < 4 && !sort) {pane.innerHTML = '<p class="muted">Бул сабак үчүн оюн терминдери аз. Практика бөлүмүн караңыз.</p>'; return}
  pane.innerHTML = `<div class="tabs">${list.filter(x => x[0] === 'sort' || T.length >= 4).map(([k, n], i) => `<button data-gm="${k}" class="${i ? '' : 'on'}">${n}</button>`).join('')}</div><div id="gm"></div>`;
  const box = $('#gm', pane);
  const run = k => {$$('[data-gm]', pane).forEach(b => b.classList.toggle('on', b.dataset.gm === k)); ({match, quiz, tf, cards, ana, sort: sortG})[k](box, T, g, L, sort)};
  $$('[data-gm]', pane).forEach(b => b.onclick = () => run(b.dataset.gm));
  run('cards');
}
const save = (g, L, pct) => {if (!U) return; const r = prog().res, k = g + L.id; if (!(r[k] >= pct)) {r[k] = pct; sync()}};
function finish(box, g, L, ok, all, again) {
  const pct = Math.round(ok / all * 100); save(g, L, pct);
  box.innerHTML = `<div class="game" style="text-align:center"><div class="score">${ok} / ${all} · ${pct}%</div><p>${pct >= 90 ? 'Эң сонун! Сен мыктысың! 🌟' : pct >= 60 ? 'Жакшы! Дагы бир аз машык.' : 'Сен баарын кыла аласың — дагы бир жолу аракет кыл!'}</p>
  <p class="muted">${esc(S?.name || 'Мугалим')} · ${esc(L.title)}</p><button class="btn pri" id="ag">Кайра ойноо</button></div>`;
  $('#ag', box).onclick = again;
}
function match(box, T, g, L) {
  const set = shuf(T).slice(0, 6); let sel = null, done = 0, miss = 0;
  const left = shuf(set), right = shuf(set);
  box.innerHTML = `<div class="game"><p class="muted">Терминди тандап, анан анын аныктамасын бас.</p><div class="grid2"><div>${left.map(t => `<button class="tile" data-l="${esc(t.t)}" style="width:100%;margin-bottom:8px"><b>${esc(t.t)}</b></button>`).join('')}</div>
  <div>${right.map(t => `<button class="tile" data-r="${esc(t.t)}" style="width:100%;margin-bottom:8px">${esc(t.d)}</button>`).join('')}</div></div></div>`;
  $$('[data-l]', box).forEach(b => b.onclick = () => {$$('[data-l]', box).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b});
  $$('[data-r]', box).forEach(b => b.onclick = () => {
    if (!sel) return toast('Алгач солдон терминди танда');
    if (sel.dataset.l === b.dataset.r) {sel.classList.add('done'); b.classList.add('done'); sel = null; if (++done === set.length) finish(box, g, L, set.length, set.length + miss, () => match(box, T, g, L))}
    else {miss++; b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400)}
  });
}
function quiz(box, T, g, L) {
  const qs = shuf(T).slice(0, 10); let i = 0, ok = 0, tm;
  const step = () => {
    if (i >= qs.length) return finish(box, g, L, ok, qs.length, () => quiz(box, T, g, L));
    const q = qs[i], opts = shuf([q, ...shuf(T.filter(x => x !== q)).slice(0, 3)]);
    box.innerHTML = `<div class="game"><div class="row"><b>${i + 1} / ${qs.length}</b><span class="sp" style="flex:1"></span><span class="score">${ok}</span></div><div class="timer"><i style="width:100%"></i></div>
    <h3>${esc(q.d)}</h3><div class="grid2">${opts.map(o => `<button class="tile" data-o="${esc(o.t)}">${esc(o.t)}</button>`).join('')}</div></div>`;
    let left = 20; const bar = $('.timer i', box);
    clearInterval(tm); tm = setInterval(() => {left--; bar.style.width = left * 5 + '%'; if (left <= 0) {clearInterval(tm); i++; step()}}, 1000);
    $$('[data-o]', box).forEach(b => b.onclick = () => {
      clearInterval(tm); const good = b.dataset.o === q.t; if (good) ok++;
      $$('[data-o]', box).forEach(x => {x.disabled = true; if (x.dataset.o === q.t) x.style.borderColor = 'var(--ok)'}); if (!good) b.style.borderColor = 'var(--bad)';
      setTimeout(() => {i++; step()}, 900);
    });
  };
  step();
}
function tf(box, T, g, L) {
  const qs = shuf(T).slice(0, 10).map(t => Math.random() < .5 ? {t: t.t, d: t.d, v: true} : {t: t.t, d: shuf(T.filter(x => x !== t))[0].d, v: false});
  let i = 0, ok = 0;
  const step = () => {
    if (i >= qs.length) return finish(box, g, L, ok, qs.length, () => tf(box, T, g, L));
    const q = qs[i];
    box.innerHTML = `<div class="game"><b>${i + 1} / ${qs.length}</b><h3><span style="color:var(--red)">${esc(q.t)}</span> — ${esc(q.d)}</h3><div class="row"><button class="btn pri" data-v="1">Чын ✓</button><button class="btn" data-v="0">Жалган ✗</button></div><p id="fb"></p></div>`;
    $$('[data-v]', box).forEach(b => b.onclick = () => {const good = (b.dataset.v === '1') === q.v; if (good) ok++; $('#fb', box).innerHTML = good ? '<b style="color:var(--ok)">Туура!</b>' : `<b style="color:var(--bad)">Туура эмес.</b> ${q.v ? 'Бул чын.' : 'Бул аныктама башка терминге тиешелүү.'}`; $$('[data-v]', box).forEach(x => x.disabled = true); setTimeout(() => {i++; step()}, 1300)});
  };
  step();
}
function ana(box, T, g, L) {
  const W = shuf(T.filter(t => word(t.t).length >= 3 && word(t.t).length <= 14)).slice(0, 6); let i = 0, ok = 0;
  if (W.length < 2) {box.innerHTML = '<p class="muted">Бул сабакта анаграмма үчүн сөз аз.</p>'; return}
  const step = () => {
    if (i >= W.length) return finish(box, g, L, ok, W.length, () => ana(box, T, g, L));
    const w = word(W[i].t).toUpperCase().replace(/\s/g, ''), mix = shuf([...w].map((c, k) => [c, k])); let built = '';
    const draw = () => {box.innerHTML = `<div class="game"><b>${i + 1} / ${W.length}</b><p>💡 ${esc(W[i].d)}</p><div class="tiles sm">${[...w].map((_, k) => `<span>${esc(built[k] || ' ')}</span>`).join('')}</div>
      <div class="row" style="justify-content:center">${mix.map(([c, k]) => `<button class="tile" data-k="${k}" style="min-width:48px;text-align:center;font-weight:800">${esc(c)}</button>`).join('')}</div><div class="row" style="margin-top:10px"><button class="btn" id="ar">↺ Тазалоо</button><button class="btn" id="as">Өткөрүү</button></div></div>`;
      $$('[data-k]', box).forEach(b => {if (b.dataset.used) b.disabled = true; b.onclick = () => {b.disabled = true; built += mix.find(x => x[1] == b.dataset.k)[0]; $$('.tiles span', box)[built.length - 1].textContent = built.at(-1);
        if (built.length === w.length) {const good = built === w; if (good) ok++; $('.tiles', box).classList.add(good ? 'win' : 'lose'); if (!good) $('.tiles', box).insertAdjacentHTML('afterend', `<p>Туурасы: <b>${esc(w)}</b></p>`); setTimeout(() => {i++; step()}, good ? 900 : 1800)}}});
      $('#ar', box).onclick = () => {built = ''; draw()}; $('#as', box).onclick = () => {i++; step()}};
    draw();
  };
  step();
}
function cards(box, T) {
  let i = 0, back = false; const set = shuf(T);
  const d = () => {box.innerHTML = `<div class="game"><div class="flip" id="fl">${esc(back ? set[i].d : set[i].t)}</div><div class="row" style="margin-top:12px;justify-content:center"><button class="btn" id="pv">←</button><span>${i + 1} / ${set.length}</span><button class="btn" id="nx">→</button></div><p class="muted" style="text-align:center">Карточканы басып, артын көр.</p></div>`;
    $('#fl', box).onclick = () => {back = !back; d()}; $('#pv', box).onclick = () => {i = (i - 1 + set.length) % set.length; back = false; d()}; $('#nx', box).onclick = () => {i = (i + 1) % set.length; back = false; d()}};
  d();
}
function sortG(box, T, g, L, sort) {
  const items = shuf(sort.items); let sel = null, ok = 0, left = items.length, tries = 0;
  box.innerHTML = `<div class="game"><p class="muted">Нерсени тандап, туура топту бас.</p><div id="pool">${items.map((it, i) => `<span class="chip" data-i="${i}">${esc(it[0])}</span>`).join('')}</div>
  <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">${sort.b.map((b, j) => `<div class="bucket" data-b="${j}"><h4>${esc(b)}</h4></div>`).join('')}</div></div>`;
  $$('.chip', box).forEach(c => c.onclick = () => {$$('.chip', box).forEach(x => x.classList.remove('sel')); c.classList.add('sel'); sel = c});
  $$('.bucket', box).forEach(b => b.onclick = () => {
    if (!sel) return; const it = items[sel.dataset.i]; tries++;
    if (+b.dataset.b === it[1]) {ok++; sel.classList.remove('sel'); sel.classList.add('ok'); sel.onclick = null; b.append(sel); sel = null; if (--left === 0) setTimeout(() => finish(box, g, L, items.length, tries, () => sortG(box, T, g, L, sort)), 600)}
    else {sel.classList.add('no'); const s = sel; setTimeout(() => s.classList.remove('no'), 500)}
  });
}

// ===== Практика =====
function practice(pane, L) {
  const f = PR[L.practice];
  const sort = SORTS[L.practice];
  if (f) return f(pane, L);
  pane.innerHTML = sort ? '<p>Бул сабактын практикасы — «Оюндар» бөлүмүндөгү иргөө оюну жана «Суроо жана тапшырма» бөлүмүндөгү практикалык иштер.</p>' : '<p>Бул сабактын практикалык иштери «Суроо жана тапшырма» бөлүмүндө. Оюндар бөлүмүндө терминдерди бышыкта.</p>';
}
const LINKS = (xs) => `<div class="cards">${xs.map(([n, u, d]) => `<div class="card"><h3>${n}</h3><p class="muted">${d}</p><a href="${u}" target="_blank" rel="noopener">${u.replace('https://', '')}</a></div>`).join('')}</div>`;
let pyP = null;
const PR = {
  python(pane, L) {
    pane.innerHTML = `<p>Python кодун ушул жерде жаз жана «Иштетүү» бас. Компьютер керек эмес — телефондон да иштейт (биринчи жолу жүктөлгөнчө бир аз күт, интернет керек).</p>
    <div class="ide"><div><textarea id="py" spellcheck="false">${esc(L.starter || STARTERS.py)}</textarea>
    <label class="muted">input() үчүн маалыматтар (ар бир сап — бир жооп):<textarea id="pin" style="min-height:70px;font-family:'JetBrains Mono'">Айша</textarea></label>
    <div class="row" style="margin-top:8px"><button class="btn pri" id="run">▶ Иштетүү</button><button class="btn" id="clr">Тазалоо</button>
    <select id="ex" style="width:auto"><option value="">Мисал тандоо…</option>${Object.keys(PYEX).map(k => `<option>${k}</option>`).join('')}</select></div></div>
    <div><div class="out" id="po">Жыйынтык ушул жерде чыгат…</div></div></div>`;
    const out = $('#po', pane);
    $('#ex', pane).onchange = e => {if (PYEX[e.target.value]) $('#py', pane).value = PYEX[e.target.value]};
    $('#clr', pane).onclick = () => out.textContent = '';
    $('#py', pane).addEventListener('keydown', e => {if (e.key === 'Tab') {e.preventDefault(); const t = e.target, s = t.selectionStart; t.setRangeText('    ', s, t.selectionEnd, 'end')}});
    $('#run', pane).onclick = async () => {
      out.textContent = pyP ? 'Иштеп жатат…' : 'Python жүктөлүүдө (биринчи жолу 10–30 секунд)…';
      try {
        if (!pyP) pyP = new Promise((res, rej) => {const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'; s.onload = () => loadPyodide().then(res, rej); s.onerror = () => rej(new Error('Python жүктөлбөдү: интернетти текшер')); document.head.append(s)});
        const py = await pyP;
        const inputs = $('#pin', pane).value.split('\n'); let k = 0, buf = '';
        py.setStdout({batched: s => buf += s + '\n'}); py.setStderr({batched: s => buf += s + '\n'});
        globalThis.__inp = () => inputs[k++] ?? '';
        await py.runPythonAsync('import builtins, js\ndef _inp(p=""):\n    v = js.__inp()\n    print(str(p) + str(v))\n    return str(v)\nbuiltins.input = _inp');
        await py.runPythonAsync($('#py', pane).value);
        out.textContent = buf || '(программа эч нерсе чыгарган жок)';
      } catch (e) {
        const m = String(e.message || e); const last = m.trim().split('\n').pop();
        out.innerHTML = `<span class="e">Ката: ${esc(last)}</span>\n\n${esc(kataKG(last))}`;
      }
    };
  },
  scratch(pane) {
    pane.innerHTML = `<p>Блокторду басып программа түз, анан «Баштоо» бас. Каарманыбыз — кичинекей робот. Толук Scratch үчүн: <a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noopener">scratch.mit.edu/projects/editor</a> (телефондо да ачылат).</p>
    <div class="ide"><div><h4 style="margin:0">Блоктор</h4><div class="blocks">${SB.map((b, i) => `<span class="chip" data-b="${i}">${b.n}</span>`).join('')}</div>
    <h4>Менин программам <button class="btn sm" id="sclr">Тазалоо</button> <button class="btn sm" id="sun">↶</button></h4><div class="prog" id="prog"><span class="muted">Блок тандаңыз…</span></div>
    <div class="row" style="margin-top:10px"><button class="btn pri" id="srun">🚩 Баштоо</button><select id="sex" style="width:auto"><option value="">Даяр мисал…</option><option value="sq">Чарчы</option><option value="st">Жылдызча</option><option value="hi">Саламдашуу</option></select></div></div>
    <div><canvas class="pad" id="stage" width="480" height="360"></canvas></div></div>`;
    let prog = [];
    const pr = $('#prog', pane), cv = $('#stage', pane), c = cv.getContext('2d');
    const render = () => pr.innerHTML = prog.length ? prog.map(i => `<span class="chip">${SB[i].n}</span>`).join('') : '<span class="muted">Блок тандаңыз…</span>';
    $$('[data-b]', pane).forEach(b => b.onclick = () => {prog.push(+b.dataset.b); render()});
    $('#sclr', pane).onclick = () => {prog = []; render()}; $('#sun', pane).onclick = () => {prog.pop(); render()};
    $('#sex', pane).onchange = e => {prog = {sq: [7, 8, 1, 3, 9], st: [7, 6, 1, 4, 9], hi: [2, 0, 0, 5]}[e.target.value] || prog; render()};
    const robot = (x, y, a, say) => {
      c.save(); c.translate(x, y); c.rotate(a * Math.PI / 180);
      c.fillStyle = '#c8102e'; c.beginPath(); c.roundRect(-16, -14, 32, 28, 8); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(6, -5, 4, 0, 7); c.arc(6, 5, 4, 0, 7); c.fill();
      c.fillStyle = '#ffc93c'; c.fillRect(14, -3, 8, 6); c.restore();
      if (say) {c.font = '15px Inter'; const w = c.measureText(say).width + 20; c.fillStyle = '#fff'; c.strokeStyle = '#14213d'; c.beginPath(); c.roundRect(x + 18, y - 54, w, 32, 10); c.fill(); c.stroke(); c.fillStyle = '#14213d'; c.fillText(say, x + 28, y - 33)}
    };
    $('#srun', pane).onclick = async () => {
      const st = {x: 240, y: 180, a: 0, pen: true, col: '#1d4ed8', say: ''}, trail = [];
      const flat = []; const stack = [];
      prog.forEach(i => {const b = SB[i]; if (b.rep) stack.push({n: b.rep, at: flat.length}); else if (b.end) {const s = stack.pop(); if (s) {const body = flat.splice(s.at); for (let r = 0; r < s.n; r++) flat.push(...body)}} else flat.push(b)});
      const paint = () => {c.clearRect(0, 0, 480, 360); c.lineWidth = 3; c.lineCap = 'round'; trail.forEach(t => {c.strokeStyle = t[4]; c.beginPath(); c.moveTo(t[0], t[1]); c.lineTo(t[2], t[3]); c.stroke()}); robot(st.x, st.y, st.a, st.say)};
      for (const b of flat.slice(0, 400)) {
        if (b.mv) {const r = st.a * Math.PI / 180, nx = st.x + Math.cos(r) * b.mv, ny = st.y + Math.sin(r) * b.mv; if (st.pen) trail.push([st.x, st.y, nx, ny, st.col]); st.x = Math.max(10, Math.min(470, nx)); st.y = Math.max(10, Math.min(350, ny))}
        if (b.tn) st.a += b.tn; if (b.say != null) st.say = b.say; if (b.pen != null) st.pen = b.pen; if (b.col) st.col = b.col; if (b.home) {st.x = 240; st.y = 180; st.a = 0}
        paint(); await new Promise(r => setTimeout(r, 220));
      }
      paint();
    };
    c.clearRect(0, 0, 480, 360); robot(240, 180, 0, '');
  },
  html(pane, L) {
    const css = /css/i.test(L.title);
    pane.innerHTML = `<p>Сол жакта кодду жаз — оң жакта веб-баракча дароо көрүнөт.</p><div class="ide"><textarea id="hc" spellcheck="false">${esc(css ? HTMLEX.css : HTMLEX.html)}</textarea><iframe class="prev" id="hp" sandbox="allow-scripts" title="Веб-баракчанын көрүнүшү"></iframe></div>
    <div class="row" style="margin-top:8px"><button class="btn" data-x="html">HTML мисал</button><button class="btn" data-x="css">CSS мисал</button><button class="btn" data-x="card">Карточка</button></div>`;
    const ta = $('#hc', pane), fr = $('#hp', pane), up = () => fr.srcdoc = ta.value;
    ta.oninput = up; up(); $$('[data-x]', pane).forEach(b => b.onclick = () => {ta.value = HTMLEX[b.dataset.x]; up()});
  },
  sql(pane) {
    pane.innerHTML = `<p>Бизде «okuuchular» деген таблица бар: <code>id, aty, klass, baa, shaar</code>. SQL буйругун жазып, «Аткаруу» бас.</p>
    <div class="ide"><div><textarea id="sq" spellcheck="false" style="min-height:140px">SELECT * FROM okuuchular WHERE baa >= 4 ORDER BY baa DESC;</textarea>
    <div class="row" style="margin-top:8px"><button class="btn pri" id="sr">▶ Аткаруу</button>${['SELECT aty, baa FROM okuuchular;', 'SELECT * FROM okuuchular WHERE klass = 9;', "INSERT INTO okuuchular VALUES (9, 'Нурайым', 8, 5, 'Ош');", 'UPDATE okuuchular SET baa = 5 WHERE id = 3;', 'SELECT klass, COUNT(*) AS sany, AVG(baa) AS orto FROM okuuchular GROUP BY klass;'].map(q => `<button class="btn sm" data-q="${esc(q)}">${esc(q.split(' ')[0])}…</button>`).join('')}</div></div><div class="out" id="so" style="background:var(--card);color:var(--ink);border:2px solid var(--line)"></div></div>`;
    const so = $('#so', pane);
    let db = null;
    const ensure = () => new Promise((res, rej) => {
      if (window.alasql) return res(window.alasql);
      const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/alasql@4.4.0/dist/alasql.min.js'; s.onload = () => res(window.alasql); s.onerror = () => rej(new Error('SQL жүктөлбөдү: интернетти текшер')); document.head.append(s);
    });
    const show = rows => {if (!Array.isArray(rows) || !rows.length || typeof rows[0] !== 'object') return so.textContent = 'Аткарылды: ' + JSON.stringify(rows); const k = Object.keys(rows[0]); so.innerHTML = `<div class="content"><table><tr>${k.map(x => `<th>${esc(x)}</th>`).join('')}</tr>${rows.map(r => `<tr>${k.map(x => `<td>${esc(r[x])}</td>`).join('')}</tr>`).join('')}</table></div>`};
    const exec = async () => {
      try {
        const A = await ensure();
        if (!db) {db = new A.Database(); db.exec('CREATE TABLE okuuchular (id INT, aty STRING, klass INT, baa INT, shaar STRING)'); db.exec("INSERT INTO okuuchular VALUES (1,'Айша',7,5,'Бишкек'),(2,'Мээрим',8,4,'Бишкек'),(3,'Айпери',9,3,'Кант'),(4,'Самира',7,4,'Бишкек'),(5,'Нургүл',9,5,'Токмок'),(6,'Аделя',8,5,'Бишкек'),(7,'Зарина',9,4,'Кара-Балта'),(8,'Бегимай',7,3,'Бишкек')")}
        const sql = $('#sq', pane).value.trim().replace(/;\s*$/, '');
        const r = db.exec(sql);
        if (/^(insert|update|delete)/i.test(sql)) {so.innerHTML = '<b>Аткарылды ✓</b>'; show(db.exec('SELECT * FROM okuuchular')); so.insertAdjacentHTML('afterbegin', '<p><b>Аткарылды ✓</b> Таблица азыр:</p>')} else show(r);
      } catch (e) {so.innerHTML = `<span style="color:var(--bad)">Ката: ${esc(e.message)}</span><p class="muted">Буйруктун жазылышын текшер: үтүр, тырмакча, таблицанын аты.</p>`}
    };
    $('#sr', pane).onclick = exec; $$('[data-q]', pane).forEach(b => b.onclick = () => {$('#sq', pane).value = b.dataset.q; exec()});
  },
  logic(pane) {
    pane.innerHTML = `<div class="game"><h3>Логикалык элементтер</h3><p class="muted">A жана B баскычтарын басып, лампалар кантип күйөрүн байка. 1 — ЧЫН, 0 — ЖАЛГАН.</p>
    <div class="row"><button class="btn sw" id="la">A = 0</button><button class="btn sw" id="lb">B = 0</button></div>
    <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">${['ЖАНА (AND)', 'ЖЕ (OR)', 'ЭМЕС A (NOT)', 'XOR (бирөө гана)'].map((n, i) => `<div style="text-align:center"><div class="lamp" id="lp${i}">0</div><p><b>${n}</b></p></div>`).join('')}</div></div>
    <div class="game"><h3>Чындык таблицасын толтур</h3><p class="muted">Ар бир уячаны басып, 0 же 1 кой.</p><div id="tt"></div><button class="btn pri" id="tc" style="margin-top:10px">Текшерүү</button><p id="tr"></p></div>`;
    let A = 0, B = 0;
    const up = () => {$('#la', pane).textContent = 'A = ' + A; $('#lb', pane).textContent = 'B = ' + B; [A & B, A | B, 1 - A, A ^ B].forEach((v, i) => {const l = $('#lp' + i, pane); l.textContent = v; l.classList.toggle('on', !!v)})};
    $('#la', pane).onclick = () => {A ^= 1; up()}; $('#lb', pane).onclick = () => {B ^= 1; up()}; up();
    const rows = [[0, 0], [0, 1], [1, 0], [1, 1]];
    $('#tt', pane).innerHTML = `<div class="content"><table><tr><th>A</th><th>B</th><th>A ЖАНА B</th><th>A ЖЕ B</th></tr>${rows.map((r, i) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td><button class="btn sm" data-c="${i}-0">?</button></td><td><button class="btn sm" data-c="${i}-1">?</button></td></tr>`).join('')}</table></div>`;
    $$('[data-c]', pane).forEach(b => b.onclick = () => b.textContent = b.textContent === '1' ? '0' : '1');
    $('#tc', pane).onclick = () => {let ok = 0; $$('[data-c]', pane).forEach(b => {const [i, k] = b.dataset.c.split('-').map(Number); const v = k ? rows[i][0] | rows[i][1] : rows[i][0] & rows[i][1]; const g = b.textContent === String(v); b.style.borderColor = g ? 'var(--ok)' : 'var(--bad)'; ok += g}); $('#tr', pane).textContent = `${ok} / 8 туура`};
  },
  pc(pane) {pane.innerHTML = '<p>«Оюндар» бөлүмүндөгү иргөө оюну: аппараттык жана программалык камсыздоону ажырат.</p>' + LINKS([['Компьютердин ичин 3D көрүү', 'https://www.google.com/search?q=computer+parts+3d+interactive', 'Процессор, RAM, SSD кайда жайгашканын изилде.']])},
  email(pane) {
    pane.innerHTML = `<div class="game"><h3>Кат жазып машыгуу</h3><p class="muted">Бул машыгуу: кат эч кимге жөнөтүлбөйт. Сайт катыңды эрежелер боюнча текшерет.</p>
    <label>Кимге<input id="eto" placeholder="teacher@school.kg"></label><label>Тема<input id="esu" placeholder="Информатика боюнча тапшырма"></label>
    <label>Кат<textarea id="ebo" style="min-height:150px" placeholder="Саламатсызбы, ..."></textarea></label><label class="row"><input type="checkbox" id="eat" style="width:auto;min-height:0"> Файл тиркелди</label>
    <button class="btn pri" id="ech">Текшерүү</button><ul id="ers"></ul></div>`;
    $('#ech', pane).onclick = () => {
      const to = $('#eto', pane).value.trim(), su = $('#esu', pane).value.trim(), bo = $('#ebo', pane).value.trim();
      const r = [[/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(to), 'Дарек туура жазылган (латын тамгалары, @ жана домен)'], [su.length >= 3, 'Тема жазылган'], [/^(салам|саламатсыз|ассалам|урматтуу|кадырлуу)/i.test(bo), 'Кат саламдашуу менен башталат'], [bo.length >= 40, 'Каттын негизги бөлүгү бар (40 белгиден көп)'], [/(рахмат|ыраазымын|урматым|сый менен)/i.test(bo), 'Аягында ыраазычылык же сылык сөз бар'], [/\n.*\S\s*$/.test(bo) && bo.split('\n').pop().trim().split(' ').length <= 4, 'Аягында атыңды жаздың (кол коюу)']];
      $('#ers', pane).innerHTML = r.map(([ok, t]) => `<li style="color:${ok ? 'var(--ok)' : 'var(--bad)'}">${ok ? '✓' : '✗'} ${t}</li>`).join('') + `<li><b>${r.filter(x => x[0]).length} / ${r.length}</b></li>`;
    };
  },
  prompt(pane) {
    const F = [['Роль', 'Сен мектеп мугалимисиң'], ['Тапшырма', 'Күн системасы жөнүндө түшүндүр'], ['Контекст', '7-класстын окуучусу үчүн, кыргыз тилинде'], ['Формат', '5 пункттан турган тизме'], ['Чектөө', '150 сөздөн ашпасын']];
    pane.innerHTML = `<div class="game"><h3>Prompt куруучу</h3><p class="muted">Жакшы prompt 5 бөлүктөн турат. Ар бирин толтур — даяр prompt төмөндө чыгат.</p>${F.map(([n, ph], i) => `<label>${n}<input data-f="${i}" placeholder="${ph}"></label>`).join('')}
    <h4>Даяр prompt</h4><div class="box y" id="pr">—</div><div class="row"><button class="btn" id="pc">Көчүрүү</button><b id="ps"></b></div></div>`;
    const up = () => {const v = $$('[data-f]', pane).map(x => x.value.trim()); const t = v.filter(Boolean).join('. '); $('#pr', pane).textContent = t ? t + '.' : '—'; const n = v.filter(Boolean).length; $('#ps', pane).textContent = `Сапаты: ${n}/5 ${n === 5 ? '— эң сонун!' : ''}`};
    $$('[data-f]', pane).forEach(x => x.oninput = up);
    $('#pc', pane).onclick = () => navigator.clipboard?.writeText($('#pr', pane).textContent).then(() => toast('Көчүрүлдү'), () => toast('Колго белгилеп көчүр'));
  },
  cli(pane) {
    pane.innerHTML = `<p>Бул — Windows'тун командалык сабына окшош машыгуу терминалы. <code>help</code> деп жазып баштагыла.</p><div class="term" id="tm"></div>`;
    const tm = $('#tm', pane); const fs = {'C:\\': {Users: {}, Mektep: {'sabak.txt': 'Информатика — кызыктуу!'}}}; let cwd = ['C:\\'];
    const node = () => cwd.reduce((n, k, i) => i ? n[k] : fs[k], null);
    const line = t => tm.insertBefore(Object.assign(document.createElement('div'), {textContent: t}), tm.lastChild);
    const H = {help: 'Буйруктар: dir, cd <папка>, cd .., mkdir <ат>, echo <текст> > <файл>, type <файл>, del <файл>, cls, date, ver, whoami',
      dir: () => Object.keys(node()).map(k => (typeof node()[k] === 'object' ? '<DIR>   ' : '        ') + k).join('\n') || '(бош)',
      date: () => new Date().toLocaleString('ru-RU'), ver: 'Microsoft Windows [Машыгуу версиясы]', whoami: () => 'nuraisha\\' + (S?.name || 'okuuchu')};
    const exec = c => {
      const [cmd, ...a] = c.trim().split(/\s+/); const arg = a.join(' '), k = (cmd || '').toLowerCase();
      if (!k) return ''; if (k === 'cls') {tm.innerHTML = ''; prompt_(); return null}
      if (H[k]) return typeof H[k] === 'function' ? H[k]() : H[k];
      if (k === 'cd') {if (arg === '..') {if (cwd.length > 1) cwd.pop(); return ''} if (node()[arg] && typeof node()[arg] === 'object') {cwd.push(arg); return ''} return 'Мындай папка жок: ' + arg}
      if (k === 'mkdir' || k === 'md') {if (!arg) return 'Папканын атын жаз'; node()[arg] = {}; return ''}
      if (k === 'echo') {const m = arg.match(/^(.*)>\s*(\S+)$/); if (m) {node()[m[2]] = m[1].trim(); return ''} return arg}
      if (k === 'type' || k === 'cat') return typeof node()[arg] === 'string' ? node()[arg] : 'Файл табылган жок';
      if (k === 'del') {if (typeof node()[arg] === 'string') {delete node()[arg]; return ''} return 'Файл табылган жок'}
      return `'${cmd}' — мындай буйрук жок. help деп жазып көр.`;
    };
    const path = () => cwd[0] + cwd.slice(1).join('\\');
    const prompt_ = () => {const d = document.createElement('div'); d.innerHTML = `<span>${esc(path())}&gt; </span><input aria-label="Буйрук" autocomplete="off" autocapitalize="off" spellcheck="false">`; tm.append(d); const i = $('input', d); i.focus({preventScroll: true});
      i.onkeydown = e => {if (e.key !== 'Enter') return; const v = i.value; d.textContent = path() + '> ' + v; const r = exec(v); if (r === null) return; tm.append(Object.assign(document.createElement('div'), {textContent: r})); prompt_(); tm.scrollTop = tm.scrollHeight}};
    tm.textContent = 'Microsoft Windows [Машыгуу версиясы]\n'; prompt_(); tm.onclick = () => $('input', tm)?.focus();
  },
  paint(pane) {
    pane.innerHTML = `<div class="row" style="margin-bottom:8px"><select id="pt" style="width:auto"><option value="pen">✏️ Карандаш</option><option value="line">Сызык</option><option value="rect">Тик бурчтук</option><option value="oval">Эллипс</option><option value="fill">Толук тик бурчтук</option><option value="er">Өчүргүч</option></select>
    <input type="color" id="pcol" value="#c8102e" style="width:56px;padding:4px"><input type="range" id="psz" min="1" max="30" value="5" style="width:120px;min-height:0"><button class="btn sm" id="pun">↶ Артка</button><button class="btn sm" id="pcl">Тазалоо</button></div>
    <canvas class="pad" id="cv" width="900" height="560"></canvas><p class="muted">Paint программасынын куралдары: карандаш, сызык, фигуралар, түс, калыңдык, өчүргүч жана «артка кайтаруу» (Ctrl+Z).</p>`;
    const cv = $('#cv', pane), c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, 900, 560);
    const hist = []; let down = null, snap = null;
    const pos = e => {const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 900 / r.width, (e.clientY - r.top) * 560 / r.height]};
    cv.onpointerdown = e => {cv.setPointerCapture(e.pointerId); hist.push(c.getImageData(0, 0, 900, 560)); if (hist.length > 20) hist.shift(); down = pos(e); snap = c.getImageData(0, 0, 900, 560); c.beginPath(); c.moveTo(...down)};
    cv.onpointermove = e => {if (!down) return; const p = pos(e), t = $('#pt', pane).value; c.lineWidth = +$('#psz', pane).value; c.lineCap = 'round'; c.strokeStyle = t === 'er' ? '#fff' : $('#pcol', pane).value; c.fillStyle = $('#pcol', pane).value;
      if (t === 'pen' || t === 'er') {c.lineTo(...p); c.stroke(); return}
      c.putImageData(snap, 0, 0); c.beginPath(); const [x, y] = down, w = p[0] - x, h = p[1] - y;
      if (t === 'line') {c.moveTo(x, y); c.lineTo(...p); c.stroke()} if (t === 'rect') c.strokeRect(x, y, w, h); if (t === 'fill') c.fillRect(x, y, w, h);
      if (t === 'oval') {c.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, 7); c.stroke()}};
    cv.onpointerup = () => down = null;
    $('#pun', pane).onclick = () => hist.length && c.putImageData(hist.pop(), 0, 0);
    $('#pcl', pane).onclick = () => {hist.push(c.getImageData(0, 0, 900, 560)); c.fillStyle = '#fff'; c.fillRect(0, 0, 900, 560)};
  },
  text(pane) {
    pane.innerHTML = `<div class="row" style="margin-bottom:8px">${[['bold', '<b>Ж</b>'], ['italic', '<i>К</i>'], ['underline', '<u>А</u>'], ['justifyLeft', '⯇'], ['justifyCenter', '≡'], ['justifyRight', '⯈'], ['insertUnorderedList', '• тизме'], ['insertOrderedList', '1. тизме']].map(([c, n]) => `<button class="btn sm" data-c="${c}" title="${c}">${n}</button>`).join('')}
    <select id="fsz" style="width:auto"><option value="3">14 pt</option><option value="4">18 pt</option><option value="5">24 pt</option><option value="6">32 pt</option></select><input type="color" id="fcol" value="#14213d" style="width:56px;padding:4px"><select id="ffn" style="width:auto"><option>Times New Roman</option><option>Arial</option><option>Calibri</option></select></div>
    <div class="ed" contenteditable="true" id="ed"><h2>Менин сүйүктүү жаныбарым</h2><p>Бул жерге текст жаз. Сөздү белгилеп, жогорудагы баскычтар менен форматта: калың, жантык, асты сызылган, түс, өлчөм, тегиздөө.</p></div>
    <p class="muted">Тапшырма: «Менин жумалык сабактарым» деген текст түз: аталышы борбордо, 24 pt; күндөрү тизме менен; эң жакшы көргөн сабагың калың жана кызыл түстө.</p>`;
    $$('[data-c]', pane).forEach(b => b.onclick = () => {document.execCommand(b.dataset.c); $('#ed', pane).focus()});
    $('#fsz', pane).onchange = e => document.execCommand('fontSize', false, e.target.value);
    $('#fcol', pane).oninput = e => document.execCommand('foreColor', false, e.target.value);
    $('#ffn', pane).onchange = e => document.execCommand('fontName', false, e.target.value);
  },
  order(pane) {
    let k = 0;
    const run = () => {const [n, steps] = ALG[k % ALG.length]; const sh = shuf(steps.map((s, i) => [s, i])); const picked = [];
      pane.innerHTML = `<div class="game"><h3>Алгоритм түз: ${n}</h3><p class="muted">Кадамдарды туура ирети менен бас.</p><div id="ap">${sh.map(([s, i]) => `<span class="chip" data-i="${i}">${esc(s)}</span>`).join('')}</div><ol id="ao"></ol><p id="ar"></p><button class="btn" id="an">Кийинки алгоритм →</button></div>`;
      $$('[data-i]', pane).forEach(c => c.onclick = () => {
        const i = +c.dataset.i; if (i !== picked.length) {c.classList.add('no'); setTimeout(() => c.classList.remove('no'), 500); return}
        picked.push(i); c.remove(); $('#ao', pane).insertAdjacentHTML('beforeend', `<li>${esc(steps[i])}</li>`); if (picked.length === steps.length) $('#ar', pane).innerHTML = '<b style="color:var(--ok)">Азаматсың! Алгоритм туура түзүлдү.</b>'});
      $('#an', pane).onclick = () => {k++; run()}};
    run();
  },
  caesar(pane) {
    pane.innerHTML = `<div class="game"><h3>Цезарь шифри</h3><label>Текст<textarea id="ct" style="min-height:90px">Мен информатиканы жакшы көрөм</textarea></label>
    <label>Жылдыруу (ачкыч): <b id="ckv">3</b><input type="range" id="ck" min="1" max="35" value="3" style="min-height:0"></label>
    <div class="row"><button class="btn pri" id="ce">Шифрлөө</button><button class="btn" id="cd">Чечмелөө</button></div><div class="box y" id="cr" style="font-family:'JetBrains Mono';margin-top:10px">—</div>
    <p class="muted">Алфавит: кыргыз алфавитинин 36 тамгасы (Ң, Ө, Ү менен). Досуңа шифрленген кат жаз, ачкычты өзүнчө айт!</p></div>`;
    const AB = 'абвгдеёжзийклмнңоөпрстуүфхцчшщъыьэюя';
    const sh = (t, n) => [...t].map(ch => {const lo = ch.toLowerCase(), i = AB.indexOf(lo); if (i < 0) return ch; const r = AB[(i + n + AB.length * 10) % AB.length]; return ch === lo ? r : r.toUpperCase()}).join('');
    const k = () => +$('#ck', pane).value; $('#ck', pane).oninput = () => $('#ckv', pane).textContent = k();
    $('#ce', pane).onclick = () => $('#cr', pane).textContent = sh($('#ct', pane).value, k());
    $('#cd', pane).onclick = () => $('#cr', pane).textContent = sh($('#ct', pane).value, -k());
  },
  robot(pane) {
    pane.innerHTML = `<div class="game"><h3>Arduino: 5 жарык диоду</h3><div class="row" style="gap:16px;margin:14px 0">${[0, 1, 2, 3, 4].map(i => `<div class="lamp" id="led${i}">${i + 2}</div>`).join('')}</div>
    <div class="row"><select id="rm" style="width:auto"><option value="blink">Баары бирге жанып-өчөт</option><option value="run">Чуркоочу жарыктар</option><option value="alt">Кезектешип</option></select>
    <label class="row">delay: <input type="range" id="rd" min="100" max="1000" step="100" value="300" style="width:140px;min-height:0"><b id="rdv">300</b> мс</label><button class="btn pri" id="rs">▶ Иштетүү</button></div>
    <pre id="rc"></pre></div>` + LINKS([['Tinkercad Circuits', 'https://www.tinkercad.com/circuits', 'Arduino схемасын онлайн чогултуп, программасын текшер (акысыз, катталуу керек).']]);
    let tm = null, t = 0;
    const codeF = (m, d) => ({blink: `void setup() {\n  for (int p = 2; p <= 6; p++) pinMode(p, OUTPUT);\n}\nvoid loop() {\n  for (int p = 2; p <= 6; p++) digitalWrite(p, HIGH);\n  delay(${d});\n  for (int p = 2; p <= 6; p++) digitalWrite(p, LOW);\n  delay(${d});\n}`, run: `void setup() {\n  for (int p = 2; p <= 6; p++) pinMode(p, OUTPUT);\n}\nvoid loop() {\n  for (int p = 2; p <= 6; p++) {\n    digitalWrite(p, HIGH);\n    delay(${d});\n    digitalWrite(p, LOW);\n  }\n}`, alt: `void setup() {\n  for (int p = 2; p <= 6; p++) pinMode(p, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(2, HIGH); digitalWrite(4, HIGH); digitalWrite(6, HIGH);\n  digitalWrite(3, LOW);  digitalWrite(5, LOW);\n  delay(${d});\n  digitalWrite(2, LOW);  digitalWrite(4, LOW);  digitalWrite(6, LOW);\n  digitalWrite(3, HIGH); digitalWrite(5, HIGH);\n  delay(${d});\n}`})[m];
    const up = () => {$('#rdv', pane).textContent = $('#rd', pane).value; $('#rc', pane).textContent = codeF($('#rm', pane).value, $('#rd', pane).value)};
    $('#rm', pane).onchange = up; $('#rd', pane).oninput = up; up();
    $('#rs', pane).onclick = () => {clearInterval(tm); t = 0; const m = $('#rm', pane).value; tm = setInterval(() => {if (!document.body.contains(pane) || !$('#led0', pane)) return clearInterval(tm); [0, 1, 2, 3, 4].forEach(i => $('#led' + i, pane).classList.toggle('on', m === 'blink' ? t % 2 === 0 : m === 'run' ? t % 5 === i : (t + i) % 2 === 0)); t++}, +$('#rd', pane).value)};
  },
  cyber(pane) {
    pane.innerHTML = `<div class="game"><h3>Паролуң канчалык бекем?</h3><p class="muted">Чыныгы паролуңду жазба! Ойдон чыгарылган пароль менен текшер. Эч жакка жөнөтүлбөйт.</p>
    <input id="pw" type="text" autocomplete="off" placeholder="Мисалы: Тоо!Көл7Алма"><div class="timer" style="height:14px;margin:10px 0"><i id="pwb" style="width:0"></i></div><b id="pwt"></b><ul id="pwl"></ul></div>
    <p>Коопсуз жана коркунучтуу аракеттерди «Оюндар» бөлүмүндөгү иргөө оюнунан ажырат.</p>`;
    $('#pw', pane).oninput = e => {
      const v = e.target.value; const r = [[v.length >= 10, 'Кеминде 10 белги'], [/[A-ZА-ЯӨҮҢ]/.test(v), 'Баш тамга бар'], [/[a-zа-яөүң]/.test(v), 'Кичине тамга бар'], [/\d/.test(v), 'Цифра бар'], [/[^\wА-Яа-яӨөҮүҢң]/.test(v), 'Атайын белги бар (! ? # @)'], [!/(123|qwerty|password|пароль|1111|0000|2010|2011|2012)/i.test(v), 'Жөнөкөй үлгү жок (123, qwerty, туулган жыл)']];
      const n = r.filter(x => x[0]).length; const b = $('#pwb', pane); b.style.width = n / 6 * 100 + '%'; b.style.background = n < 3 ? 'var(--bad)' : n < 5 ? 'var(--yel)' : 'var(--ok)';
      $('#pwt', pane).textContent = v ? (n < 3 ? 'Алсыз' : n < 5 ? 'Орточо' : 'Бекем') : ''; $('#pwl', pane).innerHTML = r.map(([ok, t]) => `<li style="color:${ok ? 'var(--ok)' : 'var(--mute)'}">${ok ? '✓' : '○'} ${t}</li>`).join('');
    };
  },
  tinker(pane) {pane.innerHTML = LINKS([['Tinkercad 3D', 'https://www.tinkercad.com/', '3D модель жана электрондук схемалар — браузерде, акысыз.'], ['SketchUp Free', 'https://app.sketchup.com/', 'Үй, бөлмө, эмеректин 3D моделин браузерде түзүү.'], ['Simulink Onramp', 'https://matlabacademy.mathworks.com/', 'Simulink боюнча акысыз онлайн киришүү курсу (MathWorks аккаунту керек).']])},
  video(pane) {pane.innerHTML = LINKS([['CapCut (телефон жана браузер)', 'https://www.capcut.com/', 'Видео кесүү, музыка, жазуу жана өтмөлөр кошуу.'], ['Canva видео', 'https://www.canva.com/video-editor/', 'Шаблон менен кыска видео түзүү.']]) + '<p>Тапшырма: «Менин мектебим» темасында 30–60 секунддук видео тарт: башталышы, 3 кадр, жазуу жана музыка.</p>'},
  binary(pane) {
    const W = [128, 64, 32, 16, 8, 4, 2, 1]; let bits = [0, 0, 0, 0, 1, 1, 0, 1];
    pane.innerHTML = `<div class="game"><h3>Биттерди басып, сан түз</h3><p class="muted">Ар бир лампа — бир бит. Күйгөн биттердин маанилерин кошсоң, ондук сан чыгат.</p>
    <div class="row" style="gap:8px">${W.map((w, i) => `<div style="text-align:center"><button class="lamp" data-b="${i}" style="border:0;cursor:pointer">0</button><div class="muted">${w}</div></div>`).join('')}</div>
    <h2 id="bv" style="margin-top:12px"></h2>
    <div class="row"><label>Ондук сан: <input id="bd" type="number" min="0" max="255" style="width:120px"></label><button class="btn pri" id="bc">Экиликке котор</button></div></div>
    <div class="game"><h3>Текшерүү: 5 суроо</h3><div id="bq"></div></div>`;
    const draw = () => {$$('[data-b]', pane).forEach((b, i) => {b.textContent = bits[i]; b.classList.toggle('on', !!bits[i])}); const v = bits.reduce((a, b, i) => a + b * W[i], 0); $('#bv', pane).innerHTML = `${bits.join('')}₂ = ${bits.map((b, i) => b ? W[i] : '').filter(Boolean).join(' + ') || 0} = <span style="color:var(--cherry)">${v}</span>`};
    $$('[data-b]', pane).forEach(b => b.onclick = () => {bits[b.dataset.b] ^= 1; draw()});
    $('#bc', pane).onclick = () => {const n = Math.max(0, Math.min(255, +$('#bd', pane).value || 0)); bits = W.map(w => n & w ? 1 : 0); draw()};
    draw();
    let qi = 0, ok = 0;
    const q = () => {
      if (qi >= 5) {$('#bq', pane).innerHTML = `<p class="score">${ok} / 5</p><button class="btn" id="bqa">Кайра</button>`; $('#bqa', pane).onclick = () => {qi = ok = 0; q()}; return}
      const n = 3 + Math.floor(Math.random() * 60), toDec = qi % 2 === 0, ask = toDec ? n.toString(2) + '₂ = ? (ондук)' : n + ' = ? (экилик)', ans = toDec ? String(n) : n.toString(2);
      $('#bq', pane).innerHTML = `<p><b>${qi + 1}.</b> ${ask}</p><div class="row"><input id="ba" style="width:160px" inputmode="numeric"><button class="btn pri" id="bk">Текшер</button></div><p id="bf"></p>`;
      $('#bk', pane).onclick = () => {const g = $('#ba', pane).value.trim().replace(/^0+(?=\d)/, '') === ans; if (g) ok++; $('#bf', pane).innerHTML = g ? '<b style="color:var(--ok)">Туура!</b>' : `<b style="color:var(--bad)">Туура эмес.</b> Жооп: ${ans}`; qi++; setTimeout(q, 1400)};
    };
    q();
  },
  sheet(pane) {
    const C = 'ABCDEF', NR = 7; const cell = {};
    const init = {A1: 'Аты', B1: 'Информатика', C1: 'Математика', D1: 'Тил', E1: 'Орточо', A2: 'Айша', B2: '5', C2: '4', D2: '5', E2: '=AVERAGE(B2:D2)', A3: 'Мээрим', B3: '4', C3: '4', D3: '3', E3: '=AVERAGE(B3:D3)', A4: 'Айпери', B4: '5', C4: '5', D4: '5', E4: '=AVERAGE(B4:D4)', A6: 'Эң жогорку', E6: '=MAX(E2:E4)', A7: 'Сумма', B7: '=SUM(B2:B4)'};
    Object.assign(cell, init);
    pane.innerHTML = `<p>Уячаны басып, сан же формула жаз (формула <code>=</code> менен башталат). Колдонулган функциялар: <code>SUM, AVERAGE, MAX, MIN, COUNT</code>.</p>
    <div class="content"><table id="sh"><tr><th></th>${[...C].map(c => `<th>${c}</th>`).join('')}</tr>${Array.from({length: NR}, (_, r) => `<tr><th>${r + 1}</th>${[...C].map(c => `<td style="padding:0"><input data-c="${c}${r + 1}" style="border:0;border-radius:0;min-width:96px;margin:0;font-size:15px"></td>`).join('')}</tr>`).join('')}</table></div>
    <p class="muted">Мисалы: F2 уячасына <code>=E2*20</code> жазып көр. B2 бааны өзгөртсөң, орточо өзү кайра эсептелет.</p>`;
    const range = (a, b) => {const out = []; const c1 = a.charCodeAt(0), c2 = b.charCodeAt(0), r1 = +a.slice(1), r2 = +b.slice(1); for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) out.push(String.fromCharCode(c) + r); return out};
    const val = (k, d = 0) => {const v = cell[k]; if (v == null || v === '') return null; if (String(v).startsWith('=')) {if (d > 20) return NaN; return ev(v.slice(1), d + 1)} const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? v : n};
    const ev = (f, d) => {
      const F = {SUM: a => a.reduce((x, y) => x + y, 0), AVERAGE: a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0, MAX: a => Math.max(...a), MIN: a => Math.min(...a), COUNT: a => a.length};
      let e = f.toUpperCase().replace(/(SUM|AVERAGE|MAX|MIN|COUNT)\(([A-F]\d+):([A-F]\d+)\)/g, (_, fn, a, b) => {const nums = range(a, b).map(k => val(k, d)).filter(x => typeof x === 'number'); return '(' + F[fn](nums) + ')'});
      e = e.replace(/[A-F]\d+/g, k => {const v = val(k, d); return typeof v === 'number' ? '(' + v + ')' : '0'});
      if (!/^[\d+\-*/().\s]*$/.test(e)) return '#КАТА';
      try {const r = Function('return ' + e)(); return Number.isFinite(r) ? Math.round(r * 100) / 100 : '#КАТА'} catch (er) {return '#КАТА'}
    };
    const show = () => $$('[data-c]', pane).forEach(i => {if (document.activeElement !== i) {const v = cell[i.dataset.c]; i.value = v && String(v).startsWith('=') ? val(i.dataset.c) : (v ?? ''); i.style.fontWeight = v && String(v).startsWith('=') ? '800' : '400'}});
    $$('[data-c]', pane).forEach(i => {i.onfocus = () => i.value = cell[i.dataset.c] ?? ''; i.onblur = () => {cell[i.dataset.c] = i.value; show()}; i.onkeydown = e => {if (e.key === 'Enter') i.blur()}});
    show();
  },
  fake(pane) {pane.innerHTML = '<p>«Оюндар» бөлүмүндөгү иргөө оюнун ойно: кайсы маалыматка ишенсе болот, кайсынысын текшерүү керек?</p><div class="box y"><b>5 суроо эрежеси:</b> Автор ким? Мазмун темага туурабы? Сайтты ким түзгөн? Датасы барбы? Эмне үчүн ишенем?</div>'},
};
const STARTERS = {py: 'print("Салам!")'};
const PYEX = {
  'Салам': 'at = input("Атың ким? ")\nprint("Салам,", at + "!")',
  'Эсептегич': 'a = int(input("1-сан: "))\nb = int(input("2-сан: "))\nprint("Сумма:", a + b)\nprint("Көбөйтүндү:", a * b)',
  'Шарт: баа': 'baa = 87\nif baa >= 85:\n    print("5 — эң жакшы")\nelif baa >= 70:\n    print("4 — жакшы")\nelse:\n    print("Дагы аракет кыл!")',
  'Цикл: көбөйтүү таблицасы': 'for i in range(1, 10):\n    for j in range(1, 10):\n        print(i * j, end="\\t")\n    print()',
  'while: санды тап': 'import random\nsan = random.randint(1, 10)\ntaap = 0\nwhile taap != san:\n    taap = taap + 1\n    print("Текшерем:", taap)\nprint("Таптым! Сан:", san)',
  'Тизме': 'mevalar = ["алма", "өрүк", "жүзүм"]\nmevalar.append("алмурут")\nfor m in mevalar:\n    print(m)\nprint("Баары:", len(mevalar))',
  'Функция': 'def aya(a, b):\n    return a * b\n\nprint(aya(5, 3))',
};
const kataKG = m => /SyntaxError/.test(m) ? 'Синтаксис катасы: кашаа, тырмакча же «:» белгисин текшер.' : /IndentationError/.test(m) ? 'Чегинүү катасы: if, for, def астындагы саптар 4 боштук менен башталышы керек.' : /NameError/.test(m) ? 'Мындай ат жок: өзгөрмөнүн же функциянын атын туура жаздыңбы?' : /TypeError/.test(m) ? 'Түр катасы: санды текст менен кошуп жатасың го. int() же str() колдон.' : /ZeroDivision/.test(m) ? 'Нөлгө бөлүүгө болбойт!' : /ValueError/.test(m) ? 'Маанинин катасы: мисалы, int() ке сан эмес текст берилди.' : /RecursionError/.test(m) ? 'Рекурсия токтобой калды: базалык шартты текшер.' : 'Катаны окуп, кодуңду текшер.';
const SB = [{n: '10 кадам жыл', mv: 10}, {n: '50 кадам жыл', mv: 50}, {n: '«Салам!» де', say: 'Салам!'}, {n: '90° оңго бурул', tn: 90}, {n: '144° оңго бурул', tn: 144}, {n: '«Мен роботмун» де', say: 'Мен роботмун'}, {n: 'кайтала 5', rep: 5}, {n: '🚩 башына кайт', home: true}, {n: 'кайтала 4', rep: 4}, {n: '└ кайталоонун аягы', end: true}, {n: '15° солго бурул', tn: -15}, {n: 'калемди көтөр', pen: false}, {n: 'калемди түшүр', pen: true}, {n: 'түс: кызыл', col: '#c8102e'}, {n: 'түс: жашыл', col: '#16a34a'}];
// мисалдардагы индекстер: sq = башына кайт, кайтала4, 50 кадам, 90°, аягы
const HTMLEX = {
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Менин баракчам</title>\n</head>\n<body>\n  <h1>Салам, мен Айша!</h1>\n  <p>Мен «НурАиша» мектебинде окуйм.</p>\n  <h2>Менин хоббилерим</h2>\n  <ul>\n    <li>Китеп окуу</li>\n    <li>Программалоо</li>\n  </ul>\n  <a href="https://okuma.kg">Китептер</a>\n</body>\n</html>',
  css: '<style>\n  body { font-family: Arial; background: #fff4d4; }\n  h1 { color: #c8102e; text-align: center; }\n  p { font-size: 18px; color: #14213d; }\n  .box { background: white; padding: 16px; border-radius: 12px; }\n</style>\n<h1>Менин мектебим</h1>\n<div class="box">\n  <p>CSS менен баракча кооз болот!</p>\n</div>',
  card: '<style>\n  .card { width: 260px; margin: 30px auto; padding: 20px; border-radius: 16px;\n          background: linear-gradient(135deg, #c8102e, #ff6b6b); color: white;\n          font-family: Arial; box-shadow: 0 10px 25px rgba(0,0,0,.2); }\n  .card h2 { margin: 0 0 8px; }\n  button { background: #ffc93c; border: 0; padding: 10px 16px; border-radius: 8px; }\n</style>\n<div class="card">\n  <h2>Айша</h2>\n  <p>9-класс · Python, HTML</p>\n  <button>Байланышуу</button>\n</div>'};
const ALG = [['Чай демдөө', ['Чайнекке суу куюу', 'Сууну кайнатуу', 'Чайнекке чай салуу', 'Кайнак суу куюп, 5 мүнөт күтүү', 'Пиалага куюу']], ['Компьютерди күйгүзүү', ['Розеткага туташканын текшерүү', 'Кубат баскычын басуу', 'Операциялык система жүктөлгүчө күтүү', 'Паролду киргизүү', 'Керектүү программаны ачуу']], ['Тиш жуу', ['Щётканы алуу', 'Пастаны сыгуу', 'Тиштерди 2 мүнөт жуу', 'Оозду чайкоо', 'Щётканы жуп, ордуна коюу']], ['Сабакка даярдануу', ['Күндөлүктү ачып, сабактарды кароо', 'Керектүү китептерди тандоо', 'Үй тапшырманы текшерүү', 'Сумкага салуу', 'Форманы даярдоо']]];
SB.forEach(() => 0);

head();
if (MODE === 't' && S?.role === 't') teacher(); else if (MODE === 's' && U) student(); else home();
}
