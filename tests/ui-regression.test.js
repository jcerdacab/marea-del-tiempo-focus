const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = source('index.html');
assert.doesNotMatch(html, /<form\b/i);
for (const id of ['start', 'pause', 'reset']) assert.match(html, new RegExp(`<button[^>]*id="${id}"[^>]*type="button"`));
let saved, now = 1000000, downloads = 0, writes = 0;
function openPopup() {
  const elements = {};
  for (const id of ['remaining','status','duration','start','pause','reset','message']) {
    elements[id] = {textContent:'', value:'', disabled:false, handlers:{}, addEventListener(type, fn) { this.handlers[type] = fn; }, add() {}};
  }
  let remainingText = '', remainingWrites = 0;
  Object.defineProperty(elements.remaining, 'textContent', {
    get() { return remainingText; },
    set(value) { remainingText = value; remainingWrites++; }
  });
  elements.remaining.writes = () => remainingWrites;
  const modes = ['focus','break'].map(value => ({value, checked:false, handlers:{}, addEventListener(type, fn) { this.handlers[type] = fn; }}));
  let interval;
  const context = {
    document: {getElementById: id => elements[id], querySelectorAll: () => modes,
      querySelector: selector => modes.find(m => selector.includes(`value="${m.value}"`))},
    Option: function(text, value) { this.text = text; this.value = value; },
    storeItem: (key, value) => { assert.equal(key, 'marea-focus-state-v1'); saved = structuredClone(value); writes++; },
    getItem: () => saved === undefined ? null : structuredClone(saved),
    setInterval: fn => { assert.equal(interval, undefined); interval = fn; },
    Date: class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } },
    createCanvas: (w,h) => { assert.equal(w,300); assert.equal(h,150); return {parent: id => assert.equal(id,'visual')}; },
    pixelDensity: () => {}, width:300, height:150, frameCount:1, PI:Math.PI,
    constrain: (x,a,b) => Math.max(a,Math.min(b,x)), map: (v,a,b,c,d) => c+(v-a)*(d-c)/(b-a), sin:Math.sin,
    background: () => {}, noStroke: () => {}, fill: () => {}, circle: () => {}, beginShape: () => {},
    vertex: () => {}, endShape: () => {}, noFill: () => {}, stroke: () => {}, strokeWeight: () => {}, line: () => {}, CLOSE:'close'
  };
  vm.createContext(context);
  vm.runInContext(source('timer.js'), context);
  vm.runInContext(source('app.js'), context);
  vm.runInContext(source('sketch.js'), context);
  // p5 global mode overwrites window.save after application scripts load.
  Object.defineProperty(context, 'save', {configurable:true, value: () => { downloads++; }});
  context.setup(); context.draw();
  return {elements, modes, tick: () => interval(), draw: () => context.draw()};
}
let p = openPopup();
assert.equal(p.elements.remaining.textContent, '25:00');
const initialWrites = p.elements.remaining.writes();
p.tick(); p.tick();
assert.equal(p.elements.remaining.writes(), initialWrites);
p.modes[1].handlers.change(); assert.equal(saved.mode, 'break'); assert.equal(saved.duration, 5);
p.elements.duration.value = '10'; p.elements.duration.handlers.change(); assert.equal(saved.duration,10);
p.elements.start.handlers.click(); assert.equal(saved.status, 'running');
now += 10000; p.tick(); assert.equal(p.elements.remaining.textContent, '09:50');
const writesAfterSecond = p.elements.remaining.writes(); p.tick();
assert.equal(p.elements.remaining.writes(), writesAfterSecond);
p.elements.pause.handlers.click(); assert.equal(saved.status, 'paused'); assert.equal(saved.remaining,590000);
now += 50000; p = openPopup(); assert.equal(p.elements.remaining.textContent, '09:50');
p.elements.pause.handlers.click(); assert.equal(saved.status, 'running');
p = openPopup(); assert.equal(p.elements.status.textContent, 'En curso');
p.elements.reset.handlers.click(); assert.equal(saved.status, 'ready');
p.elements.start.handlers.click(); now += 600001; p.tick(); assert.equal(saved.status, 'completed');
p = openPopup(); assert.equal(p.elements.status.textContent, 'Completado'); p.draw();
assert.equal(downloads,0); assert.ok(writes >= 7);
console.log('OK: eventos, persistencia simulada, reapertura, finalizacion, dibujo y ninguna llamada a save de p5');
