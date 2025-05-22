const textureLoader = new THREE.TextureLoader();

let gameActive = false;

const menuContainer = document.getElementById('menuContainer');
const creditsContainer = document.getElementById('creditsContainer');
const gameContainer = document.getElementById('gameContainer');
const playButton = document.getElementById('playButton');
const creditsButton = document.getElementById('creditsButton');
const backButton = document.getElementById('backButton');

playButton.addEventListener('click', startGame);
creditsButton.addEventListener('click', showCredits);
backButton.addEventListener('click', hideCredits);

function startGame() {
    const mapSelect = document.getElementById('mapSelect');
    currentMap = mapSelect.value;
    mazeLayout = GAME_MAPS[currentMap];
    
    menuContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    gameActive = true;
    isGameOver = false;
    playerLives = 3;
    updateHUD();
    init();
}

function showCredits() {
    menuContainer.style.display = 'none';
    creditsContainer.style.display = 'flex';
}

function hideCredits() {
    creditsContainer.style.display = 'none';
    menuContainer.style.display = 'flex';
}

const arenaSize = 30;
const wallHeight = 2;
const gridSize = 15; 
const cellSize = arenaSize / gridSize;

let scene, camera, renderer;
let playerLives = 3;
let isGameOver = false;
let secondaryScene, secondaryCamera, secondaryRenderer;
let topViewScene, topViewCamera, topViewRenderer;
let player, arena, topViewPlayer, topViewArena;
let rats = [];
let totalCoins = 0;
let collectedCoins = 0; 

let freeCamera;
let freeCameraActive = false;
let freeCameraSpeed = 0.05;
let freeCameraRotationSpeed = 0.02;
let freeCameraControls = {
    up: false,
    down: false,
    left: false,
    right: false,
    forward: false,
    backward: false
};
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
const rotationSmoothing = 0.1;
const maxVerticalRotation = Math.PI / 2;

let isSpeedBoosted = false;
let speedBoostTimeout = null;
const SPEED_BOOST_DURATION = 5000; // 5 segundos
const SPEED_BOOST_MULTIPLIER = 1.5;

const RAT_MOVE_INTERVAL = 1000;
const MOVEMENT_DURATION = 500; // Mais rápido, estilo Minecraft
const LIMB_ROTATION = Math.PI / 4;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isTopView = false;
let bombs = []; 
let explosions = []; 
const BOMB_TIMER = 2000; 
const EXPLOSION_DURATION = 1000; 
const EXPLOSION_RANGE = 2; 
let canMove = true;
let playerSpeed2 = 1.0;

const playerSpeed = 1.0;


const GAME_MAPS = {
    classic: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
        [0, 1, 1, 2, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 2, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 1, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0],
        [0, 2, 0, 0, 1, 2, 1, 1, 1, 2, 1, 1, 0, 2, 0],
        [0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 2, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 2, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 2, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    maze: [
        [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 1, 1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
        [1, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 1],
        [0, 0, 0, 0, 1, 0, 3, 2, 3, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 2, 0, 0, 2, 1, 2, 0, 0, 2, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 3, 2, 3, 0, 1, 0, 0, 0, 0],
        [1, 2, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 1],
        [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
    ],
    arena: [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [1, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 1],
        [1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 2, 0, 2, 0, 0, 3, 0, 0, 2, 0, 2, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [1, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 1],
        [1, 0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]
    ]
};

let currentMap = 'classic';
let mazeLayout = GAME_MAPS[currentMap];

const MAP_MODELS = {
    classic: {
        destructible: [
            {
                obj: 'assets/models/flower01/Flower01-0.obj',
                mtl: 'assets/models/flower01/Flower01-0.mtl'
            },
            {
                obj: 'assets/models/deer/deer.obj',
                mtl: 'assets/models/deer/deer.mtl'
            }
        ],
        powerUps: [
            {
                obj: 'assets/models/CreamPie/CreamPie.obj',
                mtl: 'assets/models/CreamPie/CreamPie.mtl'
            }
        ],
        rat: {
            obj: 'assets/models/rat/rat.obj',
            mtl: 'assets/models/rat/rat.mtl'
        },
                coin: {
            obj: 'assets/models/coin/coin.obj',
            mtl: 'assets/models/coin/coin.mtl'
        }
    },
    maze: {
        destructible: [
            {
                obj: 'assets/models/flower01/Flower01-0.obj',
                mtl: 'assets/models/flower01/Flower01-0.mtl'
            },
            {
                obj: 'assets/models/flower01/Flower01-0.obj',
                mtl: 'assets/models/flower01/Flower01-0.mtl'
            }
        ],
        powerUps: [
            {
                obj: 'assets/models/CreamPie/CreamPie.obj',
                mtl: 'assets/models/CreamPie/CreamPie.mtl'
            }
        ],
        rat: {
                obj: 'assets/models/deer/deer.obj',
                mtl: 'assets/models/deer/deer.mtl'
        },
                coin: {
            obj: 'assets/models/coin/coin.obj',
            mtl: 'assets/models/coin/coin.mtl'
        }
    },
    arena: {
        destructible: [
            {
                obj: 'assets/models/caixacorreio/caixacorreio.obj',
                mtl: 'assets/models/caixacorreio/caixacorreio.mtl'
            },
            {
                obj: 'assets/models/tree/tree.obj',
                mtl: 'assets/models/tree/tree.mtl'
            }
        ],
        powerUps: [
            {
                obj: 'assets/models/CreamPie/CreamPie.obj',
                mtl: 'assets/models/CreamPie/CreamPie.mtl'
            }
        ],
        rat: {
            obj: 'assets/models/robot/robot.obj',
            mtl: 'assets/models/robot/robot.mtl'
        },
                coin: {
            obj: 'assets/models/coin/coin.obj',
            mtl: 'assets/models/coin/coin.mtl'
        }
    }
};


 


function switchCamera() {
    isTopView = !isTopView;
    if (isTopView) {
        camera.position.set(0, 30, 0);
        camera.lookAt(0, 0, 0);
        camera.rotation.z = 0;
        
        secondaryCamera.position.set(arenaSize, arenaSize, arenaSize);
        secondaryCamera.lookAt(0, 0, 0);
    } else {
        camera.position.set(arenaSize, arenaSize, arenaSize);
        camera.lookAt(0, 0, 0);
        
        secondaryCamera.position.set(0, 30, 0);
        secondaryCamera.lookAt(0, 0, 0);
        secondaryCamera.rotation.z = 0;
    }
}
function placeBomb() {
    const existingBomb = bombs.find(bomb => 
        bomb.gridX === currentGridX && 
        bomb.gridZ === currentGridZ
    );
    
    if (existingBomb) return;

    if (bombSound) {
        const sound = new THREE.Audio(listener);
        sound.setBuffer(bombSound);
        sound.setVolume(0.5); 
        sound.play();
    }

    const worldPos = gridToWorld(currentGridX, currentGridZ);
    
    const bombGroup = new THREE.Group();
    bombGroup.position.set(worldPos.x, 0, worldPos.z);
    scene.add(bombGroup);
    

    loadOBJModel(
        'assets/models/bomb/bomb.obj',
        'assets/models/bomb/bomb.mtl',
        { x: 0, y: 0, z: 0 },
        bombGroup
    );
    
    const bomb = {
        mesh: bombGroup,
        gridX: currentGridX,
        gridZ: currentGridZ,
        timer: Date.now(),
    };
    
    bombs.push(bomb);
    
    setTimeout(() => explodeBomb(bomb), BOMB_TIMER);
}

function explodeBomb(bomb) {
    scene.remove(bomb.mesh);
    bombs = bombs.filter(b => b !== bomb);
    
    // Criar flash de luz
    const explosionLight = new THREE.PointLight(0xffff00, 3, 10);
    explosionLight.position.copy(bomb.mesh.position);
    explosionLight.position.y = 1; // Posicionar um pouco acima do chão
    scene.add(explosionLight);
    
    // Animação do flash
    const flashDuration = 500; // duração em millisegundos
    const flashStartIntensity = 30;
    const flashStartTime = Date.now();
    
    function updateFlash() {
        const elapsed = Date.now() - flashStartTime;
        const progress = elapsed / flashDuration;
        
        if (progress < 1) {
            explosionLight.intensity = flashStartIntensity * (1 - progress);
            requestAnimationFrame(updateFlash);
        } else {
            scene.remove(explosionLight);
        }
    }
    
    updateFlash();
    
    const explosionGeometry = new THREE.BoxGeometry(cellSize, 0.1, cellSize);
    const explosionMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0.7 
    });
    
    const canPropagate = (gridX, gridZ) => {
        if (gridX < 0 || gridX >= gridSize || gridZ < 0 || gridZ >= gridSize) {
            return false;
        }
        return mazeLayout[gridZ][gridX] !== 1;
    };
    
    const explosionCells = [];
        const killedRats = new Set();


    const addExplosion = (gridX, gridZ) => {
        if (gridX >= 0 && gridX < gridSize && gridZ >= 0 && gridZ < gridSize) {
            const worldPos = gridToWorld(gridX, gridZ);
            const explosionMesh = new THREE.Mesh(explosionGeometry, explosionMaterial);
            explosionMesh.position.set(worldPos.x, 0.1, worldPos.z);
            scene.add(explosionMesh);
            explosionCells.push(explosionMesh);

                        rats.forEach(rat => {
                if (rat.gridX === gridX && rat.gridZ === gridZ) {
                    killedRats.add(rat);
                }
            });
            
if (mazeLayout[gridZ][gridX] === 2) {
    mazeLayout[gridZ][gridX] = 0;
    arena.children.forEach(child => {
        if (child.position.x === worldPos.x && 
            child.position.z === worldPos.z && 
            child instanceof THREE.Group) {
            arena.remove(child);
            
            // deixar a 1 para teste
if (Math.random() < 1) {
    const mapPowerUps = MAP_MODELS[currentMap].powerUps;
    const randomPowerUp = mapPowerUps[Math.floor(Math.random() * mapPowerUps.length)];
    const powerUpGroup = new THREE.Group();
    powerUpGroup.position.set(worldPos.x, wallHeight/2, worldPos.z);
    
    powerUpGroup.userData.isPowerUp = true;
    
    loadOBJModel(
        randomPowerUp.obj,
        randomPowerUp.mtl,
        { x: 0, y: 0, z: 0 },
        powerUpGroup
    );
    
    const initialY = powerUpGroup.position.y;
    powerUpGroup.userData.floatAnimation = {
        initialY: initialY,
        offset: 0
    };
    
    arena.add(powerUpGroup);
}
        }
    });
    return false;
}
            return true; 
        }
        return false;
    };
    
    addExplosion(bomb.gridX, bomb.gridZ);
    
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];


    
    directions.forEach(([dx, dz]) => {
        let canContinue = true;
        for (let i = 1; i <= EXPLOSION_RANGE && canContinue; i++) {
            const gridX = bomb.gridX + (dx * i);
            const gridZ = bomb.gridZ + (dz * i);
            
            if (!canPropagate(gridX, gridZ)) {
                break;
            }
            
            canContinue = addExplosion(gridX, gridZ);
        }
            const explosionGeometry = new THREE.BoxGeometry(cellSize, 0.1, cellSize);
    const explosionMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0.7 
    });
    });

            rats = rats.filter(rat => {
        if (killedRats.has(rat)) {
            scene.remove(rat.mesh);
            return false;
        }
        return true;
    });

const checkPlayerDamage = () => {
    const playerGridPos = worldToGrid(player.position.x, player.position.z);
    
    const isPlayerHit = explosionCells.some(mesh => {
        const explosionGridPos = worldToGrid(mesh.position.x, mesh.position.z);
        return explosionGridPos.x === playerGridPos.x && 
               explosionGridPos.z === playerGridPos.z;
    });

    if (isPlayerHit && !isGameOver) {
        if (damageSound) {
            const sound = new THREE.Audio(listener);
            sound.setBuffer(damageSound);
            sound.setVolume(0.5); 
            sound.play();
        }

        playerLives--;
        updateHUD();
        
        if (playerLives <= 0) {
            gameOver();
        }
    }
};

checkPlayerDamage();
    
    setTimeout(() => {
        explosionCells.forEach(mesh => scene.remove(mesh));
    }, EXPLOSION_DURATION);
}

function loadOBJModel(objPath, mtlPath, position, parentGroup) {
    const materialLoader = new THREE.MTLLoader();
    
    materialLoader.load(mtlPath, function(materials) {
        materials.preload();
        
        const objectLoader = new THREE.OBJLoader();
        objectLoader.setMaterials(materials);
        
        objectLoader.load(objPath,
            function (object) {
                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Ajuste a escala com base no mapa atual
                let scale = 1;
                if (objPath.includes('spider')) scale = 0.5;
                if (objPath.includes('robot')) scale = 0.8;
                if (objPath.includes('barrel')) scale = 0.7;
                // Adicione mais ajustes conforme necessário

                object.position.set(position.x, position.y, position.z);
                object.scale.set(scale, scale, scale);
                parentGroup.add(object);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('Error loading OBJ:', error);
            }
        );
    });
}

let currentGridX = 0;  
let currentGridZ = 0; 
let targetGridX = 0;   
let targetGridZ = 0;   

function gridToWorld(gridX, gridZ) {
    return {
        x: (gridX - gridSize/2 + 0.5) * cellSize,
        z: (gridZ - gridSize/2 + 0.5) * cellSize
    };
}

function checkRatCollision(rat) {
    const playerGridPos = worldToGrid(player.position.x, player.position.z);
    return rat.gridX === playerGridPos.x && rat.gridZ === playerGridPos.z;
}

function worldToGrid(worldX, worldZ) {
    return {
        x: Math.floor((worldX + arenaSize/2) / cellSize),
        z: Math.floor((worldZ + arenaSize/2) / cellSize)
    };
}

const hudContainer = document.createElement('div');
hudContainer.style.position = 'absolute';
hudContainer.style.top = '10px';
hudContainer.style.left = '10px';
hudContainer.style.color = 'white';
hudContainer.style.fontSize = '24px';
hudContainer.style.fontFamily = 'Arial, sans-serif';
gameContainer.appendChild(hudContainer);

function updateHUD() {
    hudContainer.textContent = `Lives: ${playerLives} | Coins: ${collectedCoins}/${totalCoins}`;
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); 

const aspect = window.innerWidth / window.innerHeight;
camera = new THREE.OrthographicCamera(
    -arenaSize * aspect / 2,
    arenaSize * aspect / 2,
    arenaSize / 2,
    -arenaSize / 2,
    1, 1000
);

    camera.add(listener);
camera.position.set(arenaSize, arenaSize, arenaSize);
camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    gameContainer.appendChild(renderer.domElement);

    topViewScene = new THREE.Scene();
    topViewScene.background = new THREE.Color(0x000000);

    topViewCamera = new THREE.OrthographicCamera(
        -arenaSize / 2,
        arenaSize / 2,
        arenaSize / 2,
        -arenaSize / 2,
        1, 1000
    );

    topViewCamera.position.set(0, 30, 0);
    topViewCamera.lookAt(0, 0, 0);
    topViewCamera.rotation.z = 0; 
    topViewRenderer = new THREE.WebGLRenderer({ antialias: true });
    topViewRenderer.setSize(200, 200);
    topViewRenderer.shadowMap.enabled = true;
    document.getElementById('topViewContainer').appendChild(topViewRenderer.domElement);


    secondaryScene = new THREE.Scene();
    secondaryScene.background = new THREE.Color(0x000000);

secondaryCamera = new THREE.OrthographicCamera(
    -arenaSize / 2,
    arenaSize / 2,
    arenaSize / 2,
    -arenaSize / 2,
    1, 1000
);

secondaryCamera.position.set(0, 30, 0);
secondaryCamera.lookAt(0, 0, 0);
secondaryCamera.rotation.z = 0; 
    secondaryRenderer = new THREE.WebGLRenderer({ antialias: true });
    secondaryRenderer.setSize(200, 200);
    secondaryRenderer.shadowMap.enabled = true;
    document.getElementById('secondaryViewContainer').appendChild(secondaryRenderer.domElement);


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -arenaSize;
    directionalLight.shadow.camera.right = arenaSize;
    directionalLight.shadow.camera.top = arenaSize;
    directionalLight.shadow.camera.bottom = -arenaSize;
    scene.add(directionalLight);

    createArena();
    createTopViewArena();
    createCoins(); // Add this line
    createPlayer();
    createTopViewPlayer();
        initializeRats(); 


    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function createFreeCamera() {
    freeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    freeCamera.position.set(0, 10, 20);
    freeCamera.lookAt(0, 0, 0);
    
    // Reset das rotações iniciais
    targetRotationX = 0;
    targetRotationY = 0;
    currentRotationX = 0;
    currentRotationY = 0;
    
    initializeFreeCameraControls();
}

function initializeFreeCameraControls() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
}

function onPointerLockChange() {
    if (document.pointerLockElement === document.body) {
        freeCameraActive = true;
    } else {
        freeCameraActive = false;
    }
}

function onMouseMove(event) {
    if (!freeCameraActive || !freeCamera) return;
    
    // Ajustar sensibilidade do mouse
    const sensitivity = 0.002;
    
    // Usar movementX e movementY para rotação mais suave
    const deltaX = event.movementX || 0;
    const deltaY = event.movementY || 0;
    
    // Atualizar rotações alvo
    targetRotationY -= deltaX * sensitivity;
    targetRotationX -= deltaY * sensitivity;
    
    // Limitar rotação vertical
    targetRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotationX));
    
    // Aplicar rotações diretamente
    freeCamera.rotation.order = 'YXZ'; // Importante para evitar gimbal lock
    freeCamera.rotation.x = targetRotationX;
    freeCamera.rotation.y = targetRotationY;
}

function updateCameraRotation() {
    if (!freeCameraActive || !freeCamera) return;
    
    // Suavizar a rotação (opcional, pode remover se quiser movimento mais direto)
    currentRotationX = THREE.MathUtils.lerp(currentRotationX, targetRotationX, 0.1);
    currentRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, 0.1);
    
    // Aplicar rotações
    freeCamera.rotation.x = currentRotationX;
    freeCamera.rotation.y = currentRotationY;
}

function createArena() {
    arena = new THREE.Group();

    const floorTexture = textureLoader.load('assets/textures/DirtPath-NEO.png');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(gridSize, gridSize); 

    const floorGeometry = new THREE.PlaneGeometry(arenaSize, arenaSize);
    const floorMaterial = new THREE.MeshLambertMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    arena.add(floor);


    createGrid();

    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

    const wallNorth = createWall(arenaSize, wallHeight, 0.5);
    wallNorth.position.set(0, wallHeight/2, -arenaSize/2);
    arena.add(wallNorth);

    const wallSouth = createWall(arenaSize, wallHeight, 0.5);
    wallSouth.position.set(0, wallHeight/2, arenaSize/2);
    arena.add(wallSouth);

    const wallEast = createWall(0.5, wallHeight, arenaSize);
    wallEast.position.set(arenaSize/2, wallHeight/2, 0);
    arena.add(wallEast);

    const wallWest = createWall(0.5, wallHeight, arenaSize);
    wallWest.position.set(-arenaSize/2, wallHeight/2, 0);
    arena.add(wallWest);

    createMazeBlocks();

    scene.add(arena);
}
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
let bombSound;
let damageSound;

let collectSound;


audioLoader.load('assets/sounds/collect.wav', function(buffer) {
    collectSound = buffer;
});


audioLoader.load('assets/sounds/bomba.wav', function(buffer) {
    bombSound = buffer;
});
audioLoader.load('assets/sounds/damage.wav', function(buffer) {
    damageSound = buffer;
});


function gameOver() {
    isGameOver = true;
    
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverDiv.style.color = 'white';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.borderRadius = '10px';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <button id="restartButton" style="padding: 10px; margin-top: 10px;">Restart</button>
    `;
    
    gameContainer.appendChild(gameOverDiv);
    
    document.getElementById('restartButton').addEventListener('click', () => {
        gameContainer.removeChild(gameOverDiv);
        restartGame();
    });
}

function restartGame() {
    // Stop the animation loop
    gameActive = false;

    // Remove old renderer elements
    gameContainer.removeChild(renderer.domElement);
    document.getElementById('topViewContainer').removeChild(topViewRenderer.domElement);
    document.getElementById('secondaryViewContainer').removeChild(secondaryRenderer.domElement);

    // Dispose renderers
    renderer.dispose();
    topViewRenderer.dispose();
    secondaryRenderer.dispose();

    // Remove event listeners
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onWindowResize);
    
    // Clear all game objects
    while(scene.children.length > 0) { 
        const object = scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
        scene.remove(object);
    }
    
    // Clear secondary and top view scenes
    while(secondaryScene.children.length > 0) {
        secondaryScene.remove(secondaryScene.children[0]);
    }
    while(topViewScene.children.length > 0) {
        topViewScene.remove(topViewScene.children[0]);
    }
    
    // Reset all game states
    bombs = [];
    explosions = [];
    rats = [];
    currentGridX = 0;
    currentGridZ = 0;
    targetGridX = 0;
    targetGridZ = 0;
    canMove = true;
    playerSpeed2 = 1.0;
    isSpeedBoosted = false;
    collectedCoins = 0;
    totalCoins = 0;
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    
    // Clear timeouts
    if (speedBoostTimeout) {
        clearTimeout(speedBoostTimeout);
        speedBoostTimeout = null;
    }
    
    // Clear scene references
    player = null;
    arena = null;
    topViewPlayer = null;
    topViewArena = null;
    
    // Reset player lives if starting fresh game
    if (isGameOver) {
        playerLives = 3;
        isGameOver = false;
    }
    
    // Create fresh scenes
    scene = new THREE.Scene();
    secondaryScene = new THREE.Scene();
    topViewScene = new THREE.Scene();
    
    // Reinitialize game
    gameActive = true;
    init();
    updateHUD();
}

function createGrid() {
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });

    for (let i = 0; i <= gridSize; i++) {
        const pos = (i / gridSize) * arenaSize - arenaSize / 2;

        const hGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-arenaSize/2, 0.01, pos),
            new THREE.Vector3(arenaSize/2, 0.01, pos)
        ]);
        const hLine = new THREE.Line(hGeometry, gridMaterial);
        arena.add(hLine);

        const vGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(pos, 0.01, -arenaSize/2),
            new THREE.Vector3(pos, 0.01, arenaSize/2)
        ]);
        const vLine = new THREE.Line(vGeometry, gridMaterial);
        arena.add(vLine);
    }
}

function createMazeBlocks() {
    const blockGeometry = new THREE.BoxGeometry(cellSize * 0.9, wallHeight, cellSize * 0.9);
    const blockMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            if (mazeLayout[z][x] === 1) {
                const block = new THREE.Mesh(blockGeometry, blockMaterial);
                const worldPos = gridToWorld(x, z);
                block.position.set(worldPos.x, wallHeight/2, worldPos.z);
                block.castShadow = true;
                block.receiveShadow = true;
                arena.add(block);
            }
            else if (mazeLayout[z][x] === 2) {
                const worldPos = gridToWorld(x, z);
                const mapModels = MAP_MODELS[currentMap].destructible;
                const randomModel = mapModels[Math.floor(Math.random() * mapModels.length)];
                
                const modelGroup = new THREE.Group();
                modelGroup.position.set(worldPos.x, wallHeight/2, worldPos.z);
                arena.add(modelGroup);
                
                loadOBJModel(
                    randomModel.obj,
                    randomModel.mtl,
                    { x: 0, y: 0, z: 0 },
                    modelGroup
                );
            }
        }
    }
}

function createTopViewArena() {
    topViewArena = new THREE.Group();

    const floorGeometry = new THREE.PlaneGeometry(arenaSize, arenaSize);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x339933,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    topViewArena.add(floor);

    createTopViewGrid();

    const wallNorth = createTopViewWall(arenaSize, 0.5, 0.5, 0xff0000);
    wallNorth.position.set(0, 0.25, -arenaSize/2);
    topViewArena.add(wallNorth);

    const wallSouth = createTopViewWall(arenaSize, 0.5, 0.5, 0x0000ff);
    wallSouth.position.set(0, 0.25, arenaSize/2);
    topViewArena.add(wallSouth);

    const wallEast = createTopViewWall(0.5, 0.5, arenaSize, 0xffff00);
    wallEast.position.set(arenaSize/2, 0.25, 0);
    topViewArena.add(wallEast);

    const wallWest = createTopViewWall(0.5, 0.5, arenaSize, 0x00ff00);
    wallWest.position.set(-arenaSize/2, 0.25, 0);
    topViewArena.add(wallWest);

    createTopViewMazeBlocks();

    topViewScene.add(topViewArena);
}


function createRat(gridX, gridZ) {
    const worldPos = gridToWorld(gridX, gridZ);
    const ratGroup = new THREE.Group();
    ratGroup.position.set(worldPos.x, 0, worldPos.z);
    
    const ratModel = MAP_MODELS[currentMap].rat;
    loadOBJModel(
        ratModel.obj,
        ratModel.mtl,
        { x: 0, y: 0, z: 0 },
        ratGroup
    );

    scene.add(ratGroup);

    return {
        mesh: ratGroup,
        gridX: gridX,
        gridZ: gridZ,
        targetGridX: gridX,
        targetGridZ: gridZ,
        isMoving: false,
        rotation: 0,
        lastKnownPlayerPos: null,
        isChasing: false,
        lastDamageTime: 0
    };
}
function initializeRats() {
    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            if (mazeLayout[z][x] === 3) {
                mazeLayout[z][x] = 0; 
                const rat = createRat(x, z);
                rats.push(rat);
            }
        }
    }

    setInterval(moveRats, RAT_MOVE_INTERVAL);
}

function hasLineOfSight(ratGridX, ratGridZ, playerGridX, playerGridZ) {
    // Se não estiver na mesma linha ou coluna, não há linha de visão
    if (ratGridX !== playerGridX && ratGridZ !== playerGridZ) {
        return false;
    }

    // Verifica a direção
    const dx = Math.sign(playerGridX - ratGridX);
    const dz = Math.sign(playerGridZ - ratGridZ);
    
    // Verifica cada célula entre o rato e o jogador
    let x = ratGridX;
    let z = ratGridZ;
    
    while (x !== playerGridX || z !== playerGridZ) {
        x += dx;
        z += dz;
        
        // Se encontrar uma parede no caminho, não há linha de visão
        if (mazeLayout[z][x] === 1 || mazeLayout[z][x] === 2) {
            return false;
        }
    }
    
    return true;
}

function moveRats() {
    const playerGridPos = worldToGrid(player.position.x, player.position.z);
    
    rats.forEach(rat => {
        if (!rat.isMoving) {
            if (hasLineOfSight(rat.gridX, rat.gridZ, playerGridPos.x, playerGridPos.z)) {
                // Atualiza última posição conhecida e marca como perseguindo
                rat.lastKnownPlayerPos = { x: playerGridPos.x, z: playerGridPos.z };
                rat.isChasing = true;
                
                // Modo perseguição
                const dx = Math.sign(playerGridPos.x - rat.gridX);
                const dz = Math.sign(playerGridPos.z - rat.gridZ);
                
                if (dx !== 0 && canMoveToCell(rat.gridX + dx, rat.gridZ)) {
                    rat.targetGridX = rat.gridX + dx;
                    rat.targetGridZ = rat.gridZ;
                    rat.isMoving = true;
                } else if (dz !== 0 && canMoveToCell(rat.gridX, rat.gridZ + dz)) {
                    rat.targetGridX = rat.gridX;
                    rat.targetGridZ = rat.gridZ + dz;
                    rat.isMoving = true;
                }
            } else if (rat.isChasing && rat.lastKnownPlayerPos) {
                // Move em direção à última posição conhecida
                const dx = Math.sign(rat.lastKnownPlayerPos.x - rat.gridX);
                const dz = Math.sign(rat.lastKnownPlayerPos.z - rat.gridZ);
                
                let moved = false;
                
                if (dx !== 0 && canMoveToCell(rat.gridX + dx, rat.gridZ)) {
                    rat.targetGridX = rat.gridX + dx;
                    rat.targetGridZ = rat.gridZ;
                    moved = true;
                } else if (dz !== 0 && canMoveToCell(rat.gridX, rat.gridZ + dz)) {
                    rat.targetGridX = rat.gridX;
                    rat.targetGridZ = rat.gridZ + dz;
                    moved = true;
                }
                
                if (moved) {
                    rat.isMoving = true;
                } else if (rat.gridX === rat.lastKnownPlayerPos.x && 
                          rat.gridZ === rat.lastKnownPlayerPos.z) {
                    // Chegou à última posição conhecida, volta ao movimento aleatório
                    rat.lastKnownPlayerPos = null;
                    rat.isChasing = false;
                }
            } else {
                // Movimento aleatório normal
                const directions = [
                    { dx: 1, dz: 0, rotation: -Math.PI/2 },
                    { dx: -1, dz: 0, rotation: Math.PI/2 },
                    { dx: 0, dz: 1, rotation: Math.PI },
                    { dx: 0, dz: -1, rotation: 0 }
                ];

                const validDirections = directions.filter(dir => {
                    const newX = rat.gridX + dir.dx;
                    const newZ = rat.gridZ + dir.dz;
                    return canMoveToCell(newX, newZ);
                });

                if (validDirections.length > 0) {
                    const direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                    rat.targetGridX = rat.gridX + direction.dx;
                    rat.targetGridZ = rat.gridZ + direction.dz;
                    rat.isMoving = true;
                    rat.mesh.rotation.y = direction.rotation;
                }
            }
        }
    });
}

// Aumente a frequência de movimento dos ratos quando estão perseguindo
// Modifique a constante RAT_MOVE_INTERVAL para um valor menor

function updateRats() {
        const currentTime = Date.now();
    const DAMAGE_COOLDOWN = 3000; // 
    rats.forEach(rat => {
        // Verifica colisão com o jogador
        if (checkRatCollision(rat) && !isGameOver) {
            // Verifica se passou tempo suficiente desde o último dano
            if (currentTime - rat.lastDamageTime >= DAMAGE_COOLDOWN) {
                if (damageSound) {
                    const sound = new THREE.Audio(listener);
                    sound.setBuffer(damageSound);
                    sound.setVolume(0.5);
                    sound.play();
                }
                
                playerLives--;
                updateHUD();
                
                // Atualiza o tempo do último dano
                rat.lastDamageTime = currentTime;
                
                if (playerLives <= 0) {
                    gameOver();
                }
                 }
        }

        if (rat.isMoving) {
            const targetPos = gridToWorld(rat.targetGridX, rat.targetGridZ);
            const moveSpeed = 0.03;

            const dx = targetPos.x - rat.mesh.position.x;
            const dz = targetPos.z - rat.mesh.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < 0.1) {
                rat.mesh.position.x = targetPos.x;
                rat.mesh.position.z = targetPos.z;
                rat.gridX = rat.targetGridX;
                rat.gridZ = rat.targetGridZ;
                rat.isMoving = false;
            } else {
                rat.mesh.position.x += (dx / distance) * moveSpeed;
                rat.mesh.position.z += (dz / distance) * moveSpeed;

                const targetAngle = Math.atan2(dx, dz);
                rat.mesh.rotation.y = targetAngle;
            }
        }
    });
}

function createTopViewGrid() {
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });

    for (let i = 0; i <= gridSize; i++) {
        const pos = (i / gridSize) * arenaSize - arenaSize / 2;

        const hGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-arenaSize/2, 0.01, pos),
            new THREE.Vector3(arenaSize/2, 0.01, pos)
        ]);
        const hLine = new THREE.Line(hGeometry, gridMaterial);
        topViewArena.add(hLine);

        const vGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(pos, 0.01, -arenaSize/2),
            new THREE.Vector3(pos, 0.01, arenaSize/2)
        ]);
        const vLine = new THREE.Line(vGeometry, gridMaterial);
        topViewArena.add(vLine);
    }
}

function createTopViewMazeBlocks() {
    const blockGeometry = new THREE.BoxGeometry(cellSize * 0.9, 0.5, cellSize * 0.9);
    const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            if (mazeLayout[z][x] === 1) {
                const block = new THREE.Mesh(blockGeometry, blockMaterial);
                const worldPos = gridToWorld(x, z);
                block.position.set(worldPos.x, 0.3, worldPos.z);
                topViewArena.add(block);
            }
        }
    }
}

function createWall(width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const wall = new THREE.Mesh(geometry, material);
    wall.castShadow = true;
    wall.receiveShadow = true;
    return wall;
}

function createTopViewWall(width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

function createPlayer() {
    player = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x3333ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;

    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffcc99 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.castShadow = true;

    // Eyes
const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const eyeballMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    // Left eye
    const leftEye = new THREE.Group();
    const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const leftEyeball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeballMaterial);
    leftEyeball.position.z = -0.05;  // Changed from 0.05 to -0.05
    leftEye.add(leftEyeWhite);
    leftEye.add(leftEyeball);
    leftEye.position.set(-0.15, 1.6, -0.35);  // Changed from 0.35 to -0.35
    
    // Right eye
    const rightEye = new THREE.Group();
    const rightEyeWhite = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightEyeball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeballMaterial);
    rightEyeball.position.z = -0.05;  // Changed from 0.05 to -0.05
    rightEye.add(rightEyeWhite);
    rightEye.add(rightEyeball);
    rightEye.position.set(0.15, 1.6, -0.35);  // Changed from 0.35 to -0.35

    // Mouth
    const mouthGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 12, Math.PI);
    const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.35, -0.38); // Ajustado Y e Z para posicionar corretamente
    mouth.rotation.x = 0; // Remove a rotação no eixo X
    mouth.rotation.z = Math.PI; // Mantém a rotação em Z para orientação correta

    // Cowboy Hat
    const hatGroup = new THREE.Group();
    
    // Hat brim
    const brimGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32);
    const hatMaterial = new THREE.MeshLambertMaterial({ color: 0x4A3C2B });
    const brim = new THREE.Mesh(brimGeometry, hatMaterial);
    brim.position.y = 1.9;
    
    // Hat crown
    const crownGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.3, 32);
    const crown = new THREE.Mesh(crownGeometry, hatMaterial);
    crown.position.y = 2.05;
    
    // Hat band
    const bandGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);
    const bandMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.position.y = 1.95;

    hatGroup.add(brim);
    hatGroup.add(crown);
    hatGroup.add(band);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0x3333ff });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 0.9, 0);
    leftArm.castShadow = true;
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 0.9, 0);
    rightArm.castShadow = true;

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.25, 0.7, 0.25);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2222aa });
    
    const leftLegGroup = new THREE.Group();
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.y = -0.35;
    leftLegGroup.position.set(-0.3, 0.3, 0);
    leftLegGroup.add(leftLeg);
    
    const rightLegGroup = new THREE.Group();
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.y = -0.35;
    rightLegGroup.position.set(0.3, 0.3, 0);
    rightLegGroup.add(rightLeg);

    player.add(body);
    player.add(head);
    player.add(leftEye);
    player.add(rightEye);
    player.add(mouth);
    player.add(hatGroup);
    player.add(leftArm);
    player.add(rightArm);
    player.add(leftLegGroup);
    player.add(rightLegGroup);

    player.userData = {
        leftArm,
        rightArm,
        leftLegGroup,
        rightLegGroup,
        isWalking: false,
        walkingTime: 0
    };

    const initialPos = gridToWorld(currentGridX, currentGridZ);
    player.position.set(initialPos.x, 0, initialPos.z);

    scene.add(player);
}

function animatePlayerLimbs(walkCycle) {
    if (!player || !player.userData) return;

    const { leftArm, rightArm, leftLegGroup, rightLegGroup } = player.userData;
    
    if (!canMove) {
        // Animação suave dos membros
        const armSwing = Math.sin(walkCycle) * LIMB_ROTATION;
        const legSwing = -Math.sin(walkCycle) * LIMB_ROTATION;

        // Aplica rotação suave nos braços
        leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, armSwing, 0.3);
        rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, -armSwing, 0.3);

        // Aplica rotação suave nas pernas usando os grupos
        leftLegGroup.rotation.x = THREE.MathUtils.lerp(leftLegGroup.rotation.x, legSwing, 0.3);
        rightLegGroup.rotation.x = THREE.MathUtils.lerp(rightLegGroup.rotation.x, -legSwing, 0.3);
    } else {
        // Retorno suave à posição inicial
        leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, 0.3);
        rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 0.3);
        leftLegGroup.rotation.x = THREE.MathUtils.lerp(leftLegGroup.rotation.x, 0, 0.3);
        rightLegGroup.rotation.x = THREE.MathUtils.lerp(rightLegGroup.rotation.x, 0, 0.3);
    }
}

function createTopViewPlayer() {
    const geometry = new THREE.BoxGeometry(cellSize * 0.7, 0.2, cellSize * 0.7);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); 

    topViewPlayer = new THREE.Mesh(geometry, material);

    const initialPos = gridToWorld(currentGridX, currentGridZ);
    topViewPlayer.position.set(initialPos.x, 0.5, initialPos.z);

    topViewScene.add(topViewPlayer);
}

function onKeyDown(event) {
    if (!canMove || !gameActive || isGameOver) return;

   if (event.code === 'KeyV') {
        if (!freeCameraActive) {
            if (!freeCamera) {
                createFreeCamera();
            }
            document.body.requestPointerLock();
        } else {
            document.exitPointerLock();
        }
        return;
    }

    if (freeCameraActive) {
        switch (event.code) {
            case 'ArrowUp':
                freeCameraControls.forward = true;
                break;
            case 'ArrowDown':
                freeCameraControls.backward = true;
                break;
            case 'ArrowLeft':
                freeCameraControls.left = true;
                break;
            case 'ArrowRight':
                freeCameraControls.right = true;
                break;
            case 'KeyQ':
                freeCameraControls.up = true;
                break;
            case 'KeyE':
                freeCameraControls.down = true;
                break;
        }
        return;
    }

    let willMove = false;
    
    switch (event.code) {
        case 'KeyC': 
            switchCamera();
            break;

        case 'Space': 
            placeBomb();
            break;
    
        case 'KeyW':
            if (canMoveToCell(currentGridX, currentGridZ - 1)) {
                moveForward = true;
                targetGridZ = currentGridZ - 1;
                willMove = true;
            }
            break;
        case 'KeyA':
            if (canMoveToCell(currentGridX - 1, currentGridZ)) {
                moveLeft = true;
                targetGridX = currentGridX - 1;
                willMove = true;
            }
            break;
        case 'KeyS':
            if (canMoveToCell(currentGridX, currentGridZ + 1)) {
                moveBackward = true;
                targetGridZ = currentGridZ + 1;
                willMove = true;
            }
            break;
        case 'KeyD':
            if (canMoveToCell(currentGridX + 1, currentGridZ)) {
                moveRight = true;
                targetGridX = currentGridX + 1;
                willMove = true;
            }
            break;
        case 'Escape': 
            gameActive = false;
            gameContainer.style.display = 'none';
            menuContainer.style.display = 'flex';
            break;
    }

    if (willMove) {
        canMove = false;
        player.userData.moveStartTime = Date.now();
        player.userData.startPos = {
            x: player.position.x,
            z: player.position.z
        };
    }
}

function canMoveToCell(gridX, gridZ) {
    if (gridX < 0 || gridX >= gridSize || gridZ < 0 || gridZ >= gridSize) {
        return false;
    }

    return mazeLayout[gridZ][gridX] === 0;
}

function onKeyUp(event) {

        if (freeCameraActive) {
        switch (event.code) {
            case 'ArrowUp':
                freeCameraControls.forward = false;
                break;
            case 'ArrowDown':
                freeCameraControls.backward = false;
                break;
            case 'ArrowLeft':
                freeCameraControls.left = false;
                break;
            case 'ArrowRight':
                freeCameraControls.right = false;
                break;
            case 'KeyQ':
                freeCameraControls.up = false;
                break;
            case 'KeyE':
                freeCameraControls.down = false;
                break;
        }
        return;
    }
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function updateFreeCamera() {
    if (!freeCameraActive || !freeCamera) return;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(freeCamera.quaternion);
    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(freeCamera.quaternion);

    if (freeCameraControls.forward) {
        freeCamera.position.addScaledVector(forward, freeCameraSpeed);
    }
    if (freeCameraControls.backward) {
        freeCamera.position.addScaledVector(forward, -freeCameraSpeed);
    }
    if (freeCameraControls.right) {
        freeCamera.position.addScaledVector(right, freeCameraSpeed);
    }
    if (freeCameraControls.left) {
        freeCamera.position.addScaledVector(right, -freeCameraSpeed);
    }
    if (freeCameraControls.up) {
        freeCamera.position.y += freeCameraSpeed;
    }
    if (freeCameraControls.down) {
        freeCamera.position.y -= freeCameraSpeed;
    }
}


function onWindowResize() {
    if (!gameActive) return;

    const aspect = window.innerWidth / window.innerHeight;
    
    // Atualizar câmera ortográfica existente
    camera.left = -arenaSize * aspect / 2;
    camera.right = arenaSize * aspect / 2;
    camera.top = arenaSize / 2;
    camera.bottom = -arenaSize / 2;
    camera.updateProjectionMatrix();
    
    // Atualizar câmera livre
    if (freeCamera) {
        freeCamera.aspect = aspect;
        freeCamera.updateProjectionMatrix();
    }
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function checkWallCollisions() {
    const playerSize = 0.4;

    const limit = arenaSize / 2 - playerSize;

    if (player.position.x > limit) player.position.x = limit;
    if (player.position.x < -limit) player.position.x = -limit;
    if (player.position.z > limit) player.position.z = limit;
    if (player.position.z < -limit) player.position.z = -limit;
}


function updatePowerUps() {
    arena.children.forEach(child => {
        if (child.userData.isPowerUp) {
            // Animação flutuante
            child.userData.floatAnimation.offset += 0.05;
            child.position.y = child.userData.floatAnimation.initialY + 
                             Math.sin(child.userData.floatAnimation.offset) * 0.2;
            
            // Rotação suave
            child.rotation.y += 0.02;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (gameActive) {
        const currentTime = Date.now();
        bombs.forEach(bomb => {
            const scale = 1 + 0.1 * Math.sin((currentTime - bomb.timer) / 200);
            bomb.mesh.scale.set(scale, scale, scale);
        });       
         arena.children.forEach(child => {
            if (child.userData.isCoin) {
                child.userData.floatAnimation.offset += 0.03;
                child.position.y = child.userData.floatAnimation.initialY + 
                                 Math.sin(child.userData.floatAnimation.offset) * 0.2;
                child.rotation.y += 0.02;
            }
        });
        
        checkCoinCollection();

        updatePlayerMovement();
                updatePowerUps(); // Adicione esta 
                        checkPowerUpCollection(); // Adicione esta linha


                updateRats(); 
        updateFreeCamera(); 
        updateCameraRotation

        // Modifique esta parte para usar a câmera apropriada
        renderer.render(scene, freeCameraActive ? freeCamera : camera);
        topViewRenderer.render(topViewScene, topViewCamera);
        secondaryRenderer.render(scene, secondaryCamera);
    }
    }


function updatePlayerMovement() {
    if (!canMove) {
        const MOVEMENT_DURATION = 500 / playerSpeed2; // Movimento mais rápido quando com speed boost
        const targetPos = gridToWorld(targetGridX, targetGridZ);
        const progress = (Date.now() - player.userData.moveStartTime) / MOVEMENT_DURATION;
        const smoothProgress = Math.min(progress, 1);

        // Calcula a direção do movimento
        const dx = targetGridX - currentGridX;
        const dz = targetGridZ - currentGridZ;
        
        // Rotação instantânea estilo Minecraft
        if (dx > 0) player.rotation.y = -Math.PI / 2;      // Direita
        else if (dx < 0) player.rotation.y = Math.PI / 2;  // Esquerda
        else if (dz > 0) player.rotation.y = Math.PI;      // Baixo
        else if (dz < 0) player.rotation.y = 0;            // Cima

        if (smoothProgress < 1) {
            // Movimento linear suave
            player.position.x = player.userData.startPos.x + (targetPos.x - player.userData.startPos.x) * smoothProgress;
            player.position.z = player.userData.startPos.z + (targetPos.z - player.userData.startPos.z) * smoothProgress;
            
            // Animação suave dos membros
            const walkCycle = smoothProgress * Math.PI * 2; // Ciclo completo de animação
            animatePlayerLimbs(walkCycle);
        } else {
            // Finaliza o movimento
            player.position.x = targetPos.x;
            player.position.z = targetPos.z;
            currentGridX = targetGridX;
            currentGridZ = targetGridZ;
            moveForward = moveBackward = moveLeft = moveRight = false;
            canMove = true;
            
            // Reset suave da animação
            animatePlayerLimbs(Math.PI * 2);
        }

        updateTopViewPlayer();
    }
}

function updateTopViewPlayer() {
    if (topViewPlayer && player) {
        topViewPlayer.position.x = player.position.x;
        topViewPlayer.position.z = player.position.z;
    }
}

function checkPowerUpCollection() {
    const playerGridPos = worldToGrid(player.position.x, player.position.z);
    const playerWorldPos = gridToWorld(playerGridPos.x, playerGridPos.z);
    
    arena.children.forEach(child => {
        if (child.userData.isPowerUp) {
            const powerUpGridPos = worldToGrid(child.position.x, child.position.z);
            
            if (powerUpGridPos.x === playerGridPos.x && powerUpGridPos.z === playerGridPos.z) {
                // Remove o power-up
                arena.remove(child);
                
                // Aplica o efeito do power-up
                applyPowerUpEffect();
                
                // Efeito sonoro de coleta (opcional)
                if (collectSound) {
                    const sound = new THREE.Audio(listener);
                    sound.setBuffer(collectSound);
                    sound.setVolume(0.5);
                    sound.play();
                }
            }
        }
    });
}




function applyPowerUpEffect() {
    // Escolhe aleatoriamente entre vida extra ou boost de velocidade
    const effectType = Math.random() < 0.5 ? 'health' : 'speed';
    
    switch (effectType) {
        case 'health':
            playerLives++;
            updateHUD();
            // Efeito visual opcional
            showFloatingText('+1 VIDA', 0x00ff00);
            break;
            
        case 'speed':
            if (isSpeedBoosted) {
                clearTimeout(speedBoostTimeout);
            }
            
            isSpeedBoosted = true;
            playerSpeed2 = SPEED_BOOST_MULTIPLIER;
            showFloatingText('VELOCIDADE +', 0xffff00);
            
            speedBoostTimeout = setTimeout(() => {
                isSpeedBoosted = false;
                playerSpeed2 = 1.0;
                showFloatingText('VELOCIDADE -', 0xffff00);
            }, SPEED_BOOST_DURATION);
            break;
    }
}

function showFloatingText(text, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'Bold 32px Arial';
    
    // Configura o texto
    const textWidth = context.measureText(text).width;
    canvas.width = textWidth + 20;
    canvas.height = 48;
    
    // Desenha o texto
    context.font = 'Bold 32px Arial';
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.fillText(text, 10, 34);
    
    // Cria a textura e o sprite
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    // Posiciona o sprite acima do jogador
    sprite.position.copy(player.position);
    sprite.position.y += 2;
    sprite.scale.set(2, 1, 1);
    
    scene.add(sprite);
    
    // Remove o sprite após 2 segundos
    setTimeout(() => {
        scene.remove(sprite);
    }, 2000);
}

function createCoins() {
    totalCoins = 0;
    collectedCoins = 0;
    
    // Look for empty spaces in the maze
    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            if (mazeLayout[z][x] === 0) {
                // Add coin with 30% probability if space is empty
                if (Math.random() < 0.1) {
                    const worldPos = gridToWorld(x, z);
                    const coinGroup = new THREE.Group();
                    coinGroup.position.set(worldPos.x, wallHeight/2, worldPos.z);
                    
                    coinGroup.userData.isCoin = true;
                    coinGroup.userData.floatAnimation = {
                        initialY: wallHeight/2,
                        offset: Math.random() * Math.PI * 2 // Random start phase
                    };
                    
                    loadOBJModel(
                        MAP_MODELS[currentMap].coin.obj,
                        MAP_MODELS[currentMap].coin.mtl,
                        { x: 0, y: 0, z: 0 },
                        coinGroup
                    );
                    
                    arena.add(coinGroup);
                    totalCoins++;
                }
            }
        }
    }
    
    // Update HUD to show coin count
    updateHUD();
}


function checkCoinCollection() {
    const playerGridPos = worldToGrid(player.position.x, player.position.z);
    const playerWorldPos = gridToWorld(playerGridPos.x, playerGridPos.z);
    
    arena.children.forEach(child => {
        if (child.userData.isCoin) {
            const coinGridPos = worldToGrid(child.position.x, child.position.z);
            
            if (coinGridPos.x === playerGridPos.x && coinGridPos.z === playerGridPos.z) {
                // Remove the coin
                arena.remove(child);
                collectedCoins++;
                
                // Play collection sound
                if (collectSound) {
                    const sound = new THREE.Audio(listener);
                    sound.setBuffer(collectSound);
                    sound.setVolume(0.5);
                    sound.play();
                }
                
                // Show floating score
                showFloatingText('+1', 0xFFD700);
                
                // Update HUD
                updateHUD();
                
                // Check if all coins are collected
                if (collectedCoins === totalCoins) {
                    showLevelComplete();
                }
            }
        }
    });

}

function showLevelComplete() {
    const levelCompleteDiv = document.createElement('div');
    levelCompleteDiv.style.position = 'absolute';
    levelCompleteDiv.style.top = '50%';
    levelCompleteDiv.style.left = '50%';
    levelCompleteDiv.style.transform = 'translate(-50%, -50%)';
    levelCompleteDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    levelCompleteDiv.style.color = 'white';
    levelCompleteDiv.style.padding = '20px';
    levelCompleteDiv.style.borderRadius = '10px';
    levelCompleteDiv.style.textAlign = 'center';
    levelCompleteDiv.innerHTML = `
        <h2>Level Complete!</h2>
        <p>All coins collected!</p>
        <button id="nextLevelButton" style="padding: 10px; margin-top: 10px;">Next Level</button>
    `;
    
    gameContainer.appendChild(levelCompleteDiv);
    
    document.getElementById('nextLevelButton').addEventListener('click', () => {
        gameContainer.removeChild(levelCompleteDiv);
        loadNextLevel();
    });
}

function loadNextLevel() {
    // Cycle through maps
    const maps = Object.keys(GAME_MAPS);
    const currentIndex = maps.indexOf(currentMap);
    const nextIndex = (currentIndex + 1) % maps.length;
    currentMap = maps[nextIndex];
    
    // Reset the game with new map
    mazeLayout = GAME_MAPS[currentMap];
    restartGame();
}
