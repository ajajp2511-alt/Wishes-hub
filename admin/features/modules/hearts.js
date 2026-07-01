// admin/features/wishes/modules/hearts.js
export class Heart {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = Math.random() * 8 + 4;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 3 + 1;
        this.alpha = 1;
        this.fade = Math.random() * 0.01 + 0.005;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= this.fade;
    }
    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${Math.random() * 20 + 340}, 100%, 65%)`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x - this.size, this.y - this.size, this.x - this.size*2, this.y + this.size, this.x, this.y + this.size*2);
        ctx.bezierCurveTo(this.x + this.size*2, this.y + this.size, this.x + this.size, this.y - this.size, this.x, this.y);
        ctx.fill();
        ctx.restore();
    }
}
