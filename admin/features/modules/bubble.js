// admin/features/wishes/modules/bubble.js
export class BubblePop {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 15 + 5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.wobble = Math.random() * 2;
        this.wobbleSpeed = Math.random() * 0.05;
    }
    update() {
        this.y -= this.speedY; // Niche se upar jana
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        // Screen ke bahar jane par recycle karo
        if (this.y < -50) {
            this.y = this.canvas.height + 20;
            this.x = Math.random() * this.canvas.width;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        // Bubble texture effect ka inner gradient base ring
        ctx.fillStyle = 'rgba(0, 242, 255, 0.05)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Shiny reflection dot inside bubble
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - this.size/3, this.y - this.size/3, this.size/5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
