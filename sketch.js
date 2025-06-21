//kolory (7,53,144)niebieski (255, 209, 0)#FFD100żółty (255, 0, 0)#FF0000czerwony



let logoImg;
let flights = [];
let tooltip = '';
let offerCountdown = 10;
let discountInput;
let useButton;
let invalidCodeMessageShown = false;
let inputCreated = false;
let showVoucherBox = false;

let checkbox;
let checkboxLabel;
let premiumMessageShown = false;

let destChosen;
let originChosen;
let priceChosen = 10028;
let departureDate;
let returnDate;
let peopleCount;

function preload() {
  logoImg = loadImage('logo_w.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
   
  database.ref("danelotow").on("value", function(snapshot) {
let data = snapshot.val();
if (data) {
originChosen = data.miejsce1;
destChosen = data.miejsce2;
departureDate = data.datawylotu;
returnDate = data.datapowrotu;
peopleCount = data.liczbaosób;
print("Received:", originChosen, destChosen);
  flights.push({
    destination: originChosen + ' → ' + destChosen,//'Warszawa → Londyn',
    price: priceChosen.toLocaleString('pl-PL') + ' PLN',
    soldOut: false,
    y: windowHeight/5
  });
  
  let cities = [originChosen+' → Berlin', originChosen+' → Paryż', originChosen+' → Oslo', originChosen+' → Rzym'];
  for (let i = 0; i < cities.length; i++) {
    flights.push({
      destination: cities[i],
      price: (99 + i * 10) + ' PLN',
      soldOut: true,
      y: windowHeight/2 + 70 + i * 70
    });
  }
}
});

  
  
  setInterval(decrementCountdown, 1000);

  discountInput = createInput();
  discountInput.attribute('placeholder', 'Wpisz kod vouchera');
  discountInput.style('padding', '10px');
  discountInput.style('font-size', '16px');
  discountInput.style('border-radius', '8px');
  discountInput.style('border', 'none');
  discountInput.style('width', '180px');
  discountInput.hide();

  useButton = createButton('Użyj');
  useButton.style('background-color', '#FFD100');
  useButton.style('padding', '10px 20px');
  useButton.style('font-size', '16px');
  useButton.style('border', 'none');
  useButton.style('border-radius', '8px');
  useButton.style('cursor', 'pointer');
  useButton.hide();

  useButton.mousePressed(() => {
    discountInput.style('background-color', '#FF0000');
    invalidCodeMessageShown = true;
  });

  checkbox = createCheckbox('', false);
  checkbox.changed(() => {
    premiumMessageShown = checkbox.checked();
  });
  checkbox.hide();

  checkboxLabel = createP('Bagaż na koszt Ryansrer!');
  checkboxLabel.style('font-size', '16px');
  checkboxLabel.style('color', 'white');
  checkboxLabel.style('margin', '0 0 0 10px');
  checkboxLabel.style('font-family', 'sans-serif');
  checkboxLabel.hide();

  

}

function draw() {
  background(246, 246, 246);
  drawNavbar();
  drawFlightList();
  drawTooltip();
  drawCTAButton();
  drawCountdown();

  if (offerCountdown <= 0) {
    showVoucherBox = true;
  }

  if (showVoucherBox) {
    drawBottomSlideMessage(); 
  }
}

function drawNavbar() {
  fill(7, 53, 144);
  noStroke();
  rect(0, 0, windowWidth, 60);

  if (logoImg) {
    imageMode(CORNER);
    let barHeight = 60;
    let padding = 20;
    let logoHeight = barHeight - (padding * 2);
    let logoWidth = logoImg.width * (logoHeight / logoImg.height);
    image(logoImg, padding, padding, logoWidth, logoHeight);
  }

  fill(7, 53, 144);
  textAlign(LEFT, CENTER);
  textSize(30);
  textStyle(BOLD);
  text('Chciałeś to masz...', 20, windowHeight/6);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(NORMAL);
  text('Alternatywne loty tylko dla Ciebie!', windowWidth/2, windowHeight/2 + 20);
}

function drawFlightList() {
  for (let i = 0; i < flights.length; i++) {
    let f = flights[i];
    let x = 30;
    let y = f.y;
    let w = windowWidth - 60;
    let h = (i === 0) ? 80 : 50;

    let isHover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

    if (f.soldOut && isHover) {
      tooltip = 'Lot wyprzedany';
    }

    if (f.soldOut) {
      fill(isHover ? color(100, 100, 100) : color(220));
    } else {
      fill(255, 209, 0);
      noStroke();
    }

    rect(x, y, w, h, 10);

    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);

    if (i === 0) {
      textSize(22);
      textStyle(BOLD);
      text(`${f.destination} — ${f.price}`, x + 25, y + h / 2);
    } else {
      textSize(18);
      textStyle(NORMAL);
      text(`${f.destination} — ${f.price}`, x + 20, y + h / 2);
    }

    if (f.soldOut) {
      fill(isHover ? color(100, 100, 100) : color(7, 53, 144));
      textSize(16);
      textStyle(BOLD);
      textAlign(RIGHT, CENTER);
      text('SUPER OFERTA!', x + w - 20, y + h / 2);
    }
  }
}

function drawTooltip() {
  if (tooltip !== '') {
    let tw = textWidth(tooltip) + 5;
    let th = 25;
    fill(255, 0, 0);
    noStroke(0);
    rect(mouseX, mouseY - th - 10, tw, th, 5);
    fill(255);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(tooltip, mouseX + 10, mouseY - th / 2 - 10);
  }
  tooltip = '';
}

function drawCTAButton() {
  let yellowFlight = flights[0];
  let btnW = 250;
  let btnH = 50;
  let btnX = windowWidth / 2 - btnW / 2;
  let btnY = windowHeight / 5 + btnH * 2;
  

  let isHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

  fill(isHover ? color(10, 70, 180) : color(7, 53, 144));
  noStroke();
  rect(btnX, btnY, btnW, btnH, 15);

  fill(255);
  textSize(20);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text('Zarezerwuj teraz', btnX + btnW / 2, btnY + btnH / 2);
}

function drawCountdown() {
  fill(255, 0, 0);
  textSize(16);
  textStyle(NORMAL);
  textAlign(CENTER);
  text(`Oferty promocyjne wygasają za ${offerCountdown} sek!`, windowWidth / 2, windowHeight/2 + 48);
}

function mousePressed() {
  let yellowFlight = flights[0];
  let btnX = windowWidth / 2 - 100;
  let btnY = yellowFlight.y + 100;
  let btnW = 200;
  let btnH = 50;

  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
    alert('Przechodzisz dalej...');
    // GITHUB KAMIL
     database.ref("danelotow").set({
cena: priceChosen,
datawylotu: departureDate,
datapowrotu: returnDate,
liczbaosób: peopleCount,
miejsce2: destChosen,
miejsce1: originChosen
});
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'R') {
    offerCountdown = 10;
  }
}

function decrementCountdown() {
  if (offerCountdown > 0 && !showVoucherBox) {
    offerCountdown--;
  }
}

function drawBottomSlideMessage() {
  let boxHeight = windowHeight/2;
  let boxY = windowHeight - boxHeight;

  fill(7, 53, 144);
  rect(0, boxY, windowWidth, boxHeight, 20);

  fill(255, 209, 0);
  textAlign(CENTER, CENTER);
  textSize(30);
  textStyle(BOLD);
  text('Mamy dla Ciebie eksluzywny KOD RABATOWY!', windowWidth / 2, boxY + boxHeight / 2 - 65);
  fill(255);
  textSize(20);
  textStyle(NORMAL);
  text('Czas minął, ale nie przejmuj się.', windowWidth / 2, boxY + boxHeight / 2 - 100);
  fill(255);
  textSize(30);
  textStyle(BOLD);
  text('SRER-90%', windowWidth / 2, boxY + boxHeight / 2 - 25);

  if (!inputCreated) {
    discountInput.show();
    discountInput.position(windowWidth / 2 - 130, boxY + boxHeight / 2);

    useButton.show();
    useButton.position(windowWidth / 2 + 80, boxY + boxHeight / 2);

    checkbox.show();
    checkbox.position(windowWidth / 2 - 105, boxY + boxHeight / 2 + 80);

    checkboxLabel.show();
    checkboxLabel.position(windowWidth / 2 - 100 + 20, boxY + boxHeight / 2 + 81);

    inputCreated = true;
  }

  if (invalidCodeMessageShown) {
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER);
    text('Nieważny kod vouchera', windowWidth / 2, boxY + boxHeight / 2 + 55);
  }

  if (premiumMessageShown) {
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER);
    text('Opcja dostępna tylko dla Użytkowników Premium', windowWidth / 2, boxY + boxHeight / 2 + 115);
    
     if (checkbox.checked()) {
    let msgX = windowWidth / 2;
    let msgY = windowHeight/2 - 40;

    // Strzałka w górę
    fill(7, 53, 144);
    noStroke();
    triangle(
      msgX - 7, msgY + 5, // lewy punkt podstawy
      msgX + 7, msgY + 5, // prawy punkt podstawy
      msgX, msgY - 7      // czubek strzałki (w górę)
    );

    textSize(20);
    textAlign(CENTER);
    textStyle(NORMAL);
    text('Czas na konsekwencje!', msgX, msgY + 20);
  }
  }
}