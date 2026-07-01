// admin/features/wishes/modules/starry.js
export class StarryNight {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.02 + 0.005;
    }
    update() {
        this.alpha += this.speed;
        // Fade-in/Fade-out ka loop logic
        if (this.alpha <= 0 || this.alpha >= 1) {
            this.speed = -this.speed;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
