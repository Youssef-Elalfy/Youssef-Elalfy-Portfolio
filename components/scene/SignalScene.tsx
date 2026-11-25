'use client';
/* eslint-disable react-hooks/immutability -- Three.js objects are created once and mutated imperatively inside the R3F frame loop, which is the documented R3F pattern and never triggers React renders. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getState, type QualityTier } from '@/lib/store';

/**
 * "Living Signal": a faceted glass core with a lime nucleus, wrapped by
 * filaments that carry light pulses like requests moving through a system.
 * One canvas for the whole site; it reframes itself per section.
 */

export interface SignalSceneProps {
  /** Right-to-left layouts mirror the sculpture's horizontal positions. */
  mirror?: boolean;
  quality: QualityTier;
  frameloop: 'always' | 'demand';
  onContextLost: () => void;
}

const EMERALD = new THREE.Color('#1f7a55');

/** core: scale of the glass core inside the orbit; glow: filament and halo intensity. */
type Pose = { x: number; y: number; z: number; s: number; spread: number; glow: number; core: number };
// After the hero the sculpture steps back into the margins so it never competes with text.
const DESKTOP: Record<string, Pose> = {
  home: { x: 0.5, y: -1.2, z: 0, s: 0.64, spread: 1.15, glow: 1, core: 1 },
  work: { x: 5.1, y: 1.75, z: -3, s: 1.2, spread: 1.05, glow: 0.3, core: 0.36 },
  expertise: { x: -5.1, y: 1.7, z: -3.2, s: 1.25, spread: 1.3, glow: 0.3, core: 0.36 },
  about: { x: 5.1, y: 1.75, z: -3, s: 1.15, spread: 1.1, glow: 0.32, core: 0.36 },
  contact: { x: 0.6, y: -0.2, z: -4.5, s: 1.6, spread: 1.2, glow: 0.36, core: 0.38 },
};
const MOBILE: Record<string, Pose> = {
  // Phones: the core sits at the edge, half off-screen and dimmer, so it never lands on hero text while scrolling.
  home: { x: 1.05, y: -0.95, z: -1, s: 0.46, spread: 1.05, glow: 0.6, core: 0.8 },
  work: { x: 2.3, y: 2.9, z: -3.6, s: 0.8, spread: 1.1, glow: 0.24, core: 0.26 },
  expertise: { x: -2.3, y: 2.9, z: -3.6, s: 0.8, spread: 1.3, glow: 0.24, core: 0.26 },
  about: { x: 2.3, y: 2.9, z: -3.6, s: 0.8, spread: 1.1, glow: 0.24, core: 0.26 },
  contact: { x: 0, y: 2.3, z: -3.8, s: 0.9, spread: 1.15, glow: 0.3, core: 0.3 },
};

/* ------------------------------------------------------------------ shaders */

const filamentVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const filamentFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOffset;
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform vec3 uBase;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewDir))), 1.4);
    float x = fract(vUv.x * 2.0 - uTime * uSpeed + uOffset);
    float head = smoothstep(0.0, 0.035, x) * (1.0 - smoothstep(0.035, 0.16, x));
    float trail = smoothstep(0.0, 0.03, x) * (1.0 - smoothstep(0.03, 0.42, x));
    vec3 color = uBase * (0.45 + 0.75 * fres) + uColor * (head * 2.4 + trail * 0.55);
    float alpha = (0.2 + fres * 0.45 + head * 0.95 + trail * 0.25) * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

const nucleusVertex = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vPos;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nucleusFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vNormalV;
  varying vec3 vPos;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  void main() {
    float n = noise(vPos * 4.0 + uTime * 0.35) * 0.6 + noise(vPos * 9.0 - uTime * 0.2) * 0.4;
    float rim = pow(1.0 - abs(vNormalV.z), 2.2);
    vec3 color = mix(uColor * 0.55, vec3(1.0, 1.0, 0.92), smoothstep(0.55, 0.95, n)) * (0.7 + n * 0.8) + uColor * rim * 1.6;
    gl_FragColor = vec4(color, 0.95);
  }
`;

/* ----------------------------------------------------------------- geometry */

function seeded(seed: number) {
  let value = seed;
  return () => { value = (value * 16807) % 2147483647; return (value - 1) / 2147483646; };
}

function filamentCurves(count: number) {
  const random = seeded(1729);
  const curves: THREE.CatmullRomCurve3[] = [];
  for (let index = 0; index < count; index += 1) {
    const radius = 1.55 + index * 0.16 + random() * 0.2;
    const squash = 0.55 + random() * 0.4;
    const lobes = 2 + Math.floor(random() * 3);
    const lift = 0.18 + random() * 0.32;
    const phase = random() * Math.PI * 2;
    const rotation = new THREE.Euler(random() * Math.PI, random() * Math.PI, random() * Math.PI);
    const points: THREE.Vector3[] = [];
    for (let step = 0; step < 48; step += 1) {
      const t = (step / 48) * Math.PI * 2;
      const wobble = 1 + 0.08 * Math.sin(t * lobes + phase);
      points.push(new THREE.Vector3(Math.cos(t) * radius * wobble, Math.sin(t) * radius * squash * wobble, Math.sin(t * lobes + phase) * lift).applyEuler(rotation));
    }
    curves.push(new THREE.CatmullRomCurve3(points, true, 'centripetal'));
  }
  return curves;
}

function glowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(200,255,61,0.55)');
    gradient.addColorStop(0.22, 'rgba(120,230,90,0.22)');
    gradient.addColorStop(0.55, 'rgba(31,122,85,0.07)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* -------------------------------------------------------------------- scene */

/**
 * Studio reflections from RoomEnvironment, unchanged. Its materials are compiled in the
 * background first, under the same state fromScene renders with (a render target, so linear
 * output and no tone mapping), so fromScene reuses ready programs instead of blocking.
 */
function Environment({ onReady }: { onReady: () => void }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    let cancelled = false;
    let target: THREE.WebGLRenderTarget | null = null;
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const probe = new THREE.WebGLCubeRenderTarget(16, { type: THREE.HalfFloatType });
    const probeCamera = new THREE.CubeCamera(0.1, 100, probe);
    const previous = gl.getRenderTarget();
    gl.setRenderTarget(probe);
    const compiling = gl.compileAsync(room, probeCamera.children[0] as THREE.Camera);
    gl.setRenderTarget(previous);
    compiling.then(() => {
      if (cancelled) return;
      target = pmrem.fromScene(room, 0.04);
      scene.environment = target.texture;
      scene.environmentIntensity = 0.85;
      onReady();
    });
    return () => {
      cancelled = true;
      scene.environment = null;
      target?.dispose();
      probe.dispose();
      pmrem.dispose();
      room.traverse(object => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach(item => item.dispose()); else material?.dispose();
      });
    };
  }, [gl, scene, onReady]);
  return null;
}

function Sculpture({ quality, mirror }: { quality: QualityTier; mirror: boolean }) {
  const high = quality === 'high';
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const filamentGroup = useRef<THREE.Group>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const rings = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2());
  const { size, invalidate } = useThree();

  const curves = useMemo(() => filamentCurves(high ? 7 : 5), [high]);
  const tubes = useMemo(() => curves.map((curve, index) => new THREE.TubeGeometry(curve, high ? 420 : 200, 0.009 + (index % 3) * 0.005, high ? 8 : 5, true)), [curves, high]);
  const accent = useMemo(() => new THREE.Color(getState().accent), []);
  const filamentMaterials = useMemo(() => curves.map((_, index) => new THREE.ShaderMaterial({
    vertexShader: filamentVertex,
    fragmentShader: filamentFragment,
    uniforms: {
      uTime: { value: 0 }, uSpeed: { value: 0.045 + index * 0.012 }, uOffset: { value: index * 0.37 },
      uIntensity: { value: 1 }, uColor: { value: accent }, uBase: { value: EMERALD.clone() },
    },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  })), [curves, accent]);

  const core = useMemo(() => new THREE.IcosahedronGeometry(1.08, 2), []);
  const coreMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#b6e3c9'),
    roughness: 0.07,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 0.95,
    flatShading: true,
    ...(high
      ? { transmission: 1, thickness: 1.35, ior: 1.42, attenuationColor: new THREE.Color('#0d3a26'), attenuationDistance: 2.4, specularIntensity: 1 }
      // No environment map on this tier: a soft emissive tone stands in for the studio reflections.
      : { transparent: true, opacity: 0.3, emissive: new THREE.Color('#7f9f8d'), emissiveIntensity: 0.55 }),
  }), [high]);
  const edges = useMemo(() => new THREE.EdgesGeometry(core, 1), [core]);
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: '#c8ff3d', transparent: true, opacity: 0.16, toneMapped: false }), []);
  const nucleus = useMemo(() => new THREE.IcosahedronGeometry(0.36, 5), []);
  const nucleusMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: nucleusVertex, fragmentShader: nucleusFragment,
    uniforms: { uTime: { value: 0 }, uColor: { value: accent } }, toneMapped: false, transparent: true,
  }), [accent]);
  const glow = useMemo(() => glowTexture(), []);
  const ringGeometries = useMemo(() => [2.35, 2.95, 3.6].map(radius => new THREE.TorusGeometry(radius, 0.0032, 4, 220)), []);
  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#7d9a86', transparent: true, opacity: 0.22, toneMapped: false }), []);
  const packetCount = curves.length * 2;
  const packetGeometry = useMemo(() => new THREE.SphereGeometry(0.017, 8, 8), []);
  const packetMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: accent, toneMapped: false }), [accent]);
  const dust = useMemo(() => {
    const random = seeded(42);
    const count = high ? 260 : 120;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 3 + random() * 5;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions.set([radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta) * 0.6, radius * Math.cos(phi) - 2], index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [high]);
  const dustMaterial = useMemo(() => new THREE.PointsMaterial({ color: '#9fb8a6', size: 0.022, transparent: true, opacity: 0.4, depthWrite: false, sizeAttenuation: true }), []);

  useEffect(() => () => {
    tubes.forEach(geometry => geometry.dispose());
    filamentMaterials.forEach(material => material.dispose());
    [core, edges, nucleus, packetGeometry, dust, ...ringGeometries].forEach(geometry => geometry.dispose());
    [coreMaterial, edgeMaterial, nucleusMaterial, ringMaterial, packetMaterial, dustMaterial].forEach(material => material.dispose());
    glow.dispose();
  }, [tubes, filamentMaterials, core, edges, nucleus, packetGeometry, dust, ringGeometries, coreMaterial, edgeMaterial, nucleusMaterial, ringMaterial, packetMaterial, dustMaterial, glow]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [invalidate]);

  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const targetColor = useMemo(() => new THREE.Color(), []);
  const spread = useRef(1);
  const glowLevel = useRef(1);
  const coreLevel = useRef(1);

  useFrame((frameState, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    const time = frameState.clock.elapsedTime;
    const state = getState();
    const poses = size.width / size.height < 0.9 ? MOBILE : DESKTOP;
    const pose = poses[state.section] ?? poses.home;
    const g = group.current;
    if (!g) return;
    const damp = 1 - Math.exp(-delta * 2.4);
    const targetX = mirror ? -pose.x : pose.x;
    g.position.x += (targetX - g.position.x) * damp;
    g.position.y += (pose.y - g.position.y) * damp;
    g.position.z += (pose.z - g.position.z) * damp;
    const scale = g.scale.x + (pose.s - g.scale.x) * damp;
    g.scale.setScalar(scale);
    spread.current += (pose.spread - spread.current) * damp;
    glowLevel.current += (pose.glow - glowLevel.current) * damp;
    coreLevel.current += (pose.core - coreLevel.current) * damp;

    targetColor.set(state.accent);
    accent.lerp(targetColor, 1 - Math.exp(-delta * 3));

    g.rotation.y += ((pointer.current.x * 0.35) - g.rotation.y) * damp * 0.6;
    g.rotation.x += ((-pointer.current.y * 0.22) - g.rotation.x) * damp * 0.6;

    if (spinner.current) { spinner.current.rotation.y += delta * 0.12; spinner.current.rotation.z = Math.sin(time * 0.2) * 0.12; spinner.current.scale.setScalar(coreLevel.current); }
    if (filamentGroup.current) {
      filamentGroup.current.rotation.y -= delta * 0.05;
      filamentGroup.current.scale.setScalar(spread.current);
    }
    if (rings.current) { rings.current.rotation.z += delta * 0.03; rings.current.scale.setScalar(spread.current); }
    if (halo.current) {
      const pulse = 1 + Math.sin(time * 0.8) * 0.04;
      halo.current.scale.setScalar(5.6 * pulse * glowLevel.current);
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.85 * glowLevel.current;
    }
    filamentMaterials.forEach(material => { material.uniforms.uTime.value = time; material.uniforms.uIntensity.value = 0.25 + glowLevel.current * 0.75; });
    nucleusMaterial.uniforms.uTime.value = time;
    packetMaterial.color.copy(accent);

    const mesh = packets.current;
    if (mesh) {
      curves.forEach((curve, index) => {
        for (let copy = 0; copy < 2; copy += 1) {
          const speed = 0.045 + index * 0.012;
          const u = ((time * speed * 2 + index * 0.37 + copy * 0.5) % 1 + 1) % 1;
          curve.getPointAt(1 - u, point);
          point.multiplyScalar(spread.current);
          matrix.makeTranslation(point.x, point.y, point.z);
          mesh.setMatrixAt(index * 2 + copy, matrix);
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group} position={[mirror ? -DESKTOP.home.x : DESKTOP.home.x, DESKTOP.home.y, 0]} scale={DESKTOP.home.s}>
      <sprite ref={halo} scale={5.6} renderOrder={-1}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <group ref={spinner}>
        <mesh geometry={nucleus} material={nucleusMaterial} />
        <mesh geometry={core} material={coreMaterial} />
        <lineSegments geometry={edges} material={edgeMaterial} />
      </group>
      <group ref={rings} rotation={[1.1, 0.2, 0]}>
        {ringGeometries.map((geometry, index) => <mesh key={index} geometry={geometry} material={ringMaterial} rotation={[index * 0.5, index * 0.35, 0]} />)}
      </group>
      <group ref={filamentGroup}>
        {tubes.map((geometry, index) => <mesh key={index} geometry={geometry} material={filamentMaterials[index]} />)}
        <instancedMesh ref={packets} args={[packetGeometry, packetMaterial, packetCount]} frustumCulled={false} />
      </group>
      <points geometry={dust} material={dustMaterial} />
    </group>
  );
}

function AdaptiveResolution({ maxDpr }: { maxDpr: number }) {
  const setDpr = useThree(state => state.setDpr);
  return <PerformanceMonitor onDecline={({ factor }) => setDpr(Math.max(1, 1 + (maxDpr - 1) * factor))} onIncline={() => setDpr(Math.min(maxDpr, window.devicePixelRatio))} />;
}

function Metrics() {
  const { gl } = useThree();
  const frames = useRef(0);
  const last = useRef(0);
  useFrame(() => {
    frames.current += 1;
    const now = performance.now();
    if (!last.current) last.current = now;
    if (now - last.current > 2000) {
      const canvas = gl.domElement;
      canvas.dataset.fps = String(Math.round((frames.current * 1000) / (now - last.current)));
      canvas.dataset.drawCalls = String(gl.info.render.calls);
      canvas.dataset.triangles = String(gl.info.render.triangles);
      frames.current = 0;
      last.current = now;
    }
  });
  return null;
}

/**
 * Compiles every shader before the first frame. compileAsync uses KHR_parallel_shader_compile
 * where available, so the GPU driver compiles in the background instead of freezing the main
 * thread on first draw. It runs after <Environment/> has set scene.environment, because the
 * environment map changes which shader variants the materials need.
 */
function Warmup({ ready, onReady }: { ready: boolean; onReady: () => void }) {
  const { gl, scene, camera, invalidate } = useThree();
  useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; onReady(); } };
    const fallback = window.setTimeout(finish, 6000);
    gl.compileAsync(scene, camera).then(finish, finish);
    return () => { done = true; window.clearTimeout(fallback); };
  }, [gl, scene, camera, onReady]);
  useEffect(() => { if (ready) invalidate(); }, [ready, invalidate]);
  return null;
}

export default function SignalScene({ quality, frameloop, onContextLost, mirror = false }: SignalSceneProps) {
  const high = quality === 'high';
  const maxDpr = high ? 1.75 : 1.25;
  // The low tier (phones, weak devices) uses a translucent core without transmission, where the
  // studio reflections barely read; skipping them avoids the reflection shaders' compile cost.
  const [environmentReady, setEnvironmentReady] = useState(!high);
  const [compiled, setCompiled] = useState(false);
  const markEnvironment = useCallback(() => setEnvironmentReady(true), []);
  const markCompiled = useCallback(() => setCompiled(true), []);

  return (
    <Canvas
      className={`signal-canvas${compiled ? ' is-ready' : ''}`}
      frameloop={compiled ? frameloop : 'never'}
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 7.5], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: high, alpha: true, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => {
        // Reading link status synchronously after every compile blocks the main thread.
        gl.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); onContextLost(); }, { once: true });
      }}
      aria-hidden="true"
    >
      <AdaptiveResolution maxDpr={maxDpr} />
      {high && <Environment onReady={markEnvironment} />}
      <directionalLight position={[-4, 5, 4]} intensity={1.4} color="#f2fff4" />
      <pointLight position={[2.5, -1, 3]} intensity={6} distance={12} color="#c8ff3d" />
      <pointLight position={[-3, 2, -3]} intensity={5} distance={14} color="#3ee6d0" />
      <Sculpture quality={quality} mirror={mirror} />
      {environmentReady && <Warmup ready={compiled} onReady={markCompiled} />}
      <Metrics />
    </Canvas>
  );
}
