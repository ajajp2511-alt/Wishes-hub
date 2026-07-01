// admin/features/wishes/modules/rain.js
export class RainDrop {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.length = Math.random() * 15 + 10;
        this.speed = Math.random() * 8 + 6;
        this.alpha = Math.random() * 0.4 + 0.2;
    }
    update() {
        this.y += this.speed;
        if (this.y > this.canvas.height) {
            this.y = -20;
            this.x = Math.random() * this.canvas.width;
        }
    }
    draw(ctx) {
        ctx.strokeStyle = `rgba(174, 219, 255, ${this.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
    }
}
