// public/js/live-animations.js

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');

// Canvas ko window size ke hisab se set karne ka function
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particles = [];

// ==========================================
// ANIMATION 1: CONFETTI BLAST (🎉)
// ==========================================
class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height; // Screen ke upar se shuru hoga
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 5 + 3;
        this.speedX = Math.random() * 4 - 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random bright colors
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

// ==========================================
// ANIMATION 2: HEARTS VORTEX (❤️)
// ==========================================
class HeartParticle {
    constructor() {
        this.x = canvas.width / 2; // Center se start hoga
        this.y = canvas.height / 2;
        this.size = Math.random() * 10 + 5;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 4 + 2;
        this.alpha = 1;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
        this.color = `hsl(${Math.random() * 30 + 340}, 100%, 60%)`; // Pink aur Red shades
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= this.fadeSpeed;
    }
    draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Canvas par Heart (Dil) draw karne ka path
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x - this.size/2, this.y - this.size/2, this.x - this.size, this.y + this.size/3, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x + this.size, this.y + this.size/3, this.x + this.size/2, this.y - this.size/2, this.x, this.y);
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================
// CORE ANIMATION LOOP CONTROL
// ==========================================
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Phat chuke ya screen se bahar gaye particles ko remove karo
        if (particles[i].y > canvas.height || particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

// MAIN START TRIGGER: Jo check karega kaunsa animation chalana hai
export function triggerAnimation(animId) {
    particles = []; // Clear existing
    
    if (animId === "anim_confetti_blast") {
        for (let i = 0; i < 150; i++) {
            particles.push(new ConfettiParticle());
        }
    } 
    else if (animId === "anim_hearts_vortex") {
        // Continuous burst ke liye interval lagayenge
        const heartInterval = setInterval(() => {
            if (particles.length < 200) {
                for(let i=0; i<5; i++) particles.push(new HeartParticle());
            }
        }, 100);
        
        // 5 seconds baad burst rokne ke liye
        setTimeout(() => clearInterval(heartInterval), 5000);
    }
    
    animate();
  }
