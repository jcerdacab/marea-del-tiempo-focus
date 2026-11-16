// Máquina de estados independiente del DOM y del reloj del navegador.
const Timer = (() => {
  const initial = (mode = 'focus', duration = mode === 'focus' ? 25 : 5) => ({version: 1, mode, duration, status: 'ready', remaining: duration * 60000, endAt: null});
  const validDuration = n => Number.isInteger(n) && n >= 5 && n <= 60 && n % 5 === 0;
  function valid(s, now = Date.now()) {
    if (!s || typeof s !== 'object' || s.version !== 1 || !['focus','break'].includes(s.mode) || !validDuration(s.duration) || !['ready','running','paused','completed'].includes(s.status) || !Number.isFinite(s.remaining) || s.remaining < 0 || s.remaining > s.duration * 60000) return false;
    // Una fecha futura no puede superar el tiempo que se guardó al iniciar o reanudar.
    if (s.status === 'running') return s.remaining > 0 && Number.isSafeInteger(s.endAt) && s.endAt > 0 && s.endAt - now <= s.remaining;
    if (s.endAt !== null) return false;
    if (s.status === 'ready') return s.remaining === s.duration * 60000;
    if (s.status === 'completed') return s.remaining === 0;
    return s.remaining > 0;
  }
  function sync(s, now) {
    if (s.status !== 'running') return {...s};
    const remaining = Math.max(0, Math.min(s.remaining, s.endAt - now));
    return remaining === 0 ? {...s, status: 'completed', remaining: 0, endAt: null} : {...s, remaining};
  }
  function restore(value, now) { return sync(valid(value, now) ? value : initial(), now); }
  function transition(state, action, now, value) {
    let s = sync(state, now);
    if (action === 'mode' && ['focus','break'].includes(value)) return initial(value);
    if (action === 'duration' && validDuration(value)) return initial(s.mode, value);
    if (action === 'reset') return initial(s.mode, s.duration);
    if (action === 'start' && s.status === 'ready') return {...s, status: 'running', endAt: now + s.remaining};
    if (action === 'pause' && s.status === 'running') return {...s, status: 'paused', endAt: null};
    if (action === 'resume' && s.status === 'paused') return {...s, status: 'running', endAt: now + s.remaining};
    return s;
  }
  return {initial, valid, validDuration, sync, restore, transition};
})();
if (typeof module !== 'undefined') module.exports = Timer;
