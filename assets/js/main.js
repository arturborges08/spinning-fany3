/*
  HEB Academy: interface.
  O HTML funciona sozinho. Aqui entram navegação, grifos, revelações,
  o carrossel de capas, botões magnéticos e o livro 3D.
*/
import { gsap } from '../../vendor/gsap/index.js';
import { ScrollTrigger } from '../../vendor/gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

$$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

/* ---------- navegação ---------- */
const nav = $('[data-nav]');
const onScrollNav = () => nav.classList.toggle('is-floating', scrollY > 40);
addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

const toggle = $('[data-menu-toggle]');
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  $('.sr', toggle).textContent = open ? 'Fechar menu' : 'Abrir menu';
  document.body.style.overflow = open ? 'hidden' : '';
  if (open && !reduced) gsap.fromTo('#menu a', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.06 });
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
$('#menu').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });

/* ---------- grifos ---------- */
function setHL(el, p) {
  el.style.setProperty('--p', p.toFixed(4));
  el.classList.toggle('is-on', p > 0.6);
  el.classList.toggle('is-lit', p > 0.001);
}
function sweep(el, delay = 0) {
  if (reduced) return setHL(el, 1);
  const o = { p: 0 };
  gsap.to(o, { p: 1, duration: 1.1, delay, ease: 'expo.inOut', onUpdate: () => setHL(el, o.p) });
}

// linhas do manifesto: camada de tinta por cima, recortada junto com o grifo
const lines = $$('[data-hl-scrub] .hl');
lines.forEach((l) => {
  const ink = document.createElement('span');
  ink.className = 'hl__ink'; ink.setAttribute('aria-hidden', 'true'); ink.textContent = l.textContent;
  l.append(ink);
});
if (reduced) lines.forEach((l) => setHL(l, 1));
else {
  ScrollTrigger.create({
    trigger: '.manifesto', start: 'top top', end: 'bottom bottom', scrub: 0.6,
    onUpdate: (st) => {
      const p = gsap.utils.clamp(0, 1, (st.progress - 0.08) / 0.72);
      lines.forEach((l, i) => setHL(l, gsap.utils.clamp(0, 1, p * lines.length - i)));
    },
  });
}

$$('[data-hl-view]').forEach((el) => {
  if (reduced) return setHL(el, 1);
  ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => sweep(el, 0.1) });
});

/* ---------- revelações ---------- */
function maskHeading(el) {
  const inner = document.createElement('span');
  inner.className = 'mask__in';
  inner.append(...el.childNodes);
  const outer = document.createElement('span');
  outer.className = 'mask'; outer.append(inner);
  el.append(outer);
  return inner;
}
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'word'; s.textContent = w;
    el.append(s);
    if (i < words.length - 1) el.append(' ');
    return s;
  });
}

if (!reduced) {
  // abertura: o logo se monta, os grifos riscam, os marcadores aparecem
  const hero = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero
    .from('.mark--hero .mk-l', { yPercent: 18, opacity: 0, duration: 1.3, stagger: 0.12 }, 0.1)
    .fromTo('.mark--hero .mk-b', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut', stagger: 0.12 }, 0.45)
    .from('.flags li', { scale: 0.6, opacity: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.07 }, 0.9)
    .from('.hero__foot > *', { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.8)
    .from('.nav__bar', { y: -20, opacity: 0, duration: 1 }, 0.6)
    .from('.hero__scroll', { opacity: 0, duration: 1 }, 1.2);
  $$('[data-hl-load]').forEach((el) => sweep(el, 1.4));

  // marcadores e texto do topo saem antes de o livro atravessar a tela
  gsap.to('.flags', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '12% top', scrub: true } });
  gsap.to('.hero__foot, .hero__scroll', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '2% top', end: '14% top', scrub: true } });

  // marcadores flutuando de leve
  $$('.flags li').forEach((li, i) => {
    gsap.to(li, { y: i % 2 ? 8 : -8, duration: 2.6 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });
  });

  $$('[data-mask]').forEach((el) => {
    const inner = maskHeading(el);
    gsap.from(inner, { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  $$('[data-blur]').forEach((el) => {
    gsap.from(splitWords(el), { opacity: 0, y: 10, filter: 'blur(10px)', duration: 0.9, ease: 'power3.out', stagger: 0.035, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  $$('[data-rise]').forEach((el) => {
    gsap.from(el, { y: 28, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('[data-line]').forEach((li) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 88%', once: true } });
    tl.from(li.querySelector('span'), { yPercent: 105, duration: 1.1, ease: 'expo.out' })
      .from(li, { '--flag-s': 0, duration: 0.8, ease: 'expo.out' }, 0.15);
  });

  // a folha branca dos livros cresce até ocupar a tela
  gsap.fromTo('[data-sheet]', { scale: 0.93, borderRadius: 56 }, {
    scale: 1, borderRadius: 32, ease: 'none',
    scrollTrigger: { trigger: '.books', start: 'top bottom', end: 'top 15%', scrub: 0.5 },
  });

  // retrato: abre de baixo para cima e ganha cor
  $$('[data-reveal-photo]').forEach((fig) => {
    const img = fig.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 80%', once: true } });
    tl.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.3, ease: 'expo.inOut' })
      .fromTo(img, { scale: 1.2, filter: 'grayscale(1)' }, { scale: 1, filter: 'grayscale(0)', duration: 1.8, ease: 'expo.out' }, 0.2);
  });

  // logo do rodapé: os grifos riscam quando ele aparece
  gsap.fromTo('[data-footer-mark] use', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true } });

  // botões magnéticos
  if (fine) {
    $$('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.22);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }
} else {
  $$('[data-hl-load]').forEach((el) => setHL(el, 1));
}

/* ---------- carrossel de capas ---------- */
const flow = $('[data-flow]');
const items = $$('.flow__item', flow);
const tabs = $$('[data-tabs] [role="tab"]');
const books = $$('[data-book]');
let idx = 0, drag = null;

// distância circular: o livro ativo sempre tem vizinhos dos dois lados
const ring = (d, n) => ((d % n) + n + n / 2) % n - n / 2;
const lastD = [];
function place(pos) {
  const cw = items[0].offsetWidth;
  const n = items.length;
  const narrow = matchMedia('(max-width: 760px), (max-width: 1100px) and (orientation: portrait)').matches;
  items.forEach((it, i) => {
    const d = ring(i - pos, n), a = Math.abs(d);
    // quem dá a volta por trás troca de lado sem atravessar a tela
    const jump = lastD[i] !== undefined && Math.abs(d - lastD[i]) > n / 2;
    lastD[i] = d;
    if (jump) { it.style.transition = 'none'; requestAnimationFrame(() => requestAnimationFrame(() => { it.style.transition = ''; })); }
    const x = d * cw * (narrow ? 0.62 : 0.74);
    const z = -Math.min(a, 3) * (narrow ? 120 : 170);
    const ry = Math.max(-58, Math.min(58, -d * 30));
    const sc = 1 - Math.min(a, 2) * 0.05;
    it.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`;
    // no desktop ficam três capas à vista e a margem esquerda guarda a nota
    const wide = !narrow && innerWidth > 1080;
    it.style.opacity = wide ? (a > 1.5 ? '0' : String(1 - Math.max(0, a - 1) * 0.6)) : (a > 2.4 ? '0' : String(1 - Math.max(0, a - 1.4) * 0.55));
    it.style.pointerEvents = it.style.opacity === '0' ? 'none' : '';
    it.style.filter = a > 0.5 ? `brightness(${1 - Math.min(a, 2) * 0.12})` : '';
    it.style.zIndex = String(100 - Math.round(a * 10));
  });
  // a nota de margem nunca fica sobre uma capa: se a tela for estreita demais, ela some
  const noteEl = document.querySelector('[data-note]');
  const check = () => {
    const nr = noteEl.getBoundingClientRect();
    const clash = items.some((it) => it.style.opacity !== '0' && (() => { const r = it.getBoundingClientRect(); return r.left < nr.right + 16 && r.right > nr.left && r.top < nr.bottom && r.bottom > nr.top; })());
    noteEl.classList.toggle('is-clash', clash);
  };
  if (noteEl) { requestAnimationFrame(check); clearTimeout(place.t); place.t = setTimeout(check, 950); }
}

function select(i, { focusTab = false, animate = true } = {}) {
  idx = (i + items.length) % items.length;
  flow.classList.remove('is-drag');
  items.forEach((it, k) => { it.setAttribute('aria-current', String(k === idx)); it.setAttribute('aria-label', `${k + 1} de ${items.length}`); });
  place(idx);
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === idx)); t.tabIndex = k === idx ? 0 : -1; });
  if (focusTab) tabs[idx].focus({ preventScroll: true });
  // no celular as abas rolam de lado: traz a ativa para a vista sem mexer na página
  const bar = tabs[idx].parentElement;
  if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: tabs[idx].offsetLeft - bar.offsetLeft - 20, behavior: reduced ? 'auto' : 'smooth' });
  // nota de margem acompanha o livro
  const note = $('[data-note-text]');
  if (note && note.textContent !== items[idx].dataset.note) {
    if (animate && !reduced) gsap.fromTo(note, { opacity: 0, filter: 'blur(8px)', y: 8 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.6, ease: 'expo.out' });
    note.textContent = items[idx].dataset.note;
  }
  books.forEach((b, k) => {
    const on = k === idx;
    if (on === b.classList.contains('is-active')) return;
    b.classList.toggle('is-active', on);
    if (on && animate && !reduced) {
      gsap.fromTo(b.querySelectorAll('.detail__copy > *, .detail__buy > *'), { y: 18, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', stagger: 0.04, overwrite: true });
    }
  });
}

if (flow) {
  flow.tabIndex = 0;
  select(0, { animate: false });
  $('[data-prev]').addEventListener('click', () => select(idx - 1));
  $('[data-next]').addEventListener('click', () => select(idx + 1));
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => select(k));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); select(idx + 1, { focusTab: true }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); select(idx - 1, { focusTab: true }); }
    });
  });
  flow.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(idx + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); select(idx - 1); }
  });
  items.forEach((it, k) => it.addEventListener('click', () => { if (!drag?.moved) select(k); }));

  // arrastar com o dedo ou o mouse
  flow.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    drag = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
  });
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) { drag.moved = true; flow.classList.add('is-drag'); }
    if (drag.moved) {
      items.forEach((it) => { it.style.transition = 'none'; });
      place(idx - dx / (items[0].offsetWidth * 0.8));
    }
  });
  addEventListener('pointerup', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    items.forEach((it) => { it.style.transition = ''; });
    if (drag.moved) {
      const dx = e.clientX - drag.x;
      const steps = Math.round(dx / (items[0].offsetWidth * 0.8)) || (Math.abs(dx) > 40 ? Math.sign(dx) : 0);
      select(idx - steps);
    }
    setTimeout(() => { drag = null; }, 0);
  });
  addEventListener('resize', () => place(idx));
}

// atalhos de assunto (marcadores do topo, rodapé) abrem o livro certo
$$('[data-pick]').forEach((a) => a.addEventListener('click', () => select(Number(a.dataset.pick))));

/* ---------- livro 3D ---------- */
function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
let stage = null;
async function bootStage() {
  const el = $('[data-stage]');
  if (!el || !hasWebGL() || navigator.connection?.saveData) return;
  try {
    const { Stage } = await import('./scene/stage.js');
    stage = new Stage(el, { reducedMotion: reduced });
    await stage.init();
    root.classList.add('gl');
    ScrollTrigger.refresh();
    stage.remeasure();
    addEventListener('pagehide', (e) => { if (!e.persisted) stage.dispose(); });
    window.__heb = stage;
  } catch (err) {
    console.warn('[HEB] 3D indisponível, usando imagens estáticas.', err);
    stage?.dispose?.(); stage = null; root.classList.remove('gl');
  }
}
bootStage();
addEventListener('load', () => { ScrollTrigger.refresh(); stage?.remeasure(); });
document.fonts?.ready.then(() => { ScrollTrigger.refresh(); stage?.remeasure(); });
