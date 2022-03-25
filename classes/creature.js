class Creature {
    constructor(x, y, world) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.shape = this.generateRandomShape();
        this.color = this.generateRandomColor();
        this.eye = false;
        this.flagella = false;
        this.gender = Math.random() > 0.5 ? 'male' : 'female';
        this.energy = 100;
        this.birthDate = new Date();
        this.age = Math.round((Math.random() * world.deathAge[1] + 1) + world.deathAge[0]);
        this.lastPosition = {x: this.x, y: this.y};
        this.targetFood = null;
        this.targetMate = null;
        this.randomTargetMove = null;
        this.energyLoseLastTime = new Date();
        this.moveTimeout = 1;
        this.reproductionLastTime = new Date();
    }

    draw(c) {
        if (this.shape === 'circle')
            this.drawCircleShape(c);
        if (this.shape === 'rect')
            this.drawRectShape(c);
        if (this.shape === 'triangle')
            this.drawTriangleShape(c);

        if (this.eye)
            this.drawEye(c);

        if (this.flagella)
            this.drawFlagella(c);

        this.drawGender(c);
    }

    drawCircleShape(c) {
        c.beginPath();
        c.arc(this.x, this.y, 15, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    drawRectShape(c) {
        c.beginPath();
        c.rect(this.x - 15, this.y - 15, 30, 30);
        c.fillStyle = this.color;
        c.fill();
    }

    drawTriangleShape(c) {
        c.beginPath();
        c.moveTo(this.x, this.y - 15);
        c.lineTo(this.x - 15, this.y + 15);
        c.lineTo(this.x + 15, this.y + 15);
        c.fillStyle = this.color;
        c.fill();
    }

    drawEye(c) {
        c.beginPath();
        c.setLineDash(['5', '10']);
        c.strokeStyle = this.color;
        c.arc(this.x, this.y, this.world.eyeRadius, 0, Math.PI * 2, false);
        c.stroke();

        c.arc(this.x, this.y, this.world.eyeRadius, 0, Math.PI * 2, false);
        let strColor = this.color.replace('rgb', 'rgba');
        strColor = strColor.replace(/\)/, ',0.1)');
        c.fillStyle = strColor;
        c.fill();
    }

    drawFlagella(c) {
        c.beginPath();
        c.setLineDash([]);
        c.strokeStyle = this.color;
        c.moveTo(this.x, this.y + 15);
        c.bezierCurveTo(this.x, this.y + 15 + 10, this.x + 10, this.y + 15 + 15, this.x, this.y + 15 + 30);
        c.bezierCurveTo(this.x, this.y + 15 + 30, this.x - 10, this.y + 15 + 40, this.x, this.y + 15 + 50);
        c.stroke();
    }

    drawGender(c) {
        if (this.gender === 'male')
            c.drawImage(this.world.maleImg, this.x - 8, this.y - 5);
        else
            c.drawImage(this.world.femaleImg, this.x - 8, this.y - 5);
    }

    update(c, index) {
        this.draw(c);
        this.moveOperation(c);

        if (this.energy < 100)
            this.lookingForFood();

        this.checkForLoseEnergy();

        this.checkingForDeath(index);

        if (this.getReproductionCoolDown() && this.energy > 50 && this.gender === 'male')
            this.lookingForPair();
    }

    moveOperation(c) {
        this.lastPosition = {x: this.x, y: this.y};
        if (!this.eye)
            this.randomMove();
        else
            this.targetedMove();

        if(this.collideToObstacles() || this.collideToWorldBounds())
        {
            this.x = this.lastPosition.x;
            this.y = this.lastPosition.y;
            this.randomTargetMove = null;
            this.targetFood = null;
            this.targetMate = null;
            this.randomMove();
        }
    }

    randomMove() {
        if (!this.randomTargetMove || (this.x >= this.randomTargetMove.x - 3 && this.x <= this.randomTargetMove.x + 3 &&
            this.y >= this.randomTargetMove.y - 3 && this.y <= this.randomTargetMove.y + 3)) {
            const x = Math.round(Math.random() > 0.5 ? this.x + 17 : this.x - 17);
            const y = Math.round(Math.random() > 0.5 ? this.y + 17 : this.y - 17);
            this.randomTargetMove = {
                x: x,
                y: y
            };
        }

        this.move(this.getDirectionOfTarget(this.randomTargetMove));
    }

    targetedMove() {
        let moveDirection;

        if (this.energy <= 25) {
            if (!this.targetFood) this.targetFood = this.getNearestFood();
            moveDirection = this.targetFood === null ? 0 : this.getDirectionOfTarget(this.targetFood);
        } else {
            if (!this.targetMate && this.gender === 'male') this.targetMate = this.getNearestMate();
            moveDirection = this.targetMate === null ? 0 : this.getDirectionOfTarget(this.targetMate);
            if (moveDirection === 0 && this.energy < 100) {
                if (!this.targetFood) this.targetFood = this.getNearestFood();
                moveDirection = this.targetFood === null ? 0 : this.getDirectionOfTarget(this.targetFood);
            }
        }

        if (moveDirection === 0) {
            this.randomMove();
        }
        else {
            this.randomTargetMove = null;
            this.move(moveDirection);
        }
    }

    move(direction) {
        const flagellaFactor = this.flagella ? 2 : 1;
        if (this.moveTimeout > 0) {
            this.moveTimeout--;
            return;
        }
        this.moveTimeout = this.world.creatureMoveSpeedFactor;
        switch (direction) {
            case 1:
                this.x -= this.world.creatureMoveStep * flagellaFactor;
                this.y -= this.world.creatureMoveStep * flagellaFactor;
                break;
            case 2:
                this.y -= this.world.creatureMoveStep * flagellaFactor;
                break;
            case 3:
                this.x += this.world.creatureMoveStep * flagellaFactor;
                this.y -= this.world.creatureMoveStep * flagellaFactor;
                break;
            case 4:
                this.x -= this.world.creatureMoveStep * flagellaFactor;
                break;
            case 5:
                this.x += this.world.creatureMoveStep * flagellaFactor;
                break;
            case 6:
                this.x -= this.world.creatureMoveStep * flagellaFactor;
                this.y += this.world.creatureMoveStep * flagellaFactor;
                break;
            case 7:
                this.y += this.world.creatureMoveStep * flagellaFactor;
                break;
            case 8:
                this.x += this.world.creatureMoveStep * flagellaFactor;
                this.y += this.world.creatureMoveStep * flagellaFactor;
                break;
        }
    }

    getNearestFood() {
        let minDistance = 1000;
        let food = null;

        this.world.foods.forEach(f => {
            const distance = Math.sqrt(Math.pow(f.x - this.x, 2) + Math.pow(f.y - this.y, 2));
            if (distance <= this.world.eyeRadius) {
                if (distance < minDistance) {
                    minDistance = distance;
                    food = f;
                }
            }
        });

        return food;
    }

    getNearestMate() {
        let minDistanceMate = 1000;
        let mate = null;

        this.world.creatures.forEach(creature => {
            if (this.shape !== creature.shape || this.gender === creature.gender ||
                !creature.getReproductionCoolDown() || creature.energy < 10)
                return;
            const distance = Math.sqrt(Math.pow(creature.x - this.x, 2) + Math.pow(creature.y - this.y, 2));
            if (distance <= this.world.eyeRadius) {
                if (distance < minDistanceMate) {
                    minDistanceMate = distance;
                    mate = creature;
                }
            }
        });

        return mate;
    }

    getDirectionOfTarget(target) {
        if (target.x < this.x && target.y < this.y)
            return 1;
        else if (target.x === this.x && target.y < this.y)
            return 2;
        else if (target.x > this.x && target.y < this.y)
            return 3;
        else if (target.x < this.x && target.y === this.y)
            return 4;
        else if (target.x > this.x && target.y === this.y)
            return 5;
        else if (target.x < this.x && target.y > this.y)
            return 6;
        else if (target.x === this.x && target.y > this.y)
            return 7;
        else if (target.x > this.x && target.y > this.y)
            return 8;
        else return 0;
    }

    generateRandomColor() {
        const red = Math.round((Math.random() * 246) + 10);
        const green = Math.round((Math.random() * 246) + 10);
        const blue = Math.round((Math.random() * 246) + 10);
        return `rgb(${red},${green},${blue})`
    }

    generateNewbornColor(mate1, mate2) {
        return Math.random() > 0.5 ? mate1.color : mate2.color;
    }

    generateRandomShape() {
        let number = Math.round((Math.random() * 2) + 1);
        switch (number) {
            case 1:
                return 'circle'
            case 2:
                return 'rect'
            case 3:
                return 'triangle'
        }
    }

    collideToWorldBounds() {
        // if (this.x <= 0) this.x += this.world.creatureMoveStep;
        // else if (this.x >= this.world.width) this.x -= this.world.creatureMoveStep;
        // else if (this.y <= 0) this.y += this.world.creatureMoveStep;
        // else if (this.y >= this.world.height) this.y -= world.creatureMoveStep;
        return this.x <= 0 || this.x >= this.world.width || this.y <= 0 || this.y >= this.world.height;

    }

    lookingForFood() {
        if (this.targetFood && this.targetFood.x > this.x - 15 && this.targetFood.x < this.x + this.world.creatureSize &&
            this.targetFood.y > this.y - 15 && this.targetFood.y < this.y + this.world.creatureSize)
            this.targetFood = null;

        this.world.foods.forEach((food, index) => {
            if (food.x > this.x - 15 && food.x < this.x + 15 &&
                food.y > this.y - 15 && food.y < this.y + 15)
                this.eat(index);
        });
    }

    lookingForPair() {
        if (this.targetMate && this.targetMate.x - 15 < this.x + 15 && this.targetMate.x + 15 > this.x - 15 &&
            this.targetMate.y - 15 < this.y + 15 && this.targetMate.y + 15 > this.y - 15)
            this.reproduction();
    }

    eat(foodIndex) {
        this.world.foods.splice(foodIndex, 1);
        this.energy += 2;
    }

    reproduction() {
        let newCreature = new Creature(this.x, this.y, this.world);
        newCreature.shape = this.shape;
        newCreature.color = this.generateNewbornColor(this, this.targetMate);
        newCreature.energy = 40;
        newCreature.eye = Math.random() > 0.5 ? this.eye : this.targetMate.eye;
        newCreature.flagella = Math.random() > 0.5 ? this.flagella : this.targetMate.flagella;

        this.world.creatures.push(newCreature);

        this.reproductionLastTime = new Date();
        this.targetMate.reproductionLastTime = new Date();
        this.energy -= 10;
        this.targetMate.energy -= 10;
        this.targetMate = null;
    }

    checkForLoseEnergy() {
        const difference = Math.abs(this.energyLoseLastTime - new Date());
        if (difference >= this.world.energyLoseInterval) {
            this.energy -= 2;
            this.energyLoseLastTime = new Date();
        }
    }

    checkingForDeath(index) {
        if (this.energy <= 0) {
            this.world.creatures.splice(index, 1);
            return;
        }
        if(Math.abs(this.birthDate - new Date()) >= this.age) {
            this.world.creatures.splice(index, 1);
        }
    }

    getReproductionCoolDown() {
        const difference = Math.abs(this.reproductionLastTime - new Date());
        return difference > this.world.reproductionCooldown;
    }

    collideToObstacles() {
        let collide = false;
        this.world.obstacles.forEach(o => {
            if (this.x+15 > o.x && this.x-15 < o.x + o.w &&
                this.y+15 > o.y && this.y-15 < o.y + o.h) {
                collide = true;
            }
        });
        return collide;
    }
}