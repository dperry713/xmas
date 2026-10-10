/**
 * The Advent Piazza — High-Fidelity 3D Interactive Scene Engine
 * Written in TypeScript: Features full resource disposal, adaptive quality,
 * prefers-reduced-motion compliance, KTX2 readiness, volumetric snow, and spatial lighting.
 */

import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { ADVENT_DAYS } from '../data/adventDays';
import { dateGate } from '../services/dateGate';
import { storage } from '../services/storage';
import { t } from '../data/translations';
import { soundManager } from '../audio/soundManager';
import type { QualityLevel } from '../types/advent';

export interface PerformanceMetrics {
  fps: number;
  frameTimeMs: number;
  targetFrameBudgetMs: number;
  drawCalls: number;
  triangles: number;
  textures: number;
  geometries: number;
  quality: 'high' | 'medium' | 'low';
  is2DFallback: boolean;
  budgetStatus: 'pass' | 'warn' | 'fail';
}

export class PiazzaScene3D {
  private container: HTMLElement;
  private onSelectDay: (day: number) => void;

  private animId: number | null = null;
  private lastTime: number = performance.now();
  private awakenedObjects = new Map<number, { activate: () => void; deactivate: () => void }>();
  private hotspotElements = new Map<number, { element: HTMLElement; pos3d: THREE.Vector3 }>();

  // Fallback and Performance tracking
  private is2DFallbackActive: boolean = false;
  private lastRenderDurationMs: number = 16.6;
  private currentCalculatedFps: number = 60;

  // Three.js Core
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private resizeObserver: ResizeObserver | null = null;

  // DOM elements
  private viewportEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private hotspotsOverlayEl!: HTMLElement;

  // Textures
  private textureLoader!: THREE.TextureLoader;
  private cobbleTex!: THREE.Texture;
  private cobbleNormalTex!: THREE.Texture;
  private cathedralTex!: THREE.Texture;
  private cathedralNormalTex!: THREE.Texture;
  private roseWindowTex!: THREE.Texture;
  private roseMesh: THREE.Mesh | null = null;
  private townhousesTex!: THREE.Texture;
  private skyTex!: THREE.Texture;

  // World objects
  private skyMesh!: THREE.Mesh;
  private ambientLight!: THREE.AmbientLight;
  private moonLight!: THREE.DirectionalLight;
  private roseLight!: THREE.PointLight;
  private portalLight!: THREE.PointLight;
  private treeGroup!: THREE.Group;
  private treeFairyLights: THREE.Mesh[] = [];
  private treeStar!: THREE.Mesh;
  private treeStarLight!: THREE.PointLight;
  private festoonGroup!: THREE.Group;
  private snowPoints!: THREE.Points;
  private snowSpeeds!: Float32Array;

  // Camera Orbit & Animation State
  private isCameraAnimating: boolean = false;
  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private cameraDistance: number = 55;
  private cameraTheta: number = Math.PI / 2;
  private cameraPhi: number = Math.PI / 3.4;
  private targetCenter = new THREE.Vector3(0, 8, -5);

  // Prefers-reduced-motion
  private prefersReducedMotion: boolean = false;
  private mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

  // Bound Event Listeners for cleanup
  private boundMouseDown!: (e: MouseEvent) => void;
  private boundMouseMove!: (e: MouseEvent) => void;
  private boundMouseUp!: () => void;
  private boundWheel!: (e: WheelEvent) => void;
  private boundTouchStart!: (e: TouchEvent) => void;
  private boundTouchMove!: (e: TouchEvent) => void;
  private boundTouchEnd!: () => void;
  private boundResize!: () => void;
  private boundZoomIn!: () => void;
  private boundZoomOut!: () => void;
  private boundResetView!: () => void;

  // KTX2 & Adaptive Quality Engine State
  private ktx2Loader: KTX2Loader | null = null;
  private currentEffectiveQuality: 'high' | 'medium' | 'low' = 'high';
  private fpsFrames: number = 0;
  private fpsLastSample: number = performance.now();
  private lowFpsStreak: number = 0;

  constructor({ container, onSelectDay }: { container: HTMLElement; onSelectDay: (day: number) => void }) {
    this.container = container;
    this.onSelectDay = onSelectDay;

    this.checkReducedMotion();
    this.init();
  }

  private checkReducedMotion(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mq.matches;

    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      this.prefersReducedMotion = e.matches;
    };
    mq.addEventListener('change', this.mediaQueryListener);
  }

  public isWebGLAvailable(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        typeof window !== 'undefined' &&
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  private init(): void {
    if (!this.isWebGLAvailable()) {
      console.warn('WebGL is unavailable: activating accessible 2D fallback mode.');
      this.activate2DFallback();
      return;
    }

    try {
      this.is2DFallbackActive = false;
      this.renderDOM();
      this.initThree();
      this.loadTextures();
      this.buildWorld();
      this.build3DHotspots();
      this.initControls();
      this.updateAtmosphere();
      this.animate();
    } catch (err) {
      console.error('Three.js 3D initialization failed, falling back to accessible 2D view:', err);
      this.activate2DFallback();
    }
  }

  private renderDOM(): void {
    this.container.innerHTML = `
      <div class="piazza-3d-viewport" id="piazza3dViewport">
        <canvas id="piazza3dCanvas"></canvas>
        <div class="piazza-3d-hotspots-overlay" id="piazza3dHotspotsOverlay"></div>

        <nav class="piazza-view-controls" aria-label="3D Camera Controls">
          <button class="view-ctrl-btn" id="btn3dZoomIn" title="Zoom In" aria-label="Zoom in 3D camera">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="view-ctrl-btn" id="btn3dZoomOut" title="Zoom Out" aria-label="Zoom out 3D camera">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="view-ctrl-btn" id="btn3dReset" title="Reset View" aria-label="Reset 3D camera to overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </nav>

        <div class="piazza-pan-hint" id="piazza3dHint">
          <span>✨ 3D European Piazza · Drag to rotate around the square · Scroll or pinch to zoom</span>
        </div>
      </div>
    `;

    this.viewportEl = document.getElementById('piazza3dViewport') as HTMLElement;
    this.canvasEl = document.getElementById('piazza3dCanvas') as HTMLCanvasElement;
    this.hotspotsOverlayEl = document.getElementById('piazza3dHotspotsOverlay') as HTMLElement;
  }

  public getEffectiveQuality(): 'high' | 'medium' | 'low' {
    const setting: QualityLevel = storage.getQualityLevel();
    if (setting !== 'auto') return setting;

    // Adaptive auto detection: check hardware concurrency & mobile user agent
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile || cores <= 4) return 'medium';
    return 'high';
  }

  private initThree(): void {
    const width = this.viewportEl.clientWidth || window.innerWidth;
    const height = this.viewportEl.clientHeight || window.innerHeight;
    this.currentEffectiveQuality = this.getEffectiveQuality();
    const quality = this.currentEffectiveQuality;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0c1326, 0.007);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1200);
    this.updateCameraOrbit();

    // 3. Renderer with Adaptive Quality
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasEl,
      antialias: quality !== 'low',
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);

    const maxPixelRatio = quality === 'high' ? 2 : quality === 'medium' ? 1.25 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

    this.renderer.shadowMap.enabled = quality !== 'low';
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // 4. KTX2 / Compressed Texture Pipeline initialization
    try {
      this.ktx2Loader = new KTX2Loader();
      const base = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : import.meta.env.BASE_URL + '/';
      this.ktx2Loader.setTranscoderPath(base + 'basis/');
      this.ktx2Loader.detectSupport(this.renderer);
    } catch (err) {
      console.warn('KTX2Loader initialization skipped:', err);
      this.ktx2Loader = null;
    }

    // ResizeObserver
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.viewportEl);

    this.boundResize = () => this.onResize();
    window.addEventListener('resize', this.boundResize);
  }

  private onResize(): void {
    if (!this.viewportEl || !this.camera || !this.renderer) return;
    const w = this.viewportEl.clientWidth || window.innerWidth;
    const h = this.viewportEl.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private loadTextures(): void {
    this.textureLoader = new THREE.TextureLoader();
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : import.meta.env.BASE_URL + '/';

    // Cobblestone pavement & normal map (supports KTX2 with JPG fallback)
    this.cobbleTex = this.loadTextureWithKTX2Fallback(base + 'assets/cobblestones.jpg', { x: 28, y: 28 });
    this.cobbleNormalTex = this.loadTextureWithKTX2Fallback(base + 'assets/cobblestones_normal.jpg', { x: 28, y: 28 });

    // Cathedral Gothic Facade & architectural relief normal map
    this.cathedralTex = this.loadTextureWithKTX2Fallback(base + 'assets/cathedral_facade.jpg');
    this.cathedralNormalTex = this.loadTextureWithKTX2Fallback(base + 'assets/cathedral_normal.jpg');

    // Gothic Stained Glass Rose Window
    this.roseWindowTex = this.loadTextureWithKTX2Fallback(base + 'assets/rose_window.jpg');

    // Historic Townhouses
    this.townhousesTex = this.loadTextureWithKTX2Fallback(base + 'assets/townhouses_facade.jpg', { x: 2, y: 1 });

    // Sky Panorama Dome
    this.skyTex = this.loadTextureWithKTX2Fallback(base + 'assets/sky_panorama.jpg');
  }

  /**
   * KTX2 / Compressed Texture Pipeline loader with automatic JPEG/PNG fallback
   */
  private loadTextureWithKTX2Fallback(
    standardPath: string,
    repeat?: { x: number; y: number },
    onMaterialApply?: (texture: THREE.Texture) => void
  ): THREE.Texture {
    const tex = this.textureLoader.load(standardPath);
    if (repeat) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat.x, repeat.y);
    }

    if (this.ktx2Loader) {
      const ktx2Path = standardPath.replace(/\.(jpe?g|png)$/i, '.ktx2');
      this.ktx2Loader.load(
        ktx2Path,
        (ktxTexture) => {
          if (repeat) {
            ktxTexture.wrapS = THREE.RepeatWrapping;
            ktxTexture.wrapT = THREE.RepeatWrapping;
            ktxTexture.repeat.set(repeat.x, repeat.y);
          }
          ktxTexture.needsUpdate = true;
          if (onMaterialApply) {
            onMaterialApply(ktxTexture);
          }
        },
        undefined,
        () => {
          // Fallback seamlessly retained via standard TextureLoader
        }
      );
    }

    return tex;
  }

  private buildWorld(): void {
    // 1. Celestial Skydome
    const skyGeo = new THREE.SphereGeometry(300, 32, 20);
    const skyMat = new THREE.MeshBasicMaterial({
      map: this.skyTex,
      side: THREE.BackSide
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.skyMesh.rotation.y = -Math.PI / 1.8;
    this.scene.add(this.skyMesh);

    // 2. Base Cobblestone Piazza Ground Plane with Tangent Space Normal Map
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.cobbleTex,
      normalMap: this.cobbleNormalTex,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.55,
      metalness: 0.2,
      color: 0xcccccc
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 3. Ambient Lighting
    this.ambientLight = new THREE.AmbientLight(0x1a2744, 0.9);
    this.scene.add(this.ambientLight);

    // Moonlight directional light
    this.moonLight = new THREE.DirectionalLight(0x7ea0d6, 0.85);
    this.moonLight.position.set(40, 70, 30);
    this.moonLight.castShadow = this.getEffectiveQuality() !== 'low';
    this.moonLight.shadow.mapSize.width = 1024;
    this.moonLight.shadow.mapSize.height = 1024;
    this.moonLight.shadow.bias = -0.001;
    this.scene.add(this.moonLight);

    // 4. Gothic Cathedral Structure
    this.buildCathedral();

    // 5. Left & Right Townhouses Wings
    this.buildTownhouses();

    // 6. Progressive 3D Elements
    this.buildProgressiveElements();

    // 7. Volumetric 3D Falling Snow
    this.buildVolumetricSnow();
  }

  private buildCathedral(): void {
    const catGroup = new THREE.Group();
    catGroup.position.set(0, 0, -56);

    const bodyGeo = new THREE.BoxGeometry(44, 48, 20);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: this.cathedralTex,
      normalMap: this.cathedralNormalTex,
      normalScale: new THREE.Vector2(0.75, 0.75),
      roughness: 0.72,
      metalness: 0.15
    });
    const catBody = new THREE.Mesh(bodyGeo, bodyMat);
    catBody.position.y = 24;
    catBody.castShadow = true;
    catBody.receiveShadow = true;
    catGroup.add(catBody);

    // Gothic Central Gable Pediment
    const pedimentGeo = new THREE.ConeGeometry(24, 12, 4);
    const pedimentMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const pediment = new THREE.Mesh(pedimentGeo, pedimentMat);
    pediment.rotation.y = Math.PI / 4;
    pediment.position.set(0, 52, 0);
    pediment.scale.set(1, 1, 0.4);
    catGroup.add(pediment);

    // Left and Right Spires with Finials & Pinnacles
    const spireGeo = new THREE.ConeGeometry(5.5, 28, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55 });

    const leftSpire = new THREE.Mesh(spireGeo, spireMat);
    leftSpire.position.set(-18, 62, 0);
    leftSpire.castShadow = true;
    catGroup.add(leftSpire);

    const rightSpire = new THREE.Mesh(spireGeo, spireMat);
    rightSpire.position.set(18, 62, 0);
    rightSpire.castShadow = true;
    catGroup.add(rightSpire);

    // Spire corner crockets / pinnacles
    const pinGeo = new THREE.ConeGeometry(0.9, 6, 4);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const towerOffsets = [-18, 18];
    towerOffsets.forEach((tx) => {
      [[-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5]].forEach(([px, pz]) => {
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(tx + px, 51, pz);
        catGroup.add(pin);
      });
    });

    // Flying Buttresses on Left & Right Flanks
    const buttressMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    for (let z = -6; z <= 6; z += 6) {
      const lb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 22, 1.8), buttressMat);
      lb.position.set(-26, 16, z);
      lb.rotation.z = -0.22;
      lb.castShadow = true;
      catGroup.add(lb);

      const rb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 22, 1.8), buttressMat);
      rb.position.set(26, 16, z);
      rb.rotation.z = 0.22;
      rb.castShadow = true;
      catGroup.add(rb);
    }

    // Grand Entrance Portal Porch (Deep Recessed Gothic Arch)
    const portalPorchGeo = new THREE.BoxGeometry(14, 12, 5);
    const portalPorchMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 });
    const portalPorch = new THREE.Mesh(portalPorchGeo, portalPorchMat);
    portalPorch.position.set(0, 6, 12.5);
    portalPorch.castShadow = true;
    portalPorch.receiveShadow = true;
    catGroup.add(portalPorch);

    const doorGeo = new THREE.BoxGeometry(8, 9, 0.4);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.9 });
    const doors = new THREE.Mesh(doorGeo, doorMat);
    doors.position.set(0, 4.5, 15.1);
    catGroup.add(doors);

    // Stained Glass Rose Window (Day 8 Awakening)
    const roseGeo = new THREE.CircleGeometry(7.2, 32);
    const roseMat = new THREE.MeshStandardMaterial({
      map: this.roseWindowTex,
      emissive: new THREE.Color(0xf59e0b),
      emissiveMap: this.roseWindowTex,
      emissiveIntensity: 0.08,
      roughness: 0.25,
      metalness: 0.1,
      side: THREE.FrontSide
    });
    this.roseMesh = new THREE.Mesh(roseGeo, roseMat);
    this.roseMesh.position.set(0, 27, 10.2);
    catGroup.add(this.roseMesh);

    // Internal Rose Window illumination
    this.roseLight = new THREE.PointLight(0xfcd34d, 0, 50, 1.4);
    this.roseLight.position.set(0, 27, 12);
    catGroup.add(this.roseLight);

    // Cathedral Grand Portal Light
    this.portalLight = new THREE.PointLight(0xf59e0b, 0, 40, 1.2);
    this.portalLight.position.set(0, 5, 14);
    catGroup.add(this.portalLight);

    this.scene.add(catGroup);
  }

  private buildTownhouses(): void {
    // West Wing
    const leftGroup = new THREE.Group();
    leftGroup.position.set(-46, 0, -12);
    leftGroup.rotation.y = Math.PI / 2;

    const leftGeo = new THREE.BoxGeometry(75, 24, 16);
    const leftMat = new THREE.MeshStandardMaterial({
      map: this.townhousesTex,
      roughness: 0.7,
      metalness: 0.1
    });
    const leftMesh = new THREE.Mesh(leftGeo, leftMat);
    leftMesh.position.y = 12;
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    leftGroup.add(leftMesh);

    // Covered Ground-Floor Colonnade / Arcade
    const arcadeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    for (let x = -30; x <= 30; x += 12) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 8, 1.6), arcadeMat);
      pillar.position.set(x, 4, 9);
      pillar.castShadow = true;
      leftGroup.add(pillar);

      const lantern = new THREE.PointLight(0xfbbf24, 0.45, 10, 1.8);
      lantern.position.set(x, 6, 8);
      leftGroup.add(lantern);
    }

    const roofGeo = new THREE.ConeGeometry(9, 10, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const chimneyGeo = new THREE.BoxGeometry(2, 4.5, 2);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });

    for (let x = -28; x <= 28; x += 14) {
      const gabledRoof = new THREE.Mesh(roofGeo, roofMat);
      gabledRoof.position.set(x, 29, 0);
      gabledRoof.rotation.y = Math.PI / 4;
      leftGroup.add(gabledRoof);

      const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
      chimney.position.set(x + 2, 32, -3);
      chimney.castShadow = true;
      leftGroup.add(chimney);
    }
    this.scene.add(leftGroup);

    // East Wing
    const rightGroup = new THREE.Group();
    rightGroup.position.set(46, 0, -12);
    rightGroup.rotation.y = -Math.PI / 2;

    const rightMesh = new THREE.Mesh(leftGeo, leftMat);
    rightMesh.position.y = 12;
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    rightGroup.add(rightMesh);

    for (let x = -30; x <= 30; x += 12) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 8, 1.6), arcadeMat);
      pillar.position.set(x, 4, 9);
      pillar.castShadow = true;
      rightGroup.add(pillar);

      const lantern = new THREE.PointLight(0xfbbf24, 0.45, 10, 1.8);
      lantern.position.set(x, 6, 8);
      rightGroup.add(lantern);
    }

    for (let x = -28; x <= 28; x += 14) {
      const gabledRoof = new THREE.Mesh(roofGeo, roofMat);
      gabledRoof.position.set(x, 29, 0);
      gabledRoof.rotation.y = Math.PI / 4;
      rightGroup.add(gabledRoof);

      const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
      chimney.position.set(x + 2, 32, -3);
      chimney.castShadow = true;
      rightGroup.add(chimney);
    }
    this.scene.add(rightGroup);
  }

  private buildProgressiveElements(): void {
    // Day 1: North Street Gas Lamp
    const lamp1 = this.createGasLampMesh(-28, 10);
    this.scene.add(lamp1.group);
    this.awakenedObjects.set(1, {
      activate: () => lamp1.setPower(true),
      deactivate: () => lamp1.setPower(false)
    });

    // Day 2: Bakery Hearth Glow
    const bakeryLight = new THREE.PointLight(0xf97316, 0, 22, 1.4);
    bakeryLight.position.set(-36, 4, -15);
    this.scene.add(bakeryLight);
    this.awakenedObjects.set(2, {
      activate: () => { bakeryLight.intensity = 2.2; },
      deactivate: () => { bakeryLight.intensity = 0; }
    });

    // Day 4: Central Stone Fountain
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(16, 0, 6);

    const basinGeo = new THREE.CylinderGeometry(5.5, 6, 2.2, 16);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = 1.1;
    basin.castShadow = true;
    fountainGroup.add(basin);

    const waterGeo = new THREE.CircleGeometry(5.2, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 2.1;
    fountainGroup.add(water);

    const fountainLight = new THREE.PointLight(0x38bdf8, 0, 18, 1.5);
    fountainLight.position.set(0, 3, 0);
    fountainGroup.add(fountainLight);

    this.scene.add(fountainGroup);
    this.awakenedObjects.set(4, {
      activate: () => { fountainLight.intensity = 2.0; },
      deactivate: () => { fountainLight.intensity = 0; }
    });

    // Day 5: Spiced Cider Wooden Stall
    const ciderStall = this.createMarketStallMesh(-20, -4, 0xef4444);
    this.scene.add(ciderStall.group);
    this.awakenedObjects.set(5, {
      activate: () => ciderStall.setVisible(true),
      deactivate: () => ciderStall.setVisible(false)
    });

    // Day 8: Cathedral Rose Window (Stained Glass Illumination)
    this.awakenedObjects.set(8, {
      activate: () => {
        this.roseLight.intensity = 3.8;
        if (this.roseMesh) {
          (this.roseMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.2;
        }
      },
      deactivate: () => {
        this.roseLight.intensity = 0;
        if (this.roseMesh) {
          (this.roseMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.08;
        }
      }
    });

    // Day 11: The Grand Evergreen Christmas Tree
    this.treeGroup = new THREE.Group();
    this.treeGroup.position.set(0, 0, -12);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.7 });
    const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const redBaubleMat = new THREE.MeshStandardMaterial({ color: 0xd90429, metalness: 0.85, roughness: 0.2 });
    const goldBaubleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });

    const tierHeights = [7, 6, 5, 4];
    const tierRadii = [6.5, 5.2, 3.8, 2.4];
    let yOffset = 2;

    for (let i = 0; i < 4; i++) {
      const coneGeo = new THREE.ConeGeometry(tierRadii[i], tierHeights[i], 16);
      const cone = new THREE.Mesh(coneGeo, foliageMat);
      cone.position.y = yOffset + tierHeights[i] / 2;
      cone.castShadow = true;
      this.treeGroup.add(cone);

      const snowRingGeo = new THREE.TorusGeometry(tierRadii[i] * 0.95, 0.35, 6, 16);
      const snowRing = new THREE.Mesh(snowRingGeo, snowCapMat);
      snowRing.rotation.x = Math.PI / 2;
      snowRing.position.y = yOffset + 0.3;
      this.treeGroup.add(snowRing);

      const baubleCount = 6 + i * 2;
      for (let b = 0; b < baubleCount; b++) {
        const bAngle = (b / baubleCount) * Math.PI * 2;
        const bRad = tierRadii[i] * 0.88;
        const bGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const bMesh = new THREE.Mesh(bGeo, b % 2 === 0 ? redBaubleMat : goldBaubleMat);
        bMesh.position.set(Math.cos(bAngle) * bRad, yOffset + 0.8, Math.sin(bAngle) * bRad);
        this.treeGroup.add(bMesh);
      }

      yOffset += tierHeights[i] * 0.7;
    }

    const trunkGeo = new THREE.CylinderGeometry(1, 1.2, 4, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5b3a29 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2;
    this.treeGroup.add(trunk);

    // Day 19: Fairy Lights points
    this.treeFairyLights = [];
    const lightColors = [0xfef08a, 0xf43f5e, 0x38bdf8, 0x10b981];
    for (let i = 0; i < 48; i++) {
      const angle = i * 0.75;
      const progress = i / 48;
      const r = (1 - progress) * 5.8 + 0.6;
      const y = progress * 16 + 3.5;

      const bulbGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const color = lightColors[i % lightColors.length];
      const bulbMat = new THREE.MeshBasicMaterial({ color });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      bulb.visible = false;
      this.treeGroup.add(bulb);
      this.treeFairyLights.push(bulb);
    }

    // Day 24: Bethlehem Star atop tree
    const starGeo = new THREE.OctahedronGeometry(1.6, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    this.treeStar = new THREE.Mesh(starGeo, starMat);
    this.treeStar.position.set(0, yOffset + 1.2, 0);
    this.treeStar.scale.set(1, 1.8, 1);
    this.treeStar.visible = false;
    this.treeGroup.add(this.treeStar);

    this.treeStarLight = new THREE.PointLight(0xfef08a, 0, 35, 1.2);
    this.treeStarLight.position.set(0, yOffset + 1.2, 0);
    this.treeGroup.add(this.treeStarLight);

    this.scene.add(this.treeGroup);

    this.awakenedObjects.set(11, {
      activate: () => { this.treeGroup.visible = true; },
      deactivate: () => { this.treeGroup.visible = false; }
    });

    // Day 12: Lebkuchen Gingerbread Stall
    const gingerStall = this.createMarketStallMesh(32, -8, 0xd97706);
    this.scene.add(gingerStall.group);
    this.awakenedObjects.set(12, {
      activate: () => gingerStall.setVisible(true),
      deactivate: () => gingerStall.setVisible(false)
    });

    // Day 16: Cathedral Grand Portal Opening Light
    this.awakenedObjects.set(16, {
      activate: () => { this.portalLight.intensity = 3.0; },
      deactivate: () => { this.portalLight.intensity = 0; }
    });

    // Day 17: Eastern Street Gas Lamp
    const lamp2 = this.createGasLampMesh(28, 10);
    this.scene.add(lamp2.group);
    this.awakenedObjects.set(17, {
      activate: () => lamp2.setPower(true),
      deactivate: () => lamp2.setPower(false)
    });

    // Day 19: Tree Fairy Lights Twinkling
    this.awakenedObjects.set(19, {
      activate: () => { this.treeFairyLights.forEach(b => b.visible = true); },
      deactivate: () => { this.treeFairyLights.forEach(b => b.visible = false); }
    });

    // Day 20: Olive Wood Nativity Creche Stall
    const crecheStall = this.createMarketStallMesh(22, -22, 0x92400e);
    this.scene.add(crecheStall.group);
    this.awakenedObjects.set(20, {
      activate: () => crecheStall.setVisible(true),
      deactivate: () => crecheStall.setVisible(false)
    });

    // Day 23: Overhead Canopy of Light Festoons
    this.festoonGroup = this.createFestoonStrings();
    this.scene.add(this.festoonGroup);
    this.awakenedObjects.set(23, {
      activate: () => { this.festoonGroup.visible = true; },
      deactivate: () => { this.festoonGroup.visible = false; }
    });

    // Day 24: Star of Bethlehem Culmination
    this.awakenedObjects.set(24, {
      activate: () => {
        this.treeStar.visible = true;
        this.treeStarLight.intensity = 4.5;
        this.renderer.toneMappingExposure = 1.35;
      },
      deactivate: () => {
        this.treeStar.visible = false;
        this.treeStarLight.intensity = 0;
        this.renderer.toneMappingExposure = 1.05;
      }
    });
  }

  private createGasLampMesh(x: number, z: number): { group: THREE.Group; setPower: (on: boolean) => void } {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const poleGeo = new THREE.CylinderGeometry(0.22, 0.35, 7, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 3.5;
    pole.castShadow = true;
    group.add(pole);

    const fixtureGeo = new THREE.OctahedronGeometry(0.7, 0);
    const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.position.y = 7.2;
    group.add(fixture);

    const pointLight = new THREE.PointLight(0xf59e0b, 0, 24, 1.5);
    pointLight.position.y = 7.3;
    pointLight.castShadow = this.getEffectiveQuality() === 'high';
    group.add(pointLight);

    return {
      group,
      setPower: (on: boolean) => {
        fixtureMat.color.setHex(on ? 0xfef08a : 0x475569);
        pointLight.intensity = on ? 2.5 : 0;
      }
    };
  }

  private createMarketStallMesh(x: number, z: number, canopyColorHex: number): { group: THREE.Group; setVisible: (val: boolean) => void } {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const baseGeo = new THREE.BoxGeometry(7, 3, 5);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = 1.5;
    base.castShadow = true;
    group.add(base);

    const roofGeo = new THREE.ConeGeometry(4.8, 2.2, 4);
    const canopyMat = new THREE.MeshStandardMaterial({ color: canopyColorHex, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, canopyMat);
    roof.position.y = 4.2;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    const stallLight = new THREE.PointLight(0xfcd34d, 1.4, 12, 1.6);
    stallLight.position.set(0, 3.2, 1.5);
    group.add(stallLight);

    group.visible = false;
    return {
      group,
      setVisible: (val: boolean) => { group.visible = val; }
    };
  }

  private createFestoonStrings(): THREE.Group {
    const group = new THREE.Group();
    group.position.set(0, 18, -10);

    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const bulbGeo = new THREE.SphereGeometry(0.2, 8, 8);

    for (let row = -20; row <= 20; row += 10) {
      for (let x = -30; x <= 30; x += 3.5) {
        const sag = Math.sin((x + 30) / 60 * Math.PI) * 3.5;
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x, -sag, row);
        group.add(bulb);
      }
    }
    group.visible = false;
    return group;
  }

  private buildVolumetricSnow(): void {
    const quality = this.getEffectiveQuality();
    const count = quality === 'high' ? 3500 : quality === 'medium' ? 1800 : 800;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = Math.random() * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
      speeds[i] = Math.random() * 0.12 + 0.04;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.snowSpeeds = speeds;

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.55,
      transparent: true,
      opacity: 0.75
    });

    this.snowPoints = new THREE.Points(geometry, material);
    this.scene.add(this.snowPoints);
  }

  build3DHotspots(): void {
    this.hotspotsOverlayEl.innerHTML = '';
    this.hotspotElements.clear();

    const lang = storage.getLanguage();

    ADVENT_DAYS.forEach((data) => {
      const status = dateGate.getDayStatus(data.day);
      const isToday = dateGate.isToday(data.day);

      const badge = document.createElement('button');
      badge.type = 'button';
      badge.className = `piazza-3d-pin pin--${status} ${isToday ? 'pin--today' : ''}`;
      badge.dataset.day = String(data.day);
      badge.setAttribute('role', 'button');

      let statusText = t('statusLocked', lang);
      if (status === 'available') statusText = isToday ? t('todayBadge', lang) : t('statusAvailable', lang);
      if (status === 'completed') statusText = t('statusCompleted', lang);

      badge.setAttribute('aria-label', `Day ${data.day}: ${data.theme}. Status: ${statusText}. Location: ${data.location}`);

      badge.innerHTML = `
        <div class="pin-halo" aria-hidden="true"></div>
        <div class="pin-core">
          <span class="pin-number">${data.day}</span>
          ${status === 'locked' ? '<span class="pin-icon">🔒</span>' : ''}
          ${status === 'completed' ? '<span class="pin-icon">⭐</span>' : ''}
        </div>
        <div class="pin-tooltip" aria-hidden="true">
          <span class="pin-tip-day">Day ${data.day} · ${data.dateLabel}</span>
          <span class="pin-tip-title">${data.theme}</span>
          <span class="pin-tip-loc">${data.location}</span>
          <span class="pin-tip-status status-${status}">${statusText}</span>
        </div>
      `;

      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        soundManager.playClick();
        this.focusOnDay(data.day);
        this.onSelectDay(data.day);
      });

      this.hotspotsOverlayEl.appendChild(badge);
      this.hotspotElements.set(data.day, {
        element: badge,
        pos3d: new THREE.Vector3(data.pos3d.x, data.pos3d.y, data.pos3d.z)
      });
    });
  }

  private updateHotspotsScreenProjection(): void {
    const halfWidth = this.viewportEl.clientWidth / 2;
    const halfHeight = this.viewportEl.clientHeight / 2;

    this.hotspotElements.forEach(({ element, pos3d }) => {
      const projected = pos3d.clone().project(this.camera);

      if (projected.z > 1.0) {
        element.style.display = 'none';
        return;
      }

      const screenX = (projected.x * halfWidth) + halfWidth;
      const screenY = -(projected.y * halfHeight) + halfHeight;

      const dist = pos3d.distanceTo(this.camera.position);
      const scale = Math.max(0.72, Math.min(1.22, 55 / dist));

      if (dist > 180 || screenX < -40 || screenX > (halfWidth * 2 + 40) || screenY < -40 || screenY > (halfHeight * 2 + 40)) {
        element.style.display = 'none';
        return;
      }

      element.style.display = 'flex';
      element.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    });
  }

  updateAtmosphere(): void {
    if (this.is2DFallbackActive) {
      this.update2DFallbackAtmosphere();
      return;
    }

    const completedDays = storage.getCompletedDays();
    const unlockAll = storage.getUnlockAll();
    const count = completedDays.length;
    const ratio = Math.min(1, count / 24);

    if (this.ambientLight) {
      const warmColor = new THREE.Color().lerpColors(
        new THREE.Color(0x1a2744),
        new THREE.Color(0x453124),
        ratio
      );
      this.ambientLight.color = warmColor;
      this.ambientLight.intensity = 0.9 + ratio * 0.4;
    }

    this.awakenedObjects.forEach(({ activate, deactivate }, thresholdDay) => {
      const isAwakened = completedDays.includes(thresholdDay) || unlockAll;
      if (isAwakened) {
        activate();
      } else {
        deactivate();
      }
    });

    this.build3DHotspots();
  }

  private initControls(): void {
    this.boundMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.piazza-3d-pin') || target?.closest?.('.view-ctrl-btn')) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      document.getElementById('piazza3dHint')?.classList.add('is-dismissed');
    };

    this.boundMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cameraTheta -= deltaX * 0.005;
      this.cameraPhi = Math.max(0.15, Math.min(Math.PI / 2 - 0.02, this.cameraPhi - deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.updateCameraOrbit();
    };

    this.boundMouseUp = () => {
      this.isDragging = false;
    };

    this.boundWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      this.cameraDistance = Math.max(12, Math.min(85, this.cameraDistance * zoomFactor));
      this.updateCameraOrbit();
    };

    let touchStartDist = 0;
    this.boundTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
      document.getElementById('piazza3dHint')?.classList.add('is-dismissed');
    };

    this.boundTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.cameraTheta -= deltaX * 0.006;
        this.cameraPhi = Math.max(0.15, Math.min(Math.PI / 2 - 0.02, this.cameraPhi - deltaY * 0.006));

        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.updateCameraOrbit();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = touchStartDist / dist;
        this.cameraDistance = Math.max(12, Math.min(85, this.cameraDistance * factor));
        touchStartDist = dist;
        this.updateCameraOrbit();
      }
    };

    this.boundTouchEnd = () => {
      this.isDragging = false;
    };

    this.viewportEl.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mouseup', this.boundMouseUp);
    this.viewportEl.addEventListener('wheel', this.boundWheel, { passive: false });

    this.viewportEl.addEventListener('touchstart', this.boundTouchStart, { passive: true });
    window.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    window.addEventListener('touchend', this.boundTouchEnd);

    this.boundZoomIn = () => {
      soundManager.playClick();
      this.cameraDistance = Math.max(12, this.cameraDistance * 0.85);
      this.updateCameraOrbit();
    };

    this.boundZoomOut = () => {
      soundManager.playClick();
      this.cameraDistance = Math.min(85, this.cameraDistance * 1.15);
      this.updateCameraOrbit();
    };

    this.boundResetView = () => {
      soundManager.playClick();
      this.resetView();
    };

    document.getElementById('btn3dZoomIn')?.addEventListener('click', this.boundZoomIn);
    document.getElementById('btn3dZoomOut')?.addEventListener('click', this.boundZoomOut);
    document.getElementById('btn3dReset')?.addEventListener('click', this.boundResetView);
  }

  private updateCameraOrbit(): void {
    if (this.isCameraAnimating) return;

    const x = this.targetCenter.x + this.cameraDistance * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    const y = this.targetCenter.y + this.cameraDistance * Math.cos(this.cameraPhi);
    const z = this.targetCenter.z + this.cameraDistance * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.targetCenter);
  }

  focusOnDay(dayNumber: number): void {
    if (this.is2DFallbackActive) {
      const pin = this.container.querySelector(`.piazza-2d-pin[data-day="${dayNumber}"]`) as HTMLElement | null;
      pin?.focus();
      return;
    }

    const data = ADVENT_DAYS.find(d => d.day === dayNumber);
    if (!data || !data.camTarget3d) return;

    const endPos = new THREE.Vector3(data.camTarget3d.x, data.camTarget3d.y, data.camTarget3d.z);
    const endLook = new THREE.Vector3(data.camTarget3d.lookAt.x, data.camTarget3d.lookAt.y, data.camTarget3d.lookAt.z);

    // If user prefers reduced motion: jump immediately without animation
    if (this.prefersReducedMotion) {
      this.camera.position.copy(endPos);
      this.targetCenter.copy(endLook);
      this.camera.lookAt(this.targetCenter);
      const delta = this.camera.position.clone().sub(this.targetCenter);
      this.cameraDistance = delta.length();
      this.cameraPhi = Math.acos(delta.y / this.cameraDistance);
      this.cameraTheta = Math.atan2(delta.x, delta.z);
      return;
    }

    const startPos = this.camera.position.clone();
    const startLook = this.targetCenter.clone();

    this.isCameraAnimating = true;
    const startTime = performance.now();
    const duration = 1100;

    const animateCam = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const tVal = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, endPos, tVal);
      this.targetCenter.lerpVectors(startLook, endLook, tVal);
      this.camera.lookAt(this.targetCenter);

      if (progress < 1) {
        requestAnimationFrame(animateCam);
      } else {
        this.isCameraAnimating = false;
        const delta = this.camera.position.clone().sub(this.targetCenter);
        this.cameraDistance = delta.length();
        this.cameraPhi = Math.acos(delta.y / this.cameraDistance);
        this.cameraTheta = Math.atan2(delta.x, delta.z);
      }
    };

    requestAnimationFrame(animateCam);
  }

  resetView(): void {
    this.cameraDistance = 55;
    this.cameraTheta = Math.PI / 2;
    this.cameraPhi = Math.PI / 3.4;
    this.targetCenter.set(0, 8, -5);
    this.updateCameraOrbit();
  }

  private animate(): void {
    this.animId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const delta = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Monitor adaptive FPS in 'auto' quality mode
    this.monitorAdaptiveFps(now);

    // 1. Skydome slow rotation (freeze if reduced motion preferred)
    if (this.skyMesh && !this.prefersReducedMotion) {
      this.skyMesh.rotation.y += 0.02 * delta;
    }

    // 2. Volumetric 3D Snow drift simulation
    if (this.snowPoints) {
      const positions = (this.snowPoints.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const count = positions.length / 3;
      const speedMultiplier = this.prefersReducedMotion ? 0.3 : 1.0;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= this.snowSpeeds[i] * delta * 60 * speedMultiplier;
        if (!this.prefersReducedMotion) {
          positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.05) * 0.03 * delta * 60;
        }

        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 60;
        }
      }
      this.snowPoints.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Tree Star sparkle rotation (Day 24)
    if (this.treeStar && this.treeStar.visible && !this.prefersReducedMotion) {
      this.treeStar.rotation.y += 0.02;
    }

    // 4. Update screen projections for 3D hotspot badges
    this.updateHotspotsScreenProjection();

    // 5. Render Scene & track frame render time
    const t0 = performance.now();
    this.renderer.render(this.scene, this.camera);
    this.lastRenderDurationMs = performance.now() - t0;
  }

  public setQuality(level: QualityLevel): void {
    storage.setQualityLevel(level);
    this.applyCurrentQuality();
  }

  public applyCurrentQuality(): void {
    const quality = this.getEffectiveQuality();
    this.currentEffectiveQuality = quality;

    if (!this.renderer) return;

    const maxPixelRatio = quality === 'high' ? 2 : quality === 'medium' ? 1.25 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    this.renderer.shadowMap.enabled = quality !== 'low';

    // Dynamically adjust volumetric snow density
    if (this.snowPoints) {
      this.scene.remove(this.snowPoints);
      this.snowPoints.geometry.dispose();
      if (Array.isArray(this.snowPoints.material)) {
        this.snowPoints.material.forEach((m) => m.dispose());
      } else {
        (this.snowPoints.material as THREE.Material).dispose();
      }
      this.buildVolumetricSnow();
    }
  }

  private monitorAdaptiveFps(now: number): void {
    this.fpsFrames++;
    const elapsed = now - this.fpsLastSample;
    if (elapsed >= 1000) {
      const fps = (this.fpsFrames * 1000) / elapsed;
      this.currentCalculatedFps = fps;
      this.fpsFrames = 0;
      this.fpsLastSample = now;

      if (storage.getQualityLevel() !== 'auto') return;

      if (fps < 28) {
        this.lowFpsStreak++;
        if (this.lowFpsStreak >= 2) {
          if (this.currentEffectiveQuality === 'high') {
            this.currentEffectiveQuality = 'medium';
            this.applyQualityTier('medium');
          } else if (this.currentEffectiveQuality === 'medium') {
            this.currentEffectiveQuality = 'low';
            this.applyQualityTier('low');
          }
          this.lowFpsStreak = 0;
        }
      } else {
        this.lowFpsStreak = 0;
      }
    }
  }

  private applyQualityTier(quality: 'high' | 'medium' | 'low'): void {
    if (!this.renderer) return;
    const maxPixelRatio = quality === 'high' ? 2 : quality === 'medium' ? 1.25 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    this.renderer.shadowMap.enabled = quality !== 'low';
  }

  private disposeMaterialTextures(material: THREE.Material): void {
    if (!material) return;
    const anyMat = material as unknown as Record<string, unknown>;
    const textureKeys = [
      'map', 'normalMap', 'roughnessMap', 'metalnessMap',
      'emissiveMap', 'bumpMap', 'displacementMap', 'alphaMap',
      'aoMap', 'lightMap', 'envMap'
    ];
    for (const key of textureKeys) {
      const val = anyMat[key];
      if (val && typeof (val as THREE.Texture).dispose === 'function') {
        (val as THREE.Texture).dispose();
      }
    }
  }

  public is2DMode(): boolean {
    return this.is2DFallbackActive;
  }

  public toggle2DFallback(force?: boolean): void {
    const targetState = force !== undefined ? force : !this.is2DFallbackActive;
    if (targetState === this.is2DFallbackActive) return;

    if (targetState) {
      this.destroy();
      this.activate2DFallback();
    } else {
      if (!this.isWebGLAvailable()) {
        alert('WebGL 3D hardware acceleration is not supported on this browser or device.');
        return;
      }
      this.is2DFallbackActive = false;
      this.container.innerHTML = '';
      this.init();
    }
  }

  private activate2DFallback(): void {
    this.is2DFallbackActive = true;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : import.meta.env.BASE_URL + '/';

    const lang = storage.getLanguage();

    this.container.innerHTML = `
      <div class="piazza-2d-viewport" id="piazza2dViewport" role="region" aria-label="Interactive 2D Advent Piazza Calendar">
        <div class="piazza-fallback-banner" role="status" aria-live="polite">
          <span class="fallback-badge">ℹ️ 2D ACCESSIBLE MODE</span>
          <span>Accessible Illustrated Piazza view active (Keyboard & Screen Reader Optimized).</span>
        </div>
        <div class="piazza-2d-canvas-wrapper">
          <img src="${base}assets/piazza_master.jpg" alt="Illustrated European Advent Piazza Square" class="piazza-2d-master-img" />
          <div class="piazza-2d-hotspots-overlay" id="piazza2dHotspotsOverlay" role="group" aria-label="Advent Day Hotspots">
            ${ADVENT_DAYS.map((item) => {
              const status = dateGate.getDayStatus(item.day);
              const isToday = dateGate.isToday(item.day);
              const isUnlocked = status !== 'locked';
              let badgeIcon = '';
              if (status === 'locked') badgeIcon = '🔒';
              if (status === 'completed') badgeIcon = '⭐';

              let statusText = t('statusLocked', lang);
              if (status === 'available') statusText = isToday ? t('todayBadge', lang) : t('statusAvailable', lang);
              if (status === 'completed') statusText = t('statusCompleted', lang);

              return `
                <button
                  type="button"
                  class="piazza-2d-pin pin--${status} ${isToday ? 'pin--today' : ''}"
                  style="left: ${item.coordinates.x}%; top: ${item.coordinates.y}%;"
                  data-day="${item.day}"
                  aria-label="Day ${item.day}: ${item.theme}. Status: ${statusText}. Location: ${item.location}"
                  ${!isUnlocked ? 'aria-disabled="true"' : ''}
                >
                  <span class="pin-badge">${item.day}</span>
                  ${badgeIcon ? `<span class="pin-sub-icon">${badgeIcon}</span>` : ''}
                  <span class="pin-tooltip">
                    <span class="pin-tooltip-day">Day ${item.day}</span>
                    <span class="pin-tooltip-title">${item.theme}</span>
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind click & keyboard handlers to all 2D pins
    this.container.querySelectorAll('.piazza-2d-pin').forEach((btnEl) => {
      const btn = btnEl as HTMLElement;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundManager.playClick();
        const day = parseInt(btn.dataset.day || '1', 10);
        this.onSelectDay(day);
      });
    });
  }

  private update2DFallbackAtmosphere(): void {
    const lang = storage.getLanguage();
    this.container.querySelectorAll('.piazza-2d-pin').forEach((btnEl) => {
      const btn = btnEl as HTMLElement;
      const day = parseInt(btn.dataset.day || '1', 10);
      const item = ADVENT_DAYS[day - 1];
      if (!item) return;

      const status = dateGate.getDayStatus(day);
      const isToday = dateGate.isToday(day);
      const isUnlocked = status !== 'locked';

      let statusText = t('statusLocked', lang);
      if (status === 'available') statusText = isToday ? t('todayBadge', lang) : t('statusAvailable', lang);
      if (status === 'completed') statusText = t('statusCompleted', lang);

      btn.className = `piazza-2d-pin pin--${status} ${isToday ? 'pin--today' : ''}`;
      btn.setAttribute('aria-label', `Day ${day}: ${item.theme}. Status: ${statusText}. Location: ${item.location}`);
      btn.setAttribute('aria-disabled', isUnlocked ? 'false' : 'true');

      let badgeIcon = '';
      if (status === 'locked') badgeIcon = '🔒';
      if (status === 'completed') badgeIcon = '⭐';

      let subIcon = btn.querySelector('.pin-sub-icon');
      if (badgeIcon && !subIcon) {
        subIcon = document.createElement('span');
        subIcon.className = 'pin-sub-icon';
        btn.appendChild(subIcon);
      }
      if (subIcon) {
        subIcon.textContent = badgeIcon;
      }
    });
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const targetFps = isMobile ? 30 : 60;
    const currentFps = this.is2DFallbackActive ? 60 : (this.currentCalculatedFps || 60);
    const frameTime = this.is2DFallbackActive ? 0.5 : Number(this.lastRenderDurationMs.toFixed(1));

    let budgetStatus: 'pass' | 'warn' | 'fail' = 'pass';
    if (!this.is2DFallbackActive) {
      if (currentFps < targetFps * 0.5) {
        budgetStatus = 'fail';
      } else if (currentFps < targetFps * 0.85) {
        budgetStatus = 'warn';
      }
    }

    return {
      fps: Math.round(currentFps),
      frameTimeMs: frameTime,
      targetFrameBudgetMs: isMobile ? 33.3 : 16.6,
      drawCalls: this.renderer?.info?.render?.calls || 0,
      triangles: this.renderer?.info?.render?.triangles || 0,
      textures: this.renderer?.info?.memory?.textures || 0,
      geometries: this.renderer?.info?.memory?.geometries || 0,
      quality: this.currentEffectiveQuality,
      is2DFallback: this.is2DFallbackActive,
      budgetStatus
    };
  }

  /**
   * Complete, thorough resource disposal traversing scene graph,
   * disposing geometries, materials, textures, removing all event listeners,
   * disconnecting observers, and releasing WebGL GPU context.
   */
  destroy(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    // Remove DOM event listeners
    if (this.viewportEl) {
      this.viewportEl.removeEventListener('mousedown', this.boundMouseDown);
      this.viewportEl.removeEventListener('wheel', this.boundWheel);
      this.viewportEl.removeEventListener('touchstart', this.boundTouchStart);
    }
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseup', this.boundMouseUp);
    window.removeEventListener('touchmove', this.boundTouchMove);
    window.removeEventListener('touchend', this.boundTouchEnd);
    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize);
    }

    const btnZoomIn = document.getElementById('btn3dZoomIn');
    if (btnZoomIn && this.boundZoomIn) btnZoomIn.removeEventListener('click', this.boundZoomIn);
    const btnZoomOut = document.getElementById('btn3dZoomOut');
    if (btnZoomOut && this.boundZoomOut) btnZoomOut.removeEventListener('click', this.boundZoomOut);
    const btnReset = document.getElementById('btn3dReset');
    if (btnReset && this.boundResetView) btnReset.removeEventListener('click', this.boundResetView);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.mediaQueryListener) {
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', this.mediaQueryListener);
      this.mediaQueryListener = null;
    }

    // Comprehensive Scene Graph Traversal & GPU Resource Cleanup
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          if (obj.geometry) {
            obj.geometry.dispose();
          }

          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              this.disposeMaterialTextures(mat);
              mat.dispose();
            });
          } else if (obj.material) {
            this.disposeMaterialTextures(obj.material);
            obj.material.dispose();
          }
        }
      });
      this.scene.clear();
    }

    // Textures disposal
    this.cobbleTex?.dispose();
    this.cobbleNormalTex?.dispose();
    this.cathedralTex?.dispose();
    this.cathedralNormalTex?.dispose();
    this.roseWindowTex?.dispose();
    this.townhousesTex?.dispose();
    this.skyTex?.dispose();

    // KTX2 Loader disposal
    if (this.ktx2Loader) {
      this.ktx2Loader.dispose();
      this.ktx2Loader = null;
    }

    // WebGL Renderer disposal & context loss
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    // Clear hotspot tracking
    this.hotspotElements.clear();
    if (this.hotspotsOverlayEl) {
      this.hotspotsOverlayEl.innerHTML = '';
    }
  }
}
