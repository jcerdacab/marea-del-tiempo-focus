// Adaptación de las funciones y la paleta del reloj original.
const coloresHora = ["#071426", "#101934", "#172442", "#123847", "#24475A", "#4B526F", "#71658E", "#C06C84", "#E67C73", "#F29D67", "#F5C363", "#D9D96C", "#A7D88D", "#6FD2AF", "#55CDD2", "#54B7E5", "#588FDB", "#716FC4", "#9A67B5", "#C55D91", "#B94F68", "#743C64", "#433453", "#202640"];
function setup() { const canvas = createCanvas(300, 150); canvas.parent('visual'); pixelDensity(1); initApp(); }
function draw() {
  const now = new Date(); const h = now.getHours() + now.getMinutes() / 60;
  const progress = constrain(1 - state.remaining / (state.duration * 60000), 0, 1);
  background(coloresHora[now.getHours()]); dibujarAstro(h); dibujarMarea(progress); dibujarPulso(progress, now.getSeconds() + now.getMilliseconds()/1000);
}
function dibujarAstro(h) {
  const x = map(h, 0, 24, width * .15, width * .85);
  const y = height * .34 - sin(map(h, 0, 24, 0, PI)) * height * .18;
  noStroke(); fill(255, 22); circle(x,y,32); fill(255,45); circle(x,y,20); fill(255,210); circle(x,y,10);
}
function nivelMarea(progress) { return map(progress, 0, 1, height * .82, height * .48); }
function onda(x) { return sin(x * .018 + frameCount * .018) * 5; }
function dibujarMarea(progress) {
  const nivel = nivelMarea(progress); noStroke(); fill(7,20,38,155); beginShape();
  for (let x=0; x<=width; x+=5) vertex(x,nivel+onda(x));
  vertex(width,height); vertex(0,height); endShape(CLOSE);
  noFill(); stroke(255,100); strokeWeight(1); beginShape(); for (let x=0; x<=width; x+=5) vertex(x,nivel+onda(x)); endShape();
}
function dibujarPulso(progress, segundos) {
  const x = map(segundos, 0, 60, width*.14, width*.86), y = nivelMarea(progress) + onda(x) - height*.02;
  stroke(255,45); strokeWeight(5); line(x,y-12,x,y+12); stroke(255,225); strokeWeight(2); line(x,y-7,x,y+7); noStroke();
}
