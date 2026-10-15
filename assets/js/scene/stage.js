import * as THREE from '../../../vendor/three/three.module.js';
import { GLTFLoader } from '../../../vendor/three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from '../../../vendor/three/addons/environments/RoomEnvironment.js';
import { createCoverSet } from './covers.js';
import { createBook } from './book.js';
import { createStack } from './stack.js';
import { Choreography, createPoseState } from './choreography.js';

const MOBILE = '(max-width: 760px), (max-width: 1100px) and (orientation: portrait)';
const FOV = 30;
const CAM_Z = 9;

/*
  Carrega o modelo sem URLs data: (a hospedagem da prévia bloqueia fetch de data:).
  Tenta <nome>.glb; se a hospedagem não servir .glb, usa <nome>.glb.json ({ "glb": base64 }).
*/
async function fetchModel(loader, base, name) {
  let buffer = null;
  try {
    const res = await fetch(`${base}${name}.glb`);
    const type = res.headers.get('content-type') || '';
    if (res.ok && !type.includes('text/html')) buffer = await res.arrayBuffer();
  } catch { /* segue para o .json */ }
  if (!buffer || new TextDecoder().decode(new Uint8Array(buffer, 0, 4)) !== 'glTF') {
    const res = await fetch(`${base}${name}.glb.json`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const bin = atob((await res.json()).glb);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    buffer = bytes.buffer;
  }
  return loader.parseAsync(buffer, '');
}

export class Stage {
  constructor(container, { reducedMotion = false } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.mobile = matchMedia(MOBILE).matches;
    this.quality = this.mobile || (navigator.hardwareConcurrency || 8) <= 4 ? 'low' : 'high';
    this.t = createPoseState();
    this.timer = new THREE.Timer();
    this.smoothY = scrollY;
    this.running = false;
    this.disposed = false;
    this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    this.q = new THREE.Quaternion();
    this.e = new THREE.Euler();
  }

  async init() {
    const renderer = new THREE.WebGLRenderer({ antialias: this.quality === 'high', alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, this.quality === 'high' ? 2 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    this.renderer = renderer;
    this.container.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', (ev) => {
      ev.preventDefault();
      document.documentElement.classList.remove('gl');
      this.stop();
    });

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    scene.environment = this.env;
    scene.environmentIntensity = 0.55;
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    this.camera.position.set(0, 0, CAM_Z);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4, 5, 7);
    const rim = new THREE.DirectionalLight(0xe6ff2e, 1.6); // contraluz marca-texto: recorta o livro preto no fundo preto
    rim.position.set(6, 2, -5);
    const rim2 = new THREE.DirectionalLight(0xbfd4ff, 0.9);
    rim2.position.set(-6, -2, -4);
    const fill = new THREE.HemisphereLight(0xf4f4f0, 0x0b0b0c, 0.55);
    scene.add(key, rim, rim2, fill);

    const modelBase = new URL('../../models/', import.meta.url).href;
    const brandBase = new URL('../../brand/', import.meta.url).href;
    const loader = new GLTFLoader();
    const [bookGltf, stackGltf, covers] = await Promise.all([
      fetchModel(loader, modelBase, 'livro'),
      fetchModel(loader, modelBase, 'pilha'),
      createCoverSet(renderer, { quality: this.quality, base: brandBase }),
    ]);
    if (this.disposed) return;

    this.book = createBook(bookGltf, covers);
    this.stack = createStack(stackGltf);
    scene.add(this.book.object, this.stack.object);
    this.choreo = new Choreography({ bookSize: this.book.size, stackTopY: this.stack.topY, stackSize: this.stack.size });

    this.#resize();
    this.#bind();
    renderer.compile(scene, this.camera);
    this.smoothY = scrollY;
    this.#frame(performance.now());
    this.#kick();
  }

  #view() {
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
    return { halfH, halfW: halfH * this.camera.aspect };
  }

  #resize = () => {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.mobile = matchMedia(MOBILE).matches;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.choreo.measure(this.#view(), this.mobile);
    this.#kick();
  };

  /** Retângulo do livro (e da pilha) na tela, em px. Usado nos testes de sobreposição. */
  screenRects() {
    const out = [];
    for (const obj of [this.book.object, this.stack.object]) {
      if (!obj.visible) continue;
      const box = new THREE.Box3().setFromObject(obj);
      if (box.isEmpty()) continue;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < 8; i++) {
        const v = new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(this.camera);
        const x = (v.x + 1) / 2 * innerWidth, y = (1 - v.y) / 2 * innerHeight;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      out.push({ x0, y0, x1, y1, which: obj === this.book.object ? 'livro' : 'pilha' });
    }
    return out;
  }

  remeasure() { if (this.choreo) { this.choreo.measure(this.#view(), this.mobile); this.#kick(); } }

  #bind() {
    this.onScroll = () => this.#kick();
    addEventListener('scroll', this.onScroll, { passive: true });
    this.onPointer = (e) => { this.pointer.x = (e.clientX / innerWidth) * 2 - 1; this.pointer.y = (e.clientY / innerHeight) * 2 - 1; this.#kick(); };
    if (!this.reducedMotion && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', this.onPointer, { passive: true });
    this.ro = new ResizeObserver(this.#resize);
    this.ro.observe(this.container);
    this.bo = new ResizeObserver(() => this.remeasure());
    this.bo.observe(document.body);
    this.onVis = () => (document.hidden ? this.stop() : this.#kick());
    document.addEventListener('visibilitychange', this.onVis);
  }

  #kick() {
    if (this.running || this.disposed || document.hidden) return;
    this.running = true;
    this.timer.update(performance.now());
    this.renderer.setAnimationLoop(this.#frame);
  }

  stop() { this.running = false; this.renderer?.setAnimationLoop(null); }

  #frame = (now) => {
    this.timer.update(now);
    const dt = Math.min(this.timer.getDelta(), 1 / 20);
    const y = scrollY, t = this.t;
    let alive = false;

    if (this.reducedMotion) {
      const { key, visible } = this.choreo.staticKey(y);
      t.book.pos.copy(key.book.pos); t.book.quat.copy(key.book.quat); t.book.scale = key.book.scale;
      t.spin = 0;
      t.stack.pos.copy(key.stack.pos); t.stack.quat.copy(key.stack.quat); t.stack.scale = key.stack.scale; t.stack.opacity = key.stack.opacity;
      t.heroWeight = 0;
      this.container.classList.toggle('is-off', !visible);
      this.smoothY = y;
    } else {
      this.smoothY += (y - this.smoothY) * (1 - Math.exp(-dt * 8));
      if (Math.abs(y - this.smoothY) < 0.4) this.smoothY = y; else alive = true;
      this.choreo.sample(this.smoothY, t);
    }

    const b = this.book.object;
    b.position.copy(t.book.pos);
    b.quaternion.copy(t.book.quat);
    b.scale.setScalar(t.book.scale);
    this.book.spin.rotation.y = t.spin;

    // no topo: flutua e acompanha levemente o mouse
    const p = this.pointer;
    p.sx += (p.x - p.sx) * (1 - Math.exp(-dt * 4));
    p.sy += (p.y - p.sy) * (1 - Math.exp(-dt * 4));
    if (Math.abs(p.x - p.sx) > 0.002 || Math.abs(p.y - p.sy) > 0.002) alive = true;
    if (!this.reducedMotion && t.heroWeight > 0.01) {
      const time = this.timer.getElapsed(), w = t.heroWeight;
      b.position.y += Math.sin(time * 0.9) * 0.06 * w;
      this.q.setFromEuler(this.e.set((Math.sin(time * 0.6) * 0.03 + p.sy * 0.12) * w, (Math.sin(time * 0.45) * 0.06 + p.sx * 0.22) * w, 0));
      b.quaternion.multiply(this.q);
      alive = true;
    }

    const s = this.stack.object;
    s.position.copy(t.stack.pos);
    s.quaternion.copy(t.stack.quat);
    s.scale.setScalar(t.stack.scale);
    this.stack.setOpacity(t.stack.opacity);

    this.renderer.render(this.scene, this.camera);
    if (!alive) this.stop();
  };

  dispose() {
    this.disposed = true;
    this.stop();
    removeEventListener('scroll', this.onScroll);
    removeEventListener('pointermove', this.onPointer);
    this.ro?.disconnect(); this.bo?.disconnect();
    document.removeEventListener('visibilitychange', this.onVis);
    this.book?.dispose(); this.stack?.dispose(); this.env?.dispose();
    this.renderer?.dispose(); this.renderer?.domElement.remove();
  }
}
