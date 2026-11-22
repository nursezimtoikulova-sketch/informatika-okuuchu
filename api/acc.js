// Окуучулардын аккаунттары жана прогресси. Vercel + Upstash Redis (акысыз).
// Vercel'де: Storage → Upstash for Redis кошуңуз (KV_REST_API_URL, KV_REST_API_TOKEN өзү түшөт)
// жана Environment Variables'ке TEACHER_PIN жана SECRET кошуңуз.
const crypto = require('crypto');
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SECRET = process.env.SECRET || 'nuraisha-secret';
const PIN = process.env.TEACHER_PIN || '2026';

const kv = async (...cmd) => {
  const r = await fetch(URL_, {method: 'POST', headers: {Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json'}, body: JSON.stringify(cmd)});
  const j = await r.json(); if (j.error) throw new Error(j.error); return j.result;
};
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const tokenOf = (login, hash) => sha(login + '|' + hash + '|' + SECRET);
const getU = async login => {const v = await kv('GET', 'u:' + login); return v ? JSON.parse(v) : null};
const putU = (login, u) => kv('SET', 'u:' + login, JSON.stringify(u));
const pub = u => ({login: u.login, name: u.name, grade: u.grade, prog: u.prog});

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(200).json({ok: !!URL_});
  if (!URL_) return res.status(503).json({err: 'База туташкан эмес'});
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const login = String(b.login || '').trim().toLowerCase();
    if (b.a === 'reg') {
      if (!/^[a-z0-9_.-]{3,20}$/.test(login)) return res.status(400).json({err: 'Логин: 3–20 латын тамга же цифра'});
      if (String(b.pass || '').length < 4) return res.status(400).json({err: 'Пароль кеминде 4 белги'});
      if (await getU(login)) return res.status(409).json({err: 'Мындай логин бар. Башкасын тандаңыз.'});
      const salt = crypto.randomBytes(8).toString('hex');
      const u = {login, name: String(b.name || '').slice(0, 60), grade: String(b.grade || ''), salt, hash: sha(salt + b.pass), prog: {open: {}, res: {}}};
      await putU(login, u); await kv('SADD', 'users', login);
      return res.json({token: tokenOf(login, u.hash), user: pub(u)});
    }
    if (b.a === 'in') {
      const u = await getU(login);
      if (!u || sha(u.salt + b.pass) !== u.hash) return res.status(401).json({err: 'Логин же пароль туура эмес'});
      return res.json({token: tokenOf(login, u.hash), user: pub(u)});
    }
    if (b.a === 'get' || b.a === 'save') {
      const u = await getU(login);
      if (!u || b.token !== tokenOf(login, u.hash)) return res.status(401).json({err: 'Кайра кириңиз'});
      if (b.a === 'save' && b.prog) {u.prog = b.prog; if (b.grade) u.grade = String(b.grade); await putU(login, u)}
      return res.json({user: pub(u)});
    }
    if (b.a === 'list' || b.a === 'reset') {
      if (b.pin !== PIN) return res.status(401).json({err: 'PIN туура эмес'});
      if (b.a === 'reset') {
        const u = await getU(login); if (!u) return res.status(404).json({err: 'Окуучу табылган жок'});
        u.salt = crypto.randomBytes(8).toString('hex'); u.hash = sha(u.salt + b.pass); await putU(login, u);
        return res.json({ok: true});
      }
      const ls = await kv('SMEMBERS', 'users') || [];
      const us = await Promise.all(ls.map(getU));
      return res.json({users: us.filter(Boolean).map(pub)});
    }
    res.status(400).json({err: '?'});
  } catch (e) {res.status(500).json({err: 'Сервер катасы: ' + e.message})}
};
