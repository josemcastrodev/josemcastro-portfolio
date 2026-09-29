import React, { useState } from 'react';

export default function ContactForm({ lang }) {
  const es = lang === 'es';
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    setSending(true);
    setStatus('');
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error('send');
      setStatus(es ? 'Mensaje enviado. Gracias por contarme tu idea.' : 'Message sent. Thank you for sharing your idea.');
      form.reset();
    } catch {
      setStatus(es ? 'No se ha enviado. Puedes escribir a jose1911castro@gmail.com o intentarlo de nuevo.' : 'Not sent. Email jose1911castro@gmail.com or try again.');
    } finally { setSending(false); }
  }
  return <form className="contact-form" onSubmit={submit} aria-label={es ? 'Cuéntame tu proyecto' : 'Tell me about your project'}>
    <div className="form-heading"><span>{es ? 'Tu próxima idea empieza aquí' : 'Your next idea starts here'}</span><span aria-hidden="true">↗</span></div>
    <div className="form-row"><label>{es ? 'Tu nombre' : 'Your name'}<input name="name" autoComplete="name" required maxLength={100}/></label><label>Email<input name="email" type="email" autoComplete="email" spellCheck={false} required maxLength={254}/></label></div>
    <label>{es ? '¿Qué tienes en mente?' : 'What do you have in mind?'}<textarea name="message" required minLength={10} maxLength={5000} rows={3} placeholder={es ? 'Tu negocio, la web que necesitas, una idea…' : 'Your business, the website you need, an idea…'}/></label>
    <label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="form-privacy"><input name="privacy" type="checkbox" required value="yes"/><span>{es ? 'He leído la ' : 'I have read the '}<a href="/privacidad.html" target="_blank" rel="noreferrer">{es ? 'política de privacidad' : 'privacy policy'}</a>.</span></label>
    <button className="primary-action" disabled={sending} type="submit">{sending ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar mensaje' : 'Send message')}<span aria-hidden="true">→</span></button>
    <p className="form-status" role="status">{status}</p>
  </form>;
}
