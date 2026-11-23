import React, { useState } from 'react';
import { TOMATO_DISEASES } from '../data/tomatoDiseases';
import { DiseaseInfo, PathogenType } from '../types/disease';
import { Search, Sparkles, Droplets, Thermometer, Wind, Check, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal, WordReveal } from './ScrollReveal';

interface DiseaseLibraryProps {
  onSelectForDiagnosis?: (diseaseId: string) => void;
}

export const DiseaseLibrary: React.FC<DiseaseLibraryProps> = ({ onSelectForDiagnosis }) => {
  const { t, isUrdu } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | PathogenType>('All');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo>(TOMATO_DISEASES[1]);

  const getUrduName = (id: string, def: string) => {
    if (id === 'early_blight') return 'ارلی بلائیٹ (پتوں کا ابتدائی جھلساؤ)';
    if (id === 'late_blight') return 'لیٹ بلائیٹ (پتوں کا شدید جھلساؤ)';
    if (id === 'bacterial_spot') return 'بیکٹیریل اسپاٹ (پتوں کے سیاہ دھبے)';
    if (id === 'yellow_leaf_curl') return 'پیلا پتہ مروڑ وائرس';
    if (id === 'healthy') return 'صحت مند ٹماٹر کا پودا';
    if (id === 'septoria_leaf_spot') return 'سیپٹوریا لیف اسپاٹ (باریک دھبے)';
    if (id === 'spider_mites') return 'دو دھبے والی لال مکڑی';
    if (id === 'target_spot') return 'ٹارگٹ اسپاٹ (حلقہ دار نشان)';
    if (id === 'mosaic_virus') return 'ٹماٹر کا موزیک وائرس';
    if (id === 'leaf_mold') return 'پتوں کی پیلی پھپھوندی (مولڈ)';
    return def;
  };

  const filteredDiseases = TOMATO_DISEASES.filter((d) => {
    const matchesFilter = selectedFilter === 'All' || d.pathogenType === selectedFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.scientificName.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      getUrduName(d.id, d.name).toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const filterTabs: { key: 'All' | PathogenType; label: string }[] = [
    { key: 'All', label: isUrdu ? 'تمام' : 'All' },
    { key: 'Fungal', label: isUrdu ? 'فنگس / پھپھوندی' : 'Fungal' },
    { key: 'Bacterial', label: isUrdu ? 'بیکٹیریا' : 'Bacterial' },
    { key: 'Viral', label: isUrdu ? 'وائرس' : 'Viral' },
    { key: 'Pest', label: isUrdu ? 'کیڑے' : 'Pest' },
    { key: 'Healthy', label: isUrdu ? 'صحت مند پتے' : 'Healthy' },
  ];

  const handleSelectDirectoryCondition = (disease: DiseaseInfo) => {
    setSelectedFilter('All');
    setSearchQuery('');
    setSelectedDisease(disease);
    document.getElementById('library-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section id="care-library" className="relative w-full py-20 bg-[#edf5ef]/45 border-t border-[#cbdcd0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-2">
            {t.library.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13281c] tracking-tight leading-tight text-balance">
            <WordReveal text={t.library.title} stepDelayMs={45} />
          </h2>
          <p className="mt-4 text-[#2f4739] text-base sm:text-lg leading-relaxed">
            {t.library.subtitle}
          </p>
        </ScrollReveal>

        {/* Search & Category Filter Bar */}
        <ScrollReveal
          direction="up"
          delayMs={70}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8"
        >
          {/* Search Box */}
          <div className="relative w-full md:w-88">
            <Search className="w-4 h-4 text-[#166534] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={isUrdu ? 'بیماری یا علامات تلاش کریں...' : 'Search tomato diseases or symptoms...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-[#cbdcd0] text-sm text-[#13281c] placeholder-[#2f4739]/60 focus:outline-none focus:border-[#166534] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2f4739] hover:text-[#13281c] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Category Filter Buttons */}
          <div className="flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-[#cbdcd0] overflow-x-auto max-w-full shadow-xs">
            {filterTabs.map((tab) => {
              const count =
                tab.key === 'All'
                  ? TOMATO_DISEASES.length
                  : TOMATO_DISEASES.filter((d) => d.pathogenType === tab.key).length;
              const isActive = selectedFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'text-[#2f4739] hover:text-[#13281c] hover:bg-[#edf5ef]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      isActive ? 'text-[#bbf7d0]' : 'text-[#2f4739]/75'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* 2-Column Interactive Disease Catalog & Botanical Dossier */}
        <div id="library-inspector" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Micro-Animated Disease List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredDiseases.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-[#cbdcd0] text-sm text-[#2f4739]">
                {isUrdu
                  ? 'کوئی بیماری نہیں ملی۔ کچھ اور لکھ کر دیکھیں۔'
                  : 'No matching plant diseases found. Try typing a different name.'}
              </div>
            ) : (
              filteredDiseases.map((disease, idx) => {
                const isSelected = selectedDisease.id === disease.id;
                const badgeColor =
                  disease.pathogenType === 'Healthy'
                    ? 'text-[#166534]'
                    : disease.pathogenType === 'Viral'
                    ? 'text-[#B45309]'
                    : disease.pathogenType === 'Bacterial'
                    ? 'text-purple-800'
                    : disease.pathogenType === 'Pest'
                    ? 'text-amber-800'
                    : 'text-[#B91C1C]';

                return (
                  <ScrollReveal
                    key={disease.id}
                    direction="left"
                    delayMs={Math.min(idx * 35, 220)}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDisease(disease)}
                      className={`group w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#166534] bg-white shadow-md -translate-y-0.5 ring-2 ring-[#166534]/12'
                          : 'border-[#cbdcd0] bg-[#faf8f2] hover:bg-white hover:border-[#8bb398] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-mono font-semibold mb-1">
                          <span className={badgeColor}>{disease.pathogenType}</span>
                          <span className="text-[#cbdcd0]" aria-hidden="true">·</span>
                          <span className="text-[#2f4739] truncate">{disease.typicalSeverity}</span>
                        </div>
                        <div className="font-display font-bold text-sm sm:text-[15px] text-[#13281c] truncate">
                          {isUrdu ? getUrduName(disease.id, disease.name) : disease.name}
                        </div>
                        <div className="text-xs text-[#2f4739]/85 italic mt-0.5 truncate">
                          {disease.scientificName}
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#166534] text-white translate-x-0.5'
                            : 'bg-[#edf5ef] text-[#2f4739] group-hover:bg-[#dcebe0] group-hover:translate-x-0.5'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  </ScrollReveal>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Disease Dossier with Smooth Transition */}
          <ScrollReveal
            direction="right"
            delayMs={100}
            className="lg:col-span-7 bg-white border border-[#cbdcd0] rounded-3xl p-6 sm:p-8 shadow-sm text-left"
          >
            <div key={selectedDisease.id} className="space-y-6 animate-in fade-in duration-200">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                    {isUrdu ? 'مکمل بیماری کا فائل' : 'Botanical Care File'} · {selectedDisease.pathogenType}
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-[#edf5ef] text-[#13281c] rounded-lg border border-[#cbdcd0]">
                    {selectedDisease.contagionRisk} Spread Risk
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c] tracking-tight">
                  {isUrdu ? getUrduName(selectedDisease.id, selectedDisease.name) : selectedDisease.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#2f4739] italic mt-1">
                  {selectedDisease.scientificName}
                </p>
                <p className="text-[15px] text-[#2f4739] mt-3.5 leading-[1.7]">
                  {selectedDisease.description}
                </p>
              </div>

              {/* Environmental Conditions */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-[#13281c] font-bold mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-[#166534]" />
                    <span>{isUrdu ? 'درجہ حرارت' : 'Temperature'}</span>
                  </div>
                  <div className="text-[#2f4739] leading-relaxed">{selectedDisease.favorableConditions.temperature}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#13281c] font-bold mb-1">
                    <Droplets className="w-3.5 h-3.5 text-[#166534]" />
                    <span>{isUrdu ? 'نمی کا تناسب' : 'Humidity'}</span>
                  </div>
                  <div className="text-[#2f4739] leading-relaxed">{selectedDisease.favorableConditions.humidity}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#13281c] font-bold mb-1">
                    <Wind className="w-3.5 h-3.5 text-[#166534]" />
                    <span>{isUrdu ? 'پھیلاؤ کا ذریعہ' : 'Spread Vector'}</span>
                  </div>
                  <div className="text-[#2f4739] leading-relaxed">{selectedDisease.favorableConditions.spreadVector}</div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-2.5">
                  {isUrdu ? 'اہم ظاہری علامات' : 'Primary Symptoms'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-[13px] text-[#2f4739]">
                  {selectedDisease.primarySymptoms.map((sym, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0]/80 leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment recommendations */}
              <div className="pt-4 border-t border-[#cbdcd0]/80 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  {isUrdu ? 'تجویز کردہ آسان علاج اور نگہداشت' : 'Recommended Organic Care'}
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-[#edf5ef] border border-[#cbdcd0] text-xs sm:text-sm text-[#13281c]">
                  <ul className="space-y-2 list-disc list-inside">
                    {selectedDisease.treatment.organic.map((step, idx) => (
                      <li key={idx} className="leading-[1.65] text-[#2f4739]">
                        <span className="text-[#13281c]">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {onSelectForDiagnosis && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectForDiagnosis(selectedDisease.id)}
                    className="btn-botanical-sheen w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#166534] hover:bg-[#14532d] hover:-translate-y-0.5 active:scale-95 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#bbf7d0]" />
                    <span>{t.library.testThisLeafBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* High-Contrast Crawlable Detection Guide & Model Scope */}
        <ScrollReveal direction="up" threshold={0.04} className="mt-12">
          <article className="bg-white border border-[#cbdcd0] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm text-left space-y-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#cbdcd0] pb-5">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-1.5">
                  {isUrdu ? 'مکمل رہنمائی اور حدود' : 'Detection Guide & Model Scope'}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c] tracking-tight text-balance">
                  <WordReveal
                    text={
                      isUrdu
                        ? 'ایگرو وژن اے آئی: ٹماٹر کے پتوں کی بیماریوں کی شناخت کا مکمل طریقہ'
                        : 'Understanding Tomato Leaf Disease Detection with AgroVision AI'
                    }
                    stepDelayMs={42}
                  />
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold shrink-0">
                <a
                  href="#diagnostic"
                  className="text-[#166534] hover:text-[#13281c] underline underline-offset-4 transition-colors"
                >
                  {isUrdu ? 'لائیو ٹماٹر لیف اسکینر کھولیں' : 'Open Tomato Leaf Scanner'}
                </a>
                <span className="text-[#cbdcd0]" aria-hidden="true">|</span>
                <a
                  href="#how-ai-sees"
                  className="text-[#166534] hover:text-[#13281c] underline underline-offset-4 transition-colors"
                >
                  {isUrdu ? 'اے آئی تجزیہ کا طریقہ دیکھیں' : 'Explore AI Detection Pipeline'}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 text-[15px] text-[#2f4739] leading-[1.72]">
              <div className="space-y-2.5">
                <h4 className="font-display text-base sm:text-lg font-bold text-[#13281c]">
                  {isUrdu
                    ? 'ٹماٹر کے پتوں کی اے آئی شناخت کیسے کام کرتی ہے؟'
                    : 'How AI Tomato Disease Detection Works'}
                </h4>
                <p>
                  {isUrdu
                    ? 'ایگرو وژن اے آئی دو مرحلوں پر مبنی پتوں کے معائنے کا نظام استعمال کرتا ہے۔ پہلے مرحلے میں تصویر میں پودے کے پتے، روشنی کی وضاحت اور ٹماٹر کے پتے کی ظاہری علامات کی جانچ کی جاتی ہے تاکہ غیر متعلقہ یا دھندلی تصاویر پر غلط نتیجہ نہ آئے۔ دوسرے مرحلے میں کمپیوٹر وژن پتے کے رنگ، دھبوں کے کناروں، پیلے حلقوں اور مروڑ کا جائزہ لیتا ہے۔'
                    : 'AgroVision AI applies a two-stage visual inspection workflow for AI plant disease detection. First, it checks whether the submitted photo contains a clear botanical leaf and screens out non-plant scenes, blurry frames, or unrelated species. Once leaf foliage is verified, the analyzer examines surface color shifts, necrotic rings, spots, mottling, and edge curling to classify visible symptoms.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-display text-base sm:text-lg font-bold text-[#13281c]">
                  {isUrdu
                    ? 'تصویر اپلوڈ یا کیمرہ اسکین کرنے کا آسان طریقہ'
                    : 'How to Upload or Capture a Tomato Leaf Image'}
                </h4>
                <p>
                  {isUrdu
                    ? 'بہترین نتائج کے لیے ٹماٹر کے ایک پتے کی صاف تصویر قدرتی روشنی میں لیں، کیمرہ پتے کے قریب رکھیں اور پس منظر سادہ رکھیں۔ آپ ٹماٹر لیف اسکینر میں گیلری سے تصویر اپلوڈ کر سکتے ہیں، موبائل کیمرہ استعمال کر سکتے ہیں یا نمونہ پتوں پر کلک کر کے تجربہ کر سکتے ہیں۔'
                    : 'For reliable tomato leaf disease recognition, photograph a single flat leaflet in even daylight without harsh shadows or motion blur. In the scanner above, you can upload an image file from your phone or computer, capture a live frame with your device camera, or select built-in field specimens to observe how the analyzer responds.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-display text-base sm:text-lg font-bold text-[#13281c]">
                  {isUrdu
                    ? 'نتائج اور اعتماد کے اسکور (Confidence Score) کو کیسے سمجھیں؟'
                    : 'Interpreting Detection Results & Confidence Scores'}
                </h4>
                <p>
                  {isUrdu
                    ? 'نتیجے میں ظاہر ہونے والا اعتماد کا فیصد اس بات کی نشاندہی کرتا ہے کہ پتے کی تصویر میں موجود دھبے اور ساخت ماڈل کی کس درج شدہ حالت سے کتنی مشابہت رکھتے ہیں۔ یہ اسکور تصویر کے معیار اور روشنی کے لحاظ سے بدل سکتا ہے، اس لیے ساتھ دی گئی علامات اور پتے کے متاثرہ حصے کا بھی موازنہ ضرور کریں۔'
                    : 'The confidence score shown beside a result reflects how closely the visual patterns in your leaf photograph align with known tomato disease classes in the model—not a laboratory diagnosis. Compare the suggested primary symptoms, severity indicator, and organic care notes against the actual plant in your garden before acting.'}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-display text-base sm:text-lg font-bold text-[#13281c]">
                  {isUrdu
                    ? 'ابتدائی مراحل میں بیماری کی شناخت کیوں ضروری ہے؟'
                    : 'Why Early Tomato Plant Disease Identification Matters'}
                </h4>
                <p>
                  {isUrdu
                    ? 'ٹماٹر کے پودے میں فنگس یا بیکٹیریا کے حملے اکثر نچلے اور پرانے پتوں سے شروع ہوتے ہیں۔ ابتدائی علامات نظر آتے ہی متاثرہ پتوں کو الگ کرنے، ہوا کی گزرگاہ بہتر بنانے اور مناسب نگہداشت سے بیماری کو تنے اور پھل تک پھیلنے سے روکنے میں مدد ملتی ہے۔'
                    : 'Many fungal, bacterial, and viral tomato conditions appear first on lower or newly emerging leaves before spreading across stems and fruit clusters. Recognizing early leaf spotting, blight water-soaking, or leaf curl allows growers to prune affected foliage promptly, adjust watering at the soil base, and reduce field spread.'}
                </p>
              </div>
            </div>

            {/* Interactive Supported Classes Directory */}
            <div className="pt-5 border-t border-[#cbdcd0]">
              <h4 className="font-display text-base font-bold text-[#13281c] mb-3.5">
                {isUrdu
                  ? 'ماڈل میں شامل ٹماٹر کے پتوں کی 10 حالتیں اور بیماریاں'
                  : 'Supported Tomato Leaf Conditions Recognized by AgroVision AI'}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs text-[#2f4739]">
                {TOMATO_DISEASES.map((disease) => {
                  const isActive = selectedDisease.id === disease.id;
                  return (
                    <li key={disease.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectDirectoryCondition(disease)}
                        className={`w-full text-left p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-[#edf5ef] border-[#166534] shadow-xs'
                            : 'bg-[#faf8f2] border-[#cbdcd0] hover:-translate-y-0.5 hover:border-[#166534]/50 hover:bg-white'
                        }`}
                      >
                        <span className="font-semibold text-[#13281c]">
                          {isUrdu ? getUrduName(disease.id, disease.name) : disease.name}
                        </span>
                        <span className="text-[11px] italic text-[#2f4739] mt-0.5">
                          {disease.scientificName}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Limitations & Informational Advisory Notice */}
            <div className="p-5 rounded-2xl bg-[#edf5ef] border border-[#cbdcd0] text-sm text-[#13281c] leading-[1.7]">
              <strong className="font-bold text-[#166534] block mb-1">
                {isUrdu
                  ? 'اے آئی حدود اور زرعی مشاورتی نوٹ'
                  : 'AI Limitations & Agricultural Advisory Notice'}
              </strong>
              <p className="text-[#2f4739]">
                {isUrdu
                  ? 'کمپیوٹر وژن صرف تصویر کی ظاہری بناوٹ کا تجزیہ کرتا ہے۔ کھاد کی کمی، پانی کا دباؤ، خراب روشنی، دھندلا پن یا ایک ساتھ دو بیماریوں کی علامات تشخیص کو متاثر کر سکتی ہیں۔ ایگرو وژن اے آئی کے نتائج صرف تعلیمی اور ابتدائی معلومات کے لیے ہیں اور یہ کسی مستند ماہرِ زراعت یا لیبارٹری معائنے کا متبادل نہیں ہیں۔'
                  : 'Image-based AI plant disease identification evaluates visible leaf symptoms only and has natural limitations: poor lighting, motion blur, mixed infections, nutrient deficiencies, herbicide drift, or heat stress can look similar to infectious pathogens. All AgroVision AI predictions and care suggestions are strictly informational and educational, and should not replace field evaluation or advice from a qualified agronomist or local agricultural extension service.'}
              </p>
            </div>
          </article>
        </ScrollReveal>
      </div>
    </section>
  );
};
