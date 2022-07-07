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
        if (world.getWorldFoodsCount() >= world.maxFood)
            return;
        for (let i = 0; i < world.foodDensity; i++) {
            if(world.getWorldFoodsCount() >= world.maxFood)
                break;
            let x = Math.floor((Math.random() * (canvas.width - 40 + 1)) + 10);
            let y = Math.floor((Math.random() * (canvas.height - 40 + 1)) + 10);
            const food = new Food(x, y);
            if (!food.collideToObstacles(world.obstacles))
                world.addFood(food);
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

let settingsPanelShow = false;
function openSettingsPanel() {
    document.getElementById('open-settings-btn').style.display = 'none';
    let l = -340;
    let wi = setInterval(()=> {
        let settingsPanel = document.getElementById('settings');
        if(settingsPanel.style.left === '0px') {
            clearInterval(wi);
            settingsPanelShow = true;
            return;
        }
        l += 5;
        settingsPanel.style.left = l + 'px';
    }, 0);
}
function closeSettingsPanel() {
    settingsPanelShow = false;
    //window.removeEventListener("click", ()=>{});
    let l = 0;
    let wi = setInterval(()=> {
        let settingsPanel = document.getElementById('settings');
        if(settingsPanel.style.left === '-340px') {
            clearInterval(wi);
            document.getElementById('open-settings-btn').style.display = 'inline-block';
            return;
        }
        l -= 5;
        settingsPanel.style.left = l + 'px';
    }, 0);
}
window.addEventListener('click', function(e){
    if(settingsPanelShow)
        if (!document.getElementById('settings').contains(e.target))
            closeSettingsPanel();
});

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

        if(!world) {
            world = new World(canvas, obstacles, hud);
        } else {
            const uiParams = readUiSettings();
            world = new World(canvas, uiParams.obstacles, hud);
            world.creaturesStartCount = uiParams.creaturesStartCount;
            world.foodDensity = uiParams.foodDensity;
            world.foodGenerationInterval = uiParams.foodGenerationInterval;
            world.maxFood = uiParams.maxFood;
            world.mutationDensity = uiParams.mutationDensity;
        }

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

(function setUiValues() {
    document.getElementById('creatures-count').value = world.creaturesStartCount;
    document.getElementById('food-density').value = world.foodDensity;
    document.getElementById('food-generation-interval').value = world.foodGenerationInterval;
    document.getElementById('max-food').value = world.maxFood;
    document.getElementById('mutation-density').value = world.mutationDensity;

    const obstaclesInput = document.getElementById('obstacles');
    world.obstacles.forEach(o => obstaclesInput.value += `${o.x},${o.y},${o.w},${o.h}\n`);
}());
function readUiSettings() {
    const creaturesStartCount = +document.getElementById('creatures-count').value;
    const foodDensity = +document.getElementById('food-density').value;
    const foodGenerationInterval = +document.getElementById('food-generation-interval').value;
    const maxFood = document.getElementById('max-food').value;
    const mutationDensity = +document.getElementById('mutation-density').value;
    const obstaclesInputValue = document.getElementById('obstacles').value;

    const obstacles = [];
    let oLines = obstaclesInputValue.split(/\r?\n/);
    oLines.forEach(l=> {
        if(!l || l === ' ') return;
        const oValues = l.split(',');
        obstacles.push({x: +oValues[0], y: +oValues[1], w: +oValues[2], h: +oValues[3]})
    });

    return {
        creaturesStartCount,
        foodDensity,
        foodGenerationInterval,
        maxFood,
        mutationDensity,
        obstacles
    }
}