import React, { useState } from 'react';

export default function ContactForm({ lang }) {
  const es = lang === 'es';
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    setSending(true);
    setStatus('');
    setStatusType('');
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'send');
      window.gtag?.('event', 'generate_lead', { method: 'contact_form', language: es ? 'es' : 'en' });
      window.location.assign(es ? '/contacto-enviado' : '/en/message-sent');
    } catch (error) {
      setStatusType('error');
      setStatus(error.message === 'email_not_configured'
        ? (es ? 'El envío de correo no está configurado todavía. Escríbeme a jose1911castro@gmail.com.' : 'Email delivery is not configured yet. Write to jose1911castro@gmail.com.')
        : (es ? 'No se pudo enviar. Inténtalo de nuevo o escríbeme a jose1911castro@gmail.com.' : 'The message could not be sent. Try again or email jose1911castro@gmail.com.'));
    } finally { setSending(false); }
  }
  return <form className="contact-form" onSubmit={submit} aria-label={es ? 'Cuéntame tu proyecto' : 'Tell me about your project'}>
    <div className="form-heading"><span>{es ? 'Tu próxima idea empieza aquí' : 'Your next idea starts here'}</span><span aria-hidden="true">↗</span></div>
    <div className="form-row"><label>{es ? 'Nombre' : 'Name'}<input name="name" autoComplete="name" required maxLength={100} placeholder={es ? 'Tu nombre' : 'Your name'}/></label><label>Email<input name="email" type="email" autoComplete="email" spellCheck={false} required maxLength={254} placeholder={es ? 'tu@email.com' : 'you@email.com'}/></label></div>
    <label>{es ? 'Mensaje' : 'Message'}<textarea name="message" required minLength={10} maxLength={5000} rows={3} placeholder={es ? 'Cuéntame tu proyecto...' : 'Tell me about your project...'}/></label>
    <label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="form-privacy"><input name="privacy" type="checkbox" required value="yes"/><span>{es ? 'Acepto la ' : 'I accept the '}<a href="/privacidad.html" target="_blank" rel="noreferrer">{es ? 'política de privacidad' : 'privacy policy'}</a>.</span></label>
    <button className="primary-action" disabled={sending} type="submit">{sending ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar mensaje' : 'Send message')}<span aria-hidden="true">→</span></button>
    <p className={`form-status${statusType ? ` ${statusType}` : ''}`} role="status" aria-live="polite" aria-atomic="true">{status}</p>
  </form>;
}
