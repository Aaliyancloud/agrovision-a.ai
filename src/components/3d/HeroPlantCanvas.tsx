import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../../context/LanguageContext';
import { RotateCw, ZoomIn, Sparkles } from 'lucide-react';

interface HeroPlantCanvasProps {
  onScanClick?: () => void;
  onOpenVideo?: () => void;
  onSceneReady?: () => void;
}

interface BotanicalTextures {
  leafAlbedo: THREE.CanvasTexture;
  blightedLeafAlbedo: THREE.CanvasTexture;
  leafBump: THREE.CanvasTexture;
  leafRoughness: THREE.CanvasTexture;
  tomatoAlbedo: THREE.CanvasTexture;
  tomatoBump: THREE.CanvasTexture;
  potAlbedo: THREE.CanvasTexture;
  soilAlbedo: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  disposeAll: () => void;
}

/**
 * Generates crisp 512px/256px procedural botanical textures for leaves, tomatoes, terracotta, and potting soil.
 */
function createBotanicalTextures(maxAnisotropy: number): BotanicalTextures {
  const aniso = Math.min(8, Math.max(1, maxAnisotropy));

  // 1. High-resolution Compound Tomato Leaflet Albedo (512x512, SRGB)
  const leafAlbedoCanvas = document.createElement('canvas');
  leafAlbedoCanvas.width = 512;
  leafAlbedoCanvas.height = 512;
  const lCtx = leafAlbedoCanvas.getContext('2d');
  if (lCtx) {
    const baseGrad = lCtx.createLinearGradient(0, 512, 0, 0);
    baseGrad.addColorStop(0, '#1e6e35');
    baseGrad.addColorStop(0.45, '#278240');
    baseGrad.addColorStop(0.85, '#339249');
    baseGrad.addColorStop(1, '#43a451');
    lCtx.fillStyle = baseGrad;
    lCtx.fillRect(0, 0, 512, 512);

    // Rich mesophyll mottling & sunlit leaf margin highlights
    const marginGlow = lCtx.createRadialGradient(256, 260, 40, 256, 260, 270);
    marginGlow.addColorStop(0, 'rgba(20, 74, 34, 0.28)');
    marginGlow.addColorStop(0.65, 'rgba(62, 148, 66, 0.14)');
    marginGlow.addColorStop(1, 'rgba(134, 210, 102, 0.24)');
    lCtx.fillStyle = marginGlow;
    lCtx.fillRect(0, 0, 512, 512);

    // Fine organic trichome/cellular grain
    for (let i = 0; i < 1600; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      lCtx.fillStyle =
        i % 3 === 0 ? 'rgba(187, 247, 208, 0.06)' : 'rgba(12, 50, 22, 0.06)';
      lCtx.fillRect(gx, gy, 2, 2);
    }

    // Feathered midrib vein
    const midribGrad = lCtx.createLinearGradient(0, 500, 0, 20);
    midribGrad.addColorStop(0, '#8ad468');
    midribGrad.addColorStop(0.6, '#6cc058');
    midribGrad.addColorStop(1, '#58ad4f');
    lCtx.strokeStyle = midribGrad;
    lCtx.lineCap = 'round';
    lCtx.lineWidth = 7.5;
    lCtx.beginPath();
    lCtx.moveTo(256, 506);
    lCtx.lineTo(256, 16);
    lCtx.stroke();

    // Pinnate lateral veins + delicate tertiary branches
    const veinPairs = 8;
    for (let i = 0; i < veinPairs; i++) {
      const t = (i + 0.7) / (veinPairs + 0.6);
      const y = 470 - t * 410;
      const span = 120 + Math.sin(t * Math.PI) * 115;
      const rise = 46 + t * 28;
      const w = 3.8 - t * 1.8;

      [-1, 1].forEach((dir) => {
        lCtx.strokeStyle = 'rgba(138, 214, 114, 0.72)';
        lCtx.lineWidth = w;
        lCtx.beginPath();
        lCtx.moveTo(256, y);
        lCtx.quadraticCurveTo(
          256 + dir * span * 0.48,
          y - rise * 0.38,
          256 + dir * span,
          y - rise
        );
        lCtx.stroke();

        // Fine secondary veinlet offshoots
        lCtx.strokeStyle = 'rgba(155, 226, 134, 0.42)';
        lCtx.lineWidth = Math.max(1.0, w * 0.48);
        lCtx.beginPath();
        lCtx.moveTo(256 + dir * span * 0.45, y - rise * 0.34);
        lCtx.quadraticCurveTo(
          256 + dir * span * 0.72,
          y - rise * 0.72,
          256 + dir * span * 0.9,
          y - rise * 1.15
        );
        lCtx.stroke();
      });
    }
  }
  const leafAlbedo = new THREE.CanvasTexture(leafAlbedoCanvas);
  leafAlbedo.colorSpace = THREE.SRGBColorSpace;
  leafAlbedo.anisotropy = aniso;

  // 1b. Blighted Tomato Leaf Texture (512x512: chlorotic yellowing + Early/Late Blight target lesions)
  const blightCanvas = document.createElement('canvas');
  blightCanvas.width = 512;
  blightCanvas.height = 512;
  const blCtx = blightCanvas.getContext('2d');
  if (blCtx) {
    const bgGrad = blCtx.createLinearGradient(0, 512, 0, 0);
    bgGrad.addColorStop(0, '#5f7328');
    bgGrad.addColorStop(0.5, '#869432');
    bgGrad.addColorStop(0.82, '#b3a338');
    bgGrad.addColorStop(1, '#8c6124');
    blCtx.fillStyle = bgGrad;
    blCtx.fillRect(0, 0, 512, 512);

    const edgeScorch = blCtx.createRadialGradient(256, 280, 90, 256, 260, 265);
    edgeScorch.addColorStop(0, 'rgba(130, 146, 48, 0.1)');
    edgeScorch.addColorStop(0.68, 'rgba(198, 174, 46, 0.35)');
    edgeScorch.addColorStop(1, 'rgba(92, 48, 18, 0.72)');
    blCtx.fillStyle = edgeScorch;
    blCtx.fillRect(0, 0, 512, 512);

    blCtx.strokeStyle = 'rgba(196, 198, 102, 0.75)';
    blCtx.lineCap = 'round';
    blCtx.lineWidth = 6;
    blCtx.beginPath();
    blCtx.moveTo(256, 504);
    blCtx.lineTo(256, 18);
    blCtx.stroke();

    const spots = [
      { x: 185, y: 310, r: 44 },
      { x: 324, y: 270, r: 40 },
      { x: 225, y: 175, r: 38 },
      { x: 300, y: 120, r: 32 },
      { x: 165, y: 220, r: 28 },
      { x: 340, y: 375, r: 36 },
      { x: 205, y: 405, r: 30 },
      { x: 262, y: 74, r: 34 },
    ];
    for (const sp of spots) {
      const halo = blCtx.createRadialGradient(sp.x, sp.y, sp.r * 0.45, sp.x, sp.y, sp.r * 1.48);
      halo.addColorStop(0, 'rgba(220, 194, 48, 0.88)');
      halo.addColorStop(0.55, 'rgba(208, 176, 42, 0.55)');
      halo.addColorStop(1, 'rgba(180, 150, 40, 0)');
      blCtx.fillStyle = halo;
      blCtx.beginPath();
      blCtx.arc(sp.x, sp.y, sp.r * 1.48, 0, Math.PI * 2);
      blCtx.fill();

      blCtx.fillStyle = '#4a2510';
      blCtx.beginPath();
      blCtx.ellipse(sp.x, sp.y, sp.r * 0.92, sp.r * 0.78, 0.35, 0, Math.PI * 2);
      blCtx.fill();

      blCtx.strokeStyle = '#733c18';
      blCtx.lineWidth = 3.2;
      blCtx.beginPath();
      blCtx.ellipse(sp.x, sp.y, sp.r * 0.62, sp.r * 0.52, 0.35, 0, Math.PI * 2);
      blCtx.stroke();

      blCtx.fillStyle = '#240f05';
      blCtx.beginPath();
      blCtx.ellipse(sp.x, sp.y, sp.r * 0.36, sp.r * 0.3, 0.2, 0, Math.PI * 2);
      blCtx.fill();
    }
  }
  const blightedLeafAlbedo = new THREE.CanvasTexture(blightCanvas);
  blightedLeafAlbedo.colorSpace = THREE.SRGBColorSpace;
  blightedLeafAlbedo.anisotropy = aniso;

  // 2. Crisp Linear Leaflet Bump Map (512x512, NoColorSpace)
  const leafBumpCanvas = document.createElement('canvas');
  leafBumpCanvas.width = 512;
  leafBumpCanvas.height = 512;
  const bCtx = leafBumpCanvas.getContext('2d');
  if (bCtx) {
    bCtx.fillStyle = '#787878';
    bCtx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 420; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const rad = 6 + Math.random() * 14;
      const g = bCtx.createRadialGradient(rx, ry, 0, rx, ry, rad);
      g.addColorStop(0, 'rgba(156, 156, 156, 0.25)');
      g.addColorStop(1, 'rgba(120, 120, 120, 0)');
      bCtx.fillStyle = g;
      bCtx.beginPath();
      bCtx.arc(rx, ry, rad, 0, Math.PI * 2);
      bCtx.fill();
    }

    bCtx.lineCap = 'round';
    bCtx.strokeStyle = '#e5e5e5';
    bCtx.lineWidth = 8.5;
    bCtx.beginPath();
    bCtx.moveTo(256, 506);
    bCtx.lineTo(256, 16);
    bCtx.stroke();

    const veinPairs = 8;
    for (let i = 0; i < veinPairs; i++) {
      const t = (i + 0.7) / (veinPairs + 0.6);
      const y = 470 - t * 410;
      const span = 120 + Math.sin(t * Math.PI) * 115;
      const rise = 46 + t * 28;
      const w = 4.4 - t * 2.0;

      [-1, 1].forEach((dir) => {
        bCtx.strokeStyle = '#cfcfcf';
        bCtx.lineWidth = w;
        bCtx.beginPath();
        bCtx.moveTo(256, y);
        bCtx.quadraticCurveTo(
          256 + dir * span * 0.48,
          y - rise * 0.38,
          256 + dir * span,
          y - rise
        );
        bCtx.stroke();
      });
    }
  }
  const leafBump = new THREE.CanvasTexture(leafBumpCanvas);
  leafBump.anisotropy = aniso;

  // 3. Linear Cuticle Roughness Map (256x256)
  const leafRoughCanvas = document.createElement('canvas');
  leafRoughCanvas.width = 256;
  leafRoughCanvas.height = 256;
  const rCtx = leafRoughCanvas.getContext('2d');
  if (rCtx) {
    rCtx.fillStyle = '#707070';
    rCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 600; i++) {
      const shade = 92 + Math.floor(Math.random() * 58);
      rCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
      rCtx.fillRect(Math.random() * 256, Math.random() * 256, 4, 4);
    }
  }
  const leafRoughness = new THREE.CanvasTexture(leafRoughCanvas);
  leafRoughness.anisotropy = aniso;

  // 4. Neutral-tinted Tomato Skin Albedo & Micro-Bump
  const tomAlbedoCanvas = document.createElement('canvas');
  tomAlbedoCanvas.width = 256;
  tomAlbedoCanvas.height = 256;
  const tCtx = tomAlbedoCanvas.getContext('2d');
  if (tCtx) {
    const grad = tCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#c8d6a0');
    grad.addColorStop(0.16, '#f4ebe6');
    grad.addColorStop(0.65, '#ffffff');
    grad.addColorStop(1, '#ede3df');
    tCtx.fillStyle = grad;
    tCtx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      tCtx.fillStyle =
        i % 4 === 0 ? 'rgba(255, 250, 235, 0.16)' : 'rgba(180, 145, 130, 0.08)';
      tCtx.fillRect(x, y, 2, 2);
    }
  }
  const tomatoAlbedo = new THREE.CanvasTexture(tomAlbedoCanvas);
  tomatoAlbedo.colorSpace = THREE.SRGBColorSpace;
  tomatoAlbedo.anisotropy = aniso;

  const tomBumpCanvas = document.createElement('canvas');
  tomBumpCanvas.width = 256;
  tomBumpCanvas.height = 256;
  const tbCtx = tomBumpCanvas.getContext('2d');
  if (tbCtx) {
    tbCtx.fillStyle = '#808080';
    tbCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 650; i++) {
      const s = 122 + Math.floor(Math.random() * 14);
      tbCtx.fillStyle = `rgb(${s},${s},${s})`;
      tbCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  }
  const tomatoBump = new THREE.CanvasTexture(tomBumpCanvas);
  tomatoBump.anisotropy = aniso;

  // 5. Terracotta Clay Texture (256x256, SRGB)
  const potCanvas = document.createElement('canvas');
  potCanvas.width = 256;
  potCanvas.height = 256;
  const pCtx = potCanvas.getContext('2d');
  if (pCtx) {
    const grad = pCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#c86c4b');
    grad.addColorStop(0.5, '#ba5f3f');
    grad.addColorStop(1, '#9d4c31');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 4) {
      pCtx.fillStyle =
        y % 8 === 0 ? 'rgba(255, 224, 200, 0.05)' : 'rgba(90, 35, 18, 0.05)';
      pCtx.fillRect(0, y, 256, 2);
    }
    for (let i = 0; i < 900; i++) {
      pCtx.fillStyle =
        i % 3 === 0 ? 'rgba(245, 228, 212, 0.09)' : 'rgba(84, 34, 20, 0.08)';
      pCtx.fillRect(Math.random() * 256, Math.random() * 256, 3, 2);
    }
  }
  const potAlbedo = new THREE.CanvasTexture(potCanvas);
  potAlbedo.colorSpace = THREE.SRGBColorSpace;
  potAlbedo.anisotropy = aniso;

  // 6. Rich Dark Potting Soil Texture (256x256, SRGB)
  const soilCanvas = document.createElement('canvas');
  soilCanvas.width = 256;
  soilCanvas.height = 256;
  const soCtx = soilCanvas.getContext('2d');
  if (soCtx) {
    soCtx.fillStyle = '#25170e';
    soCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) {
      const r = Math.random();
      soCtx.fillStyle =
        r > 0.94
          ? 'rgba(225, 214, 195, 0.45)'
          : r > 0.5
          ? 'rgba(72, 46, 28, 0.45)'
          : 'rgba(18, 10, 6, 0.55)';
      const size = r > 0.94 ? 3 : 4;
      soCtx.fillRect(Math.random() * 256, Math.random() * 256, size, size);
    }
  }
  const soilAlbedo = new THREE.CanvasTexture(soilCanvas);
  soilAlbedo.colorSpace = THREE.SRGBColorSpace;
  soilAlbedo.anisotropy = aniso;

  // 7. Realistic Two-Stage Contact AO + Soft Directional Floor Penumbra (512x512)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 512;
  shadowCanvas.height = 512;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const canopyGrad = sCtx.createRadialGradient(240, 244, 48, 236, 242, 236);
    canopyGrad.addColorStop(0, 'rgba(14, 32, 21, 0.24)');
    canopyGrad.addColorStop(0.45, 'rgba(16, 36, 24, 0.12)');
    canopyGrad.addColorStop(0.78, 'rgba(18, 40, 27, 0.04)');
    canopyGrad.addColorStop(1, 'rgba(19, 40, 28, 0)');
    sCtx.fillStyle = canopyGrad;
    sCtx.fillRect(0, 0, 512, 512);

    const seamGrad = sCtx.createRadialGradient(256, 256, 34, 256, 256, 114);
    seamGrad.addColorStop(0, 'rgba(10, 22, 14, 0.56)');
    seamGrad.addColorStop(0.58, 'rgba(12, 26, 17, 0.42)');
    seamGrad.addColorStop(0.84, 'rgba(15, 34, 22, 0.14)');
    seamGrad.addColorStop(1, 'rgba(16, 36, 24, 0)');
    sCtx.fillStyle = seamGrad;
    sCtx.fillRect(0, 0, 512, 512);
  }
  const contactShadow = new THREE.CanvasTexture(shadowCanvas);
  contactShadow.colorSpace = THREE.SRGBColorSpace;
  contactShadow.anisotropy = aniso;

  return {
    leafAlbedo,
    blightedLeafAlbedo,
    leafBump,
    leafRoughness,
    tomatoAlbedo,
    tomatoBump,
    potAlbedo,
    soilAlbedo,
    contactShadow,
    disposeAll: () => {
      leafAlbedo.dispose();
      blightedLeafAlbedo.dispose();
      leafBump.dispose();
      leafRoughness.dispose();
      tomatoAlbedo.dispose();
      tomatoBump.dispose();
      potAlbedo.dispose();
      soilAlbedo.dispose();
      contactShadow.dispose();
    },
  };
}

/**
 * Builds a clean, naturally proportioned, simple ovate-lobed tomato leaflet (neither oversized nor spiky).
 */
function createTomatoLeafletGeometry(): THREE.BufferGeometry {
  const uSeg = 12;
  const vSeg = 20;
  const cols = uSeg + 1;
  const rows = vSeg + 1;

  const positions = new Float32Array(cols * rows * 3);
  const uvs = new Float32Array(cols * rows * 2);
  const indices: number[] = [];

  for (let iv = 0; iv <= vSeg; iv++) {
    const v = iv / vSeg;

    const baseProfile = Math.sin(Math.pow(v, 0.72) * Math.PI);
    const gentleLobes = 1 + 0.12 * Math.sin(v * Math.PI * 5.0) * Math.sin(v * Math.PI);
    const tipTaper = v > 0.76 ? 1 - Math.pow((v - 0.76) / 0.24, 1.75) * 0.22 : 1;
    const halfWidth = 0.215 * baseProfile * gentleLobes * tipTaper;

    for (let iu = 0; iu <= uSeg; iu++) {
      const uNorm = (iu / uSeg) * 2 - 1;
      const idx = iv * cols + iu;

      const x = uNorm * halfWidth;
      const y = v;

      const vCup = Math.abs(uNorm) * 0.056 * (1 - 0.3 * v) * baseProfile;
      const veinQuilt =
        0.009 * Math.sin(v * Math.PI * 6.0) * Math.sin(Math.abs(uNorm) * Math.PI) * baseProfile;
      const archDroop = -0.18 * Math.pow(v, 1.72);

      const z = vCup + veinQuilt + archDroop;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      uvs[idx * 2] = uNorm * 0.48 + 0.5;
      uvs[idx * 2 + 1] = v;
    }
  }

  for (let iv = 0; iv < vSeg; iv++) {
    for (let iu = 0; iu < uSeg; iu++) {
      const a = iv * cols + iu;
      const b = a + 1;
      const c = (iv + 1) * cols + iu;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a high-resolution, 5-ribbed oblate heirloom tomato with sunken calyx stem dimple.
 */
function createSculptedTomatoGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 36, 26);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;

    const theta = Math.atan2(nz, nx);
    const phi = Math.acos(THREE.MathUtils.clamp(ny, -1, 1));

    const ribStrength = 0.052 * Math.pow(Math.sin(phi), 1.35);
    const ribFactor = 1 - ribStrength * Math.pow(Math.cos(theta * 2.5 + 0.25), 2);

    x *= ribFactor;
    z *= ribFactor;
    y *= 0.84;

    if (phi < 0.56) {
      const dimple = Math.pow(1 - phi / 0.56, 2.1);
      y -= 0.16 * dimple;
    }
    if (phi > Math.PI - 0.36) {
      const bDimple = Math.pow((phi - (Math.PI - 0.36)) / 0.36, 2.0);
      y += 0.04 * bDimple;
    }

    pos.setXYZ(i, x, y, z);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a single gracefully curved, tapered calyx sepal blade hugging the tomato crown.
 */
function createCurvedSepalGeometry(): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(0.16, 0.48, 2, 6);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i) + 0.24;
    const t = THREE.MathUtils.clamp(y / 0.48, 0, 1);

    const taper = (1 - Math.pow(t, 1.35)) * (0.45 + 0.55 * Math.sin((1 - t * 0.7) * Math.PI * 0.5));
    const archZ = Math.sin(t * Math.PI * 0.78) * 0.11 - t * t * 0.18;

    pos.setXYZ(i, x * taper, y, archZ);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export const HeroPlantCanvas: React.FC<HeroPlantCanvasProps> = ({
  onScanClick,
  onOpenVideo,
  onSceneReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const onSceneReadyRef = useRef(onSceneReady);
  onSceneReadyRef.current = onSceneReady;

  const [isRotating, setIsRotating] = useState(true);
  const [activeView, setActiveView] = useState<'full' | 'fruit' | 'leaves'>('full');
  const [plantHealth, setPlantHealth] = useState<'healthy' | 'blighted' | 'healing'>('healthy');
  const [isHoveringTomato, setIsHoveringTomato] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);

  const { t, isUrdu } = useLanguage();

  const stateRef = useRef({
    isRotating: true,
    targetCamPos: new THREE.Vector3(0, 1.38, 4.44),
    targetLookAt: new THREE.Vector3(0, 1.16, 0),
    aspectZoomOffset: 0,
    mouseX: 0,
    mouseY: 0,
    isDragging: false,
    dragStartX: 0,
    pointerDownX: 0,
    pointerDownY: 0,
    plantRotationY: 0.24,
    targetRotationY: 0.24,
    tomatoMeshes: [] as THREE.Mesh[],
    leafMeshes: [] as THREE.Mesh[],
    hoveredLeafMesh: null as THREE.Object3D | null,
    isHoveringPlant: false,
    hoverPulseIntensity: 0,
    scrollProgress: 0,
    scanBeam: null as THREE.Mesh | null,
    scanBeamProgress: 0,
    isScanningActive: false,
    isBlighted: false,
    blightWiltFactor: 0,
    targetLeafColor: new THREE.Color(0xffffff),
    currentLeafColor: new THREE.Color(0xffffff),
    camera: null as THREE.PerspectiveCamera | null,
  });

  useEffect(() => {
    stateRef.current.isRotating = isRotating;
  }, [isRotating]);

  // Camera framing presets kept safely within canvas bounds so leaves never clip off the left edge
  useEffect(() => {
    const zBoost = stateRef.current.aspectZoomOffset;
    if (activeView === 'full') {
      stateRef.current.targetCamPos.set(0, 1.38, 4.44 + zBoost);
      stateRef.current.targetLookAt.set(0, 1.16, 0);
    } else if (activeView === 'fruit') {
      stateRef.current.targetCamPos.set(0.14, 1.24, 2.98 + zBoost * 0.55);
      stateRef.current.targetLookAt.set(0.02, 1.14, 0.02);
    } else if (activeView === 'leaves') {
      stateRef.current.targetCamPos.set(-0.2, 1.56, 3.06 + zBoost * 0.55);
      stateRef.current.targetLookAt.set(-0.02, 1.36, 0.02);
    }
  }, [activeView]);

  // Healthy vs blighted disease visualization state
  useEffect(() => {
    if (plantHealth === 'healthy') {
      stateRef.current.isBlighted = false;
      stateRef.current.targetLeafColor.setHex(0xffffff);
    } else if (plantHealth === 'blighted') {
      stateRef.current.isBlighted = true;
      stateRef.current.targetLeafColor.setHex(0xf2e4aa);
    } else if (plantHealth === 'healing') {
      stateRef.current.isBlighted = true;
      stateRef.current.targetLeafColor.setHex(0xf2e4aa);
    }
  }, [plantHealth]);

  const handleFruitZoom = () => {
    setActiveView('fruit');
    setIsRotating(false);
    const twoPi = Math.PI * 2;
    stateRef.current.targetRotationY =
      Math.round(stateRef.current.targetRotationY / twoPi) * twoPi + 0.14;
    setToastMessage(
      isUrdu
        ? 'ٹماٹر کا معائنہ: 360° گھمانے کے لیے ڈریگ کریں'
        : 'Tomato Inspection: Drag to inspect 360°'
    );
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetView = () => {
    setActiveView('full');
    setIsRotating(true);
  };

  const handleSimulateHealing = () => {
    setPlantHealth('healing');
    stateRef.current.isBlighted = true;
    stateRef.current.isScanningActive = true;
    stateRef.current.scanBeamProgress = 0;
    setActiveView('leaves');
    setIsRotating(false);

    setToastMessage(t.plant3d.healingToast);

    window.setTimeout(() => {
      setPlantHealth('healthy');
      stateRef.current.isBlighted = false;
      stateRef.current.targetLeafColor.setHex(0xffffff);
    }, 1850);

    window.setTimeout(() => {
      stateRef.current.isScanningActive = false;
      setActiveView('full');
      setIsRotating(true);
      setToastMessage(
        isUrdu
          ? 'صحتیابی مکمل! پودا اب مکمل طور پر صحت مند اور محفوظ ہے۔'
          : 'Healing Complete! Leaves restored to full photosynthetic vigor.'
      );
      window.setTimeout(() => setToastMessage(null), 4000);
    }, 3800);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 680;
    const height = container.clientHeight || 560;
    const initialAspect = width / height;
    stateRef.current.aspectZoomOffset = initialAspect < 0.85 ? 1.05 : initialAspect < 1.05 ? 0.42 : 0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, initialAspect, 0.1, 40);
    camera.position.set(0, 1.38, 4.44 + stateRef.current.aspectZoomOffset);
    camera.lookAt(stateRef.current.targetLookAt);
    stateRef.current.camera = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onSceneReadyRef.current?.();
      return;
    }

    const gl = renderer.getContext();
    const ext = gl?.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = ext && gl ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl =
      !gl || /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererInfo);

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.background = 'transparent';

    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // Conservatory Studio Lighting
    const hemiLight = new THREE.HemisphereLight('#fffdf8', '#9ee0b4', 1.72);
    scene.add(hemiLight);

    const sunKeyLight = new THREE.DirectionalLight('#fffbeb', 2.55);
    sunKeyLight.position.set(3.8, 7.2, 4.4);
    sunKeyLight.target.position.set(0, 0.85, 0);
    scene.add(sunKeyLight.target);
    sunKeyLight.castShadow = !isSoftwareGl;
    if (sunKeyLight.castShadow) {
      sunKeyLight.shadow.mapSize.width = 2048;
      sunKeyLight.shadow.mapSize.height = 2048;
      sunKeyLight.shadow.camera.near = 1.5;
      sunKeyLight.shadow.camera.far = 16;
      sunKeyLight.shadow.camera.left = -2.6;
      sunKeyLight.shadow.camera.right = 2.6;
      sunKeyLight.shadow.camera.top = 2.6;
      sunKeyLight.shadow.camera.bottom = -2.6;
      sunKeyLight.shadow.radius = 3.2;
      sunKeyLight.shadow.bias = -0.0003;
      sunKeyLight.shadow.normalBias = 0.018;
    }
    scene.add(sunKeyLight);

    const rimLight = new THREE.DirectionalLight('#d9f99d', 1.1);
    rimLight.position.set(-3.6, 4.4, -2.8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight('#ecfdf5', 0.72);
    fillLight.position.set(-2.5, 1.8, 3.2);
    scene.add(fillLight);

    const textures = createBotanicalTextures(renderer.capabilities.getMaxAnisotropy());

    // Real-Time Directional Shadow-Receiving Floor Plane
    const floorShadowGeo = new THREE.PlaneGeometry(7.2, 7.2);
    const floorShadowMat = new THREE.ShadowMaterial({
      color: 0x102819,
      opacity: 0.22,
      transparent: true,
      depthWrite: false,
    });
    const floorShadowMesh = new THREE.Mesh(floorShadowGeo, floorShadowMat);
    floorShadowMesh.rotation.x = -Math.PI / 2;
    floorShadowMesh.position.y = -0.024;
    floorShadowMesh.receiveShadow = !isSoftwareGl;
    floorShadowMesh.renderOrder = 1;
    scene.add(floorShadowMesh);

    // Tight Contact AO & Ambient Penumbra Disc
    const shadowGeo = new THREE.PlaneGeometry(2.85, 2.85);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.001;
    shadowMesh.renderOrder = 2;
    scene.add(shadowMesh);

    // Natural Scale Plant Assembly (pot bottom rests flush at y = 0)
    const plantGroup = new THREE.Group();
    plantGroup.scale.setScalar(1.02);
    scene.add(plantGroup);

    // Sculpted Terracotta Planter Pot + Grounded Foot Ring + Collar + Rounded Rim
    const potMat = new THREE.MeshStandardMaterial({
      map: textures.potAlbedo,
      roughness: 0.74,
      metalness: 0.03,
    });
    const potBodyGeo = new THREE.CylinderGeometry(0.6, 0.43, 0.58, 32);
    const potMesh = new THREE.Mesh(potBodyGeo, potMat);
    potMesh.position.y = 0.29;
    potMesh.castShadow = !isSoftwareGl;
    potMesh.receiveShadow = !isSoftwareGl;
    plantGroup.add(potMesh);

    const potFootGeo = new THREE.CylinderGeometry(0.435, 0.445, 0.028, 32);
    const potFootMesh = new THREE.Mesh(potFootGeo, potMat);
    potFootMesh.position.y = 0.014;
    potFootMesh.castShadow = !isSoftwareGl;
    potFootMesh.receiveShadow = !isSoftwareGl;
    plantGroup.add(potFootMesh);

    const potCollarGeo = new THREE.CylinderGeometry(0.64, 0.6, 0.11, 32);
    const potCollarMesh = new THREE.Mesh(potCollarGeo, potMat);
    potCollarMesh.position.y = 0.56;
    potCollarMesh.castShadow = !isSoftwareGl;
    potCollarMesh.receiveShadow = !isSoftwareGl;
    plantGroup.add(potCollarMesh);

    const rimGeo = new THREE.TorusGeometry(0.62, 0.044, 12, 34);
    const rimMesh = new THREE.Mesh(rimGeo, potMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.61;
    rimMesh.castShadow = !isSoftwareGl;
    plantGroup.add(rimMesh);

    const soilMat = new THREE.MeshStandardMaterial({
      map: textures.soilAlbedo,
      roughness: 0.94,
    });
    const soilGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.07, 28);
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = 0.575;
    soilMesh.receiveShadow = !isSoftwareGl;
    plantGroup.add(soilMesh);

    const soilMoundGeo = new THREE.SphereGeometry(0.46, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const soilMound = new THREE.Mesh(soilMoundGeo, soilMat);
    soilMound.scale.set(1.18, 0.24, 1.18);
    soilMound.position.y = 0.585;
    soilMound.receiveShadow = !isSoftwareGl;
    plantGroup.add(soilMound);

    const crumbGeo = new THREE.DodecahedronGeometry(0.022, 0);
    const crumbDarkMat = new THREE.MeshStandardMaterial({ color: 0x3a2417, roughness: 0.95 });
    const crumbPerliteMat = new THREE.MeshStandardMaterial({ color: 0xe7e1d3, roughness: 0.85 });
    for (let c = 0; c < 18; c++) {
      const ang = (c / 18) * Math.PI * 2 + (c % 3) * 0.25;
      const rad = 0.14 + ((c * 17) % 38) * 0.01;
      const crumb = new THREE.Mesh(crumbGeo, c % 5 === 0 ? crumbPerliteMat : crumbDarkMat);
      crumb.scale.set(1.2, 0.65, 1.0);
      crumb.position.set(Math.cos(ang) * rad, 0.61 + (1 - rad) * 0.05, Math.sin(ang) * rad);
      crumb.rotation.set(c * 0.4, c * 0.9, 0);
      plantGroup.add(crumb);
    }

    // Natural Bamboo Support Stake & Jute Twine Ties
    const stakeGeo = new THREE.CylinderGeometry(0.021, 0.027, 1.94, 12);
    const stakeMat = new THREE.MeshStandardMaterial({
      color: 0xcfa06e,
      roughness: 0.76,
    });
    const stakeMesh = new THREE.Mesh(stakeGeo, stakeMat);
    stakeMesh.position.set(-0.075, 1.54, -0.055);
    stakeMesh.castShadow = !isSoftwareGl;
    plantGroup.add(stakeMesh);

    const twineMat = new THREE.MeshStandardMaterial({ color: 0xa17c52, roughness: 0.9 });
    const twineGeo = new THREE.TorusGeometry(0.068, 0.0085, 8, 18);
    [1.06, 1.62].forEach((ty) => {
      const tie = new THREE.Mesh(twineGeo, twineMat);
      tie.position.set(-0.035, ty, -0.022);
      tie.rotation.x = Math.PI / 2.2;
      tie.rotation.y = 0.35;
      plantGroup.add(tie);
    });

    // Shared Elastic Breeze Uniforms
    const breezeUniforms = {
      uTime: { value: 0 },
      uBreeze: { value: 1.0 },
    };

    const attachElasticBreezeShader = (
      mat: THREE.Material,
      cacheKey: string,
      amplitude: number,
      frequency: number
    ) => {
      mat.customProgramCacheKey = () => cacheKey;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = breezeUniforms.uTime;
        shader.uniforms.uBreeze = breezeUniforms.uBreeze;

        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `#include <common>
            uniform float uTime;
            uniform float uBreeze;`
          )
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            vec4 agroWorld = modelMatrix * vec4(transformed, 1.0);
            float elasticReach = clamp(transformed.y, 0.0, 1.4);
            float bendCurve = elasticReach * elasticReach;
            float waveA = sin(uTime * ${frequency.toFixed(2)} + agroWorld.x * 2.3 + agroWorld.z * 2.1 + agroWorld.y * 1.4);
            float waveB = cos(uTime * ${(frequency * 1.55).toFixed(2)} + agroWorld.x * 3.8 + agroWorld.z * 3.1);
            transformed.z += (waveA * 0.72 + waveB * 0.28) * ${amplitude.toFixed(4)} * bendCurve * uBreeze;
            transformed.x += waveB * ${(amplitude * 0.42).toFixed(4)} * bendCurve * uBreeze;`
          );
      };
    };

    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x2f753c,
      roughness: 0.52,
      metalness: 0.02,
    });

    const stemPoints = [
      new THREE.Vector3(0, 0.58, 0),
      new THREE.Vector3(0.035, 0.9, 0.025),
      new THREE.Vector3(-0.04, 1.24, -0.02),
      new THREE.Vector3(0.03, 1.56, 0.025),
      new THREE.Vector3(-0.02, 1.88, 0.01),
      new THREE.Vector3(0.01, 2.14, -0.01),
    ];
    const stemCurve = new THREE.CatmullRomCurve3(stemPoints);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.038, 12, false);
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.castShadow = !isSoftwareGl;
    plantGroup.add(stemMesh);

    const makeLeafMaterial = (tintHex: number, keySuffix: string) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: textures.leafAlbedo,
        bumpMap: textures.leafBump,
        bumpScale: 0.02,
        roughnessMap: textures.leafRoughness,
        roughness: 0.46,
        metalness: 0.02,
        sheen: 0.42,
        sheenRoughness: 0.56,
        sheenColor: new THREE.Color('#bbf7d0'),
        side: THREE.DoubleSide,
      });
      mat.userData.baseTint = new THREE.Color(tintHex);
      attachElasticBreezeShader(mat, `tomato-leaf-${keySuffix}`, 0.068, 1.85);
      return mat;
    };

    const leafMaterials = [
      makeLeafMaterial(0xf7fff7, 'v0'),
      makeLeafMaterial(0xe3f7dc, 'v1'),
      makeLeafMaterial(0xfcfee8, 'v2'),
    ];

    const leafGeo = createTomatoLeafletGeometry();
    const sharedPetioleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.075, 0.22),
      new THREE.Vector3(0, 0.082, 0.48),
      new THREE.Vector3(0, 0.025, 0.72),
    ]);
    const sharedPetioleGeo = new THREE.TubeGeometry(sharedPetioleCurve, 14, 0.014, 7, false);

    const leafGroupList: THREE.Group[] = [];
    const leafMeshes: THREE.Mesh[] = [];

    const makeCompoundLeaf = (scale: number, matIndex: number) => {
      const branchGroup = new THREE.Group();
      const mat = leafMaterials[matIndex % leafMaterials.length];

      const pMesh = new THREE.Mesh(sharedPetioleGeo, stemMat);
      pMesh.scale.setScalar(scale);
      pMesh.castShadow = !isSoftwareGl;
      branchGroup.add(pMesh);

      const terminalLeaf = new THREE.Mesh(leafGeo, mat);
      terminalLeaf.scale.setScalar(0.6 * scale);
      terminalLeaf.userData.baseScale = 0.6 * scale;
      terminalLeaf.position.set(0, 0.025 * scale, 0.69 * scale);
      terminalLeaf.rotation.x = Math.PI / 2.28;
      terminalLeaf.castShadow = !isSoftwareGl;
      terminalLeaf.receiveShadow = !isSoftwareGl;
      branchGroup.add(terminalLeaf);
      leafMeshes.push(terminalLeaf);

      const subLeafSpecs = [
        { z: 0.22, xOff: 0.03, yOff: 0.072, rotZ: 0.96, rotX: Math.PI / 2.35, rotY: 0.08, s: 0.45 },
        { z: 0.22, xOff: -0.03, yOff: 0.072, rotZ: -0.96, rotX: Math.PI / 2.35, rotY: -0.08, s: 0.45 },
        { z: 0.32, xOff: 0.02, yOff: 0.082, rotZ: 1.08, rotX: Math.PI / 2.1, rotY: 0.14, s: 0.24 },
        { z: 0.32, xOff: -0.02, yOff: 0.082, rotZ: -1.08, rotX: Math.PI / 2.1, rotY: -0.14, s: 0.24 },
        { z: 0.44, xOff: 0.028, yOff: 0.078, rotZ: 0.84, rotX: Math.PI / 2.3, rotY: 0.06, s: 0.5 },
        { z: 0.44, xOff: -0.028, yOff: 0.078, rotZ: -0.84, rotX: Math.PI / 2.3, rotY: -0.06, s: 0.5 },
        { z: 0.59, xOff: 0.022, yOff: 0.056, rotZ: 0.66, rotX: Math.PI / 2.25, rotY: 0.04, s: 0.38 },
        { z: 0.59, xOff: -0.022, yOff: 0.056, rotZ: -0.66, rotX: Math.PI / 2.25, rotY: -0.04, s: 0.38 },
      ];

      subLeafSpecs.forEach((sp) => {
        const subLeaf = new THREE.Mesh(leafGeo, mat);
        subLeaf.scale.setScalar(sp.s * scale);
        subLeaf.userData.baseScale = sp.s * scale;
        subLeaf.position.set(sp.xOff * scale, sp.yOff * scale, sp.z * scale);
        subLeaf.rotation.x = sp.rotX;
        subLeaf.rotation.y = sp.rotY;
        subLeaf.rotation.z = sp.rotZ;
        subLeaf.castShadow = !isSoftwareGl;
        subLeaf.receiveShadow = !isSoftwareGl;
        branchGroup.add(subLeaf);
        leafMeshes.push(subLeaf);
      });

      return branchGroup;
    };

    const leafConfigs = [
      { y: 0.8, rotY: 0.35, rotX: 0.16, scale: 0.9 },
      { y: 0.98, rotY: 2.45, rotX: 0.18, scale: 0.96 },
      { y: 1.16, rotY: 4.5, rotX: 0.14, scale: 0.98 },
      { y: 1.34, rotY: 1.25, rotX: 0.16, scale: 0.94 },
      { y: 1.52, rotY: 3.4, rotX: 0.15, scale: 0.88 },
      { y: 1.7, rotY: 5.35, rotX: 0.19, scale: 0.8 },
      { y: 1.88, rotY: 1.95, rotX: 0.22, scale: 0.72 },
      { y: 2.04, rotY: 4.15, rotX: 0.26, scale: 0.62 },
    ];

    leafConfigs.forEach((cfg, idx) => {
      const lGroup = makeCompoundLeaf(cfg.scale, idx);
      lGroup.position.set(0, cfg.y, 0);
      lGroup.rotation.y = cfg.rotY;
      lGroup.rotation.x = cfg.rotX;
      plantGroup.add(lGroup);
      leafGroupList.push(lGroup);
    });

    const crownLeaf1 = new THREE.Mesh(leafGeo, leafMaterials[2]);
    crownLeaf1.scale.setScalar(0.36);
    crownLeaf1.userData.baseScale = 0.36;
    crownLeaf1.position.set(0.01, 2.12, 0.01);
    crownLeaf1.rotation.set(0.55, 0.4, -0.35);
    crownLeaf1.castShadow = !isSoftwareGl;
    plantGroup.add(crownLeaf1);
    leafMeshes.push(crownLeaf1);

    const crownLeaf2 = new THREE.Mesh(leafGeo, leafMaterials[2]);
    crownLeaf2.scale.setScalar(0.32);
    crownLeaf2.userData.baseScale = 0.32;
    crownLeaf2.position.set(-0.01, 2.13, -0.01);
    crownLeaf2.rotation.set(-0.5, 2.6, 0.3);
    crownLeaf2.castShadow = !isSoftwareGl;
    plantGroup.add(crownLeaf2);
    leafMeshes.push(crownLeaf2);

    stateRef.current.leafMeshes = leafMeshes;

    // Delicate 5-Petal Tomato Blossoms
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.38,
      side: THREE.DoubleSide,
    });
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.48,
    });
    const petalGeo = new THREE.ConeGeometry(0.022, 0.068, 4);
    const antherGeo = new THREE.ConeGeometry(0.012, 0.042, 6);

    const makeTomatoBlossom = () => {
      const flower = new THREE.Group();
      for (let p = 0; p < 5; p++) {
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const angle = (p / 5) * Math.PI * 2;
        petal.rotation.z = -Math.PI / 2.15;
        petal.rotation.y = angle;
        petal.position.set(Math.cos(angle) * 0.026, 0, Math.sin(angle) * 0.026);
        flower.add(petal);
      }
      const anther = new THREE.Mesh(antherGeo, centerMat);
      anther.position.y = 0.016;
      flower.add(anther);
      return flower;
    };

    const flowerTruss = new THREE.Group();
    flowerTruss.position.set(0.2, 1.94, 0.16);
    const flowerStemGeo = new THREE.CylinderGeometry(0.008, 0.011, 0.24, 6);
    const flowerStem = new THREE.Mesh(flowerStemGeo, stemMat);
    flowerStem.rotation.z = -0.88;
    flowerStem.position.set(-0.09, 0.04, -0.06);
    flowerTruss.add(flowerStem);
    const f1 = makeTomatoBlossom();
    f1.rotation.set(0.8, 0.3, 0);
    flowerTruss.add(f1);
    const f2 = makeTomatoBlossom();
    f2.position.set(0.08, -0.05, 0.04);
    f2.rotation.set(1.0, -0.5, 0);
    f2.scale.setScalar(0.88);
    flowerTruss.add(f2);
    plantGroup.add(flowerTruss);

    // Holographic AI Scanning Plane
    const scanPlaneGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.032, 32);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const scanBeam = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanBeam.position.set(0, 1.3, 0);
    plantGroup.add(scanBeam);
    stateRef.current.scanBeam = scanBeam;

    // Clearcoated Ribbed Vine Tomatoes with Curved Organic Calyx Sepals
    const tomatoMat = new THREE.MeshPhysicalMaterial({
      color: 0xd92314,
      map: textures.tomatoAlbedo,
      bumpMap: textures.tomatoBump,
      bumpScale: 0.004,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      sheen: 0.14,
    });

    const tomatoRipeningMat = new THREE.MeshPhysicalMaterial({
      color: 0xea6d18,
      map: textures.tomatoAlbedo,
      bumpMap: textures.tomatoBump,
      bumpScale: 0.004,
      roughness: 0.2,
      metalness: 0.02,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });

    const tomatoUnripeMat = new THREE.MeshPhysicalMaterial({
      color: 0x6ea832,
      map: textures.tomatoAlbedo,
      bumpMap: textures.tomatoBump,
      bumpScale: 0.004,
      roughness: 0.25,
      metalness: 0.02,
      clearcoat: 0.72,
      clearcoatRoughness: 0.14,
    });

    const sculptedTomatoGeo = createSculptedTomatoGeometry();
    const curvedSepalGeo = createCurvedSepalGeometry();
    const sharedPedicelGeo = new THREE.CylinderGeometry(0.009, 0.012, 0.14, 8);
    const tomatoMeshes: THREE.Mesh[] = [];

    const createTomatoFruit = (radius: number, ripeness: 'ripe' | 'turning' | 'unripe') => {
      const fruitGroup = new THREE.Group();
      const mat =
        ripeness === 'ripe'
          ? tomatoMat
          : ripeness === 'turning'
          ? tomatoRipeningMat
          : tomatoUnripeMat;
      const mesh = new THREE.Mesh(sculptedTomatoGeo, mat);
      mesh.scale.setScalar(radius);
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      fruitGroup.add(mesh);
      tomatoMeshes.push(mesh);

      const calyxMat = stemMat;
      for (let s = 0; s < 6; s++) {
        const sepal = new THREE.Mesh(curvedSepalGeo, calyxMat);
        const ang = (s / 6) * Math.PI * 2 + 0.15;
        sepal.scale.setScalar(radius * 0.92);
        sepal.position.set(0, radius * 0.72, 0);
        sepal.rotation.order = 'YXZ';
        sepal.rotation.y = ang;
        sepal.rotation.x = Math.PI / 2.25;
        fruitGroup.add(sepal);
      }

      const pedicel = new THREE.Mesh(sharedPedicelGeo, calyxMat);
      pedicel.position.y = radius * 0.72 + 0.065;
      fruitGroup.add(pedicel);

      return fruitGroup;
    };

    // Lower Primary Plump Tomato Cluster
    const cluster1 = new THREE.Group();
    cluster1.position.set(0.02, 1.18, 0.04);
    const truss1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.09, 0),
      new THREE.Vector3(0.14, 0.02, 0.12),
      new THREE.Vector3(0.28, -0.06, 0.22),
    ]);
    const truss1Mesh = new THREE.Mesh(new THREE.TubeGeometry(truss1Curve, 12, 0.013, 8, false), stemMat);
    cluster1.add(truss1Mesh);

    const t1 = createTomatoFruit(0.155, 'ripe');
    t1.position.set(0.17, -0.14, 0.14);
    cluster1.add(t1);

    const t2 = createTomatoFruit(0.132, 'ripe');
    t2.position.set(0.29, -0.19, 0.22);
    cluster1.add(t2);

    const t3 = createTomatoFruit(0.108, 'turning');
    t3.position.set(0.09, -0.07, 0.09);
    cluster1.add(t3);

    plantGroup.add(cluster1);

    // Mid Secondary Tomato Cluster
    const cluster2 = new THREE.Group();
    cluster2.position.set(-0.02, 1.56, 0.02);
    const truss2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.07, 0),
      new THREE.Vector3(-0.12, 0.0, 0.1),
      new THREE.Vector3(-0.25, -0.06, 0.18),
    ]);
    const truss2Mesh = new THREE.Mesh(new THREE.TubeGeometry(truss2Curve, 12, 0.012, 8, false), stemMat);
    cluster2.add(truss2Mesh);

    const t4 = createTomatoFruit(0.138, 'ripe');
    t4.position.set(-0.16, -0.14, 0.12);
    cluster2.add(t4);

    const t5 = createTomatoFruit(0.11, 'ripe');
    t5.position.set(-0.26, -0.18, 0.18);
    cluster2.add(t5);

    const t6 = createTomatoFruit(0.092, 'unripe');
    t6.position.set(-0.08, -0.08, 0.08);
    cluster2.add(t6);

    plantGroup.add(cluster2);

    // Upper Third Ripening Cluster
    const cluster3 = new THREE.Group();
    cluster3.position.set(0.0, 1.82, -0.02);
    const truss3Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(0.08, -0.01, -0.12),
      new THREE.Vector3(0.16, -0.06, -0.2),
    ]);
    const truss3Mesh = new THREE.Mesh(new THREE.TubeGeometry(truss3Curve, 10, 0.01, 7, false), stemMat);
    cluster3.add(truss3Mesh);

    const t7 = createTomatoFruit(0.098, 'turning');
    t7.position.set(0.11, -0.12, -0.14);
    cluster3.add(t7);

    const t8 = createTomatoFruit(0.082, 'unripe');
    t8.position.set(0.18, -0.15, -0.21);
    cluster3.add(t8);

    plantGroup.add(cluster3);

    stateRef.current.tomatoMeshes = tomatoMeshes;

    // Gentle Floating Botanical Pollen/Dew Motes
    const particleCount = 26;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.4;
      particlePositions[i * 3 + 1] = Math.random() * 2.1 + 0.3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
      particleSpeeds.push(0.13 + Math.random() * 0.2);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.028,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let isDisposed = false;
    let envTexture: THREE.Texture | null = null;
    const win = window as Window & {
      requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const scheduleIdle = (cb: () => void): { id: number; isIdle: boolean } => {
      if (typeof win.requestIdleCallback === 'function') {
        return { id: win.requestIdleCallback(cb, { timeout: 350 }), isIdle: true };
      }
      return { id: globalThis.setTimeout(cb, 50) as unknown as number, isIdle: false };
    };
    const envIdleHandle = !isSoftwareGl
      ? scheduleIdle(async () => {
          if (isDisposed) return;
          try {
            const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
            if (isDisposed) return;
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            const roomEnv = new RoomEnvironment();
            const rt = pmremGenerator.fromScene(roomEnv, 0.04);
            envTexture = rt.texture;
            scene.environment = envTexture;
            roomEnv.dispose();
            pmremGenerator.dispose();
          } catch {
            // Directional + hemisphere conservatory lighting fallback
          }
        })
      : null;

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();
    const hoverLeafEmissive = new THREE.Color(0x166534);
    const baseEmissiveBlack = new THREE.Color(0x000000);
    const scratchTintColor = new THREE.Color();
    let lastRaycastTime = 0;

    const handlePointerDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.dragStartX = e.clientX;
      stateRef.current.pointerDownX = e.clientX;
      stateRef.current.pointerDownY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const insideCanvas =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseX = THREE.MathUtils.clamp(normX, -1, 1);
      stateRef.current.mouseY = THREE.MathUtils.clamp(normY, -1, 1);

      if (stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.dragStartX;
        stateRef.current.targetRotationY += deltaX * 0.008;
        stateRef.current.dragStartX = e.clientX;
      }

      if (!insideCanvas) {
        stateRef.current.isHoveringPlant = false;
        stateRef.current.hoveredLeafMesh = null;
        setIsHoveringTomato(false);
        return;
      }

      const now = performance.now();
      if (now - lastRaycastTime < 45) return;
      lastRaycastTime = now;

      mouseCoord.x = normX;
      mouseCoord.y = normY;

      raycaster.setFromCamera(mouseCoord, camera);
      const tomatoHits = raycaster.intersectObjects(tomatoMeshes, false);
      setIsHoveringTomato(tomatoHits.length > 0);

      const leafHits = raycaster.intersectObjects(leafMeshes, false);
      if (leafHits.length > 0) {
        stateRef.current.isHoveringPlant = true;
        stateRef.current.hoveredLeafMesh = leafHits[0].object;
      } else {
        const plantHits = raycaster.intersectObjects(plantGroup.children, true);
        stateRef.current.isHoveringPlant = plantHits.length > 0;
        stateRef.current.hoveredLeafMesh = null;
      }
    };

    const handlePointerLeave = () => {
      stateRef.current.isHoveringPlant = false;
      stateRef.current.hoveredLeafMesh = null;
      setIsHoveringTomato(false);
    };

    const handleScroll = () => {
      const heroHeight = Math.max(window.innerHeight, 650);
      stateRef.current.scrollProgress = THREE.MathUtils.clamp(window.scrollY / heroHeight, 0, 1);
    };

    const handlePointerUp = (e: MouseEvent) => {
      const movedDist = Math.hypot(
        e.clientX - stateRef.current.pointerDownX,
        e.clientY - stateRef.current.pointerDownY
      );
      if (stateRef.current.isDragging && movedDist < 7) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseCoord.x = normX;
        mouseCoord.y = normY;

        raycaster.setFromCamera(mouseCoord, camera);
        const intersects = raycaster.intersectObjects(tomatoMeshes, false);

        if (intersects.length > 0) {
          handleFruitZoom();
        }
      }

      stateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        stateRef.current.isDragging = true;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (stateRef.current.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        stateRef.current.targetRotationY += deltaX * 0.01;
        touchStartX = e.touches[0].clientX;
      }
    };
    const handleTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Smooth 60fps Animation Loop
    let animationFrameId = 0;
    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let hasNotifiedReady = false;
    let lastBlightedState = false;
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed || !isVisible || !isDocumentVisible) {
        animationFrameId = 0;
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      const scrollLift = stateRef.current.scrollProgress * 0.09;

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        stateRef.current.targetCamPos.x + stateRef.current.mouseX * 0.14,
        3.5,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        stateRef.current.targetCamPos.y + stateRef.current.mouseY * 0.1 + scrollLift,
        3.5,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        stateRef.current.targetCamPos.z + stateRef.current.scrollProgress * 0.14,
        3.5,
        delta
      );
      camera.lookAt(stateRef.current.targetLookAt);

      if (stateRef.current.isRotating && !stateRef.current.isDragging) {
        stateRef.current.targetRotationY += 0.2 * delta;
      }

      stateRef.current.plantRotationY = THREE.MathUtils.damp(
        stateRef.current.plantRotationY,
        stateRef.current.targetRotationY + stateRef.current.scrollProgress * 0.3,
        6.0,
        delta
      );
      plantGroup.rotation.y = stateRef.current.plantRotationY;

      const hoverTarget = stateRef.current.isHoveringPlant ? 1 : 0;
      stateRef.current.hoverPulseIntensity = THREE.MathUtils.damp(
        stateRef.current.hoverPulseIntensity,
        hoverTarget,
        5.5,
        delta
      );
      const hoverAmt = stateRef.current.hoverPulseIntensity;

      breezeUniforms.uTime.value = time;
      breezeUniforms.uBreeze.value = 1.0 + hoverAmt * 0.55;

      const isBlightedNow = stateRef.current.isBlighted;
      if (isBlightedNow !== lastBlightedState) {
        lastBlightedState = isBlightedNow;
        for (let m = 0; m < leafMaterials.length; m++) {
          const lMat = leafMaterials[m];
          lMat.map = isBlightedNow ? textures.blightedLeafAlbedo : textures.leafAlbedo;
          lMat.roughness = isBlightedNow ? 0.84 : 0.46;
          lMat.sheen = isBlightedNow ? 0.04 : 0.42;
        }
      }

      stateRef.current.blightWiltFactor = THREE.MathUtils.damp(
        stateRef.current.blightWiltFactor,
        isBlightedNow ? 1 : 0,
        3.5,
        delta
      );

      stateRef.current.currentLeafColor.lerp(stateRef.current.targetLeafColor, delta * 3.8);
      for (let m = 0; m < leafMaterials.length; m++) {
        const lMat = leafMaterials[m];
        const baseTint = (lMat.userData.baseTint as THREE.Color) || stateRef.current.currentLeafColor;
        scratchTintColor.copy(baseTint).multiply(stateRef.current.currentLeafColor);
        lMat.color.copy(scratchTintColor);
        lMat.emissive.lerpColors(baseEmissiveBlack, hoverLeafEmissive, hoverAmt);
        lMat.emissiveIntensity = hoverAmt * (0.12 + Math.sin(time * 3.0) * 0.06);
      }

      for (let i = 0; i < leafMeshes.length; i++) {
        const leafMesh = leafMeshes[i];
        const baseScale = (leafMesh.userData.baseScale as number) || 1;
        const isDirectLeaf = leafMesh === stateRef.current.hoveredLeafMesh;
        const pulseWave = Math.sin(time * 2.8 + i * 0.37);
        const pulseFactor =
          1 + hoverAmt * (0.025 + (isDirectLeaf ? 0.028 : 0) + pulseWave * 0.024);
        const nextScale = THREE.MathUtils.damp(leafMesh.scale.x, baseScale * pulseFactor, 8.0, delta);
        leafMesh.scale.setScalar(nextScale);
      }

      if (stateRef.current.isScanningActive && scanBeam) {
        stateRef.current.scanBeamProgress += delta * 1.5;
        const scanY = 1.15 + Math.sin(stateRef.current.scanBeamProgress * 3.0) * 0.85;
        scanBeam.position.y = scanY;
        (scanBeam.material as THREE.MeshBasicMaterial).opacity = 0.45 + Math.sin(time * 10) * 0.25;
      } else if (scanBeam) {
        (scanBeam.material as THREE.MeshBasicMaterial).opacity = 0;
      }

      sunKeyLight.intensity = 2.5 + Math.sin(time * 0.7) * 0.16 + hoverAmt * 0.12;

      const wiltDroop = stateRef.current.blightWiltFactor * 0.15;
      leafGroupList.forEach((branch, idx) => {
        const breezeGain = 1 + hoverAmt * 0.45;
        const swayX = Math.sin(time * 1.65 + idx * 0.85) * 0.036 * breezeGain;
        const swayZ = Math.cos(time * 1.35 + idx * 1.1) * 0.026 * breezeGain;
        branch.rotation.z = swayZ;
        branch.rotation.x = leafConfigs[idx].rotX + swayX + wiltDroop;
      });

      cluster1.rotation.z = Math.sin(time * 1.45) * 0.022;
      cluster2.rotation.z = Math.sin(time * 1.3 + 1.2) * 0.018;

      particleMat.opacity = 0.45 + hoverAmt * 0.2;
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i] * delta * (0.22 + hoverAmt * 0.12);
        if (positions[i * 3 + 1] > 2.45) {
          positions[i * 3 + 1] = 0.35;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      if (!hasNotifiedReady) {
        hasNotifiedReady = true;
        onSceneReadyRef.current?.();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const startLoopIfActive = () => {
      if (!isDisposed && isVisible && isDocumentVisible && !animationFrameId) {
        clock.getDelta();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              isVisible = entries.some((entry) => entry.isIntersecting);
              if (isVisible) startLoopIfActive();
            },
            { threshold: 0.01 }
          )
        : null;
    visibilityObserver?.observe(container);

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) startLoopIfActive();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      const aspect = w / h;
      stateRef.current.aspectZoomOffset = aspect < 0.88 ? 0.95 : aspect < 1.05 ? 0.38 : 0;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => handleResize())
        : null;
    resizeObserver?.observe(container);

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      if (envIdleHandle !== null) {
        if (envIdleHandle.isIdle && typeof win.cancelIdleCallback === 'function') {
          win.cancelIdleCallback(envIdleHandle.id);
        } else {
          globalThis.clearTimeout(envIdleHandle.id);
        }
      }
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousedown', handlePointerDown);
      container.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      textures.disposeAll();
      envTexture?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative z-0 w-full h-full flex flex-col bg-transparent overflow-visible">
      <div className="relative flex-1 min-h-0 w-full overflow-visible">
        <div
          ref={mountRef}
          className={`absolute inset-0 w-full h-full select-none bg-transparent ${
            isHoveringTomato ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
          }`}
          title={
            isUrdu
              ? 'پودے کو گھمانے کے لیے ڈریگ کریں، یا زوم کرنے کے لیے ٹماٹر پر کلک کریں'
              : 'Drag to rotate 360°, or click red tomato to zoom in'
          }
        />

        {contextLost && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-xl bg-white/95 border border-[#cbdcd0] text-xs font-medium text-[#13281c]">
              {isUrdu ? 'تھری ڈی منظر بحال ہو رہا ہے...' : 'Restoring 3D botanical view...'}
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 bg-[#13281c] text-white text-xs font-semibold rounded-full shadow-lg border border-emerald-500 animate-in fade-in slide-in-from-top-2 duration-300">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Bottom Dock positioned strictly BELOW the 3D plant on unified #faf8f2 surface */}
      <div className="relative z-10 shrink-0 mx-auto mt-1 mb-2 sm:mb-3 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-[#faf8f2] border border-[#cbdcd0] rounded-2xl shadow-sm flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs max-w-[96%]">
        <div className="flex items-center gap-1 bg-[#edf5ef] p-1 rounded-xl max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={handleResetView}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors font-medium text-[11px] sm:text-xs whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'full'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#2f4739] hover:text-[#13281c]'
            }`}
          >
            {t.plant3d.wholePlant}
          </button>
          <button
            type="button"
            onClick={handleFruitZoom}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors font-medium text-[11px] sm:text-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeView === 'fruit'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#2f4739] hover:text-[#13281c]'
            }`}
            title="Zoom in on red fruit cluster"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{t.plant3d.tomatoes}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('leaves')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors font-medium text-[11px] sm:text-xs whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'leaves'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-[#2f4739] hover:text-[#13281c]'
            }`}
          >
            {t.plant3d.leaves}
          </button>
        </div>

        <div className="h-4 w-px bg-[#cbdcd0] hidden sm:block" />

        <button
          type="button"
          onClick={handleSimulateHealing}
          className="px-2.5 sm:px-3.5 py-1.5 bg-[#edf5ef] hover:bg-[#dcebe0] text-[#13281c] font-bold border border-[#a3c2ab] rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs active:scale-95 text-[11px] sm:text-xs shrink-0 cursor-pointer"
          title="Watch the AI scan and restore blighted leaves to health"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#166534]" />
          <span>{t.plant3d.healSimulationBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => setPlantHealth(plantHealth === 'healthy' ? 'blighted' : 'healthy')}
          className={`px-2.5 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap text-[11px] cursor-pointer ${
            plantHealth === 'blighted'
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-white border-[#cbdcd0] text-[#2f4739] hover:text-[#13281c]'
          }`}
        >
          {plantHealth === 'blighted'
            ? isUrdu
              ? 'صحت مند دکھائیں'
              : 'Show Healthy'
            : isUrdu
            ? 'بیمار پتہ دکھائیں'
            : 'Show Blighted'}
        </button>

        <div className="h-4 w-px bg-[#cbdcd0] hidden sm:block" />

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-2.5 py-1.5 rounded-lg border transition-colors font-medium whitespace-nowrap flex items-center gap-1.5 text-[11px] cursor-pointer ${
            isRotating
              ? 'bg-[#edf5ef] border-[#a3c2ab] text-[#13281c]'
              : 'bg-white border-[#cbdcd0] text-[#2f4739]'
          }`}
        >
          <RotateCw
            className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`}
            style={{ animationDuration: '4s' }}
          />
          <span>{isRotating ? t.plant3d.pauseSpin : t.plant3d.spinPlant}</span>
        </button>

        {onOpenVideo && (
          <button
            type="button"
            onClick={onOpenVideo}
            className="px-3 py-1.5 text-[#13281c] bg-[#edf5ef] hover:bg-[#dcebe0] border border-[#cbdcd0] rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            {isUrdu ? 'ویڈیو گائیڈ' : 'Watch Video'}
          </button>
        )}

        {onScanClick && (
          <button
            type="button"
            onClick={onScanClick}
            className="px-4 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            {t.plant3d.checkLeaf}
          </button>
        )}
      </div>
    </div>
  );
};
