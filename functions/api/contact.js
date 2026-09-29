const reply = (status, data) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply(403, { ok: false });
  if (!request.headers.get('content-type')?.includes('application/json')) return reply(415, { ok: false });
  const raw = await request.text();
  if (raw.length > 10000) return reply(413, { ok: false });
  let data;
  try { data = JSON.parse(raw); } catch { return reply(400, { ok: false }); }
  if (!data || typeof data !== 'object') return reply(400, { ok: false });
  if (data.website) return reply(200, { ok: true });
  const { name, email, message, privacy } = data;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000 || privacy !== 'yes') return reply(400, { ok: false });
  // Fail closed until the mail provider is connected; never report a fake delivery.
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM) return reply(503, { ok: false });
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.CONTACT_FROM, to: ['jose1911castro@gmail.com'], reply_to: email, subject: 'Nueva consulta desde josemcastro.dev', text: `Nombre: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}` }),
      signal: AbortSignal.timeout(10000),
    });
    return reply(response.ok ? 200 : 502, { ok: response.ok });
  } catch { return reply(502, { ok: false }); }
}
