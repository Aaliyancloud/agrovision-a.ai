import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import abdulRazakPhoto from '../assets/images/team_abdul_razak_1794752488742.webp';
import aaliyanPhoto from '../assets/images/team_aaliyan_awan_1794752488156.webp';
import syedHajanPhoto from '../assets/images/team_syed_hajan_1794752489766.webp';
import ahmedPhoto from '../assets/images/team_ahmed_ali_1794752497431.webp';
import bilalPhoto from '../assets/images/team_bilal_khan_1794752491144.webp';
import khalilPhoto from '../assets/images/team_khalil_rehman_new.webp';
import { ScrollReveal, WordReveal } from './ScrollReveal';
import { BotanicalBranchesOverlay } from './BotanicalBranchesOverlay';

interface TeamMember {
  id: string;
  isSupervisor: boolean;
  name: string;
  urduName: string;
  role: string;
  urduRole: string;
  department: string;
  urduDepartment: string;
  tag: string;
  urduTag: string;
  badgeText: string;
  urduBadgeText: string;
  leafVariant: 'oak' | 'monstera' | 'fern' | 'maple' | 'ginkgo' | 'olive';
  experience: string;
  urduExperience: string;
  photo: string;
  photoFrameClass?: string;
  bio: string;
  urduBio: string;
  focusAreas: string[];
  urduFocusAreas: string[];
  initials: string;
  swayDuration: number;
  swayDelay: number;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'supervisor',
    isSupervisor: true,
    name: 'Sir Abdul Razak',
    urduName: 'سر عبدالرزاق',
    role: 'Project Supervisor & Head',
    urduRole: 'پروجیکٹ سپروائزر اور سربراہ',
    department: 'IT & Computer Science Specialist, PSS (Class 11)',
    urduDepartment: 'آئی ٹی اور کمپیوٹر سائنس اسپیشلسٹ، پی ایس ایس (کلاس 11)',
    tag: 'Supervisor / Head',
    urduTag: 'سپروائزر / سربراہ',
    badgeText: 'Head Mentor',
    urduBadgeText: 'سرپرست اعلیٰ',
    leafVariant: 'oak',
    experience: 'Faculty Head',
    urduExperience: 'فیکلٹی ہیڈ',
    photo: abdulRazakPhoto,
    bio: 'Guiding the AgroVision AI leaf-detection project with deep expertise in Computer Science, IT systems, and academic mentorship at PSS (Class 11).',
    urduBio: 'کمپیوٹر سائنس، آئی ٹی سسٹمز اور کلاس 11 پی ایس ایس میں علمی سرپرستی کے ساتھ ایگرو وژن اے آئی پروجیکٹ کی رہنمائی فرمائی۔',
    focusAreas: [
      'Project Supervision & Direction',
      'Computer Science Architecture',
      'AI & Software Systems Mentorship'
    ],
    urduFocusAreas: [
      'پروجیکٹ کی نگرانی اور علمی رہنمائی',
      'کمپیوٹر سائنس آرکیٹیکچر',
      'اے آئی اور سافٹ ویئر سسٹمز کی سرپرستی'
    ],
    initials: 'AR',
    swayDuration: 4.4,
    swayDelay: -0.6
  },
  {
    id: 'lead',
    isSupervisor: false,
    name: 'Khalil-Ur-Rehman',
    urduName: 'خلیل الرحمٰن',
    role: 'Team Lead & Lead Researcher',
    urduRole: 'ٹیم لیڈ اور لیڈ ریسرچر',
    department: 'Botanical AI & Leaf Pathology Research',
    urduDepartment: 'نباتاتی اے آئی اور لیف پیتھالوجی ریسرچ',
    tag: 'Team Lead',
    urduTag: 'ٹیم لیڈ',
    badgeText: 'Verified',
    urduBadgeText: 'تصدیق شدہ',
    leafVariant: 'monstera',
    experience: 'Lead Researcher',
    urduExperience: 'لیڈ ریسرچر',
    photo: khalilPhoto,
    photoFrameClass: 'scale-[1.15] origin-[50%_10%]',
    bio: 'Leads leaf disease dataset research, plant pathology literature review, and defines model validation criteria for accurate leaf diagnostics.',
    urduBio: 'پتے کی بیماریوں کے ڈیٹا سیٹ کی تحقیق، پلانٹ پیتھالوجی کے مطالعے، اور درست تشخیصی معیار کی قیادت۔',
    focusAreas: [
      'Leaf Disease Research & Literature',
      'Team Leadership & Workflow',
      'AI Model Validation Criteria'
    ],
    urduFocusAreas: [
      'پتے کی بیماریوں کی تحقیق و مطالعہ',
      'ٹیم کی قیادت اور ورک فلو',
      'اے آئی ماڈل کی تصدیق کا معیار'
    ],
    initials: 'KR',
    swayDuration: 3.7,
    swayDelay: -1.8
  },
  {
    id: 'developer',
    isSupervisor: false,
    name: 'Aaliyan Awan',
    urduName: 'عالیان اعوان',
    role: 'Lead Full-Stack & UI/UX Developer',
    urduRole: 'لیڈ فل اسٹیک اور UI/UX ڈویلپر',
    department: 'Web Architecture & AI Integration',
    urduDepartment: 'ویب آرکیٹیکچر اور اے آئی انٹیگریشن',
    tag: 'Developer',
    urduTag: 'ڈویلپر',
    badgeText: 'Verified',
    urduBadgeText: 'تصدیق شدہ',
    leafVariant: 'fern',
    experience: 'Web Architect',
    urduExperience: 'ویب آرکیٹیکٹ',
    photo: aaliyanPhoto,
    bio: 'Architected and built the AgroVision web platform, seamless AI model integration, and interactive botanical user interface.',
    urduBio: 'ایگرو وژن ویب پلیٹ فارم، اے آئی ماڈل کی انٹیگریشن اور انٹرایکٹو نباتاتی یوزر انٹرفیس کی مکمل تیاری۔',
    focusAreas: [
      'Full-Stack Web Engineering',
      'UI/UX Design & Interactivity',
      'AI Inference Pipeline Integration'
    ],
    urduFocusAreas: [
      'فل اسٹیک ویب انجینئرنگ',
      'UI/UX ڈیزائن اور انٹرایکٹیویٹی',
      'اے آئی پائپ لائن انٹیگریشن'
    ],
    initials: 'AA',
    swayDuration: 4.1,
    swayDelay: -0.9
  },
  {
    id: 'qa',
    isSupervisor: false,
    name: 'Ahmed Ali',
    urduName: 'احمد علی',
    role: 'QA & Model Testing Specialist',
    urduRole: 'کوالٹی ایشورنس اور ٹیسٹنگ اسپیشلسٹ',
    department: 'Accuracy Benchmarking & Validation',
    urduDepartment: 'درستگی کی جانچ اور توثیق',
    tag: 'QA & Testing',
    urduTag: 'ٹیسٹنگ و معیار',
    badgeText: 'Verified',
    urduBadgeText: 'تصدیق شدہ',
    leafVariant: 'maple',
    experience: 'QA Specialist',
    urduExperience: 'QA اسپیشلسٹ',
    photo: ahmedPhoto,
    bio: 'Conducts rigorous accuracy testing, edge-case leaf image validation, and cross-device quality assurance across the web application.',
    urduBio: 'ویب ایپلیکیشن پر درستگی کی سخت جانچ، مشکل تصاویر کی تصدیق اور مختلف ڈیوائسز پر کوالٹی ایشورنس۔',
    focusAreas: [
      'Model Accuracy & Edge-Case Testing',
      'Cross-Device UI Quality Assurance',
      'Diagnostic Reliability Audits'
    ],
    urduFocusAreas: [
      'ماڈل کی درستگی اور ایج کیس ٹیسٹنگ',
      'کراس ڈیوائس UI کوالٹی ایشورنس',
      'تشخیصی اعتماد کا آڈٹ'
    ],
    initials: 'AA',
    swayDuration: 4.7,
    swayDelay: -2.6
  },
  {
    id: 'coresearcher',
    isSupervisor: false,
    name: 'Agha Bilal Khan',
    urduName: 'آغا بلال خان',
    role: 'Co-Researcher & Dataset Curator',
    urduRole: 'شریک ریسرچر اور ڈیٹا سیٹ کیوریٹر',
    department: 'Botanical Taxonomy & Image Labeling',
    urduDepartment: 'نباتاتی درجہ بندی اور امیج لیبلنگ',
    tag: 'Co-Researcher',
    urduTag: 'شریک ریسرچر',
    badgeText: 'Verified',
    urduBadgeText: 'تصدیق شدہ',
    leafVariant: 'ginkgo',
    experience: 'Co-Researcher',
    urduExperience: 'شریک ریسرچر',
    photo: bilalPhoto,
    bio: 'Curates, labels, and organizes high-resolution leaf image datasets across healthy and diseased categories for training the AgroVision AI.',
    urduBio: 'صحت مند اور بیمار پتوں کی اعلیٰ معیار کی تصاویر کا مجموعہ، لیبلنگ اور ڈیٹا سیٹ کی ترتیب۔',
    focusAreas: [
      'Leaf Dataset Curation & Labeling',
      'Botanical Species Classification',
      'Training Data Preprocessing'
    ],
    urduFocusAreas: [
      'پتوں کے ڈیٹا سیٹ کی ترتیب و لیبلنگ',
      'نباتاتی اقسام کی درجہ بندی',
      'ٹریننگ ڈیٹا کی ابتدائی تیاری'
    ],
    initials: 'BK',
    swayDuration: 3.9,
    swayDelay: -1.3
  },
  {
    id: 'strategist',
    isSupervisor: false,
    name: 'Syed Hajan',
    urduName: 'سید حاجن',
    role: 'Documentation & Content Strategist',
    urduRole: 'دستاویزات اور مواد کا ماہر',
    department: 'Research Synthesis & Technical Docs',
    urduDepartment: 'تحقیقی خلاصہ اور تکنیکی دستاویزات',
    tag: 'Docs & Strategy',
    urduTag: 'دستاویزات و حکمت عملی',
    badgeText: 'Verified',
    urduBadgeText: 'تصدیق شدہ',
    leafVariant: 'olive',
    experience: 'Content Lead',
    urduExperience: 'کنٹینٹ لیڈ',
    photo: syedHajanPhoto,
    bio: 'Manages technical documentation, project reports, presentation decks, and clear research synthesis for AgroVision.',
    urduBio: 'ایگرو وژن کے لیے تکنیکی دستاویزات، پروجیکٹ رپورٹس، پریزنٹیشن اور واضح تحقیقی خلاصے کی تیاری۔',
    focusAreas: [
      'Technical Documentation & Reports',
      'Research Synthesis & Whitepapers',
      'Presentation & Content Strategy'
    ],
    urduFocusAreas: [
      'تکنیکی دستاویزات اور رپورٹس',
      'تحقیقی خلاصہ اور وائٹ پیپرز',
      'پریزنٹیشن اور مواد کی حکمت عملی'
    ],
    initials: 'SH',
    swayDuration: 4.5,
    swayDelay: -2.1
  }
];

function LeafVariationIcon({
  variant,
  isSupervisor
}: {
  variant: TeamMember['leafVariant'];
  isSupervisor: boolean;
}) {
  const strokeColor = isSupervisor ? '#b45309' : '#166534';
  const fillLight = isSupervisor ? '#fef3c7' : '#edf5ef';

  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {variant === 'oak' && (
        <path
          d="M12 2C9 2 7 4 7 6.5C5.5 7 4.5 8.5 5 10C4 11 4 13 5.5 14C5 15.5 6 17.5 8 18V22H10V18C12 17.5 13 15.5 12.5 14C14 13 14 11 13 10C13.5 8.5 12.5 7 11 6.5C11 4 9 2 12 2Z"
          fill={fillLight}
          stroke={strokeColor}
          strokeWidth="1.6"
        />
      )}
      {variant === 'monstera' && (
        <path
          d="M12 2C7 4 4 9 5 15C6 18 9 20 12 21C15 20 18 18 19 15C20 9 17 4 12 2ZM12 6V19M8 10L12 12M16 10L12 12M7 14L12 16M17 14L12 16"
          fill={fillLight}
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      {variant === 'fern' && (
        <path
          d="M12 21V4M12 7L8 5M12 7L16 5M12 11L7 9M12 11L17 9M12 15L8 13M12 15L16 13"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
      {variant === 'maple' && (
        <path
          d="M12 2L14 7L19 6L16 11L20 14L14 15L15 20H9L10 15L4 14L8 11L5 6L10 7L12 2Z"
          fill={fillLight}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
      {variant === 'ginkgo' && (
        <path
          d="M12 21V13M12 13C7 13 4 9 5 5C8 6 10 8 12 8C14 8 16 6 19 5C20 9 17 13 12 13Z"
          fill={fillLight}
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      )}
      {variant === 'olive' && (
        <path
          d="M12 3C8 7 7 13 12 20C17 13 16 7 12 3ZM12 5V21"
          fill={fillLight}
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

interface HangingCardProps {
  member: TeamMember;
  isFlipped: boolean;
  isUrdu: boolean;
  onToggleFlip: (id: string) => void;
  showMobileRackPeg?: boolean;
}

const HangingBotanicalCard: React.FC<HangingCardProps> = ({
  member,
  isFlipped,
  isUrdu,
  onToggleFlip,
  showMobileRackPeg = false
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const cardFrontBorder = member.isSupervisor
    ? 'border-amber-500/60 ring-2 ring-amber-400/20 shadow-xl shadow-[#13281c]/10'
    : 'border-[#cbdcd0] shadow-lg shadow-[#13281c]/5';

  const displayName = isUrdu ? member.urduName : member.name;
  const displayRole = isUrdu ? member.urduRole : member.role;
  const displayDepartment = isUrdu ? member.urduDepartment : member.department;
  const displayTag = isUrdu ? member.urduTag : member.tag;
  const displayBadge = isUrdu ? member.urduBadgeText : member.badgeText;
  const displayBio = isUrdu ? member.urduBio : member.bio;
  const displayFocus = isUrdu ? member.urduFocusAreas : member.focusAreas;

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Compact animated overhead branch peg bar on mobile/tablet wrapped rows (< xl) */}
      {showMobileRackPeg && (
        <div className="xl:hidden w-44 h-7 relative pointer-events-none select-none flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 180 26" aria-hidden="true">
            <path d="M6,13 Q90,7 174,13" fill="none" stroke="#2f4d3a" strokeWidth="4.2" strokeLinecap="round" />
            <circle cx="90" cy="10" r="4" fill="#166534" stroke="#0e2b19" strokeWidth="1.2" />
            <g className="animate-leaf-sway" style={{ transformOrigin: '90px 10px' }}>
              <path d="M90,10 C78,0 62,3 59,10 C69,15 80,15 90,10 Z" fill="#14532d" />
              <path d="M90,10 C102,0 118,3 121,10 C111,15 100,15 90,10 Z" fill="#16a34a" />
            </g>
          </svg>
        </div>
      )}

      {/* Swinging Pendulum Assembly hanging independently from the branch above */}
      <div
        className="hanging-wrapper w-full flex flex-col items-center -mt-3.5"
        style={{
          animationDuration: `${member.swayDuration}s`,
          animationDelay: `${member.swayDelay}s`
        }}
      >
        {/* Independent Vertical Hanger Vine Stem + Leaf + Metallic Clip */}
        <div className="relative z-20 flex flex-col items-center -mb-2.5 pointer-events-none select-none">
          <svg width="42" height="38" viewBox="0 0 42 38" fill="none" aria-hidden="true">
            <circle cx="21" cy="3" r="3" fill="#166534" stroke="#0e2b19" strokeWidth="1.2" />
            <path
              d="M21,4 C20,13 22,23 21,33"
              stroke="#2f4d3a"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            <path
              d="M21,4 C22,13 20,23 21,33"
              stroke="#6c8c74"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.82"
            />
            <path
              d="M21,12 C28,11 29,18 22,20 C17,21 16,26 21,28"
              stroke="#15803d"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M21,17 C13,14 9,18 11,23 C15,24 19,21 21,17 Z"
              fill="#16a34a"
              className="animate-leaf-sway-subtle"
              style={{ transformOrigin: '21px 17px' }}
            />
          </svg>

          <div className="w-8 h-4 -mt-1.5 rounded-t-md bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-400 border border-zinc-500/80 shadow-sm flex items-center justify-center">
            <div className="w-3.5 h-1 rounded-full bg-zinc-700" />
          </div>
        </div>

        {/* 3D CSS Flip Card Container (Auto-flips on cursor hover; tap fallback on touch devices) */}
        <div
          className={`perspective-container w-full cursor-pointer select-none ${
            isFlipped ? 'is-flipped' : ''
          }`}
          onClick={() => {
            if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
              return;
            }
            onToggleFlip(member.id);
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleFlip(member.id);
            }
          }}
          aria-label={`${displayName} - ${displayRole}`}
        >
          <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            {/* FRONT OF BOTANICAL ID CARD (Uniform 1:1 square portrait across all viewports) */}
            <div
              className={`card-front bg-white border ${cardFrontBorder} p-4 flex flex-col justify-between text-left`}
            >
              <div>
                {/* Top Meta Header: Role Tag with Leaf Icon & Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                      member.isSupervisor ? 'text-amber-900' : 'text-[#13281c]'
                    }`}
                  >
                    <LeafVariationIcon variant={member.leafVariant} isSupervisor={member.isSupervisor} />
                    <span>{displayTag}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
                    <svg className="w-3.5 h-3.5 text-[#16a34a]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{displayBadge}</span>
                  </span>
                </div>

                {/* Portrait / Photo Frame — Identical 1:1 Square Crop on Mobile, Tablet, Laptop, and TV */}
                <div className="relative w-full aspect-square rounded-xl bg-[#eaf5ee] overflow-hidden flex items-center justify-center border border-[#cbdcd0] group">
                  {!imgFailed ? (
                    <img
                      src={member.photo}
                      alt={`${member.name} — ${member.role}, AgroVision AI`}
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] ${
                        member.photoFrameClass || ''
                      }`}
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center border-2"
                        style={{ borderColor: member.isSupervisor ? '#b45309' : '#166534' }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-[#f4f7f5] font-display font-bold text-xl sm:text-2xl tracking-wider shadow-inner"
                          style={{ backgroundColor: member.isSupervisor ? '#0e2b19' : '#14532d' }}
                        >
                          {member.initials}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Identity Info: Name, Little Description (Role), Divider, Class 11 & Hover Hint */}
              <div className={`pt-3 ${isUrdu ? 'text-right' : 'text-left'}`}>
                <h3
                  className="font-display font-bold text-lg sm:text-xl text-[#13281c] leading-tight truncate"
                  style={
                    member.isSupervisor
                      ? {
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontFamily: 'Outfit',
                          marginLeft: '0px',
                        }
                      : undefined
                  }
                  title={displayName}
                >
                  {displayName}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#15803d] mt-0.5 truncate">
                  {displayRole}
                </p>

                <div className="botanical-divider h-[1.5px] w-full my-2.5" />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-[#3d5947]">
                    {isUrdu ? 'پی ایس ایس • کلاس 11' : 'PSS • Class 11'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#15803d] shrink-0">
                    {isUrdu ? 'بائیو کے لیے کرسر رکھیں →' : 'Hover for Bio →'}
                  </span>
                </div>
              </div>
            </div>

            {/* BACK OF BOTANICAL ID CARD: Dark Botanical Green (#0e2b19) with Off-White Text (#f4f7f5) */}
            <div
              className={`card-back bg-[#0e2b19] text-[#f4f7f5] p-5 flex flex-col justify-between border-2 border-[#1f5c37] shadow-xl ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
            >
              <div>
                <div className="border-b border-[#256d42] pb-2.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#86efac] font-bold">
                    {displayTag}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#f4f7f5] leading-snug truncate">
                    {displayName}
                  </h3>
                  <p className="text-xs text-[#bbf7d0] truncate">{displayRole}</p>
                </div>

                <div className="mt-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#86efac]">
                    {isUrdu ? 'شعبہ / مہارت' : 'Department / Specialty'}
                  </div>
                  <p className="text-xs font-medium text-[#f4f7f5]/90 mt-0.5 leading-snug">
                    {displayDepartment}
                  </p>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-[#f4f7f5]">
                  {displayBio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#256d42]">
                <p className="text-[10px] uppercase tracking-wider text-[#86efac] font-semibold mb-1.5">
                  {isUrdu ? 'اہم ذمہ داریاں' : 'Key Contributions'}
                </p>
                <ul className="space-y-1">
                  {displayFocus.map((area, idx) => (
                    <li key={idx} className="text-[11px] text-[#f4f7f5] leading-snug">
                      • {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectCreditsSection: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const supervisor = TEAM_MEMBERS.find((m) => m.isSupervisor)!;
  const members = TEAM_MEMBERS.filter((m) => !m.isSupervisor);
  const allFlipped = TEAM_MEMBERS.every((m) => Boolean(flippedCards[m.id]));

  const handleToggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFlipAll = () => {
    const nextState = !allFlipped;
    const updated: Record<string, boolean> = {};
    TEAM_MEMBERS.forEach((m) => {
      updated[m.id] = nextState;
    });
    setFlippedCards(updated);
  };

  return (
    <section
      id="project-credits"
      className="w-full py-16 sm:py-20 bg-[#edf5ef]/45 border-t border-[#cbdcd0] relative overflow-hidden"
    >
      <BotanicalBranchesOverlay variant="section" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Seamless Section Header */}
        <ScrollReveal direction="up" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#13281c] leading-[1.12] text-balance">
              <WordReveal
                text={isUrdu ? 'اس ٹیم کے معمار ذہن' : 'Meet the Minds Behind'}
                stepDelayMs={50}
              />
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3.5">
            <p className="text-sm sm:text-base text-[#2f4739] max-w-sm leading-relaxed">
              {isUrdu
                ? 'پتوں کے ذہین تجزیے اور تشخیصی ماڈلز تیار کرنے والے اساتذہ، محققین اور ڈویلپرز۔'
                : 'Educators, researchers, and developers building intelligent leaf-analysis models.'}
            </p>
            <button
              type="button"
              onClick={handleFlipAll}
              className="btn-botanical-sheen px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532d] hover:-translate-y-0.5 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#bbf7d0]" />
              <span>
                {allFlipped
                  ? isUrdu
                    ? 'کارڈز سیدھے کریں'
                    : 'Reset Cards'
                  : isUrdu
                  ? 'تمام کارڈز پلٹیں'
                  : 'Flip All Cards'}
              </span>
            </button>
          </div>
        </ScrollReveal>

        {/* TIER 1: SUPERVISOR WARDROBE BRANCH */}
        <div aria-label="Project Supervisor" className="relative mb-12 sm:mb-16">
          <div className="w-full h-7 relative pointer-events-none select-none overflow-visible">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1200 28"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M10,14 Q300,8 600,14 T1190,14"
                fill="none"
                stroke="#2f4d3a"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M10,16 Q300,10 600,16 T1190,16"
                fill="none"
                stroke="#5c7d66"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.72"
              />
              <g className="animate-leaf-sway" style={{ transformOrigin: '240px 12px' }}>
                <path d="M240,12 C226,1 204,4 200,12 C212,17 228,17 240,12 Z" fill="#14532d" />
                <path d="M240,12 C253,2 272,5 275,13 C262,17 250,17 240,12 Z" fill="#16a34a" />
              </g>
              <g className="animate-leaf-sway-subtle" style={{ transformOrigin: '600px 14px' }}>
                <path d="M600,14 C586,2 564,5 560,13 C574,18 589,18 600,14 Z" fill="#14532d" />
                <path d="M600,14 C614,2 636,5 640,13 C626,18 611,18 600,14 Z" fill="#16a34a" />
              </g>
              <g className="animate-leaf-sway" style={{ transformOrigin: '960px 13px' }}>
                <path d="M960,13 C947,2 926,5 922,13 C935,17 949,17 960,13 Z" fill="#14532d" />
                <path d="M960,13 C973,3 994,6 997,14 C983,18 970,17 960,13 Z" fill="#22c55e" opacity="0.85" />
              </g>
            </svg>
          </div>

          <div className="flex justify-center">
            <ScrollReveal direction="down" delayMs={90} className="w-full max-w-[290px] sm:max-w-[310px]">
              <HangingBotanicalCard
                member={supervisor}
                isFlipped={Boolean(flippedCards[supervisor.id])}
                isUrdu={isUrdu}
                onToggleFlip={handleToggleFlip}
                showMobileRackPeg={false}
              />
            </ScrollReveal>
          </div>
        </div>

        {/* TIER 2: CORE TEAM WARDROBE BRANCH (Visible & Animated on Mobile, Tablet, Laptop & TV) */}
        <div aria-label="Core Team" className="relative">
          <div className="w-full h-7 relative pointer-events-none select-none overflow-visible mb-2 xl:mb-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1200 28"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M10,14 C250,18 480,10 750,15 C950,19 1090,11 1190,14"
                fill="none"
                stroke="#2f4d3a"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M10,16 C250,20 480,12 750,17 C950,21 1090,13 1190,16"
                fill="none"
                stroke="#5c7d66"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.72"
              />
              <path d="M120,15 C106,4 86,7 82,14 C94,19 108,19 120,15 Z" fill="#166534" className="animate-leaf-sway" style={{ transformOrigin: '120px 15px' }} />
              <path d="M360,14 C373,3 394,5 397,13 C384,18 371,18 360,14 Z" fill="#14532d" className="animate-leaf-sway-subtle" style={{ transformOrigin: '360px 14px' }} />
              <path d="M600,13 C586,2 565,5 562,12 C574,17 588,17 600,13 Z" fill="#16a34a" className="animate-leaf-sway" style={{ transformOrigin: '600px 13px' }} />
              <path d="M840,15 C854,4 875,6 878,14 C865,19 852,19 840,15 Z" fill="#166534" className="animate-leaf-sway-subtle" style={{ transformOrigin: '840px 15px' }} />
              <path d="M1080,14 C1066,3 1046,6 1043,13 C1055,18 1068,18 1080,14 Z" fill="#14532d" className="animate-leaf-sway" style={{ transformOrigin: '1080px 14px' }} />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center">
            {members.map((member, idx) => (
              <ScrollReveal
                key={member.id}
                direction="down"
                delayMs={70 + idx * 75}
                className="w-full max-w-[290px] sm:max-w-[300px] lg:max-w-[300px] xl:max-w-none"
              >
                <HangingBotanicalCard
                  member={member}
                  isFlipped={Boolean(flippedCards[member.id])}
                  isUrdu={isUrdu}
                  onToggleFlip={handleToggleFlip}
                  showMobileRackPeg={true}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
