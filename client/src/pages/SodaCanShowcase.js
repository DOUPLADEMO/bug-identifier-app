import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const createLabelTexture = (accentHue) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `hsl(${accentHue}, 85%, 52%)`);
  gradient.addColorStop(1, `hsl(${(accentHue + 60) % 360}, 85%, 58%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#ffffff';
  const stripeHeight = canvas.height / 11;
  for (let i = 0; i < 12; i++) {
    ctx.fillRect(0, stripeHeight * i * 1.35, canvas.width, stripeHeight);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 28);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 160px "Montserrat", "Futura", sans-serif';
  ctx.fillText('FizzPop', 0, -30);

  ctx.fillStyle = `hsl(${(accentHue + 200) % 360}, 85%, 62%)`;
  ctx.font = 'bold 66px "Montserrat", "Futura", sans-serif';
  ctx.fillText('CITRUS TWIST', 0, 90);
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  for (let i = 0; i < 420; i++) {
    const radius = Math.random() * 6;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  if (THREE.SRGBColorSpace) {
    texture.colorSpace = THREE.SRGBColorSpace;
  } else {
    texture.encoding = THREE.sRGBEncoding;
  }
  return texture;
};

const SodaCanShowcase = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const canMaterialRef = useRef(null);
  const canGroupRef = useRef(null);
  const rotationSpeedRef = useRef(0.6);
  const bubblesRef = useRef({ geometry: null, speeds: null, count: 0, baseHeight: -1.4 });

  const [rotationSpeed, setRotationSpeed] = useState(0.6);
  const [accentHue, setAccentHue] = useState(210);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.065);

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.2, 3.4, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const labelTexture = createLabelTexture(accentHue);
    labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const canMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      metalness: 0.45,
      roughness: 0.32,
      transparent: false,
    });
    canMaterialRef.current = canMaterial;

    const canGeometry = new THREE.CylinderGeometry(1, 1, 3.6, 128, 1, true);
    const canMesh = new THREE.Mesh(canGeometry, canMaterial);
    canMesh.castShadow = true;

    const topGeometry = new THREE.CircleGeometry(1, 64);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0xdde3f2,
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 1.2,
    });
    const topMesh = new THREE.Mesh(topGeometry, topMaterial);
    topMesh.rotation.x = Math.PI / 2;
    topMesh.position.y = 1.8;
    topMesh.castShadow = true;

    const bottomMesh = new THREE.Mesh(topGeometry, topMaterial);
    bottomMesh.rotation.x = -Math.PI / 2;
    bottomMesh.position.y = -1.8;
    bottomMesh.castShadow = true;

    const rimGeometry = new THREE.TorusGeometry(1.04, 0.05, 16, 64);
    const rimMesh = new THREE.Mesh(rimGeometry, topMaterial);
    rimMesh.position.y = 1.79;
    rimMesh.castShadow = true;

    const rimBottom = new THREE.Mesh(rimGeometry, topMaterial);
    rimBottom.position.y = -1.79;
    rimBottom.castShadow = true;

    const canGroup = new THREE.Group();
    canGroup.add(canMesh, topMesh, bottomMesh, rimMesh, rimBottom);
    scene.add(canGroup);
    canGroupRef.current = canGroup;

    const floorGeometry = new THREE.CircleGeometry(6.2, 72);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      metalness: 0.2,
      roughness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.82;
    floor.receiveShadow = true;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffffff, 1.3, 50, Math.PI / 5, 0.35, 1);
    keyLight.position.set(8, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9ec9ff, 0.7);
    rimLight.position.set(-6, 4, -6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffa876, 0.6, 12, 2);
    fillLight.position.set(1.5, 2.8, -2.8);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4.5;
    controls.maxDistance = 9;
    controls.target.set(0, 1.2, 0);
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.update();

    const bubbleGeometry = new THREE.BufferGeometry();
    const bubbleCount = 280;
    const positions = new Float32Array(bubbleCount * 3);
    const bubbleSpeeds = new Float32Array(bubbleCount);
    for (let i = 0; i < bubbleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.25 + Math.random() * 0.55;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 3 - 1.4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      bubbleSpeeds[i] = 0.3 + Math.random() * 0.6;
    }
    bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const bubbleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
    scene.add(bubbles);
    bubblesRef.current = {
      geometry: bubbleGeometry,
      speeds: bubbleSpeeds,
      count: bubbleCount,
      baseHeight: -1.4,
      points: bubbles,
    };

    const clock = new THREE.Clock();
    let animationFrame = 0;

    const handlePointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      if (canGroupRef.current) {
        canGroupRef.current.rotation.x = y * 0.18;
        canGroupRef.current.rotation.z = x * 0.22;
      }
    };

    const handlePointerLeave = () => {
      if (canGroupRef.current) {
        canGroupRef.current.rotation.x = 0;
        canGroupRef.current.rotation.z = 0;
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (canGroupRef.current) {
        canGroupRef.current.rotation.y += delta * rotationSpeedRef.current;
      }

      const bubbleData = bubblesRef.current;
      if (bubbleData.geometry) {
        const pos = bubbleData.geometry.attributes.position;
        for (let i = 0; i < bubbleData.count; i++) {
          pos.array[i * 3 + 1] += bubbleData.speeds[i] * delta;
          if (pos.array[i * 3 + 1] > 2.2) {
            pos.array[i * 3] = Math.cos(Math.random() * Math.PI * 2) * (1.2 + Math.random() * 0.4);
            pos.array[i * 3 + 1] = bubbleData.baseHeight + Math.random() * 0.4;
            pos.array[i * 3 + 2] = Math.sin(Math.random() * Math.PI * 2) * (1.2 + Math.random() * 0.4);
          }
        }
        pos.needsUpdate = true;
        bubbleData.points.rotation.y += delta * 0.18;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      controls.dispose();

      canGroup.clear();
      scene.clear();

      if (canMaterial.map) {
        canMaterial.map.dispose();
      }
      canMaterial.dispose();
      canGeometry.dispose();
      topGeometry.dispose();
      topMaterial.dispose();
      rimGeometry.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      bubbleGeometry.dispose();
      bubbleMaterial.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

        bubblesRef.current = { geometry: null, speeds: null, count: 0, baseHeight: -1.4, points: null };
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!canMaterialRef.current || !rendererRef.current) {
      return;
    }
    const updatedTexture = createLabelTexture(accentHue);
    updatedTexture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
    if (canMaterialRef.current.map) {
      canMaterialRef.current.map.dispose();
    }
    canMaterialRef.current.map = updatedTexture;
    updatedTexture.needsUpdate = true;
    canMaterialRef.current.needsUpdate = true;
  }, [accentHue]);

  return (
    <section className="soda-can-showcase">
      <div className="soda-can-header">
        <h1>Interactive Soda Can Lab</h1>
        <p>
          Spin, tilt, and zoom in on a stylized soda can rendered with Three.js. Subtle lighting, dynamic
          bubbles, and a custom label texture bring this virtual beverage to life.
        </p>
      </div>
      <div ref={mountRef} className="soda-can-viewport" />
      <div className="soda-can-controls">
        <label htmlFor="spin-speed">
          Spin speed
          <input
            id="spin-speed"
            type="range"
            min="0"
            max="1.6"
            step="0.05"
            value={rotationSpeed}
            onChange={(event) => setRotationSpeed(parseFloat(event.target.value))}
          />
        </label>
        <button type="button" onClick={() => setAccentHue((prev) => (prev + 45) % 360)}>
          Refresh label colors
        </button>
      </div>
      <div className="soda-can-tips">
        <span>
          <strong>Drag</strong> to orbit
        </span>
        <span>
          <strong>Scroll</strong> to zoom
        </span>
        <span>
          <strong>Move</strong> your cursor to add tilt
        </span>
      </div>
    </section>
  );
};

export default SodaCanShowcase;
