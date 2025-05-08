let burbujas = [];
let ondas = [];
let particulas = [];
let tiempo = 0;
let textoPushX = 0;
let textoPushY = 0;
let glowBlurActual = 5;
let textoColorActual = 220;
let sizeTextoActual = 48;

function setup() {
  let canvas = createCanvas(windowWidth, 500);
  canvas.parent(document.querySelector('.p5-container'));
  textFont('Montserrat');
  noStroke();
  smooth();

  for (let i = 0; i < 18; i++) {
    burbujas.push({
      x: random(width),
      y: random(height),
      r: random(50, 100),
      dx: random(-0.5, 0.5),
      dy: random(-0.5, 0.5),
      color: color(random(180, 255), random(100, 180), random(220, 255), 170)
    });
  }

  for (let i = 0; i < 100; i++) {
    particulas.push({
      x: random(width),
      y: random(height),
      r: random(1, 3),
      alpha: random(100, 200),
      speedY: random(0.1, 0.5)
    });
  }
}

function draw() {
  drawFondoOscuro();
  tiempo += 0.01;

  for (let p of particulas) {
    fill(255, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.r);
    p.y -= p.speedY;
    if (p.y < 0) {
      p.y = height;
      p.x = random(width);
    }
  }

  textoPushX = 0;
  textoPushY = 0;

  for (let b of burbujas) {
    b.x += b.dx + sin(tiempo + b.r) * 0.1;
    b.y += b.dy + cos(tiempo + b.r) * 0.1;

    if (b.x < 0 || b.x > width) b.dx *= -1;
    if (b.y < 0 || b.y > height) b.dy *= -1;

    let d = dist(mouseX, mouseY, b.x, b.y);
    let cerca = d < b.r / 2 + 50;

    if (cerca) {
      let angle = atan2(b.y - mouseY, b.x - mouseX);
      let force = map(d, 0, 150, 3, 0);
      b.x += cos(angle) * force;
      b.y += sin(angle) * force;

      textoPushX += cos(angle) * force * 0.5;
      textoPushY += sin(angle) * force * 0.5;

      // 🌊 Onda expansiva animada (eco)
      noFill();
      stroke(255, 120, 255, 80);
      strokeWeight(1);
      ellipse(b.x, b.y, b.r + sin(tiempo * 6) * 10 + 15);
    }

    // ✨ Glow al acercarse
    if (d < b.r / 2 + 40) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255, 180, 255, 100);
    } else {
      drawingContext.shadowBlur = 0;
    }

    fill(b.color);
    noStroke();
    ellipse(b.x, b.y, b.r);
    drawingContext.shadowBlur = 0;
  }

  ondas.push({ x: mouseX, y: mouseY, r: 5, alpha: 150 });
  for (let i = ondas.length - 1; i >= 0; i--) {
    let o = ondas[i];
    noFill();
    stroke(255, o.alpha);
    strokeWeight(1.2);
    ellipse(o.x, o.y, o.r);
    o.r += 3;
    o.alpha -= 4;
    if (o.alpha <= 0) ondas.splice(i, 1);
  }

  let textoBaseY = 230;
  let textoBaseX = width / 2;
  let dTexto = dist(mouseX, mouseY, textoBaseX + textoPushX, textoBaseY + textoPushY);
  let hoverTexto = dTexto < 150;

  let idleFloat = !hoverTexto ? sin(tiempo * 1.5) * 3 : 0;
  let idleGlow = !hoverTexto ? sin(tiempo * 1.5) * 4 : 0;
  let glowBlurTarget = hoverTexto ? 15 : 5 + idleGlow;
  let textoColorTarget = hoverTexto ? 255 : 220;
  let sizeTextoTarget = hoverTexto ? 54 : 48;

  glowBlurActual = lerp(glowBlurActual, glowBlurTarget, 0.07);
  textoColorActual = lerp(textoColorActual, textoColorTarget, 0.07);
  sizeTextoActual = lerp(sizeTextoActual, sizeTextoTarget, 0.07);

  // Título
  push();
  fill(255, textoColorActual);
  textAlign(CENTER, CENTER);
  textSize(sizeTextoActual);
  drawingContext.shadowBlur = glowBlurActual;
  drawingContext.shadowColor = color(255, 190, 255);
  text("ARTWUS Studio", textoBaseX + textoPushX, textoBaseY + textoPushY + idleFloat);
  drawingContext.shadowBlur = 0;
  pop();

  // Subtítulo
  let glowSub = !hoverTexto ? sin(tiempo * 1.5) * 15 + 30 : 30;
  let subtituloY = 270 + textoPushY * 0.6 + idleFloat;

  push();
  fill(220);
  textAlign(CENTER, CENTER);
  textSize(18);
  drawingContext.shadowBlur = glowSub;
  drawingContext.shadowColor = color(255, 180, 255);
  text("Ideas. Arte. Tecnología.", textoBaseX + textoPushX * 0.6, subtituloY);
  drawingContext.shadowBlur = 0;
  pop();
}

function drawFondoOscuro() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c1 = color(40 + sin(tiempo) * 10, 0, 70 + cos(tiempo) * 20);
    let c2 = color(90 + cos(tiempo * 0.7) * 10, 0, 130);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }

  noFill();
  stroke(255, 20);
  strokeWeight(1);
  for (let i = 0; i < 4; i++) {
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let y = height / 2 + sin(x * 0.01 + tiempo * 2 + i) * (50 - i * 8);
      curveVertex(x, y + i * 10);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 500);
}
