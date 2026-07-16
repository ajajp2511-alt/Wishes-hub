// admin/js/live-animations.js
// Patel Studio - 2026

import { 
    Confetti, 
    Heart, 
    FireworkSpark, 
    RainDrop, 
    GlitchLine, 
    GoldGlitter, 
    StarryNight, 
    BubblePop, 
    AnimePowerUp 
} from '../features/modules/index.js';

// ==========================================================
// 🚀 DYNAMIC ANIMATION REGISTRY (Yahan naye animations add honge)
// ==========================================================
export const SUPPORTED_ANIMATIONS = [
    { id: "anim_hearts_vortex", name: "Hearts ❤️" },
    { id: "anim_infinite_heart_vortex", name: "Infinite Heart Vortex 💖" },
    { id: "anim_confetti_blast", name: "Confetti 🎉" },
    { id: "anim_neon_fireworks", name: "Fireworks 🎆" },
    { id: "anim_magical_firework_fountain", name: "Firework Fountain 🎇" },
    { id: "anim_golden_glitter_shower", name: "Golden Glitter Shower ✨" },
    { id: "anim_lofi_rain", name: "Snowfall/Rain ❄️🌧️" },
    { id: "anim_cyberpunk_glitch", name: "Cyberpunk Glitch 👾" },
    { id: "anim_starry_constellation", name: "Starry Constellation 🌌" },
    { id: "anim_anime_power_up", name: "Anime Power Up 🔥" },
    { id: "anim_thug_life", name: "Thug Life 😎" },
    { id: "anim_bubble_wrap_pop", name: "Bubble Wrap Pop 🫧" }
    // 💡 Future mein jab naya animation module ready ho, bas uski ID aur Name yahan ek line me add kar dena!
];

// Pure global assignment to make it accessible to non-module files like selector
window.SUPPORTED_ANIMATIONS = SUPPORTED_ANIMATIONS;

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;
let animationIntervals = [];

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animate() {
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx); 
        
        if (particles[i].y > canvas.height || (particles[i].alpha !== undefined && particles[i].alpha <= 0)) {
            particles.splice(i, 1);
            i--;
        }
    }
    animationFrameId = requestAnimationFrame(animate);
}

function resetEngine() {
    cancelAnimationFrame(animationFrameId);
    animationIntervals.forEach(clearInterval);
    animationIntervals = [];
    particles = [];
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// MAIN TRIGGER FUNCTION
export function triggerAnimation(animId) {
    resetEngine();
    
    if (!canvas) {
        console.warn("⚠️ [Live Engine]: Canvas element '#animation-canvas' not found!");
        return;
    }
    
    console.log(`🚀 [Live Engine]: Triggering dynamic module path for -> ${animId}`);

    if (animId === "anim_confetti_blast") {
        for(let i = 0; i < 100; i++) particles.push(new Confetti(canvas));
        
    } else if (animId === "anim_hearts_vortex" || animId === "anim_infinite_heart_vortex") {
        const heartInterval = setInterval(() => {
            if(particles.length < 150) {
                for(let i = 0; i < 3; i++) particles.push(new Heart(canvas));
            }
        }, 80);
        animationIntervals.push(heartInterval);
        
    } else if (animId === "anim_neon_fireworks" || animId === "anim_magical_firework_fountain") {
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
        for (let i = 0; i < 8; i++) particles.push(new GlitchLine(canvas));

    } else if (animId === "anim_golden_glitter_shower") {
        for (let i = 0; i < 100; i++) particles.push(new GoldGlitter(canvas));

    } else if (animId === "anim_starry_constellation") {
        for (let i = 0; i < 120; i++) particles.push(new StarryNight(canvas));

    } else if (animId === "anim_bubble_wrap_pop") {
        for (let i = 0; i < 35; i++) particles.push(new BubblePop(canvas));

    } else if (animId === "anim_anime_power_up" || animId === "anim_thug_life") {
        for (let i = 0; i < 50; i++) particles.push(new AnimePowerUp(canvas));
    } else if (animId === "none") {
        resetEngine();
        return;
    }
    
    animate();
}

window.triggerAnimation = triggerAnimation;
window.resetEngine = resetEngine;
