const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const hud = {
    fps: document.getElementById("hud-fps"),
    foods: document.getElementById("hud-foods"),
    creatures: document.getElementById("hud-creatures")
}

const world = new World(canvas, createObstacles(), hud);
const creatures = createCreatures();
world.maleCreatures = creatures.males;
world.femaleCreatures = creatures.females;

function animation() {
    requestAnimationFrame(animation);
    world.draw();
}

setTimeout(() => {
    if (world.maleCreatures.length + world.femaleCreatures.length === 0) return;
    for (let i = 0; i < world.mutationDensity; i++) {
        const creature = Math.random() > 0.5 ? world.maleCreatures[Math.floor(Math.random() * world.maleCreatures.length)] :
            world.femaleCreatures[Math.floor(Math.random() * world.femaleCreatures.length)];
        if (!creature) return;
        if (Math.random() > 0.5) {
            creature.eye = true;
        } else {
            creature.flagella = true;
        }
    }
}, world.mutationInterval);
setInterval(() => {
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

function createObstacles() {
    return [{x: 0, y: 400, w: 500, h: 50},
        {x: 900, y: 0, w: 50, h: canvas.height - 120}]
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

animation();