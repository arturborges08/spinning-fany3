import * as THREE from '../../../vendor/three/three.module.js';
import { BRAND } from './brand.js';

/*
  Pilha final — "Pilha de livros" de Alice GameDev (Sketchfab), CC BY 4.0.
  Geometria intacta; os 4 materiais pastel foram recoloridos com a identidade marca-texto da HEB.
  Normalização: centro em X/Z na origem, base em Y = 0, para que o topo
  da pilha (topY) seja o ponto de pouso do livro protagonista.
*/
const RECOLOR = {
  AmareloPastel: { color: '#e6ff2e', roughness: 0.42, metalness: 0 }, // livro de cima: amarelo marca-texto
  RosaPastel: { color: '#f4f4f0', roughness: 0.6, metalness: 0 },      // livro do meio: branco
  Bege: { color: '#e9e6dc', roughness: 0.9, metalness: 0 },            // páginas
  AzulPastel: { color: '#1b1b1f', roughness: 0.45, metalness: 0 },     // livro de baixo: tinta
};

export function createStack(gltf) {
  const model = gltf.scene;
  const materials = [];

  model.traverse((o) => {
    if (!o.isMesh) return;
    const spec = RECOLOR[o.material.name] || { color: BRAND.ink2, roughness: 0.7 };
    const old = o.material;
    o.material = new THREE.MeshStandardMaterial({
      name: old.name, color: spec.color, roughness: spec.roughness, metalness: spec.metalness || 0,
      side: THREE.FrontSide, transparent: true, opacity: 0, depthWrite: true,
    });
    old.dispose();
    materials.push(o.material);
  });

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);

  const root = new THREE.Group();
  root.name = 'pilha-de-livros';
  root.add(model);

  const size = box.getSize(new THREE.Vector3());
  let currentOpacity = -1;

  return {
    object: root,
    size,
    topY: size.y,
    setOpacity(v) {
      v = Math.min(1, Math.max(0, v));
      if (Math.abs(v - currentOpacity) < 0.001) return;
      currentOpacity = v;
      root.visible = v > 0.002;
      const opaque = v > 0.995;
      for (const m of materials) {
        m.opacity = v;
        if (m.transparent === opaque) { m.transparent = !opaque; m.needsUpdate = true; }
      }
    },
    dispose() {
      materials.forEach((m) => m.dispose());
      model.traverse((o) => o.isMesh && o.geometry.dispose());
    },
  };
}
