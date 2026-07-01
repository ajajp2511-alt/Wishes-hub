// admin/features/wishes/modules/glitch.js
export class GlitchLine {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }
    reset() {
        this.x = 0;
        this.y = Math.random() * this.canvas.height;
        this.width = this.canvas.width;
        this.height = Math.random() * 6 + 1;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.life = Math.floor(Math.random() * 10 + 2);
        const glitchColors = ['rgba(0, 242, 255, ', 'rgba(255, 0, 127, ', 'rgba(0, 255, 102, '];
        this.colorBase = glitchColors[Math.floor(Math.random() * glitchColors.length)];
    }
    update() {
        this.life--;
        if (this.life <= 0) this.reset();
    }
    draw(ctx) {
        ctx.fillStyle = this.colorBase + this.alpha + ')';
        ctx.fillRect(this.x + (Math.random() * 20 - 10), this.y, this.width, this.height);
    }
}
