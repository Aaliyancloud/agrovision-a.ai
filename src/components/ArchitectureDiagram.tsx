import React, { useState } from 'react';
import {
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal, WordReveal } from './ScrollReveal';

export const ArchitectureDiagram: React.FC = () => {
  const { t, isUrdu } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(3);

  const stages = [
    {
      id: 1,
      title: t.architecture.step1Title,
      shortLabel: isUrdu ? '1. فیلڈ ان پٹ' : '1. Field Capture',
      icon: Smartphone,
      desc: t.architecture.step1Desc,
      tech: 'Mobile Web API / Camera API',
    },
    {
      id: 2,
      title: isUrdu
        ? 'مرحلہ 1: نباتاتی تصدیق (ٹماٹر بمقابلہ دیگر پودے)'
        : 'Stage 1: Plant & Species Gatekeeper',
      shortLabel: isUrdu ? '2. نباتاتی فلٹر' : '2. Species Gatekeeper',
      icon: Layers,
      desc: isUrdu
        ? 'پودے کے پتے کی تصدیق کرتا ہے اور آم، نیم یا دیگر غیر ٹماٹر پتوں کو مسترد کر کے غلط تشخیص روکتا ہے۔'
        : 'Verifies leaf morphology (Solanum lycopersicum) and strictly rejects non-tomato leaves (mango, neem) or non-leaf photos.',
      tech: 'Morphological Margin & Trichome Classifier',
    },
    {
      id: 3,
      title: t.architecture.step3Title,
      shortLabel: isUrdu ? '3. روشنی توازن' : '3. Normalization',
      icon: Sparkles,
      desc: t.architecture.step3Desc,
      tech: 'Adaptive Laplacian & Color Normalization',
    },
    {
      id: 4,
      title: isUrdu
        ? 'مرحلہ 2: ٹماٹر کی بیماری کی درجہ بندی'
        : 'Stage 2: Tomato Pathogen Classification',
      shortLabel: isUrdu ? '4. نیورل تشخیص' : '4. Disease Classifier',
      icon: Cpu,
      desc: isUrdu
        ? 'صرف تصدیق شدہ ٹماٹر کے پتے پر فنگل اور بیکٹیریل علامات کا گہرا معائنہ کرتا ہے۔'
        : 'Executes disease classification only after Stage 1 confirms a tomato leaf, analyzing target rings and chlorotic halos.',
      tech: 'Computer Vision Feature Classification',
    },
    {
      id: 5,
      title: t.architecture.step5Title,
      shortLabel: isUrdu ? '5. شدت کی پیمائش' : '5. Risk & Severity',
      icon: Activity,
      desc: t.architecture.step5Desc,
      tech: 'Multi-Class Lesion Mapping & Severity',
    },
    {
      id: 6,
      title: t.architecture.step6Title,
      shortLabel: isUrdu ? '6. قدرتی علاج' : '6. Prescription',
      icon: ShieldCheck,
      desc: t.architecture.step6Desc,
      tech: 'Verified Organic Botanical Protocols',
    },
  ];

  const selectedStage = stages.find((s) => s.id === activeStep) || stages[0];
  const SelectedIcon = selectedStage.icon;

  return (
    <div className="w-full bg-white border border-[#cbdcd0] rounded-3xl p-6 lg:p-8 shadow-sm text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-1">
            {t.architecture.badge}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c]">
            <WordReveal text={t.architecture.title} stepDelayMs={45} />
          </h3>
          <p className="text-xs sm:text-sm text-[#2f4739] mt-1 max-w-2xl leading-relaxed">
            {t.architecture.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf5ef] border border-[#cbdcd0] text-xs font-mono text-[#13281c] font-bold shrink-0">
          <Zap className="w-3.5 h-3.5 text-[#166534] fill-[#166534]" />
          <span>&lt; 350ms In-Browser Pipeline</span>
        </div>
      </div>

      {/* Clean 6-Stage Modern Interactive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-7">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = activeStep === stage.id;

          return (
            <ScrollReveal key={stage.id} direction="up" delayMs={35 + idx * 45}>
              <button
                type="button"
                onClick={() => setActiveStep(stage.id)}
                className={`w-full h-full p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[112px] active:scale-[0.98] cursor-pointer ${
                  isCurrent
                    ? 'border-[#166534] bg-[#edf5ef] shadow-xs'
                    : 'border-[#cbdcd0] bg-[#faf8f2] hover:bg-white hover:border-[#8bb398] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isCurrent
                        ? 'bg-[#166534] text-white'
                        : 'bg-white text-[#166534] border border-[#cbdcd0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] text-[#166534] font-bold">
                    0{stage.id}
                  </span>
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-[#13281c] truncate">
                    {stage.shortLabel}
                  </div>
                  <div className="text-[10px] font-mono text-[#2f4739] truncate mt-0.5">
                    {stage.tech}
                  </div>
                </div>
              </button>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Selected Stage Detail Panel */}
      <div
        key={selectedStage.id}
        className="p-5 sm:p-6 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-in fade-in duration-200"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#166534] text-white flex items-center justify-center shrink-0">
            <SelectedIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-[#166534] font-semibold uppercase mb-1">
              Stage {selectedStage.id} Architecture Detail
            </div>
            <h4 className="font-display text-lg sm:text-xl font-bold text-[#13281c]">
              {selectedStage.title}
            </h4>
            <p className="text-xs sm:text-sm text-[#2f4739] mt-1 leading-relaxed max-w-2xl">
              {selectedStage.desc}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto p-3.5 bg-white rounded-xl border border-[#cbdcd0] text-xs font-mono">
          <span className="text-[#2f4739] block text-[10px]">EXECUTION ENVIRONMENT</span>
          <span className="font-bold text-[#166534]">{selectedStage.tech}</span>
        </div>
      </div>
    </div>
  );
};
