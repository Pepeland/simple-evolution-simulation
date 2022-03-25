class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        c.fillStyle = 'green';
        c.fill();
    }

    collideToObstacles(obstacles) {
        let collide = false;
        obstacles.forEach(o => {
            if (this.x > o.x-15 && this.x < o.x + o.w+15 &&
                this.y > o.y-15 && this.y < o.y + o.h+15) {
                collide = true;
            }
        });
        return collide;
    }
}