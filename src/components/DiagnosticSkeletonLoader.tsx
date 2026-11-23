import React from 'react';
import { Sparkles, Cpu, Activity, ShieldCheck, Crosshair, Zap, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DiagnosticSkeletonLoaderProps {
  progress: number;
  stepText: string;
  imageUri?: string | null;
}

export const DiagnosticSkeletonLoader: React.FC<DiagnosticSkeletonLoaderProps> = ({
  progress,
  stepText,
  imageUri
}) => {
  const { isUrdu } = useLanguage();

  const isStage1 = progress < 45;
  const isStage2 = progress >= 45 && progress < 85;

  return (
    <div className="w-full mt-6 pt-6 border-t border-[#cbdcd0]/70 animate-in fade-in duration-300">
      {/* Real-time Progress Bar & Step Text */}
      <div className="max-w-3xl mx-auto mb-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-emerald-950 flex items-center gap-2 font-bold tracking-tight">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span>
              {stepText ||
                (isUrdu
                  ? 'اے آئی پتے کا ہولوگرافک معائنہ کر رہا ہے...'
                  : 'Holographic AI Neural Vision analyzing leaf specimen...')}
            </span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              {isStage1
                ? (isUrdu ? 'مرحلہ 1: نباتاتی تصدیق' : 'Stage 1: Foliage Auth')
                : isStage2
                ? (isUrdu ? 'مرحلہ 2: پیتھالوجی اسکیننگ' : 'Stage 2: Pathology Sweep')
                : (isUrdu ? 'مرحلہ 3: تشخیصی ترکیب' : 'Stage 3: Inference Protocol')}
            </span>
            <span className="text-emerald-950 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300 tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* High-Tech Multi-Spectral Progress Track */}
        <div className="w-full h-3.5 rounded-full bg-[#edf5ef] border border-[#cbdcd0] overflow-hidden p-0.5 shadow-inner relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-500 rounded-full transition-all duration-300 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Moving light pulse through progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>

      {/* Holographic Diagnostic Chamber & Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Holographic Leaf Scanner Chamber */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/60 bg-[#0a1811] aspect-square shadow-xl flex items-center justify-center select-none group">
            {/* 1. Underlying Leaf Specimen */}
            {imageUri ? (
              <img
                src={imageUri}
                alt="Specimen under scan"
                className="w-full h-full object-contain filter contrast-105 brightness-95 opacity-85"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0c2419] to-[#06140e] flex items-center justify-center">
                <Cpu className="w-20 h-20 text-emerald-600/40 animate-pulse" />
              </div>
            )}

            {/* 2. Neural Mesh Coordinate Grid Overlay */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none animate-neural-grid"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.3) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* 3. Sweeping Holographic Laser Light Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#06b6d4,0_0_35px_#10b981] animate-laser-sweep pointer-events-none z-20">
              {/* Trailing laser glow sheet */}
              <div className="absolute -top-12 inset-x-0 h-12 bg-gradient-to-t from-cyan-400/25 to-transparent pointer-events-none" />
              <div className="absolute -bottom-12 inset-x-0 h-12 bg-gradient-to-b from-emerald-400/25 to-transparent pointer-events-none" />
            </div>

            {/* 4. Target Crosshair & Corner Bounding Brackets */}
            <div className="absolute inset-4 border border-cyan-500/30 rounded-2xl pointer-events-none z-10">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
            </div>

            {/* 5. Center Diagnostic Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-32 h-32 rounded-full border border-dashed border-emerald-400/40 animate-reticle-spin flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-cyan-400/50 flex items-center justify-center">
                  <Crosshair className="w-8 h-8 text-cyan-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* 6. Dynamic Feature Detection Target Boxes */}
            <div className="absolute top-1/4 left-1/4 w-24 h-20 border-2 border-emerald-400/80 rounded-xl bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse pointer-events-none z-10">
              <span className="absolute -top-3 left-1 px-1 bg-emerald-950 text-emerald-300 text-[8px] font-mono font-bold uppercase rounded border border-emerald-400/50">
                LOBE_LOC_01
              </span>
            </div>

            <div className="absolute bottom-1/3 right-1/4 w-28 h-24 border-2 border-cyan-400/80 rounded-xl bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.5)] animate-pulse delay-150 pointer-events-none z-10">
              <span className="absolute -top-3 left-1 px-1 bg-emerald-950 text-cyan-300 text-[8px] font-mono font-bold uppercase rounded border border-cyan-400/50">
                PATHOLOGY_ROI
              </span>
            </div>

            {/* 7. Floating Telemetry Readout Badges */}
            <div className="absolute top-3 left-3 bg-[#0a1811]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px] font-mono text-emerald-300 z-20 flex items-center gap-1.5 shadow-md">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>CHL: 86.4%</span>
            </div>

            <div className="absolute top-3 right-3 bg-[#0a1811]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/40 text-[10px] font-mono text-cyan-300 z-20 flex items-center gap-1.5 shadow-md">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>ROI: CONCENTRIC</span>
            </div>

            <div className="absolute bottom-3 inset-x-3 bg-[#0a1811]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] font-mono text-emerald-200 z-20 flex items-center justify-between shadow-md">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOLANUM LYCOPERSICUM</span>
              </span>
              <span className="text-cyan-400 font-bold tabular-nums">
                CONF: {Math.min(98.5, 55 + progress * 0.43).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Under-Chamber Telemetry Ribbon */}
          <div className="p-3.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] flex items-center justify-between text-xs font-mono text-[#3d5947]">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <strong className="text-[#13281c]">Optical Layers:</strong> Chlorophyll · Cuticle · Rings
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Neural Scan
            </span>
          </div>
        </div>

        {/* Right Column: Multi-Stage Telemetry Details & Synthesized Report Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-5 text-left">
          {/* Active Diagnostic Status Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-emerald-300/80 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
                  <span>Real-Time Convolutional Feature Mapping</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#13281c]">
                  {progress < 40
                    ? (isUrdu ? 'پتے کی ساخت اور کٹاؤ کی جانچ...' : 'Stage 1: Measuring leaf margin serrations & cuticle gloss...')
                    : progress < 75
                    ? (isUrdu ? 'بیماری کے دھبوں اور علامات کی پیمائش...' : 'Stage 2: Scanning pathological lesions & concentric target rings...')
                    : (isUrdu ? 'سائنسی علاج کا لائحہ عمل تیار کیا جا رہا ہے...' : 'Stage 3: Writing verified recovery protocol & field guidance...')}
                </h3>
                <div className="text-xs text-[#3d5947] font-mono">
                  Penn State & EPFL PlantVillage Neural Benchmark · 54,306 Training Specimens
                </div>
              </div>

              <div className="text-center px-4 py-2 rounded-2xl bg-[#edf5ef] border border-emerald-300 shrink-0">
                <div className="text-[10px] font-mono text-[#3d5947] uppercase font-bold">Latency</div>
                <div className="font-mono text-sm font-bold text-emerald-800 tabular-nums">
                  {(progress * 0.024).toFixed(2)}s
                </div>
              </div>
            </div>

            {/* Neural Stage Pipeline Progress Dots */}
            <div className="pt-3 border-t border-[#cbdcd0]/60 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div
                className={`p-2 rounded-xl border transition-all ${
                  progress >= 10
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                    : 'bg-[#faf8f2] border-[#cbdcd0] text-stone-400'
                }`}
              >
                <div className="text-[10px] text-emerald-700">01. Foliage Auth</div>
                <div className="text-xs mt-0.5">{progress >= 38 ? '✓ Complete' : 'In Progress'}</div>
              </div>

              <div
                className={`p-2 rounded-xl border transition-all ${
                  progress >= 40
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-bold'
                    : 'bg-[#faf8f2] border-[#cbdcd0] text-stone-400'
                }`}
              >
                <div className="text-[10px] text-cyan-700">02. Pathology Scan</div>
                <div className="text-xs mt-0.5">{progress >= 75 ? '✓ Complete' : progress >= 40 ? 'Analyzing' : 'Queued'}</div>
              </div>

              <div
                className={`p-2 rounded-xl border transition-all ${
                  progress >= 75
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                    : 'bg-[#faf8f2] border-[#cbdcd0] text-stone-400'
                }`}
              >
                <div className="text-[10px] text-emerald-700">03. Treatment Plan</div>
                <div className="text-xs mt-0.5">{progress >= 95 ? '✓ Ready' : progress >= 75 ? 'Compiling' : 'Queued'}</div>
              </div>
            </div>
          </div>

          {/* Skeleton Treatment Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                  ✓
                </div>
                <div className="h-4 w-32 bg-emerald-100 rounded-md animate-pulse" />
              </div>
              <div className="h-3 w-full bg-[#edf5ef] rounded-md animate-pulse" />
              <div className="h-3 w-4/5 bg-[#edf5ef] rounded-md animate-pulse" />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#cbdcd0] shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-[#edf5ef] flex items-center justify-center text-[#3d5947] text-xs font-bold">
                  🌱
                </div>
                <div className="h-4 w-32 bg-[#e2ede5] rounded-md animate-pulse" />
              </div>
              <div className="h-3 w-full bg-[#edf5ef] rounded-md animate-pulse" />
              <div className="h-3 w-3/4 bg-[#edf5ef] rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
