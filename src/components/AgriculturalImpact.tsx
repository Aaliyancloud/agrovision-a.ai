import React from 'react';
import { TrendingDown, Clock, HeartHandshake, Sprout } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getAssetUrl } from '../utils/assetPath';
import { ScrollReveal, WordReveal, CountUpNumber } from './ScrollReveal';
import { BotanicalBranchesOverlay } from './BotanicalBranchesOverlay';

export const AgriculturalImpact: React.FC = () => {
  const { t, isUrdu } = useLanguage();

  return (
    <section id="why-leaves" className="relative w-full py-20 bg-[#edf5ef]/45 border-t border-[#cbdcd0] overflow-hidden">
      <BotanicalBranchesOverlay variant="section" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal direction="up" className="max-w-3xl mb-14 text-left">
          <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-2">
            {t.impact.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13281c] tracking-tight leading-tight text-balance">
            <WordReveal text={t.impact.title} stepDelayMs={45} />
          </h2>
          <p className="mt-4 text-[#2f4739] text-base sm:text-lg leading-relaxed">
            {t.impact.subtitle}
          </p>
        </ScrollReveal>

        {/* Featured Pakistan Agriculture Backbone Banner */}
        <ScrollReveal
          direction="up"
          delayMs={80}
          className="mb-8 bg-white border border-[#cbdcd0] rounded-3xl p-7 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#edf5ef] border border-[#cbdcd0] flex items-center justify-center text-[#166534] shrink-0">
                <Sprout className="w-6 h-6 text-[#166534]" />
              </div>
              <div className="text-left">
                <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold mb-1">
                  {isUrdu ? 'قومی زرعی اہمیت' : 'National Agricultural Lifeline'}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#13281c]">
                  {t.impact.backboneTitle}
                </h3>
                <p className="mt-2 text-sm text-[#2f4739] leading-relaxed max-w-4xl">
                  {t.impact.backboneDesc}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-[#edf5ef] px-4 py-3 rounded-2xl border border-[#cbdcd0]">
              <div className="font-mono tabular-nums text-2xl font-extrabold text-[#166534]">
                <CountUpNumber value={65} suffix="%+" durationMs={1100} />
              </div>
              <div className="text-[11px] text-[#2f4739] leading-tight text-left">
                {isUrdu ? 'دیہی آبادی زراعت پر منحصر' : 'Rural population depends on farming'}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Tomato Crop Loss */}
          <ScrollReveal
            direction="up"
            delayMs={70}
            className="md:col-span-4 bg-white border border-[#cbdcd0] rounded-3xl p-7 flex flex-col justify-between shadow-sm text-left hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-[#DC2626]/20 flex items-center justify-center text-[#DC2626] mb-6">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div className="font-mono tabular-nums text-4xl sm:text-5xl font-extrabold text-[#DC2626] tracking-tight">
                <CountUpNumber value={35} suffix="%" durationMs={950} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#13281c] mt-2">
                {isUrdu ? 'بیماری سے ضائع ہونے والے ٹماٹر' : 'Tomatoes Lost to Sickness'}
              </h3>
              <p className="text-sm text-[#2f4739] mt-3 leading-relaxed">
                {isUrdu
                  ? 'ملک بھر اور دنیا میں ایک تہائی سے زیادہ ٹماٹر کی فصل صرف پتوں کے دھبوں، فنگس اور وائرس کے بروقت علاج نہ ہونے سے خراب ہو جاتی ہے۔'
                  : 'Over a third of farm and garden tomatoes are lost to leaf spots, mold, and viruses before harvest if not diagnosed early.'}
              </p>
            </div>

            <div className="pt-6 border-t border-[#cbdcd0]/70 text-xs font-semibold text-[#166534]">
              {isUrdu ? 'ہمارا ہدف: پھل تک پہنچنے سے پہلے پتے کا علاج' : 'Goal: Treat leaves before rot reaches the fruit'}
            </div>
          </ScrollReveal>

          {/* Card 2: The 48-Hour Window */}
          <ScrollReveal direction="up" delayMs={150} className="md:col-span-8 bg-white border border-[#cbdcd0] rounded-3xl p-7 flex flex-col justify-between shadow-sm relative overflow-hidden text-left hover:-translate-y-0.5 transition-transform duration-300">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-[#cbdcd0] flex items-center justify-center text-[#166534] mb-6">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-mono tabular-nums text-3xl sm:text-4xl font-bold text-[#13281c] tracking-tight">
                {isUrdu ? 'ابتدائی 48 گھنٹے کا سنہری وقت' : 'The 48-Hour Golden Window'}
              </div>
              <h3 className="font-display text-lg text-[#166534] font-semibold mt-1">
                {isUrdu ? 'پھل خراب ہونے سے پہلے پودے کی حفاظت' : 'Plant Health Before Fruit Spread'}
              </h3>
              <p className="text-sm text-[#2f4739] mt-3 leading-relaxed max-w-2xl">
                {isUrdu
                  ? 'جب پہلے دو دن میں پتے پر ہلکے پیلے یا بھورے دھبے ظاہر ہوتے ہیں، تو صرف اس پتے کو کاٹ کر اور قدرتی نیم اسپرے کر کے پورے پودے کو بچایا جا سکتا ہے۔ ایک ہفتے بعد بیماری تنے اور ٹماٹر تک چلی جاتی ہے۔'
                  : 'Catching sickness during the first 48 hours allows gardeners to save the plant simply by pruning that leaf and using gentle organic sprays like neem oil before spores reach the stem.'}
              </p>
            </div>

            {/* Simple 3-step timeline */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#cbdcd0]/70">
              <div className="bg-[#faf8f2] p-3.5 rounded-2xl border border-[#166534]/20 hover:-translate-y-0.5 transition-transform duration-200">
                <div className="text-xs font-mono text-[#166534] font-bold">
                  {isUrdu ? 'پہلا اور دوسرا دن' : 'DAYS 1 - 2'}
                </div>
                <div className="text-xs text-[#13281c] font-bold mt-1">
                  {isUrdu ? 'باریک دھبے ظاہر ہوتے ہیں' : 'Tiny Specks Appear'}
                </div>
                <div className="text-[11px] text-[#2f4739] mt-1">
                  {isUrdu ? '90 فیصد بحالی کا امکان' : 'Easy to cure · 90% recovery'}
                </div>
              </div>
              <div className="bg-[#faf8f2] p-3.5 rounded-2xl border border-[#D97706]/25 hover:-translate-y-0.5 transition-transform duration-200">
                <div className="text-xs font-mono text-[#D97706] font-bold">
                  {isUrdu ? 'تیسرا سے پانچواں دن' : 'DAYS 3 - 5'}
                </div>
                <div className="text-xs text-[#13281c] font-bold mt-1">
                  {isUrdu ? 'بھورے حلقے بڑھتے ہیں' : 'Brown Rings Grow'}
                </div>
                <div className="text-[11px] text-[#2f4739] mt-1">
                  {isUrdu ? 'دوسرے پتوں تک پھیلاؤ' : 'Spreads to neighbor leaves'}
                </div>
              </div>
              <div className="bg-[#faf8f2] p-3.5 rounded-2xl border border-[#DC2626]/25 hover:-translate-y-0.5 transition-transform duration-200">
                <div className="text-xs font-mono text-[#DC2626] font-bold">
                  {isUrdu ? 'چھٹا دن اور آگے' : 'DAYS 6+'}
                </div>
                <div className="text-xs text-[#13281c] font-bold mt-1">
                  {isUrdu ? 'مرکزی تنا مرجھا جاتا ہے' : 'Main Vine Wilts'}
                </div>
                <div className="text-[11px] text-[#2f4739] mt-1">
                  {isUrdu ? 'ٹماٹر کا بچاؤ مشکل' : 'Difficult to save tomatoes'}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Photo of Greenhouse */}
          <ScrollReveal direction="left" delayMs={120} className="md:col-span-7 bg-white border border-[#cbdcd0] rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={getAssetUrl('/assets/images/smart_greenhouse_tech_1793801738048.webp')}
                alt="Smart greenhouse rows of healthy tomato plants monitored for leaf disease prevention"
                width={1376}
                height={768}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091a10]/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-left">
                <div className="text-xs font-mono text-[#bbf7d0] uppercase tracking-wider font-semibold">
                  {isUrdu ? 'جدید گرین ہاؤس اور زرعی تحقیق' : 'Clean Farming'}
                </div>
                <div className="text-lg font-display font-bold text-white">
                  {isUrdu ? 'پودوں کی قدرتی اور محفوظ نگہداشت' : 'Protecting Plants Naturally'}
                </div>
              </div>
            </div>
            <div className="p-6 text-left">
              <h3 className="font-display text-lg font-bold text-[#13281c]">
                {t.impact.card2Title}
              </h3>
              <p className="text-sm text-[#2f4739] mt-2 leading-relaxed">
                {t.impact.card2Desc}
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4: Farm Device Sensor */}
          <ScrollReveal direction="right" delayMs={180} className="md:col-span-5 bg-white border border-[#cbdcd0] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm text-left">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-[#cbdcd0] flex items-center justify-center text-[#166534] mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#13281c]">
                {t.impact.card3Title}
              </h3>
              <p className="text-sm text-[#2f4739] mt-2 leading-relaxed">
                {t.impact.card3Desc}
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#edf5ef] border border-[#cbdcd0]">
              <div className="text-xs font-bold text-[#13281c] mb-1">
                {isUrdu ? 'آسان اور تیز رفتار' : 'Instant Field Intelligence'}
              </div>
              <div className="text-[11px] text-[#2f4739] leading-relaxed">
                {isUrdu
                  ? 'کوئی بھی کسان یا طالب علم بغیر کسی مہنگی مشین کے اپنے عام موبائل سے پودے کا معائنہ کر سکتا ہے۔'
                  : 'Runs on standard mobile devices without complex lab machinery.'}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
