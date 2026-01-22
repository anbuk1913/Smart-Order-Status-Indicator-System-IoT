import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        // Dark background color roughly matching dark mode
        scene.background = new THREE.Color(0x0f172a);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        // Star particles
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 2000;
        const posArray = new Float32Array(starsCount * 3);
        const sizesArray = new Float32Array(starsCount);
        const phasesArray = new Float32Array(starsCount); // For blinking offset

        for (let i = 0; i < starsCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5; // Spread stars
        }
        for (let i = 0; i < starsCount; i++) {
            sizesArray[i] = Math.random() * 0.02;
            phasesArray[i] = Math.random() * Math.PI * 2;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));
        starsGeometry.setAttribute('phase', new THREE.BufferAttribute(phasesArray, 1));

        // Shader material for custom blinking effect
        const starsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: `
                attribute float size;
                attribute float phase;
                varying float vOpacity;
                uniform float time;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    // Blink logic: sine wave based on time and random phase
                    float blink = 0.5 + 0.5 * sin(time * 2.0 + phase);
                    vOpacity = blink;
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vOpacity;
                void main() {
                    // Circular particle
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    gl_FragColor = vec4(color, vOpacity);
                }
            `,
            transparent: true
        });

        const starMesh = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starMesh);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            starsMaterial.uniforms.time.value = performance.now() / 1000;

            // verified simple rotation
            starMesh.rotation.y += 0.0005;
            starMesh.rotation.x += 0.0002;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.removeChild(renderer.domElement);
            starsGeometry.dispose();
            starsMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default StarBackground;
