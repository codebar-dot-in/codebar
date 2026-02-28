/**
 * Service Page — Three.js Floating Geometric Particles Background
 * Drifting spheres and icosahedrons in Siri gradient colors
 * Mouse-interactive parallax effect
 */

import * as THREE from 'three';

export function initServiceBg() {
    const hero = document.querySelector('.sp-hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.classList.add('sp-hero-canvas');
    hero.insertBefore(canvas, hero.firstChild);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    let W = 0, H = 0;
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 30;

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    // Siri gradient colors
    const palette = [
        new THREE.Color('#ff375f'),
        new THREE.Color('#ff6723'),
        new THREE.Color('#bf5af2'),
        new THREE.Color('#2997ff'),
        new THREE.Color('#64d2ff'),
        new THREE.Color('#5e5ce6'),
    ];

    // Create floating shapes
    const shapes = [];
    const group = new THREE.Group();
    scene.add(group);

    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.SphereGeometry(0.6, 8, 8),
        new THREE.TetrahedronGeometry(0.8, 0),
    ];

    const count = 35;

    for (let i = 0; i < count; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const color = palette[Math.floor(Math.random() * palette.length)];
        const scale = 0.3 + Math.random() * 0.8;

        const mat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.12 + Math.random() * 0.18,
            wireframe: Math.random() > 0.4,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20 - 5
        );
        mesh.scale.setScalar(scale);
        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        shapes.push({
            mesh,
            speed: {
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                rotX: (Math.random() - 0.5) * 0.004,
                rotY: (Math.random() - 0.5) * 0.004,
            },
            depth: mesh.position.z,
        });

        group.add(mesh);
    }

    // Add subtle ambient light lines (thin glowing lines)
    for (let i = 0; i < 8; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * 60;
        const startY = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 15 - 5;

        for (let j = 0; j < 20; j++) {
            points.push(new THREE.Vector3(
                startX + j * 3,
                startY + Math.sin(j * 0.5) * 3,
                z
            ));
        }

        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
            color: palette[Math.floor(Math.random() * palette.length)],
            transparent: true,
            opacity: 0.06,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        group.add(line);
    }

    function resize() {
        const rect = hero.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        renderer.setSize(W, H);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
    }

    let animId;
    function animate() {
        // Smooth mouse follow
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        // Subtle camera offset from mouse
        group.rotation.y = mouse.x * 0.08;
        group.rotation.x = mouse.y * 0.05;

        // Animate each shape
        shapes.forEach(s => {
            s.mesh.position.x += s.speed.x;
            s.mesh.position.y += s.speed.y;
            s.mesh.rotation.x += s.speed.rotX;
            s.mesh.rotation.y += s.speed.rotY;

            // Wrap around
            if (s.mesh.position.x > 28) s.mesh.position.x = -28;
            if (s.mesh.position.x < -28) s.mesh.position.x = 28;
            if (s.mesh.position.y > 18) s.mesh.position.y = -18;
            if (s.mesh.position.y < -18) s.mesh.position.y = 18;
        });

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
    }

    // Mouse events
    hero.style.pointerEvents = 'auto';
    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    hero.addEventListener('mouseleave', () => {
        targetMouse.x = 0;
        targetMouse.y = 0;
    });

    resize();
    animate();

    let rt;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(resize, 200);
    });

    // Pause when not visible
    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) cancelAnimationFrame(animId);
            else animId = requestAnimationFrame(animate);
        });
    }, { threshold: 0 }).observe(hero);
}

/**
 * Process tabs interaction
 */
export function initProcessTabs() {
    const tabs = document.querySelectorAll('.sp-process-tab');
    const panels = document.querySelectorAll('.sp-process-panel');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(target)?.classList.add('active');
        });
    });
}

/**
 * Scroll reveal for service page elements
 */
export function initServiceReveal() {
    const elements = document.querySelectorAll('.sp-reveal, .sp-reveal-left, .sp-reveal-right, .sp-stagger');

    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}
