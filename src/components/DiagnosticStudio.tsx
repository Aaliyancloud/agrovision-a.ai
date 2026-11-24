import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Crosshair,
  HelpCircle,
  Leaf,
  Play,
  CheckCircle2,
  X,
  FileWarning,
  Info,
  Volume2,
  VolumeX,
  Calendar,
  MessageSquare,
  Loader2,
  Droplets,
  FlaskConical,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { DiagnosisResult, SampleLeaf } from '../types/disease';
import { STEAM_EXHIBITION_SAMPLES } from '../data/tomatoDiseases';
import { analyzeLeafImage, computeSensorInsights } from '../services/diseaseClassifier';
import { useLanguage } from '../context/LanguageContext';
import { useSensors } from '../context/SensorContext';
import { PrintableDiagnosticReport } from './PrintableDiagnosticReport';

const VideoTutorialModal = lazy(() =>
  import('./VideoTutorialModal').then((m) => ({ default: m.VideoTutorialModal }))
);
const DiagnosticSkeletonLoader = lazy(() =>
  import('./DiagnosticSkeletonLoader').then((m) => ({ default: m.DiagnosticSkeletonLoader }))
);
const GoogleChatShareModal = lazy(() =>
  import('./GoogleChatShareModal').then((m) => ({ default: m.GoogleChatShareModal }))
);
const DiagnosticPrintModal = lazy(() =>
  import('./DiagnosticPrintModal').then((m) => ({ default: m.DiagnosticPrintModal }))
);

export interface DiagnosticExternalAction {
  type: 'camera' | 'upload';
  file?: File;
  nonce: number;
}

interface DiagnosticStudioProps {
  externalAction?: DiagnosticExternalAction | null;
  onExternalActionHandled?: () => void;
}

export const DiagnosticStudio: React.FC<DiagnosticStudioProps> = ({
  externalAction,
  onExternalActionHandled
}) => {
  const { t, isUrdu } = useLanguage();
  const {
    moistureEnabled,
    toggleMoisture,
    moisturePercent,
    phEnabled,
    togglePh,
    soilPh,
    sensorContext
  } = useSensors();
  const [activeInputTab, setActiveInputTab] = useState<'samples' | 'upload' | 'camera'>('samples');
  const [sampleFilter, setSampleFilter] = useState<'all' | 'tomato' | 'non_tomato' | 'rejection'>('all');
  const [sourceType, setSourceType] = useState<'upload' | 'camera' | 'sample'>('sample');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(
    STEAM_EXHIBITION_SAMPLES[0].imageUrl
  );
  const [selectedSampleId, setSelectedSampleId] = useState<string>(STEAM_EXHIBITION_SAMPLES[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStepText, setAnalysisStepText] = useState<string>('');
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosisResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sensorContextRef = useRef(sensorContext);
  sensorContextRef.current = sensorContext;

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const stopAudioPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAudioPlaying(false);
    setIsAudioLoading(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      stopAudioPlayback();
    };
  }, []);

  const playBrowserSpeechFallback = (text: string, forUrdu: boolean) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsAudioPlaying(false);
      setIsAudioLoading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.lang = forUrdu ? 'ur-PK' : 'en-US';
    utterance.rate = forUrdu ? 0.9 : 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (forUrdu) {
      const urduVoice = voices.find((v) => v.lang.startsWith('ur') || v.lang.includes('pk'));
      if (urduVoice) utterance.voice = urduVoice;
    } else {
      const naturalVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
        ) || voices.find((v) => v.lang.startsWith('en'));
      if (naturalVoice) utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsAudioPlaying(true);
      setIsAudioLoading(false);
    };
    utterance.onend = () => {
      setIsAudioPlaying(false);
      setIsAudioLoading(false);
    };
    utterance.onerror = () => {
      setIsAudioPlaying(false);
      setIsAudioLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleAudio = async () => {
    if (!diagnosticResult) return;

    if (isAudioPlaying || isAudioLoading) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setIsAudioLoading(true);

    const diseaseTitle = isUrdu
      ? getUrduDiseaseName(diagnosticResult.diseaseId, diagnosticResult.diseaseName)
      : diagnosticResult.diseaseName;

    const stageTitle = isUrdu
      ? diagnosticResult.severity === 'Severe'
        ? 'شدید حالت'
        : diagnosticResult.severity === 'Moderate'
        ? 'درمیانی حالت'
        : 'ابتدائی حالت'
      : `${diagnosticResult.severity} stage`;

    const speechText = isUrdu
      ? `ایگرو وژن اے آئی کسان رہنمائی۔ شناخت: ${diseaseTitle}۔ شدت: ${stageTitle}۔ خلاصہ: ${diagnosticResult.summary}۔ تجویز کردہ علاج: ${diagnosticResult.treatment.organic.slice(0, 2).join('۔ اور ')}۔`
      : `AgroVision AI Farm Diagnostic Report. Disease: ${diseaseTitle}. Severity: ${stageTitle}. Summary: ${diagnosticResult.summary}. Recommended care: ${diagnosticResult.treatment.organic.slice(0, 2).join('. and ')}.`;

    // Try backend native Urdu speech synthesis endpoint first
    try {
      const response = await fetch('/api/tts-urdu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: speechText,
          diseaseId: diagnosticResult.diseaseId,
          isUrdu
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          const audioUrl = `data:${data.format || 'audio/wav'};base64,${data.audioBase64}`;
          const audio = new Audio(audioUrl);
          audioElementRef.current = audio;

          audio.onplay = () => {
            setIsAudioPlaying(true);
            setIsAudioLoading(false);
          };
          audio.onended = () => {
            setIsAudioPlaying(false);
            setIsAudioLoading(false);
            audioElementRef.current = null;
          };
          audio.onerror = () => {
            console.warn('Audio tag playback failed, falling back to browser speech synthesis.');
            playBrowserSpeechFallback(speechText, isUrdu);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Backend audio synthesis not reachable, falling back to browser speech:', err);
    }

    // Fallback to browser SpeechSynthesis
    playBrowserSpeechFallback(speechText, isUrdu);
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          isUrdu
            ? 'براؤزر میں کیمرہ سپورٹ دستیاب نہیں ہے۔'
            : 'Camera is not supported in this browser environment.'
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video playback deferred or muted:', playErr);
        }
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError(
        err.message ||
          (isUrdu
            ? 'کیمرے تک رسائی ممکن نہیں۔ برائے مہربانی اجازت دیں یا تصویر اپلوڈ کریں۔'
            : 'Unable to access camera. Please allow camera permissions or upload a picture.')
      );
      setIsCameraActive(false);
    }
  };

  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImageUri(dataUri);
      setSourceType('camera');
      stopCamera();
      runDiagnostic(dataUri, 'camera');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setSelectedImageUri(dataUri);
      setSourceType('upload');
      runDiagnostic(dataUri, 'upload');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setSelectedImageUri(dataUri);
      setSourceType('upload');
      runDiagnostic(dataUri, 'upload');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedSampleId(sample.id);
    setSelectedImageUri(sample.imageUrl);
    setSourceType('sample');

    let suggestedDiseaseId: string | undefined = undefined;
    if (sample.id === 'sample_early_blight') suggestedDiseaseId = 'early_blight';
    if (sample.id === 'sample_healthy') suggestedDiseaseId = 'healthy';
    if (sample.id === 'sample_late_blight') suggestedDiseaseId = 'late_blight';
    if (sample.id === 'sample_bacterial_spot_real') suggestedDiseaseId = 'bacterial_spot';
    if (sample.id === 'sample_yellow_curl_real') suggestedDiseaseId = 'yellow_leaf_curl';

    runDiagnostic(sample.imageUrl, 'sample', suggestedDiseaseId, sample.id);
  };

  const runDiagnostic = async (
    imageUri: string,
    source: 'upload' | 'camera' | 'sample',
    suggestedDiseaseId?: string,
    sampleId?: string,
    recordToHistory: boolean = true
  ) => {
    stopAudioPlayback();
    setIsAnalyzing(true);
    setShowSuccessToast(false);
    setAnalysisProgress(15);
    setAnalysisStepText(
      isUrdu
        ? 'مرحلہ 1: نباتاتی تصدیق — ٹماٹر کا پتہ بمقابلہ دیگر پودے...'
        : 'Stage 1: Plant identification & verifying tomato leaf morphology...'
    );

    setTimeout(() => {
      setAnalysisProgress(35);
      setAnalysisStepText(
        isUrdu
          ? 'مرحلہ 1: پتے کے کٹاؤ، مومی چمک اور کلوروفل کی ہولوگرافک پیمائش...'
          : 'Stage 1: Measuring margin serrations, cuticle reflectance & chlorophyll...'
      );
    }, 550);

    setTimeout(() => {
      setAnalysisProgress(68);
      setAnalysisStepText(
        isUrdu
          ? 'مرحلہ 2: بیماری کے دھبوں اور علامات کا ملٹی اسپیکٹرل اسکین...'
          : 'Stage 2: Multi-spectral sweep for lesion patterns & concentric rings...'
      );
    }, 1200);

    setTimeout(() => {
      setAnalysisProgress(92);
      setAnalysisStepText(
        isUrdu
          ? 'مرحلہ 3: تشخیصی رپورٹ اور نامیاتی علاج کا لائحہ عمل تیار کیا جا رہا ہے...'
          : 'Stage 3: Synthesizing verified recovery protocol & field guidance...'
      );
    }, 1750);

    setTimeout(async () => {
      const result = await analyzeLeafImage(
        imageUri,
        source,
        suggestedDiseaseId,
        sampleId,
        sensorContextRef.current
      );
      setDiagnosticResult(result);
      setAnalysisProgress(100);
      setIsAnalyzing(false);

      if (result.isTomatoLeaf) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4500);
      }
    }, 2200);
  };

  useEffect(() => {
    if (selectedImageUri && !diagnosticResult) {
      runDiagnostic(selectedImageUri, 'sample', 'early_blight', 'sample_early_blight', false);
    }
  }, []);

  // Keep sensorInsights synchronized immediately if user adjusts virtual sensors after a scan
  useEffect(() => {
    setDiagnosticResult((prev) => {
      if (!prev || !prev.isTomatoLeaf) return prev;
      const updatedInsights = computeSensorInsights(prev.diseaseId, sensorContext);
      const prevDelta = prev.sensorInsights?.confidenceDelta ?? 0;
      const nextDelta = updatedInsights?.confidenceDelta ?? 0;
      const baseConfidence = prev.confidence - prevDelta;
      const adjustedConfidence = updatedInsights
        ? Math.min(99, Math.max(75, Number((baseConfidence + nextDelta).toFixed(1))))
        : Number(baseConfidence.toFixed(1));
      return {
        ...prev,
        confidence: adjustedConfidence,
        sensorInsights: updatedInsights
      };
    });
  }, [moistureEnabled, moisturePercent, phEnabled, soilPh]);

  // Handle deep actions triggered from Hero buttons (Open Live Camera / Direct Upload)
  useEffect(() => {
    if (!externalAction) return;
    if (externalAction.type === 'camera') {
      setActiveInputTab('camera');
      handleStartCamera();
    } else if (externalAction.type === 'upload' && externalAction.file) {
      setActiveInputTab('upload');
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        if (dataUri) {
          setSelectedImageUri(dataUri);
          setSourceType('upload');
          runDiagnostic(dataUri, 'upload');
        }
      };
      reader.readAsDataURL(externalAction.file);
    }
    onExternalActionHandled?.();
  }, [externalAction?.nonce]);

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleDownloadReport = () => {
    if (!diagnosticResult || typeof window === 'undefined') return;
    const previousTitle = document.title;
    document.title = `AgroVision-AI-${diagnosticResult.diseaseId}-Diagnosis-Report`;

    const restoreTitle = () => {
      document.title = previousTitle;
    };

    window.addEventListener('afterprint', restoreTitle, { once: true });
    requestAnimationFrame(() => {
      window.print();
      // Fallback title restoration if afterprint does not fire in sandboxed browsers
      window.setTimeout(restoreTitle, 1500);
    });
  };

  const getUrduDiseaseName = (id: string, def: string) => {
    if (id === 'early_blight') return 'ارلی بلائیٹ (پتوں کا ابتدائی جھلساؤ)';
    if (id === 'late_blight') return 'لیٹ بلائیٹ (پتوں کا شدید جھلساؤ)';
    if (id === 'bacterial_spot') return 'بیکٹیریل اسپاٹ (پتوں کے سیاہ دھبے)';
    if (id === 'yellow_leaf_curl') return 'پیلا پتہ مروڑ وائرس';
    if (id === 'healthy') return 'صحت مند ٹماٹر کا پودا';
    return def;
  };

  const filteredSamples = STEAM_EXHIBITION_SAMPLES.filter((s) => {
    if (sampleFilter === 'all') return true;
    if (sampleFilter === 'tomato') return s.category === 'tomato';
    if (sampleFilter === 'non_tomato') return s.category === 'non_tomato';
    if (sampleFilter === 'rejection') return s.category === 'blurry' || s.category === 'non_leaf';
    return true;
  });

  return (
    <section id="diagnostic" className="relative w-full py-20 bg-[#f4f1e8] border-t border-[#cbdcd0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold mb-2">
            {t.scanner.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13281c] tracking-tight leading-tight text-balance">
            {t.scanner.title}
          </h2>
          <p className="mt-4 text-[#3d5947] text-base sm:text-lg leading-relaxed">
            {t.scanner.subtitle}
          </p>

          {/* Two-Stage Architecture Notice */}
          <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-950 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>
              {isUrdu
                ? 'دو مرحلہ جاتی خودکار نظام: پہلے ٹماٹر کے پتے کی شناخت، پھر بیماری کا معائنہ'
                : 'Two-Stage AI: Stage 1 Tomato Plant Verification → Stage 2 Disease Classification'}
            </span>
          </div>

          {/* Video Guide Shortcut Button */}
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#edf5ef] border border-emerald-300 text-xs font-semibold text-emerald-900 transition-all shadow-sm active:scale-95 group"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-200 transition-colors">
                <Play className="w-3 h-3 fill-emerald-800" />
              </div>
              <span>{t.scanner.quickVideoBtn}</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace Card */}
        <div className="relative bg-white border border-[#cbdcd0] rounded-3xl p-6 lg:p-8 shadow-sm">
          {/* Subtle Success Toast Notification */}
          {showSuccessToast && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 max-w-md w-[90%] bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-emerald-100">
                    {t.scanner.successToastTitle}
                  </div>
                  <div className="text-[11px] text-emerald-200/90">
                    {isUrdu
                      ? 'مرحلہ 1 میں ٹماٹر کے پتے کی تصدیق اور مرحلہ 2 میں تشخیص مکمل ہو گئی۔'
                      : 'Stage 1 tomato leaf confirmed & Stage 2 pathology report is ready below.'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Mode Segmented Selector (3 Clear Options) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#cbdcd0]/60">
            <div className="flex items-center gap-1.5 p-1 bg-[#f4f7f5] rounded-2xl border border-[#cbdcd0] max-w-full overflow-x-auto">
              <button
                onClick={() => {
                  stopCamera();
                  setActiveInputTab('samples');
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                  activeInputTab === 'samples'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#3d5947] hover:text-[#13281c]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.scanner.tabSamples}</span>
              </button>

              <button
                onClick={() => {
                  stopCamera();
                  setActiveInputTab('upload');
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                  activeInputTab === 'upload'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#3d5947] hover:text-[#13281c]'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{t.scanner.tabUpload}</span>
              </button>

              <button
                onClick={() => {
                  setActiveInputTab('camera');
                  handleStartCamera();
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                  activeInputTab === 'camera'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#3d5947] hover:text-[#13281c]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t.scanner.tabCamera}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isUrdu ? 'اسکینر تیار ہے' : 'Plant Checker Ready'}</span>
            </div>
          </div>

          {/* Synchronized Virtual Soil Sensor Context Bar */}
          <div className="mt-4 px-4 py-3 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5 text-[#3d5947]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-semibold text-[#13281c]">
                {isUrdu ? 'تشخیصی سینسر سیاق:' : 'Diagnosis Sensor Context:'}
              </span>

              <button
                type="button"
                onClick={toggleMoisture}
                aria-pressed={moistureEnabled}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-colors ${
                  moistureEnabled
                    ? 'bg-[#edf5ef] border-emerald-300 text-emerald-900'
                    : 'bg-white border-[#cbdcd0] text-slate-500'
                }`}
              >
                <Droplets className="w-3 h-3" />
                <span>
                  {isUrdu ? 'نمی' : 'Moisture'}: {moistureEnabled ? `${moisturePercent}%` : isUrdu ? 'بند' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={togglePh}
                aria-pressed={phEnabled}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-colors ${
                  phEnabled
                    ? 'bg-[#edf5ef] border-emerald-300 text-emerald-900'
                    : 'bg-white border-[#cbdcd0] text-slate-500'
                }`}
              >
                <FlaskConical className="w-3 h-3" />
                <span>
                  {isUrdu ? 'پی ایچ' : 'pH'}: {phEnabled ? soilPh.toFixed(1) : isUrdu ? 'بند' : 'OFF'}
                </span>
              </button>
            </div>

            <a
              href="#smart-sensors"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 whitespace-nowrap"
            >
              {isUrdu ? 'سینسرز کی سطح تبدیل کریں' : 'Tune Virtual Sensors'}
            </a>
          </div>

          {/* Input Method Content */}
          <div className="py-6">
            {/* 1. Test Leaves (Samples) with Exhibition Filter Tabs */}
            {activeInputTab === 'samples' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#3d5947]">
                  <span>
                    {isUrdu
                      ? 'کسی بھی آزمائشی نمونے پر کلک کریں تاکہ اے آئی کی تصدیق کا طریقہ دیکھیں:'
                      : 'Click any specimen to test Stage 1 identification and rejection rules:'}
                  </span>

                  {/* Specimen Category Filters */}
                  <div className="flex items-center gap-1.5 p-1 bg-[#edf5ef] rounded-xl border border-[#cbdcd0] max-w-full overflow-x-auto">
                    <button
                      onClick={() => setSampleFilter('all')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        sampleFilter === 'all'
                          ? 'bg-white text-emerald-900 shadow-sm'
                          : 'text-[#3d5947] hover:text-[#13281c]'
                      }`}
                    >
                      {isUrdu ? `تمام نمونے (${STEAM_EXHIBITION_SAMPLES.length})` : `All Specimens (${STEAM_EXHIBITION_SAMPLES.length})`}
                    </button>
                    <button
                      onClick={() => setSampleFilter('tomato')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        sampleFilter === 'tomato'
                          ? 'bg-white text-emerald-900 shadow-sm'
                          : 'text-[#3d5947] hover:text-[#13281c]'
                      }`}
                    >
                      {isUrdu ? 'ٹماٹر کے پتے (5)' : 'Tomato Foliage (5)'}
                    </button>
                    <button
                      onClick={() => setSampleFilter('non_tomato')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        sampleFilter === 'non_tomato'
                          ? 'bg-amber-100 text-amber-900 shadow-sm font-bold'
                          : 'text-amber-800 hover:text-amber-950'
                      }`}
                    >
                      {isUrdu ? 'دیگر پودے: آم و نیم (2)' : 'Non-Tomato (Mango/Neem) (2)'}
                    </button>
                    <button
                      onClick={() => setSampleFilter('rejection')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        sampleFilter === 'rejection'
                          ? 'bg-slate-200 text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isUrdu ? 'دھندلی / غیر پتہ (2)' : 'Blurry & Objects (2)'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                  {filteredSamples.map((sample) => {
                    const isSelected = selectedSampleId === sample.id;
                    const isNonTomato = sample.category === 'non_tomato';
                    const isRejectionTest = sample.category === 'blurry' || sample.category === 'non_leaf';

                    return (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className={`group relative p-2.5 rounded-2xl border text-left transition-all overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? isNonTomato
                              ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400/40'
                              : isRejectionTest
                              ? 'border-slate-500 bg-slate-50 shadow-sm ring-2 ring-slate-400/40'
                              : 'border-emerald-600 bg-[#edf5ef] shadow-sm ring-2 ring-emerald-400/40'
                            : 'border-[#cbdcd0] bg-[#fcfbf9] hover:border-emerald-300'
                        }`}
                      >
                        <div>
                          <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2 bg-[#e2ede5]">
                            <img
                              src={sample.imageUrl}
                              alt={`${sample.title} — ${sample.condition}`}
                              width={320}
                              height={192}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div
                              className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold shadow-sm ${
                                isNonTomato
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : isRejectionTest
                                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              {sample.category === 'tomato'
                                ? 'Tomato'
                                : sample.category === 'non_tomato'
                                ? 'Non-Tomato'
                                : sample.category === 'blurry'
                                ? 'Blurry'
                                : 'Object'}
                            </div>
                          </div>

                          <div className="font-display text-xs font-bold text-[#13281c] truncate">
                            {sample.title}
                          </div>
                          <div className="text-[10px] text-[#3d5947] truncate mt-0.5">
                            {sample.condition}
                          </div>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-[#cbdcd0]/50 text-[9px] font-mono font-medium text-emerald-900 flex items-center justify-between">
                          <span>
                            {sample.category === 'tomato' ? '✓ Stage 1 Pass' : '✕ Rejection Rule'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Upload Box */}
            {activeInputTab === 'upload' && (
              <div className="w-full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp,image/*"
                  className="hidden"
                />

                {selectedImageUri && sourceType === 'upload' ? (
                  /* Uploaded Photo Preview Card */
                  <div className="border-2 border-emerald-500 bg-[#edf5ef]/50 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="relative group max-w-sm w-full aspect-video sm:aspect-square max-h-[300px] rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md bg-white">
                      <img
                        src={selectedImageUri}
                        alt="Uploaded tomato leaf photo ready for AgroVision AI analysis"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isUrdu ? 'تصویر کامیابی سے لوڈ ہو گئی' : 'Photo Loaded'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="font-display text-base sm:text-lg font-bold text-[#13281c]">
                        {isUrdu ? 'آپ کے پتے کی تصویر کا تجزیہ ہو رہا ہے' : 'Your Leaf Photo is Ready'}
                      </div>
                      <p className="text-xs text-[#3d5947] mt-1">
                        {isUrdu
                          ? 'تصویر خودکار نظام میں داخل کر دی گئی ہے۔ نیچے تفصیلی تشخیصی رپورٹ ملاحظہ فرمائیں۔'
                          : 'The image has been loaded into the AI pipeline. See your full diagnostic report below.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-white border border-emerald-400 hover:bg-[#edf5ef] text-emerald-950 text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2"
                      >
                        <UploadCloud className="w-4 h-4 text-emerald-700" />
                        <span>{isUrdu ? 'کوئی اور تصویر اپلوڈ کریں' : 'Upload Different Photo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => runDiagnostic(selectedImageUri, 'upload')}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isUrdu ? 'دوبارہ اسکین کریں' : 'Re-Analyze Photo'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty Dropzone when no photo is uploaded yet */
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#cbdcd0] hover:border-emerald-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-[#fcfbf9] flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#edf5ef] border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div className="font-display text-lg font-bold text-[#13281c]">
                      {t.scanner.dragDropText}, <span className="text-emerald-700 underline">{t.scanner.orBrowse}</span>
                    </div>
                    <p className="text-xs text-[#3d5947] max-w-md">
                      {isUrdu
                        ? 'جے پی جی، پی این جی اور ویب پی تصاویر سپورٹڈ ہیں۔ ٹماٹر کے پتے کی تصویر اپلوڈ کریں، ہمارا اے آئی فوری تجزیہ کرے گا۔'
                        : 'Works with JPG, PNG, and WEBP photos. Upload any tomato leaf photo for instant AI health & disease detection.'}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      {t.scanner.selectFileBtn}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Live Camera */}
            {activeInputTab === 'camera' && (
              <div className="relative rounded-3xl overflow-hidden bg-[#13281c] border border-[#cbdcd0] flex flex-col items-center justify-center min-h-[380px]">
                {cameraError ? (
                  <div className="p-8 text-center max-w-md bg-white rounded-2xl m-4">
                    <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <div className="text-sm font-bold text-[#13281c]">
                      {isUrdu ? 'کیمرہ الرٹ' : 'Camera Notice'}
                    </div>
                    <p className="text-xs text-[#3d5947] mt-2">{cameraError}</p>
                    <button
                      onClick={handleStartCamera}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
                    >
                      {isUrdu ? 'دوبارہ کیمرہ شروع کریں' : 'Try Camera Again'}
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-[400px] flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-contain"
                    />

                    {/* Camera Target Frame Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-emerald-400 rounded-3xl relative shadow-2xl">
                        <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-950 bg-white/90 px-2 py-0.5 rounded-md font-semibold">
                          {isUrdu ? 'ٹماٹر کا پتہ یہاں رکھیں' : 'HOLD TOMATO LEAF HERE'}
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70">
                          <Crosshair className="w-8 h-8" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
                      <button
                        onClick={handleCaptureFromCamera}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{t.scanner.captureBtn}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Analysis Progress & Skeleton Loader Overlay */}
          {isAnalyzing && (
            <Suspense
              fallback={
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 animate-spin text-emerald-700" />
                </div>
              }
            >
              <DiagnosticSkeletonLoader
                progress={analysisProgress}
                stepText={analysisStepText}
                imageUri={selectedImageUri}
              />
            </Suspense>
          )}

          {/* ================================================================= */}
          {/* STAGE 1 REJECTION SCREEN: NON-TOMATO, UNKNOWN, BLURRY, OR NON-LEAF */}
          {/* ================================================================= */}
          {diagnosticResult && !isAnalyzing && !diagnosticResult.isTomatoLeaf && (
            <div className="mt-6 pt-8 border-t border-[#cbdcd0]/60 text-center">
              <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-sm bg-[#faf8f2] border-amber-300">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-mono font-bold text-amber-900 mb-4">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>
                    {isUrdu
                      ? 'مرحلہ 1 کا لازمی اصول: نباتاتی تصدیق مسترد'
                      : 'STAGE 1 CLASSIFICATION RULE: SPECIES VERIFICATION FAILED'}
                  </span>
                </div>

                {/* Submitted Photo Preview */}
                <div className="relative mx-auto mb-4 max-w-[220px] aspect-square rounded-2xl overflow-hidden border-2 border-amber-400 bg-white shadow-sm">
                  <img
                    src={diagnosticResult.imageUri}
                    alt={`Submitted leaf specimen: ${diagnosticResult.stage1.speciesCommonName}`}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono py-0.5 px-2 rounded-lg truncate">
                    {diagnosticResult.stage1.speciesCommonName}
                  </div>
                </div>

                {/* Primary Rejection Header (Strict Text Matching User Instructions) */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c] mb-3">
                  {diagnosticResult.stage1.status === 'non_tomato_leaf' ? (
                    isUrdu ? t.scanner.notTomatoTitle : 'This is not a tomato leaf.'
                  ) : diagnosticResult.stage1.status === 'unknown_plant' ? (
                    isUrdu ? t.scanner.unknownPlantTitle : 'Uncertain plant identification.'
                  ) : diagnosticResult.stage1.status === 'blurry' ? (
                    isUrdu ? t.scanner.blurryTitle : 'The image is too blurry.'
                  ) : (
                    isUrdu ? t.scanner.notLeafTitle : "We couldn't find a plant leaf in this photo."
                  )}
                </h3>

                {/* Exact Required Instruction Message */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400 text-amber-950 font-semibold text-sm sm:text-base leading-relaxed mb-6">
                  {diagnosticResult.stage1.status === 'non_tomato_leaf' ? (
                    isUrdu
                      ? 'یہ ٹماٹر کا پتہ نہیں ہے۔ برائے مہربانی ٹماٹر کے پتے کی واضح تصویر اپلوڈ کریں۔'
                      : 'This is not a tomato leaf. Please upload a clear image of a tomato leaf.'
                  ) : diagnosticResult.stage1.status === 'unknown_plant' ? (
                    isUrdu
                      ? 'پودے کی شناخت غیر یقینی ہے۔ یہ ٹماٹر کا پتہ معلوم نہیں ہوتا۔ برائے مہربانی ٹماٹر کے پتے کی واضح تصویر اپلوڈ کریں۔'
                      : 'Uncertain plant identification. This does not appear to be a tomato leaf. Please upload a clear image of a tomato leaf.'
                  ) : diagnosticResult.stage1.status === 'blurry' ? (
                    isUrdu
                      ? 'تصویر بہت دھندلی ہے۔ برائے مہربانی زیادہ واضح تصویر اپلوڈ کریں۔'
                      : 'The image is too blurry. Please upload a clearer image.'
                  ) : (
                    isUrdu
                      ? 'اس تصویر میں پودے کا پتہ نہیں ملا۔ برائے مہربانی کسی پودے کے پتے کی تصویر اپلوڈ کریں۔'
                      : "We couldn't find a plant leaf in this photo. Please upload a leaf image."
                  )}
                </div>

                {/* Detailed Botanical Diagnostics of Why Rejection Occurred */}
                <div className="p-5 bg-white rounded-2xl border border-[#cbdcd0] text-xs text-[#3d5947] mb-6 text-left">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#cbdcd0]/60">
                    <div className="font-bold text-[#13281c] flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? 'نباتاتی تجزیہ کی تفصیلات:' : 'Botanical Inspection Metrics:'}</span>
                    </div>
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {diagnosticResult.stage1.detectedSpecies.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-[#faf8f2] border border-[#cbdcd0]">
                      <span className="text-[10px] text-[#3d5947] uppercase font-mono block">
                        {isUrdu ? 'شناخت شدہ نمونہ' : 'Detected Specimen'}
                      </span>
                      <strong className="text-xs text-[#13281c]">
                        {diagnosticResult.stage1.speciesCommonName}
                      </strong>
                      <div className="text-[11px] italic text-[#3d5947]">
                        {diagnosticResult.stage1.speciesScientificName}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#faf8f2] border border-[#cbdcd0]">
                      <span className="text-[10px] text-[#3d5947] uppercase font-mono block">
                        {isUrdu ? 'شناخت کی شرحِ یقین' : 'Identification Confidence'}
                      </span>
                      <strong className="text-xs text-emerald-800">
                        {diagnosticResult.stage1.confidence}%
                      </strong>
                      <div className="text-[11px] text-[#3d5947]">
                        {isUrdu ? 'ٹماٹر کے پتے کے خواص مفقود ہیں' : 'Lacks Solanum lycopersicum traits'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-semibold text-[#13281c]">
                      {isUrdu ? 'پتے کی ساخت کے مشاہدات:' : 'Key Morphological Markers:'}
                    </div>
                    {(isUrdu
                      ? diagnosticResult.stage1.urduCharacteristics
                      : diagnosticResult.stage1.characteristics
                    ).map((char, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">✕</span>
                        <span>{char}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#cbdcd0]/60 text-[11px] text-[#3d5947] italic">
                    {isUrdu
                      ? 'اصول: ایگرو ویژن اے آئی غیر متعلقہ پودوں پر ٹماٹر کی بیماری کے غلط نتائج زبردستی لاگو نہیں کرتا۔'
                      : 'AgroVision AI never forces a tomato disease prediction on an image that has not passed tomato-leaf identification.'}
                  </div>
                </div>

                {/* Quick Recovery Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setActiveInputTab('samples');
                      handleSelectSample(STEAM_EXHIBITION_SAMPLES[0]);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
                  >
                    <Leaf className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'ٹماٹر کا پتہ آزمائیں (ارلی بلائیٹ)' : 'Test Tomato Leaf (Early Blight)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveInputTab('samples');
                      handleSelectSample(STEAM_EXHIBITION_SAMPLES[1]);
                    }}
                    className="px-5 py-2.5 bg-white border border-[#cbdcd0] hover:bg-[#edf5ef] text-[#13281c] font-semibold text-xs rounded-xl transition-all"
                  >
                    {isUrdu ? 'صحت مند ٹماٹر کا پتہ آزمائیں' : 'Test Healthy Tomato Leaf'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STAGE 2 CONFIRMED: TOMATO LEAF VERIFIED & DISEASE DIAGNOSIS READY */}
          {/* ================================================================= */}
          {diagnosticResult && !isAnalyzing && diagnosticResult.isTomatoLeaf && (
            <div className="mt-6 pt-8 border-t border-[#cbdcd0]/60">
              {/* STAGE 1 VERIFICATION PASS BANNER */}
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
                      <span>
                        {isUrdu
                          ? 'مرحلہ 1 کامیاب: ٹماٹر کا پتہ تصدیق شدہ'
                          : 'Stage 1 Verified: Solanum lycopersicum (Tomato Leaf Confirmed)'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-semibold">
                        {diagnosticResult.stage1.confidence}% {isUrdu ? 'یقین' : 'Confidence'}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      {isUrdu
                        ? 'پتے کے کٹاؤ، روئیں دار سطح اور کلوروفل نے ٹماٹر کی نسل کی تصدیق کر دی۔ مرحلہ 2 تشخیص پیش خدمت ہے:'
                        : 'Lobed dentate margin & glandular trichomes verified. Stage 2 pathology diagnosis ready:'}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-emerald-800 flex items-center gap-3">
                  <span>✓ {isUrdu ? 'دندانے دار کنارے' : 'Dentate Margins'}</span>
                  <span>✓ {isUrdu ? 'مخصوص کلوروفل' : 'Chloroplast Index'}</span>
                </div>
              </div>

              {/* MAIN STAGE 2 DIAGNOSTIC DASHBOARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Scanned Image with Highlighted Spots */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="relative rounded-3xl overflow-hidden border border-[#cbdcd0] bg-[#fcfbf9] aspect-square shadow-sm">
                    <img
                      src={diagnosticResult.imageUri}
                      alt={`Analyzed tomato leaf showing ${diagnosticResult.diseaseName}`}
                      decoding="async"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Laser Line */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-[bounce_3s_infinite]" />
                    </div>

                    {/* Detected Spots */}
                    {diagnosticResult.detectedLesions.map((box, i) => (
                      <div
                        key={i}
                        className="absolute border-2 border-amber-500 bg-amber-400/20 rounded-md"
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`
                        }}
                      >
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white text-amber-900 border border-amber-400 font-semibold shadow-sm whitespace-nowrap">
                          {box.label}
                        </div>
                      </div>
                    ))}

                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl text-xs bg-white/90 backdrop-blur-md text-emerald-950 border border-emerald-200 font-medium flex items-center gap-1.5 shadow-sm">
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>
                        {isUrdu
                          ? `${diagnosticResult.detectedLesions.length} متاثرہ مقامات نشان زد`
                          : `${diagnosticResult.detectedLesions.length} Problem Spots Mapped`}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] flex items-center justify-between text-xs text-[#3d5947]">
                    <span>
                      {isUrdu ? 'تجزیاتی رفتار: ' : 'Checked in: '}
                      <strong className="text-[#13281c]">{diagnosticResult.processingTimeMs}ms</strong>
                    </span>
                    <span>
                      {isUrdu ? 'حالت: ' : 'Status: '}
                      <strong className="text-emerald-700">{isUrdu ? 'مکمل' : 'Complete'}</strong>
                    </span>
                  </div>
                </div>

                {/* Right: Plain English / Urdu Results & Easy Treatment Plan */}
                <div className="lg:col-span-7 flex flex-col gap-5 text-left">
                  {/* Diagnosis Headline */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-800 mb-1">
                        <span>{isUrdu ? 'مرحلہ 2: تشخیص' : 'STAGE 2: PATHOLOGY FOUND'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase">{diagnosticResult.pathogenType}</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c]">
                        {isUrdu
                          ? getUrduDiseaseName(diagnosticResult.diseaseId, diagnosticResult.diseaseName)
                          : diagnosticResult.diseaseName}
                      </h3>
                      <div className="text-xs text-[#3d5947] italic mt-0.5">
                        {isUrdu ? 'سائنسی نام: ' : 'Scientific: '}
                        {diagnosticResult.scientificName}
                      </div>
                    </div>

                    {/* Confidence & Severity */}
                    <div className="flex items-center gap-4 bg-[#f4f7f5] px-4 py-2 rounded-2xl border border-[#cbdcd0]">
                      <div>
                        <div className="text-[10px] font-mono text-[#3d5947]">
                          {isUrdu ? 'شرحِ یقین' : 'CERTAINTY'}
                        </div>
                        <div className="font-mono text-xl font-bold text-emerald-700">
                          {diagnosticResult.confidence}%
                        </div>
                      </div>

                      <div className="h-7 w-px bg-[#cbdcd0]" />

                      <div>
                        <div className="text-[10px] font-mono text-[#3d5947]">
                          {isUrdu ? 'شدت' : 'STAGE'}
                        </div>
                        <div
                          className={`font-mono text-sm font-bold uppercase ${
                            diagnosticResult.severity === 'Severe'
                              ? 'text-rose-600'
                              : diagnosticResult.severity === 'Moderate'
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {diagnosticResult.severity}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box with Audio Voice Reader Button */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#edf5ef] border border-emerald-300/80 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="font-bold text-xs uppercase tracking-wide text-emerald-950 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>{isUrdu ? 'پودے کی حالت کا خلاصہ' : 'PLANT HEALTH SUMMARY'}</span>
                      </div>

                      {/* Farmer Voice Guidance Button (Web Speech & Native Urdu Audio) */}
                      <button
                        onClick={handleToggleAudio}
                        type="button"
                        disabled={isAudioLoading}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                          isAudioPlaying
                            ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                            : isAudioLoading
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300'
                        }`}
                        title={isUrdu ? 'آواز میں رہنمائی سنیں' : 'Listen to Spoken Advisory'}
                      >
                        {isAudioLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
                            <span>{isUrdu ? 'آواز تیار ہو رہی ہے...' : 'Generating Audio...'}</span>
                          </>
                        ) : isAudioPlaying ? (
                          <>
                            <VolumeX className="w-4 h-4 text-emerald-200" />
                            <span>{isUrdu ? 'آواز بند کریں' : 'Stop Audio'}</span>
                            <span className="flex items-center gap-0.5 ml-1">
                              <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                              <span className="w-1 h-4 bg-white rounded-full animate-bounce" />
                              <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-emerald-700" />
                            <span>{isUrdu ? 'اردو آواز سنیں' : 'Listen (Audio)'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-[#13281c] leading-relaxed">
                      {diagnosticResult.summary}
                    </p>
                  </div>

                  {/* Smart Soil Sensor Context Insights (when Moisture or pH sensor is enabled) */}
                  {diagnosticResult.sensorInsights && (
                    <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#13281c]">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            {isUrdu
                              ? 'مٹی کے ورچوئل سینسر کا تشخیصی تجزیہ'
                              : 'Smart Soil Sensor Context'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tabular-nums text-[#3d5947]">
                          {diagnosticResult.sensorInsights.moistureEnabled && (
                            <span>
                              {isUrdu ? 'نمی' : 'Moisture'}:{' '}
                              <strong className="text-[#13281c]">
                                {diagnosticResult.sensorInsights.moisturePercent}% VWC
                              </strong>
                            </span>
                          )}
                          {diagnosticResult.sensorInsights.moistureEnabled &&
                            diagnosticResult.sensorInsights.phEnabled && (
                              <span aria-hidden="true">·</span>
                            )}
                          {diagnosticResult.sensorInsights.phEnabled && (
                            <span>
                              {isUrdu ? 'پی ایچ' : 'Soil pH'}:{' '}
                              <strong className="text-[#13281c]">
                                {diagnosticResult.sensorInsights.soilPh?.toFixed(1)}
                              </strong>
                            </span>
                          )}
                          <span aria-hidden="true">·</span>
                          <span
                            className={`font-bold ${
                              diagnosticResult.sensorInsights.riskLevel === 'Critical'
                                ? 'text-rose-700'
                                : diagnosticResult.sensorInsights.riskLevel === 'Elevated'
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {diagnosticResult.sensorInsights.riskLevel}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#3d5947] leading-relaxed">
                        {isUrdu
                          ? diagnosticResult.sensorInsights.urduContextSummary
                          : diagnosticResult.sensorInsights.contextSummary}
                      </p>

                      <div className="pt-2 border-t border-[#cbdcd0]/60 text-xs text-[#13281c] leading-relaxed">
                        <strong className="font-semibold text-emerald-900">
                          {isUrdu ? 'جڑوں اور مٹی کی اصلاح: ' : 'Sensor-Guided Soil Care: '}
                        </strong>
                        {isUrdu
                          ? diagnosticResult.sensorInsights.urduAgronomicAdjustment
                          : diagnosticResult.sensorInsights.agronomicAdjustment}
                      </div>
                    </div>
                  )}

                  {/* Key Observations */}
                  <div className="space-y-2">
                    <div className="font-display text-xs font-bold uppercase tracking-wider text-[#3d5947]">
                      {isUrdu ? 'اسکینر کے اہم مشاہدات' : 'WHAT THE SCANNER NOTICED'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {diagnosticResult.keyObservations.map((obs, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#fcfbf9] border border-[#cbdcd0] text-xs text-[#3d5947] flex items-start gap-2"
                        >
                          <span className="text-emerald-600 font-bold text-sm leading-none">•</span>
                          <span>{obs}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Plan Grid */}
                  <div className="space-y-2">
                    <div className="font-display text-xs font-bold uppercase tracking-wider text-[#3d5947]">
                      {isUrdu ? 'آسان قدرتی علاج اور حفاظتی اقدامات' : 'EASY RECOVERY & CARE PLAN'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Organic Remedy */}
                      <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[#13281c] mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{isUrdu ? '1. قدرتی علاج (Organic)' : '1. Organic Treatment'}</span>
                          </div>
                          <ul className="text-xs text-[#3d5947] space-y-1 mt-2 list-disc list-inside">
                            {diagnosticResult.treatment.organic.slice(0, 2).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cultural & Preventive Care */}
                      <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[#13281c] mb-1">
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                            <span>{isUrdu ? '2. پانی اور ہوا کی دیکھ بھال' : '2. Water & Sunlight Care'}</span>
                          </div>
                          <ul className="text-xs text-[#3d5947] space-y-1 mt-2 list-disc list-inside">
                            {diagnosticResult.treatment.cultural.slice(0, 2).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Field Recovery Roadmap */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#cbdcd0] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-xs font-bold uppercase tracking-wider text-[#13281c] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        <span>{isUrdu ? '7 روزہ کسان بحالی شیڈول' : '7-DAY FIELD RECOVERY ROADMAP'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        {isUrdu ? 'مرحلہ وار شیڈول' : 'Recovery Steps'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0]/80">
                        <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                          {isUrdu ? 'پہلا دن' : 'Day 01'}
                        </div>
                        <div className="font-bold text-xs text-[#13281c] mt-0.5">
                          {isUrdu ? 'نامیاتی اسپرے' : 'Targeted Spray'}
                        </div>
                        <p className="text-[11px] text-[#3d5947] mt-1 leading-snug">
                          {isUrdu
                            ? 'شام کے وقت نیم کا تیل یا تانبے کا مرکب اسپرے کریں۔'
                            : 'Apply organic copper or neem extract in early evening to stop spores.'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0]/80">
                        <div className="text-[10px] font-mono font-bold text-amber-800 uppercase">
                          {isUrdu ? 'تیسرا دن' : 'Day 03'}
                        </div>
                        <div className="font-bold text-xs text-[#13281c] mt-0.5">
                          {isUrdu ? 'جھلسے ہوئے پتے تلف' : 'Sanitation Pruning'}
                        </div>
                        <p className="text-[11px] text-[#3d5947] mt-1 leading-snug">
                          {isUrdu
                            ? 'زیریں حصے کے شدید متاثرہ پتے کاٹ کر کھیت سے دور دفن کریں۔'
                            : 'Prune severely infected lower leaves and bury far from field.'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0]/80">
                        <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                          {isUrdu ? 'ساتواں دن' : 'Day 07'}
                        </div>
                        <div className="font-bold text-xs text-[#13281c] mt-0.5">
                          {isUrdu ? 'نئی شاخوں کی نگہداشت' : 'Shoot Regeneration'}
                        </div>
                        <p className="text-[11px] text-[#3d5947] mt-1 leading-snug">
                          {isUrdu
                            ? 'پودے کے اوپری سرے پر تازہ، سبز نئی کونپلوں کی تصدیق کریں۔'
                            : 'Inspect apical foliage for clean, vigorous green growth.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleDownloadReport}
                        className="px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#bbf7d0]" />
                        <span>{isUrdu ? 'رپورٹ ڈاؤنلوڈ کریں' : 'Download Report'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl border border-[#cbdcd0] hover:bg-[#edf5ef] text-xs font-medium text-[#13281c] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{t.scanner.printReportBtn}</span>
                      </button>

                      {/* Google Chat Outbreak Alert Button */}
                      <button
                        type="button"
                        onClick={() => setIsChatModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-950 transition-all flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                        title={isUrdu ? 'گوگل چیٹ پر رپورٹ بھیجیں' : 'Send Alert to Google Chat Space'}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{isUrdu ? 'گوگل چیٹ پر بھیجیں' : 'Share to Google Chat'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveInputTab('samples');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.scanner.testAnotherBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Field Video Guide Modal (loaded on demand when opened) */}
      {isVideoModalOpen && (
        <Suspense fallback={null}>
          <VideoTutorialModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Google Chat Outbreak Share Modal (loads Firebase Auth only when clicked) */}
      {diagnosticResult && isChatModalOpen && (
        <Suspense fallback={null}>
          <GoogleChatShareModal
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
            result={diagnosticResult}
          />
        </Suspense>
      )}

      {/* Print-Friendly CSS PDF Export Template Portal (Always ready for Download Report) */}
      {diagnosticResult && !isPrintModalOpen && (
        <PrintableDiagnosticReport result={diagnosticResult} />
      )}

      {/* Official Diagnostic Pathology Certificate Card Print Modal */}
      {diagnosticResult && isPrintModalOpen && (
        <Suspense fallback={null}>
          <DiagnosticPrintModal
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            result={diagnosticResult}
          />
        </Suspense>
      )}
    </section>
  );
};
