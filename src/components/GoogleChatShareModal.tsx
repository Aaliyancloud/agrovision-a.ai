import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Sparkles
} from 'lucide-react';
import { DiagnosisResult } from '../types/disease';
import { googleSignIn, getAccessToken, logoutGoogle } from '../services/googleAuth';
import {
  formatDiagnosticChatMessage,
  listChatSpaces,
  sendChatMessageToSpace,
  sendChatMessageViaWebhook,
  ChatSpace
} from '../services/googleChat';
import { useLanguage } from '../context/LanguageContext';

interface GoogleChatShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DiagnosisResult;
}

export const GoogleChatShareModal: React.FC<GoogleChatShareModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  const { isUrdu } = useLanguage();

  const [authMethod, setAuthMethod] = useState<'workspace' | 'webhook'>('workspace');
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [customSpaceId, setCustomSpaceId] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmStep, setShowConfirmStep] = useState(false);

  // Check initial token + lock body scroll + escape handler
  useEffect(() => {
    if (!isOpen) return;
    setSendSuccess(false);
    setErrorMessage(null);
    setShowConfirmStep(false);
    getAccessToken().then((token) => {
      if (token) {
        setUserToken(token);
        loadSpaces(token);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const loadSpaces = async (token: string) => {
    setIsLoadingSpaces(true);
    setErrorMessage(null);
    try {
      const fetchedSpaces = await listChatSpaces(token);
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0) {
        setSelectedSpace(fetchedSpaces[0].name);
      }
    } catch (err: any) {
      console.warn('Could not list spaces automatically:', err);
      // If listing fails (e.g. chat app config needed or permissions), fallback to custom space ID or webhook
      if (err.message && err.message.includes('Google Chat app not found')) {
        setErrorMessage(
          isUrdu
            ? 'گوگل چیٹ ایپ سیٹ اپ درکار ہے: آپ کلاؤڈ کنسول میں چیٹ کنفیگریشن مکمل کریں یا براہ راست چیٹ ویب ہک استعمال کریں۔'
            : 'Google Chat app configuration prerequisite: You can enter a Space ID directly or use an Incoming Webhook.'
        );
      }
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        setUserToken(authResult.accessToken);
        setUserEmail(authResult.user.email);
        loadSpaces(authResult.accessToken);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUserToken(null);
    setUserEmail(null);
    setSpaces([]);
  };

  const targetSpaceId = selectedSpace || customSpaceId.trim();
  const formattedPreview = formatDiagnosticChatMessage(result, customNote);

  // Trigger confirmation dialog before sending (workspace-integration mandatory requirement)
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMethod === 'workspace') {
      if (!userToken) {
        setErrorMessage(isUrdu ? 'براہ کرم پہلے گوگل سے سائن ان کریں۔' : 'Please sign in with Google first.');
        return;
      }
      if (!targetSpaceId) {
        setErrorMessage(isUrdu ? 'براہ کرم گوگل چیٹ اسپیس منتخب کریں یا درج کریں۔' : 'Please select or enter a Google Chat Space.');
        return;
      }
    } else {
      if (!webhookUrl.trim() || !webhookUrl.startsWith('https://chat.googleapis.com')) {
        setErrorMessage(
          isUrdu
            ? 'براہ کرم درست گوگل چیٹ ویب ہک یو آر ایل درج کریں۔'
            : 'Please enter a valid Google Chat webhook URL (starts with https://chat.googleapis.com).'
        );
        return;
      }
    }

    setShowConfirmStep(true);
  };

  // Explicit user confirmation action
  const handleConfirmedSend = async () => {
    setIsSending(true);
    setErrorMessage(null);

    try {
      if (authMethod === 'workspace') {
        await sendChatMessageToSpace(targetSpaceId, formattedPreview, userToken!);
      } else {
        await sendChatMessageViaWebhook(webhookUrl.trim(), formattedPreview);
      }

      setSendSuccess(true);
      setShowConfirmStep(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch report to Google Chat.');
      setShowConfirmStep(false);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-sm"
      style={{ zIndex: 9990 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-chat-modal-title"
    >
      <div className="flex min-h-full w-full items-center justify-center px-3 sm:px-6 pt-20 sm:pt-24 pb-4 sm:pb-6">
        <div
          className="relative w-full max-w-xl my-auto bg-[#faf8f2] rounded-3xl border border-[#cbdcd0] shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-6.25rem)] sm:max-h-[calc(100dvh-7.5rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 px-5 sm:px-6 py-4 bg-white border-b border-[#cbdcd0] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <h3
                  id="google-chat-modal-title"
                  className="font-display font-bold text-base text-[#13281c] flex items-center gap-2 flex-wrap"
                >
                  <span>{isUrdu ? 'گوگل چیٹ پر رپورٹ بھیجیں' : 'Send to Google Chat'}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                    Workspace
                  </span>
                </h3>
                <p className="text-xs text-[#3d5947] truncate">
                  {isUrdu
                    ? 'بیماری کی فوری الرٹ ٹیم یا زرعی ماہرین کے اسپیس پر شیئر کریں'
                    : 'Dispatch verified pathology alert directly to your team space'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#edf5ef] text-[#3d5947] hover:text-[#13281c] transition-colors shrink-0 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="min-h-0 flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#3d5947]">
          {/* Success Banner */}
          {sendSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-emerald-950">
                {isUrdu ? 'رپورٹ گوگل چیٹ پر کامیابی سے بھیج دی گئی!' : 'Report Dispatched to Google Chat!'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                {isUrdu
                  ? `ٹماٹر کے پودے کی تشخیص (${result.diseaseName}) کا تفصیلی الرٹ منتخب کردہ گوگل چیٹ اسپیس پر منتقل کر دیا گیا ہے۔`
                  : `Field diagnostic alert for ${result.diseaseName} has been posted to your Google Chat space.`}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setSendSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
                >
                  {isUrdu ? 'ایک اور الرٹ بھیجیں' : 'Send Another'}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-[#cbdcd0] hover:bg-[#edf5ef] text-[#13281c] font-semibold rounded-xl transition-all"
                >
                  {isUrdu ? 'بند کریں' : 'Done'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Method Selector Tabs */}
              <div className="flex items-center gap-2 p-1 bg-[#edf5ef] rounded-2xl border border-[#cbdcd0]">
                <button
                  type="button"
                  onClick={() => setAuthMethod('workspace')}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                    authMethod === 'workspace'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-[#3d5947] hover:text-[#13281c]'
                  }`}
                >
                  {isUrdu ? 'گوگل ورک اسپیس سائن ان (OAuth)' : 'Google Workspace Sign-In'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('webhook')}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                    authMethod === 'webhook'
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-[#3d5947] hover:text-[#13281c]'
                  }`}
                >
                  {isUrdu ? 'چیٹ اسپیس ویب ہک (Webhook)' : 'Direct Space Webhook'}
                </button>
              </div>

              {/* Workspace OAuth Section */}
              {authMethod === 'workspace' && (
                <div className="space-y-4">
                  {!userToken ? (
                    <div className="p-5 rounded-2xl bg-white border border-[#cbdcd0] text-center space-y-3">
                      <p className="text-xs text-[#3d5947] leading-relaxed">
                        {isUrdu
                          ? 'اپنے گوگل ورک اسپیس اکاؤنٹ سے سائن ان کریں تاکہ آپ کی اجازت سے آپ کے چیٹ اسپیسز میں رپورٹ بھیجی جا سکے۔'
                          : 'Sign in with your Google account to send diagnostic reports to your Google Chat spaces, with your permission.'}
                      </p>

                      {/* Official Google Sign-In Button */}
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isAuthenticating}
                        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-xs text-xs font-semibold text-gray-700 transition-all active:scale-95 mx-auto"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 48 48">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white border border-[#cbdcd0] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-[#13281c]">{userEmail || 'Google Account Connected'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>{isUrdu ? 'لاگ آؤٹ' : 'Sign out'}</span>
                        </button>
                      </div>

                      {/* Space Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#13281c] mb-1">
                          {isUrdu ? 'چیٹ اسپیس منتخب کریں:' : 'Select Google Chat Space:'}
                        </label>
                        {spaces.length > 0 ? (
                          <select
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] text-xs text-[#13281c] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {spaces.map((sp) => (
                              <option key={sp.name} value={sp.name}>
                                {sp.displayName} ({sp.name})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={customSpaceId}
                              onChange={(e) => setCustomSpaceId(e.target.value)}
                              placeholder="e.g. spaces/AAAAAAAAAAA or space ID"
                              className="w-full px-3 py-2 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] text-xs text-[#13281c] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                            <p className="text-[10px] text-[#3d5947]">
                              {isUrdu
                                ? 'گوگل چیٹ کے اسپیس کی یو آر ایل سے اسپیس آئی ڈی درج کریں (جیسے spaces/AAAA123)'
                                : 'Enter your Google Chat Space name (e.g. spaces/AAAA1234567)'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Webhook Method Section */}
              {authMethod === 'webhook' && (
                <div className="p-4 rounded-2xl bg-white border border-[#cbdcd0] space-y-2">
                  <label className="block text-[11px] font-bold text-[#13281c]">
                    {isUrdu ? 'گوگل چیٹ اسپیس ویب ہک یو آر ایل:' : 'Google Chat Space Webhook URL:'}
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://chat.googleapis.com/v1/spaces/.../messages?key=...&token=..."
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] text-xs text-[#13281c] focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-[#3d5947] leading-relaxed">
                    {isUrdu
                      ? 'گوگل چیٹ میں اسپیس کی سیٹنگز > ایپس اور انٹیگریشنز > ویب ہک شامل کریں سے لنک کاپی کریں۔'
                      : 'Copy from Google Chat: Space Settings > Apps & Integrations > Manage Webhooks > Add Webhook.'}
                  </p>
                </div>
              )}

              {/* Inspector Field Note */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#13281c]">
                  {isUrdu ? 'فیلڈ نوٹ یا کھیت کا مقام (اختیاری):' : 'Field Note or Plot Location (Optional):'}
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'مثال: مشرقی گرین ہاؤس - لائن 4'
                      : 'e.g. Greenhouse East, Row 4 - Specimen inspected morning'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#cbdcd0] text-xs text-[#13281c] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Dispatch Preview Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#13281c]">
                  <span>{isUrdu ? 'گوگل چیٹ الرٹ پیش منظر:' : 'Chat Message Preview:'}</span>
                  <span className="font-mono text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {result.diseaseName}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#13281c] text-emerald-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto border border-emerald-900 shadow-inner">
                  {formattedPreview}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Confirmation Dialog (Mandatory per workspace-integration skill) */}
              {showConfirmStep ? (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-amber-950">
                        {isUrdu ? 'کیا آپ یہ رپورٹ گوگل چیٹ پر بھیجنا چاہتے ہیں؟' : 'Confirm Dispatch to Google Chat'}
                      </h4>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        {isUrdu
                          ? `یہ عمل آپ کی طرف سے منتخب کردہ اسپیس پر "${result.diseaseName}" کی تشخیص کا تفصیلی پیغام شائع کرے گا۔`
                          : `This action will post the botanical diagnosis report for "${result.diseaseName}" to your designated Google Chat space on your behalf.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowConfirmStep(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-white text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
                    >
                      {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmedSend}
                      disabled={isSending}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'ہاں، ابھی بھیجیں' : 'Confirm & Dispatch'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-[#cbdcd0] hover:bg-[#edf5ef] text-xs font-semibold text-[#13281c] transition-all"
                  >
                    {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                  </button>

                  <button
                    type="button"
                    onClick={handleInitiateSend}
                    disabled={isSending || (authMethod === 'workspace' && !userToken)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'گوگل چیٹ پر بھیجیں' : 'Review & Send'}</span>
                  </button>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
