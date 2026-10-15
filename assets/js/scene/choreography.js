import * as THREE from '../../../vendor/three/three.module.js';

/*
  Coreografia do livro guiada pelo scroll.

  Cada [data-scene] é uma chave com faixa [from, to]. Dentro da faixa o livro fica
  na pose da chave (podendo girar devagar: hold); entre chaves ele viaja com easing
  e dá voltas completas (turns), como um objeto girando na mão.

  Regra de ouro: o livro só ocupa áreas sem texto. Ele sai da tela (pose "out")
  enquanto as seções de leitura passam e volta para pousar na pilha no final.
  Depois de pousar, livro e pilha rolam junto com a página.

  x/y em frações da meia-largura/meia-altura visível no plano z = 0. Rotações em graus.
*/

const D = THREE.MathUtils.degToRad;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const POSES = {
  desktop: {
    hero:      { x: 0,     y: 0.0,   rx: 10, ry: -24, rz: -6, s: 1.08, turns: 0, hold: 0.12 },
    manifesto: { x: 0.56,  y: -0.04, rx: 6,  ry: -34, rz: 8,  s: 1.18, turns: 1, hold: 0.45 },
    out:       { x: 1.55,  y: 0.55,  rx: 24, ry: 60,  rz: -30, s: 0.9, turns: 1.5, hold: 0 },
    outEnter:  { x: 1.6,   y: -0.15, rx: 24, ry: 60,  rz: -30, s: 0.9, turns: 1.5, hold: 0 },
    stack:     { x: 0.48,  y: -0.5,  rx: 22, ry: -32, s: 2.7 },
    land:      { rx: -90, ry: 0, rz: -8, s: 0.6, hover: 0.7, turns: 2 },
  },
  mobile: {
    hero:      { x: 0,     y: 0.12,  rx: 10, ry: -22, rz: -6, s: 0.78, turns: 0, hold: 0.12 },
    manifesto: { x: 0.02,  y: 0.46,  rx: 8,  ry: -30, rz: 8,  s: 0.68, turns: 1, hold: 0.45 },
    out:       { x: 0.0,   y: 1.9,   rx: 24, ry: 40,  rz: -10, s: 0.62, turns: 1.5, hold: 0 },
    outEnter:  { x: 1.9,   y: -0.8,  rx: 24, ry: 60,  rz: -30, s: 0.6, turns: 1.5, hold: 0 },
    stack:     { x: 0.04,  y: -0.36, rx: 24, ry: -30, s: 1.55 },
    land:      { rx: -90, ry: 0, rz: -8, s: 0.36, hover: 0.35, turns: 2 },
  },
};

function pose(def, view) {
  return {
    pos: new THREE.Vector3(def.x * view.halfW, def.y * view.halfH, def.z || 0),
    quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(D(def.rx), D(def.ry), D(def.rz || 0), 'YXZ')),
    scale: def.s,
  };
}

export function createPoseState() {
  return {
    book: { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1 },
    spin: 0,
    stack: { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1, opacity: 0 },
    heroWeight: 1,
    lift: 0,
  };
}

export class Choreography {
  constructor(dims) { this.dims = dims; this.keys = []; }

  /* Âncora: um elemento do layout reserva o espaço do livro (ou da pilha).
     screenTop = onde o topo da âncora estará na tela quando a pose estiver parada. */
  #fit(el, screenTop, def, objW, objH, fill) {
    const r = el?.getBoundingClientRect();
    if (!r || r.width < 2 || r.height < 2) return def;
    const vh = innerHeight, vw = innerWidth, v = this.view;
    const cx = r.left + r.width / 2, cy = screenTop + r.height / 2;
    const wW = (r.width / vw) * 2 * v.halfW, hW = (r.height / vh) * 2 * v.halfH;
    const s = Math.min(hW * fill / objH, wW * fill / objW);
    return { ...def, x: (cx / vw) * 2 - 1, y: 1 - (cy / vh) * 2, s };
  }

  measure(view, mobile) {
    this.view = view;
    this.attachHero = mobile; // no celular o livro sai por cima junto com o conteúdo e volta descendo
    const P = POSES[mobile ? 'mobile' : 'desktop'];
    const vh = innerHeight, sy = scrollY;
    const docEnd = Math.max(1, document.documentElement.scrollHeight - vh);
    const finEl = document.querySelector('[data-scene="final"]');
    const finRect = finEl?.getBoundingClientRect();
    let finEnd = finRect ? Math.min(docEnd, finRect.top + sy + finRect.height / 2 - vh / 2) : 0;
    // o pouso precisa de uma janela mínima de rolagem depois que o livro volta à tela
    if (finRect) finEnd = Math.max(finEnd, finRect.top + sy - vh * (mobile ? 0.12 : 0.62) + vh * 0.45);
    finEnd = Math.min(finEnd, docEnd - 1);
    const stackAnchor = document.querySelector('[data-stack-anchor]');
    const sz = this.dims.stackSize;
    const stackDef = stackAnchor ? this.#fit(stackAnchor, stackAnchor.getBoundingClientRect().top + sy - finEnd, P.stack, sz.x * 1.05, sz.y * 1.9, 0.62) : P.stack;
    // a pilha tem a origem na base: desce meia altura para ficar centrada na âncora
    if (stackAnchor) stackDef.y -= (sz.y * 1.9 * stackDef.s / 2) / view.halfH * 0.9;
    const stackFinal = pose(stackDef, view);
    this.finEnd = finEnd;
    const hidden = { pos: stackFinal.pos.clone().add(new THREE.Vector3(0, -view.halfH * 1.3, 0)), quat: stackFinal.quat.clone(), scale: stackFinal.scale * 0.9, opacity: 0 };
    const shown = { ...stackFinal, opacity: 1 };
    const keys = [];

    for (const el of document.querySelectorAll('[data-scene]')) {
      const name = el.dataset.scene;
      const r = el.getBoundingClientRect();
      const top = r.top + sy, bottom = top + r.height;

      if (name === 'final' && P.outEnter && keys.at(-1)?.name === 'out') {
        const o = keys.at(-1);
        keys.push({ name: 'out-in', from: o.to + 1, to: o.to + 1, book: pose(P.outEnter, view), turns: P.outEnter.turns, hold: 0, stack: o.stack });
      }
      if (name === 'final') {
        const end = finEnd; // pousa quando o final está centralizado
        const start = Math.max(top - vh * 0.75, keys.at(-1)?.to ?? 0);
        const endOk = end;
        const mid = start + (endOk - start) * 0.55;
        keys.push({ name: 'aproximacao', from: mid, to: mid, book: this.#onStack(stackFinal, { ...P.land, rx: -42, rz: -26 }, P.land.hover), turns: P.land.turns - 0.25, hold: 0, stack: shown });
        keys.push({ name: 'final', from: endOk, to: Infinity, book: this.#onStack(stackFinal, P.land, 0), turns: P.land.turns, hold: 0, stack: shown, scrollAway: false });
        continue;
      }
      let def = P[name];
      if (!def) continue;
      const anchor = el.querySelector('[data-book-anchor]');
      const bw = this.dims.bookSize.x, bh = this.dims.bookSize.y;
      if (anchor && name === 'hero') def = this.#fit(anchor, anchor.getBoundingClientRect().top + sy, def, bw * 1.5, bh * 1.25, 1);
      if (anchor && name === 'manifesto') {
        const pin = anchor.parentElement.getBoundingClientRect();
        def = this.#fit(anchor, anchor.getBoundingClientRect().top - pin.top, def, bw * 1.5, bh * 1.25, 0.88);
      }
      let from = Math.max(0, top - vh * 0.25);
      let to = Math.max(from, bottom - vh * 0.75);
      if (name === 'hero') { from = 0; to = vh * (mobile ? 0.55 : 0.05); }
      if (name === 'manifesto') { from = top - vh * 0.5; to = bottom - vh * 1.05; }
      if (name === 'out') { from = top - vh * 0.6; to = bottom - vh * (mobile ? 0.12 : 0.62); }
      // seções "out" consecutivas viram uma só faixa
      const last = keys.at(-1);
      if (name === 'out' && last?.name === 'out') { last.to = Math.max(last.to, to); continue; }
      if (name === 'manifesto' && mobile) to = bottom - vh; // o pin solta exatamente aqui
      const attach = name === 'hero' || name === 'manifesto';
      keys.push({ name, from, to, book: pose(def, view), turns: def.turns, hold: def.hold, stack: hidden, attach, attachFrom: name === 'hero' ? 0 : to });
    }
    keys.sort((a, b) => a.from - b.from);
    this.keys = keys;
  }

  #onStack(stack, land, hover) {
    const thick = this.dims.bookSize.z * land.s;
    const localY = this.dims.stackTopY + (thick / 2 + hover) / stack.scale;
    const local = new THREE.Matrix4().compose(
      new THREE.Vector3(0.02, localY, 0.03),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(D(land.rx), D(land.ry), D(land.rz), 'YXZ')),
      new THREE.Vector3(1, 1, 1).multiplyScalar(land.s / stack.scale),
    );
    const world = new THREE.Matrix4().compose(stack.pos, stack.quat, new THREE.Vector3(1, 1, 1).multiplyScalar(stack.scale)).multiply(local);
    const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), sc = new THREE.Vector3();
    world.decompose(pos, quat, sc);
    return { pos, quat, scale: sc.x };
  }

  sample(y, out) {
    const k = this.keys;
    if (!k.length) return out;
    let a = k[0], b = k[0], t = 0;
    for (let i = 0; i < k.length; i++) {
      const cur = k[i], next = k[i + 1];
      if (y <= cur.to || !next) { a = b = cur; break; }
      if (y < next.from) { a = cur; b = next; t = ease(clamp01((y - cur.to) / (next.from - cur.to))); break; }
    }
    // no topo o livro sobe junto com o conteúdo (como parte da página) até a viagem levá-lo embora
    if (a.attach && this.attachHero) {
      this.tmp ??= new THREE.Vector3();
      this.tmp.copy(a.book.pos); this.tmp.y += Math.max(0, y - a.attachFrom) * (2 * this.view.halfH / innerHeight);
      out.book.pos.lerpVectors(this.tmp, b.book.pos, t);
    } else out.book.pos.lerpVectors(a.book.pos, b.book.pos, t);
    out.book.quat.slerpQuaternions(a.book.quat, b.book.quat, t);
    out.book.scale = a.book.scale + (b.book.scale - a.book.scale) * t;

    // voltas: as de viagem + um giro lento enquanto a seção está parada
    const holdOf = (key) => (key.hold && Number.isFinite(key.to) && key.to > key.from ? key.hold * clamp01((y - key.from) / (key.to - key.from)) : 0);
    const turnsA = a.turns + (a === b ? holdOf(a) : a.hold || 0);
    out.spin = (turnsA + (b.turns - turnsA) * t) * Math.PI * 2;

    out.stack.pos.lerpVectors(a.stack.pos, b.stack.pos, t);
    out.stack.quat.slerpQuaternions(a.stack.quat, b.stack.quat, t);
    out.stack.scale = a.stack.scale + (b.stack.scale - a.stack.scale) * t;
    const op = a.stack.opacity + (b.stack.opacity - a.stack.opacity) * t;
    out.stack.opacity = a.stack.opacity < b.stack.opacity ? clamp01((op - 0.2) / 0.8) : op;
    out.heroWeight = 1 - clamp01(y / (innerHeight * 0.5));

    // a pilha mora num lugar da página: acompanha a rolagem antes e depois do pouso
    const lift = (y - this.finEnd) * (2 * this.view.halfH / innerHeight);
    out.stack.pos.y += lift;
    const onStack = (k) => k.name === 'aproximacao' || k.name === 'final';
    const w = onStack(a) && onStack(b) ? 1 : onStack(b) ? t : onStack(a) ? 1 - t : 0;
    out.book.pos.y += lift * w;
    out.lift = lift;
    return out;
  }

  staticKey(y) {
    const fin = this.keys.find((x) => x.name === 'final');
    const apr = this.keys.find((x) => x.name === 'aproximacao');
    if (fin && apr && y >= apr.from) return { key: fin, visible: true };
    return { key: this.keys[0], visible: y < innerHeight * 0.7 };
  }
}
