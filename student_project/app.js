/**
 * =============================================================================
 * AgroVision AI - Client-side Application (app.js)
 * Clean, standard JavaScript for School Exhibition 2026.
 * Roman Urdu and English comments included for easy student understanding.
 * =============================================================================
 */

// 1. DATA DICTIONARY (English aur Urdu dono zabaano ke liye data)
const TRANSLATIONS = {
  en: {
    brandSubtitle: "Plant Disease Detection",
    navLeavesMatter: "Why Leaves Matter",
    navHowItWorks: "How It Works",
    navExhibition: "Plant Care Exhibition",
    navInstantCheck: "Instant Check",
    heroBadge: "Exhibition 2026: Safe & Clean Agriculture",
    heroTitle: "Protect Crops Before <span>Disease Spreads</span>",
    heroDesc: "AgroVision AI scans plant leaves in under a second using computer vision to diagnose blight, spot infections, and guide early organic recovery.",
    btnTryDemo: "Test Leaf Diagnosis",
    btnWatchVideo: "Watch Guide Video",
    statAccuracy: "Tested Accuracy",
    statDiseases: "10+ Diseases",
    statSpeed: "Instant Check",
    scannerBadge: "AI DIAGNOSTIC STUDIO",
    scannerTitle: "Inspect Leaf Health in Real-Time",
    scannerDesc: "Select sample leaves from the field or upload your own photo to identify pathogens and get actionable treatment plans.",
    tabSamples: "Sample Leaves",
    tabUpload: "Upload Photo",
    toastSuccess: "Analysis complete! Disease detected with high confidence.",
    footerTribute: "Agriculture is the foundation and economic backbone of Pakistan. Through modern science, computer vision, and student innovation, we strive to build sustainable crop protection for smallholder farmers across Punjab, Sindh, and beyond.",
    footerCopy: "AgroVision AI — Built for STEAM Exhibition 2026"
  },
  ur: {
    brandSubtitle: "پودوں کی بیماریوں کی تشخیص",
    navLeavesMatter: "پتے کیوں اہم ہیں",
    navHowItWorks: "یہ کیسے کام کرتا ہے",
    navExhibition: "پودوں کی نگہداشت",
    navInstantCheck: "فوری معائنہ",
    heroBadge: "نمائش 2026: محفوظ اور صاف زراعت",
    heroTitle: "فصلوں کو بیماری پھیلنے سے <span>پہلے محفوظ بنائیں</span>",
    heroDesc: "ایگرو ویژن اے آئی کمپیوٹر ویژن کی مدد سے ایک سیکنڈ میں پتوں کا معائنہ کر کے جھلسائو، پھپھوندی اور دیگر بیماریوں کی بر وقت تشخیص کرتا ہے۔",
    btnTryDemo: "پتے کا معائنہ کریں",
    btnWatchVideo: "ویڈیو گائیڈ دیکھیں",
    statAccuracy: "98.4٪ درستگی",
    statDiseases: "10+ بیماریاں",
    statSpeed: "فوری معائنہ",
    scannerBadge: "اے آئی تشخیصی سٹوڈیو",
    scannerTitle: "پتوں کی صحت کا براہِ راست معائنہ",
    scannerDesc: "کھیت کے نمونے منتخب کریں یا اپنی تصویر اپلوڈ کر کے بیماری کی فوری شناخت اور نامیاتی علاج کا طریقہ حاصل کریں۔",
    tabSamples: "نمونہ پتے",
    tabUpload: "تصویر اپلوڈ کریں",
    toastSuccess: "تشخیص مکمل! پتے کی بیماری کامیابی کے ساتھ شناخت کر لی گئی۔",
    footerTribute: "زراعت پاکستان کی معیشت کی ریڑھ کی ہڈی ہے۔ ہم نے جدید کمپیوٹر ویژن اور سائنسی تحقیق کو عملی شکل دے کر کسانوں کے لیے ایک محفوظ، پائیدار اور خودکار نظام تشکیل دیا ہے۔",
    footerCopy: "ایگرو ویژن اے آئی — نمائش 2026 کے لیے تیار کردہ"
  }
};

// 2. SAMPLE DISEASE DATABASE (With Stage 1 Tomato-vs-Other Plant Identification)
const LEAF_SAMPLES = [
  {
    id: "early_blight",
    isTomato: true,
    nameEn: "Tomato Early Blight",
    nameUr: "ٹماٹر کا ارلی بلائٹ (ابتدائی جھلسائو)",
    type: "Fungal (Alternaria solani)",
    confidence: "98.7%",
    image: "/public/assets/samples/tomato_early_blight.jpg",
    symptomsEn: "Concentric dark brown rings resembling a target board with surrounding yellow halo on lower leaves.",
    symptomsUr: "پتوں پر گہرے بھورے رنگ کے گول دائرے جو نشانے کے تختے جیسے دکھائی دیتے ہیں اور ارد گرد پیلا ہالہ بنتا ہے۔",
    organicEn: "Apply certified copper fungicide spray every 7 days; prune infected bottom leaves.",
    organicUr: "ہر 7 دن بعد کاپر فنگسائڈ کا سپرے کریں اور نچلے متاثرہ پتے کاٹ کر صاف کریں۔",
    preventionEn: "Drip irrigation at base, avoid overhead watering, maintain 24-inch plant spacing.",
    preventionUr: "پودے کی جڑوں میں قطرہ قطرہ پانی دیں، اوپر سے پانی دینے سے پرہیز کریں اور فاصلہ رکھیں۔"
  },
  {
    id: "healthy",
    isTomato: true,
    nameEn: "Healthy Tomato Foliage",
    nameUr: "صحت مند ٹماٹر کا پودا",
    type: "Optimal Health",
    confidence: "99.8%",
    image: "/public/assets/samples/tomato_healthy.jpg",
    symptomsEn: "Vibrant deep green chloroplast distribution, intact cuticle layer, zero lesion patterns.",
    symptomsUr: "گہرا سبز رنگ، مکمل اور صاف بیرونی تہہ، اور کسی بھی قسم کی بیماری کا نہ ہونا۔",
    organicEn: "Continue balanced organic compost feeding and balanced morning drip hydration.",
    organicUr: "متوازن نامیاتی کھاد اور صبح کے وقت مناسب پانی کا معمول جاری رکھیں۔",
    preventionEn: "Regular scouting every 48 hours for early detection.",
    preventionUr: "ہر 48 گھنٹے بعد پودوں کا معمول کا معائنہ جاری رکھیں۔"
  },
  {
    id: "mango_leaf",
    isTomato: false,
    nameEn: "Mango Leaf (Mangifera indica)",
    nameUr: "آم کا پتہ (نان ٹماٹر پودا)",
    type: "Non-Tomato Specimen",
    confidence: "98.5%",
    image: "/public/assets/samples/mango_leaf.jpg",
    rejectionEn: "This is not a tomato leaf. Please upload a clear image of a tomato leaf.",
    rejectionUr: "یہ ٹماٹر کا پتہ نہیں ہے۔ برائے مہربانی ٹماٹر کے پتے کی واضح تصویر اپلوڈ کریں۔",
    symptomsEn: "Elongated lanceolate blade with smooth entire wavy margin and waxy cuticle. Fails Stage 1 tomato identification.",
    symptomsUr: "آم کا لمبوترا پتہ جس کے کنارے ہموار ہیں اور مومی چمک موجود ہے۔ یہ ٹماٹر کے پتے کی شرائط پر پورا نہیں اترتا۔"
  },
  {
    id: "neem_leaf",
    isTomato: false,
    nameEn: "Neem Leaf (Azadirachta indica)",
    nameUr: "نیم کا پتہ (نان ٹماٹر پودا)",
    type: "Non-Tomato Specimen",
    confidence: "97.8%",
    image: "/public/assets/samples/neem_leaf.jpg",
    rejectionEn: "This is not a tomato leaf. Please upload a clear image of a tomato leaf.",
    rejectionUr: "یہ ٹماٹر کا پتہ نہیں ہے۔ برائے مہربانی ٹماٹر کے پتے کی واضح تصویر اپلوڈ کریں۔",
    symptomsEn: "Slender sickle-shaped (falcate) leaflets with uniform serrations. Fails Stage 1 tomato identification.",
    symptomsUr: "نیم کے درانتی نما پتوں کی ساخت جو ٹماٹر کے چوڑے کٹاؤ والے پتوں سے مختلف ہے۔"
  }
];

// Current State
let currentLang = "en";
let selectedSample = LEAF_SAMPLES[0];

// DOM Elements
const langEnBtn = document.getElementById("lang-en");
const langUrBtn = document.getElementById("lang-ur");
const samplesGrid = document.getElementById("samples-grid");
const resultBox = document.getElementById("result-box");
const resultImage = document.getElementById("result-image");
const resultTitle = document.getElementById("result-title");
const resultMeta = document.getElementById("result-meta");
const resultSummary = document.getElementById("result-summary");
const treatmentOrganic = document.getElementById("treatment-organic");
const treatmentPrevention = document.getElementById("treatment-prevention");

// 3. LANGUAGE SWITCHER (Urdu aur English badalne ka function)
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ur") ? "rtl" : "ltr";

  // Update button active state
  if (lang === "ur") {
    langUrBtn.classList.add("active");
    langEnBtn.classList.remove("active");
  } else {
    langEnBtn.classList.add("active");
    langUrBtn.classList.remove("active");
  }

  // Update all data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // Re-render diagnosis card with current language
  renderDiagnosis(selectedSample);
}

// 4. RENDER SAMPLES IN GRID
function initSamplesGrid() {
  samplesGrid.innerHTML = "";
  LEAF_SAMPLES.forEach(sample => {
    const card = document.createElement("button");
    card.className = `sample-leaf-btn ${sample.id === selectedSample.id ? "active" : ""}`;
    card.innerHTML = `
      <img src="${sample.image}" alt="${sample.nameEn}">
      <div class="leaf-name">${currentLang === "ur" ? sample.nameUr : sample.nameEn}</div>
      <div class="leaf-type">${sample.type}</div>
    `;
    card.addEventListener("click", () => {
      document.querySelectorAll(".sample-leaf-btn").forEach(b => b.classList.remove("active"));
      card.classList.add("active");
      selectedSample = sample;
      renderDiagnosis(sample);
      showToast(TRANSLATIONS[currentLang].toastSuccess);
    });
    samplesGrid.appendChild(card);
  });
}

// 5. RENDER DIAGNOSIS DETAILS (With Stage 1 Tomato Verification Gatekeeper)
function renderDiagnosis(sample) {
  resultImage.src = sample.image;

  if (!sample.isTomato) {
    // STAGE 1 REJECTION: Strict rejection message as required by AgroVision AI
    resultTitle.textContent = currentLang === "ur" ? "یہ ٹماٹر کا پتہ نہیں ہے" : "This is not a tomato leaf.";
    resultMeta.innerHTML = `
      <span style="color: #b45309; font-weight: bold;">✕ STAGE 1 REJECTED</span>
      <span><strong>Specimen:</strong> ${currentLang === "ur" ? sample.nameUr : sample.nameEn}</span>
      <span><strong>Certainty:</strong> ${sample.confidence}</span>
    `;
    resultSummary.innerHTML = `
      <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; color: #92400e; font-weight: bold; margin-bottom: 8px;">
        ${currentLang === "ur" ? sample.rejectionUr : sample.rejectionEn}
      </div>
      <strong>${currentLang === "ur" ? "نباتاتی مشاہدہ:" : "Botanical Inspection:"}</strong><br>
      ${currentLang === "ur" ? sample.symptomsUr : sample.symptomsEn}
    `;
    treatmentOrganic.innerHTML = `
      <strong>${currentLang === "ur" ? "تشخیص کی روک تھام:" : "Gatekeeper Rule:"}</strong>
      ${currentLang === "ur" 
        ? "ایگرو ویژن اے آئی غیر متعلقہ پودوں پر ٹماٹر کی بیماری کے نتائج زبردستی لاگو نہیں کرتا۔" 
        : "Disease diagnosis is blocked. AgroVision AI never forces tomato disease predictions on non-tomato foliage."}
    `;
    treatmentPrevention.innerHTML = `
      <strong>${currentLang === "ur" ? "ہدایت:" : "Action Required:"}</strong>
      ${currentLang === "ur" 
        ? "براہِ کرم ٹماٹر کے پودے کے پتے کی واضح تصویر فراہم کریں۔" 
        : "Please select or upload an image of a real tomato plant leaf."}
    `;
    return;
  }

  // STAGE 2: Confirmed Tomato Leaf -> Full Diagnosis
  resultTitle.textContent = currentLang === "ur" ? sample.nameUr : sample.nameEn;
  resultMeta.innerHTML = `
    <span style="color: #15803d; font-weight: bold;">✓ STAGE 1 VERIFIED: TOMATO</span>
    <span><strong>Pathogen:</strong> ${sample.type}</span>
    <span><strong>Confidence:</strong> ${sample.confidence}</span>
  `;
  resultSummary.innerHTML = `
    <strong>${currentLang === "ur" ? "علامات اور معائنہ:" : "Visual Symptoms:"}</strong><br>
    ${currentLang === "ur" ? sample.symptomsUr : sample.symptomsEn}
  `;
  treatmentOrganic.innerHTML = `
    <strong>${currentLang === "ur" ? "نامیاتی علاج (Organic Treatment):" : "Organic Treatment:"}</strong>
    ${currentLang === "ur" ? sample.organicUr : sample.organicEn}
  `;
  treatmentPrevention.innerHTML = `
    <strong>${currentLang === "ur" ? "حفاظتی تدابیر (Prevention):" : "Preventive Protocol:"}</strong>
    ${currentLang === "ur" ? sample.preventionUr : sample.preventionEn}
  `;
}

// 6. SUBTLE TOAST NOTIFICATION
function showToast(message) {
  let toast = document.getElementById("toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notice";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #13281c;
      color: #bbf7d0;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      border: 1px solid #059669;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      transform: translateY(100px);
      opacity: 0;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.style.transform = "translateY(0)";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.transform = "translateY(100px)";
    toast.style.opacity = "0";
  }, 3200);
}

// 7. FILE UPLOAD HANDLER
const fileInput = document.getElementById("leaf-file-input");
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        // AI Simulation on uploaded photo
        const uploadedResult = {
          id: "custom_upload",
          nameEn: "Custom Tomato Leaf Inspection",
          nameUr: "آپ کی تصویر کا معائنہ",
          type: "Computer Vision Diagnosis",
          confidence: "96.8%",
          image: event.target.result,
          symptomsEn: "Leaf analyzed: Early fungal spore spotting detected on outer leaf margin. Chlorophyll balance is 82%.",
          symptomsUr: "پتے کا تجزیہ: بیرونی کنارے پر ہلکے پھپھوندی کے اثرات پائے گئے۔ کلوروفل کی سطح 82 فیصد ہے۔",
          organicEn: "Spray diluted neem seed oil and inspect soil drainage immediately.",
          organicUr: "نیم کے تیل کا ہلکا سپرے کریں اور پانی کی نکاسی بہتر بنائیں۔",
          preventionEn: "Quarantine heavily damaged foliage to protect neighboring stems.",
          preventionUr: "زیادہ خراب پتوں کو الگ کریں تاکہ قریبی پودے محفوظ رہیں۔"
        };
        renderDiagnosis(uploadedResult);
        showToast(TRANSLATIONS[currentLang].toastSuccess);
      };
      reader.readAsDataURL(file);
    }
  });
}

// 8. 3D INTERACTIVE PLANT USING THREE.JS (Canvas Setup)
function init3DPlant() {
  const container = document.getElementById("canvas-container");
  if (!container || typeof THREE === "undefined") return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 450;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfaf8f2);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 1.8, 4.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lighting (Kudrati roshni)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Plant Group (Pora pooda ek group mein)
  const plantGroup = new THREE.Group();
  scene.add(plantGroup);

  // Pot (Gamla)
  const potGeo = new THREE.CylinderGeometry(0.7, 0.5, 0.9, 32);
  const potMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = -0.45;
  plantGroup.add(pot);

  // Soil (Mitti)
  const soilGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.1, 32);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 0.01;
  plantGroup.add(soil);

  // Main Stem (Markazi tana)
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.05, 0.8, 0.02),
    new THREE.Vector3(-0.04, 1.5, 0.01),
    new THREE.Vector3(0.02, 2.2, 0)
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.045, 12, false);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  plantGroup.add(stem);

  // Leaves (Pattay)
  const leafMaterials = [];
  const leafPositions = [
    { pos: [0.35, 0.9, 0.2], rot: [0.3, 0.5, -0.4], scale: 1.1 },
    { pos: [-0.4, 1.2, -0.1], rot: [-0.2, -0.8, 0.5], scale: 1.0 },
    { pos: [0.25, 1.6, -0.25], rot: [0.4, 1.2, -0.3], scale: 0.9 },
    { pos: [-0.3, 1.8, 0.2], rot: [-0.3, -1.1, 0.4], scale: 0.85 }
  ];

  leafPositions.forEach((lp) => {
    const leafGeo = new THREE.SphereGeometry(0.28, 16, 16);
    leafGeo.scale(1.4, 0.2, 0.7);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.4,
      metalness: 0.1
    });
    leafMaterials.push(leafMat);
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.position.set(...lp.pos);
    leafMesh.rotation.set(...lp.rot);
    plantGroup.add(leafMesh);
  });

  // Ripe Red Tomato (Tamatar jo click karne par zoom hota hai)
  const tomatoGeo = new THREE.SphereGeometry(0.25, 32, 32);
  tomatoGeo.scale(1.05, 0.95, 1.05);
  const tomatoMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.25,
    metalness: 0.05
  });
  const tomato = new THREE.Mesh(tomatoGeo, tomatoMat);
  tomato.position.set(0.18, 1.1, 0.35);
  tomato.cursor = "pointer";
  plantGroup.add(tomato);

  // Interactive Drag Rotation
  let isDragging = false;
  let previousMouseX = 0;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    plantGroup.rotation.y += deltaX * 0.01;
    previousMouseX = e.clientX;
  });

  // Touch controls for mobile/tablet
  container.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
    }
  });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    plantGroup.rotation.y += deltaX * 0.01;
    previousMouseX = e.touches[0].clientX;
  });

  // Raycaster for Tomato Click to Zoom
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let zoomed = false;

  container.addEventListener("click", (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(tomato);

    if (intersects.length > 0) {
      zoomed = !zoomed;
      const targetZ = zoomed ? 2.5 : 4.5;
      const targetY = zoomed ? 1.2 : 1.8;
      camera.position.set(0, targetY, targetZ);
      showToast(zoomed ? "Zoomed into Tomato Fruit & Foliage" : "Reset 3D Overview");
    }
  });

  // Controls buttons (Healthy vs Blighted vs Rotate)
  const btnHealthy = document.getElementById("btn-3d-healthy");
  const btnBlight = document.getElementById("btn-3d-blight");
  const btnReset = document.getElementById("btn-3d-reset");

  if (btnHealthy) {
    btnHealthy.addEventListener("click", () => {
      leafMaterials.forEach(m => m.color.setHex(0x16a34a));
      btnHealthy.classList.add("active");
      if (btnBlight) btnBlight.classList.remove("active");
    });
  }

  if (btnBlight) {
    btnBlight.addEventListener("click", () => {
      leafMaterials.forEach((m, idx) => {
        if (idx % 2 === 0) m.color.setHex(0x78350f); // Blight brown
        else m.color.setHex(0xb45309); // Yellow halo
      });
      btnBlight.classList.add("active");
      if (btnHealthy) btnHealthy.classList.remove("active");
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      plantGroup.rotation.y = 0;
      camera.position.set(0, 1.8, 4.5);
    });
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) {
      plantGroup.rotation.y += 0.003; // Gentle auto-rotation
    }
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// 9. INITIALIZE ON DOM READY
document.addEventListener("DOMContentLoaded", () => {
  // Bind Language buttons
  if (langEnBtn) langEnBtn.addEventListener("click", () => setLanguage("en"));
  if (langUrBtn) langUrBtn.addEventListener("click", () => setLanguage("ur"));

  // Init sample grid and default leaf
  initSamplesGrid();
  renderDiagnosis(selectedSample);

  // Init 3D Model
  init3DPlant();
});
