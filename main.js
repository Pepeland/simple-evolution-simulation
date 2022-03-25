const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const world = new World(canvas, createObstacles());
world.creatures = createCreatures();

function animation() {
    requestAnimationFrame(animation);
    world.draw();
}

setInterval(() => {
    if (world.creatures.length === 0) return;
    for (let i = 0; i < world.mutationDensity; i++) {
        const creature = world.creatures[Math.floor(Math.random() * world.creatures.length)]
        if (!creature) return;
        if (Math.random() > 0.5) {
            creature.eye = true;
        } else {
            creature.flagella = true;
        }
    }
}, world.mutationInterval);
setInterval(() => {
    if (world.foods.length >= 3000)
        return;
    for (let i = 0; i < world.foodDensity; i++) {
        let x = Math.floor(Math.random() * (canvas.width - 10 + 1) + 10);
        let y = Math.floor(Math.random() * (canvas.height - 10 + 1) + 10);
        const food = new Food(x, y);
        if (!food.collideToObstacles(world.obstacles))
            world.foods.push(food);
    }
}, world.foodGenerationInterval);

function createObstacles() {
    return [{x: 300, y: 300, w: 50, h: 500},
        {x: 900, y: 0, w: 50, h: canvas.height}]
}

function createCreatures() {
    const creatures = [];
    while (creatures.length !== world.creaturesStartCount) {
        const c = createCreature();
        if(c) creatures.push(c);
    }
    return creatures;
}

function createCreature() {
    let x = Math.floor(Math.random() * ((canvas.width - world.creatureSize) - 10 + 1) + 10);
    let y = Math.floor(Math.random() * ((canvas.height - world.creatureSize) - 10 + 1) + 10);
    const creature = new Creature(x, y, world);
    return creature.collideToObstacles() ? null : creature;
}

animation();