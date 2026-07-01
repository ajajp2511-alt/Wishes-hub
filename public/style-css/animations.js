/* ../style-css/animations.css */

/* Animation Layer Configuration */
#animation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none; /* Taaki buttons ya text click karne me koi dikkat na ho */
    z-index: 999;        /* Text aur card ke upar particles dikhane ke liye */
}

#animation-canvas {
    width: 100%;
    height: 100%;
    display: block;
    background: transparent;
}
