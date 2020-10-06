var foodStock, dog, happyDog, database, dogImg1, dogImg2, milkImg, feedTime, lastFed, food, feedButton, addFood,gameState, readState, changeState;

function preload(){

  dogImg1 = loadImage("images/dogImg.png");
	dogImg2 = loadImage("images/dogImg1.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  vaccineImg = loadImage("images/dogVaccination.png");

}

function setup() {
  database = firebase.database();

	createCanvas(500, 500);

  readState = database.ref('gameState');
  readState.on('value', (data) => {
    gameState = data.val();
  });

	dog = createSprite(430, 220);
	dog.addImage(dogImg1);
	dog.scale = 0.1;

  fedTime = database.ref('feedTime');
  fedTime.on('value', (data) => {
    lastFed = data.val();
  });

  feedButton = createButton('Feed');
  feedButton.position(380,95);
  feedButton.mousePressed(feedDog);

  addFood = createButton('Add food');
  addFood.position(430, 95);
  addFood.mousePressed(moreFood);

  inject = createButton('Vaccinations');
  inject.position(370, 115);
  inject.mousePressed(vaccine);

  food = new Food();

	textAlign(CENTER);
	textSize(20);
	fill(255);
	stroke(0);
}

function draw() {
  background(46, 139, 87);

  food.getFoodStock();

  if (lastFed) {
    fill(255);
    textSize(15);
    if (lastFed>12) {
      text("Last feed: " + lastFed%12 + " PM", 350,30);
    } else if (lastFed<=12){
      text("Last feed: " + lastFed + " AM", 350,30);
    } else {
      text("Last feed: " + lastFed, 350,30);
    }
  }

  currentTime = hour();
  if (currentTime === lastFed+1) {
    update("playing");
    food.garden();
  }else if (currentTime === lastFed+2) {
    update("sleeping");
    food.bedroom();
  }else if (currentTime === lastFed+3) {
    update("bathing");
    food.washroom();
  }else if (gameState === "vaccine") {
      background(vaccineImg, 500, 500);
  } else {
    update("hungry")
    food.display();
    drawSprites();
  }

  if (gameState!="hungry") {
    feedButton.hide();
    addFood.hide();
    inject.hide();
    dog.remove();
  } else {
    feedButton.show();
    addFood.show();
  }



}

function feedDog() {
  dog.addImage(dogImg2);

  if (foodStock) {
    food.updateFoodStock(1);
  }

  lastFed = hour();
  database.ref().update({feedTime: lastFed});

}

function moreFood() {
  foodStock++;
  database.ref().update({Food: foodStock});
}

function vaccine() {
  update("vaccine");
}

function update(state) {
  database.ref().update({gameState: state});
}
