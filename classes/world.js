class World {
    constructor(canvas, obstacles, hud) {
        this.canvas = canvas;
        this.startDateTime = new Date();
        this.monitoringCreature = null;

        this.foodDensity = 200;
        this.foodGenerationInterval = 4000;
        this.maxFood = 3000;
        this.foods = [];
        this.foodMatrix = [];
        this.foodMatrixSize = [4, 4];
        this.foodMatrixRects = [];

        this.mutationDensity = 10;

        this.creaturesStartCount = 150;

        this.maleCreatures = [];
        this.femaleCreatures = [];
        this.obstacles = obstacles;

        this.creatureMoveStep = 1;
        this.creatureSize = 30;

        this.energyLoseInterval = 2000;
        this.eyeRadius = 70;

        this.creatureMoveSpeedFactor = 1;
        this.reproductionCooldown = 10000;
        this.deathAge = [120000, 240000];

        this.fpsTimes = [];
        this.fps = 60;

        this.maleImg = document.createElement('img');
        this.femaleImg = document.createElement('img');
        this.maleImg.src = "images/male-16.png"
        this.femaleImg.src = "images/female-16.png"

        this.hud = hud;

        this.createFoodMatrix();
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
        this.drawHud(c);
    }

    drawFoods(c) {
        for (let x = 0; x < this.foodMatrixSize[0]; x++) {
            for (let y = 0; y < this.foodMatrixSize[1]; y++) {
                this.foodMatrix[x][y].forEach(food => food.draw(c));
            }
        }
    }

    drawObstacles(c) {
        this.obstacles.forEach(obstacle => {
            const img = document.createElement('img');
            img.src = 'images/stone.png'
            c.fillStyle = c.createPattern(img, "repeat");
            c.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        });
    }

    drawCreatures(c) {
        this.drawMales(c);
        this.drawFemales(c);
    }

    async drawMales(c) {
        this.maleCreatures.forEach((creature, index) => creature.update(c, index));
    }
    async drawFemales(c) {
        this.femaleCreatures.forEach((creature, index) => creature.update(c, index));
    }


    drawHud(c) {
        const now = performance.now();
        while (this.fpsTimes.length > 0 && this.fpsTimes[0] <= now - 1000) {
            this.fpsTimes.shift();
        }
        this.fpsTimes.push(now);
        this.fps = this.fpsTimes.length;

        this.hud.fps.innerText = this.fps;
        this.hud.foods.innerText = this.getWorldFoodsCount() + '';
        this.hud.creatures.innerText = (this.maleCreatures.length + this.femaleCreatures.length) + '';
    }

    createFoodMatrix() {
        const width = this.canvas.width / this.foodMatrixSize[0];
        const height = this.canvas.height / this.foodMatrixSize[1];
        for (let x = 0; x < this.foodMatrixSize[0]; x++) {
            this.foodMatrixRects[x] = [];
            this.foodMatrix[x] = [];
            for (let y = 0; y < this.foodMatrixSize[1]; y++) {
                this.foodMatrixRects[x][y] = {x: x * width, y: y * height, w: width, h: height};
                this.foodMatrix[x][y] = [];
            }
        }
    }

    putFoodInTheFoodMatrix(food) {
        for (let x = 0; x < this.foodMatrixSize[0]; x++) {
            for (let y = 0; y < this.foodMatrixSize[1]; y++) {
                let rect = this.foodMatrixRects[x][y];
                if (food.x > rect.x && food.x < rect.x + rect.w &&
                    food.y > rect.y && food.y < rect.y + rect.h) {
                    this.foodMatrix[x][y].push(food);
                    break;
                }
            }
        }
    }

    getFoodSectionsCollideTo(rect1, spread = false) {
        const foods = [];
        for (let x = 0; x < this.foodMatrixSize[0]; x++) {
            for (let y = 0; y < this.foodMatrixSize[1]; y++) {
                let rect2 = this.foodMatrixRects[x][y];
                if(this.collideTwoRects(rect1, rect2)) {
                    if(spread)
                        foods.push(...this.foodMatrix[x][y]);
                    else
                        foods.push(this.foodMatrix[x][y]);
                }
            }
        }
        return foods;
    }

    getWorldFoodsCount() {
        let count = 0;
        for (let x = 0; x < this.foodMatrixSize[0]; x++) {
            for (let y = 0; y < this.foodMatrixSize[1]; y++) {
                count += this.foodMatrix[x][y].length;
            }
        }
        return count;
    }

    collideTwoRects(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y)
            return true;
    }
}