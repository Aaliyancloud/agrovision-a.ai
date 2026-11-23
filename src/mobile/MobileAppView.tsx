import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardList,
  Download,
  Droplets,
  ExternalLink,
  FlaskConical,
  Globe,
  Home,
  Leaf,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSensors } from '../context/SensorContext';
import { useScanHistory, ScanHistoryEntry } from '../context/ScanHistoryContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WeatherAlertCard } from '../components/WeatherAlertCard';
import { SmartSensorSection } from '../components/SmartSensorSection';
import { DiseaseLibrary } from '../components/DiseaseLibrary';
import { DiagnosticStudio, DiagnosticExternalAction } from '../components/DiagnosticStudio';

export type MobileAppTab = 'home' | 'scan' | 'care' | 'history';

interface MobileAppViewProps {
  initialTab?: MobileAppTab;
  initialAction?: 'camera' | null;
  onExitToWebsite: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  initialTab = 'home',
  initialAction = null,
  onExitToWebsite
}) => {
  const { isUrdu, toggleLanguage } = useLanguage();
  const { moistureEnabled, moisturePercent, phEnabled, soilPh } = useSensors();
  const { scans, removeScan, clearScans } = useScanHistory();
  const isOnline = useOnlineStatus();

  const [activeTab, setActiveTab] = useState<MobileAppTab>(
    initialAction === 'camera' ? 'scan' : initialTab
  );
  const [selectedScan, setSelectedScan] = useState<ScanHistoryEntry | null>(null);
  const nonceRef = useRef(1);
  const [diagnosticAction, setDiagnosticAction] = useState<DiagnosticExternalAction | null>(() =>
    initialAction === 'camera' ? { type: 'camera', nonce: 1 } : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const launchCameraScan = () => {
    nonceRef.current += 1;
    setDiagnosticAction({ type: 'camera', nonce: nonceRef.current });
    setActiveTab('scan');
  };

  const handleUploadPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      nonceRef.current += 1;
      setDiagnosticAction({ type: 'upload', file, nonce: nonceRef.current });
      setActiveTab('scan');
    }
    e.target.value = '';
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(isUrdu ? 'ur-PK' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const handleExportLog = () => {
    if (scans.length === 0) return;
    const blob = new Blob([JSON.stringify(scans, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrovision-field-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeEntry =
    selectedScan && scans.some((s) => s.id === selectedScan.id) ? selectedScan : scans[0] ?? null;

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#faf8f2] text-[#13281c] flex flex-col font-sans ${
        isUrdu ? 'font-urdu' : ''
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        onChange={handleUploadPick}
        className="hidden"
        aria-label={isUrdu ? 'ٹماٹر کے پتے کی تصویر منتخب کریں' : 'Upload leaf image'}
      />

      {/* Native-Style App Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#faf8f2]/95 backdrop-blur-lg border-b border-[#cbdcd0] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#166534] text-white flex items-center justify-center shadow-xs shrink-0">
              <Leaf className="w-4.5 h-4.5 text-[#bbf7d0]" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm sm:text-base font-bold text-[#13281c] truncate flex items-center gap-1.5">
                <span>{isUrdu ? 'ایگرو وژن ایپ' : 'AgroVision AI'}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#edf5ef] border border-[#cbdcd0] text-[10px] font-mono text-[#166534]">
                  APP
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#3d5947]">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{isUrdu ? 'آن لائن + آف لائن محفوظ' : 'Online · Offline Ready'}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{isUrdu ? 'آف لائن فیلڈ موڈ' : 'Offline Field Mode'}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#edf5ef] border border-[#cbdcd0] text-xs font-bold text-[#13281c] cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#166534]" />
              <span>{isUrdu ? 'EN' : 'اردو'}</span>
            </button>

            <a
              href="/downloads/AgroVision-AI-Android-App.zip"
              download="AgroVision-AI-Android-App.zip"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#bbf7d0]" />
              <span>{isUrdu ? 'اینڈرائیڈ پروجیکٹ (.zip)' : 'Android App (.zip)'}</span>
            </a>

            <button
              type="button"
              onClick={onExitToWebsite}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#edf5ef] border border-[#cbdcd0] text-xs font-semibold text-[#13281c] cursor-pointer"
              title={isUrdu ? 'مکمل ویب سائٹ دیکھیں' : 'Open Full Website'}
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#166534]" />
              <span className="hidden xs:inline">{isUrdu ? 'ویب سائٹ' : 'Website'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-5">
            {/* Primary App Scanner Card */}
            <section className="rounded-3xl bg-white border border-[#cbdcd0] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#166534]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'فوری پتا تشخیص' : 'Quick Field Scanner'}</span>
                </div>
                <span className="text-[11px] font-mono text-[#3d5947]">
                  Solanum lycopersicum
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#13281c] leading-tight">
                {isUrdu
                  ? 'ٹماٹر کے پتے اسکین کریں اور فوری علاج پائیں'
                  : 'Scan Tomato Leaves Anywhere, Even Offline'}
              </h1>

              <p className="text-sm text-[#2f4739] leading-relaxed">
                {isUrdu
                  ? 'کیمرہ کھولیں یا گیلری سے تصویر منتخب کریں — دو مرحلہ جاتی اے آئی بیماری کی شناخت، مٹی کے سینسر کی مطابقت اور نامیاتی علاج تیار کرتی ہے۔'
                  : 'Use your phone camera or gallery photo to verify tomato foliage, detect 10+ diseases, factor soil moisture & pH, and save field reports offline.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={launchCameraScan}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#166534] hover:bg-[#14532d] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <Camera className="w-4.5 h-4.5 text-[#bbf7d0]" />
                  <span>{isUrdu ? 'لائیو کیمرہ اسکین' : 'Open Camera Scanner'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[#edf5ef] hover:bg-emerald-100 text-[#13281c] border border-[#cbdcd0] font-bold text-sm active:scale-98 transition-all cursor-pointer"
                >
                  <Upload className="w-4.5 h-4.5 text-[#166534]" />
                  <span>{isUrdu ? 'گیلری سے تصویر لیں' : 'Upload Leaf Photo'}</span>
                </button>
              </div>
            </section>

            {/* Quick Telemetry & Field Status Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className="p-4 rounded-2xl bg-white border border-[#cbdcd0] text-left hover:border-[#166534] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[#166534] mb-1.5">
                  <Droplets className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase">
                    {moistureEnabled ? 'LIVE' : 'OFF'}
                  </span>
                </div>
                <div className="font-mono text-xl font-bold text-[#13281c]">{moisturePercent}%</div>
                <div className="text-[11px] text-[#3d5947]">
                  {isUrdu ? 'مٹی کی نمی' : 'Soil Moisture'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className="p-4 rounded-2xl bg-white border border-[#cbdcd0] text-left hover:border-[#166534] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[#166534] mb-1.5">
                  <FlaskConical className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase">{phEnabled ? 'LIVE' : 'OFF'}</span>
                </div>
                <div className="font-mono text-xl font-bold text-[#13281c]">
                  {soilPh.toFixed(1)}
                </div>
                <div className="text-[11px] text-[#3d5947]">
                  {isUrdu ? 'مٹی کا پی ایچ' : 'Soil pH'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="p-4 rounded-2xl bg-white border border-[#cbdcd0] text-left hover:border-[#166534] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[#166534] mb-1.5">
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase">OFFLINE</span>
                </div>
                <div className="font-mono text-xl font-bold text-[#13281c]">{scans.length}</div>
                <div className="text-[11px] text-[#3d5947]">
                  {isUrdu ? 'محفوظ اسکین' : 'Saved Scans'}
                </div>
              </button>

              <a
                href="/downloads/AgroVision-AI-Android-App.zip"
                download="AgroVision-AI-Android-App.zip"
                className="p-4 rounded-2xl bg-[#edf5ef] border border-[#cbdcd0] text-left hover:border-[#166534] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[#166534] mb-1.5">
                  <Download className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase">APK SRC</span>
                </div>
                <div className="font-display text-sm font-bold text-[#13281c]">
                  {isUrdu ? 'اینڈرائیڈ ایپ' : 'Android Zip'}
                </div>
                <div className="text-[11px] text-[#3d5947]">
                  {isUrdu ? 'فائل ڈاؤنلوڈ کریں' : 'Download Project'}
                </div>
              </a>
            </div>

            {/* Microclimate Weather Alert Card */}
            <WeatherAlertCard />
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="rounded-3xl overflow-hidden border border-[#cbdcd0] bg-[#f4f1e8]">
            <DiagnosticStudio
              externalAction={diagnosticAction}
              onExternalActionHandled={() => setDiagnosticAction(null)}
            />
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#cbdcd0]">
              <SmartSensorSection onScanClick={() => setActiveTab('scan')} />
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#cbdcd0]">
              <DiseaseLibrary onSelectForDiagnosis={() => setActiveTab('scan')} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <section className="rounded-3xl bg-white border border-[#cbdcd0] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#cbdcd0]">
              <div>
                <h2 className="font-display text-xl font-bold text-[#13281c]">
                  {isUrdu ? 'فیلڈ اسکین ریکارڈ' : 'Field Scan Log'}
                </h2>
                <p className="text-xs text-[#3d5947]">
                  {isUrdu
                    ? 'ہر تشخیص خودکار طور پر آپ کے ڈیوائس میں آف لائن محفوظ ہوتی ہے۔'
                    : 'All scans & soil telemetry snapshots are stored locally on your device.'}
                </p>
              </div>
              {scans.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportLog}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf5ef] hover:bg-emerald-100 border border-[#cbdcd0] text-xs font-semibold text-[#14532d] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'ایکسپورٹ' : 'Export JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearScans}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'سب صاف' : 'Clear'}</span>
                  </button>
                </div>
              )}
            </div>

            {scans.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#edf5ef] border border-[#cbdcd0] flex items-center justify-center text-[#166534]">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <p className="text-sm text-[#3d5947] max-w-sm">
                  {isUrdu
                    ? 'ابھی تک کوئی اسکین محفوظ نہیں ہے۔ اسکین ٹیب سے اپنا پہلا پتہ چیک کریں۔'
                    : 'No scans saved yet. Capture or upload a tomato leaf to build your offline field log.'}
                </p>
                <button
                  type="button"
                  onClick={launchCameraScan}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#bbf7d0]" />
                  <span>{isUrdu ? 'اسکین شروع کریں' : 'Start First Scan'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {scans.map((entry) => {
                    const isActive = activeEntry?.id === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedScan(entry)}
                        className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-[#edf5ef] border-[#166534]'
                            : 'bg-[#faf8f2] border-[#cbdcd0] hover:bg-white'
                        }`}
                      >
                        <img
                          src={entry.thumbnailUrl}
                          alt={entry.diseaseName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#cbdcd0] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-[#13281c] truncate">
                              {entry.diseaseName}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#166534] shrink-0">
                              {entry.confidence}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1 text-[10px] text-[#3d5947]">
                            <span className="uppercase font-mono">{entry.source}</span>
                            <span>{formatDate(entry.createdAt)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {activeEntry && (
                  <div className="md:col-span-7 bg-[#faf8f2] border border-[#cbdcd0] rounded-2xl p-4 space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeEntry.thumbnailUrl}
                          alt={activeEntry.diseaseName}
                          className="w-16 h-16 rounded-2xl object-cover border border-[#cbdcd0] shrink-0"
                        />
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#166534]">
                            {activeEntry.isTomatoLeaf ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span>{formatDate(activeEntry.createdAt)}</span>
                          </div>
                          <h3 className="font-display text-base font-bold text-[#13281c]">
                            {activeEntry.diseaseName}
                          </h3>
                          <p className="text-xs italic text-[#3d5947]">{activeEntry.scientificName}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScan(activeEntry.id)}
                        className="p-1.5 rounded-lg text-[#3d5947] hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#2f4739] leading-relaxed bg-white p-3 rounded-xl border border-[#cbdcd0]">
                      {activeEntry.summary}
                    </p>

                    {activeEntry.organicTreatment.length > 0 && (
                      <ul className="text-xs text-[#2f4739] space-y-1 list-disc list-inside bg-white p-3 rounded-xl border border-[#cbdcd0]">
                        {activeEntry.organicTreatment.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Fixed Bottom App Navigation Dock */}
      <nav
        aria-label={isUrdu ? 'ایپ نیویگیشن' : 'App Navigation'}
        className="fixed bottom-0 inset-x-0 z-50 bg-[#faf8f2]/95 backdrop-blur-xl border-t border-[#cbdcd0] shadow-[0_-8px_28px_rgba(19,40,28,0.1)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="max-w-lg mx-auto px-2 h-16 grid grid-cols-4 items-center">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'home' ? 'text-[#166534] font-bold' : 'text-[#3d5947]'
            }`}
          >
            <Home className="w-4.5 h-4.5" />
            <span className="text-[10px] leading-none">{isUrdu ? 'ہوم' : 'Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'scan' ? 'text-[#166534] font-bold' : 'text-[#3d5947]'
            }`}
          >
            <Camera className="w-4.5 h-4.5" />
            <span className="text-[10px] leading-none">{isUrdu ? 'اسکینر' : 'Scanner'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'care' ? 'text-[#166534] font-bold' : 'text-[#3d5947]'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span className="text-[10px] leading-none">
              {isUrdu ? 'سینسر و نگہداشت' : 'Care & Sensors'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl cursor-pointer ${
              activeTab === 'history' ? 'text-[#166534] font-bold' : 'text-[#3d5947]'
            }`}
          >
            <div className="relative">
              <ClipboardList className="w-4.5 h-4.5" />
              {scans.length > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[#166534] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {scans.length > 9 ? '9+' : scans.length}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-none">{isUrdu ? 'ریکارڈ' : 'Field Log'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
