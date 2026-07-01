// admin/features/wishes/live-animations.js

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- CONFETTI DESIGN MODULE ---
class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 6 + 4;
        this.speedY = Math.random() * 4 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// --- HEARTS DESIGN MODULE ---
class Heart {
    constructor() {
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
    draw() {
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

function runLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].y > canvas.height || particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    animationFrameId = requestAnimationFrame(runLoop);
}

export function triggerLiveAnimation(animId) {
    cancelAnimationFrame(animationFrameId);
    particles = [];
    
    if (animId === "anim_confetti_blast") {
        for(let i=0; i<100; i++) particles.push(new Confetti());
    } else if (animId === "anim_hearts_vortex") {
        const flow = setInterval(() => {
            if(particles.length < 150) {
                for(let i=0; i<3; i++) particles.push(new Heart());
            }
        }, 80);
        setTimeout(() => clearInterval(flow), 4000);
    }
    runLoop();
              }
