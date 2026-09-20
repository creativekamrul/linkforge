'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/lib/icons';
import { cx } from '@/lib/utils';

const BUTTON =
  'lf-link lf-card lf-focus inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-medium no-underline';

type ActionButtonProps = {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

function ActionButton({ label, icon, href, onClick, active }: ActionButtonProps) {
  const className = cx(BUTTON, active && 'lf-featured');
  const style = active ? { color: '#ffffff' } : { color: 'var(--muted)' };
  const content = (
    <>
      <Icon name={icon} className="h-4 w-4" />
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {content}
    </button>
  );
}

export function ActionBar({
  siteUrl,
  name,
  showShare,
  showQr,
  showContact,
}: {
  siteUrl: string;
  name: string;
  showShare: boolean;
  showQr: boolean;
  showContact: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [shareable, setShareable] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    setShareable(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!qrOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQrOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [qrOpen]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
    } catch {
      window.prompt('Copy this link', siteUrl);
    }
  }, [siteUrl]);

  const share = useCallback(async () => {
    try {
      await navigator.share({ url: siteUrl, title: name });
    } catch {
      // The user dismissed the share sheet - nothing to do.
    }
  }, [siteUrl, name]);

  if (!showShare && !showQr && !showContact) return null;

  const qrSrc = '/qr?target=' + encodeURIComponent(siteUrl);

  return (
    <>
      <div
        className="lf-enter flex flex-wrap items-center justify-center gap-2"
        style={{ animationDelay: '640ms' }}
      >
        {showShare && shareable ? (
          <ActionButton label="Share" icon="share" onClick={share} />
        ) : null}

        {showShare ? (
          <ActionButton
            label={copied ? 'Copied' : 'Copy link'}
            icon={copied ? 'check' : 'copy'}
            onClick={copy}
            active={copied}
          />
        ) : null}

        {showQr ? (
          <ActionButton label="QR code" icon="qr" onClick={() => setQrOpen(true)} />
        ) : null}

        {showContact ? <ActionButton label="Save contact" icon="contact" href="/vcard" /> : null}
      </div>

      {qrOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="QR code"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setQrOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
          />
          <div
            className="lf-card relative z-10 w-full max-w-[300px] p-5 text-center"
            style={{ background: 'var(--surface-strong)' }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'var(--muted)' }}
            >
              Scan to open
            </p>
            <img
              src={qrSrc}
              alt={'QR code for ' + siteUrl}
              width={512}
              height={512}
              className="mx-auto mt-4 h-56 w-56 rounded-xl"
            />
            <p className="mt-4 break-all text-[11.5px]" style={{ color: 'var(--muted)' }}>
              {siteUrl}
            </p>
            <button
              type="button"
              onClick={() => setQrOpen(false)}
              className="lf-focus mt-4 w-full rounded-full px-4 py-2.5 text-[13px] font-medium"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
