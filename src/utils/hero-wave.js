/**
 * Flowing Sound Wave Particle Effect — Three.js WebGL
 * Particles form flowing wave ribbons like a sound equalizer visualization
 * Small round dots arranged in a grid, displaced by overlapping sine waves
 */

import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform vec2 uResolution;

  attribute float aSize;
  attribute float aBaseOpacity;
  attribute vec3 aColor;
  attribute float aRow;

  varying float vOpacity;
  varying vec3 vColor;

  // Smooth noise function for organic random motion
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec3 pos = position;

    float rowPhase = aRow * 0.4;
    float slowTime = uTime * 0.4;  // Much slower for smooth feel

    // =============================================
    // ORGANIC SHAPE-SHIFTING WAVES (no fixed direction)
    // =============================================

    // Noise-driven displacement — random, organic morphing
    float n1 = snoise(vec2(pos.x * 0.004 + slowTime * 0.7, pos.y * 0.008 + rowPhase));
    float n2 = snoise(vec2(pos.x * 0.006 - slowTime * 0.5, pos.y * 0.005 + rowPhase * 0.7 + 50.0));
    float n3 = snoise(vec2(pos.x * 0.003 + slowTime * 0.3, pos.y * 0.003 - slowTime * 0.4 + 100.0));

    // Y displacement — multiple noise layers for complex shapes
    float waveY = n1 * 45.0 + n2 * 25.0 + n3 * 15.0;
    // X displacement — subtle horizontal drift
    float waveX = snoise(vec2(pos.x * 0.005 + slowTime * 0.6 + 200.0, pos.y * 0.006 + rowPhase)) * 12.0;

    pos.y += waveY;
    pos.x += waveX;

    // Slow breathing envelope — organic amplitude modulation
    float envelope = snoise(vec2(pos.x * 0.002 + slowTime * 0.2, pos.y * 0.002)) * 0.3 + 0.7;
    pos.y *= envelope;

    // Depth parallax per row
    float depthFactor = 1.0 + aRow * 0.015;
    pos.y *= depthFactor;

    // Brightness follows wave magnitude
    float waveMag = abs(waveY) / 70.0;
    float opacityBoost = 0.5 + waveMag * 0.7;

    // =============================================
    // MOUSE INTERACTION
    // =============================================
    if (uMouseActive > 0.1) {
      vec2 mouseWorld = uMouse * uResolution * 0.5;
      vec2 diff = pos.xy - mouseWorld;
      float dist = length(diff);
      float rippleRadius = 200.0;

      if (dist < rippleRadius) {
        float t = 1.0 - dist / rippleRadius;
        float force = t * t;
        vec2 pushDir = normalize(diff + 0.001);
        pos.xy += pushDir * force * 40.0;
        pos.y += sin(dist * 0.08 - uTime * 4.0) * force * 12.0;
        opacityBoost += force * 0.4;
      }
    }

    vOpacity = aBaseOpacity * opacityBoost;
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (800.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    // Round dot particle
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);

    // Smooth circle with soft glow edge
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    if (alpha < 0.01) discard;

    // Subtle inner glow
    float glow = exp(-dist * 4.0) * 0.3;

    gl_FragColor = vec4(vColor + glow, alpha * vOpacity);
  }
`;

export function initHeroWave() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;';
    hero.insertBefore(container, hero.firstChild);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';

    const scene = new THREE.Scene();
    let W = 0, H = 0, camera;

    const mouse = new THREE.Vector2(-10, -10);
    const targetMouse = new THREE.Vector2(-10, -10);
    let mouseActive = 0, targetMouseActive = 0;

    const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: mouse },
        uMouseActive: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
    };

    let particles;

    function buildParticles() {
        if (particles) {
            scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
        }

        // Dense horizontal grid — many columns, ~20 wave rows
        const spacingX = 8;
        const numRows = 22;
        const rowSpacing = 8;

        // Wave ribbons centered vertically
        const waveHeight = numRows * rowSpacing;
        const startY = waveHeight / 2;

        const cols = Math.ceil(W / spacingX) + 2;
        const maxCount = cols * numRows;

        const positions = new Float32Array(maxCount * 3);
        const sizes = new Float32Array(maxCount);
        const opacities = new Float32Array(maxCount);
        const colors = new Float32Array(maxCount * 3);
        const rows = new Float32Array(maxCount);

        // Gradient: cyan → purple → pink/magenta
        function getColor(t) {
            // t: 0 = edge rows, 1 = center rows
            if (t < 0.5) {
                const s = t * 2;
                return [
                    0.1 + s * 0.6,    // R: 0.1 → 0.7
                    0.85 - s * 0.5,    // G: 0.85 → 0.35
                    0.9 - s * 0.1,     // B: 0.9 → 0.8
                ];
            } else {
                const s = (t - 0.5) * 2;
                return [
                    0.7 + s * 0.3,     // R: 0.7 → 1.0
                    0.35 - s * 0.15,   // G: 0.35 → 0.2
                    0.8 - s * 0.3,     // B: 0.8 → 0.5
                ];
            }
        }

        let idx = 0;
        for (let r = 0; r < numRows; r++) {
            const rowT = r / (numRows - 1); // 0 to 1
            const centerT = 1.0 - Math.abs(rowT - 0.5) * 2; // 0 at edges, 1 at center
            const col = getColor(rowT);

            for (let c = 0; c < cols; c++) {
                const x = -W / 2 + c * spacingX;
                const y = startY - r * rowSpacing;

                const i3 = idx * 3;
                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = 0;

                sizes[idx] = 2.5 + centerT * 2.0;
                // Center rows are more opaque, edge rows fade
                opacities[idx] = 0.15 + centerT * 0.45;
                rows[idx] = r;

                colors[i3] = col[0];
                colors[i3 + 1] = col[1];
                colors[i3 + 2] = col[2];
                idx++;
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, idx * 3), 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes.slice(0, idx), 1));
        geo.setAttribute('aBaseOpacity', new THREE.BufferAttribute(opacities.slice(0, idx), 1));
        geo.setAttribute('aColor', new THREE.BufferAttribute(colors.slice(0, idx * 3), 3));
        geo.setAttribute('aRow', new THREE.BufferAttribute(rows.slice(0, idx), 1));

        const mat = new THREE.ShaderMaterial({
            vertexShader, fragmentShader, uniforms,
            transparent: true, depthWrite: false,
        });

        particles = new THREE.Points(geo, mat);
        scene.add(particles);
    }

    function resize() {
        const rect = hero.getBoundingClientRect();
        W = rect.width; H = rect.height;
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 1000);
        camera.position.z = 500;
        uniforms.uResolution.value.set(W, H);
        buildParticles();
    }

    let animId;
    function animate() {
        uniforms.uTime.value += 0.016;
        mouse.x += (targetMouse.x - mouse.x) * 0.15;
        mouse.y += (targetMouse.y - mouse.y) * 0.15;
        mouseActive += (targetMouseActive - mouseActive) * 0.08;
        uniforms.uMouseActive.value = mouseActive;
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
    }

    hero.style.pointerEvents = 'auto';
    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        targetMouseActive = 1;
    });
    hero.addEventListener('mouseleave', () => { targetMouseActive = 0; });
    hero.addEventListener('touchmove', e => {
        const rect = hero.getBoundingClientRect();
        const t = e.touches[0];
        targetMouse.x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        targetMouse.y = -((t.clientY - rect.top) / rect.height) * 2 + 1;
        targetMouseActive = 1;
    }, { passive: true });
    hero.addEventListener('touchend', () => { targetMouseActive = 0; });

    resize();
    animate();

    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });

    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) cancelAnimationFrame(animId);
            else animId = requestAnimationFrame(animate);
        });
    }, { threshold: 0 }).observe(hero);
}
