import React, { useState } from 'react';
import { LeafScannerCanvas, LeafConditionMode } from './3d/LeafScannerCanvas';
import { Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal, WordReveal } from './ScrollReveal';

interface LeafAnatomySectionProps {
  onScanClick?: () => void;
}

export const LeafAnatomySection: React.FC<LeafAnatomySectionProps> = ({ onScanClick }) => {
  const { t, isUrdu } = useLanguage();
  const [selectedCondition, setSelectedCondition] = useState<LeafConditionMode>('early_blight');
  const [activeLayer, setActiveLayer] = useState<'skin' | 'factory' | 'pipes' | 'mouths'>('factory');

  const anatomicalLayers = {
    skin: {
      title: isUrdu ? 'پتے کی حفاظتی بیرونی جلد' : 'Leaf Skin (The Waxy Shield)',
      simpleName: isUrdu ? 'واٹر پروف ڈھال' : 'Waterproof Coat',
      role: isUrdu ? 'پتے کو چھتری کی طرح بارش اور نقصان دہ اثرات سے بچاتی ہے' : 'Protects the leaf like an umbrella and sunscreen',
      description: isUrdu
        ? 'پتے کے اوپر ایک قدرتی مومی تہہ ہوتی ہے جو فنگس اور جراثیم کو اندر جانے سے روکتی ہے۔ بارش کا پانی دیر تک کھڑا رہے تو جراثیم اندر گھسنے کی کوشش کرتے ہیں۔'
        : 'A thin, waxy coating on top of the leaf that stops water from soaking in. Germs and fungi try to pierce this protective coat when rain sits on the leaf for too long.',
      howSick: isUrdu
        ? 'اگر پانی 6 گھنٹے سے زیادہ رہے تو فنگس اس حفاظتی تہہ میں سوراخ کر لیتی ہے۔'
        : 'If leaves stay wet for over 6 hours, fungal spores germinate and drill through this skin.',
    },
    factory: {
      title: isUrdu ? 'سبز خلیات کی خوراک فیکٹری' : 'Food Factory (Green Cells)',
      simpleName: isUrdu ? 'توانائی کا مرکز' : 'Energy Maker',
      role: isUrdu ? 'دھوپ اور پانی سے ٹماٹر کے لیے میٹھی خوراک بناتی ہے' : 'Turns sunlight and water into sweet tomato food',
      description: isUrdu
        ? 'پتے کا نرم اور سبز درمیانی حصہ جہاں کلوروفل سورج کی روشنی پکڑتا ہے۔ بیماریاں ان سبز خلیات کو ختم کر کے بھورے اور پیلے مردہ دھبے بنا دیتی ہیں۔'
        : 'The soft green middle of the leaf where chlorophyll captures sunlight. When leaf diseases strike, they destroy these green cells, leaving circular brown and yellow dead spots.',
      howSick: isUrdu
        ? 'ارلی بلائیٹ ان خلیوں کو دائروں میں کھاتی ہے، جس سے مخصوص ہدف جیسے بھورے حلقے بن جاتے ہیں۔'
        : 'Early Blight eats these cells in circles, making the famous brown target rings you see on sick plants.',
    },
    pipes: {
      title: isUrdu ? 'پانی اور خوراک کی باریک رگیں' : 'Water Pipes (Leaf Veins)',
      simpleName: isUrdu ? 'رسانی نالیاں' : 'Drinking Straws',
      role: isUrdu ? 'جڑوں سے پانی اور ٹماٹر تک غذائیت پہنچاتی ہیں' : 'Carries water and nutrients up to growing tomatoes',
      description: isUrdu
        ? 'پتے کے اندر موجود باریک لکیریں جو نالیوں کا کام کرتی ہیں۔ یہ مٹی سے پانی پتے تک اور تیار خوراک ٹماٹر تک پہنچاتی ہیں۔'
        : 'The raised lines on the leaf that act like drinking straws. They carry water from the soil up to the leaves and send sweetness back down to growing tomatoes.',
      howSick: isUrdu
        ? 'سفید مکھی جیسے کیڑے ان نالیوں میں وائرس داخل کر دیتے ہیں جس سے پتہ پیالے کی طرح مڑ جاتا ہے۔'
        : 'Tiny whitefly insects inject plant viruses directly into these pipes, causing leaves to curl up like cups.',
    },
    mouths: {
      title: isUrdu ? 'سانس لینے کے باریک مسام (اسٹومیٹا)' : 'Breathing Mouths (Pores)',
      simpleName: isUrdu ? 'ہوائی راستے' : 'Air Gateways',
      role: isUrdu ? 'مائیکروسکوپک سوراخ جہاں سے پتہ تازہ ہوا میں سانس لیتا ہے' : 'Tiny microscopic holes where the leaf breathes air',
      description: isUrdu
        ? 'پتے کی نچلی سطح پر ہزاروں باریک سوراخ ہوتے ہیں۔ پودا دن کے وقت کاربن ڈائی آکسائیڈ اندر لینے اور آکسیجن خارج کرنے کے لیے انہیں کھولتا ہے۔'
        : 'Thousands of microscopic openings on the underside of the leaf. The plant opens them during daytime to breathe in carbon dioxide and release fresh oxygen.',
      howSick: isUrdu
        ? 'جب بارش کا گندا پانی مٹی سے اچھلتا ہے تو بیکٹیریا ان کھلے سوراخوں کے راستے اندر داخل ہو جاتے ہیں۔'
        : 'Bacteria swim right through these open breathing holes when dirty water splashes up from the soil.',
    },
  };

  const currentLayerData = anatomicalLayers[activeLayer];

  return (
    <section id="inside-leaf" className="relative w-full py-20 bg-[#edf5ef]/45 border-t border-[#cbdcd0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-2">
            {t.anatomy.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13281c] tracking-tight leading-tight text-balance">
            <WordReveal text={t.anatomy.title} stepDelayMs={45} />
          </h2>
          <p className="mt-4 text-[#2f4739] text-base sm:text-lg leading-relaxed">
            {isUrdu
              ? 'ہم پتوں کا معائنہ کیوں کرتے ہیں؟ کیونکہ پتے مختلف پرتوں سے مل کر بنتے ہیں۔ جب بیماری حملہ کرتی ہے تو ان پرتوں کا رنگ بدل جاتا ہے۔ تھری ڈی ماڈل کو گھما کر دیکھیں!'
              : 'Why do we scan leaves? Because leaves are built with different layers. When sickness attacks, it changes how light reflects off these layers. Turn the 3D leaf model to see how different diseases look!'}
          </p>
        </ScrollReveal>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Leaf Inspector */}
          <ScrollReveal
            direction="left"
            delayMs={80}
            className="lg:col-span-7 bg-white border border-[#cbdcd0] rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm relative"
          >
            <div className="relative w-full h-[480px] lg:h-[580px]">
              <LeafScannerCanvas initialCondition={selectedCondition} isScanningActive={true} />
            </div>
          </ScrollReveal>

          {/* Right Column: Layer Guide, Condition Switcher & Compact CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 text-left">
            {/* Layer Buttons */}
            <ScrollReveal
              direction="right"
              delayMs={130}
              className="bg-white border border-[#cbdcd0] rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#13281c]">
                  <Layers className="w-4 h-4 text-[#166534]" />
                  <span>{isUrdu ? 'پتے کی 4 بنیادی پرتیں' : 'The 4 Parts of a Leaf'}</span>
                </div>
                <span className="text-xs text-[#166534] font-medium">
                  {isUrdu ? 'معلومات کے لیے کلک کریں' : 'Click to learn'}
                </span>
              </div>

              {/* 4 Simple buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(['skin', 'factory', 'pipes', 'mouths'] as const).map((lKey) => (
                  <button
                    key={lKey}
                    type="button"
                    onClick={() => setActiveLayer(lKey)}
                    className={`p-3 text-xs font-semibold rounded-xl text-left transition-all cursor-pointer ${
                      activeLayer === lKey
                        ? 'bg-[#edf5ef] border border-[#166534] text-[#13281c] shadow-xs'
                        : 'bg-[#faf8f2] border border-[#cbdcd0] text-[#2f4739] hover:border-[#166534]/50'
                    }`}
                  >
                    <div>{anatomicalLayers[lKey].simpleName}</div>
                    <div className="text-[11px] font-normal text-[#2f4739] mt-0.5">
                      {anatomicalLayers[lKey].title.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanatory card */}
              <div className="p-4 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-display font-bold text-sm text-[#13281c]">
                    {currentLayerData.title}
                  </div>
                  <span className="text-[11px] font-mono text-[#166534] font-semibold">
                    {currentLayerData.role.split(' ')[0]}
                  </span>
                </div>

                <p className="text-xs text-[#2f4739] leading-relaxed">
                  {currentLayerData.description}
                </p>

                <div className="pt-3 text-xs text-amber-900 bg-amber-50/85 p-3 rounded-xl border border-[#D97706]/25">
                  <strong className="block mb-1 text-amber-950 font-semibold">
                    {isUrdu ? 'بیماری کا اثر کیسے ہوتا ہے:' : 'How disease strikes here:'}
                  </strong>
                  <span>{currentLayerData.howSick}</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Disease Selector + Compact Scan Leaf CTA */}
            <ScrollReveal
              direction="right"
              delayMs={200}
              className="bg-white border border-[#cbdcd0] rounded-3xl p-6 shadow-sm space-y-4"
            >
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-3">
                  {isUrdu ? 'تھری ڈی پتے کا منظر بدلیں:' : 'Change 3D Leaf View:'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCondition('healthy')}
                    className={`p-2.5 rounded-xl border font-medium text-left transition-all active:scale-[0.98] cursor-pointer ${
                      selectedCondition === 'healthy'
                        ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                        : 'bg-[#faf8f2] border-[#cbdcd0] text-[#2f4739] hover:border-[#166534]/50 hover:-translate-y-0.5'
                    }`}
                  >
                    {isUrdu ? 'صحت مند پتہ' : 'Healthy Leaf'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCondition('early_blight')}
                    className={`p-2.5 rounded-xl border font-medium text-left transition-all active:scale-[0.98] cursor-pointer ${
                      selectedCondition === 'early_blight'
                        ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                        : 'bg-[#faf8f2] border-[#cbdcd0] text-[#2f4739] hover:border-[#166534]/50 hover:-translate-y-0.5'
                    }`}
                  >
                    {isUrdu ? 'ارلی بلائیٹ (حلقے)' : 'Early Blight (Target)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCondition('late_blight')}
                    className={`p-2.5 rounded-xl border font-medium text-left transition-all active:scale-[0.98] cursor-pointer ${
                      selectedCondition === 'late_blight'
                        ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                        : 'bg-[#faf8f2] border-[#cbdcd0] text-[#2f4739] hover:border-[#166534]/50 hover:-translate-y-0.5'
                    }`}
                  >
                    {isUrdu ? 'لیٹ بلائیٹ (جھلساؤ)' : 'Late Blight (Dark Mold)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCondition('septoria')}
                    className={`p-2.5 rounded-xl border font-medium text-left transition-all active:scale-[0.98] cursor-pointer ${
                      selectedCondition === 'septoria'
                        ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                        : 'bg-[#faf8f2] border-[#cbdcd0] text-[#2f4739] hover:border-[#166534]/50 hover:-translate-y-0.5'
                    }`}
                  >
                    {isUrdu ? 'سیپٹوریا لیف اسپاٹ' : 'Septoria Leaf Spots'}
                  </button>
                </div>
              </div>

              {onScanClick && (
                <div className="pt-3 border-t border-[#cbdcd0]/70 flex items-center justify-between gap-3">
                  <span className="text-xs text-[#2f4739] font-medium">
                    {isUrdu ? 'اب اپنے پتے کا معائنہ کریں:' : 'Ready to inspect your own plant?'}
                  </span>
                  <button
                    type="button"
                    onClick={onScanClick}
                    className="btn-botanical-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#bbf7d0] shrink-0" />
                    <span>{isUrdu ? 'پتہ اسکین کریں' : 'Scan Leaf'}</span>
                  </button>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
