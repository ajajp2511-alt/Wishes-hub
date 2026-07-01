// admin/features/wishes/modules/anime.js
export class AnimePowerUp {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.length = Math.random() * 80 + 40;
        this.speedY = Math.random() * 15 + 10; // High speed vertical push
        this.thickness = Math.random() * 2 + 0.5;
        const auraColors = ['#ff0055', '#ffcc00', '#00ff66', '#ff00ff'];
        this.color = auraColors[Math.floor(Math.random() * auraColors.length)];
    }
    update() {
        this.y -= this.speedY;
        if (this.y < -this.length) {
            this.y = this.canvas.height + 10;
            this.x = Math.random() * this.canvas.width;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.length);
        ctx.stroke();
        ctx.restore();
    }
}
