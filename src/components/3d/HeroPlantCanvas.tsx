import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../../context/LanguageContext';
import { RotateCw, ZoomIn, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HeroPlantCanvasProps {
  onScanClick?: () => void;
  onOpenVideo?: () => void;
  onSceneReady?: () => void;
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
  const [activeView, setActiveView] = useState<'full' | 'fruit' | 'leaves' | 'top'>('full');
  const [plantHealth, setPlantHealth] = useState<'healthy' | 'blighted' | 'healing'>('healthy');
  const [isHoveringTomato, setIsHoveringTomato] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);

  const { t, isUrdu } = useLanguage();

  // Animation state references (isolated from React renders for 60fps smooth damping)
  const stateRef = useRef({
    isRotating: true,
    targetCamPos: new THREE.Vector3(0, 1.32, 4.95),
    targetLookAt: new THREE.Vector3(0, 0.98, 0),
    aspectZoomOffset: 0,
    mouseX: 0,
    mouseY: 0,
    isDragging: false,
    dragStartX: 0,
    plantRotationY: 0.28,
    targetRotationY: 0.28,
    tomatoMeshes: [] as THREE.Mesh[],
    leafMeshes: [] as THREE.Mesh[],
    hoveredLeafMesh: null as THREE.Object3D | null,
    isHoveringPlant: false,
    hoverPulseIntensity: 0,
    scrollProgress: 0,
    scanBeam: null as THREE.Mesh | null,
    scanBeamProgress: 0,
    isScanningActive: false,
    targetLeafColor: new THREE.Color(0x238141),
    currentLeafColor: new THREE.Color(0x238141),
    camera: null as THREE.PerspectiveCamera | null,
  });

  useEffect(() => {
    stateRef.current.isRotating = isRotating;
  }, [isRotating]);

  // Camera preset transitions (whole plant fits comfortably with headroom below navbar)
  useEffect(() => {
    const zBoost = stateRef.current.aspectZoomOffset;
    if (activeView === 'full') {
      stateRef.current.targetCamPos.set(0, 1.32, 4.95 + zBoost);
      stateRef.current.targetLookAt.set(0, 0.98, 0);
    } else if (activeView === 'fruit') {
      stateRef.current.targetCamPos.set(0.45, 1.08, 2.05 + zBoost * 0.45);
      stateRef.current.targetLookAt.set(0.14, 0.96, 0.08);
    } else if (activeView === 'leaves') {
      stateRef.current.targetCamPos.set(-0.72, 1.56, 2.45 + zBoost * 0.5);
      stateRef.current.targetLookAt.set(-0.18, 1.28, 0);
    } else if (activeView === 'top') {
      stateRef.current.targetCamPos.set(0, 2.85, 2.55 + zBoost * 0.5);
      stateRef.current.targetLookAt.set(0, 1.0, 0);
    }
  }, [activeView]);

  // Handle Plant Health Color Transformation
  useEffect(() => {
    if (plantHealth === 'healthy') {
      stateRef.current.targetLeafColor.setHex(0x238141);
    } else if (plantHealth === 'blighted') {
      stateRef.current.targetLeafColor.setHex(0x8e7c2b);
    }
  }, [plantHealth]);

  const handleFruitZoom = () => {
    setActiveView('fruit');
    setIsRotating(false);
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
    stateRef.current.isScanningActive = true;
    stateRef.current.scanBeamProgress = 0;
    setActiveView('leaves');
    setIsRotating(false);

    setToastMessage(t.plant3d.healingToast);

    window.setTimeout(() => {
      setPlantHealth('healthy');
      stateRef.current.targetLeafColor.setHex(0x238141);
    }, 1800);

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

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 460;
    const initialAspect = width / height;
    stateRef.current.aspectZoomOffset = initialAspect < 0.85 ? 1.15 : initialAspect < 1.05 ? 0.45 : 0;

    // 100% transparent WebGL scene blending directly into Hero background
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, initialAspect, 0.1, 40);
    camera.position.set(0, 1.32, 4.95 + stateRef.current.aspectZoomOffset);
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
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
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

    // Balanced Greenhouse Studio Lighting
    const hemiLight = new THREE.HemisphereLight('#fefdf8', '#bbf7d0', 1.75);
    scene.add(hemiLight);

    const sunKeyLight = new THREE.DirectionalLight('#fffbeb', 2.45);
    sunKeyLight.position.set(4, 7, 4.5);
    sunKeyLight.castShadow = !isSoftwareGl;
    if (sunKeyLight.castShadow) {
      sunKeyLight.shadow.mapSize.width = 512;
      sunKeyLight.shadow.mapSize.height = 512;
      sunKeyLight.shadow.camera.near = 0.5;
      sunKeyLight.shadow.camera.far = 14;
      sunKeyLight.shadow.bias = -0.0005;
      sunKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(sunKeyLight);

    const rimLight = new THREE.DirectionalLight('#d9f99d', 0.95);
    rimLight.position.set(-3.5, 4, -2.5);
    scene.add(rimLight);

    // Procedural Botanical Leaf Vein Bump Map (<1ms canvas texture)
    const veinCanvas = document.createElement('canvas');
    veinCanvas.width = 128;
    veinCanvas.height = 128;
    const vCtx = veinCanvas.getContext('2d');
    if (vCtx) {
      vCtx.fillStyle = '#808080';
      vCtx.fillRect(0, 0, 128, 128);
      vCtx.strokeStyle = '#d4d4d4';
      vCtx.lineWidth = 3;
      vCtx.beginPath();
      vCtx.moveTo(64, 124);
      vCtx.lineTo(64, 8);
      vCtx.stroke();
      vCtx.lineWidth = 1.8;
      for (let y = 104; y >= 24; y -= 16) {
        const span = 18 + (110 - y) * 0.25;
        vCtx.beginPath();
        vCtx.moveTo(64, y);
        vCtx.quadraticCurveTo(64 - span * 0.5, y - 6, 64 - span, y - 14);
        vCtx.moveTo(64, y);
        vCtx.quadraticCurveTo(64 + span * 0.5, y - 6, 64 + span, y - 14);
        vCtx.stroke();
      }
    }
    const leafVeinTex = new THREE.CanvasTexture(veinCanvas);
    leafVeinTex.wrapS = THREE.ClampToEdgeWrapping;
    leafVeinTex.wrapT = THREE.ClampToEdgeWrapping;

    // Radial Soft Contact Shadow Disc (grounded cleanly at base)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(19, 40, 28, 0.34)');
      grad.addColorStop(0.55, 'rgba(19, 40, 28, 0.14)');
      grad.addColorStop(1, 'rgba(19, 40, 28, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const contactShadowTex = new THREE.CanvasTexture(shadowCanvas);
    contactShadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.PlaneGeometry(2.5, 2.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.015;
    scene.add(shadowMesh);

    // Compact Balanced Plant Group (scaled so top leaves & stake sit cleanly below Navbar)
    const plantGroup = new THREE.Group();
    plantGroup.scale.setScalar(0.86);
    scene.add(plantGroup);

    // Sculpted Terracotta Planter Pot + Decorative Collar + Rich Soil Mound
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xc46948,
      roughness: 0.72,
      metalness: 0.04,
    });
    const potBodyGeo = new THREE.CylinderGeometry(0.66, 0.47, 0.62, 24);
    const potMesh = new THREE.Mesh(potBodyGeo, potMat);
    potMesh.position.y = 0.31;
    potMesh.receiveShadow = !isSoftwareGl;
    plantGroup.add(potMesh);

    const potCollarGeo = new THREE.CylinderGeometry(0.7, 0.66, 0.11, 24);
    const potCollarMesh = new THREE.Mesh(potCollarGeo, potMat);
    potCollarMesh.position.y = 0.59;
    plantGroup.add(potCollarMesh);

    const rimGeo = new THREE.TorusGeometry(0.68, 0.045, 10, 26);
    const rimMesh = new THREE.Mesh(rimGeo, potMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.64;
    plantGroup.add(rimMesh);

    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x26180f,
      roughness: 0.96,
    });
    const soilGeo = new THREE.CylinderGeometry(0.63, 0.63, 0.08, 22);
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = 0.61;
    soilMesh.receiveShadow = !isSoftwareGl;
    plantGroup.add(soilMesh);

    const soilMoundGeo = new THREE.SphereGeometry(0.45, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const soilMound = new THREE.Mesh(soilMoundGeo, soilMat);
    soilMound.scale.set(1.25, 0.25, 1.25);
    soilMound.position.y = 0.62;
    plantGroup.add(soilMound);

    // Natural Bamboo Support Stake (compact height cleanly under upper headroom)
    const stakeGeo = new THREE.CylinderGeometry(0.022, 0.026, 1.88, 10);
    const stakeMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.78,
    });
    const stakeMesh = new THREE.Mesh(stakeGeo, stakeMat);
    stakeMesh.position.set(-0.07, 1.54, -0.05);
    stakeMesh.castShadow = !isSoftwareGl;
    plantGroup.add(stakeMesh);

    // Main Organic Vine Stem (tapered organic curve up to y = 2.08)
    const stemPoints = [
      new THREE.Vector3(0, 0.61, 0),
      new THREE.Vector3(0.03, 0.92, 0.02),
      new THREE.Vector3(-0.04, 1.24, -0.02),
      new THREE.Vector3(0.03, 1.56, 0.02),
      new THREE.Vector3(-0.02, 1.84, 0.01),
      new THREE.Vector3(0.0, 2.08, 0.0),
    ];
    const stemCurve = new THREE.CatmullRomCurve3(stemPoints);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 26, 0.036, 10, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x2c6e3b,
      roughness: 0.56,
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.castShadow = !isSoftwareGl;
    plantGroup.add(stemMesh);

    // Soft Jute Twine Ties connecting main stem to bamboo stake
    const twineMat = new THREE.MeshStandardMaterial({ color: 0xa17c52, roughness: 0.9 });
    const twineGeo = new THREE.TorusGeometry(0.068, 0.008, 6, 16);
    [1.1, 1.65].forEach((ty) => {
      const tie = new THREE.Mesh(twineGeo, twineMat);
      tie.position.set(-0.03, ty, -0.02);
      tie.rotation.x = Math.PI / 2.2;
      tie.rotation.y = 0.3;
      plantGroup.add(tie);
    });

    // Authentic Serrated & 3D-Cupped Tomato Leaflet Geometry
    const createTomatoLeafletGeometry = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      // Right serrated lobed margin
      shape.bezierCurveTo(0.06, 0.04, 0.14, 0.09, 0.15, 0.16);
      shape.lineTo(0.12, 0.21);
      shape.bezierCurveTo(0.18, 0.27, 0.19, 0.34, 0.16, 0.42);
      shape.lineTo(0.12, 0.46);
      shape.bezierCurveTo(0.16, 0.54, 0.14, 0.64, 0.1, 0.72);
      shape.lineTo(0.06, 0.76);
      shape.bezierCurveTo(0.07, 0.85, 0.03, 0.94, 0, 1.02);
      // Left serrated lobed margin (mirrored)
      shape.bezierCurveTo(-0.03, 0.94, -0.07, 0.85, -0.06, 0.76);
      shape.lineTo(-0.1, 0.72);
      shape.bezierCurveTo(-0.14, 0.64, -0.16, 0.54, -0.12, 0.46);
      shape.lineTo(-0.16, 0.42);
      shape.bezierCurveTo(-0.19, 0.34, -0.18, 0.27, -0.12, 0.21);
      shape.lineTo(-0.15, 0.16);
      shape.bezierCurveTo(-0.14, 0.09, -0.06, 0.04, 0, 0);

      const geo = new THREE.ShapeGeometry(shape, 4);
      const pos = geo.attributes.position;
      const uvs = geo.attributes.uv;

      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        // Gentle V-fold cup across midrib + graceful botanical arch droop
        const vCup = Math.abs(vx) * 0.28;
        const archDroop = -Math.pow(vy, 1.8) * 0.18;
        pos.setZ(i, vCup + archDroop);
        if (uvs) {
          uvs.setXY(i, vx * 2.5 + 0.5, Math.min(1, Math.max(0, vy)));
        }
      }
      pos.needsUpdate = true;
      if (uvs) uvs.needsUpdate = true;
      geo.computeVertexNormals();
      return geo;
    };

    const healthyLeafMat = new THREE.MeshStandardMaterial({
      color: 0x238141,
      roughness: 0.48,
      metalness: 0.03,
      bumpMap: leafVeinTex,
      bumpScale: 0.016,
      side: THREE.DoubleSide,
    });

    const leafGroupList: THREE.Group[] = [];
    const leafMeshes: THREE.Mesh[] = [];
    const leafGeo = createTomatoLeafletGeometry();
    const sharedPetioleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.08, 0.22),
      new THREE.Vector3(0, 0.09, 0.48),
      new THREE.Vector3(0, 0.03, 0.68),
    ]);
    const sharedPetioleGeo = new THREE.TubeGeometry(sharedPetioleCurve, 10, 0.013, 6, false);

    const makeCompoundLeaf = (scale = 1.0) => {
      const branchGroup = new THREE.Group();
      const pMesh = new THREE.Mesh(sharedPetioleGeo, stemMat);
      pMesh.scale.setScalar(scale);
      branchGroup.add(pMesh);

      const terminalLeaf = new THREE.Mesh(leafGeo, healthyLeafMat);
      terminalLeaf.scale.setScalar(0.56 * scale);
      terminalLeaf.userData.baseScale = 0.56 * scale;
      terminalLeaf.userData.leafIndex = leafMeshes.length;
      terminalLeaf.position.set(0, 0.03 * scale, 0.65 * scale);
      terminalLeaf.rotation.x = Math.PI / 2.25;
      terminalLeaf.castShadow = !isSoftwareGl;
      branchGroup.add(terminalLeaf);
      leafMeshes.push(terminalLeaf);

      const subPairs = [
        { z: 0.22, xOff: 0.05, rotZ: 0.92, rotX: Math.PI / 2.4, s: 0.42 },
        { z: 0.22, xOff: -0.05, rotZ: -0.92, rotX: Math.PI / 2.4, s: 0.42 },
        { z: 0.4, xOff: 0.04, rotZ: 0.78, rotX: Math.PI / 2.35, s: 0.48 },
        { z: 0.4, xOff: -0.04, rotZ: -0.78, rotX: Math.PI / 2.35, s: 0.48 },
        { z: 0.54, xOff: 0.03, rotZ: 0.62, rotX: Math.PI / 2.3, s: 0.36 },
        { z: 0.54, xOff: -0.03, rotZ: -0.62, rotX: Math.PI / 2.3, s: 0.36 },
      ];

      subPairs.forEach((sp) => {
        const subLeaf = new THREE.Mesh(leafGeo, healthyLeafMat);
        subLeaf.scale.setScalar(sp.s * scale);
        subLeaf.userData.baseScale = sp.s * scale;
        subLeaf.userData.leafIndex = leafMeshes.length;
        subLeaf.position.set(sp.xOff * scale, 0.075 * scale, sp.z * scale);
        subLeaf.rotation.x = sp.rotX;
        subLeaf.rotation.z = sp.rotZ;
        subLeaf.castShadow = !isSoftwareGl;
        branchGroup.add(subLeaf);
        leafMeshes.push(subLeaf);
      });

      return branchGroup;
    };

    const leafConfigs = [
      { y: 0.88, rotY: 0.3, rotX: 0.14, scale: 0.92 },
      { y: 1.08, rotY: 2.35, rotX: 0.16, scale: 0.98 },
      { y: 1.28, rotY: 4.35, rotX: 0.12, scale: 1.02 },
      { y: 1.48, rotY: 1.15, rotX: 0.18, scale: 0.95 },
      { y: 1.68, rotY: 3.25, rotX: 0.14, scale: 0.84 },
      { y: 1.88, rotY: 5.2, rotX: 0.2, scale: 0.7 },
    ];

    leafConfigs.forEach((cfg) => {
      const lGroup = makeCompoundLeaf(cfg.scale);
      lGroup.position.set(0, cfg.y, 0);
      lGroup.rotation.y = cfg.rotY;
      lGroup.rotation.x = cfg.rotX;
      plantGroup.add(lGroup);
      leafGroupList.push(lGroup);
    });

    stateRef.current.leafMeshes = leafMeshes;

    // Tiny Yellow 5-Petal Tomato Blossoms on Upper Flowering Truss
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.5,
    });
    const petalGeo = new THREE.ConeGeometry(0.022, 0.065, 4);
    const antherGeo = new THREE.ConeGeometry(0.012, 0.04, 6);

    const makeTomatoBlossom = () => {
      const flower = new THREE.Group();
      for (let p = 0; p < 5; p++) {
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const angle = (p / 5) * Math.PI * 2;
        petal.rotation.z = -Math.PI / 2.2;
        petal.rotation.y = angle;
        petal.position.set(Math.cos(angle) * 0.025, 0, Math.sin(angle) * 0.025);
        flower.add(petal);
      }
      const anther = new THREE.Mesh(antherGeo, centerMat);
      anther.position.y = 0.015;
      flower.add(anther);
      return flower;
    };

    const flowerTruss = new THREE.Group();
    flowerTruss.position.set(0.18, 1.78, 0.16);
    const flowerStemGeo = new THREE.CylinderGeometry(0.008, 0.01, 0.22, 6);
    const flowerStem = new THREE.Mesh(flowerStemGeo, stemMat);
    flowerStem.rotation.z = -0.9;
    flowerStem.position.set(-0.08, 0.04, -0.06);
    flowerTruss.add(flowerStem);
    const f1 = makeTomatoBlossom();
    f1.rotation.set(0.8, 0.3, 0);
    flowerTruss.add(f1);
    const f2 = makeTomatoBlossom();
    f2.position.set(0.07, -0.05, 0.04);
    f2.rotation.set(1.0, -0.5, 0);
    f2.scale.setScalar(0.85);
    flowerTruss.add(f2);
    plantGroup.add(flowerTruss);

    // Holographic AI Scanning Ring
    const scanPlaneGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.032, 24);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const scanBeam = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanBeam.position.set(0, 1.2, 0);
    plantGroup.add(scanBeam);
    stateRef.current.scanBeam = scanBeam;

    // Glossy PBR Vine Tomato Clusters with Pedicel Stems & 5-Point Star Calyx
    const tomatoMat = new THREE.MeshPhysicalMaterial({
      color: 0xe12d19,
      roughness: 0.2,
      metalness: 0.04,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
    });

    const tomatoRipeningMat = new THREE.MeshPhysicalMaterial({
      color: 0xea6a1a,
      roughness: 0.26,
      metalness: 0.04,
      clearcoat: 0.72,
    });

    const tomatoUnripeMat = new THREE.MeshPhysicalMaterial({
      color: 0x7cb93b,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.55,
    });

    const sharedTomatoSphereGeo = new THREE.SphereGeometry(1, 18, 14);
    const sharedSepalGeo = new THREE.ConeGeometry(0.14, 0.45, 4);
    const sharedPedicelGeo = new THREE.CylinderGeometry(0.009, 0.011, 0.14, 6);
    const tomatoMeshes: THREE.Mesh[] = [];

    const createTomatoFruit = (radius: number, ripeness: 'ripe' | 'turning' | 'unripe') => {
      const fruitGroup = new THREE.Group();
      const mat =
        ripeness === 'ripe'
          ? tomatoMat
          : ripeness === 'turning'
          ? tomatoRipeningMat
          : tomatoUnripeMat;
      const mesh = new THREE.Mesh(sharedTomatoSphereGeo, mat);
      mesh.scale.set(radius, radius * 0.88, radius);
      mesh.castShadow = !isSoftwareGl;
      fruitGroup.add(mesh);
      tomatoMeshes.push(mesh);

      // 5-Point Star Calyx Sepals hugging the fruit top
      for (let s = 0; s < 5; s++) {
        const sepal = new THREE.Mesh(sharedSepalGeo, stemMat);
        const ang = (s / 5) * Math.PI * 2;
        sepal.scale.setScalar(radius);
        sepal.position.set(Math.cos(ang) * radius * 0.2, radius * 0.84, Math.sin(ang) * radius * 0.2);
        sepal.rotation.order = 'YXZ';
        sepal.rotation.y = -ang;
        sepal.rotation.z = -Math.PI / 2.4;
        fruitGroup.add(sepal);
      }

      // Pedicel stalk up to vine truss
      const pedicel = new THREE.Mesh(sharedPedicelGeo, stemMat);
      pedicel.position.y = radius * 0.85 + 0.065;
      fruitGroup.add(pedicel);

      return fruitGroup;
    };

    // Lower Primary Fruiting Truss (anchored physically with a curved truss branch)
    const cluster1 = new THREE.Group();
    cluster1.position.set(0.02, 1.18, 0.04);
    const truss1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, 0),
      new THREE.Vector3(0.12, 0.02, 0.1),
      new THREE.Vector3(0.24, -0.05, 0.18),
    ]);
    const truss1Mesh = new THREE.Mesh(new THREE.TubeGeometry(truss1Curve, 10, 0.012, 6, false), stemMat);
    cluster1.add(truss1Mesh);

    const t1 = createTomatoFruit(0.135, 'ripe');
    t1.position.set(0.16, -0.13, 0.13);
    cluster1.add(t1);

    const t2 = createTomatoFruit(0.115, 'ripe');
    t2.position.set(0.25, -0.17, 0.19);
    cluster1.add(t2);

    const t3 = createTomatoFruit(0.095, 'turning');
    t3.position.set(0.09, -0.06, 0.09);
    cluster1.add(t3);

    plantGroup.add(cluster1);

    // Upper Secondary Fruiting Truss
    const cluster2 = new THREE.Group();
    cluster2.position.set(-0.02, 1.58, 0.02);
    const truss2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.06, 0),
      new THREE.Vector3(-0.11, 0.0, 0.09),
      new THREE.Vector3(-0.22, -0.06, 0.15),
    ]);
    const truss2Mesh = new THREE.Mesh(new THREE.TubeGeometry(truss2Curve, 10, 0.011, 6, false), stemMat);
    cluster2.add(truss2Mesh);

    const t4 = createTomatoFruit(0.115, 'ripe');
    t4.position.set(-0.15, -0.13, 0.11);
    cluster2.add(t4);

    const t5 = createTomatoFruit(0.088, 'unripe');
    t5.position.set(-0.23, -0.17, 0.16);
    cluster2.add(t5);

    plantGroup.add(cluster2);

    stateRef.current.tomatoMeshes = tomatoMeshes;

    // Ambient floating bio-particles (bounded safely inside canopy)
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.5;
      particlePositions[i * 3 + 1] = Math.random() * 1.9 + 0.3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      particleSpeeds.push(0.14 + Math.random() * 0.22);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.032,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Async Studio RoomEnvironment enrichment (non-blocking)
    let isDisposed = false;
    let envTexture: THREE.Texture | null = null;
    const win = window as Window & {
      requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const scheduleIdle = (cb: () => void): { id: number; isIdle: boolean } => {
      if (typeof win.requestIdleCallback === 'function') {
        return { id: win.requestIdleCallback(cb, { timeout: 400 }), isIdle: true };
      }
      return { id: globalThis.setTimeout(cb, 60) as unknown as number, isIdle: false };
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
            // Keep directional + hemisphere lights fallback
          }
        })
      : null;

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();
    const hoverLeafEmissive = new THREE.Color(0x166534);
    const baseEmissiveBlack = new THREE.Color(0x000000);
    let lastRaycastTime = 0;

    const handlePointerDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.dragStartX = e.clientX;
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

      stateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    container.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Touch Support
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

    // Animation Loop
    let animationFrameId = 0;
    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let hasNotifiedReady = false;
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed || !isVisible || !isDocumentVisible) {
        animationFrameId = 0;
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      const scrollLift = stateRef.current.scrollProgress * 0.1;

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        stateRef.current.targetCamPos.x + stateRef.current.mouseX * 0.2,
        3.5,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        stateRef.current.targetCamPos.y + stateRef.current.mouseY * 0.14 + scrollLift,
        3.5,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        stateRef.current.targetCamPos.z + stateRef.current.scrollProgress * 0.16,
        3.5,
        delta
      );
      camera.lookAt(stateRef.current.targetLookAt);

      if (stateRef.current.isRotating && !stateRef.current.isDragging) {
        stateRef.current.targetRotationY += 0.22 * delta;
      }

      stateRef.current.plantRotationY = THREE.MathUtils.damp(
        stateRef.current.plantRotationY,
        stateRef.current.targetRotationY + stateRef.current.scrollProgress * 0.35,
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

      stateRef.current.currentLeafColor.lerp(stateRef.current.targetLeafColor, delta * 3.0);
      healthyLeafMat.color.copy(stateRef.current.currentLeafColor);
      healthyLeafMat.emissive.lerpColors(baseEmissiveBlack, hoverLeafEmissive, hoverAmt);
      healthyLeafMat.emissiveIntensity = hoverAmt * (0.14 + Math.sin(time * 3.2) * 0.08);

      for (let i = 0; i < leafMeshes.length; i++) {
        const leafMesh = leafMeshes[i];
        const baseScale = (leafMesh.userData.baseScale as number) || 1;
        const isDirectLeaf = leafMesh === stateRef.current.hoveredLeafMesh;
        const pulseWave = Math.sin(time * 3.4 + i * 0.42);
        const pulseFactor =
          1 + hoverAmt * (0.032 + (isDirectLeaf ? 0.025 : 0) + pulseWave * 0.034);
        const nextScale = THREE.MathUtils.damp(leafMesh.scale.x, baseScale * pulseFactor, 8.0, delta);
        leafMesh.scale.setScalar(nextScale);
      }

      if (stateRef.current.isScanningActive && scanBeam) {
        stateRef.current.scanBeamProgress += delta * 1.5;
        const scanY = 1.0 + Math.sin(stateRef.current.scanBeamProgress * 3.0) * 0.72;
        scanBeam.position.y = scanY;
        (scanBeam.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 10) * 0.25;
      } else if (scanBeam) {
        (scanBeam.material as THREE.MeshBasicMaterial).opacity = 0;
      }

      sunKeyLight.intensity = 2.4 + Math.sin(time * 0.8) * 0.2 + hoverAmt * 0.12;

      leafGroupList.forEach((leaf, idx) => {
        const breezeGain = 1 + hoverAmt * 0.45;
        const sway = Math.sin(time * 2.0 + idx * 0.8) * 0.032 * breezeGain;
        leaf.rotation.z = Math.sin(time * 1.5 + idx) * 0.025 * breezeGain;
        leaf.rotation.x = leafConfigs[idx].rotX + sway;
      });

      cluster1.rotation.z = Math.sin(time * 1.8) * 0.02;

      particleMat.opacity = 0.5 + hoverAmt * 0.22;
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i] * delta * (0.24 + hoverAmt * 0.12);
        if (positions[i * 3 + 1] > 2.3) {
          positions[i * 3 + 1] = 0.3;
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
      stateRef.current.aspectZoomOffset = aspect < 0.88 ? 0.95 : aspect < 1.05 ? 0.35 : 0;
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
      leafVeinTex.dispose();
      contactShadowTex.dispose();
      envTexture?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative z-0 w-full h-full flex flex-col bg-transparent overflow-hidden">
      {/* Dedicated Upper 3D Viewport Area (100% unobstructed by bottom dock & strictly below navbar) */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
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

        {/* Interactive Helper Toast Notification */}
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 bg-[#13281c] text-white text-xs font-semibold rounded-full shadow-lg border border-emerald-500 animate-in fade-in slide-in-from-top-2 duration-300">
            {toastMessage}
          </div>
        )}

        {/* Top Left: Clean Static Health Mode Readout */}
        <div className="absolute top-2.5 left-2.5 sm:left-4 z-10 flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm ${
              plantHealth === 'blighted'
                ? 'bg-amber-50/95 text-amber-900 border-amber-300'
                : plantHealth === 'healing'
                ? 'bg-[#edf5ef]/95 text-[#13281c] border-emerald-400'
                : 'bg-white/95 text-[#13281c] border-[#cbdcd0]'
            }`}
          >
            {plantHealth === 'blighted' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            ) : plantHealth === 'healing' ? (
              <Sparkles className="w-3.5 h-3.5 text-[#166534] animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
            )}
            <span>
              {plantHealth === 'blighted'
                ? t.plant3d.blightedMode
                : plantHealth === 'healing'
                ? isUrdu
                  ? 'اے آئی اسکین جاری ہے...'
                  : 'AI Scanning Plant...'
                : t.plant3d.healthyMode}
            </span>
          </div>
        </div>

        {/* Top Right: Interactive 3D Label */}
        <div className="absolute top-2.5 right-2.5 sm:right-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 text-xs text-[#13281c] bg-white/95 px-3 py-1.5 rounded-xl border border-[#cbdcd0] shadow-sm">
          <span className="font-semibold">{t.plant3d.badge}</span>
        </div>
      </div>

      {/* Bottom Dock positioned strictly BELOW the 3D canvas so the whole pot & plant remain visible */}
      <div className="relative z-10 shrink-0 mx-auto mt-1 mb-2 sm:mb-3 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white/95 border border-[#cbdcd0] rounded-2xl shadow-lg flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs max-w-[96%]">
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
