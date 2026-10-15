import * as THREE from '../../../vendor/three/three.module.js';
import { BRAND } from './brand.js';

/*
  Livro HEB: geometria do modelo enviado (capa, contracapa, lombada, miolo),
  centralizado, capa voltada para a câmera (+Z), lombada à esquerda.
  Ganha cinco marcadores de página (um por livro) saindo do topo das folhas.
*/
export function createBook(gltf, covers) {
  const mat = (t) => new THREE.MeshStandardMaterial({ map: t.map, roughnessMap: t.orm, metalnessMap: t.orm, roughness: 1, metalness: 0, envMapIntensity: 1.2 });
  const coverMat = mat(covers.front);
  const backMat = mat(covers.back);
  const spineMat = new THREE.MeshStandardMaterial({ map: covers.spine, roughness: 0.7, metalness: 0 });
  const pagesMat = new THREE.MeshStandardMaterial({ color: BRAND.pages, roughness: 0.95, metalness: 0 });
  const byName = { capa: coverMat, contracapa: backMat, lombada: spineMat, miolo: pagesMat };

  const model = gltf.scene;
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.material?.dispose?.();
    o.material = byName[o.name] || pagesMat;
    if (o.name === 'miolo') { o.scale.x *= 0.982; o.scale.z *= 0.985; o.position.x += 0.0065; }
  });

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  model.position.sub(box.getCenter(new THREE.Vector3()));

  const facing = new THREE.Group();
  facing.rotation.y = Math.PI; // capa do arquivo original olha para −Z
  facing.add(model);

  // marcadores de página (no espaço já virado para a câmera: x direita, y cima, z frente)
  const flagGeo = new THREE.BoxGeometry(0.11, 0.42, 0.006);
  const flagMats = BRAND.flags.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 }));
  const flags = new THREE.Group();
  const xs = [-0.42, -0.2, 0.02, 0.24, 0.46];
  const peek = [0.13, 0.19, 0.1, 0.16, 0.12];
  xs.forEach((x, i) => {
    const m = new THREE.Mesh(flagGeo, flagMats[i]);
    m.position.set(x * size.x / 1.45, size.y / 2 - 0.21 + peek[i], (i - 2) * 0.035);
    m.rotation.z = (i - 2) * 0.03;
    flags.add(m);
  });

  const spin = new THREE.Group();
  spin.add(facing, flags);
  const root = new THREE.Group();
  root.name = 'livro-heb';
  root.add(spin);

  return {
    object: root,
    spin,
    size,
    dispose() {
      [coverMat, backMat, spineMat, pagesMat, ...flagMats].forEach((m) => m.dispose());
      flagGeo.dispose();
      model.traverse((o) => o.isMesh && o.geometry.dispose());
      covers.dispose();
    },
  };
}
