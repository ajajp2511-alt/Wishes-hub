// ==========================================================
// 🌐 WISHES HUB USER PANEL - LIVE CANVA ANIMATION ENGINE
// Patel Studio - 2026
// ==========================================================

// JADU: public/js se bahar nikal kar admin/features/modules tak ka sahi path setup!
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
} from '../../admin/features/modules/index.js';

const canvas = document.getElementById('animation-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
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
        particles[i].draw(ctx); // Naye modules ko render karne ke liye ctx dena zaroori hai
        
        // Faded ya screen se bahar gaye particles ko clean up karo
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

// MAIN START TRIGGER: User side par saari animations load aur map karega
export function triggerAnimation(animId) {
    resetEngine();
    
    if (!canvas || !ctx) {
        console.warn("⚠️ [User Engine]: Canvas target element '#animation-canvas' missing!");
        return;
    }

    console.log(`🚀 [User Engine]: Rendering animation layer -> ${animId}`);
    
    // 1. Confetti Blast
    if (animId === "anim_confetti_blast") {
        for(let i = 0; i < 100; i++) particles.push(new Confetti(canvas));
        
    // 2. Hearts & Infinite Heart Vortex (Mapped)
    } else if (animId === "anim_hearts_vortex" || animId === "anim_infinite_heart_vortex") {
        const heartInterval = setInterval(() => {
            if(particles.length < 150) {
                for(let i = 0; i < 3; i++) particles.push(new Heart(canvas));
            }
        }, 80);
        animationIntervals.push(heartInterval);
        
    // 3. Fireworks & Magical Fountain (Mapped)
    } else if (animId === "anim_neon_fireworks" || animId === "anim_magical_firework_fountain") {
        const fireworkTimer = setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.6);
            const colors = ['#00f2ff', '#ff007f', '#00ff66', '#ffff00'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 60; i++) particles.push(new FireworkSpark(x, y, randomColor));
        }, 1200);
        animationIntervals.push(fireworkTimer);
        
    // 4. Snowfall / Rain
    } else if (animId === "anim_lofi_rain") {
        for (let i = 0; i < 80; i++) particles.push(new RainDrop(canvas));

    // 5. Cyberpunk Glitch
    } else if (animId === "anim_cyberpunk_glitch") {
        for (let i = 0; i < 8; i++) particles.push(new GlitchLine(canvas));

    // 6. Golden Glitter Shower
    } else if (animId === "anim_golden_glitter_shower") {
        for (let i = 0; i < 100; i++) particles.push(new GoldGlitter(canvas));

    // 7. Starry Constellation
    } else if (animId === "anim_starry_constellation") {
        for (let i = 0; i < 120; i++) particles.push(new StarryNight(canvas));

    // 8. Bubble Wrap Pop
    } else if (animId === "anim_bubble_wrap_pop") {
        for (let i = 0; i < 35; i++) particles.push(new BubblePop(canvas));

    // 9. Anime Power Up & Thug Life (Mapped)
    } else if (animId === "anim_anime_power_up" || animId === "anim_thug_life") {
        for (let i = 0; i < 50; i++) particles.push(new AnimePowerUp(canvas));
        
    // 10. Turn Off Animations
    } else if (animId === "none") {
        resetEngine();
        return;
    }
    
    animate();
}

// Expose handles globally for standard js scripts like wish-view.js
window.triggerAnimation = triggerAnimation;
window.resetEngine = resetEngine;
