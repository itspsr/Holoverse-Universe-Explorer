/**
 * Holoverse - GitHub Build
 * Vanilla JS + Three.js
 * Advanced Cinematic Intro + Multiverse + Gestures
 * v2.1 "Polished Edition"
 */

// --- DATA ---
const PLANET_DATA = [
    { name: "Sun", label: "Sun", size: 15, distance: 0, speed: 0, color: "#FFDD00", type: "Star", distanceAu: "0 AU", orbitalPeriod: "N/A", gravity: "274 m/s²", facts: ["Core temperature is 15 million °C."], realityColor: "#FF4500", emissiveIntensity: 2, texture: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg' },
    { name: "Mercury", label: "Merc", size: 0.8, distance: 25, speed: 0.04, color: "#00E5FF", orbitColor: "#004455", type: "Terrestrial", distanceAu: "0.39 AU", gravity: "3.7 m/s²", facts: ["Smallest planet."], realityColor: "#A9A9A9", texture: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mercury_in_color_-_Prockter07_centered.jpg', bumpMap: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Mercury_in_color_-_Prockter07_centered.jpg' },
    { name: "Venus", label: "Ven", size: 1.5, distance: 40, speed: 0.03, color: "#00BFFF", orbitColor: "#004455", type: "Terrestrial", distanceAu: "0.72 AU", gravity: "8.87 m/s²", facts: ["Hottest planet."], realityColor: "#E6E6FA", texture: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg' },
    {
        name: "Earth", label: "Earth", size: 1.6, distance: 60, speed: 0.02, color: "#00FFFF", orbitColor: "#005566", hasMoon: true, type: "Terrestrial", distanceAu: "1.00 AU", gravity: "9.8 m/s²", facts: ["Only planet known to support life."], realityColor: "#1E90FF",
        texture: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Earthmap1000x500.jpg',
        specularMap: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Earth_water_mask.png/1024px-Earth_water_mask.png', // Mask for oceans
        cloudMap: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1024px-Earth_Western_Hemisphere_transparent_background.png' // Fallback cloud layer
    },
    { name: "Mars", label: "Mars", size: 1.0, distance: 80, speed: 0.018, color: "#FF3333", orbitColor: "#551111", type: "Terrestrial", distanceAu: "1.52 AU", gravity: "3.71 m/s²", facts: ["Red color comes from rust."], realityColor: "#CD5C5C", texture: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', bumpMap: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
    { name: "Jupiter", label: "Jup", size: 6, distance: 120, speed: 0.008, color: "#0088FF", orbitColor: "#003355", type: "Gas Giant", distanceAu: "5.2 AU", gravity: "24.79 m/s²", facts: ["Largest planet."], realityColor: "#D2B48C", texture: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg' },
    { name: "Saturn", label: "Sat", size: 5, distance: 160, speed: 0.006, color: "#00AAFF", orbitColor: "#003355", hasRings: true, type: "Gas Giant", distanceAu: "9.5 AU", gravity: "10.44 m/s²", facts: ["Famous for its rings."], realityColor: "#F4C430", texture: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Saturn_%28planet%29_large.jpg' },
    { name: "Uranus", label: "Uran", size: 3, distance: 200, speed: 0.004, color: "#00FFFF", orbitColor: "#004455", type: "Ice Giant", distanceAu: "19.8 AU", gravity: "8.69 m/s²", facts: ["Rotates on its side."], realityColor: "#AFEEEE", texture: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg' },
    { name: "Neptune", label: "Nep", size: 2.8, distance: 240, speed: 0.003, color: "#0066FF", orbitColor: "#002244", type: "Ice Giant", distanceAu: "30.1 AU", gravity: "11.15 m/s²", facts: ["Strongest winds."], realityColor: "#4169E1", texture: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg' },
    { name: "Pluto", label: "Pluto", size: 0.6, distance: 280, speed: 0.002, color: "#DDA0DD", orbitColor: "#220022", type: "Dwarf Planet", distanceAu: "39.5 AU", gravity: "0.62 m/s²", facts: ["Dwarf planet."], realityColor: "#EEDD82", texture: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Nh-pluto-in-true-color_2x_JPEG-1.jpg' }
];

// --- APP STATE ---
const app = {
    mode: 'INTRO', // INTRO | SYSTEM_VIEW | GALAXY_VIEW | MULTIVERSE
    target: 'SYSTEM_VIEW',
    realityMode: false,
    isAuTour: false,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    planets: [],
    multiverseBubbles: [],
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),

    // UI Refs
    ui: {
        infoPanel: document.getElementById('info-panel'),
        infoName: document.getElementById('info-name'),
        infoStats: document.getElementById('info-stats'),
        infoFact: document.getElementById('info-fact'),
        dock: document.getElementById('planet-dock'),
        searchInput: document.getElementById('search-input'),
        searchResults: document.getElementById('search-results'),
        btnReality: document.getElementById('btn-reality'),
        uiLayer: document.getElementById('ui-layer'),
        introLayer: document.getElementById('intro-layer'),
        skipBtn: document.getElementById('skip-btn'),
        captions: document.getElementById('intro-captions'),
        teleportOverlay: document.getElementById('teleport-overlay'),
        quantumText: document.getElementById('quantum-text')
    },

    intro: {
        startTime: 0,
        stars: null,
        nebula: null,
        wormhole: null,
        captions: [
            { t: 1.0, text: "INITIATING NEURAL LINK..." },
            { t: 4.0, text: "DETECTING COSMIC ANOMALY..." },
            { t: 7.0, text: "ENTERING WORMHOLE GATE..." },
            { t: 9.0, text: "CALIBRATING MULTIVERSE..." },
            { t: 12.0, text: "WELCOME TO HOLOVERSE." }
        ],
        captionIndex: 0
    },

    touch: {
        startX: 0, startY: 0, startTime: 0,
        lastPinchDist: 0, isPinching: false
    },

    // Sci-Fi Universe State
    universe: {
        stars: null,
        nebula: null,
        dust: null,
        asteroids: [],
        moon: null,
        isInitialized: false
    }
};

// --- SAFARI & RENDERER COMPATIBILITY ---
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function createRenderer() {
    console.log("Safari Mode:", isSafari);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, failIfMajorPerformanceCaveat: false });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.outputEncoding = THREE.sRGBEncoding; // r128 uses this property directly if needed, or toneMapping
        // Note: r128 defaults are usually fine, but explicit encoding helps colors match design
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ReinhardToneMapping;

        return renderer;
    } catch (e) {
        console.warn("Safari WebGL failed → fallback mode", e);
        return null;
    }
}

// --- INITIALIZATION ---
function init() {
    try {
        console.log("Initializing Holoverse...");

        // Safety Clean
        const repoCanvas = document.querySelector('canvas');
        if (repoCanvas) document.body.removeChild(repoCanvas);

        app.scene = new THREE.Scene();
        app.scene.background = new THREE.Color(0x000000);
        app.scene.fog = new THREE.FogExp2(0x000000, 0.0002);

        app.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
        app.camera.position.set(0, 0, 100);

        // SAFELY CREATE RENDERER
        app.renderer = createRenderer();

        if (!app.renderer) {
            console.error("CRITICAL: Renderer creation failed. Displaying fallback.");
            createFallbackScene(); // This creates a separate isolated loop/scene if possible or just alerts
            return;
        }

        // FORCE CANVAS STYLE (Fixes Github Pages flow) & GPU ACCELERATION
        app.renderer.domElement.style.position = 'absolute';
        app.renderer.domElement.style.top = '0';
        app.renderer.domElement.style.left = '0';
        app.renderer.domElement.style.zIndex = '1';
        app.renderer.domElement.style.width = '100%';
        app.renderer.domElement.style.height = '100%';
        app.renderer.domElement.style.webkitTransform = 'translateZ(0)'; // Safari GPU fix

        document.body.appendChild(app.renderer.domElement);

        app.controls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
        app.controls.enableDamping = true;
        app.controls.dampingFactor = 0.05;
        app.controls.maxDistance = 200000;
        app.controls.minDistance = 2; // Allow very close zoom
        app.controls.enabled = false;
        app.controls.autoRotate = true; // Auto drift
        app.controls.autoRotateSpeed = 0.2; // Slow drift

        app.controls.addEventListener('start', () => {
            app.controls.autoRotate = false; // Stop on interaction
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        app.scene.add(ambientLight);
        const sunLight = new THREE.PointLight(0xffffff, 1.5, 4000);
        app.scene.add(sunLight);

        createStars();
        createNebula();
        createWormhole();
        createPlanets();
        generateDock();

        initIntro();

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('click', onClick);
        if (app.ui.searchInput) app.ui.searchInput.addEventListener('input', onSearchInput);
        if (app.ui.skipBtn) app.ui.skipBtn.addEventListener('click', skipIntro);

        const canvas = app.renderer.domElement;
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd);

        // Safety Fallback for Main Scene
        setTimeout(() => {
            if (app.mode === 'INTRO') {
                console.warn("Safety Fallback Initiated: Forcing Main Scene Start");
                if (typeof startMainScene === "function") startMainScene();
            }
        }, 15000);

        // Stop Loading Screen
        const loader = document.getElementById("loading-overlay");
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = 0;
                setTimeout(() => loader.style.display = 'none', 1000);
            }, 1000);
        }

        animate();

    } catch (e) {
        console.error("Initialization Failed:", e);
        // Fallback or Retry
        createFallbackScene();
    }
}

// --- SCENE MANAGEMENT ---
// --- SCENE MANAGEMENT ---
// --- SCENE MANAGEMENT ---
// --- SCENE MANAGEMENT ---
window.startMainScene = function () {
    // 1. Force Mode Immediate Switch
    app.mode = 'SYSTEM_VIEW';

    // START UNIVERSE (Sci-Fi Visuals)
    startUniverse();

    try {
        console.log("Starting Main Scene...");

        // Trigger Effects (Non-critical)
        try {
            if (typeof triggerVibration === 'function') triggerVibration();
            if (typeof teleportEffect === 'function') teleportEffect();
        } catch (e) {
            console.warn("Effect skipped", e);
        }

        // 2. Reset Camera & Controls
        if (app.camera) {
            app.camera.position.set(0, 400, 600);
            app.camera.lookAt(0, 0, 0);
            app.camera.fov = 45;
            app.camera.updateProjectionMatrix();
        }
        if (app.controls) {
            app.controls.enabled = true;
            app.controls.target.set(0, 0, 0);
            app.controls.update();
            app.controls.saveState(); // Save this as the "home" state
        }

        // 3. Cleanup Intro Objects
        if (app.intro) {
            if (app.intro.wormhole) app.intro.wormhole.visible = false;
            if (app.intro.nebula) app.intro.nebula.visible = false;
            if (app.intro.stars) app.intro.stars.material.opacity = 0.5; // Ensure stars are visible as background
        }

    } catch (err) {
        console.error("Main Scene Transition Error:", err);
    } finally {
        // 4. CRITICAL: FORCE VISIBILITY (Always Run)

        // Show Planets
        if (app.planets) {
            app.planets.forEach(p => {
                if (p.group) p.group.visible = true;
            });
        }

        // Show Multiverse (Hidden)
        if (app.multiverseBubbles) {
            app.multiverseBubbles.forEach(b => b.visible = false);
        }

        // UI: Hide Intro Layer
        const introLayer = document.getElementById('intro-layer');
        if (introLayer) {
            introLayer.style.display = 'none';
            introLayer.style.zIndex = '-1';
        } else if (app.ui && app.ui.introLayer) {
            app.ui.introLayer.style.display = 'none';
        }

        // UI: Show Main UI Layer
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.style.display = 'block';
            uiLayer.style.opacity = '1';
            uiLayer.style.visibility = 'visible';
            uiLayer.style.zIndex = '3000';
        }

        // UI: Show Planet Dock
        const dock = document.getElementById('planet-dock');
        if (dock) dock.style.display = 'flex';

        // Force Resize to fix any layout glitches
        if (typeof onWindowResize === 'function') onWindowResize();
    }
};

// --- CINEMATIC INTRO ---
function initIntro() {
    app.mode = 'INTRO';
    app.intro.startTime = performance.now() * 0.001;
    app.ui.skipBtn.style.display = 'block';
    app.ui.uiLayer.style.display = 'none';

    app.planets.forEach(p => p.group.visible = false);
    if (app.multiverseBubbles) app.multiverseBubbles.forEach(b => b.visible = false);

    if (app.intro.stars) app.intro.stars.material.opacity = 0;
    if (app.intro.nebula) app.intro.nebula.visible = false;
    if (app.intro.wormhole) app.intro.wormhole.visible = false;
}

function updateIntro(time) {
    const elapsed = time - app.intro.startTime;

    if (elapsed > 0.5 && app.intro.stars) {
        app.intro.stars.material.opacity = Math.min(1, (elapsed - 0.5));
    }
    if (elapsed > 2.0 && app.intro.nebula) {
        app.intro.nebula.visible = true;
        app.intro.nebula.rotation.y += 0.0005;
    }
    if (elapsed > 5.0 && elapsed < 12.0) {
        if (app.intro.wormhole) {
            app.intro.wormhole.visible = true;
            app.intro.wormhole.rotation.z -= 0.05 + (elapsed - 5) * 0.01;
        }
        const progress = (elapsed - 5) / 7;
        app.camera.position.z = 100 - progress * 2000;
        app.camera.position.x = Math.sin(time * 10) * progress * 5;
        app.camera.position.y = Math.cos(time * 10) * progress * 5;
        app.camera.fov = 45 + progress * 30;
        app.camera.updateProjectionMatrix();
    }
    if (app.intro.captionIndex < app.intro.captions.length) {
        const cap = app.intro.captions[app.intro.captionIndex];
        if (elapsed > cap.t) {
            showCaption(cap.text);
            app.intro.captionIndex++;
        }
    }
    if (elapsed > 13.0) {
        startMainScene();
    }
}

function showCaption(text) {
    const el = app.ui.captions;
    el.innerText = text;
    el.classList.remove('caption-fade-in');
    void el.offsetWidth;
    el.classList.add('caption-fade-in');
}

function skipIntro() {
    startMainScene();
}

// --- MULTIVERSE MODE ---
app.enterMultiverseMode = function () {
    if (app.mode === 'MULTIVERSE') return;
    app.mode = 'MULTIVERSE';
    triggerVibration();
    teleportEffect(true); // Show Jump Text

    // Transition: Warp Effect
    // 1. Shrink/Hide System
    app.planets.forEach(p => p.group.visible = false);
    app.ui.dock.style.display = 'none'; // Hide dock in multiverse
    app.ui.infoPanel.style.display = 'none';

    // 2. Camera Pullback "Dolly Zoom"
    app.controls.maxDistance = 2000000; // Unlimited zoom
    const startPos = app.camera.position.clone();
    const endPos = new THREE.Vector3(0, 50000, 100000);

    // Animate camera
    const duration = 2000;
    const start = performance.now();

    function animatePullback(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic out

        app.camera.position.lerpVectors(startPos, endPos, ease);
        app.camera.lookAt(0, 0, 0);

        if (progress < 1) {
            requestAnimationFrame((t) => animatePullback(t));
        }
    }
    requestAnimationFrame((t) => animatePullback(t));

    // 3. Show Galaxies
    if (app.multiverseBubbles.length === 0) {
        createSpiralGalaxies();
    }
    app.multiverseBubbles.forEach(b => b.visible = true);
};

app.exitMultiverseToSystem = function (galaxyColor) {
    app.mode = 'SYSTEM_VIEW';
    app.target = 'SYSTEM_VIEW';
    teleportEffect(true);

    app.multiverseBubbles.forEach(b => b.visible = false);
    app.planets.forEach(p => p.group.visible = true);

    app.camera.position.set(0, 400, 600);
    app.controls.maxDistance = 200000;
    app.ui.dock.style.display = 'flex';
};

function createSpiralGalaxies() {
    const galaxyCount = 15; // Increased count
    const colors = [0x00FFFF, 0xFF00FF, 0xFFAA00, 0x0088FF, 0xFF4400]; // Varied colors

    for (let i = 0; i < galaxyCount; i++) {
        const colorHex = colors[Math.floor(Math.random() * colors.length)];
        const color = new THREE.Color(colorHex);

        const branches = 3 + Math.floor(Math.random() * 4); // 3 to 6
        const radius = 4000 + Math.random() * 4000;
        const spin = (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random());

        const galaxy = createGalaxyMesh(color, branches, radius, spin);

        // Position freely
        const dist = 50000 + Math.random() * 80000;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        galaxy.position.set(
            dist * Math.cos(theta) * Math.cos(phi),
            dist * Math.sin(phi),
            dist * Math.sin(theta) * Math.cos(phi)
        );

        galaxy.rotation.x = Math.random() * Math.PI;
        galaxy.rotation.y = Math.random() * Math.PI;

        galaxy.userData = { isGalaxy: true, id: i, color: color };

        const label = createTextSprite(`Galaxy ${i + 1}`);
        label.position.set(0, -radius - 1000, 0);
        label.scale.set(3000, 1500, 1); // Bigger labels for distance
        galaxy.add(label);

        app.scene.add(galaxy);
        app.multiverseBubbles.push(galaxy);
    }
}

function createGalaxyMesh(color, branches, radius, spin) {
    const parameters = {
        count: 4000, // Higher detail
        size: 500,
        branches: branches,
        radius: radius,
        spin: spin,
        randomness: 0.5,
        randomnessPower: 3,
        insideColor: 0xffffff,
        outsideColor: color
    };

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const r = Math.random() * parameters.radius;
        const spinAngle = r * parameters.spin * 0.0005;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * r;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * r;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * r;

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * r + randomX;
        positions[i3 + 1] = randomY * 0.5;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, r / parameters.radius);

        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 100,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);

    // Core
    const spriteMat = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/glow.png'),
        color: color,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(radius * 0.4, radius * 0.4, 1);
    points.add(sprite);

    return points;
}

// --- GESTURE ENGINE (Mobile) ---
function onTouchStart(e) {
    if (e.touches.length === 1) {
        app.touch.startX = e.touches[0].clientX;
        app.touch.startY = e.touches[0].clientY;
        app.touch.startTime = performance.now();
    }
    if (e.touches.length === 2) {
        app.touch.isPinching = true;
    }
}

function onTouchMove(e) {
    if (e.touches.length === 2 && app.touch.isPinching) {
        // Pinch logic potentially
    }
}

function onTouchEnd(e) {
    const time = performance.now();
    const duration = time - app.touch.startTime;

    if (e.changedTouches.length === 1 && !app.touch.isPinching) {
        const dx = e.changedTouches[0].clientX - app.touch.startX;
        const dy = e.changedTouches[0].clientY - app.touch.startY;

        if (dy < -100 && Math.abs(dx) < 50 && duration < 300) {
            teleportToRandom();
            return;
        }
    }
    app.touch.isPinching = false;
}

function teleportToRandom() {
    triggerVibration();
    teleportEffect(true);
    const randomPlanet = PLANET_DATA[Math.floor(Math.random() * PLANET_DATA.length)];
    app.setTarget(randomPlanet.name);
}

function teleportEffect(showText) {
    if (!app.ui.teleportOverlay) return;

    app.ui.teleportOverlay.classList.remove('teleport-active');
    void app.ui.teleportOverlay.offsetWidth; // Trigger reflow
    app.ui.teleportOverlay.classList.add('teleport-active');

    // Handle Quantum Text
    if (showText && app.ui.quantumText) {
        app.ui.quantumText.style.opacity = 1;
        setTimeout(() => {
            if (app.ui.quantumText) app.ui.quantumText.style.opacity = 0;
        }, 3000);
    }
}

function triggerVibration() {
    if (navigator.vibrate) navigator.vibrate(50);
}

// ==========================================
// 🌌 HIGH-END SCI-FI VISUALS
// ==========================================

function startUniverse() {
    if (app.universe.isInitialized) return;
    app.universe.isInitialized = true;

    console.log("🌌 Igniting Holoverse Engine...");

    createStarfield(app.scene);
    createMilkyWay(app.scene);
    createNanoDust(app.scene);
    createAsteroids(app.scene);
    createMoon(app.scene); // Hero object
}

// 1. SCI-FI STARFIELD (Layered & Twinkling)
function createStarfield(scene) {
    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorPalette = [
        new THREE.Color('#00FFFF'), // Cyan
        new THREE.Color('#FFFFFF'), // White
        new THREE.Color('#4466FF')  // Blue
    ];

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Spread stars far out
        const r = 4000 + Math.random() * 8000;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        // Colors
        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;

        // Sizes (Layering)
        sizes[i] = Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader for Twinkling
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png') }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                float twinkle = 0.5 + 0.5 * sin(time * 5.0 + gl_FragCoord.x);
                gl_FragColor = vec4(vColor * twinkle, 1.0);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    app.universe.stars = stars;
}

// 2. NEON MILKY WAY (Energy Nebula)
function createMilkyWay(scene) {
    const geometry = new THREE.SphereGeometry(9000, 32, 32);
    // Gradient shader for neon look
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            
            // Simple noise function
            float noise(vec2 p) {
                return sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time);
            }

            void main() {
                // Nebula gradient
                vec3 color1 = vec3(0.0, 0.0, 0.1); // Deep Blue
                vec3 color2 = vec3(0.5, 0.0, 0.5); // Purple
                vec3 color3 = vec3(0.0, 1.0, 1.0); // Cyan

                float n = noise(vUv * 2.0);
                vec3 finalColor = mix(color1, color2, vUv.y);
                finalColor += color3 * n * 0.1;

                gl_FragColor = vec4(finalColor, 0.3); // Low opacity
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const nebula = new THREE.Mesh(geometry, material);
    scene.add(nebula);
    app.universe.nebula = nebula;
}

// 3. BLUE NANO PARTICLES (Cosmic Dust)
function createNanoDust(scene) {
    const count = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 600;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00FFFF,
        size: 2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6,
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/ball.png')
    });

    const dust = new THREE.Points(geometry, material);
    scene.add(dust);
    app.universe.dust = dust;
}

// 4. NEON ASTEROIDS
function createAsteroids(scene) {
    const count = 40;
    const asteroidGroup = new THREE.Group();

    // Shared geometry
    const geometry = new THREE.IcosahedronGeometry(2, 0); // Low poly

    for (let i = 0; i < count; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: 0x222222,
            wireframe: true, // Tech sci-fi look
            transparent: true,
            opacity: 0.8
        });

        // Add glowing cracks (inner mesh)
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00FFFF,
            side: THREE.BackSide
        });

        const asteroid = new THREE.Mesh(geometry, material);
        const crack = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), innerMat);
        asteroid.add(crack);

        // Position in belt
        const angle = Math.random() * Math.PI * 2;
        const radius = 300 + Math.random() * 100; // Belt radius
        asteroid.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 20,
            Math.sin(angle) * radius
        );
        asteroid.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);

        // Custom orbit data
        asteroid.userData = {
            orbitSpeed: 0.001 + Math.random() * 0.002,
            rotSpeed: 0.01 + Math.random() * 0.02,
            angle: angle,
            radius: radius
        };

        asteroidGroup.add(asteroid);
        app.universe.asteroids.push(asteroid);
    }

    scene.add(asteroidGroup);
}

// 5. SCI-FI MOON (Hero Object)
function createMoon(scene) {
    const geometry = new THREE.SphereGeometry(50, 64, 64); // Big hero object
    const material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x0044aa,
        emissiveIntensity: 0.2,
        roughness: 0.8,
        metalness: 0.5,
        wireframe: false
    });

    const moon = new THREE.Mesh(geometry, material);
    moon.position.set(-800, 200, -800); // Fixed backdrop position at first

    // Add neon grid on top
    const gridGeo = new THREE.IcosahedronGeometry(50.5, 2);
    const gridMat = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    moon.add(grid);

    scene.add(moon);
    app.universe.moon = moon;
}

// --- OBJECT FACTORIES ---
function createStars() {
    const count = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < count; i++) {
        positions.push((Math.random() - 0.5) * 10000, (Math.random() - 0.5) * 10000, (Math.random() - 0.5) * 10000);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0 });
    app.intro.stars = new THREE.Points(geometry, material);
    app.scene.add(app.intro.stars);
}

function createNebula() {
    const particleCount = 200;
    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.MeshBasicMaterial({
        color: 0x4400ff, transparent: true, opacity: 0.1,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    app.intro.nebula = new THREE.InstancedMesh(geometry, material, particleCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 1000 - 500);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.scale.setScalar(Math.random() * 2 + 1);
        dummy.updateMatrix();
        app.intro.nebula.setMatrixAt(i, dummy.matrix);
    }
    app.scene.add(app.intro.nebula);
}

function createWormhole() {
    const geometry = new THREE.CylinderGeometry(50, 10, 2000, 32, 50, true);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.2 });
    app.intro.wormhole = new THREE.Mesh(geometry, material);
    app.intro.wormhole.rotation.x = -Math.PI / 2;
    app.intro.wormhole.position.z = -1000;
    app.scene.add(app.intro.wormhole);
}

const textureLoader = new THREE.TextureLoader();

function createPlanets() {
    PLANET_DATA.forEach(data => {
        const group = new THREE.Group();

        // 1. Hologram Mesh (Improved Wireframe)
        // Using Icosahedron for sci-fi look
        const holoGeo = new THREE.IcosahedronGeometry(data.size, 2);
        const holoMat = new THREE.MeshBasicMaterial({
            color: data.color,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const holoMesh = new THREE.Mesh(holoGeo, holoMat);

        // Inner fill for hologram solidity
        const holoFillMat = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.1
        });
        const holoFill = new THREE.Mesh(holoGeo, holoFillMat);
        holoMesh.add(holoFill);

        holoMesh.name = "Hologram";
        group.add(holoMesh);

        // 2. Realistic Mesh (High Fidelity)
        const realGeo = new THREE.SphereGeometry(data.size, 128, 128);
        let realMat;
        let clouds = null;
        let atmosphere = null;

        if (data.name === 'Sun') {
            realMat = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                map: textureLoader.load(data.texture)
            });
            // Sun Glow
            const glowGeo = new THREE.SphereGeometry(data.size * 1.3, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.4, side: THREE.BackSide });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            glow.name = "SunGlow";
            glow.visible = false;
            group.add(glow);
        } else {
            // Standard PBR Material
            const tex = textureLoader.load(data.texture);
            realMat = new THREE.MeshStandardMaterial({
                map: tex,
                roughness: 0.5,
                metalness: 0.1
            });

            // Add Bump/Specular if available
            if (data.bumpMap) {
                realMat.bumpMap = textureLoader.load(data.bumpMap);
                realMat.bumpScale = 0.05;
            }
            if (data.specularMap) {
                realMat.roughnessMap = textureLoader.load(data.specularMap); // Use as mask for roughness
                realMat.roughness = 1.0;
            }

            // Earth Clouds
            if (data.cloudMap) {
                const cloudGeo = new THREE.SphereGeometry(data.size * 1.01, 64, 64);
                const cloudMat = new THREE.MeshLambertMaterial({
                    map: textureLoader.load(data.cloudMap),
                    transparent: true,
                    opacity: 0.9,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide
                });
                clouds = new THREE.Mesh(cloudGeo, cloudMat);
                clouds.name = "Clouds";
                clouds.visible = false;
                group.add(clouds);

                // Atmosphere Glow
                const atmoGeo = new THREE.SphereGeometry(data.size * 1.15, 64, 64);
                const atmoMat = new THREE.MeshBasicMaterial({
                    color: 0x0088ff,
                    transparent: true,
                    opacity: 0.2, // subtle blue halo
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                });
                atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
                atmosphere.name = "Atmosphere";
                atmosphere.visible = false;
                group.add(atmosphere);
            }
        }

        const realMesh = new THREE.Mesh(realGeo, realMat);
        realMesh.name = "Reality";
        realMesh.visible = false;
        group.add(realMesh);

        // Rings (Saturn)
        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.5, 128);
            const ringMat = new THREE.MeshStandardMaterial({
                color: 0xaaaaaa,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2;
            ringMesh.name = "Rings";
            ringMesh.visible = false;
            group.add(ringMesh);
        }

        // Orbit Ring (Hologram style always?)
        if (data.distance > 0) {
            const orbit = new THREE.Mesh(new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 128), new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
            orbit.rotation.x = -Math.PI / 2;
            orbit.name = "OrbitPath";
            app.scene.add(orbit);
        }

        group.position.set(data.distance, 0, 0);
        app.scene.add(group);
        app.planets.push({ name: data.name, group: group, data: data, angle: Math.random() * Math.PI * 2 });
    });
}

function generateDock() {
    app.ui.dock.innerHTML = '';
    PLANET_DATA.forEach(p => {
        const wrapper = document.createElement('div');
        wrapper.className = 'dock-item-wrapper';
        wrapper.onclick = () => app.setTarget(p.name);

        const item = document.createElement('div');
        item.className = 'dock-item';
        item.style.backgroundColor = p.color;

        const label = document.createElement('div');
        label.className = 'dock-label';
        label.innerText = p.label;

        wrapper.appendChild(item);
        wrapper.appendChild(label);
        app.ui.dock.appendChild(wrapper);
    });
}

// --- HELPER LOGIC ---
app.setTarget = function (name) {
    if (app.mode !== 'SYSTEM_VIEW') {
        app.mode = 'SYSTEM_VIEW';
        app.multiverseBubbles.forEach(b => b.visible = false);
        app.planets.forEach(p => p.group.visible = true);
        app.controls.maxDistance = 5000;
        app.ui.infoPanel.style.display = 'block';
        triggerVibration();
        // teleportEffect(false); // Maybe? no, just switching mode, not jumping context
    }

    if (name === 'SYSTEM_VIEW') {
        app.target = 'SYSTEM_VIEW';
        app.ui.infoPanel.style.display = 'none';
        return;
    }
    if (name === 'GALAXY_VIEW') {
        app.target = 'GALAXY_VIEW';
        app.ui.infoPanel.style.display = 'none';
        return;
    }
    app.target = name;

    // Highlight active dock
    Array.from(app.ui.dock.children).forEach(w => w.children[0].classList.remove('active')); // Reset active
    const idx = PLANET_DATA.findIndex(pd => pd.name === name);
    if (idx !== -1 && app.ui.dock.children[idx]) {
        app.ui.dock.children[idx].children[0].classList.add('active'); // Add active to inner circle
    }

    const p = app.planets.find(x => x.name === name);
    if (p) showInfo(p.data);
};

app.toggleAutoTour = function () {
    app.isAuTour = !app.isAuTour;
    if (app.isAuTour) {
        let idx = 0;
        app.tourInt = setInterval(() => {
            app.setTarget(PLANET_DATA[idx].name);
            idx = (idx + 1) % PLANET_DATA.length;
        }, 4000);
    } else {
        clearInterval(app.tourInt);
    }
};

app.toggleRealityMode = function () {
    app.realityMode = !app.realityMode;
    app.ui.btnReality.innerText = app.realityMode ? "Reality: ON" : "Reality: OFF";

    app.planets.forEach(p => {
        const holo = p.group.getObjectByName("Hologram");
        const real = p.group.getObjectByName("Reality");
        const rings = p.group.getObjectByName("Rings");
        const glow = p.group.getObjectByName("SunGlow");
        const clouds = p.group.getObjectByName("Clouds");
        const atmosphere = p.group.getObjectByName("Atmosphere");

        if (app.realityMode) {
            // Switch to Reality
            if (holo) holo.visible = false;
            if (real) real.visible = true;
            if (rings) rings.visible = true;
            if (glow) glow.visible = true;
            if (clouds) clouds.visible = true;
            if (atmosphere) atmosphere.visible = true;
        } else {
            // Switch to Hologram
            if (holo) holo.visible = true;
            if (real) real.visible = false;
            if (rings) rings.visible = false;
            if (glow) glow.visible = false;
            if (clouds) clouds.visible = false;
            if (atmosphere) atmosphere.visible = false;
        }

    });

    // Toggle Background (Stars / Nebula can change style or opacity)
    if (app.realityMode) {
        if (app.intro.stars) app.intro.stars.material.opacity = 0.8;
    } else {
        if (app.intro.stars) app.intro.stars.material.opacity = 0.4;
    }
};

function showInfo(data) {
    app.ui.infoPanel.style.display = 'block';
    app.ui.infoPanel.style.borderColor = data.color;
    app.ui.infoName.innerText = data.name;
    app.ui.infoName.style.color = data.color;
    app.ui.infoStats.innerHTML = `${data.type}<br>${data.gravity}`;
    app.ui.infoFact.innerText = data.facts[0];
}

function onSearchInput(e) {
    const term = e.target.value.toLowerCase();
    app.ui.searchResults.innerHTML = '';
    if (term.length < 1) {
        app.ui.searchResults.style.display = 'none';
        return;
    }
    const matches = PLANET_DATA.filter(p => p.name.toLowerCase().includes(term));
    if (matches.length > 0) {
        app.ui.searchResults.style.display = 'block';
        matches.forEach(p => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.innerText = p.name;
            div.onclick = () => {
                app.setTarget(p.name);
                app.ui.searchResults.style.display = 'none';
                app.ui.searchInput.value = '';
            };
            app.ui.searchResults.appendChild(div);
        });
    } else {
        app.ui.searchResults.style.display = 'none';
    }
}

function onWindowResize() {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
    if (app.mode === 'INTRO') return;
    if (event.target.closest('#ui-layer')) return;

    app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    app.raycaster.setFromCamera(app.pointer, app.camera);

    // Multiverse Interaction
    if (app.mode === 'MULTIVERSE') {
        // Raycast against galaxy points is hard (small targets). 
        // We use a simple sphere test or just check distance to centers for better UX.
        // Or we raycast against the "Core" sprite we added?

        // Actually, raycasting Points works if threshold is high.
        app.raycaster.params.Points.threshold = 500;
        const intersects = app.raycaster.intersectObjects(app.multiverseBubbles, true);

        if (intersects.length > 0) {
            triggerVibration();

            // Fly into galaxy
            const targetGalaxy = intersects[0].object;
            // Get root object if it hit a part
            let root = targetGalaxy;
            while (root.parent && root.parent.type !== 'Scene') root = root.parent;

            // Animation to fly in
            const endPos = root.position.clone().add(new THREE.Vector3(0, 0, 500)); // Close to it

            const startPos = app.camera.position.clone();
            const duration = 1500;
            const start = performance.now();

            function animateFlyIn(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);

                app.camera.position.lerpVectors(startPos, endPos, progress);
                app.camera.lookAt(root.position);

                if (progress < 1) {
                    requestAnimationFrame((t) => animateFlyIn(t));
                } else {
                    app.exitMultiverseToSystem(root.userData.color);
                }
            }
            requestAnimationFrame((t) => animateFlyIn(t));
        }
    } else {
        // System Interaction
        const intersects = app.raycaster.intersectObjects(app.scene.children, true);
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj.parent && obj.parent.type !== 'Scene') {
                obj = obj.parent;
            }
            const pObj = app.planets.find(p => p.group === obj);
            if (pObj) {
                app.setTarget(pObj.name);
            }
        }
    }
}

function TWEEN_Pos(vector, target, duration) {
    app.camTargetPos = target.clone();
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;

    if (app.mode === 'INTRO') {
        updateIntro(time);
        app.renderer.render(app.scene, app.camera);
        return;
    }

    app.planets.forEach(p => {
        p.angle += p.data.speed * 0.5;
        p.group.position.x = Math.cos(p.angle) * p.data.distance;
        p.group.position.z = Math.sin(p.angle) * p.data.distance;
        p.group.rotation.y += 0.01;

        // Rotate Clouds slightly faster if exist
        const clouds = p.group.getObjectByName("Clouds");
        if (clouds) clouds.rotation.y += 0.005;
    });

    // Update Sci-Fi Universe
    if (app.universe.isInitialized) {
        // Milky Way
        if (app.universe.nebula) {
            app.universe.nebula.rotation.y += 0.0002;
            app.universe.nebula.material.uniforms.time.value = time;
        }
        // Stars
        if (app.universe.stars) {
            app.universe.stars.material.uniforms.time.value = time;
            app.universe.stars.rotation.y += 0.0001; // Parallax
        }
        // Dust
        if (app.universe.dust) {
            app.universe.dust.rotation.y -= 0.0005;
            app.universe.dust.position.y = Math.sin(time * 0.5) * 5;
        }
        // Asteroids
        app.universe.asteroids.forEach(ast => {
            ast.rotation.x += ast.userData.rotSpeed;
            ast.rotation.y += ast.userData.rotSpeed;
            // Orbit
            ast.userData.angle += ast.userData.orbitSpeed;
            ast.group = ast.parent; // Safety
            ast.position.x = Math.cos(ast.userData.angle) * ast.userData.radius;
            ast.position.z = Math.sin(ast.userData.angle) * ast.userData.radius;
        });
        // Moon
        if (app.universe.moon) {
            app.universe.moon.rotation.y += 0.001;
        }
    }

    if (app.mode === 'MULTIVERSE') {
        app.multiverseBubbles.forEach((b, i) => {
            b.rotation.y += 0.002 * (i % 2 === 0 ? 1 : -1);
        });
    }

    if (app.camTargetPos) {
        app.camera.position.lerp(app.camTargetPos, 0.05);
        if (app.camera.position.distanceTo(app.camTargetPos) < 10) app.camTargetPos = null;
    } else if (app.mode === 'SYSTEM_VIEW') {
        if (app.target === 'SYSTEM_VIEW') {
            app.camera.position.lerp(new THREE.Vector3(0, 400, 600), 0.05);
            app.controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        } else if (app.target === 'GALAXY_VIEW') {
            app.camera.position.lerp(new THREE.Vector3(0, 2000, 2000), 0.05);
            app.controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        } else {
            const p = app.planets.find(x => x.name === app.target);
            if (p) {
                const off = new THREE.Vector3(p.group.position.x + 20, p.group.position.y + 10, p.group.position.z + 20);
                app.camera.position.lerp(off, 0.05);
                app.controls.target.lerp(p.group.position, 0.05);
            }
        }
    }

    app.controls.update();
    app.renderer.render(app.scene, app.camera);
}

// --- SAFETY WATCHDOG & FALLBACK ---
let introCompleted = false;

window.safeguardUniverse = function () {
    try {
        console.log("🚀 Ensuring Universe Render...");

        // 1. Check Three.js
        if (!window.THREE) {
            console.error("❌ THREE.js not loaded.");
            const errDiv = document.createElement("div");
            errDiv.style.position = "fixed";
            errDiv.style.top = "50%";
            errDiv.style.left = "50%";
            errDiv.style.transform = "translate(-50%, -50%)";
            errDiv.style.color = "red";
            errDiv.style.background = "black";
            errDiv.style.padding = "20px";
            errDiv.innerText = "CRITICAL ERROR: THREE.js failed to load.";
            document.body.appendChild(errDiv);
            return;
        }

        // 2. Try to transition to Main Scene
        if (typeof startMainScene === "function") {
            startMainScene();
        } else {
            console.warn("⚠️ startMainScene not found. Creating fallback cube...");
            createFallbackScene();
        }

        // 3. Last Resort: Check if scene is empty
        if (app.scene.children.length < 2) {
            console.warn("⚠️ Scene appears empty. Injecting fallback cube.");
            createFallbackScene();
        }

        document.getElementById("ui-layer").style.display = "block";
        introCompleted = true;

    } catch (e) {
        console.error("❌ Universe Failed:", e);
        // If critical failure, try just a raw fallback
        createFallbackScene();
    }
}

function createFallbackScene() {
    // Prevent double fallback
    if (window.hasFallback) return;
    window.hasFallback = true;

    console.warn("Initializing Fallback Scene (Wireframe Cube)");

    // Nuke existing if needed or add to it? Best to add to it to avoid breaking context
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    app.scene.add(cube);

    // Ensure we have a camera
    if (!app.camera) {
        app.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        app.camera.position.z = 50;
    }

    // Ensure we are rendering
    function fallbackAnimate() {
        requestAnimationFrame(fallbackAnimate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        if (app.renderer) app.renderer.render(app.scene, app.camera);
    }
    fallbackAnimate();
}

// Validation Timer: Allow intro (13s) + buffer = 16s
setTimeout(() => {
    if (!introCompleted && app.mode !== 'SYSTEM_VIEW') {
        console.warn("Intro timed out. Forcing Universe Start.");
        safeguardUniverse();
    }
}, 16000);

// Note: init() is called at the end of definitions
init();
