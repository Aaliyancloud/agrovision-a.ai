import React, { useState } from 'react';
import { Eye, Search, BarChart2, ShieldCheck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ScrollReveal, WordReveal } from './ScrollReveal';
import { XRayComparisonStage } from './XRayComparisonStage';

export const NeuralPipelineSection: React.FC = () => {
  const { t, isUrdu } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);

  const pipelineSteps = [
    {
      step: 1,
      title: isUrdu ? 'مرحلہ 1: پتے کے رنگوں کا جائزہ' : 'Step 1: Check Leaf Colors',
      shortTitle: isUrdu ? 'رنگوں کا جائزہ' : 'Check Leaf Color',
      simpleTag: isUrdu ? 'رنگوں کی شناخت' : 'Color Check',
      icon: Eye,
      description: isUrdu
        ? 'کیمرہ سب سے پہلے پتے کے تمام رنگوں کا تجزیہ کرتا ہے۔ صحت مند پودے کا رنگ گہرا زمردی سبز ہوتا ہے۔ اگر کمپیوٹر ہلکے پیلے یا سیاہ بھورے دھبے دیکھے تو ان حصوں کو نشان زد کر لیتا ہے۔'
        : 'The camera first looks at all the colors across the leaf. A strong plant has rich emerald green. If the computer spots pale yellow circles or dark brown patches, it marks those areas for closer inspection.',
      points: [
        isUrdu ? 'پتے کو پس منظر اور مٹی سے الگ کرتا ہے' : 'Separates the green leaf from background soil or fingers',
        isUrdu ? 'صحت مند سبز اور بیمار پیلے پکسلز کی پیمائش' : 'Measures healthy green vs. sick yellow and brown pixels',
        isUrdu ? 'عام دن کی روشنی میں فوری نتائج' : 'Works instantly under daylight or indoor lamps',
      ],
    },
    {
      step: 2,
      title: isUrdu ? 'مرحلہ 2: دھبوں اور ساخت کی تلاش' : 'Step 2: Find Spots and Shapes',
      shortTitle: isUrdu ? 'دھبوں کی تلاش' : 'Find Spots & Shapes',
      simpleTag: isUrdu ? 'شکل و صورت کا اسکین' : 'Shape Scanner',
      icon: Search,
      description: isUrdu
        ? 'اس کے بعد کمپیوٹر دھبوں کی شکل دیکھتا ہے۔ مختلف بیماریاں مختلف نشان چھوڑتی ہیں: ارلی بلائیٹ کے دھبے دائروں میں ہوتے ہیں جبکہ وائرس پتے کو چمچ کی طرح موڑ دیتا ہے۔'
        : 'Next, the computer examines the shape of the spots. Different plant diseases leave different signatures: Early Blight leaves circular target rings, Septoria leaves tiny dots, and viruses make the leaf curl up like a spoon.',
      points: [
        isUrdu ? 'ہر مشکوک دھبے کے کناروں کی تفصیلی پیمائش' : 'Traces the edges of every suspicious spot',
        isUrdu ? 'گول حلقوں اور پانی کے عام چھینٹوں میں فرق' : 'Identifies concentric rings vs. random water blotches',
        isUrdu ? 'پتے کی باریک رگوں کے ٹیڑھے پن کی جانچ' : 'Checks if leaf veins are straight or distorted',
      ],
    },
    {
      step: 3,
      title: isUrdu ? 'مرحلہ 3: بیماری کی شدت کا تخمینہ' : 'Step 3: Measure the Sickness',
      shortTitle: isUrdu ? 'شدت کی پیمائش' : 'Measure the Sickness',
      simpleTag: isUrdu ? 'نقصان کا تناسب' : 'Damage Gauge',
      icon: BarChart2,
      description: isUrdu
        ? 'کمپیوٹر اندازہ لگاتا ہے کہ پتے کا کتنا فیصد حصہ بیمار ہے۔ اگر صرف 5 فیصد پر دھبے ہوں تو بیماری ابتدائی مرحلے میں ہے۔ اگر 40 فیصد خراب ہو تو فوری بچاؤ کی تدابیر ضروری ہیں۔'
        : 'The computer calculates how much of the leaf has been damaged. If only 5% has spots, the disease is caught in the early stage. If 40% is brown, urgent care is needed to prevent other tomato plants from catching it.',
      points: [
        isUrdu ? 'متاثرہ سطح کے فیصد کا درست حساب' : 'Calculates exact percentage of damaged surface area',
        isUrdu ? 'شدت کی درجہ بندی: ہلکی، درمیانی، یا شدید' : 'Scores severity as Mild, Moderate, or Severe',
        isUrdu ? 'انفیکشن کے آغاز کے مقام کا تعین' : 'Pinpoints where the main infection started',
      ],
    },
    {
      step: 4,
      title: isUrdu ? 'مرحلہ 4: قدرتی اور آسان علاج' : 'Step 4: Give the Healing Plan',
      shortTitle: isUrdu ? 'علاج کا منصوبہ' : 'Give the Healing Plan',
      simpleTag: isUrdu ? 'نسخہ اور احتیاط' : 'Care Prescription',
      icon: ShieldCheck,
      description: isUrdu
        ? 'آخر میں نظام بیماری کو مستند نباتاتی حل سے ملا کر دکھاتا ہے۔ یہ فوری طور پر گھریلو قدرتی علاج (جیسے نیم کا اسپرے یا میٹھا سوڈا)، کٹائی کی ہدایات اور پانی دینے کے اصول بتاتا ہے۔'
        : 'Finally, the system matches the disease with tested botanical recipes. It immediately shows you household organic remedies (like baking soda spray or neem oil), trimming instructions, and watering tips to nurse the plant back to health.',
      points: [
        isUrdu ? 'آسان اور مؤثر گھریلو قدرتی طریقے' : 'Gives easy step-by-step organic remedies',
        isUrdu ? 'متاثرہ پتوں کو کاٹنے کی درست رہنمائی' : 'Explains which leaves should be gently trimmed',
        isUrdu ? 'آئندہ بیماری سے پودے کو محفوظ رکھنے کے مشورے' : 'Offers advice to stop the sickness from coming back',
      ],
    },
  ];

  const currentStep = pipelineSteps[activeStep - 1];

  return (
    <section id="how-ai-sees" className="relative w-full py-20 bg-[#edf5ef]/45 border-t border-[#cbdcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-2">
            {t.pipeline.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13281c] tracking-tight leading-tight text-balance">
            <WordReveal text={t.pipeline.title} stepDelayMs={45} />
          </h2>
          <p className="mt-4 text-[#2f4739] text-base sm:text-lg leading-relaxed">
            {t.pipeline.subtitle}
          </p>
        </ScrollReveal>

        {/* Scroll-Scrubbed X-Ray Comparison */}
        <XRayComparisonStage />

        {/* Clean Modern 4-Step Interactive Process */}
        <div className="bg-white border border-[#cbdcd0] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineSteps.map((s, idx) => {
              const Icon = s.icon;
              const isSelected = activeStep === s.step;

              return (
                <ScrollReveal key={s.step} direction="up" delayMs={40 + idx * 55}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    className={`w-full h-full p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[144px] ${
                      isSelected
                        ? 'border-[#166534] bg-[#edf5ef] shadow-sm'
                        : 'border-[#cbdcd0] bg-[#faf8f2] hover:bg-white hover:border-[#8bb398] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#166534] text-white'
                            : 'bg-white text-[#166534] border border-[#cbdcd0]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono tabular-nums font-bold text-[#166534]">
                        0{s.step}
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#2f4739] mb-1">
                        {s.simpleTag}
                      </div>
                      <div className="font-display font-bold text-base text-[#13281c]">
                        {s.shortTitle}
                      </div>
                    </div>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Selected Step Detail View */}
          <div
            key={currentStep.step}
            className="bg-[#faf8f2] border border-[#cbdcd0] rounded-2xl p-6 sm:p-8 text-left animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  {currentStep.simpleTag} · Step 0{currentStep.step} of 04
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c]">
                  {currentStep.title}
                </h3>
                <p className="text-[15px] text-[#2f4739] leading-[1.7]">
                  {currentStep.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  {currentStep.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-[#2f4739]">
                      <CheckCircle className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#edf5ef] border border-[#cbdcd0] rounded-2xl p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#13281c]">
                  <ShieldCheck className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{isUrdu ? 'آف لائن اور فوری پراسیسنگ' : 'Instant Browser Intelligence'}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#2f4739] leading-relaxed">
                  {isUrdu
                    ? 'یہ پورا تشخیصی عمل سیکنڈ کے دسویں حصے میں براہِ راست آپ کے براؤزر کے اندر مکمل ہو جاتا ہے۔ انٹرنیٹ کے بغیر بھی کسان اور طلبہ اسے باآسانی استعمال کر سکتے ہیں۔'
                    : 'Pre-screening executes directly in your browser in fractions of a second, backed by multimodal AI pathology when connected.'}
                </p>
                <div className="p-3.5 bg-white rounded-xl border border-[#cbdcd0] text-xs font-mono tabular-nums text-[#13281c] font-semibold flex items-center justify-between">
                  <span>{isUrdu ? 'تجزیاتی رفتار:' : 'Pre-Screen Latency:'}</span>
                  <span className="text-[#166534] font-bold">&lt; 350 ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Diagram ("How AgroVision AI Processes a Leaf") */}
        <ScrollReveal direction="up" delayMs={120}>
          <ArchitectureDiagram />
        </ScrollReveal>
      </div>
    </section>
  );
};
