import React, { useState, useEffect } from 'react';

const DISMISSED_KEY = 'pwa_toast_dismissed_at';
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const SHOW_DELAY_MS = 30_000;

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
  return isIos && isSafari;
}

function isStandalone(): boolean {
  return (
    ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

function wasDismissedRecently(): boolean {
  const ts = localStorage.getItem(DISMISSED_KEY);
  if (!ts) return false;
  return Date.now() - parseInt(ts, 10) < DISMISS_DURATION_MS;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallToast({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const ios = isIosSafari();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (!show) return;
    if (isStandalone()) return;
    if (wasDismissedRecently()) return;
    if (!ios && !deferredPrompt) return;

    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setAnimateIn(true));
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [show, deferredPrompt, ios]);

  const dismiss = () => {
    setAnimateIn(false);
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setTimeout(() => setVisible(false), 300);
  };

  const installAndroid = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ padding: '0 16px 32px' }}
    >
      <div
        className="pointer-events-auto w-full max-w-sm flex items-center gap-4 relative"
        style={{
          background: 'var(--toast-bg)',
          borderRadius: 28,
          padding: '14px 16px',
          transform: animateIn ? 'translateY(0)' : 'translateY(120%)',
          opacity: animateIn ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        }}
      >
        <style>{`
          :root { --toast-bg: #E5E5E5; }
          .dark { --toast-bg: #ABABAB; }
        `}</style>

        {/* App icon */}
        <img
          src="/icon-192x192.png"
          alt="Juicebox"
          style={{ width: 60, height: 60, borderRadius: 14, flexShrink: 0 }}
        />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="font-['Pathway_Extreme',sans-serif] text-[14px] text-[#585858] dark:text-[#EBEBEB] mb-1"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Installiere Juicebox als App!
          </div>
          {ios ? (
            <div
              className="font-['Pathway_Extreme',sans-serif] text-[14px] text-[#585858] dark:text-[#EBEBEB]"
              style={{ fontVariationSettings: "'wdth' 100", lineHeight: 1.5 }}
            >
              → Gehe auf <em>Teilen</em><br />
              → Wähle <em>Zum Home-Bildschirm</em>
            </div>
          ) : (
            <button
              onClick={installAndroid}
              className="font-['Pathway_Extreme',sans-serif] text-[14px] text-[#585858] dark:text-[#EBEBEB] underline"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Jetzt installieren
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-[#9c9c9c] dark:text-[#CBCBCB] text-[18px]"
          style={{ lineHeight: 1, padding: '4px 6px' }}
          aria-label="Schließen"
        >
          ×
        </button>
      </div>
    </div>
  );
}
