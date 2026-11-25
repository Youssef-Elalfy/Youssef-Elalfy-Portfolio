'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const { dict } = useI18n();
  const t = dict.contact.form;
  const [status, setStatus] = useState<Status>('idle');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    // Native validation messages are rendered by the browser in the page language (lang attribute).
    if (!form.reportValidity()) return;
    setStatus('sending');
    const payload = new FormData(form);
    // Web3Forms access keys are public form identifiers, not secret API credentials.
    payload.set('access_key', 'bd8b9b06-3ef9-404f-92c8-384068f17231');
    payload.set('subject', t.subject);
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload, signal: AbortSignal.timeout(15000) });
      const result: { success?: boolean } = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Submission rejected');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} aria-label={t.label}>
      <div className="form-row">
        <label>{t.name}<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>{t.email}<input name="email" type="email" autoComplete="email" required maxLength={200} dir="ltr" /></label>
      </div>
      <label>{t.topic}
        <select name="service" defaultValue="">
          <option value="" disabled>{t.choose}</option>
          {t.options.map(option => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>{t.details}<textarea name="message" placeholder={t.detailsPlaceholder} required minLength={10} maxLength={5000} rows={5} dir="auto" /></label>
      <input type="checkbox" name="botcheck" className="honeypot" tabIndex={-1} aria-hidden="true" autoComplete="off" />
      <div className="form-bottom">
        <button className="btn btn-lime" type="submit" disabled={status === 'sending'}>{status === 'sending' ? t.sending : t.send}</button>
        <div className={`form-status ${status}`} role="status" aria-live="polite">
          {status === 'success' && <><CheckCircle2 size={17} aria-hidden="true" /> {t.success}</>}
          {status === 'error' && <><AlertCircle size={17} aria-hidden="true" /> {t.error} <a href="mailto:youssefalfi94@gmail.com">{t.emailMe}</a>.</>}
        </div>
      </div>
    </form>
  );
}
