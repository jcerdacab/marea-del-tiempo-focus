const KEY = 'marea-focus-state-v1';
let state = Timer.initial();
const el = {};

function guardarEstadoSesion() {
  try {
    storeItem(KEY, state);
    el.message.textContent = '';
  } catch (_) {
    el.message.textContent = 'No se pudo guardar la sesión en este navegador.';
  }
}

function render() {
  const seconds = Math.ceil(state.remaining / 1000);
  const tiempo = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  if (el.remaining.textContent !== tiempo) {
    el.remaining.textContent = tiempo;
  }
  const estado = {
    ready: 'Preparado',
    running: 'En curso',
    paused: 'Pausado',
    completed: 'Completado'
  }[state.status];
  if (el.status.textContent !== estado) {
    el.status.textContent = estado;
  }
  el.duration.value = String(state.duration);
  document.querySelector(`input[name="mode"][value="${state.mode}"]`).checked = true;
  el.start.disabled = state.status !== 'ready';
  el.pause.disabled = !['running', 'paused'].includes(state.status);
  el.pause.textContent = state.status === 'paused' ? 'Reanudar' : 'Pausar';
}

function change(action, value) {
  state = Timer.transition(state, action, Date.now(), value);
  guardarEstadoSesion();
  render();
}

function updateTimer() {
  const before = state.status;
  state = Timer.sync(state, Date.now());
  if (before !== state.status) {
    guardarEstadoSesion();
  }
  render();
}

function initApp() {
  for (const id of ['remaining', 'status', 'duration', 'start', 'pause', 'reset', 'message']) {
    el[id] = document.getElementById(id);
  }
  for (let n = 5; n <= 60; n += 5) {
    el.duration.add(new Option(`${n} minutos`, n));
  }
  try {
    state = Timer.restore(getItem(KEY), Date.now());
  } catch (_) {
    state = Timer.initial();
    el.message.textContent = 'No se pudo leer la sesión guardada.';
  }
  document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', () => change('mode', input.value)));
  el.duration.addEventListener('change', () => change('duration', Number(el.duration.value)));
  el.start.addEventListener('click', () => change('start'));
  el.pause.addEventListener('click', () => change(state.status === 'paused' ? 'resume' : 'pause'));
  el.reset.addEventListener('click', () => change('reset'));
  render();
  setInterval(updateTimer, 250);
}
