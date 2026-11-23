import React from 'react';
import {
  Droplets,
  FlaskConical,
  RotateCcw,
  ScanLine,
  SlidersHorizontal
} from 'lucide-react';
import { FieldSensorPreset, useSensors } from '../context/SensorContext';
import { useLanguage } from '../context/LanguageContext';
import { BotanicalBranchesOverlay } from './BotanicalBranchesOverlay';

interface SmartSensorSectionProps {
  onScanClick?: () => void;
}

export const SmartSensorSection: React.FC<SmartSensorSectionProps> = ({ onScanClick }) => {
  const { isUrdu, t } = useLanguage();
  const {
    moistureEnabled,
    toggleMoisture,
    moisturePercent,
    setMoisturePercent,
    phEnabled,
    togglePh,
    soilPh,
    setSoilPh,
    applyPreset,
    resetSensors,
    activeSensorCount
  } = useSensors();

  const moistureState =
    moisturePercent >= 75
      ? {
          status: isUrdu ? 'زیادہ نمی (خطرہ)' : 'Saturated',
          tone: 'text-rose-700',
          barColor: 'bg-rose-600',
          note: isUrdu
            ? 'جڑوں کے گرد اضافی نمی ارلی اور لیٹ بلائیٹ فنگس کے خطرے کو بڑھا دیتی ہے۔'
            : 'Excess root-zone water speeds up Phytophthora and Alternaria fungal spore spread.'
        }
      : moisturePercent <= 35
      ? {
          status: isUrdu ? 'خشک مٹی' : 'Dry Deficit',
          tone: 'text-amber-700',
          barColor: 'bg-amber-500',
          note: isUrdu
            ? 'خشک مٹی سے پتے مرجھا سکتے ہیں اور غذائی کمی کی علامات بیماری جیسی لگ سکتی ہیں۔'
            : 'Moisture deficit can induce wilting or margin curl that resembles early vascular stress.'
        }
      : {
          status: isUrdu ? 'متوازن نمی' : 'Optimal Range',
          tone: 'text-emerald-700',
          barColor: 'bg-emerald-600',
          note: isUrdu
            ? '45% تا 68% نمی ٹماٹر کی جڑوں کی مضبوط نشوونما کے لیے موزوں ہے۔'
            : 'Balanced 45–68% volumetric water content supports steady root uptake without spore splash.'
        };

  const phState =
    soilPh < 5.8
      ? {
          status: isUrdu ? 'تیزابی مٹی' : 'Acidic Soil',
          tone: 'text-amber-700',
          markerPercent: ((soilPh - 4.5) / 4.0) * 100,
          note: isUrdu
            ? 'کم پی ایچ کیلشیم کے جذب کو روکتا ہے جس سے پتے دھبوں اور بیکٹیریا کے لیے کمزور ہو جاتے ہیں۔'
            : 'Low pH limits calcium absorption, weakening leaf cell walls against bacterial and blight lesions.'
        }
      : soilPh > 7.3
      ? {
          status: isUrdu ? 'الکلین مٹی' : 'Alkaline Soil',
          tone: 'text-rose-700',
          markerPercent: ((soilPh - 4.5) / 4.0) * 100,
          note: isUrdu
            ? 'زیادہ پی ایچ لوہے کی کمی پیدا کر کے پتوں کو پیلا کرتا ہے جو وائرس جیسا لگ سکتا ہے۔'
            : 'High pH locks out iron and manganese, triggering interveinal yellowing similar to viral curl.'
        }
      : {
          status: isUrdu ? 'مثالی پی ایچ' : 'Optimal pH',
          tone: 'text-emerald-700',
          markerPercent: ((soilPh - 4.5) / 4.0) * 100,
          note: isUrdu
            ? '6.0 تا 6.8 پی ایچ ٹماٹر کے پودوں میں مکمل غذائی توازن برقرار رکھتا ہے۔'
            : 'Optimal 6.0–6.8 pH enables complete nitrogen, phosphorus, potassium, and calcium availability.'
        };

  const presets: { id: FieldSensorPreset; label: string }[] = [
    {
      id: 'optimal',
      label: isUrdu ? 'متوازن کھیت' : 'Balanced Field'
    },
    {
      id: 'waterlogged_acidic',
      label: isUrdu ? 'زیادہ پانی اور تیزابی مٹی' : 'Waterlogged & Acidic'
    },
    {
      id: 'drought_alkaline',
      label: isUrdu ? 'خشک اور الکلین مٹی' : 'Dry & Alkaline'
    }
  ];

  const isPresetActive = (id: FieldSensorPreset) => {
    if (!moistureEnabled || !phEnabled) return false;
    if (id === 'optimal') return moisturePercent === 58 && soilPh === 6.4;
    if (id === 'waterlogged_acidic') return moisturePercent === 86 && soilPh === 5.2;
    return moisturePercent === 24 && soilPh === 7.8;
  };

  return (
    <section
      id="smart-sensors"
      className="relative w-full py-16 sm:py-20 bg-[#faf8f2] border-t border-[#cbdcd0] overflow-hidden"
    >
      <BotanicalBranchesOverlay variant="section" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full bg-white border border-[#cbdcd0] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left">
          {/* Header & Presets Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#cbdcd0]/70">
            <div className="max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold mb-1.5">
                {t.sensors.badge}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13281c] tracking-tight text-balance">
                {t.sensors.title}
              </h2>
              <p className="mt-2 text-sm text-[#3d5947] leading-relaxed">
                {t.sensors.subtitle}
              </p>
            </div>

            {/* Interactive Field Condition Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#f4f7f5] rounded-2xl border border-[#cbdcd0] max-w-full overflow-x-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                      isPresetActive(preset.id)
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#3d5947] hover:text-[#13281c]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={resetSensors}
                className="px-3.5 py-2.5 text-xs font-semibold text-[#3d5947] hover:text-[#13281c] bg-[#faf8f2] hover:bg-[#edf5ef] border border-[#cbdcd0] rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                title={isUrdu ? 'سینسرز ری سیٹ کریں' : 'Reset virtual sensors'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ری سیٹ' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* 2-Column Virtual Soil Sensor Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-8">
            {/* Sensor 1: Virtual Soil Moisture Probe */}
            <div
              className={`rounded-2xl p-6 transition-all border ${
                moistureEnabled
                  ? 'bg-[#faf8f2] border-[#cbdcd0]'
                  : 'bg-[#fcfbf9] border-[#cbdcd0]/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      moistureEnabled
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#13281c]">
                      {t.sensors.moistureLabel}
                    </h3>
                    <p className="text-xs text-[#3d5947] mt-0.5">
                      {isUrdu
                        ? 'جڑوں کے زون کی نمی (Volumetric Water Content)'
                        : 'Root-zone volumetric water probe (10% – 95% VWC)'}
                    </p>
                  </div>
                </div>

                {/* Accessible Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={moistureEnabled}
                  aria-label={isUrdu ? 'مٹی کی نمی کا سینسر آن یا آف کریں' : 'Toggle virtual soil moisture sensor'}
                  onClick={toggleMoisture}
                  className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                    moistureEnabled
                      ? 'bg-emerald-600 border-emerald-700'
                      : 'bg-slate-200 border-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      moistureEnabled
                        ? isUrdu
                          ? '-translate-x-6.5'
                          : 'translate-x-6.5'
                        : isUrdu
                        ? '-translate-x-1'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Telemetry Readout & Slider */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-mono tabular-nums text-3xl font-extrabold text-[#13281c]">
                    {moistureEnabled ? `${moisturePercent}%` : '--'}
                    <span className="text-xs font-medium text-[#3d5947] ml-2">VWC</span>
                  </div>
                  <div className={`text-xs font-mono font-bold ${moistureEnabled ? moistureState.tone : 'text-slate-500'}`}>
                    {moistureEnabled
                      ? moistureState.status
                      : isUrdu
                      ? 'سینسر بند ہے'
                      : 'Sensor Disabled'}
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={10}
                    max={95}
                    step={1}
                    disabled={!moistureEnabled}
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(Number(e.target.value))}
                    aria-label={isUrdu ? 'مٹی کی نمی کی سطح' : 'Simulated soil moisture percentage'}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-emerald-700 bg-[#e2ece5] disabled:opacity-45 disabled:cursor-not-allowed"
                  />
                  <div className="w-full h-1.5 rounded-full bg-[#e2ece5] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        moistureEnabled ? moistureState.barColor : 'bg-slate-400'
                      }`}
                      style={{ width: `${moistureEnabled ? moisturePercent : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#3d5947]">
                    <span>{isUrdu ? 'خشک (10%)' : 'Dry 10%'}</span>
                    <span>{isUrdu ? 'مثالی (45–68%)' : 'Optimal 45–68%'}</span>
                    <span>{isUrdu ? 'سیلاب زدہ (95%)' : 'Saturated 95%'}</span>
                  </div>
                </div>

                <p className="pt-3 border-t border-[#cbdcd0]/60 text-xs text-[#3d5947] leading-relaxed">
                  {moistureEnabled
                    ? moistureState.note
                    : isUrdu
                    ? 'جب یہ سینسر بند ہو گا تو تشخیص صرف پتے کی تصویر پر مبنی ہوگی۔'
                    : 'Moisture telemetry is excluded from diagnostic prompts while this sensor is switched off.'}
                </p>
              </div>
            </div>

            {/* Sensor 2: Virtual Soil pH Probe */}
            <div
              className={`rounded-2xl p-6 transition-all border ${
                phEnabled
                  ? 'bg-[#faf8f2] border-[#cbdcd0]'
                  : 'bg-[#fcfbf9] border-[#cbdcd0]/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      phEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#13281c]">
                      {t.sensors.phLabel}
                    </h3>
                    <p className="text-xs text-[#3d5947] mt-0.5">
                      {isUrdu
                        ? 'مٹی کی تیزابیت اور الکلینٹی سینسر (4.5 – 8.5 pH)'
                        : 'Rhizosphere acidity & nutrient availability probe (4.5 – 8.5 pH)'}
                    </p>
                  </div>
                </div>

                {/* Accessible Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={phEnabled}
                  aria-label={isUrdu ? 'مٹی کا پی ایچ سینسر آن یا آف کریں' : 'Toggle virtual soil pH sensor'}
                  onClick={togglePh}
                  className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                    phEnabled
                      ? 'bg-emerald-600 border-emerald-700'
                      : 'bg-slate-200 border-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      phEnabled
                        ? isUrdu
                          ? '-translate-x-6.5'
                          : 'translate-x-6.5'
                        : isUrdu
                        ? '-translate-x-1'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Telemetry Readout & pH Gradient Scale */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-mono tabular-nums text-3xl font-extrabold text-[#13281c]">
                    {phEnabled ? soilPh.toFixed(1) : '--'}
                    <span className="text-xs font-medium text-[#3d5947] ml-2">pH</span>
                  </div>
                  <div className={`text-xs font-mono font-bold ${phEnabled ? phState.tone : 'text-slate-500'}`}>
                    {phEnabled
                      ? phState.status
                      : isUrdu
                      ? 'سینسر بند ہے'
                      : 'Sensor Disabled'}
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={4.5}
                    max={8.5}
                    step={0.1}
                    disabled={!phEnabled}
                    value={soilPh}
                    onChange={(e) => setSoilPh(Number(e.target.value))}
                    aria-label={isUrdu ? 'مٹی کا پی ایچ لیول' : 'Simulated soil pH level'}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-emerald-700 bg-[#e2ece5] disabled:opacity-45 disabled:cursor-not-allowed"
                  />
                  <div className="relative w-full h-1.5 rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-600 opacity-85">
                    {phEnabled && (
                      <div
                        className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#13281c] shadow-xs -translate-x-1/2 transition-all duration-200"
                        style={{ left: `${Math.min(100, Math.max(0, phState.markerPercent))}%` }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#3d5947]">
                    <span>{isUrdu ? 'تیزابی 4.5' : 'Acidic 4.5'}</span>
                    <span>{isUrdu ? 'مثالی 6.0–6.8' : 'Optimal 6.0–6.8'}</span>
                    <span>{isUrdu ? 'الکلین 8.5' : 'Alkaline 8.5'}</span>
                  </div>
                </div>

                <p className="pt-3 border-t border-[#cbdcd0]/60 text-xs text-[#3d5947] leading-relaxed">
                  {phEnabled
                    ? phState.note
                    : isUrdu
                    ? 'پی ایچ سینسر بند ہونے کی صورت میں غذائی کمی اور بیماری کا موازنہ شامل نہیں ہوگا۔'
                    : 'Soil pH telemetry is excluded from diagnostic reasoning while this sensor is switched off.'}
                </p>
              </div>
            </div>
          </div>

          {/* Live Context Sync Banner + Scanner CTA */}
          <div className="pt-6 border-t border-[#cbdcd0]/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-xs text-[#3d5947]">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-[#13281c]">
                  {activeSensorCount > 0
                    ? isUrdu
                      ? `${activeSensorCount} فعال ورچوئل سینسرز تشخیصی سیاق و سباق میں شامل ہیں`
                      : `${activeSensorCount} of 2 virtual root-zone sensors synced with Leaf Scanner`
                    : isUrdu
                    ? 'کوئی سینسر فعال نہیں — اسکینر صرف بصری تجزیہ کرے گا'
                    : 'No virtual sensors active — Leaf Scanner will perform vision-only analysis'}
                </div>
                <div className="font-mono text-[11px] text-[#3d5947] flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>
                    {isUrdu ? 'نمی:' : 'Moisture:'}{' '}
                    <strong className="text-[#13281c]">
                      {moistureEnabled ? `${moisturePercent}% VWC` : isUrdu ? 'بند' : 'OFF'}
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isUrdu ? 'پی ایچ:' : 'Soil pH:'}{' '}
                    <strong className="text-[#13281c]">
                      {phEnabled ? `${soilPh.toFixed(1)} pH` : isUrdu ? 'بند' : 'OFF'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {onScanClick && (
              <button
                type="button"
                onClick={onScanClick}
                className="btn-botanical-sheen w-full md:w-auto px-5 py-3 text-xs font-semibold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
              >
                <ScanLine className="w-4 h-4 text-[#bbf7d0]" />
                <span>{t.sensors.applyAndScanBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
