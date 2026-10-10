/**
 * The Advent Piazza — High-Fidelity 3D Interactive Scene Engine
 * Built with Three.js: Features progressive 3D awakening, volumetric snow,
 * dynamic spatial lighting, high-res textures, interactive 3D hotspots, and smooth camera controls.
 */

import * as THREE from 'three';
import { ADVENT_DAYS } from '../data/adventDays.js';
import { dateGate } from '../services/dateGate.js';
import { storage } from '../services/storage.js';
import { t } from '../data/translations.js';
import { soundManager } from '../audio/soundManager.js';

export class PiazzaScene3D {
  constructor({ container, onSelectDay }) {
    this.container = container;
    this.onSelectDay = onSelectDay;

    this.animId = null;
    this.lastTime = performance.now();
    this.awakenedObjects = new Map();
    this.hotspotElements = new Map();

    // Camera fly-to interpolation state
    this.camTargetPos = null;
    this.camLookTarget = null;
    this.isCameraAnimating = false;

    // Mouse / Touch interaction
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraDistance = 55;
    this.cameraTheta = Math.PI / 2; // Azimuth angle
    this.cameraPhi = Math.PI / 3.4;  // Polar angle
    this.targetCenter = new THREE.Vector3(0, 8, -5);

    this.init();
  }

  init() {
    this.renderDOM();
    this.initThree();
    this.loadTextures();
    this.buildWorld();
    this.build3DHotspots();
    this.initControls();
    this.updateAtmosphere();
    this.animate();
  }

  renderDOM() {
    this.container.innerHTML = `
      <div class="piazza-3d-viewport" id="piazza3dViewport">
        <!-- Three.js Canvas container -->
        <canvas id="piazza3dCanvas"></canvas>

        <!-- Screen-projected 3D Hotspot Badges Container -->
        <div class="piazza-3d-hotspots-overlay" id="piazza3dHotspotsOverlay"></div>

        <!-- 3D Viewport Navigation Controls -->
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

        <!-- 3D Navigation Hint -->
        <div class="piazza-pan-hint" id="piazza3dHint">
          <span>✨ 3D European Piazza · Drag to rotate around the square · Scroll or pinch to zoom</span>
        </div>
      </div>
    `;

    this.viewportEl = document.getElementById('piazza3dViewport');
    this.canvasEl = document.getElementById('piazza3dCanvas');
    this.hotspotsOverlayEl = document.getElementById('piazza3dHotspotsOverlay');
  }

  initThree() {
    const width = this.viewportEl.clientWidth || window.innerWidth;
    const height = this.viewportEl.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0c1326, 0.007);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1200);
    this.updateCameraOrbit();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasEl,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Window resize and ResizeObserver for responsive full-screen coverage
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.viewportEl);
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.viewportEl || !this.camera || !this.renderer) return;
    const w = this.viewportEl.clientWidth || window.innerWidth;
    const h = this.viewportEl.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  loadTextures() {
    this.textureLoader = new THREE.TextureLoader();
    const base = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : import.meta.env.BASE_URL + '/';

    // Cobblestone pavement
    this.cobbleTex = this.textureLoader.load(base + 'assets/cobblestones.jpg');
    this.cobbleTex.wrapS = THREE.RepeatWrapping;
    this.cobbleTex.wrapT = THREE.RepeatWrapping;
    this.cobbleTex.repeat.set(28, 28);

    // Cathedral Gothic Facade
    this.cathedralTex = this.textureLoader.load(base + 'assets/cathedral_facade.jpg');

    // Historic Townhouses
    this.townhousesTex = this.textureLoader.load(base + 'assets/townhouses_facade.jpg');
    this.townhousesTex.wrapS = THREE.RepeatWrapping;
    this.townhousesTex.repeat.set(2, 1);

    // Sky Panorama Dome
    this.skyTex = this.textureLoader.load(base + 'assets/sky_panorama.jpg');
  }

  buildWorld() {
    // 1. Celestial Skydome
    const skyGeo = new THREE.SphereGeometry(300, 32, 20);
    const skyMat = new THREE.MeshBasicMaterial({
      map: this.skyTex,
      side: THREE.BackSide
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.skyMesh.rotation.y = -Math.PI / 1.8;
    this.scene.add(this.skyMesh);

    // 2. Base Cobblestone Piazza Ground Plane (Expansive to prevent cutoffs)
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({
      map: this.cobbleTex,
      roughness: 0.65,
      metalness: 0.25,
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
    this.moonLight.castShadow = true;
    this.moonLight.shadow.mapSize.width = 1024;
    this.moonLight.shadow.mapSize.height = 1024;
    this.moonLight.shadow.bias = -0.001;
    this.scene.add(this.moonLight);

    // 4. Gothic Cathedral Structure (Center Rear)
    this.buildCathedral();

    // 5. Left & Right Townhouses Wings
    this.buildTownhouses();

    // 6. Progressive 3D Scene Elements
    this.buildProgressiveElements();

    // 7. Volumetric 3D Falling Snow
    this.buildVolumetricSnow();
  }

  buildCathedral() {
    const catGroup = new THREE.Group();
    catGroup.position.set(0, 0, -56);

    // Main Cathedral Body
    const bodyGeo = new THREE.BoxGeometry(44, 48, 20);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: this.cathedralTex,
      roughness: 0.75,
      metalness: 0.15
    });
    const catBody = new THREE.Mesh(bodyGeo, bodyMat);
    catBody.position.y = 24;
    catBody.castShadow = true;
    catBody.receiveShadow = true;
    catGroup.add(catBody);

    // Left & Right Spires
    const spireGeo = new THREE.ConeGeometry(5.5, 26, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });

    const leftSpire = new THREE.Mesh(spireGeo, spireMat);
    leftSpire.position.set(-18, 60, 0);
    catGroup.add(leftSpire);

    const rightSpire = new THREE.Mesh(spireGeo, spireMat);
    rightSpire.position.set(18, 60, 0);
    catGroup.add(rightSpire);

    // Cathedral Rose Window illumination (Day 8 target - internal stained glass light)
    this.roseLight = new THREE.PointLight(0xfcd34d, 0, 50, 1.4);
    this.roseLight.position.set(0, 26, 11);
    catGroup.add(this.roseLight);

    // Cathedral Grand Portal (Day 16 target)
    this.portalLight = new THREE.PointLight(0xf59e0b, 0, 40, 1.2);
    this.portalLight.position.set(0, 4, 11);
    catGroup.add(this.portalLight);

    this.scene.add(catGroup);
  }

  buildTownhouses() {
    // Left Wing (West Facade)
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

    // Gabled Roofs with Snow
    const roofGeo = new THREE.ConeGeometry(9, 10, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    for (let x = -28; x <= 28; x += 14) {
      const gabledRoof = new THREE.Mesh(roofGeo, roofMat);
      gabledRoof.position.set(x, 29, 0);
      gabledRoof.rotation.y = Math.PI / 4;
      leftGroup.add(gabledRoof);
    }
    this.scene.add(leftGroup);

    // Right Wing (East Facade)
    const rightGroup = new THREE.Group();
    rightGroup.position.set(46, 0, -12);
    rightGroup.rotation.y = -Math.PI / 2;

    const rightMesh = new THREE.Mesh(leftGeo, leftMat);
    rightMesh.position.y = 12;
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    rightGroup.add(rightMesh);

    for (let x = -28; x <= 28; x += 14) {
      const gabledRoof = new THREE.Mesh(roofGeo, roofMat);
      gabledRoof.position.set(x, 29, 0);
      gabledRoof.rotation.y = Math.PI / 4;
      rightGroup.add(gabledRoof);
    }
    this.scene.add(rightGroup);
  }

  buildProgressiveElements() {
    // ----------------------------------------------------
    // Day 1: North Street Gas Lamp
    // ----------------------------------------------------
    const lamp1 = this.createGasLampMesh(-28, 10);
    this.scene.add(lamp1.group);
    this.awakenedObjects.set(1, {
      activate: () => lamp1.setPower(true),
      deactivate: () => lamp1.setPower(false)
    });

    // ----------------------------------------------------
    // Day 2: Old Town Bakery Window & Hearth Glow
    // ----------------------------------------------------
    const bakeryLight = new THREE.PointLight(0xf97316, 0, 22, 1.4);
    bakeryLight.position.set(-36, 4, -15);
    this.scene.add(bakeryLight);
    this.awakenedObjects.set(2, {
      activate: () => { bakeryLight.intensity = 2.2; },
      deactivate: () => { bakeryLight.intensity = 0; }
    });

    // ----------------------------------------------------
    // Day 4: Central Stone Fountain
    // ----------------------------------------------------
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(16, 0, 6);

    const basinGeo = new THREE.CylinderGeometry(5.5, 6, 2.2, 16);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.y = 1.1;
    basin.castShadow = true;
    fountainGroup.add(basin);

    // Water surface
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

    // ----------------------------------------------------
    // Day 5: Spiced Cider Wooden Stall
    // ----------------------------------------------------
    const ciderStall = this.createMarketStallMesh(-20, -4, 0xef4444, "Spiced Cider");
    this.scene.add(ciderStall.group);
    this.awakenedObjects.set(5, {
      activate: () => ciderStall.setVisible(true),
      deactivate: () => ciderStall.setVisible(false)
    });

    // ----------------------------------------------------
    // Day 8: Cathedral Rose Window
    // ----------------------------------------------------
    this.awakenedObjects.set(8, {
      activate: () => {
        this.roseLight.intensity = 3.5;
      },
      deactivate: () => {
        this.roseLight.intensity = 0;
      }
    });

    // ----------------------------------------------------
    // Day 11: The Grand Evergreen Christmas Tree
    // ----------------------------------------------------
    this.treeGroup = new THREE.Group();
    this.treeGroup.position.set(0, 0, -12);

    // Multi-tiered foliage cones with snow caps and baubles
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

      // Snow frosting ring on tier ledge
      const snowRingGeo = new THREE.TorusGeometry(tierRadii[i] * 0.95, 0.35, 6, 16);
      const snowRing = new THREE.Mesh(snowRingGeo, snowCapMat);
      snowRing.rotation.x = Math.PI / 2;
      snowRing.position.y = yOffset + 0.3;
      this.treeGroup.add(snowRing);

      // Decorative baubles around each tier
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

    // Trunk
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
    this.treeStarMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    this.treeStar = new THREE.Mesh(starGeo, this.treeStarMat);
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
    const gingerStall = this.createMarketStallMesh(32, -8, 0xd97706, "Lebkuchen");
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
    const crecheStall = this.createMarketStallMesh(22, -22, 0x92400e, "Nativity Creche");
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

  createGasLampMesh(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Cast-iron pole
    const poleGeo = new THREE.CylinderGeometry(0.22, 0.35, 7, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 3.5;
    pole.castShadow = true;
    group.add(pole);

    // Lantern fixture
    const fixtureGeo = new THREE.OctahedronGeometry(0.7, 0);
    const fixtureMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
    fixture.position.y = 7.2;
    group.add(fixture);

    // Dynamic Point Light casting light onto the stones
    const pointLight = new THREE.PointLight(0xf59e0b, 0, 24, 1.5);
    pointLight.position.y = 7.3;
    pointLight.castShadow = true;
    group.add(pointLight);

    return {
      group,
      setPower: (on) => {
        fixtureMat.color.setHex(on ? 0xfef08a : 0x475569);
        pointLight.intensity = on ? 2.5 : 0;
      }
    };
  }

  createMarketStallMesh(x, z, canopyColorHex, label) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Wooden booth base
    const baseGeo = new THREE.BoxGeometry(7, 3, 5);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = 1.5;
    base.castShadow = true;
    group.add(base);

    // Canopy roof
    const roofGeo = new THREE.ConeGeometry(4.8, 2.2, 4);
    const canopyMat = new THREE.MeshStandardMaterial({ color: canopyColorHex, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, canopyMat);
    roof.position.y = 4.2;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    // Stall lantern
    const stallLight = new THREE.PointLight(0xfcd34d, 1.4, 12, 1.6);
    stallLight.position.set(0, 3.2, 1.5);
    group.add(stallLight);

    group.visible = false;
    return {
      group,
      setVisible: (val) => { group.visible = val; }
    };
  }

  createFestoonStrings() {
    const group = new THREE.Group();
    group.position.set(0, 18, -10);

    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const bulbGeo = new THREE.SphereGeometry(0.2, 8, 8);

    for (let row = -20; row <= 20; row += 10) {
      for (let x = -30; x <= 30; x += 3.5) {
        // Catenary sag curve
        const sag = Math.sin((x + 30) / 60 * Math.PI) * 3.5;
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x, -sag, row);
        group.add(bulb);
      }
    }
    group.visible = false;
    return group;
  }

  buildVolumetricSnow() {
    const count = 3500;
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

  build3DHotspots() {
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

  updateHotspotsScreenProjection() {
    const halfWidth = this.viewportEl.clientWidth / 2;
    const halfHeight = this.viewportEl.clientHeight / 2;

    this.hotspotElements.forEach(({ element, pos3d }) => {
      // Project 3D vector into Normalized Device Coordinates (NDC)
      const projected = pos3d.clone().project(this.camera);

      // Check if behind camera or outside near frustum
      if (projected.z > 1.0) {
        element.style.display = 'none';
        return;
      }

      const screenX = (projected.x * halfWidth) + halfWidth;
      const screenY = -(projected.y * halfHeight) + halfHeight;

      // Distance-aware dynamic scaling: smooth scaling based on camera distance
      const dist = pos3d.distanceTo(this.camera.position);
      const scale = Math.max(0.72, Math.min(1.22, 55 / dist));

      // Viewport margin culling
      if (dist > 180 || screenX < -40 || screenX > (halfWidth * 2 + 40) || screenY < -40 || screenY > (halfHeight * 2 + 40)) {
        element.style.display = 'none';
        return;
      }

      element.style.display = 'flex';
      element.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    });
  }

  updateAtmosphere() {
    const completedDays = storage.getCompletedDays();
    const unlockAll = storage.getUnlockAll();
    const count = completedDays.length;
    const ratio = Math.min(1, count / 24);

    // Warm up sky and ambient light as days are completed
    if (this.ambientLight) {
      // From cold blue (0x1a2744) to warm candlelight ambient (0x453124)
      const warmColor = new THREE.Color().lerpColors(
        new THREE.Color(0x1a2744),
        new THREE.Color(0x453124),
        ratio
      );
      this.ambientLight.color = warmColor;
      this.ambientLight.intensity = 0.9 + ratio * 0.4;
    }

    // Activate/deactivate progressive elements based on thresholds
    this.awakenedObjects.forEach(({ activate, deactivate }, thresholdDay) => {
      const isAwakened = completedDays.includes(thresholdDay) || unlockAll;
      if (isAwakened) {
        activate();
      } else {
        deactivate();
      }
    });

    // Re-render hotspot badge classes
    this.build3DHotspots();
  }

  initControls() {
    // Mouse Drag Rotation
    this.viewportEl.addEventListener('mousedown', (e) => {
      const target = /** @type {HTMLElement|null} */ (e.target);
      if (target?.closest?.('.piazza-3d-pin') || target?.closest?.('.view-ctrl-btn')) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      document.getElementById('piazza3dHint')?.classList.add('is-dismissed');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cameraTheta -= deltaX * 0.005;
      this.cameraPhi = Math.max(0.15, Math.min(Math.PI / 2 - 0.02, this.cameraPhi - deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.updateCameraOrbit();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Wheel Zoom
    this.viewportEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      this.cameraDistance = Math.max(12, Math.min(85, this.cameraDistance * zoomFactor));
      this.updateCameraOrbit();
    }, { passive: false });

    // Touch Support for Mobile / Tablet
    let touchStartDist = 0;
    this.viewportEl.addEventListener('touchstart', (e) => {
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
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
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
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Zoom Buttons
    document.getElementById('btn3dZoomIn')?.addEventListener('click', () => {
      soundManager.playClick();
      this.cameraDistance = Math.max(12, this.cameraDistance * 0.85);
      this.updateCameraOrbit();
    });

    document.getElementById('btn3dZoomOut')?.addEventListener('click', () => {
      soundManager.playClick();
      this.cameraDistance = Math.min(85, this.cameraDistance * 1.15);
      this.updateCameraOrbit();
    });

    document.getElementById('btn3dReset')?.addEventListener('click', () => {
      soundManager.playClick();
      this.resetView();
    });
  }

  updateCameraOrbit() {
    if (this.isCameraAnimating) return;

    const x = this.targetCenter.x + this.cameraDistance * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    const y = this.targetCenter.y + this.cameraDistance * Math.cos(this.cameraPhi);
    const z = this.targetCenter.z + this.cameraDistance * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.targetCenter);
  }

  focusOnDay(dayNumber) {
    const data = ADVENT_DAYS.find(d => d.day === dayNumber);
    if (!data || !data.camTarget3d) return;

    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(data.camTarget3d.x, data.camTarget3d.y, data.camTarget3d.z);

    const startLook = this.targetCenter.clone();
    const endLook = new THREE.Vector3(data.camTarget3d.lookAt.x, data.camTarget3d.lookAt.y, data.camTarget3d.lookAt.z);

    this.isCameraAnimating = true;
    const startTime = performance.now();
    const duration = 1100; // ms

    const animateCam = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic easing
      const tVal = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, endPos, tVal);
      this.targetCenter.lerpVectors(startLook, endLook, tVal);
      this.camera.lookAt(this.targetCenter);

      if (progress < 1) {
        requestAnimationFrame(animateCam);
      } else {
        this.isCameraAnimating = false;
        // Re-derive orbit parameters from final position
        const delta = this.camera.position.clone().sub(this.targetCenter);
        this.cameraDistance = delta.length();
        this.cameraPhi = Math.acos(delta.y / this.cameraDistance);
        this.cameraTheta = Math.atan2(delta.x, delta.z);
      }
    };

    requestAnimationFrame(animateCam);
  }

  resetView() {
    this.cameraDistance = 55;
    this.cameraTheta = Math.PI / 2;
    this.cameraPhi = Math.PI / 3.4;
    this.targetCenter.set(0, 8, -5);
    this.updateCameraOrbit();
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const delta = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // 1. Subtle Skydome slow rotation (framerate independent)
    if (this.skyMesh) {
      this.skyMesh.rotation.y += 0.02 * delta;
    }

    // 2. Volumetric 3D Snow drift simulation (framerate independent)
    if (this.snowPoints) {
      const positions = this.snowPoints.geometry.attributes.position.array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= this.snowSpeeds[i] * delta * 60; // Fall Y
        positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.05) * 0.03 * delta * 60; // Gentle wind X

        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 60;
        }
      }
      this.snowPoints.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Tree Star sparkle rotation (Day 24)
    if (this.treeStar && this.treeStar.visible) {
      this.treeStar.rotation.y += 0.02;
    }

    // 4. Update screen projections for 3D hotspot badges
    this.updateHotspotsScreenProjection();

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.renderer) this.renderer.dispose();
  }
}
