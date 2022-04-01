const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const hud = {
    fps: document.getElementById("hud-fps"),
    foods: document.getElementById("hud-foods"),
    creatures: document.getElementById("hud-creatures")
}

const defaultObstacles = [{x: 0, y: 400, w: 500, h: 50}, {x: 900, y: 0, w: 50, h: canvas.height - 120}];
let obstacles = defaultObstacles;
let foodInterval = null;
let worldStatus = 'stop';
let animationRequestID = null;
let world = null;

function animation() {
    animationRequestID = requestAnimationFrame(animation);
    world.draw();
}

function startFoodGenerationInterval() {
    foodInterval = setInterval(() => {
        if (world.getWorldFoodsCount() >= 3000)
            return;
        for (let i = 0; i < world.foodDensity; i++) {
            let x = Math.floor((Math.random() * (canvas.width - 40 + 1)) + 10);
            let y = Math.floor((Math.random() * (canvas.height - 40 + 1)) + 10);
            const food = new Food(x, y);
            if (!food.collideToObstacles(world.obstacles))
                world.putFoodInTheFoodMatrix(food);
        }
    }, world.foodGenerationInterval);
}
function stopFoodGenerationInterval() {
    if(foodInterval) clearInterval(foodInterval);
}

function createCreatures() {
    const males = [];
    const females = [];
    while (males.length + females.length !== world.creaturesStartCount) {
        const c = createCreature();
        if(c) {
            if(c.gender === 'male')
                males.push(c);
            else
                females.push(c);
        }
    }
    return {males, females};
}
function createCreature() {
    let x = Math.floor(Math.random() * ((canvas.width - world.creatureSize) - 10 + 1) + 10);
    let y = Math.floor(Math.random() * ((canvas.height - world.creatureSize) - 10 + 1) + 10);
    const creature = new Creature(x, y, world);
    return creature.collideToObstacles() ? null : creature;
}

function stop() {
    worldStatus = 'stop';

    stopFoodGenerationInterval();

    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(20, 20, 20)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    cancelAnimationFrame(animationRequestID);
}

function start() {
    if(worldStatus === 'stop') {
        worldStatus = 'play';
        world = new World(canvas, obstacles, hud);
        const creatures = createCreatures()
        world.maleCreatures = creatures.males;
        world.femaleCreatures = creatures.females;

        startFoodGenerationInterval();
        animation();
    } else if(worldStatus === 'pause') {
        worldStatus = 'play';
        startFoodGenerationInterval();
        animation();
    }
}

function pause() {
    worldStatus = 'pause';
    stopFoodGenerationInterval();
    cancelAnimationFrame(animationRequestID);
}

start();