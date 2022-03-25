class World {
    constructor(canvas, obstacles) {
        this.canvas = canvas;
        this.startDateTime = new Date();
        this.monitoringCreature = null;

        this.foodDensity = 200;
        this.foodGenerationInterval = 4000;

        this.mutationDensity = 2;
        this.mutationInterval = 6000;

        this.creaturesStartCount = 100;

        this.creatures = [];
        this.foods = [];
        this.obstacles = obstacles;

        this.creatureMoveStep = 1;
        this.creatureSize = 30;

        this.energyLoseInterval = 2000;
        this.eyeRadius = 70;

        this.creatureMoveSpeedFactor = 1;
        this.reproductionCooldown = 10000;
        this.deathAge = [120000,240000];

        this.fpsTimes = [];
        this.fps = 60;

        this.maleImg = document.createElement('img');
        this.femaleImg = document.createElement('img');
        this.maleImg.src = "images/male-16.png"
        this.femaleImg.src = "images/female-16.png"
    }

    getRandomPositionInTheWorld() {
        // return a point (x, y)
    }
    getCreatureAtPosition(point) {
    }

    draw() {
        const c = this.canvas.getContext('2d');
        c.fillStyle = 'rgb(20, 20, 20)';
        c.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawFoods(c);
        this.drawObstacles(c);
        this.drawCreatures(c);
        this.drawFps(c);
    }
    drawFoods(c) {
        this.foods.forEach(food => food.draw(c));
    }
    drawObstacles(c) {
        this.obstacles.forEach(obstacle => {
            c.fillStyle = 'rgba(51, 26, 0, 0.7)';
            c.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        });
    }
    drawCreatures(c) {
        this.creatures.forEach((creature, index) => creature.update(c, index));
    }
    drawFps(c) {
        const now = performance.now();
        while (this.fpsTimes.length > 0 && this.fpsTimes[0] <= now - 1000) {
            this.fpsTimes.shift();
        }
        this.fpsTimes.push(now);
        this.fps = this.fpsTimes.length;

        c.fillStyle = 'white';
        c.font = "15px Arial Black";
        c.fillText(`FPS: ${this.fps}`, this.canvas.width - 107, 20);
        c.fillText(`foods: ${this.foods.length}`, this.canvas.width - 120, 50);
        c.fillText(`creatures: ${this.creatures.length}`, this.canvas.width - 155, 80);
    }
}