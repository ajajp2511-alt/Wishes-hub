// admin/features/wishes/modules/gold.js
export class GoldGlitter {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.sin(Math.random() * 2) * 0.5;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > this.canvas.height) {
            this.y = -10;
            this.x = Math.random() * this.canvas.width;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(255, ${215 + Math.floor(Math.random() * 40)}, 0, ${Math.random() * 0.6 + 0.4})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffd700';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}
