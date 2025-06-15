let logoImg;
let flights = [];
let tooltip = '';
let tooltipX, tooltipY;
let offerCountdown = 30; // sekundy


function preload() {
  logoImg = loadImage('logo_w.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(1); // tylko dla wizualnych efektów — nie dla timera

  // Start licznika odliczającego
  setInterval(decrementCountdown, 1000);

  // Główny lot — drogi
  flights.push({
    destination: 'Warszawa → Londyn',
    price: '10 000 PLN',
    soldOut: false,
    y: 130
  });

  let cities = ['Kraków → Berlin', 'Wrocław → Paryż', 'Gdańsk → Oslo', 'Poznań → Rzym'];
  for (let i = 0; i < cities.length; i++) {
    flights.push({
      destination: cities[i],
      price: (99 + i * 10) + ' PLN',
      soldOut: true,
      y: 250 + i * 70
    });
  }
}

function draw() {
  background(246, 246, 246);
  drawNavbar();
  drawFlightList();
  drawTooltip();
  drawCTAButton();
  drawCountdown();
}

function drawNavbar() {
  fill(7, 53, 144);
  noStroke();
  rect(0, 0, width, 60);

  if (logoImg) {
    imageMode(CORNER);
    let barHeight = 60;
    let padding = 20;
    let logoHeight = barHeight - (padding * 2);
    let logoWidth = logoImg.width * (logoHeight / logoImg.height);
    image(logoImg, padding, padding, logoWidth, logoHeight);
  }

  textAlign(LEFT, CENTER);
  textSize(30);
  fill(0);
  text('Twoje wybory', 20, 100);
  
  textAlign(LEFT, CENTER);
  textSize(20);
  fill(0);
  text('Alternatywne loty tylko dla Ciebie!', 20, 230);
}

function drawFlightList() {
  for (let i = 0; i < flights.length; i++) {
    let f = flights[i];
    let x = 30;
    let y = f.y;
    let w = width - 50;
    let h = 50;

    let isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

    if (f.soldOut && isHover) {
      fill(255, 0, 0); // czerwony hover
      tooltip = 'Lot wyprzedany';
      tooltipX = mouseX;
      tooltipY = mouseY;
    } else if (f.soldOut) {
      fill(220); // szary
    } else {
      fill(255, 209, 0); // żółty aktywny
    }

    stroke(180);
    rect(x, y, w, h, 10);

    fill(0);
    noStroke();
    textSize(18);
    textAlign(LEFT, CENTER);
    text(`${f.destination} — ${f.price}`, x + 20, y + h / 2);

    // Dodaj "SUPER OFERTA!" do wyprzedanych
    if (f.soldOut) {
      fill(255, 0, 0);
      textSize(14);
      textAlign(RIGHT, CENTER);
      text('SUPER OFERTA!', x + w - 20, y + h / 2);
    }
  }
}

function drawTooltip() {
  if (tooltip !== '') {
    let tw = textWidth(tooltip) + 20;
    let th = 25;
    fill(255, 0, 0);
    rect(tooltipX, tooltipY - th - 10, tw, th, 5);
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(tooltip, tooltipX + tw / 2, tooltipY - th / 2 - 10);
  }
  tooltip = '';
}

function drawCTAButton() {
  let btnX = width / 2 - 100;
  let btnY = height - 100;
  let btnW = 200;
  let btnH = 50;

  let isHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

  // Hover kolor Zarezerwuj teraz
  if (isHover) {
    fill(10, 70, 180); // jaśniejszy niebieski
  } else {
    fill(7, 53, 144);
  }

  noStroke();
  rect(btnX, btnY, btnW, btnH, 15);

  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('Zarezerwuj teraz', btnX + btnW / 2, btnY + btnH / 2);
}

function drawCountdown() {
  fill(255, 0, 0);
  textSize(16);
  textAlign(CENTER);
  text(`Oferty promocyjne wygasają za ${offerCountdown} sek!`, width / 2, flights[0].y + 405);
}

function mousePressed() {
  let btnX = width / 2 - 100;
  let btnY = height - 100;
  let btnW = 200;
  let btnH = 50;

  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
    alert('Przechodzisz do płatności...');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // debug: reset licznika np. klawiszem R
  if (key === 'R') {
    offerCountdown = 30;
  }
}

// Odliczanie czasu (co sekundę)
function decrementCountdown() {
  if (offerCountdown > 0) {
    offerCountdown--;
  }
}
