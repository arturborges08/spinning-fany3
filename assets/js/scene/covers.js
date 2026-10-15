import * as THREE from '../../../vendor/three/three.module.js';
import { BRAND } from './brand.js';

/*
  Texturas do livro HEB desenhadas em <canvas> com a identidade nova:
  capa (logo HEB com os três grifos), lombada e contracapa.
  Cada face tem "map" (cor) e "orm" (G = rugosidade, B = metalicidade):
  o preto é fosco, os grifos amarelos são acetinados e pegam luz.
*/

const MATTE = 'rgb(0, 205, 0)';
const SATIN = 'rgb(0, 110, 0)';

function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Imagem não carregou: ${src}`));
    img.src = src;
  });
}

async function fontsReady() {
  if (!document.fonts) return;
  const loads = [document.fonts.load('800 80px Archivo'), document.fonts.load('500 40px Archivo')];
  await Promise.race([Promise.allSettled(loads), new Promise((r) => setTimeout(r, 2500))]);
}

function texture(c, srgb, renderer) {
  const t = new THREE.CanvasTexture(c);
  t.flipY = false; // UV do glTF
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate = true;
  return t;
}

function font(ctx, weight, size, stretch = 'expanded') {
  ctx.font = `${weight} ${size}px Archivo, "Helvetica Neue", Arial, sans-serif`;
  if ('fontStretch' in ctx) ctx.fontStretch = stretch;
}

// Grão de papel bem leve para a capa não parecer plástico.
function grain(ctx, w, h, alpha) {
  const n = canvas(128, 128), x = n.getContext('2d'), img = x.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  x.putImageData(img, 0, 0);
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'overlay';
  for (let y = 0; y < h; y += 128) for (let xx = 0; xx < w; xx += 128) ctx.drawImage(n, xx, y);
  ctx.restore();
}

// Três grifos com ponta chanfrada, como os do logo.
function bars(ctx, x, y, w, h, color) {
  const bh = h * 0.255, gap = (h - bh * 3) / 2, s = bh * 0.28;
  ctx.fillStyle = color;
  [[w, 0], [w * 0.82, bh + gap], [w, (bh + gap) * 2]].forEach(([bw, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + s, y + dy); ctx.lineTo(x + bw, y + dy); ctx.lineTo(x + bw - s, y + dy + bh); ctx.lineTo(x, y + dy + bh); ctx.closePath(); ctx.fill();
  });
}

function front(mark, W, H) {
  const c = canvas(W, H), o = canvas(W, H);
  const x = c.getContext('2d'), ox = o.getContext('2d');
  const s = W / 1024;
  x.fillStyle = '#101012'; x.fillRect(0, 0, W, H);
  ox.fillStyle = MATTE; ox.fillRect(0, 0, W, H);

  // logo grande
  const mw = W * 0.78, mh = mw * (704 / 2761);
  const mx = (W - mw) / 2, my = H * 0.38;
  x.drawImage(mark, mx, my, mw, mh);
  // os grifos do logo ficam acetinados (pegam reflexo)
  const ex = mx + mw * (1079 / 2761), ew = mw * (787 / 2761);
  bars(ox, ex, my + mh * 0.012, ew, mh * 0.976, SATIN);

  x.fillStyle = BRAND.paper; x.textAlign = 'left';
  font(x, 600, 46 * s); x.fillText('Academy', mx, my + mh + 82 * s);
  grain(x, W, H, 0.06);
  return { c, o };
}

function back(W, H) {
  const c = canvas(W, H), o = canvas(W, H);
  const x = c.getContext('2d'), ox = o.getContext('2d');
  const s = W / 1024;
  x.fillStyle = '#101012'; x.fillRect(0, 0, W, H);
  ox.fillStyle = MATTE; ox.fillRect(0, 0, W, H);
  const lines = ['Você não precisa', 'ser perfeito.', 'Precisa estar', 'disposto.'];
  const left = 110 * s, top = H * 0.32, lh = 96 * s;
  font(x, 800, 78 * s, 'normal');
  // grifo atrás da última linha
  const w = x.measureText(lines[3]).width;
  x.fillStyle = BRAND.mark;
  x.beginPath();
  const gy = top + lh * 3 - 66 * s, gh = 84 * s, ch = 22 * s;
  x.moveTo(left - 12 * s + ch, gy); x.lineTo(left + w + 14 * s, gy); x.lineTo(left + w + 14 * s - ch, gy + gh); x.lineTo(left - 12 * s, gy + gh); x.closePath(); x.fill();
  lines.forEach((l, i) => { x.fillStyle = i === 3 ? BRAND.ink : BRAND.paper; x.fillText(l, left, top + i * lh); });
  bars(x, left, H * 0.84, 120 * s, 70 * s, BRAND.mark);
  grain(x, W, H, 0.06);
  return { c, o };
}

function spine(W, H) {
  const c = canvas(W, H), x = c.getContext('2d');
  x.fillStyle = '#0d0d0f'; x.fillRect(0, 0, W, H);
  bars(x, W * 0.2, H * 0.06, W * 0.6, W * 0.42, BRAND.mark);
  x.save(); x.translate(W / 2, H * 0.56); x.rotate(Math.PI / 2);
  x.fillStyle = BRAND.paper; x.textAlign = 'center'; x.textBaseline = 'middle';
  font(x, 800, W * 0.36); x.fillText('HEB Academy', 0, 0);
  x.restore();
  return c;
}

export async function createCoverSet(renderer, { quality = 'high', base }) {
  await fontsReady();
  const W = quality === 'high' ? 1024 : 640;
  const H = Math.round(W * 1.375);
  const mark = await loadImage(`${base}heb-mark-light.svg`);
  const all = [];
  const t = (cv, srgb = true) => { const tx = texture(cv, srgb, renderer); all.push(tx); return tx; };
  const f = front(mark, W, H), b = back(W, H);
  return {
    front: { map: t(f.c), orm: t(f.o, false) },
    back: { map: t(b.c), orm: t(b.o, false) },
    spine: t(spine(Math.round(W * 0.16), H)),
    dispose() { all.forEach((x) => x.dispose()); },
  };
}
