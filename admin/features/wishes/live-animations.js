// admin/features/wishes/live-animations.js

// JADU: Ab sab kuch single line me index file se aayega, naye modules ke sath!
import { Confetti, Heart, FireworkSpark, RainDrop, GlitchLine, GoldGlitter } from './modules/index.js';

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;
let animationIntervals = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function runLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
        
        // Phat chuke, fade ho chuke ya screen se bahar gaye particles ko remove karo
        if (particles[i].y > canvas.height || (particles[i].alpha !== undefined && particles[i].alpha <= 0)) {
            particles.splice(i, 1);
            i--;
        }
    }
    animationFrameId = requestAnimationFrame(runLoop);
}

function resetEngine() {
    cancelAnimationFrame(animationFrameId);
    animationIntervals.forEach(clearInterval);
    animationIntervals = [];
    particles = [];
}

// MAIN TRIGGER ENGINE
export function triggerLiveAnimation(animId) {
    resetEngine();
    
    if (animId === "anim_confetti_blast") {
        for(let i=0; i<100; i++) particles.push(new Confetti(canvas));
        
    } else if (animId === "anim_hearts_vortex") {
        const flow = setInterval(() => {
            if(particles.length < 150) {
                for(let i=0; i<3; i++) particles.push(new Heart(canvas));
            }
        }, 80);
        animationIntervals.push(flow);
        
    } else if (animId === "anim_neon_fireworks") {
        const fireworkTimer = setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.6);
            const colors = ['#00f2ff', '#ff007f', '#00ff66', '#ffff00'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 60; i++) particles.push(new FireworkSpark(x, y, randomColor));
        }, 1200);
        animationIntervals.push(fireworkTimer);
        
    } else if (animId === "anim_lofi_rain") {
        for (let i = 0; i < 80; i++) particles.push(new RainDrop(canvas));

    } else if (animId === "anim_cyberpunk_glitch") {
        // Glitch lines trigger loop
        for (let i = 0; i < 8; i++) particles.push(new GlitchLine(canvas));

    } else if (animId === "anim_golden_glitter_shower") {
        // Gold dust trigger loop
        for (let i = 0; i < 100; i++) particles.push(new GoldGlitter(canvas));
    }
    
    runLoop();
}
