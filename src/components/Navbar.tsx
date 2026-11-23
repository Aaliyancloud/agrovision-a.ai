import React, { useState } from 'react';
import { Leaf, X, Sparkles, Globe, Compass, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onScanClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScanClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, toggleLanguage, t, isUrdu } = useLanguage();

  const handleMobileScanClick = () => {
    setMobileMenuOpen(false);
    onScanClick();
  };

  const navItems = [
    { href: '#why-leaves', label: isUrdu ? 'پتے کی اہمیت' : 'Why Leaves' },
    { href: '#weather', label: isUrdu ? 'موسم' : 'Weather' },
    { href: '#inside-leaf', label: isUrdu ? 'اندرونی ساخت' : 'Inside Leaf' },
    { href: '#smart-sensors', label: t.nav.smartSensors },
    { href: '#care-library', label: isUrdu ? 'نگہداشت' : 'Care Library' },
    { href: '#diagnostic', label: t.nav.leafScanner },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#faf8f2]/92 backdrop-blur-md border-b border-[#cbdcd0]/70 transition-colors">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 h-16 sm:h-18">
        {/* Zone 1: Original Leaf Emblem & Wordmark */}
        <a
          href="#top"
          aria-label="AgroVision AI home"
          className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-[#13281c] group whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#edf5ef] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Leaf className="w-4.5 h-4.5 text-[#166534] animate-leaf-sway" />
          </div>

          <span className="font-display tracking-tight text-lg sm:text-xl font-bold text-[#13281c] whitespace-nowrap">
            {isUrdu ? 'ایگرو وژن ' : 'AgroVision '}
            <span className="text-[#166534]">AI</span>
          </span>
        </a>

        {/* Zone 2: Clean, Modern, Well-Spaced Text Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex flex-1 items-center justify-center min-w-0 gap-4 2xl:gap-6 text-[13px] font-medium text-[#2f4739]"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-1 hover:text-[#166534] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-[#166534] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"
              />
            </a>
          ))}
        </nav>

        {/* Zone 3: Right Controls Cluster (Safely Bounded Within Viewport) */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
          {/* Bilingual Switcher */}
          <div
            className="hidden sm:flex relative items-center bg-[#edf5ef] p-0.5 rounded-full border border-[#cbdcd0] select-none cursor-pointer shrink-0"
            onClick={toggleLanguage}
            title={isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleLanguage();
            }}
          >
            <div
              className={`absolute top-0.5 bottom-0.5 w-[34px] sm:w-[38px] bg-white rounded-full shadow-xs transition-all duration-300 ease-out border border-[#cbdcd0] ${
                language === 'ur' ? 'left-[35px] sm:left-[39px]' : 'left-0.5'
              }`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLanguage('en');
              }}
              className={`relative z-10 w-[34px] sm:w-[38px] py-1 text-[11px] sm:text-xs font-bold text-center rounded-full transition-colors ${
                language === 'en' ? 'text-[#13281c]' : 'text-[#2f4739] hover:text-[#13281c]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLanguage('ur');
              }}
              className={`relative z-10 w-[34px] sm:w-[38px] py-1 text-[11px] sm:text-xs font-bold text-center rounded-full transition-colors ${
                language === 'ur' ? 'text-[#13281c]' : 'text-[#2f4739] hover:text-[#13281c]'
              }`}
            >
              اردو
            </button>
          </div>

          <div className="flex shrink-0">
            <PWAInstallButton compact />
          </div>

          {/* Clean Modern Green Leaf Action Button Inside Navbar */}
          <button
            type="button"
            onClick={onScanClick}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#166534] hover:bg-[#14532d] active:scale-95 rounded-xl shadow-xs transition-all shrink-0 whitespace-nowrap cursor-pointer"
            title={t.nav.checkLeafBtn}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#bbf7d0] shrink-0" />
            <span>{t.nav.checkLeafBtn}</span>
          </button>

          {/* Mobile & Tablet Navigation Trigger (< 1280px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#edf5ef] text-[#13281c] border border-[#cbdcd0] rounded-xl transition-colors active:scale-95 shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            title="Navigation Menu"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-4 h-4 text-[#166534] shrink-0" />
                <span className="text-xs font-semibold text-[#13281c]">
                  {isUrdu ? 'بند' : 'Close'}
                </span>
              </>
            ) : (
              <>
                <Leaf className="w-4 h-4 text-[#166534] shrink-0" />
                <span className="text-xs font-semibold text-[#13281c]">
                  {isUrdu ? 'مینو' : 'Menu'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Drawer Menu (< 1280px) */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full border-b border-[#cbdcd0] bg-[#faf8f2] px-5 sm:px-8 py-5 flex flex-col gap-4 text-sm animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-white border border-[#cbdcd0] flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#13281c] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#166534]" />
              <span>{isUrdu ? 'زبان منتخب کریں:' : 'Language / زبان:'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  language === 'en'
                    ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                    : 'bg-[#faf8f2] text-[#2f4739] border-[#cbdcd0] hover:bg-[#edf5ef]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  language === 'ur'
                    ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                    : 'bg-[#faf8f2] text-[#2f4739] border-[#cbdcd0] hover:bg-[#edf5ef]'
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleMobileScanClick}
              className="flex-1 py-3 px-5 text-center text-xs sm:text-sm font-bold text-white bg-[#166534] hover:bg-[#14532d] active:scale-95 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{t.nav.checkLeafBtn}</span>
            </button>
            <PWAInstallButton />
          </div>

          <nav
            aria-label="Mobile navigation"
            className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-[#cbdcd0]/70"
          >
            <div className="sm:col-span-2 text-[11px] font-mono text-[#2f4739] font-semibold px-3 py-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#166534]" />
              <span>{isUrdu ? 'سائٹ نیویگیشن' : 'Site Navigation'}</span>
            </div>

            {[
              { href: '#why-leaves', label: t.nav.whyLeaves },
              { href: '#weather', label: t.nav.weather },
              { href: '#inside-leaf', label: t.nav.insideLeaf },
              { href: '#smart-sensors', label: t.nav.smartSensors },
              { href: '#care-library', label: t.nav.careLibrary },
              { href: '#diagnostic', label: t.nav.leafScanner },
              { href: '#how-ai-sees', label: t.nav.howAiWorks },
              { href: '#questions', label: t.nav.exhibition },
              { href: '#project-credits', label: t.nav.credits },
              { href: '#investors', label: isUrdu ? 'پروجیکٹ انویسٹرز' : 'Project Investors' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#2f4739] hover:text-[#13281c] hover:bg-[#edf5ef] px-3.5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2f4739]/60" />
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
