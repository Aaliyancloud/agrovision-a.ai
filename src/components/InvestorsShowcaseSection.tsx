import React, { useState } from 'react';
import { BadgeCheck, Pause, Play, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal, WordReveal } from './ScrollReveal';

interface InvestorDispatch {
  id: string;
  name: string;
  urduName: string;
  handle: string;
  role: string;
  urduRole: string;
  endorsementTag: string;
  urduEndorsementTag: string;
  stars: number;
  message: string;
  urduMessage: string;
  highlightStat: string;
  urduHighlightStat: string;
  accent: 'emerald' | 'amber';
  bobDelay: string;
}

const INVESTOR_DISPATCHES: InvestorDispatch[] = [
  {
    id: 'mohtashim-1',
    name: 'Mohtashim Raza',
    urduName: 'محتشم رضا',
    handle: '@mohtashim_raza',
    role: 'Primary Project Investor',
    urduRole: 'مرکزی پروجیکٹ انویسٹر',
    endorsementTag: 'Strategic Backing',
    urduEndorsementTag: 'اسٹریٹجک سرمایہ کاری',
    stars: 5,
    message:
      'Investing in AgroVision AI was an instant decision. Seeing this team build dual-stage computer vision for tomato leaf diseases truly elevates student AgriTech in Pakistan.',
    urduMessage:
      'ایگرو وژن اے آئی میں سرمایہ کاری ایک فوری فیصلہ تھا۔ ٹماٹر کے پتوں کی بیماریوں کے لیے دو مراحل پر مشتمل اے آئی ماڈل بنانا واقعی قابلِ فخر کامیابی ہے۔',
    highlightStat: '5.0 / 5.0 Backer Rating',
    urduHighlightStat: '5.0 / 5.0 انویسٹر ریٹنگ',
    accent: 'emerald',
    bobDelay: '0s'
  },
  {
    id: 'agha-1',
    name: 'Agha Hussain',
    urduName: 'آغا حسین',
    handle: '@agha_hussain',
    role: 'Seed & Venture Investor',
    urduRole: 'سیڈ اور وینچر انویسٹر',
    endorsementTag: 'Seed Funded',
    urduEndorsementTag: 'سیڈ فنڈنگ',
    stars: 5,
    message:
      'Five stars for the vision and execution! AgroVision AI puts real-time plant pathology and Urdu voice guidance straight into the hands of everyday farmers.',
    urduMessage:
      'اس وژن اور بہترین کارکردگی کے لیے پورے پانچ ستارے! ایگرو وژن اے آئی کسانوں کے ہاتھوں میں فوری تشخیص اور اردو رہنمائی فراہم کر رہا ہے۔',
    highlightStat: 'Raising AgriTech Impact',
    urduHighlightStat: 'زرعی ٹیکنالوجی کا فروغ',
    accent: 'amber',
    bobDelay: '-1.1s'
  },
  {
    id: 'mohtashim-2',
    name: 'Mohtashim Raza',
    urduName: 'محتشم رضا',
    handle: '@mohtashim_raza',
    role: 'Lead Patron & Investor',
    urduRole: 'سرپرست و انویسٹر',
    endorsementTag: 'Raising Excellence',
    urduEndorsementTag: 'معیار کی تحسین',
    stars: 5,
    message:
      'Proud to raise and back this young research team. From soil moisture sensor context to formatted pathology PDFs, every detail solves a real field challenge.',
    urduMessage:
      'اس نوجوان تحقیقی ٹیم کی حوصلہ افزائی اور سرمایہ کاری پر فخر ہے۔ مٹی کے سینسر سے لے کر تشخیصی رپورٹ تک ہر فیچر حقیقی مسائل حل کرتا ہے۔',
    highlightStat: 'Backed for Scale',
    urduHighlightStat: 'وسیع پیمانے پر معاونت',
    accent: 'emerald',
    bobDelay: '-2.2s'
  },
  {
    id: 'agha-2',
    name: 'Agha Hussain',
    urduName: 'آغا حسین',
    handle: '@agha_hussain',
    role: 'AgriTech Investor & Supporter',
    urduRole: 'ایگری ٹیک انویسٹر',
    endorsementTag: 'Full Endorsement',
    urduEndorsementTag: 'مکمل تائید',
    stars: 5,
    message:
      'Remarkable discipline, scientific honesty, and craft. Investing in teams like AgroVision AI means investing in smarter harvests and sustainable crop protection.',
    urduMessage:
      'شاندار نظم و ضبط اور سائنسی دیانت۔ ایگرو وژن اے آئی جیسی ٹیموں میں سرمایہ کاری بہتر فصلوں اور پائیدار زراعت کے روشن مستقبل کی ضمانت ہے۔',
    highlightStat: 'Verified 5-Star Patron',
    urduHighlightStat: 'تصدیق شدہ فائیو اسٹار سرپرست',
    accent: 'amber',
    bobDelay: '-3.1s'
  }
];

const TickerItem: React.FC<{ isUrdu: boolean; idx: number }> = ({ isUrdu, idx }) => {
  const items = isUrdu
    ? [
        '★ محتشم رضا — 5.0 اسٹارز اور پروجیکٹ انویسٹمنٹ',
        '◆ آغا حسین — 5.0 اسٹارز اور زرعی اے آئی کی سرپرستی',
        '★ ایگرو وژن اے آئی کے لیے سرمایہ کاروں کی مکمل تحسین',
        '◆ طلبہ کی تحقیق سے کسانوں کے لیے جدید حل'
      ]
    : [
        '★ Mohtashim Raza — 5.0 Stars & Strategic Investment Backing',
        '◆ Agha Hussain — 5.0 Stars & Seed AgriTech Endorsement',
        '★ Raising Student-Led Tomato Pathology AI in Pakistan',
        '◆ Continuous Investor Support for Precision Crop Health'
      ];

  const text = items[idx % items.length];

  return (
    <span className="inline-flex items-center gap-3 px-5 py-1.5 text-[11px] font-mono font-semibold tracking-wide text-emerald-900 whitespace-nowrap">
      <span>{text}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" aria-hidden="true" />
    </span>
  );
};

export const InvestorsShowcaseSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const renderCarriage = (item: InvestorDispatch, passKey: string, idx: number) => {
    const isEmerald = item.accent === 'emerald';
    const cardName = isUrdu ? item.urduName : item.name;
    const cardRole = isUrdu ? item.urduRole : item.role;
    const cardTag = isUrdu ? item.urduEndorsementTag : item.endorsementTag;
    const cardMessage = isUrdu ? item.urduMessage : item.message;
    const cardStat = isUrdu ? item.urduHighlightStat : item.highlightStat;

    return (
      <div
        key={`${passKey}-${item.id}`}
        className="flex items-center shrink-0"
      >
        {/* Tweet / Investor Appreciation Carriage — Strictly NO Investor Portrait/Picture */}
        <article
          dir={isUrdu ? 'rtl' : 'ltr'}
          style={{ '--bob-delay': item.bobDelay } as React.CSSProperties}
          className={`investor-carriage-bob group relative w-[310px] sm:w-[370px] rounded-2xl bg-white border ${
            isEmerald
              ? 'border-[#cbdcd0] hover:border-emerald-500/70'
              : 'border-amber-200/90 hover:border-amber-500/70'
          } p-5 shadow-md shadow-[#13281c]/5 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between gap-3.5 overflow-hidden`}
        >
          {/* Subtle top kinetic accent bar */}
          <div
            className={`absolute top-0 inset-x-0 h-1 ${
              isEmerald
                ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400'
                : 'bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-400'
            }`}
          />

          {/* Top Editorial Header: Name Only (No Avatar/Picture), Role & Verified Backing Mark */}
          <div className="flex items-start justify-between gap-3 pt-0.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display text-lg font-bold text-[#13281c] tracking-tight truncate">
                  {cardName}
                </h3>
                <BadgeCheck
                  className={`w-4 h-4 shrink-0 ${
                    isEmerald ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                  aria-label="Verified Investor"
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#3d5947] mt-0.5 flex-wrap">
                <span>{item.handle}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans font-semibold text-emerald-900">{cardRole}</span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 border ${
                isEmerald
                  ? 'bg-[#edf5ef] text-emerald-900 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>{cardTag}</span>
            </span>
          </div>

          {/* 5-Star Animated Gleam Row */}
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-1"
              aria-label={`${item.stars} out of 5 stars rating`}
            >
              {Array.from({ length: item.stars }).map((_, starIdx) => (
                <Star
                  key={starIdx}
                  style={{ '--star-delay': `${starIdx * 0.28 + idx * 0.15}s` } as React.CSSProperties}
                  className="investor-star-gleam w-4 h-4 text-amber-500 fill-amber-400"
                />
              ))}
              <span className="ml-1.5 text-xs font-mono font-bold text-[#13281c]">5.0</span>
            </div>

            <span className="text-[10px] font-mono font-semibold text-[#3d5947]">
              {cardStat}
            </span>
          </div>

          {/* Tweet / Appreciation Message */}
          <p className="text-xs sm:text-[13px] text-[#3d5947] leading-relaxed">
            “{cardMessage}”
          </p>

          {/* Bottom Dispatch Meta */}
          <div className="pt-2.5 border-t border-[#cbdcd0]/60 flex items-center justify-between text-[10px] font-mono text-[#3d5947]">
            <span className="text-emerald-800 font-semibold">
              #AgroVisionAI · #AgriTech
            </span>
            <span>{isUrdu ? 'انویسٹر فیڈبیک' : 'Investor Praise'}</span>
          </div>
        </article>

        {/* Kinetic Train Coupler Link Between Carriages */}
        <div
          aria-hidden="true"
          className="flex items-center px-2 sm:px-3 shrink-0"
        >
          <span className="w-2 h-2 rounded-full border border-emerald-600/60 bg-[#faf8f2]" />
          <span className="w-5 sm:w-7 h-[2px] bg-gradient-to-r from-emerald-500/60 via-amber-500/50 to-emerald-500/60" />
          <span className="w-2 h-2 rounded-full border border-emerald-600/60 bg-[#faf8f2]" />
        </div>
      </div>
    );
  };

  return (
    <section
      id="investors"
      aria-label={isUrdu ? 'پروجیکٹ انویسٹرز اور تحسین' : 'Project Investors and Endorsements'}
      className="relative w-full py-16 sm:py-20 bg-[#faf8f2] border-t border-[#cbdcd0] overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-9 sm:mb-11">
        <ScrollReveal
          direction="up"
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isUrdu
                  ? 'انویسٹرز کی تحسین اور سرپرستی'
                  : 'PROJECT INVESTORS & ENDORSEMENTS'}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13281c] tracking-tight leading-tight">
              <WordReveal
                text={
                  isUrdu
                    ? 'ہمارے انویسٹرز کی حوصلہ افزائی اور 5 اسٹار فیڈبیک'
                    : 'Backed & Raised by Visionary Investors'
                }
                stepDelayMs={45}
              />
            </h2>

            <p className="text-sm sm:text-base text-[#3d5947] leading-relaxed">
              {isUrdu
                ? 'محتشم رضا اور آغا حسین کی جانب سے ایگرو وژن اے آئی کے لیے مسلسل فیڈبیک، سرمایہ کاری اور تحسین کا رواں سلسلہ۔'
                : 'Live appreciation dispatches and five-star investment endorsements from Mohtashim Raza and Agha Hussain gliding continuously in our showcase loop.'}
            </p>
          </div>

          {/* Investor Roster Summary & Motion Control */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-[#edf5ef] border border-[#cbdcd0] text-xs font-semibold text-[#13281c] flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>
                {isUrdu
                  ? 'محتشم رضا · آغا حسین'
                  : 'Mohtashim Raza · Agha Hussain'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#edf5ef] border border-[#cbdcd0] text-xs font-semibold text-[#13281c] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              aria-pressed={isPaused}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isUrdu ? 'لوپ چلائیں' : 'Resume Loop'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isUrdu ? 'لوپ روکیں' : 'Pause Loop'}</span>
                </>
              )}
            </button>
          </div>
        </ScrollReveal>
      </div>

      {/* Continuous Train-Loop Viewport (Gliding Conveyor: Never Sticky) */}
      <div
        className="investor-train-viewport relative w-full overflow-hidden py-3"
        data-paused={isPaused ? 'true' : 'false'}
      >
        {/* Top Kinetic Guide Rail with Traveling Emerald Signal */}
        <div
          aria-hidden="true"
          className="relative max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-[#cbdcd0] to-transparent mb-5 overflow-hidden"
        >
          <span className="investor-rail-pulse absolute top-0 left-0 w-28 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>

        {/* Gliding Tweet Train Track (Always LTR inner flex track so CSS -50% translates seamlessly in EN & RTL Urdu) */}
        <div className="investor-edge-fade w-full overflow-hidden">
          <div dir="ltr" className="investor-train-track py-2">
            {/* Primary Track */}
            <div className="flex items-stretch shrink-0">
              {INVESTOR_DISPATCHES.map((item, idx) => renderCarriage(item, 'primary', idx))}
            </div>
            {/* Seamless Duplicate Clone Track */}
            <div className="flex items-stretch shrink-0" aria-hidden="true">
              {INVESTOR_DISPATCHES.map((item, idx) => renderCarriage(item, 'clone', idx))}
            </div>
          </div>
        </div>

        {/* Counter-Gliding Lower Appraisal & Investment Rail */}
        <div
          aria-hidden="true"
          className="mt-5 border-y border-[#cbdcd0]/80 bg-[#edf5ef]/75 overflow-hidden py-1"
        >
          <div dir="ltr" className="investor-train-ticker-rev">
            <div className="flex items-center shrink-0">
              {Array.from({ length: 4 }).map((_, idx) => (
                <TickerItem key={`t1-${idx}`} isUrdu={isUrdu} idx={idx} />
              ))}
            </div>
            <div className="flex items-center shrink-0">
              {Array.from({ length: 4 }).map((_, idx) => (
                <TickerItem key={`t2-${idx}`} isUrdu={isUrdu} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
