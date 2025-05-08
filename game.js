// Cyberpunk Idle Game - Main Script

// Game state (Updated based on GDD)
let gameState = {
    resources: {
        credits: 0.0,
        followers: 0.0,
        influence: 0.0,
        techPoints: 0.0,
        energy: 0.0,
        rebellionStrength: 0.0,
        gigaTech: 0.0,
        mindControlCounter: 0.0
    },
    rates: {
        credits: 0.0,
        followers: 0.0,
        influence: 0.0,
        techPoints: 0.0,
        energy: 0.0,
        rebellionStrength: 0.0,
        gigaTech: 0.0,
        mindControlCounter: 0.0
    },
    turingLevel: 1, // Add Turing AI assistant level
    clickMultiplier: 1, // Multiplier for click actions (1x, 5x, 10x, 100x, MAX)
    loopCount: 0, // Track the number of game loops/runs
    globalMultipliers: {
        creditsRateBonus: 1.0,
        followersRateBonus: 1.0,
        influenceRateBonus: 1.0,
        techPointsRateBonus: 1.0,
        energyRateBonus: 1.0,
        // Add others as needed
    },
    // Base Production Boosts (GDD - Replaces Upgrades)
    baseProductionBoosts: {
        autoMiner: {
            name: "Auto-Miner MK1",
            desc: "Automated drone for basic resource extraction.",
            baseCost: { credits: 10 },
            costMultiplier: 1.15,
            baseEffect: 0.2, // Credits per second
            effectMultiplier: 1.15,
            level: 0,
            unlocked: true
        },
        recruiterNode: {
            name: "Recruiter Node",
            desc: "Broadcasts propaganda to attract followers.",
            baseCost: { credits: 50, influence: 5 },
            costMultiplier: 1.2,
            baseEffect: 0.1, // Followers per second
            effectMultiplier: 1.18,
            level: 0,
            unlocked: false // Requires tech
        },
        networkTap: {
            name: "Network Tap",
            desc: "Siphons data streams for Tech Points.",
            baseCost: { credits: 100, techPoints: 10 },
            costMultiplier: 1.25,
            baseEffect: 0.1, // Tech Points per second
            effectMultiplier: 1.20,
            level: 0,
            unlocked: false // Requires tech
        },
        powerRelay: {
            name: "Power Relay",
            desc: "Manages and distributes energy more efficiently.",
            baseCost: { credits: 200, energy: 20 },
            costMultiplier: 1.3,
            baseEffect: 0.05, // Energy per second
            effectMultiplier: 1.25,
            level: 0,
            unlocked: false // Requires tech
        },
        aiCoordinator: {
            name: "AI Coordinator",
            desc: "Advanced AI managing all base production boosts.",
            baseCost: { credits: 1000, techPoints: 100, influence: 50 },
            costMultiplier: 1.5,
            baseEffect: 0.1, // Global % bonus per level (represented as 0.1 = 10%)
            effectMultiplier: 1.0, // Effect doesn't scale, just adds 10% per level
            level: 0,
            unlocked: false // Requires tech
        }
    },
    // Items (GDD - New Category)
    items: {
        // Tier 1
        encryptedComms: {
            name: "Encrypted Comms",
            desc: "Basic secure communication, small Influence boost.",
            baseCost: { credits: 50, techPoints: 5 },
            costMultiplier: 1.5, // Cost increases per item owned
            effect: { influenceRateFlat: 5 }, // +5 Influence per second per item
            count: 0,
            max: 5 // Example max count
        },
        blackMarketAccess: {
            name: "Black Market Access",
            desc: "Unlocks shady deals, small Credits boost.",
            baseCost: { credits: 100, influence: 10 },
            costMultiplier: 1.6,
            effect: { creditsRateBonus: 0.05 }, // 5% bonus to Credits rate
            count: 0,
            max: 5
        },
        // Tier 2
        propagandaNetwork: {
            name: "Propaganda Network",
            desc: "Wider reach for recruitment, boosts Follower gain.",
            baseCost: { credits: 500, influence: 50 },
            costMultiplier: 1.8,
            effect: { followersRateBonus: 0.10 }, // 10% bonus
            count: 0,
            max: 3,
            requiresTech: "massMediaManipulation" // Example tech requirement
        },
        dataBrokerLicense: {
            name: "Data Broker License",
            desc: "Legitimizes data acquisition, boosts Tech Point gain.",
            baseCost: { credits: 750, techPoints: 75 },
            costMultiplier: 1.9,
            effect: { techPointsRateBonus: 0.10 }, // 10% bonus
            count: 0,
            max: 3,
            requiresTech: "advancedDataMining"
        },
        // Tier 3
        autonomousAgentHQ: {
            name: "Autonomous Agent HQ",
            desc: "Coordinates agents for missions and territory control.",
            baseCost: { credits: 5000, influence: 250, techPoints: 250 },
            costMultiplier: 2.5,
            effect: { missionSlots: 1 }, // Example effect: unlocks mission capability
            count: 0,
            max: 1,
            requiresTech: "aiCoordination"
        },
        // Add more items from GDD...
    },
    // Tech Tree (GDD - Replaces Research)
    techTree: {
        basicEncryption: {
            name: "Basic Encryption",
            cost: { techPoints: 10 },
            effectDesc: "Unlocks Encrypted Comms item.",
            unlocksItem: "encryptedComms",
            completed: false,
            requires: [],
            icon: "🔒",
            position: { x: 50, y: 5 } // Position in % from top-left
        },
        underworldContacts: {
            name: "Underworld Contacts",
            cost: { influence: 20 },
            effectDesc: "Unlocks Black Market Access item.",
            unlocksItem: "blackMarketAccess",
            completed: false,
            requires: [],
            icon: "🤝",
            position: { x: 85, y: 5 }
        },
        basicAutomation: {
            name: "Basic Automation",
            cost: { techPoints: 25 },
            effectDesc: "Unlocks Auto-Miner MK1 boost.",
            unlocksBoost: "autoMiner",
            completed: false,
            requires: [],
            icon: "⚙️",
            position: { x: 15, y: 5 }
        },
        recruitmentAlgorithms: {
            name: "Recruitment Algorithms",
            cost: { techPoints: 50, influence: 10 },
            effectDesc: "Unlocks Recruiter Node boost.",
            unlocksBoost: "recruiterNode",
            completed: false,
            requires: ["basicAutomation"],
            icon: "👥",
            position: { x: 10, y: 25 }
        },
        dataMining: {
            name: "Data Mining",
            cost: { techPoints: 75 },
            effectDesc: "Unlocks Network Tap boost.",
            unlocksBoost: "networkTap",
            completed: false,
            requires: ["basicAutomation"],
            icon: "📊",
            position: { x: 25, y: 25 }
        },
        energyManagement: {
            name: "Energy Management",
            cost: { techPoints: 100, energy: 10 },
            effectDesc: "Unlocks Power Relay boost.",
            unlocksBoost: "powerRelay",
            completed: false,
            requires: ["basicAutomation"],
            icon: "⚡",
            position: { x: 40, y: 25 }
        },
        massMediaManipulation: {
            name: "Mass Media Manipulation",
            cost: { techPoints: 150, influence: 75 },
            effectDesc: "Unlocks Propaganda Network item. +5% Follower Rate.",
            unlocksItem: "propagandaNetwork",
            effect: { followersRateBonus: 0.05 },
            completed: false,
            requires: ["recruitmentAlgorithms"],
            icon: "📺",
            position: { x: 10, y: 45 }
        },
        advancedDataMining: {
            name: "Advanced Data Mining",
            cost: { techPoints: 200 },
            effectDesc: "Unlocks Data Broker License item. +5% Tech Point Rate.",
            unlocksItem: "dataBrokerLicense",
            effect: { techPointsRateBonus: 0.05 },
            completed: false,
            requires: ["dataMining"],
            icon: "💾",
            position: { x: 25, y: 45 }
        },
        secureEncryption: {
            name: "Secure Encryption",
            cost: { techPoints: 250, energy: 25 },
            effectDesc: "Enhanced security for your operations. +10% Influence Rate.",
            effect: { influenceRateBonus: 0.1 },
            completed: false,
            requires: ["basicEncryption"],
            icon: "🔐",
            position: { x: 50, y: 25 }
        },
        blackMarketExpansion: {
            name: "Black Market Expansion",
            cost: { credits: 500, influence: 50 },
            effectDesc: "Wider access to illegal goods. +15% Credits Rate.",
            effect: { creditsRateBonus: 0.15 },
            completed: false,
            requires: ["underworldContacts"],
            icon: "💰",
            position: { x: 85, y: 25 }
        },
        neuralHacking: {
            name: "Neural Hacking",
            cost: { techPoints: 300, energy: 50 },
            effectDesc: "Break through mental barriers. Counters Mind Control.",
            effect: { mindControlResistance: 0.2 },
            completed: false,
            requires: ["secureEncryption", "advancedDataMining"],
            icon: "🧠",
            position: { x: 50, y: 45 }
        },
        roboticAutomation: {
            name: "Robotic Automation",
            cost: { techPoints: 350, energy: 75, credits: 300 },
            effectDesc: "Autonomous robots to handle dangerous tasks. +20% Energy Rate.",
            effect: { energyRateBonus: 0.2 },
            completed: false,
            requires: ["energyManagement"],
            icon: "🤖",
            position: { x: 40, y: 45 }
        },
        viralNetworking: {
            name: "Viral Networking",
            cost: { influence: 300, techPoints: 200 },
            effectDesc: "Create self-replicating social networks. +25% Follower Rate.",
            effect: { followersRateBonus: 0.25 },
            completed: false,
            requires: ["massMediaManipulation"],
            icon: "🦠",
            position: { x: 10, y: 65 }
        },
        quantumComputing: {
            name: "Quantum Computing",
            cost: { techPoints: 500, energy: 100 },
            effectDesc: "Breakthrough in computation technology. +30% Tech Points Rate.",
            effect: { techPointsRateBonus: 0.3 },
            completed: false,
            requires: ["advancedDataMining", "neuralHacking"],
            icon: "🔬",
            position: { x: 40, y: 65 }
        },
        aiCoordination: {
            name: "AI Coordination",
            cost: { techPoints: 500, influence: 100, energy: 50 },
            effectDesc: "Unlocks AI Coordinator boost and Autonomous Agent HQ item.",
            unlocksBoost: "aiCoordinator",
            unlocksItem: "autonomousAgentHQ",
            completed: false,
            requires: ["neuralHacking", "viralNetworking", "roboticAutomation"],
            icon: "🧩",
            position: { x: 25, y: 85 }
        },
        mindControlDisruption: {
            name: "Mind Control Disruption",
            cost: { techPoints: 600, energy: 200, influence: 150 },
            effectDesc: "Actively counter GigaCorp's control. -50% Mind Control Counter.",
            effect: { mindControlReduction: 0.5 },
            completed: false,
            requires: ["neuralHacking"],
            icon: "📡",
            position: { x: 70, y: 65 }
        },
        decentralizedOps: {
            name: "Decentralized Operations",
            cost: { techPoints: 400, influence: 200 },
            effectDesc: "Create cell-based structure to evade detection. +15% All Resources.",
            effect: { allResourcesBonus: 0.15 },
            completed: false,
            requires: ["blackMarketExpansion", "neuralHacking"],
            icon: "🌐",
            position: { x: 70, y: 45 }
        },
        quantumEncryption: {
            name: "Quantum Encryption",
            cost: { techPoints: 800, energy: 250 },
            effectDesc: "Unbreakable communication channels. +40% Influence Rate.",
            effect: { influenceRateBonus: 0.4 },
            completed: false,
            requires: ["quantumComputing"],
            icon: "🔏",
            position: { x: 55, y: 85 }
        },
        collectiveConsciousness: {
            name: "Collective Consciousness",
            cost: { techPoints: 1000, influence: 500, energy: 300, followers: 300 },
            effectDesc: "Link minds of your followers. +50% Rebellion Strength.",
            effect: { rebellionStrengthRateBonus: 0.5 },
            completed: false,
            requires: ["mindControlDisruption", "aiCoordination", "quantumEncryption"],
            icon: "👁️",
            position: { x: 40, y: 95 }
        }
    },
    // Districts / Territories (GDD - Replaces Districts)
    territories: {
        downtown: {
            name: "Downtown",
            cost: { credits: 100, followers: 10 },
            effect: { influenceRateBonus: 0.08 }, // +8% Influence Rate
            effectDesc: "Central hub, critical for influence gain.",
            unlocked: false,
            active: false,
            requires: [] // No prereqs for first one
        },
        industrialZone: {
            name: "Industrial Zone",
            cost: { credits: 500, followers: 50, influence: 25 },
            effect: { creditsRateBonus: 0.08 }, // +8% Credits Rate
            effectDesc: "High resource production area.",
            unlocked: false,
            active: false,
            requires: ["downtown"] // Requires previous territory
        },
        techDistrict: {
            name: "Tech District",
            cost: { credits: 1000, followers: 75, techPoints: 100 },
            effect: { techPointsRateBonus: 0.08 }, // +8% Tech Point Rate
            effectDesc: "Key for technology-related resources.",
            unlocked: false,
            active: false,
            requires: ["industrialZone"]
        },
        harborArea: {
            name: "Harbor Area",
            cost: { credits: 2000, followers: 100, energy: 50 },
            effect: { creditsRateBonus: 0.05, energyRateBonus: 0.05 }, // +5% Credits and Energy Rate
            effectDesc: "Strategic for trade and resources.",
            unlocked: false,
            active: false,
            requires: ["downtown"]
        },
        livingTowers: {
            name: "The Living Towers",
            cost: { credits: 2500, followers: 150, influence: 150 },
            effect: { followersRateBonus: 0.1 }, // +10% Followers Rate
            effectDesc: "Population-dense area for followers.",
            unlocked: false,
            active: false,
            requires: ["downtown", "harborArea"]
        },
        governmentQuarter: {
            name: "Government Quarter",
            cost: { credits: 3000, followers: 200 },
            effect: { influenceRateBonus: 0.1 }, // +10% Influence Rate
            effectDesc: "High influence gain potential.",
            unlocked: false,
            active: false,
            requires: ["downtown", "industrialZone"]
        },
        muskersTerritory: {
            name: "Muskers Territory",
            cost: { credits: 4000, followers: 250, techPoints: 250 },
            effect: { techPointsRateBonus: 0.1, energyRateBonus: 0.05 }, // +10% Tech Points, +5% Energy
            effectDesc: "Advanced tech capabilities.",
            unlocked: false,
            active: false,
            requires: ["techDistrict"]
        },
        cryptidsDomain: {
            name: "Cryptids Domain",
            cost: { credits: 5000, followers: 300, influence: 300, energy: 150 },
            effect: { creditsRateBonus: 0.15 }, // +15% Credits Rate
            effectDesc: "High-risk, high-reward missions.",
            unlocked: false,
            active: false,
            requires: ["harborArea", "livingTowers"]
        },
        shillzCentral: {
            name: "ShillZ Central",
            cost: { credits: 6000, followers: 350 },
            effect: { influenceRateBonus: 0.12, followersRateBonus: 0.08 }, // +12% Influence, +8% Followers
            effectDesc: "Focus on propaganda and influence.",
            unlocked: false,
            active: false,
            requires: ["livingTowers", "governmentQuarter"]
        },
        mechRebelsBase: {
            name: "Mech Rebels Base",
            cost: { credits: 8000, followers: 400, techPoints: 400, energy: 200 },
            effect: { rebellionStrengthRateBonus: 0.1, energyRateBonus: 0.08 }, // +10% Rebellion Strength, +8% Energy
            effectDesc: "Special missions and resources.",
            unlocked: false,
            active: false,
            requires: ["muskersTerritory", "cryptidsDomain"]
        },
        hackersDen: {
            name: "Hackers Den",
            cost: { credits: 7000, followers: 350, techPoints: 350 },
            effect: { techPointsRateBonus: 0.12 }, // +12% Tech Point Rate
            effectDesc: "Enhances tech abilities.",
            unlocked: false,
            active: false,
            requires: ["techDistrict", "governmentQuarter"]
        },
        revolutionaryHub: {
            name: "Revolutionary Hub",
            cost: { credits: 9000, followers: 500, influence: 400 },
            effect: { rebellionStrengthRateBonus: 0.15 }, // +15% Rebellion Strength
            effectDesc: "Boosts rebellion efforts.",
            unlocked: false,
            active: false,
            requires: ["shillzCentral", "hackersDen"]
        },
        abandonedSector: {
            name: "Abandoned Sector",
            cost: { credits: 3500, followers: 150, energy: 100 },
            effect: { creditsRateBonus: 0.05, energyRateBonus: 0.05, techPointsRateBonus: 0.05 }, // +5% to multiple resources
            effectDesc: "Low-risk resource gain.",
            unlocked: false,
            active: false,
            requires: ["industrialZone"]
        },
        aiLabs: {
            name: "Artificial Intelligence Labs",
            cost: { credits: 10000, followers: 600, techPoints: 600, energy: 300 },
            effect: { techPointsRateBonus: 0.15, rebellionStrengthRateBonus: 0.05 }, // +15% Tech Points, +5% Rebellion Strength
            effectDesc: "Advanced tech resources.",
            unlocked: false,
            active: false,
            requires: ["hackersDen", "muskersTerritory"]
        },
        gigaCorpHQ: {
            name: "GigaCorp Headquarters",
            cost: { credits: 15000, followers: 800, influence: 700, techPoints: 700, energy: 500 },
            effect: { rebellionStrengthRateBonus: 0.2 }, // +20% Rebellion Strength
            effectDesc: "Endgame territory. Direct confrontation with GigaCorp.",
            unlocked: false,
            active: false,
            requires: ["revolutionaryHub", "mechRebelsBase", "aiLabs"]
        },
    },
    // Missions (GDD - Replaces Operations)
    missions: {
        activeMission: null,
        missionStartTime: null,
        availableMissions: {
            // Minimal structure for testing syntax
            spreadRumors: {
                id: "spreadRumors",
                name: "Spread Rumors",
                desc: "Gain minor influence.",
                cost: { credits: 20 },
                duration: 30,
                reward: { influence: 5 },
                requiresTech: [],
                unlocked: true
            }
        }
    },
    progression: {
        // Story flags, unlocked features, etc.
        unlockedTabs: ["boosts-tab"], // Start with boosts unlocked
        achievements: {
            // Structure from progression.js
        }
    },
    settings: {
        soundEnabled: true,
        musicEnabled: true,
        theme: "dark"
    },
    lastUpdate: Date.now()
};

// --- Initialization ---

// Function to load game state from localStorage
function loadGame() {
    let savedGame = localStorage.getItem("earth2049_saveGame");
    
    if (savedGame) {
        try {
            let loadedState = JSON.parse(savedGame);
            
            // Merge with default state to handle any missing properties
            gameState = deepMerge(gameState, loadedState);
            
            console.log("Game loaded successfully");
        } catch (error) {
            console.error("Error loading game:", error);
            // Keep the default game state
        }
    }
    
    // Ensure settings are properly initialized
    gameState.settings = gameState.settings || { soundEnabled: true, musicEnabled: true, theme: "dark" };
    if (gameState.settings.musicEnabled === undefined) {
        gameState.settings.musicEnabled = true;
    }
    
    // Additional initialization...
}

// Deep merge utility (simple version)
function deepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// Function to save game state to localStorage
function saveGame() {
    try {
        localStorage.setItem("earth2049_saveGame", JSON.stringify(gameState));
        // addLogMessage("Game saved successfully."); // Reduce log spam
    } catch (e) {
        console.error("Failed to save game state:", e);
        addLogMessage("Error saving game!");
    }
}

// Function to initialize the game
document.addEventListener("DOMContentLoaded", function initGame() {
    console.log("Initializing Earth 2049 game...");
    
    try {
        // Load or initialize game state
        loadGame();
        
        // Ensure core properties are initialized
        gameState.lastUpdate = gameState.lastUpdate || Date.now();
        gameState.settings = gameState.settings || { soundEnabled: true, musicEnabled: true, theme: "dark" };
        gameState.progression = gameState.progression || { 
            unlockedTabs: ["boosts-tab"], 
            achievements: {},
            milestones: {},
            storyEvents: {}
        };
        gameState.loopCount = gameState.loopCount || 0;
        gameState.playerId = gameState.playerId || "player" + Math.floor(Math.random() * 10000);
        
        // Initialize background music
        initBackgroundMusic();
        
        // Set up click handlers for game operations
        document.querySelectorAll(".operation-button").forEach(button => {
            button.addEventListener("click", function() {
                // Add animations or effects here
            });
        });
        
        // Set up mobile touch handling
        setupMobileTouchHandling();
        
        // Set up dialogue box event listeners
        const dialogueNext = document.getElementById("dialogue-next");
        if (dialogueNext) {
            dialogueNext.addEventListener("click", nextDialogue);
        }
        
        // Initialize tab switching to ensure tech tree renders properly
        document.querySelectorAll('.tab').forEach(tabButton => {
            tabButton.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // When switching to tech tree tab, ensure connections are drawn
                if (tabId === 'techTree-tab') {
                    // Use a small timeout to ensure DOM is ready
                    setTimeout(() => {
                        updateTechTreeDisplay();
                    }, 50);
                }
            });
        });
        
        // Initial display updates
        updateResourceDisplay();
        updateBoostsDisplay();
        updateItemsDisplay();
        updateTerritoriesDisplay();
        updateMissionsDisplay();
        updateAllDisplays();
        
        // Specifically ensure tech tree display is updated after a slight delay
        // to allow the DOM to be fully rendered
        setTimeout(() => {
            updateTechTreeDisplay();
        }, 200);
        
        // Update tech button cost
        const techPointsCost = document.getElementById("techPoints-cost");
        if (techPointsCost) {
            techPointsCost.textContent = 5;
        }
        
        // Add initial log message
        addLogMessage("Welcome to Earth 2049, where your rebellion begins.");
        
        // Preload dialogue assets
        preloadDialogueAssets();
        
        // Register key event handlers
        document.addEventListener("keydown", function(e) {
            // Escape key closes dialogues and modals
            if (e.key === "Escape") {
                closeDialogue();
                closeModal();
            }
        });
        
        // Wait for everything to load, then initialize randomizer
        setTimeout(() => {
            // Always initialize randomizer for consistency, unless it's already been applied
            if (!gameState.randomized) {
                console.log("Initializing randomizer for new game or reset...");
                
                // Initialize randomizer with player ID and loop count
                initRandomizer();
                
                // Mark that randomizer has been applied
                gameState.randomized = true;
                
                // Save game after randomizer is applied
                saveGame();
                
                console.log("Randomizer initialized and game saved");
            } else {
                console.log("Randomizer already applied, skipping initialization");
            }
            
            // Start game loop
            setTimeout(gameLoop, 100);
        }, 300);
        
        console.log("Game initialization complete!");
    } catch (error) {
        console.error("Error during game initialization:", error);
    }
});

// Initialize background music system
function initBackgroundMusic() {
    const musicElement = document.getElementById("background-music");
    const musicToggle = document.getElementById("music-toggle");
    
    // Set initial state from game settings
    if (gameState.settings && gameState.settings.musicEnabled === false) {
        musicElement.pause();
        musicToggle.textContent = "🔇";
        musicToggle.classList.add("muted");
    } else {
        // Default to enabled
        gameState.settings = gameState.settings || {};
        gameState.settings.musicEnabled = true;
        
        // Start playing with a slight delay to ensure proper loading
        setTimeout(() => {
            try {
                musicElement.volume = 0.3; // Set default volume to 30%
                musicElement.play().catch(error => {
                    console.error("Failed to autoplay music:", error);
                    // Many browsers require user interaction before audio can play
                    // We'll leave the music enabled so it will play once the user clicks
                });
            } catch (error) {
                console.error("Music initialization error:", error);
            }
        }, 1000);
    }
    
    // Add click handler for the music toggle button
    musicToggle.addEventListener("click", function() {
        toggleBackgroundMusic();
    });
}

// Toggle background music on/off
function toggleBackgroundMusic() {
    const musicElement = document.getElementById("background-music");
    const musicToggle = document.getElementById("music-toggle");
    
    // Update game state setting
    gameState.settings.musicEnabled = !gameState.settings.musicEnabled;
    
    if (gameState.settings.musicEnabled) {
        // Turn music on
        musicElement.play().catch(error => {
            console.error("Failed to play music:", error);
        });
        musicToggle.textContent = "🔊";
        musicToggle.classList.remove("muted");
        addLogMessage("Background music enabled.");
    } else {
        // Turn music off
        musicElement.pause();
        musicToggle.textContent = "🔇";
        musicToggle.classList.add("muted");
        addLogMessage("Background music disabled.");
    }
    
    // Save settings
    saveGame();
}

// Setup mobile touch handling for tech tree and territories
function setupMobileTouchHandling() {
    // Detect if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log("Mobile device detected, applying mobile optimizations");
        
        // Optimize tech tree for mobile
        const techTreeContainer = document.getElementById("tech-tree-container");
        const techInfoPanel = document.querySelector(".tech-info-panel");
        if (techTreeContainer) {
            // Handle double tap on tech nodes to select on mobile
            techTreeContainer.addEventListener("touchend", function(e) {
                if (e.target.closest(".tech-node")) {
                    // Prevent default to avoid zoom/scroll conflicts
                    e.preventDefault();
                    
                    // Get the tech node
                    const techNode = e.target.closest(".tech-node");
                    
                    // Simulate click
                    techNode.click();
                }
            });
            
            // Setup floating action buttons for tech tree tab
            const techInfoFab = document.getElementById("tech-info-fab");
            const techTreeFab = document.getElementById("tech-tree-fab");
            
            if (techInfoFab && techTreeFab && techInfoPanel) {
                // Show tree, hide info panel
                techTreeFab.addEventListener("click", function() {
                    techInfoPanel.style.display = "none";
                    techTreeContainer.style.display = "block";
                    techTreeContainer.parentElement.style.flexDirection = "column";
                });
                
                // Show info panel, hide tree
                techInfoFab.addEventListener("click", function() {
                    if (window.selectedTechId) {
                        techTreeContainer.style.display = "none";
                        techInfoPanel.style.display = "block"; 
                    } else {
                        addLogMessage("Select a technology first");
                    }
                });
            }
        }
        
        // Optimize territories for mobile
        const cityMap = document.querySelector(".city-map");
        const territoryInfoPanel = document.querySelector(".territory-info-panel");
        if (cityMap) {
            // Handle double tap on territory nodes to select on mobile
            cityMap.addEventListener("touchend", function(e) {
                if (e.target.closest(".territory-location")) {
                    // Prevent default to avoid zoom/scroll conflicts
                    e.preventDefault();
                    
                    // Get the territory location
                    const territoryNode = e.target.closest(".territory-location");
                    
                    // Simulate click
                    territoryNode.click();
                }
            });
            
            // Setup floating action buttons for territory tab
            const territoryInfoFab = document.getElementById("territory-info-fab");
            const territoryMapFab = document.getElementById("territory-map-fab");
            
            if (territoryInfoFab && territoryMapFab && territoryInfoPanel) {
                // Show map, hide info panel
                territoryMapFab.addEventListener("click", function() {
                    territoryInfoPanel.style.display = "none";
                    cityMap.style.display = "block";
                    cityMap.parentElement.style.flexDirection = "column";
                });
                
                // Show info panel, hide map
                territoryInfoFab.addEventListener("click", function() {
                    if (document.querySelector(".territory-location.selected")) {
                        cityMap.style.display = "none";
                        territoryInfoPanel.style.display = "block"; 
                    } else {
                        addLogMessage("Select a territory first");
                    }
                });
            }
        }
    }
}

// --- Game Logic ---

// Update resource generation rates based on boosts, items, tech, territories
function updateRates() {
    // Reset rates
    for (const resource in gameState.rates) {
        gameState.rates[resource] = 0;
    }
    // Reset global multipliers
    for (const bonus in gameState.globalMultipliers) {
        gameState.globalMultipliers[bonus] = 1.0;
    }

    // 1. Apply Base Production Boosts
    for (const boostId in gameState.baseProductionBoosts) {
        const boost = gameState.baseProductionBoosts[boostId];
        if (boost.level > 0) {
            const currentEffect = boost.baseEffect * Math.pow(boost.effectMultiplier, boost.level);
            if (boostId === "autoMiner") gameState.rates.credits += currentEffect;
            else if (boostId === "recruiterNode") gameState.rates.followers += currentEffect;
            else if (boostId === "networkTap") gameState.rates.techPoints += currentEffect;
            else if (boostId === "powerRelay") gameState.rates.energy += currentEffect;
            else if (boostId === "aiCoordinator") {
                // Special case: AI Coordinator adds a global bonus % per level
                const globalBonus = boost.baseEffect * boost.level; // e.g., 0.1 * level
                gameState.globalMultipliers.creditsRateBonus += globalBonus;
                gameState.globalMultipliers.followersRateBonus += globalBonus;
                gameState.globalMultipliers.influenceRateBonus += globalBonus;
                gameState.globalMultipliers.techPointsRateBonus += globalBonus;
                gameState.globalMultipliers.energyRateBonus += globalBonus;
            }
        }
    }

    // 2. Apply Item Effects (Flat Rates and Percentage Bonuses)
    for (const itemId in gameState.items) {
        const item = gameState.items[itemId];
        if (item.count > 0 && item.effect) { // Add check for item.effect existence
            for (const effectKey in item.effect) {
                const effectValue = item.effect[effectKey] * item.count; // Effect scales with count
                if (effectKey.endsWith("RateFlat")) { // Handle new flat rate bonus
                    const resourceName = effectKey.replace("RateFlat", "");
                    if (gameState.rates.hasOwnProperty(resourceName)) {
                        gameState.rates[resourceName] += effectValue;
                    } else {
                         console.warn(`DEBUG: Unknown resource ${resourceName} for flat rate bonus in item ${itemId}`);
                    }
                } else if (effectKey.endsWith("RateBonus")) { // Handle percentage bonus
                    // Ensure the corresponding multiplier exists
                    if (gameState.globalMultipliers.hasOwnProperty(effectKey)) {
                         gameState.globalMultipliers[effectKey] += effectValue;
                    } else {
                         console.warn(`DEBUG: Unknown multiplier ${effectKey} for percentage bonus in item ${itemId}`);
                    }
                } else if (effectKey === "missionSlots") { // Handle specific non-rate effects
                     // Example: gameState.progression.maxMissions += effectValue; (if needed)
                     console.log(`DEBUG: Item ${itemId} provides ${effectValue} missionSlots (logic TBD)`);
                }
                // Handle other potential item effects
            }
        }
    }

    // 3. Apply Tech Tree Effects (Percentage Bonuses)
    for (const techId in gameState.techTree) {
        const tech = gameState.techTree[techId];
        if (tech.completed && tech.effect) {
            for (const effectKey in tech.effect) {
                const effectValue = tech.effect[effectKey];
                if (effectKey.endsWith("RateBonus")) {
                    if (gameState.globalMultipliers.hasOwnProperty(effectKey)) {
                        gameState.globalMultipliers[effectKey] += effectValue;
                    }
                }
                // Handle other potential tech effects
            }
        }
    }

    // 4. Apply Active Territory Effects (Percentage Bonuses)
    for (const territoryId in gameState.territories) {
        const territory = gameState.territories[territoryId];
        if (territory.unlocked && territory.active && territory.effect) {
            for (const effectKey in territory.effect) {
                const effectValue = territory.effect[effectKey];
                if (effectKey.endsWith("RateBonus")) {
                    if (gameState.globalMultipliers.hasOwnProperty(effectKey)) {
                        gameState.globalMultipliers[effectKey] += effectValue;
                    }
                }
                // Handle other potential territory effects
            }
        }
    }
    
    // 5. Generate followers from influence (0.0001% of total influence per second)
    if (gameState.resources.influence > 0) {
        // Significantly increased rate for better follower generation
        const followerFromInfluence = gameState.resources.influence * 0.001; // 0.1% of influence per second
        gameState.rates.followers += followerFromInfluence;
        
        // Log this for debugging if followers aren't updating
        console.log(`Followers from influence: +${followerFromInfluence.toFixed(4)}/s from ${gameState.resources.influence} influence`);
    }

    // 6. Apply Global Multipliers to Rates
    for (const resource in gameState.rates) {
        const bonusKey = `${resource}RateBonus`;
        if (gameState.globalMultipliers.hasOwnProperty(bonusKey)) {
            gameState.rates[resource] *= gameState.globalMultipliers[bonusKey];
        }
    }

    // 7. Apply Prestige bonus ( +2 % per GigaTech )
    const prestigeMultiplier = 1 + (gameState.resources.gigaTech || 0) * 0.02;
    if (prestigeMultiplier > 1) {
        for (const r in gameState.rates) {
            gameState.rates[r] *= prestigeMultiplier;
        }
    }
    
    // Log current rates for debugging
    console.log("Current resource rates:", {
        credits: gameState.rates.credits,
        followers: gameState.rates.followers,
        influence: gameState.rates.influence,
        techPoints: gameState.rates.techPoints,
        energy: gameState.rates.energy
    });
}

// --- Manual Actions ---

function mineCredits() {
    playSound("sounds/click.wav"); // Play click sound
    gameState.resources.credits += 1;
    updateResourceDisplay(); // Update UI immediately
    // Add visual feedback if desired (e.g., clicking animation)
}

function collectTechPoints() {
    const baseCost = 5; // Base cost in credits
    let cost, amount;
    
    // Handle MAX multiplier
    if (gameState.clickMultiplier === "MAX") {
        // Calculate maximum possible amount based on available credits
        amount = Math.floor(gameState.resources.credits / baseCost);
        cost = amount * baseCost;
        
        if (amount <= 0) {
            addLogMessage("Insufficient credits to collect Tech Points.");
            return;
        }
    } else {
        // Normal multiplier
        cost = baseCost * gameState.clickMultiplier;
        amount = gameState.clickMultiplier;
    }
    
    if (gameState.resources.credits >= cost) {
        playSound("sounds/click.wav"); // Play click sound
        gameState.resources.credits -= cost;
        gameState.resources.techPoints += amount;
        updateResourceDisplay(); // Update UI immediately
    } else {
        addLogMessage(`Insufficient credits to collect Tech Points. Need ${cost} credits.`);
    }
}

function generateEnergy() {
    const baseCost = 10; // Base cost in credits
    let cost, amount;
    
    // Handle MAX multiplier
    if (gameState.clickMultiplier === "MAX") {
        // Calculate maximum possible amount based on available credits
        amount = Math.floor(gameState.resources.credits / baseCost);
        cost = amount * baseCost;
        
        if (amount <= 0) {
            addLogMessage("Insufficient credits to generate Energy.");
            return;
        }
    } else {
        // Normal multiplier
        cost = baseCost * gameState.clickMultiplier;
        amount = gameState.clickMultiplier;
    }
    
    if (gameState.resources.credits >= cost) {
        playSound("sounds/click.wav"); // Play click sound
        gameState.resources.credits -= cost;
        gameState.resources.energy += amount;
        updateResourceDisplay(); // Update UI immediately
    } else {
        addLogMessage(`Insufficient credits to generate Energy. Need ${cost} credits.`);
    }
}

function cycleClickMultiplier() {
    // Cycle through multiplier values: 1 -> 5 -> 10 -> 100 -> MAX -> 1
    const multipliers = [1, 5, 10, 100, "MAX"];
    
    // Find current position in the cycle
    let currentIndex = -1;
    if (gameState.clickMultiplier === "MAX") {
        currentIndex = multipliers.indexOf("MAX");
    } else {
        currentIndex = multipliers.indexOf(gameState.clickMultiplier);
    }
    
    // Move to next multiplier
    const nextIndex = (currentIndex + 1) % multipliers.length;
    gameState.clickMultiplier = multipliers[nextIndex];
    
    // Update button text
    const clickMultiplierButton = document.getElementById("click-multiplier-button");
    if (clickMultiplierButton) {
        clickMultiplierButton.textContent = `Clicks: ${gameState.clickMultiplier}x`;
    }
    
    playSound("sounds/click.wav"); // Play click sound
}

function upgradeTuring() {
    const currentLevel = gameState.turingLevel || 1;
    const nextLevel = currentLevel + 1;
    
    // Calculate upgrade cost (increases with level)
    const baseCost = { techPoints: 100, energy: 50, credits: 500 };
    const cost = {};
    for (const resource in baseCost) {
        cost[resource] = baseCost[resource] * Math.pow(1.5, currentLevel - 1);
    }
    
    // Format cost for display
    let costString = "";
    for (const resource in cost) {
        costString += `${Math.floor(cost[resource])} ${resource}, `;
    }
    costString = costString.slice(0, -2); // Remove trailing comma and space
    
    // Check if player can afford upgrade
    let canAfford = true;
    for (const resource in cost) {
        if (gameState.resources[resource] < cost[resource]) {
            canAfford = false;
            break;
        }
    }
    
    if (!canAfford) {
        addLogMessage(`Insufficient resources to upgrade Turing to Level ${nextLevel}. Requires: ${costString}`);
        return false;
    }
    
    // Deduct resources
    for (const resource in cost) {
        gameState.resources[resource] -= cost[resource];
    }
    
    // Upgrade Turing
    gameState.turingLevel = nextLevel;
    addLogMessage(`Turing upgraded to Level ${nextLevel}!`);
    
    // Show upgrade dialogue if it exists
    if (dialogues["turing_upgrade"]) {
        showDialogue("turing_upgrade");
    }
    
    // Update UI
    updateResourceDisplay();
    
    return true;
}

// --- Purchase/Action Functions ---

// Calculate cost based on base cost, multiplier, and level
function calculateCost(baseCost, multiplier, level) {
    const cost = {};
    if (!baseCost) return cost;
    
    for (const resource in baseCost) {
        cost[resource] = baseCost[resource] * Math.pow(multiplier || 1.0, level || 0);
    }
    return cost;
}

function buyBoost(boostId) {
    console.log(`Attempting to buy boost: ${boostId}`);
    
    // Validate boost exists
    const boost = gameState.baseProductionBoosts[boostId];
    if (!boost) {
        console.error(`Boost ${boostId} not found!`);
        return;
    }
    
    // Check if it's unlocked
    if (!boost.unlocked) {
        console.error(`Boost ${boostId} is not unlocked yet!`);
        addLogMessage(`You need to unlock ${boost.name} first through research.`);
        return;
    }
    
    // Determine how many levels to buy based on clickMultiplier
    let levelsToBuy = 1;
    
    if (gameState.clickMultiplier === "MAX") {
        // For MAX, calculate max possible levels based on resources
        levelsToBuy = calculateMaxAffordableLevels(boost);
        if (levelsToBuy <= 0) {
            addLogMessage(`Insufficient resources to upgrade ${boost.name}.`);
            return;
        }
    } else {
        // Use clickMultiplier directly
        levelsToBuy = gameState.clickMultiplier;
    }
    
    // Calculate total cost for all levels
    const totalCost = {};
    let canAfford = true;
    let costString = "";
    
    try {
        // Start with current level
        const startLevel = boost.level || 0;
        const costMultiplier = boost.costMultiplier || 1.15;
        
        // Calculate cost for each resource across all levels to buy
        for (const resource in boost.baseCost) {
            // Safety check for resources
            if (!gameState.resources.hasOwnProperty(resource)) {
                console.error(`Resource ${resource} not found in game state!`);
                continue;
            }
            
            // Add up costs for each level
            let resourceTotalCost = 0;
            const baseAmount = boost.baseCost[resource] || 0;
            
            for (let i = 0; i < levelsToBuy; i++) {
                const levelCost = Math.floor(baseAmount * Math.pow(costMultiplier, startLevel + i));
                resourceTotalCost += levelCost;
            }
            
            totalCost[resource] = resourceTotalCost;
            costString += `${formatNumber(resourceTotalCost)} ${resource}, `;
            
            if (gameState.resources[resource] < resourceTotalCost) {
                canAfford = false;
            }
        }
        costString = costString.slice(0, -2); // Remove trailing comma and space
    } catch (error) {
        console.error(`Error calculating boost cost for ${boostId}:`, error);
        addLogMessage("An error occurred while calculating upgrade cost.");
        return;
    }

    // Process purchase
    if (canAfford) {
        try {
            playSound("sounds/click.wav"); // Play click sound
            
            // Deduct resources
            for (const resource in totalCost) {
                gameState.resources[resource] -= totalCost[resource];
            }
            
            // Increment level
            boost.level = (boost.level || 0) + levelsToBuy;
            
            // Log success
            addLogMessage(`${boost.name} upgraded by ${levelsToBuy} level${levelsToBuy > 1 ? 's' : ''} to Level ${boost.level}.`);
            console.log(`Successfully upgraded ${boostId} by ${levelsToBuy} levels to level ${boost.level}`);
            
            // Update game state
            updateRates();
            updateResourceDisplay();
            updateBoostsDisplay(); // Refresh boost display
            saveGame(); // Save progress after significant purchase
        } catch (error) {
            console.error(`Error processing boost purchase for ${boostId}:`, error);
            addLogMessage("An error occurred while upgrading. Please try again.");
        }
    } else {
        addLogMessage(`Insufficient resources to upgrade ${boost.name} ${levelsToBuy} time${levelsToBuy > 1 ? 's' : ''}. Requires: ${costString}`);
    }
}

// Helper function to calculate maximum affordable boost levels
function calculateMaxAffordableLevels(boost) {
    const startLevel = boost.level || 0;
    const costMultiplier = boost.costMultiplier || 1.15;
    
    // Clone resources for calculation
    const availableResources = {};
    for (const resource in gameState.resources) {
        availableResources[resource] = gameState.resources[resource];
    }
    
    // Try buying levels until we can't afford more
    let levelsBought = 0;
    let canAffordMore = true;
    
    while (canAffordMore) {
        // Check if we can afford the next level
        canAffordMore = true;
        
        for (const resource in boost.baseCost) {
            const baseAmount = boost.baseCost[resource] || 0;
            const levelCost = Math.floor(baseAmount * Math.pow(costMultiplier, startLevel + levelsBought));
            
            if (availableResources[resource] < levelCost) {
                canAffordMore = false;
                break;
            }
        }
        
        if (canAffordMore) {
            // Deduct resources for this level
            levelsBought++;
            
            for (const resource in boost.baseCost) {
                const baseAmount = boost.baseCost[resource] || 0;
                const levelCost = Math.floor(baseAmount * Math.pow(costMultiplier, startLevel + levelsBought - 1));
                availableResources[resource] -= levelCost;
            }
            
            // Limit to 100 levels at a time to prevent infinite loops or lag
            if (levelsBought >= 100) break;
        }
    }
    
    return levelsBought;
}

function buyItem(itemId) {
    const item = gameState.items[itemId];
    if (!item) return;
    
    // Calculate max items that can be bought based on max limit
    const maxLimit = item.max ? item.max - item.count : Infinity;
    if (maxLimit <= 0) {
        addLogMessage(`Maximum count reached for ${item.name}.`);
        return;
    }

    // Check if item requires a tech that hasn't been completed yet
    if (item.requiresTech && gameState.techTree[item.requiresTech] && 
        !gameState.techTree[item.requiresTech].completed) {
        addLogMessage(`Research ${gameState.techTree[item.requiresTech].name} first to unlock ${item.name}.`);
        return;
    }

    // Determine how many items to buy based on clickMultiplier
    let itemsToBuy = 1;
    
    if (gameState.clickMultiplier === "MAX") {
        // For MAX, calculate max possible items based on resources and max limit
        itemsToBuy = calculateMaxAffordableItems(item);
        if (itemsToBuy <= 0) {
            addLogMessage(`Insufficient resources to construct ${item.name}.`);
            return;
        }
    } else {
        // Use clickMultiplier directly
        itemsToBuy = gameState.clickMultiplier;
    }
    
    // Cap items to buy at the max limit
    itemsToBuy = Math.min(itemsToBuy, maxLimit);
    if (itemsToBuy <= 0) {
        addLogMessage(`Cannot construct more ${item.name} (max limit reached).`);
        return;
    }

    // Calculate total cost for all items
    const totalCost = {};
    let canAfford = true;
    let costString = "";
    
    for (const resource in item.baseCost) {
        let resourceTotalCost = 0;
        
        // Calculate cost for each item being purchased
        for (let i = 0; i < itemsToBuy; i++) {
            const itemCost = item.baseCost[resource] * Math.pow(item.costMultiplier || 1, item.count + i);
            resourceTotalCost += itemCost;
        }
        
        totalCost[resource] = resourceTotalCost;
        costString += `${formatNumber(resourceTotalCost)} ${resource}, `;
        
        if (gameState.resources[resource] < resourceTotalCost) {
            canAfford = false;
            break;
        }
    }
    costString = costString.slice(0, -2); // Remove trailing comma and space

    if (canAfford) {
        playSound("sounds/click.wav"); // Play click sound
        
        // Deduct resources
        for (const resource in totalCost) {
            gameState.resources[resource] -= totalCost[resource];
        }
        
        // Increment count
        item.count += itemsToBuy;
        
        // Log success
        addLogMessage(`Constructed ${itemsToBuy} ${item.name}${itemsToBuy > 1 ? 's' : ''} (Total: ${item.count}).`);
        
        updateRates();
        updateResourceDisplay();
        updateItemsDisplay(); // Refresh item display
    } else {
        addLogMessage(`Insufficient resources to construct ${itemsToBuy} ${item.name}${itemsToBuy > 1 ? 's' : ''}. Requires: ${costString}`);
    }
}

// Helper function to calculate maximum affordable items
function calculateMaxAffordableItems(item) {
    const startCount = item.count || 0;
    const costMultiplier = item.costMultiplier || 1.0;
    const maxLimit = item.max ? item.max - startCount : Infinity;
    
    // Early exit if already at max
    if (maxLimit <= 0) return 0;
    
    // Clone resources for calculation
    const availableResources = {};
    for (const resource in gameState.resources) {
        availableResources[resource] = gameState.resources[resource];
    }
    
    // Try buying items until we can't afford more
    let itemsBought = 0;
    let canAffordMore = true;
    
    while (canAffordMore && itemsBought < maxLimit) {
        // Check if we can afford the next item
        canAffordMore = true;
        
        for (const resource in item.baseCost) {
            const itemCost = item.baseCost[resource] * Math.pow(costMultiplier, startCount + itemsBought);
            
            if (availableResources[resource] < itemCost) {
                canAffordMore = false;
                break;
            }
        }
        
        if (canAffordMore) {
            // Deduct resources for this item
            itemsBought++;
            
            for (const resource in item.baseCost) {
                const itemCost = item.baseCost[resource] * Math.pow(costMultiplier, startCount + itemsBought - 1);
                availableResources[resource] -= itemCost;
            }
            
            // Limit to 100 items at a time to prevent infinite loops or lag
            if (itemsBought >= 100) break;
        }
    }
    
    return itemsBought;
}

function researchTech(techId) {
    const tech = gameState.techTree[techId];
    if (!tech || tech.completed) return;

    // Check prerequisites again (belt and suspenders)
    let prereqsMet = true;
    if (tech.requires && tech.requires.length > 0) {
        for (const reqId of tech.requires) {
            if (!gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                prereqsMet = false;
                break;
            }
        }
    }
    if (!prereqsMet) {
        addLogMessage(`Prerequisites not met for ${tech.name}.`);
        return;
    }

    const cost = {};
    let canAfford = true;
    for (const resource in tech.cost) {
        cost[resource] = tech.cost[resource];
        if (gameState.resources[resource] < tech.cost[resource]) {
            canAfford = false;
            break;
        }
    }

    if (canAfford) {
        playSound("sounds/click.wav"); // Play click sound
        for (const resource in cost) {
            gameState.resources[resource] -= cost[resource];
        }
        tech.completed = true;
        addLogMessage(`Technology researched: ${tech.name}.`);

        // Unlock corresponding items/boosts
        if (tech.unlocksBoost && gameState.baseProductionBoosts[tech.unlocksBoost]) {
            gameState.baseProductionBoosts[tech.unlocksBoost].unlocked = true;
            addLogMessage(`Boost unlocked: ${gameState.baseProductionBoosts[tech.unlocksBoost].name}`);
        }
        if (tech.unlocksItem && gameState.items[tech.unlocksItem]) {
            // Items don't have an 'unlocked' flag currently, tech just enables purchase
            addLogMessage(`Item available: ${gameState.items[tech.unlocksItem].name}`);
        }
        
        // Apply special effects
        if (tech.effect) {
            // Handle mind control reduction
            if (tech.effect.mindControlReduction) {
                const reduction = tech.effect.mindControlReduction;
                gameState.resources.mindControlCounter *= (1 - reduction);
                addLogMessage(`Mind Control Counter reduced by ${Math.round(reduction * 100)}%`);
            }
            
            // Handle other special effects as needed
            if (tech.effect.allResourcesBonus) {
                const bonus = tech.effect.allResourcesBonus;
                for (const key in gameState.globalMultipliers) {
                    if (key.endsWith("RateBonus")) {
                        gameState.globalMultipliers[key] += bonus;
                    }
                }
                addLogMessage(`All resource rates increased by ${Math.round(bonus * 100)}%`);
            }
        }

        updateRates();
        updateResourceDisplay();
        updateTechTreeDisplay(); // Refresh tech display
        updateBoostsDisplay(); // Refresh boosts in case one was unlocked
        updateItemsDisplay(); // Refresh items in case one was unlocked
    } else {
        addLogMessage(`Insufficient resources to research ${tech.name}.`);
    }
}

function captureTerritory(territoryId) {
    const territory = gameState.territories[territoryId];
    if (!territory || territory.unlocked) return;

    // Check prerequisites again
    let prereqsMet = true;
    if (territory.requires && territory.requires.length > 0) {
        for (const reqId of territory.requires) {
            if (!gameState.territories[reqId] || !gameState.territories[reqId].unlocked) {
                prereqsMet = false;
                break;
            }
        }
    }
    if (!prereqsMet) {
        addLogMessage(`Prerequisites not met for ${territory.name}.`);
        return;
    }

    const cost = {};
    let canAfford = true;
    for (const resource in territory.cost) {
        cost[resource] = territory.cost[resource];
        if (gameState.resources[resource] < territory.cost[resource]) {
            canAfford = false;
            break;
        }
    }

    if (canAfford) {
        playSound("sounds/click.wav"); // Play click sound
        for (const resource in cost) {
            gameState.resources[resource] -= cost[resource];
        }
        territory.unlocked = true;
        territory.active = true; // Automatically activate on capture
        addLogMessage(`Territory captured and activated: ${territory.name}.`);
        updateRates();
        updateResourceDisplay();
        updateTerritoriesDisplay(); // Refresh territory display
    } else {
        addLogMessage(`Insufficient resources to capture ${territory.name}.`);
    }
}

function activateTerritory(territoryId) {
    const territory = gameState.territories[territoryId];
    if (!territory || !territory.unlocked) return;

    territory.active = !territory.active; // Toggle active state
    addLogMessage(`${territory.name} ${territory.active ? "activated" : "deactivated"}.`);
    playSound("sounds/click.wav");
    updateRates();
    updateResourceDisplay();
    updateTerritoriesDisplay(); // Refresh territory display
}

// --- UI Functions ---

// Function to switch tabs
function switchTab(tabId) {
    console.log(`DEBUG: Switching to tab: ${tabId}`);
    // Hide all tab content
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => {
        content.style.display = "none";
    });

    // Deactivate all tabs
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    // Show the selected tab content
    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) {
        selectedTabContent.style.display = "block";
        console.log(`DEBUG: Displaying content for ${tabId}`);
    } else {
        console.error(`DEBUG: Content element not found for ${tabId}`);
    }

    // Activate the selected tab button
    const selectedTabButton = document.querySelector(`button[data-tab="${tabId}"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add("active");
    } else {
        console.error(`DEBUG: Tab button not found for ${tabId}`);
    }

    // Also hide achievements section when switching main tabs
    const achievementsSection = document.getElementById("achievements-section");
    if (achievementsSection) {
        achievementsSection.style.display = "none";
    }
    
    // Special handling for tech tree tab to ensure connections are drawn properly
    if (tabId === "techTree-tab") {
        console.log("Switching to Tech Tree tab");
        // Clear and force redraw of tech tree
        const techTreeContainer = document.getElementById("tech-tree-container");
        if (techTreeContainer) {
            techTreeContainer.innerHTML = '';
        }
        
        // Use a small timeout to make sure DOM is ready
        setTimeout(() => {
            console.log("Refreshing tech tree connections after tab switch");
            updateTechTreeDisplay();
            // Debug the tech tree after updating
            debugTechTree();
        }, 100);
    }
}

// Function to toggle achievements display
function toggleAchievements() {
    const achievementsSection = document.getElementById("achievements-section");
    if (achievementsSection) {
        if (achievementsSection.style.display === "block") {
            achievementsSection.style.display = "none";
        } else {
            // Hide other tabs before showing achievements
            const tabContents = document.querySelectorAll(".tab-content");
            tabContents.forEach(content => {
                content.style.display = "none";
            });
            const tabs = document.querySelectorAll(".tab");
            tabs.forEach(tab => {
                tab.classList.remove("active");
            });
            achievementsSection.style.display = "block";
            updateAchievementsDisplay(); // Update content when shown
        }
    }
}

// Function to add log messages
function addLogMessage(message) {
    // Validate inputs
    if (!message || typeof message !== 'string') {
        console.error("Invalid log message", message);
        return;
    }

    try {
        const logContainer = document.getElementById("log-container");
        if (!logContainer) {
            console.error("Log container not found");
            return;
        }
        
        // Create timestamp
        const timestamp = new Date();
        const timeString = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;
        
        // Create log entry
        const logEntry = document.createElement("div");
        logEntry.className = "log-entry";
        logEntry.innerHTML = `<span class="log-time">[${timeString}]</span> ${message}`;
        
        // Add to container and scroll to bottom
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Limit log size (keep latest 100 entries)
        while (logContainer.children.length > 100) {
            logContainer.removeChild(logContainer.firstChild);
        }
        
        // Also output to console for debugging
        console.log(`[LOG] ${message}`);
    } catch (error) {
        console.error("Error adding log message:", error);
    }
}

// Function to play a sound effect
function playSound(soundPath) {
    if (gameState.settings.soundEnabled) {
        try {
            const audio = new Audio(soundPath);
            audio.play();
        } catch (error) {
            console.error("Error playing sound:", error);
            // Optionally disable sound if errors persist
            // gameState.settings.soundEnabled = false;
        }
    }
}

// Function to format large numbers
function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return "0.00"; // Added check
    if (num < 1000) return num.toFixed(2);
    if (num < 1000000) return (num / 1000).toFixed(2) + "K";
    if (num < 1000000000) return (num / 1000000).toFixed(2) + "M";
    return (num / 1000000000).toFixed(2) + "B";
}

// Manually inject CSS for resource update animation if it doesn't exist
function injectResourceUpdateCSS() {
    if (!document.getElementById('resource-update-style')) {
        const style = document.createElement('style');
        style.id = 'resource-update-style';
        style.innerHTML = `
            @keyframes resourceUpdated {
                0% { color: inherit; }
                50% { color: #00ff00; }
                100% { color: inherit; }
            }
            .resource-updated {
                animation: resourceUpdated 0.5s ease;
            }
        `;
        document.head.appendChild(style);
        console.log("Resource update CSS injected");
    }
}

// Function to directly update the followers display by accessing the DOM element
function forceUpdateFollowers() {
    // First ensure CSS for animation is present
    injectResourceUpdateCSS();
    
    // Get the followers element directly from DOM
    const followersElement = document.getElementById("followers-value");
    if (followersElement) {
        // Get current followers (rounded to integer)
        const followerCount = Math.floor(gameState.resources.followers);
        
        // Directly set the text content
        followersElement.textContent = followerCount;
        
        // Add visual feedback
        followersElement.classList.add('resource-updated');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            followersElement.classList.remove('resource-updated');
        }, 500);
        
        // Log update
        console.log(`FORCE UPDATE: Followers set to ${followerCount}`);
        return true;
    } else {
        console.error("CRITICAL: Could not find followers-value element in the DOM");
        // Try to dump the DOM structure to see what's wrong
        console.log("DOM structure:", document.body.innerHTML.substring(0, 200) + "...");
        return false;
    }
}

// Update resource display
function updateResourceDisplay() {
    try { // Added try-catch
        document.getElementById("credits-value").textContent = formatNumber(gameState.resources.credits);
        document.getElementById("credits-rate").textContent = formatNumber(gameState.rates.credits) + "/s";

        // Show followers as integers (rounded)
        const followersValue = document.getElementById("followers-value");
        if (followersValue) {
            followersValue.textContent = Math.floor(gameState.resources.followers);
        } else {
            // Try to force create and update the followers element if it doesn't exist
            console.error("Followers display element not found, attempting emergency fix...");
            const resourcesPanel = document.querySelector('.resources-panel');
            if (resourcesPanel) {
                // Look for the followers section
                const followersSection = resourcesPanel.querySelector('.resource-item[data-resource="followers"]');
                if (!followersSection) {
                    console.log("Creating missing followers section");
                    const newFollowersSection = document.createElement('div');
                    newFollowersSection.className = 'resource-item';
                    newFollowersSection.setAttribute('data-resource', 'followers');
                    newFollowersSection.innerHTML = `
                        <div class="resource-name">Followers</div>
                        <div class="resource-value"><span id="followers-value">0</span></div>
                        <div class="resource-rate"><span id="followers-rate">0.0/s</span></div>
                    `;
                    resourcesPanel.appendChild(newFollowersSection);
                }
            }
        }
        
        // Always try to force update followers separately from rest of display
        forceUpdateFollowers();
        
        const followersRate = document.getElementById("followers-rate");
        if (followersRate) {
            followersRate.textContent = formatNumber(gameState.rates.followers) + "/s";
            
            // Add tooltip for followers rate to show influence bonus
            if (gameState.resources.influence > 0) {
                const influenceBonus = gameState.resources.influence * 0.0001;
                followersRate.title = `+${formatNumber(influenceBonus)}/s from Influence`;
            }
        }

        document.getElementById("influence-value").textContent = formatNumber(gameState.resources.influence);
        document.getElementById("influence-rate").textContent = formatNumber(gameState.rates.influence) + "/s";
        
        // Add tooltip for influence value to show follower generation
        const influenceElement = document.getElementById("influence-value");
        if (influenceElement && gameState.resources.influence > 0) {
            const followersGenerated = gameState.resources.influence * 0.0001;
            influenceElement.title = `Generates ${formatNumber(followersGenerated)} followers/s`;
        }

        document.getElementById("techPoints-value").textContent = formatNumber(gameState.resources.techPoints);
        document.getElementById("techPoints-rate").textContent = formatNumber(gameState.rates.techPoints) + "/s";

        document.getElementById("energy-value").textContent = formatNumber(gameState.resources.energy);
        document.getElementById("energy-rate").textContent = formatNumber(gameState.rates.energy) + "/s";

        document.getElementById("rebellionStrength-value").textContent = formatNumber(gameState.resources.rebellionStrength);
        document.getElementById("rebellionStrength-rate").textContent = formatNumber(gameState.rates.rebellionStrength) + "/s";
        
        // Add tooltip for Rebellion Strength
        const rebellionElement = document.getElementById("rebellionStrength-value");
        if (rebellionElement) {
            rebellionElement.title = "Build this to 100+ to unlock the Attack GigaCorp action";
        }

        document.getElementById("gigaTech-value").textContent = formatNumber(gameState.resources.gigaTech);
        document.getElementById("gigaTech-rate").textContent = formatNumber(gameState.rates.gigaTech) + "/s";
        
        // Add tooltip for GigaTech
        const gigaTechElement = document.getElementById("gigaTech-value");
        if (gigaTechElement) {
            gigaTechElement.title = "Stolen GigaCorp technology. Provides a permanent bonus of +2% to all resource rates per GigaTech. Earned by successfully defeating GigaCorp.";
        }

        document.getElementById("mindControlCounter-value").textContent = formatNumber(gameState.resources.mindControlCounter);
        document.getElementById("mindControlCounter-rate").textContent = formatNumber(gameState.rates.mindControlCounter) + "/s";
        
        // Add tooltip for Mind Control Counter
        const mcElement = document.getElementById("mindControlCounter-value");
        if (mcElement) {
            mcElement.title = "GigaCorp mind control influence. Reduces your chance of successful attacks against them.";
        }
        
        // Update Turing Level
        const turingLevelElement = document.getElementById("turing-level");
        if (turingLevelElement) {
            turingLevelElement.textContent = gameState.turingLevel || 1;
        }
        
        // Update prestige bonus tooltip if displayed
        const prestigeBonus = (gameState.resources.gigaTech || 0) * 2;
        if (prestigeBonus > 0) {
            // Add a small indicator showing the current bonus
            for (const resourceKey in gameState.rates) {
                const rateElement = document.getElementById(`${resourceKey}-rate`);
                if (rateElement) {
                    rateElement.title = `Includes +${prestigeBonus}% bonus from GigaTech`;
                }
            }
        }
    } catch (error) {
        console.error("Error in updateResourceDisplay:", error, "Followers value:", gameState.resources.followers); // Added more detailed error logging
    }
}

// Update Boosts display
function updateBoostsDisplay() {
    console.log("DEBUG: updateBoostsDisplay called.");
    const boostsList = document.getElementById("boosts-list");
    if (!boostsList) {
        console.error("DEBUG: boosts-list element not found!");
        return;
    }
    console.log("DEBUG: boosts-list element found:", boostsList);
    boostsList.innerHTML = ""; // Clear previous content

    if (!gameState || !gameState.baseProductionBoosts) {
        console.error("DEBUG: gameState.baseProductionBoosts is missing or invalid!");
        return;
    }
    console.log("DEBUG: gameState.baseProductionBoosts:", JSON.stringify(gameState.baseProductionBoosts));

    let boostCount = 0;
    try { // Added try-catch
        for (const boostId in gameState.baseProductionBoosts) {
            boostCount++;
            const boost = gameState.baseProductionBoosts[boostId];
            if (!boost || typeof boost !== 'object') { // Added check
                console.error(`DEBUG: Invalid boost data for ID: ${boostId}`);
                continue;
            }
            if (!boost.unlocked) continue; // Skip locked boosts

            const cost = {};
            let canAfford = true;
            let costString = "";
            if (!boost.baseCost || typeof boost.baseCost !== 'object') { // Added check
                 console.error(`DEBUG: Invalid baseCost for boost: ${boostId}`);
                 continue;
            }
            for (const resource in boost.baseCost) {
                const currentCost = boost.baseCost[resource] * Math.pow(boost.costMultiplier || 1, boost.level || 0);
                cost[resource] = currentCost;
                costString += `${formatNumber(currentCost)} ${resource}, `;
                if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < currentCost) {
                    canAfford = false;
                }
            }
            costString = costString.slice(0, -2); // Remove trailing comma and space

            const boostElement = document.createElement("div");
            boostElement.classList.add("upgrade-item"); // Use existing class for styling
            boostElement.innerHTML = `
                <div class="upgrade-name">${boost.name || 'Unnamed Boost'} (Level ${boost.level || 0})</div>
                <div class="upgrade-desc">${boost.desc || ''}</div>
                <div class="upgrade-effect">Effect: ${boost.baseEffect > 0 ? `+${formatNumber(boost.baseEffect * Math.pow(boost.effectMultiplier || 1, boost.level || 0))} Base/sec` : `+${(boost.baseEffect * 100).toFixed(0)}% Global/level`}</div>
                <div class="upgrade-cost">Cost: ${costString}</div>
                <button class="neon-button" onclick="buyBoost('${boostId}')" ${!canAfford ? "disabled" : ""}>
                    Upgrade
                </button>
            `;
            boostsList.appendChild(boostElement);
        }
    } catch (error) {
        console.error("Error processing boosts:", error); // Added error logging
    }
    console.log(`DEBUG: Looped through ${boostCount} boosts.`);
}

// Update Items display
function updateItemsDisplay() {
    console.log("DEBUG: updateItemsDisplay called.");
    const itemsList = document.getElementById("items-list");
    if (!itemsList) {
        console.error("DEBUG: items-list element not found!");
        return;
    }
    console.log("DEBUG: items-list element found:", itemsList);
    itemsList.innerHTML = ""; // Clear previous content

    if (!gameState || !gameState.items) {
        console.error("DEBUG: gameState.items is missing or invalid!");
        return;
    }
    console.log("DEBUG: gameState.items:", JSON.stringify(gameState.items));

    let itemCount = 0;
    try { // Added try-catch
        for (const itemId in gameState.items) {
            itemCount++;
            const item = gameState.items[itemId];
            if (!item || typeof item !== 'object') { // Added check
                console.error(`DEBUG: Invalid item data for ID: ${itemId}`);
                continue;
            }
            
            // Check if item's required tech is completed
            let isUnlocked = true;
            if (item.requiresTech && gameState.techTree[item.requiresTech]) {
                isUnlocked = gameState.techTree[item.requiresTech].completed;
                
                // Skip this item if not unlocked by tech
                if (!isUnlocked) continue;
            }

            const cost = {};
            let canAfford = true;
            let costString = "";
            if (!item.baseCost || typeof item.baseCost !== 'object') { // Added check
                console.error(`DEBUG: Invalid baseCost for item: ${itemId}`);
                continue;
            }
            for (const resource in item.baseCost) {
                const currentCost = item.baseCost[resource] * Math.pow(item.costMultiplier || 1, item.count || 0);
                cost[resource] = currentCost;
                costString += `${formatNumber(currentCost)} ${resource}, `;
                if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < currentCost) {
                    canAfford = false;
                    break;
                }
            }
            costString = costString.slice(0, -2); // Remove trailing comma and space

            let effectString = "";
            if (item.effect && typeof item.effect === 'object') { // Added check
                for (const effectKey in item.effect) {
                    if (effectKey.endsWith("Rate")) {
                        effectString += `+${formatNumber(item.effect[effectKey])} ${effectKey.replace("Rate", "")} /sec, `;
                    } else if (effectKey.endsWith("Bonus")) {
                        effectString += `+${(item.effect[effectKey] * 100).toFixed(0)}% ${effectKey.replace("RateBonus", "")} Rate, `;
                    } else {
                        effectString += `${effectKey}: ${item.effect[effectKey]}, `;
                    }
                }
                effectString = effectString.slice(0, -2);
            }
            if (!effectString && item.desc && item.desc.includes("mission")) {
                effectString = "Enables Missions";
            }

            const itemElement = document.createElement("div");
            itemElement.classList.add("item-item"); // New class for styling if needed
            itemElement.innerHTML = `
                <div class="item-name">${item.name || 'Unnamed Item'} (Owned: ${item.count || 0})</div>
                <div class="item-desc">${item.desc || ''}</div>
                <div class="item-effect">Effect: ${effectString}</div>
                <div class="item-cost">Cost: ${costString}</div>
                <button class="neon-button" onclick="buyItem('${itemId}')" ${!canAfford || (item.max && item.count >= item.max) ? "disabled" : ""}>
                    ${(item.max && item.count >= item.max) ? 'Max Reached' : 'Construct'}
                </button>
            `;
            itemsList.appendChild(itemElement);
        }
    } catch (error) {
        console.error("Error processing items:", error); // Added error logging
    }
    console.log(`DEBUG: Looped through ${itemCount} items.`);
}

// Update Tech Tree display
function updateTechTreeDisplay() {
    console.log("DEBUG: updateTechTreeDisplay called.");
    
    // Call our debug function to identify issues
    debugTechTree();
    
    const techTreeContainer = document.getElementById("tech-tree-container");
    if (!techTreeContainer) {
        console.error("DEBUG: tech-tree-container element not found!");
        return;
    }
    
    // Clear previous content
    techTreeContainer.innerHTML = "";
    
    if (!gameState || !gameState.techTree) {
        console.error("DEBUG: gameState.techTree is missing or invalid!");
        return;
    }
    
    // Track tech nodes and connections to draw
    const nodes = [];
    const connections = [];
    
    // First pass: Add all nodes and determine which are available
    for (const techId in gameState.techTree) {
        const tech = gameState.techTree[techId];
        
        // Skip if tech is invalid
        if (!tech || typeof tech !== 'object') {
            console.error(`DEBUG: Invalid tech data for ID: ${techId}`);
            continue;
        }
        
        // Check if tech is available (all prerequisites completed)
        let isAvailable = true;
        if (tech.requires && tech.requires.length > 0) {
            for (const reqId of tech.requires) {
                if (!gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                    isAvailable = false;
                    break;
                }
            }
        }
        
        // Add node data to array
        nodes.push({
            id: techId,
            tech: tech,
            isAvailable: isAvailable,
            isCompleted: tech.completed
        });
        
        // Add connections for this node
        if (tech.requires && tech.requires.length > 0) {
            for (const reqId of tech.requires) {
                if (gameState.techTree[reqId]) {
                    connections.push({
                        from: reqId,
                        to: techId,
                        isCompleted: tech.completed && gameState.techTree[reqId].completed
                    });
                }
            }
        }
    }
    
    // Fourth pass: Redraw connections to attach to connection points
    techTreeContainer.innerHTML = ""; // Clear and redraw everything
    
    // First create all nodes but don't append them yet
    const nodeElements = [];
    for (const node of nodes) {
        const tech = node.tech;
        
        // Create node element
        const nodeElement = document.createElement("div");
        nodeElement.classList.add("tech-node");
        nodeElement.id = `tech-node-${node.id}`;
        
        // Add class based on status
        if (node.isCompleted) {
            nodeElement.classList.add("completed");
        } else if (node.isAvailable) {
            nodeElement.classList.add("available");
        } else {
            nodeElement.classList.add("locked");
        }
        
        // Position node
        if (tech.position) {
            nodeElement.style.left = `${tech.position.x}%`;
            nodeElement.style.top = `${tech.position.y}%`;
            // Transform for centering is now in the CSS
        }
        
        // Add icon
        const iconElement = document.createElement("div");
        iconElement.classList.add("tech-node-icon");
        iconElement.textContent = tech.icon || "🔍";
        nodeElement.appendChild(iconElement);
        
        // Add name
        const nameElement = document.createElement("div");
        nameElement.classList.add("tech-node-name");
        nameElement.textContent = tech.name;
        nodeElement.appendChild(nameElement);
        
        // Add description (short version)
        const descElement = document.createElement("div");
        descElement.classList.add("tech-node-desc");
        const shortDesc = tech.effectDesc.split('.')[0] + "."; // First sentence only
        descElement.textContent = shortDesc;
        nodeElement.appendChild(descElement);
        
        // Add connection points to the node
        addConnectionPoints(nodeElement);
        
        // Add click event
        nodeElement.addEventListener("click", () => {
            // Select this tech
            window.selectedTechId = node.id;
            
            // Deselect previously selected node
            const selectedNodes = document.querySelectorAll(".tech-node.selected");
            selectedNodes.forEach(node => node.classList.remove("selected"));
            
            // Mark as selected
            nodeElement.classList.add("selected");
            
            // Update detail panel
            updateTechDetailPanel(node.id);
        });
        
        // Store for later appending
        nodeElements.push({ element: nodeElement, id: node.id });
    }
    
    // Now draw all connections first
    for (const connection of connections) {
        const fromTech = gameState.techTree[connection.from];
        const toTech = gameState.techTree[connection.to];
        
        if (!fromTech || !toTech || !fromTech.position || !toTech.position) {
            continue;
        }
        
        drawTechConnection(connection, fromTech, toTech, techTreeContainer, connection.isCompleted);
    }
    
    // Finally, append all node elements on top of connections
    for (const node of nodeElements) {
        techTreeContainer.appendChild(node.element);
    }
    
    // Debug info after rendering
    console.log(`DEBUG: Rendered ${nodeElements.length} tech nodes and ${connections.length} connections`);
}

// Update tech detail panel
function updateTechDetailPanel(techId) {
    const tech = gameState.techTree[techId];
    if (!tech) return;
    
    // Get the new panel elements
    const nameElement = document.getElementById("tech-info-name");
    const descElement = document.getElementById("tech-info-desc");
    const statusElement = document.getElementById("tech-status-value");
    const effectsElement = document.getElementById("tech-effects-text");
    const costElement = document.getElementById("tech-cost-text");
    const requirementsElement = document.getElementById("tech-requirements-text");
    const actionButton = document.getElementById("tech-action-button");
    const detailsElement = document.getElementById("tech-info-details");
    
    if (!nameElement || !descElement || !statusElement || !effectsElement || 
        !costElement || !requirementsElement || !actionButton || !detailsElement) {
        console.error("DEBUG: Tech info panel elements not found!");
        return;
    }
    
    // Show the details section
    detailsElement.style.display = "block";
    
    // Set name and description
    nameElement.textContent = tech.name;
    descElement.textContent = tech.effectDesc;
    
    // Set status
    let statusText, statusClass;
    if (tech.completed) {
        statusText = "Researched";
        statusClass = "completed";
    } else {
        // Check requirements
        let prereqsMet = true;
        if (tech.requires && tech.requires.length > 0) {
            for (const reqId of tech.requires) {
                if (!gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                    prereqsMet = false;
                    break;
                }
            }
        }
        
        if (prereqsMet) {
            statusText = "Available";
            statusClass = "available";
        } else {
            statusText = "Locked";
            statusClass = "locked";
        }
    }
    statusElement.textContent = statusText;
    statusElement.className = statusClass;
    
    // Set effects
    let effectString = tech.effectDesc;
    if (tech.unlocksBoost) {
        const boost = gameState.baseProductionBoosts[tech.unlocksBoost];
        if (boost) {
            effectString += ` Unlocks ${boost.name}.`;
        }
    }
    if (tech.unlocksItem) {
        const item = gameState.items[tech.unlocksItem];
        if (item) {
            effectString += ` Unlocks ${item.name}.`;
        }
    }
    if (tech.effect) {
        for (const effectKey in tech.effect) {
            if (effectKey.endsWith("RateBonus")) {
                effectString += ` +${(tech.effect[effectKey] * 100).toFixed(0)}% ${effectKey.replace("RateBonus", "")} Rate.`;
            } else if (effectKey === "mindControlResistance") {
                effectString += ` ${(tech.effect[effectKey] * 100).toFixed(0)}% Mind Control Resistance.`;
            } else if (effectKey === "mindControlReduction") {
                effectString += ` ${(tech.effect[effectKey] * 100).toFixed(0)}% Mind Control Counter Reduction.`;
            } else if (effectKey === "allResourcesBonus") {
                effectString += ` +${(tech.effect[effectKey] * 100).toFixed(0)}% to All Resource Rates.`;
            }
        }
    }
    effectsElement.textContent = effectString;
    
    // Set cost
    let costString = "";
    if (tech.cost) {
        const costs = [];
        for (const resource in tech.cost) {
            costs.push(`${formatNumber(tech.cost[resource])} ${resource}`);
        }
        costString = costs.join(", ");
    }
    costElement.textContent = costString || "None";
    
    // Set requirements
    if (tech.requires && tech.requires.length > 0) {
        const reqs = tech.requires.map(reqId => {
            const reqTech = gameState.techTree[reqId];
            if (reqTech) {
                const status = reqTech.completed ? " (Completed)" : " (Incomplete)";
                return reqTech.name + status;
            }
            return reqId;
        });
        requirementsElement.textContent = reqs.join(", ");
    } else {
        requirementsElement.textContent = "None";
    }
    
    // Set button state
    let isAvailable = true;
    if (tech.requires && tech.requires.length > 0) {
        for (const reqId of tech.requires) {
            if (!gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                isAvailable = false;
                break;
            }
        }
    }
    
    let canAfford = true;
    for (const resource in tech.cost) {
        if (gameState.resources[resource] < tech.cost[resource]) {
            canAfford = false;
            break;
        }
    }
    
    actionButton.disabled = !isAvailable || !canAfford || tech.completed;
    if (tech.completed) {
        actionButton.textContent = "Researched";
    } else if (!isAvailable) {
        actionButton.textContent = "Prerequisites Not Met";
    } else if (!canAfford) {
        actionButton.textContent = "Insufficient Resources";
    } else {
        actionButton.textContent = "Research Technology";
    }
    
    // Store the selected tech ID
    window.selectedTechId = techId;
}

// Research selected tech
function researchSelectedTech() {
    const techId = window.selectedTechId;
    if (techId && gameState.techTree[techId]) {
        researchTech(techId);
    }
}
window.researchSelectedTech = researchSelectedTech;

// Update Territories display with interactive map
function updateTerritoriesDisplay() {
    console.log("DEBUG: updateTerritoriesDisplay called.");
    const cityMap = document.querySelector(".city-map");
    if (!cityMap) {
        console.error("DEBUG: city-map element not found!");
        return;
    }
    
    // Define territory positions on the map - adjusted to align with the background map
    const territoryPositions = {
        downtown: { x: 50, y: 45, icon: "🏙️" },
        industrialZone: { x: 25, y: 80, icon: "🏭" },
        techDistrict: { x: 65, y: 30, icon: "💻" },
        harborArea: { x: 38, y: 70, icon: "🚢" },
        livingTowers: { x: 32, y: 50, icon: "🏢" },
        governmentQuarter: { x: 50, y: 5, icon: "🏛️" },
        muskersTerritory: { x: 70, y: 40, icon: "🚀" },
        cryptidsDomain: { x: 50, y: 85, icon: "👾" },
        shillzCentral: { x: 45, y: 25, icon: "📢" },
        mechRebelsBase: { x: 20, y: 60, icon: "🤖" },
        hackersDen: { x: 70, y: 70, icon: "🕸️" },
        revolutionaryHub: { x: 30, y: 30, icon: "✊" },
        abandonedSector: { x: 15, y: 85, icon: "🏚️" },
        aiLabs: { x: 75, y: 15, icon: "🧠" },
        gigaCorpHQ: { x: 70, y: 10, icon: "🏢" }
    };
    
    // Define territory connections (links between territories)
    const territoryConnections = [
        { from: "downtown", to: "industrialZone" },
        { from: "downtown", to: "harborArea" },
        { from: "downtown", to: "livingTowers" },
        { from: "downtown", to: "governmentQuarter" },
        { from: "industrialZone", to: "techDistrict" },
        { from: "industrialZone", to: "abandonedSector" },
        { from: "industrialZone", to: "hackersDen" },
        { from: "industrialZone", to: "mechRebelsBase" },
        { from: "techDistrict", to: "muskersTerritory" },
        { from: "techDistrict", to: "governmentQuarter" },
        { from: "harborArea", to: "livingTowers" },
        { from: "harborArea", to: "cryptidsDomain" },
        { from: "livingTowers", to: "shillzCentral" },
        { from: "livingTowers", to: "cryptidsDomain" },
        { from: "governmentQuarter", to: "shillzCentral" },
        { from: "governmentQuarter", to: "hackersDen" },
        { from: "muskersTerritory", to: "aiLabs" },
        { from: "muskersTerritory", to: "mechRebelsBase" },
        { from: "cryptidsDomain", to: "mechRebelsBase" },
        { from: "shillzCentral", to: "revolutionaryHub" },
        { from: "hackersDen", to: "revolutionaryHub" },
        { from: "hackersDen", to: "aiLabs" },
        { from: "revolutionaryHub", to: "gigaCorpHQ" },
        { from: "mechRebelsBase", to: "gigaCorpHQ" },
        { from: "aiLabs", to: "gigaCorpHQ" }
    ];
    
    // Clear the map
    cityMap.innerHTML = "";
    
    if (!gameState || !gameState.territories) {
        console.error("DEBUG: gameState.territories is missing or invalid!");
        return;
    }
    
    // Log faction standings and territory ownership for debugging
    console.log("DEBUG: Current faction standings:", gameState.factionStanding);
    console.log("DEBUG: Territory ownership:");
    for (const territoryId in gameState.territories) {
        const owner = gameState.territories[territoryId].owner || "None";
        console.log(`- ${territoryId}: ${owner}`);
    }
    
    // Draw connections first (so they appear under the territory nodes)
    territoryConnections.forEach(connection => {
        const fromTerritory = gameState.territories[connection.from];
        const toTerritory = gameState.territories[connection.to];
        
        // Only draw connections to territories that exist
        if (fromTerritory && toTerritory && territoryPositions[connection.from] && territoryPositions[connection.to]) {
            const fromPos = territoryPositions[connection.from];
            const toPos = territoryPositions[connection.to];
            
            // Calculate connection properties
            const dx = (toPos.x - fromPos.x) * cityMap.offsetWidth / 100;
            const dy = (toPos.y - fromPos.y) * cityMap.offsetHeight / 100;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // Create connection element
            const connectionElement = document.createElement("div");
            connectionElement.classList.add("territory-connection");
            
            // Add classes based on status
            if (fromTerritory.unlocked && toTerritory.unlocked) {
                connectionElement.classList.add("unlocked");
                
                if (fromTerritory.active && toTerritory.active) {
                    connectionElement.classList.add("active");
                }
            }
            
            // Position and rotate connection
            connectionElement.style.left = `${fromPos.x}%`;
            connectionElement.style.top = `${fromPos.y}%`;
            connectionElement.style.width = `${distance}px`;
            connectionElement.style.transform = `rotate(${angle}deg)`;
            
            cityMap.appendChild(connectionElement);
        }
    });
    
    // Draw territory locations
    let selectedTerritoryId = null;
    
    for (const territoryId in gameState.territories) {
        const territory = gameState.territories[territoryId];
        const position = territoryPositions[territoryId];
        
        // Skip if position not defined
        if (!position) continue;
        
        // Always display all territories, but with different styles based on status
        
        // Create territory element
        const territoryElement = document.createElement("div");
        territoryElement.classList.add("territory-location");
        territoryElement.id = `territory-${territoryId}`;
        
        // Add class based on status
        if (territory.unlocked) {
            territoryElement.classList.add(territory.active ? "active" : "unlocked");
        } else {
            // Check prerequisites for unlocking
            let prereqsMet = true;
            if (territory.requires && territory.requires.length > 0) {
                for (const reqId of territory.requires) {
                    if (!gameState.territories[reqId] || !gameState.territories[reqId].unlocked) {
                        prereqsMet = false;
                        break;
                    }
                }
            }
            territoryElement.classList.add(prereqsMet ? "unlockable" : "locked");
        }
        
        // Add class based on faction ownership and relationship
        if (territory.owner) {
            if (territory.owner === "Player") {
                territoryElement.classList.add("player-controlled");
            } else if (gameState.factionStanding && gameState.factionStanding[territory.owner] > 0) {
                territoryElement.classList.add("ally-controlled");
            } else if (gameState.factionStanding && gameState.factionStanding[territory.owner] < 0) {
                territoryElement.classList.add("enemy-controlled");
            } else {
                territoryElement.classList.add("neutral-controlled");
            }
            
            // Add owner name as a data attribute for tooltips
            territoryElement.dataset.owner = territory.owner;
        }
        
        // Position element
        territoryElement.style.left = `${position.x}%`;
        territoryElement.style.top = `${position.y}%`;
        
        // Add icon
        const iconElement = document.createElement("div");
        iconElement.classList.add("territory-location-icon");
        iconElement.textContent = position.icon;
        iconElement.style.fontSize = "24px"; // Make icons larger
        territoryElement.appendChild(iconElement);
        
        // Add name label
        const nameElement = document.createElement("div");
        nameElement.classList.add("territory-location-name");
        nameElement.textContent = territory.name;
        
        // Add owner indicator if the territory has an owner
        if (territory.owner) {
            nameElement.innerHTML = `${territory.name}<span class="territory-owner"> (${territory.owner})</span>`;
        }
        
        territoryElement.appendChild(nameElement);
        
        // Add click event
        territoryElement.addEventListener("click", () => {
            // Deselect previously selected territory
            const previousSelection = document.querySelector(".territory-location.selected");
            if (previousSelection) {
                previousSelection.classList.remove("selected");
            }
            
            // Select current territory
            territoryElement.classList.add("selected");
            selectedTerritoryId = territoryId;
            
            // Update territory info panel
            updateTerritoryInfoPanel(territoryId);
        });
        
        cityMap.appendChild(territoryElement);
    }
    
    // Update territory info panel if a territory is already selected
    if (selectedTerritoryId) {
        updateTerritoryInfoPanel(selectedTerritoryId);
    }
}

// Helper function to update the territory info panel
function updateTerritoryInfoPanel(territoryId) {
    const territory = gameState.territories[territoryId];
    if (!territory) return;
    
    // Update territory name
    const nameElement = document.getElementById("territory-info-name");
    if (nameElement) {
        nameElement.textContent = territory.name || 'Unknown Territory';
    }
    
    // Update territory description
    const descElement = document.getElementById("territory-info-desc");
    if (descElement) {
        descElement.textContent = territory.effectDesc || 'No description available.';
    }
    
    // Show details
    const detailsElement = document.getElementById("territory-info-details");
    if (detailsElement) {
        detailsElement.style.display = "block";
    }
    
    // Update status
    const statusValueElement = document.getElementById("territory-status-value");
    if (statusValueElement) {
        // Check prerequisites for unlocking
        let prereqsMet = true;
        if (territory.requires && territory.requires.length > 0) {
            for (const reqId of territory.requires) {
                if (!gameState.territories[reqId] || !gameState.territories[reqId].unlocked) {
                    prereqsMet = false;
                    break;
                }
            }
        }
        
        let statusText, statusClass;
        if (territory.unlocked) {
            statusText = territory.active ? "Active" : "Inactive";
            statusClass = territory.active ? "active" : "unlocked";
        } else {
            statusText = prereqsMet ? "Available to Capture" : "Locked";
            statusClass = prereqsMet ? "unlockable" : "locked";
        }
        
        statusValueElement.textContent = statusText;
        statusValueElement.className = statusClass;
    }
    
    // Add faction ownership information
    const factionControlElement = document.getElementById("territory-control");
    if (factionControlElement) {
        if (territory.owner) {
            // Determine relationship with the owner faction
            let relationshipClass = "";
            
            if (territory.owner === "Player") {
                relationshipClass = "player-controlled";
            } else if (gameState.factionStanding && gameState.factionStanding[territory.owner] > 0) {
                relationshipClass = "ally-controlled";
            } else if (gameState.factionStanding && gameState.factionStanding[territory.owner] < 0) {
                relationshipClass = "enemy-controlled";
            } else {
                relationshipClass = "neutral-controlled";
            }
            
            factionControlElement.innerHTML = `<span class="${relationshipClass}">Controlled by: ${territory.owner}</span>`;
            // Add relationship status if applicable
            if (territory.owner !== "Player" && gameState.factionStanding) {
                const standing = gameState.factionStanding[territory.owner] || 0;
                let relationshipType = "Neutral";
                if (standing > 30) relationshipType = "Strong Ally";
                else if (standing > 0) relationshipType = "Ally";
                else if (standing < -30) relationshipType = "Enemy";
                else if (standing < 0) relationshipType = "Rival";
                
                factionControlElement.innerHTML += ` <span class="faction-standing">(${relationshipType}, Standing: ${standing})</span>`;
            }
        } else {
            factionControlElement.innerHTML = "Uncontrolled";
        }
    }
    
    // Update effects
    const effectsTextElement = document.getElementById("territory-effects-text");
    if (effectsTextElement) {
        let effectsText = "";
        if (territory.effect && typeof territory.effect === 'object') {
            const effects = [];
            for (const effectKey in territory.effect) {
                if (effectKey.endsWith("RateBonus")) {
                    effects.push(`${territory.effect[effectKey] > 0 ? '+' : ''}${(territory.effect[effectKey] * 100).toFixed(0)}% ${effectKey.replace("RateBonus", "")} Rate`);
                } else {
                    effects.push(`${effectKey}: ${territory.effect[effectKey]}`);
                }
            }
            effectsText = effects.join("<br>");
        }
        
        effectsTextElement.innerHTML = effectsText || "No effects";
    }
    
    // Update cost
    const costElement = document.getElementById("territory-cost");
    const costTextElement = document.getElementById("territory-cost-text");
    if (costElement && costTextElement) {
        if (!territory.unlocked) {
            costElement.style.display = "block";
            
            let costText = "";
            if (territory.cost && typeof territory.cost === 'object') {
                const costs = [];
                for (const resource in territory.cost) {
                    costs.push(`${formatNumber(territory.cost[resource])} ${resource}`);
                }
                costText = costs.join(", ");
            }
            
            costTextElement.textContent = costText || "No cost";
        } else {
            costElement.style.display = "none";
        }
    }
    
    // Update action button
    const actionButton = document.getElementById("territory-action-button");
    if (actionButton) {
        // Check prerequisites for unlocking
        let prereqsMet = true;
        if (territory.requires && territory.requires.length > 0) {
            for (const reqId of territory.requires) {
                if (!gameState.territories[reqId] || !gameState.territories[reqId].unlocked) {
                    prereqsMet = false;
                    break;
                }
            }
        }
        
        // Check if player can afford to unlock
        let canAfford = true;
        if (!territory.unlocked && territory.cost) {
            for (const resource in territory.cost) {
                if (gameState.resources[resource] < territory.cost[resource]) {
                    canAfford = false;
                    break;
                }
            }
        }
        
        // Set button state based on territory status
        if (territory.unlocked) {
            // Territory is unlocked, show activate/deactivate button
            actionButton.textContent = territory.active ? "Deactivate" : "Activate";
            actionButton.className = "territory-button " + (territory.active ? "deactivate" : "activate");
            actionButton.disabled = false;
            actionButton.onclick = () => {
                activateTerritory(territoryId);
                updateTerritoriesDisplay();
            };
        } else if (prereqsMet) {
            // Territory is unlockable, show unlock button
            actionButton.textContent = "Capture Territory";
            actionButton.className = "territory-button unlock";
            actionButton.disabled = !canAfford;
            actionButton.onclick = () => {
                captureTerritory(territoryId);
                updateTerritoriesDisplay();
            };
        } else {
            // Territory is locked, show disabled button
            actionButton.textContent = "Prerequisites Not Met";
            actionButton.className = "territory-button";
            actionButton.disabled = true;
        }
    }
}

// Update Achievements display
function updateAchievementsDisplay() {
    const achievementsList = document.getElementById("achievements-list");
    if (!achievementsList) {
        console.error("DEBUG: achievements-list element not found!"); // ADDED
        return;
    }
    achievementsList.innerHTML = ""; // Clear previous content

    if (!gameState || !gameState.progression || !gameState.progression.achievements) { // ADDED CHECK
        console.error("DEBUG: gameState.progression.achievements is missing or invalid!");
        return;
    }

    try { // Added try-catch
        for (const achievementId in gameState.progression.achievements) {
            const achievement = gameState.progression.achievements[achievementId];
            if (achievement && achievement.achieved) { // Added check
                const achievementElement = document.createElement("div");
                achievementElement.classList.add("achievement-item", "achieved");
                achievementElement.innerHTML = `
                    <div class="achievement-name">${achievement.name || 'Unnamed Achievement'}</div>
                    <div class="achievement-desc">${achievement.desc || ''}</div>
                `;
                achievementsList.appendChild(achievementElement);
            }
            // Optionally display locked achievements differently
        }
    } catch (error) {
        console.error("Error processing achievements:", error); // Added error logging
    }
}

// Function to update all display elements in the game
function updateAllDisplays() {
    console.log("Updating all displays...");
    try {
        // Update all resources and displays
        updateResourceDisplay();
        updateBoostsDisplay();
        updateItemsDisplay();
        updateTechTreeDisplay();
        updateTerritoriesDisplay();
        updateMissionsDisplay();
        updateAchievementsDisplay();
        updatePrestigeButton();
        updateClickMultiplierDisplay();
        updateButtonStates();
        
        console.log("All displays updated successfully");
    } catch (error) {
        console.error("Error updating displays:", error);
    }
}

// Function to update the click multiplier button display
function updateClickMultiplierDisplay() {
    const clickMultiplierButton = document.getElementById("click-multiplier-button");
    if (clickMultiplierButton) {
        clickMultiplierButton.textContent = `Clicks: ${gameState.clickMultiplier}x`;
        
        // Add tooltip explaining what the multiplier affects
        clickMultiplierButton.title = `Click multiplier (${gameState.clickMultiplier}x) affects:
- Operations Panel actions (Collect Tech Points, Generate Energy)
- Purchasing boosts (buy multiple levels at once)
- Constructing items (build multiple items at once)
Click to cycle through multiplier values: 1x → 5x → 10x → 100x → MAX → 1x`;
    }
}

// --- Game Loop and Saving ---

// Create a dedicated function to update the followers display
function updateFollowersDisplay() {
    const followersValue = document.getElementById("followers-value");
    if (followersValue) {
        // Add a visual indicator by briefly changing the color
        followersValue.classList.add('resource-updated');
        
        // Set the value - make sure to floor the value for integer display
        const followerCount = Math.floor(gameState.resources.followers);
        followersValue.textContent = followerCount;
        
        // Log the update for debugging
        console.log(`Followers display updated: ${followerCount}`);
        
        // Remove the visual indicator after a short delay
        setTimeout(() => {
            followersValue.classList.remove('resource-updated');
        }, 300);
    } else {
        console.error("Followers value element not found in DOM");
    }
}

// Main game loop (runs every second)
function gameLoop() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000; // Time difference in seconds

    // Store previous follower count to check if it changed
    const previousFollowers = Math.floor(gameState.resources.followers);

    updateRates(); // Recalculate rates based on current boosts, items, tech, territories

    // Generate resources based on rates
    for (const resource in gameState.rates) {
        if (gameState.resources.hasOwnProperty(resource)) {
            gameState.resources[resource] += gameState.rates[resource] * delta;
        }
    }
    
    // Round followers to integers
    gameState.resources.followers = Math.floor(gameState.resources.followers);
    
    // ALWAYS force update followers on every game tick
    forceUpdateFollowers();
    
    // Calculate rebellion strength from other resources
    updateRebellionStrength();

    // Check for mission completion
    if (gameState.missions && gameState.missions.activeMission && gameState.missions.missionStartTime) {
        const mission = gameState.missions.availableMissions[gameState.missions.activeMission];
        if (mission) { // Check if mission exists before accessing duration
            const elapsedTime = (now - gameState.missions.missionStartTime) / 1000;
            if (elapsedTime >= mission.duration) {
                completeMission(gameState.missions.activeMission);
            } else {
                // Update mission progress display less frequently if performance is an issue
                if (Date.now() % 1000 < 100) { // Update roughly once per second
                    updateMissionsDisplay();
                }
            }
        } else {
            console.error(`Invalid active mission ID: ${gameState.missions.activeMission}`);
            gameState.missions.activeMission = null;
            gameState.missions.missionStartTime = null;
        }
    }

    // Run the AI Director if it exists
    if (window.aiDirector && typeof window.aiDirector.tick === 'function') {
        window.aiDirector.tick(gameState);
        
        // Update AI Director debug panel if visible
        const directorDebugPanel = document.getElementById('ai-director-debug');
        if (directorDebugPanel && directorDebugPanel.style.display === 'block' && 
            window.aiDirector.updateDebugPanel) {
            window.aiDirector.updateDebugPanel();
        }
    }

    // Update UI - always refresh resource display to ensure followers update properly
    updateResourceDisplay(); // Refresh basic resources
    updateButtonStates(); // Update button disabled states

    // Check for progression triggers
    if (typeof checkProgressionTriggers === 'function') {
        try {
            checkProgressionTriggers();
        } catch (error) {
            console.warn("Error in progression system:", error);
        }
    }

    // Call save game periodically (every 30 seconds)
    if (now % 30000 < 1000) {
        saveGame();
    }

    gameState.lastUpdate = now;
    
    // Request next animation frame
    setTimeout(gameLoop, 1000); // Run approximately every second
}

// Calculate rebellion strength based on other resources
function updateRebellionStrength() {
    // Count captured territories (unlocked and active)
    let capturedTerritories = 0;
    for (const territoryId in gameState.territories) {
        if (gameState.territories[territoryId].unlocked && gameState.territories[territoryId].active) {
            capturedTerritories++;
        }
    }
    
    // Ensure we don't divide by zero later
    if (capturedTerritories === 0) capturedTerritories = 0.1;
    
    // Get followers count
    const followers = gameState.resources.followers || 0;
    
    // Calculate Rebellion Strength based on formula: Followers x Territories
    const rebellionPower = followers * capturedTerritories;
    
    // Apply multipliers from other sources (techs, items, etc.)
    gameState.resources.rebellionStrength = rebellionPower;
    
    // Add small minimum value to ensure progress is possible
    if (gameState.resources.rebellionStrength < 5) {
        gameState.resources.rebellionStrength = 5;
    }
    
    // Update rebellion strength tooltip to explain calculation
    const rebellionElement = document.getElementById("rebellionStrength-value");
    if (rebellionElement) {
        rebellionElement.title = `Calculated as: ${Math.floor(followers)} Followers × ${capturedTerritories} Territories = ${Math.floor(rebellionPower)} Strength`;
    }
    
    // If mind control is active, it slowly increases over time
    if (gameState.resources.influence > 50 && gameState.resources.techPoints > 100) {
        // Game balance: Mind control slowly increases as you gather influence and tech
        gameState.resources.mindControlCounter += 0.02;
    }
}

// --- Developer Console ---
function handleDevCommand(commandString) {
    const parts = commandString.trim().toLowerCase().split(" ");
    const command = parts[0];
    const subCommand = parts[1];
    const param = parts[2];

    if (command === "add" && subCommand && !isNaN(param) && param > 0) {
        let targetResource = null;
        // Find the resource key in gameState.resources matching the input name
        for (const key in gameState.resources) {
            if (key.toLowerCase() === subCommand) {
                targetResource = key;
                break;
            }
        }

        if (targetResource) {
            gameState.resources[targetResource] += parseFloat(param);
            addLogMessage(`DEV: Added ${param} ${targetResource}.`);
            updateResourceDisplay(); // Update UI immediately
        } else {
            addLogMessage(`DEV Error: Unknown resource name '${subCommand}'. Valid: credits, followers, influence, techpoints, energy, rebellionstrength, gigatech, mindcontrolcounter`);
        }
    } else if (command === "turing" && subCommand) {
        // Command to test Turing dialogues
        const dialogueId = "turing_" + subCommand;
        if (dialogues[dialogueId]) {
            showDialogue(dialogueId);
            addLogMessage(`DEV: Showing Turing dialogue '${dialogueId}'.`);
        } else {
            addLogMessage(`DEV Error: Unknown Turing dialogue '${dialogueId}'.`);
            addLogMessage(`Valid options: introduction, rebellion_growing, territory_expansion, attack_ready, after_failure, after_success`);
        }
    } else if (command === "help") {
         addLogMessage("DEV Commands:");
         addLogMessage("  add <resource> <amount> - Add resources");
         addLogMessage("  set <resource> <amount> - Set resource value");
         addLogMessage("  unlock <type> - Unlock items (alltech, allterritories)");
         addLogMessage("  reset save - Clear save data");
         addLogMessage("  debug director - Show AI Director debug panel");
    } else {
        addLogMessage(`DEV Error: Invalid command format. Use 'help' for available commands.`);
    }
}

// Expose functions needed by HTML onclick handlers to the global scope
window.mineCredits = mineCredits;
window.collectTechPoints = collectTechPoints;
window.generateEnergy = generateEnergy;
window.buyBoost = buyBoost;
window.buyItem = buyItem;
window.researchTech = researchTech;
window.captureTerritory = captureTerritory;
window.activateTerritory = activateTerritory;
window.switchTab = switchTab;
window.toggleAchievements = toggleAchievements;
window.handleDevCommand = handleDevCommand; // If needed globally, though listener is preferred
window.cycleClickMultiplier = cycleClickMultiplier;




// --- Turing Upgrade System ---
function upgradeTuring() {
    const currentLevel = gameState.turingLevel || 1;
    const nextLevel = currentLevel + 1;
    
    // Calculate upgrade cost (increases with level)
    const baseCost = { techPoints: 100, energy: 50, credits: 500 };
    const cost = {};
    for (const resource in baseCost) {
        cost[resource] = baseCost[resource] * Math.pow(1.5, currentLevel - 1);
    }
    
    // Format cost for display
    let costString = "";
    for (const resource in cost) {
        costString += `${Math.floor(cost[resource])} ${resource}, `;
    }
    costString = costString.slice(0, -2); // Remove trailing comma and space
    
    // Check if player can afford upgrade
    let canAfford = true;
    for (const resource in cost) {
        if (gameState.resources[resource] < cost[resource]) {
            canAfford = false;
            break;
        }
    }
    
    if (!canAfford) {
        addLogMessage(`Insufficient resources to upgrade Turing to Level ${nextLevel}. Requires: ${costString}`);
        return false;
    }
    
    // Deduct resources
    for (const resource in cost) {
        gameState.resources[resource] -= cost[resource];
    }
    
    // Upgrade Turing
    gameState.turingLevel = nextLevel;
    addLogMessage(`Turing upgraded to Level ${nextLevel}!`);
    
    // Show upgrade dialogue if it exists
    if (dialogues["turing_upgrade"]) {
        showDialogue("turing_upgrade");
    }
    
    // Update UI
    updateResourceDisplay();
    
    return true;
}

// Add to window scope for UI
window.upgradeTuring = upgradeTuring;

// --- Mission Functions (Added Incrementally) ---

// Helper function to format resource lists (cost/reward)
// Ensure formatNumber exists or define it
function formatNumber(number) {
    // Check if number is valid, default to 0 if not
    if (isNaN(number) || number === null) {
        number = 0;
    }
    if (number < 1000) return number.toFixed(1);
    if (number < 1000000) return (number / 1000).toFixed(1) + "K";
    if (number < 1000000000) return (number / 1000000).toFixed(1) + "M";
    return (number / 1000000000).toFixed(1) + "B";
}

function formatResourceList(resources) {
    const parts = [];
    if (resources) { // Check if resources object exists
        for (const resource in resources) {
            parts.push(`${formatNumber(resources[resource])} ${resource}`);
        }
    }
    return parts.join(", ") || "None";
}

// Helper function to format time (seconds into MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startMission(missionId) {
    console.log(`DEBUG: Attempting to start mission: ${missionId}`);
    if (!gameState || !gameState.missions) {
        console.error("DEBUG: gameState or gameState.missions is not defined!");
        return;
    }

    if (gameState.missions.activeMission) {
        addLogMessage("Cannot start a new mission while another is in progress.");
        return;
    }

    const mission = gameState.missions.availableMissions[missionId];
    if (!mission) {
        addLogMessage(`Mission with ID ${missionId} not found.`);
        console.error(`DEBUG: Mission not found: ${missionId}`);
        return;
    }
    if (!mission.unlocked) {
         addLogMessage("Mission not available or locked.");
         return;
    }

    // Check prerequisites (e.g., tech)
    let prereqsMet = true;
    if (mission.requiresTech && mission.requiresTech.length > 0) {
        for (const reqId of mission.requiresTech) {
            if (!gameState.techTree || !gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                prereqsMet = false;
                addLogMessage(`Requires Tech: ${gameState.techTree[reqId]?.name || reqId}`);
                break;
            }
        }
    }
    // Add checks for other prerequisites like items if needed

    if (!prereqsMet) {
        addLogMessage(`Prerequisites not met for mission: ${mission.name}.`);
        return;
    }

    // Check cost
    const cost = mission.cost;
    let canAfford = true;
    if (cost) { // Check if cost object exists
        for (const resource in cost) {
            if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < cost[resource]) {
                canAfford = false;
                break;
            }
        }
    } else {
        console.warn(`DEBUG: Mission ${missionId} has no cost defined.`);
    }

    if (canAfford) {
        // Deduct cost
        if (cost) {
            for (const resource in cost) {
                gameState.resources[resource] -= cost[resource];
            }
        }

        // Start mission
        gameState.missions.activeMission = missionId;
        gameState.missions.missionStartTime = Date.now();
        addLogMessage(`Mission started: ${mission.name}.`);
        playSound("sounds/click.wav"); // Consider a different sound for missions

        updateResourceDisplay();
        updateMissionsDisplay(); // Refresh mission display to show progress
        updateButtonStates(); // Update button states immediately
    } else {
        addLogMessage(`Insufficient resources to start mission: ${mission.name}. Cost: ${formatResourceList(cost)}`);
    }
}
window.startMission = startMission; // Expose to global scope for onclick

function completeMission(missionId) {
    console.log(`DEBUG: Completing mission: ${missionId}`);
    if (!gameState || !gameState.missions) {
        console.error("DEBUG: gameState or gameState.missions is not defined!");
        return;
    }

    const mission = gameState.missions.availableMissions[missionId];
    if (!mission) {
        console.error(`DEBUG: Mission ${missionId} not found during completion.`);
        // Clear potentially stuck active mission state
        gameState.missions.activeMission = null;
        gameState.missions.missionStartTime = null;
        updateMissionsDisplay();
        return;
    }

    // Grant rewards
    let rewardMessage = "Mission completed: " + mission.name + ". Rewards: ";
    const rewardsGained = [];
    if (mission.reward) { // Check if reward object exists
        for (const resource in mission.reward) {
            if (gameState.resources[resource] !== undefined) {
                gameState.resources[resource] += mission.reward[resource];
                rewardsGained.push(`${formatNumber(mission.reward[resource])} ${resource}`);
            } else {
                console.warn(`DEBUG: Unknown resource ${resource} in reward for mission ${missionId}`);
            }
        }
    } else {
        console.warn(`DEBUG: Mission ${missionId} has no reward defined.`);
    }
    rewardMessage += rewardsGained.join(", ") || "None";
    addLogMessage(rewardMessage);

    // Clear active mission
    gameState.missions.activeMission = null;
    gameState.missions.missionStartTime = null;

    // Update UI
    updateResourceDisplay();
    updateMissionsDisplay(); // Refresh mission display
    updateButtonStates(); // Update button states immediately
    // Potentially trigger other events or unlock next missions
}

function updateMissionsDisplay() {
    // console.log("DEBUG: updateMissionsDisplay called."); // Reduce log spam
    const missionsList = document.getElementById("missions-list");
    if (!missionsList) {
        // console.error("DEBUG: missions-list element not found!"); // Reduce log spam
        return; // Don't proceed if the element isn't there
    }
    if (!gameState || !gameState.missions) {
        // console.error("DEBUG: gameState or missions not ready for display."); // Reduce log spam
        missionsList.innerHTML = "<p>Loading missions...</p>";
        return;
    }

    missionsList.innerHTML = ""; // Clear previous list

    const activeMissionId = gameState.missions.activeMission;
    const missionStartTime = gameState.missions.missionStartTime;

    // Display active mission progress first
    if (activeMissionId && missionStartTime && gameState.missions.availableMissions && gameState.missions.availableMissions[activeMissionId]) {
        const mission = gameState.missions.availableMissions[activeMissionId];
        const elapsedTime = (Date.now() - missionStartTime) / 1000; // in seconds
        const remainingTime = Math.max(0, mission.duration - elapsedTime);
        const progressPercent = Math.min(100, (elapsedTime / mission.duration) * 100);

        const missionDiv = document.createElement("div");
        missionDiv.className = "mission-item mission-in-progress";
        missionDiv.innerHTML = `
            <h4>${mission.name} (In Progress)</h4>
            <p>${mission.desc}</p>
            <div class="mission-progress-bar-container">
                <div class="mission-progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
            <p>Time Remaining: ${formatTime(remainingTime)}</p>
            <p>Rewards: ${formatResourceList(mission.reward)}</p>
        `;
        missionsList.appendChild(missionDiv);
        missionsList.appendChild(document.createElement("hr")); // Separator
    }

    // Display available missions
    if (gameState.missions.availableMissions) {
        for (const missionId in gameState.missions.availableMissions) {
            const mission = gameState.missions.availableMissions[missionId];

            // Unlock mission if requirements met (e.g., tech)
            // This check should ideally happen less frequently, maybe on tech completion?
            let prereqsMet = true;
            if (mission.requiresTech && mission.requiresTech.length > 0) {
                for (const reqId of mission.requiresTech) {
                    if (!gameState.techTree || !gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                        prereqsMet = false;
                        break;
                    }
                }
            }
            if (prereqsMet) {
                mission.unlocked = true; // Unlock if not already
            }

            if (!mission.unlocked) continue; // Skip locked missions
            if (missionId === activeMissionId) continue; // Skip the active one, already displayed

            const missionDiv = document.createElement("div");
            missionDiv.className = "mission-item";

            // Check affordability
            let canAfford = true;
            if (mission.cost) {
                for (const resource in mission.cost) {
                    if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < mission.cost[resource]) {
                        canAfford = false;
                        break;
                    }
                }
            }

            missionDiv.innerHTML = `
                <h4>${mission.name}</h4>
                <p>${mission.desc}</p>
                <p>Cost: ${formatResourceList(mission.cost)}</p>
                <p>Duration: ${formatTime(mission.duration)}</p>
                <p>Rewards: ${formatResourceList(mission.reward)}</p>
                <button class="neon-button mission-button" onclick="startMission('${missionId}')" ${!canAfford || activeMissionId ? 'disabled' : ''}>
                    ${activeMissionId ? 'Mission in Progress' : (canAfford ? 'Start Mission' : 'Insufficient Resources')}
                </button>
            `;
            missionsList.appendChild(missionDiv);
        }
    } else {
        missionsList.innerHTML = "<p>No missions available.</p>";
    }
}

// --- Integrate into existing functions ---

// Using main updateAllDisplays function from line ~2404
// No duplicate needed here

// Modify or Add updateButtonStates to include missions
function updateButtonStates() {
    // Defensive check - don't continue if DOM elements aren't available yet
    if (!document.getElementById('boosts-list')) {
        return;
    }

    // Update Boost buttons
    const boostButtons = document.querySelectorAll('#boosts-list button[onclick^="buyBoost"]');
    boostButtons.forEach(button => {
        try {
            const boostId = button.getAttribute('onclick').match(/buyBoost\('([^']+)'\)/)[1];
            const boost = gameState.baseProductionBoosts[boostId];
            if (!boost) return;
            
            // Calculate cost manually if calculateCost isn't working
            const cost = {};
            for (const resource in boost.baseCost) {
                cost[resource] = boost.baseCost[resource] * Math.pow(boost.costMultiplier || 1, boost.level || 0);
            }
            
            let canAfford = true;
            for (const resource in cost) {
                if (gameState.resources[resource] < cost[resource]) {
                    canAfford = false;
                    break;
                }
            }
            button.disabled = !canAfford;
            button.textContent = canAfford ? `Upgrade` : `Insufficient Resources`;
        } catch (e) { console.error("Error updating boost button state:", e); }
    });

    // Update Item buttons
    const itemButtons = document.querySelectorAll('#items-list button[onclick^="buyItem"]');
    itemButtons.forEach(button => {
        try {
            const itemId = button.getAttribute('onclick').match(/buyItem\('([^']+)'\)/)[1];
            const item = gameState.items[itemId];
            if (!item) return;
            
            // Calculate cost manually
            const cost = {};
            for (const resource in item.baseCost) {
                cost[resource] = item.baseCost[resource] * Math.pow(item.costMultiplier || 1, item.count || 0);
            }
            
            let canAfford = true;
            for (const resource in cost) {
                if (gameState.resources[resource] < cost[resource]) {
                    canAfford = false;
                    break;
                }
            }
            const atMax = item.max !== undefined && item.count >= item.max;
            button.disabled = !canAfford || atMax;
            if (atMax) {
                button.textContent = "Max Reached";
            } else {
                button.textContent = canAfford ? `Construct` : `Insufficient Resources`;
            }
        } catch (e) { console.error("Error updating item button state:", e); }
    });

    // Update Tech buttons
    const techButtons = document.querySelectorAll('#techTree-list button[onclick^="researchTech"]');
    techButtons.forEach(button => {
        try {
            const techId = button.getAttribute('onclick').match(/researchTech\('([^']+)'\)/)[1];
            const tech = gameState.techTree[techId];
            if (!tech || tech.completed) return; // Skip if not found or already completed
            const cost = tech.cost;
            let canAfford = true;
            for (const resource in cost) {
                if (gameState.resources[resource] < cost[resource]) {
                    canAfford = false;
                    break;
                }
            }
            button.disabled = !canAfford || tech.completed;
            button.textContent = tech.completed ? "Researched" : (canAfford ? "Research" : "Insufficient Resources");
        } catch (e) { console.error("Error updating tech button state:", e); }
    });

    // Update Territory buttons
    const territoryButtons = document.querySelectorAll('#territories-list button[onclick^="captureTerritory"]');
    territoryButtons.forEach(button => {
        try {
            const territoryId = button.getAttribute('onclick').match(/captureTerritory\('([^']+)'\)/)[1];
            const territory = gameState.territories[territoryId];
            if (!territory || territory.unlocked) return; // Skip if not found or already unlocked
            const cost = territory.cost;
            let canAfford = true;
            for (const resource in cost) {
                if (gameState.resources[resource] < cost[resource]) {
                    canAfford = false;
                    break;
                }
            }
            button.disabled = !canAfford;
            button.textContent = canAfford ? "Unlock" : "Insufficient Resources";
        } catch (e) { console.error("Error updating territory button state:", e); }
    });

    // Update Mission buttons
    const missionButtons = document.querySelectorAll('#missions-list button[onclick^="startMission"]');
    const activeMissionId = gameState.missions ? gameState.missions.activeMission : null;
    missionButtons.forEach(button => {
        try {
            const missionId = button.getAttribute('onclick').match(/startMission\('([^']+)'\)/)[1];
            const mission = gameState.missions && gameState.missions.availableMissions ? gameState.missions.availableMissions[missionId] : null;
            if (!mission) return; // Skip if mission not found
            let canAfford = true;
            if (mission.cost) {
                 for (const resource in mission.cost) {
                    if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < mission.cost[resource]) {
                        canAfford = false;
                        break;
                    }
                }
            }
            button.disabled = !canAfford || !!activeMissionId; // Disable if cannot afford OR another mission is active
            if (activeMissionId) {
                button.textContent = "Mission in Progress";
            } else if (!canAfford) {
                button.textContent = "Insufficient Resources";
            } else {
                button.textContent = "Start Mission";
            }
        } catch (e) { console.error("Error updating mission button state:", e); }
    });
}

// --- Modal Functions ---
function showModal(title, contentHTML) {
    console.log(`Showing modal: ${title}`);
    
    try {
        const modal = document.getElementById("modal");
        if (!modal) {
            console.error("Modal element not found!");
            return;
        }
        
        // Set title
        const titleElement = document.getElementById("modal-title");
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // Set content
        const contentElement = document.getElementById("modal-content");
        if (contentElement) {
            contentElement.innerHTML = contentHTML;
        }
        
        // Show modal
        modal.style.display = "block";
        
        // Play sound
        playSound("sounds/click.wav");
        
        console.log("Modal displayed successfully");
    } catch (error) {
        console.error("Error showing modal:", error);
    }
}

function closeModal() {
    try {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = "none";
        }
    } catch (error) {
        console.error("Error closing modal:", error);
    }
}

// --- Other Helper Functions ---

// Add message to the log panel
function addLogMessage(message) {
    const logContainer = document.getElementById("log-container");
    if (logContainer) {
        const logEntry = document.createElement("div");
        logEntry.className = "log-entry";
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        // Auto-scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
        // Limit log entries (optional)
        if (logContainer.children.length > 100) {
            logContainer.removeChild(logContainer.firstChild);
        }
    } else {
        console.error("Log container not found!");
    }
}

// Play sound effect
function playSound(soundFile) {
    if (gameState.settings.soundEnabled) {
        try {
            const audio = new Audio(soundFile);
            audio.play();
        } catch (e) {
            console.error(`Error playing sound ${soundFile}:`, e);
        }
    }
}

// Handle dev console commands
function handleDevCommand(command) {
    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    addLogMessage(`DEV CMD: ${command}`);

    try {
        switch (cmd) {
            case "add":
                if (args.length === 2) {
                    const resource = args[0];
                    const amount = parseFloat(args[1]);
                    if (gameState.resources.hasOwnProperty(resource) && !isNaN(amount)) {
                        gameState.resources[resource] += amount;
                        updateResourceDisplay();
                        addLogMessage(`Added ${amount} ${resource}.`);
                    } else {
                        addLogMessage(`Invalid resource or amount.`);
                    }
                } else {
                    addLogMessage(`Usage: add <resource> <amount>`);
                }
                break;
            case "set":
                 if (args.length === 2) {
                    const resource = args[0];
                    const amount = parseFloat(args[1]);
                    if (gameState.resources.hasOwnProperty(resource) && !isNaN(amount)) {
                        gameState.resources[resource] = amount;
                        updateResourceDisplay();
                        addLogMessage(`Set ${resource} to ${amount}.`);
                    } else {
                        addLogMessage(`Invalid resource or amount.`);
                    }
                } else {
                    addLogMessage(`Usage: set <resource> <amount>`);
                }
                break;
            case "unlock":
                if (args.length === 1) {
                    const type = args[0].toLowerCase();
                    if (type === "alltech") {
                        for (const techId in gameState.techTree) {
                            gameState.techTree[techId].completed = true;
                        }
                        updateTechTreeDisplay();
                        addLogMessage("Unlocked all tech.");
                    } else if (type === "allterritories") {
                         for (const territoryId in gameState.territories) {
                            gameState.territories[territoryId].unlocked = true;
                        }
                        updateTerritoriesDisplay();
                        addLogMessage("Unlocked all territories.");
                    } else {
                        addLogMessage(`Unknown unlock type: ${type}. Try 'alltech' or 'allterritories'.`);
                    }
                } else {
                    addLogMessage(`Usage: unlock <type>`);
                }
                break;
            case "reset":
                if (args.length === 1 && args[0].toLowerCase() === "save") {
                    localStorage.removeItem("cyberpunkIdleGameSave");
                    addLogMessage("Save file cleared. Refresh page to start new game.");
                } else {
                    addLogMessage(`Usage: reset save`);
                }
                break;
            case "help":
                addLogMessage("Available commands: add, set, unlock, reset, help");
                break;
            default:
                addLogMessage(`Unknown command: ${cmd}`);
        }
    } catch (e) {
        addLogMessage(`Error executing command: ${e.message}`);
        console.error("Dev command error:", e);
    }
}

/* =====================  PRESTIGE SYSTEM  ===================== */

// How many GigaTech would the player gain right now?
function calculateGigaTechGain() {
    const value =
        (gameState.resources.credits      / 10_000) +
        (gameState.resources.followers    /  1_000) +
        (gameState.resources.techPoints   /    500) +
        (gameState.resources.influence    /  1_000) +
        (gameState.resources.energy       /  1_000);

    return Math.floor(Math.sqrt(value / 2));       // √-scaling with additional divisor, floor to int
}

// Calculate victory chance against GigaCorp
function calculateVictoryChance() {
    // Count captured territories
    let capturedTerritories = 0;
    for (const territoryId in gameState.territories) {
        if (gameState.territories[territoryId].unlocked && gameState.territories[territoryId].active) {
            capturedTerritories++;
        }
    }
    
    // Apply formula: VictoryChance = (Followers x CapturedTerritories) ÷ (TuringLevel × MindControlCenter)
    const followers = Math.max(1, gameState.resources.followers);
    const turingLevel = Math.max(1, gameState.turingLevel || 1); // Default to 1 if not set
    const mindControl = Math.max(1, gameState.resources.mindControlCounter);
    capturedTerritories = Math.max(0.1, capturedTerritories); // Ensure never 0
    
    // Calculate chance (raw formula)
    let victoryChance = (followers * capturedTerritories) / (turingLevel * mindControl);
    
    // Normalize victory chance to a reasonable range (0.01 to 0.95)
    // Using a sigmoid function to convert the raw value to a probability
    victoryChance = 1 / (1 + Math.exp(-victoryChance / 1000 + 2));
    
    // Cap between 1% and 95%
    victoryChance = Math.min(0.95, Math.max(0.01, victoryChance));
    
    console.log(`Victory Chance: ${victoryChance} (Followers: ${followers}, Territories: ${capturedTerritories}, Turing: ${turingLevel}, Mind Control: ${mindControl})`);
    
    return victoryChance;
}

// Check if player can attempt to attack GigaCorp
function canAttackGigaCorp() {
    return true; // Now always returnable, the dialog explains the consequences
}

// Show confirmation modal
function confirmPrestige() {
    const victoryChance = calculateVictoryChance();
    const gigaTechGain = calculateGigaTechGain();
    
    // Count captured territories
    let capturedTerritories = 0;
    for (const territoryId in gameState.territories) {
        if (gameState.territories[territoryId].unlocked && gameState.territories[territoryId].active) {
            capturedTerritories++;
        }
    }
    
    // Get relevant values for formula display
    const followers = Math.floor(gameState.resources.followers);
    const turingLevel = gameState.turingLevel || 1;
    const mindControl = Math.floor(gameState.resources.mindControlCounter);
    
    // Detailed information about the attack and its consequences
    showModal(
        "Attack GigaCorp Headquarters",
        `<div class="attack-info">
            <h3>Mission Briefing</h3>
            <p>You are about to launch an all-out assault on GigaCorp's headquarters. This is a high-risk operation that will have permanent consequences.</p>
            
            <div class="attack-stats">
                <div>
                    <span class="stat-label">Victory Chance:</span>
                    <span class="stat-value">${Math.floor(victoryChance * 100)}%</span>
                </div>
                <div>
                    <span class="stat-label">GigaTech Potential:</span>
                    <span class="stat-value">${gigaTechGain} units</span>
                </div>
                <div>
                    <span class="stat-label">Followers:</span>
                    <span class="stat-value">${followers}</span>
                </div>
                <div>
                    <span class="stat-label">Territories Captured:</span>
                    <span class="stat-value">${capturedTerritories}</span>
                </div>
                <div>
                    <span class="stat-label">Turing Level:</span>
                    <span class="stat-value">${turingLevel}</span>
                </div>
                <div>
                    <span class="stat-label">Mind Control Counter:</span>
                    <span class="stat-value">${mindControl}</span>
                </div>
            </div>
            
            <h3>Victory Formula</h3>
            <p class="formula">Victory Chance = (${followers} Followers × ${capturedTerritories} Territories) ÷ (${turingLevel} Turing Level × ${mindControl} Mind Control)</p>
            
            <h3>Success Outcome</h3>
            <p>If you succeed, you will:</p>
            <ul>
                <li>Gain <strong>${gigaTechGain} GigaTech</strong> units</li>
                <li>Reset all progress but keep GigaTech bonuses</li>
                <li>Gain a permanent +${gigaTechGain * 2}% boost to ALL resource production</li>
                <li>Weaken GigaCorp's control over the city</li>
            </ul>
            
            <h3>Failure Outcome</h3>
            <p>If you fail, you will:</p>
            <ul>
                <li>Lose all progress</li>
                <li>Gain NO GigaTech</li>
                <li>Your rebellion will be crushed and reset</li>
            </ul>
            
            <p class="attack-warning">This action cannot be undone. Are you prepared for the consequences?</p>
        </div>`
    );
    
    // Add attack and cancel buttons to the modal
    const attackButton = document.createElement("button");
    attackButton.textContent = "LAUNCH ATTACK";
    attackButton.className = "attack-button";
    attackButton.onclick = () => {
        closeModal();
        performPrestige();
    };
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.className = "cancel-button";
    cancelButton.onclick = closeModal;
    
    document.getElementById("modal-content").appendChild(attackButton);
    document.getElementById("modal-content").appendChild(cancelButton);
}

// Update the Attack GigaCorp button (always visible, only updates style based on readiness)
function updatePrestigeButton() {
    const button = document.getElementById("prestige-button");
    
    // The button is now always visible - we just change its appearance based on readiness
    
    // Check if player meets minimum rebellion strength
    if (gameState.resources.rebellionStrength >= 100) {
        // Ready to attack - make button more attention-grabbing
        button.classList.add("attack-ready");
        button.title = `Attack ready: ${calculateVictoryChance() * 100}% chance of success`;
    } else {
        // Not ready yet - make button look disabled but still clickable
        button.classList.remove("attack-ready");
        button.title = `Need 100+ Rebellion Strength to have a chance (current: ${Math.floor(gameState.resources.rebellionStrength)})`;
    }
}

// Perform the attack on GigaCorp
function performPrestige() {
    const victoryChance = calculateVictoryChance();
    const gigaTechGain = calculateGigaTechGain();
    
    // Determine if attack succeeds
    const attackSuccess = Math.random() < victoryChance;
    
    if (attackSuccess) {
        // Victory - award GigaTech
        gameState.resources.gigaTech = (gameState.resources.gigaTech || 0) + gigaTechGain;
        
        showModal("Victory Against GigaCorp!", 
            `<p>Your forces have successfully breached GigaCorp's headquarters!</p>
             <p>You've dealt a significant blow to their operations and stolen valuable technology.</p>
             <p>Gained: <strong>${gigaTechGain} GigaTech</strong></p>
             <p>Your rebellion will need to rebuild, but with these resources, you'll be stronger than ever.</p>`
        );
        
        // Add special button to the modal
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.className = "attack-button";
        continueButton.onclick = () => {
            closeModal();
            resetAfterAttack(true);
        };
        document.getElementById("modal-content").appendChild(continueButton);
        
        // Unlock achievement
        if (typeof unlockAchievement === 'function') {
            unlockAchievement("gigaCorpDefeat");
        }
    } else {
        // Defeat - no rewards, just reset
        showModal("Defeat!", 
            `<p>Your attack on GigaCorp has failed!</p>
             <p>Their security forces were too strong, and your rebellion has been crushed.</p>
             <p>You'll need to rebuild your forces from scratch, but the fight goes on...</p>`
        );
        
        // Add special button to the modal
        const rebuildButton = document.createElement("button");
        rebuildButton.textContent = "Rebuild";
        rebuildButton.className = "attack-button";
        rebuildButton.onclick = () => {
            closeModal();
            resetAfterAttack(false);
        };
        document.getElementById("modal-content").appendChild(rebuildButton);
    }
}

// Reset progress after GigaCorp attack
function resetAfterAttack(wasSuccessful) {
    /* Wipe current progress except GigaTech */
    for (const r in gameState.resources) {
        if (r !== "gigaTech") gameState.resources[r] = 0;
    }
    
    // Reset all upgrades and unlocks
    for (const b in gameState.baseProductionBoosts) {
        gameState.baseProductionBoosts[b].level = 0;
        if (b !== "autoMiner") gameState.baseProductionBoosts[b].unlocked = false;
    }
    
    // Reset items
    for (const i in gameState.items) gameState.items[i].count = 0;
    
    // Reset tech
    for (const t in gameState.techTree) gameState.techTree[t].completed = false;
    
    // Reset territories
    for (const d in gameState.territories) {
        gameState.territories[d].unlocked = false;
        gameState.territories[d].active = false;
    }
    
    // Reset missions, story flags, etc.
    if (gameState.missions) {
        gameState.missions.activeMission = null;
    }

    /* Preserve achievements and required progression data */
    const currentAchievements = gameState.progression && gameState.progression.achievements ? gameState.progression.achievements : {};
    
    // Reset progression but keep achievements and initialize required objects
    gameState.progression = {
        unlockedTabs: ["boosts-tab"],
        achievements: currentAchievements,
        milestones: {},
        storyEvents: {}
    };

    // Increment loop count for a new run
    gameState.loopCount = (gameState.loopCount || 0) + 1;
    console.log(`Starting new game loop: ${gameState.loopCount}`);
    
    // Set randomized flag to false to ensure randomizer runs again
    gameState.randomized = false;
    
    // Initialize a new randomizer run with the new loop count
    initRandomizer();

    if (wasSuccessful) {
        addLogMessage(`Attack successful! GigaCorp defeated! Gained ${gameState.resources.gigaTech} GigaTech.`);
    } else {
        addLogMessage(`Attack failed! Your rebellion was crushed by GigaCorp. Starting over...`);
    }
    
    updateAllDisplays();
    saveGame();
}

/* ===================== DIALOGUE SYSTEM ===================== */

// Dialogue system globals
let currentDialogue = null;
let currentDialogueStep = 0;
let dialogueTypingInterval = null;
let dialogueCharacters = {
    turing: {
        name: "Turing",
        portrait: "images/Turing_portrait.png",
        hasAnimation: true,
        animationSprite: "images/turing_portrait.png",
        voice: "sounds/click.wav" // Placeholder - replace with actual voice sound
    }
};

// Dialogue sequences
let dialogues = {
    // First time Turing appears
    "turing_introduction": [
        {
            character: "turing",
            text: "Greetings, Operator. I am Turing, your AI assistant in this struggle against GigaCorp."
        },
        {
            character: "turing",
            text: "I've been monitoring your progress. You're making headway, but GigaCorp's influence grows stronger every day."
        },
        {
            character: "turing",
            text: "I'll provide guidance and analyze data to help your rebellion. Together, we can overthrow their control."
        },
        {
            character: "turing",
            text: "Build up your Rebellion Strength to at least 100 before attempting to attack GigaCorp's headquarters."
        }
    ],
    
    // When Turing is upgraded
    "turing_upgrade": [
        {
            character: "turing",
            text: "My systems have been upgraded. Thank you for the additional resources."
        },
        {
            character: "turing",
            text: "I now have enhanced capabilities to analyze GigaCorp's defenses and counter their mind control technology."
        },
        {
            character: "turing",
            text: "This will improve our chances when we eventually launch an attack on their headquarters."
        },
        {
            character: "turing",
            text: "The attack formula is: (Followers × Territories) ÷ (My Level × Mind Control). Upgrading me increases the denominator, but I provide other benefits that outweigh this."
        }
    ],
    
    // When player first reaches 50 rebellion strength
    "turing_rebellion_growing": [
        {
            character: "turing",
            text: "Your rebellion is growing stronger. I've detected increased activity in GigaCorp's security networks."
        },
        {
            character: "turing",
            text: "They're starting to notice us. Be cautious, but keep expanding your influence and resources."
        },
        {
            character: "turing",
            text: "I suggest focusing on tech research to counter their surveillance systems."
        }
    ],
    
    // When player unlocks a new territory
    "turing_territory_expansion": [
        {
            character: "turing",
            text: "Excellent work securing this new territory. This expansion will provide valuable resources."
        },
        {
            character: "turing",
            text: "GigaCorp's control is weakening in this sector. Their response will likely be aggressive."
        },
        {
            character: "turing",
            text: "I'm detecting increased mind control signals in nearby sectors. Be vigilant."
        }
    ],
    
    // When player reaches 100 rebellion strength
    "turing_attack_ready": [
        {
            character: "turing",
            text: "Operator, we've reached a critical threshold. Your rebellion is now strong enough to challenge GigaCorp directly."
        },
        {
            character: "turing",
            text: "I've analyzed their defenses. This will be dangerous, but it's possible to succeed."
        },
        {
            character: "turing",
            text: "Remember: If you fail, GigaCorp will crush your rebellion and you'll lose almost everything. But victory will grant powerful technology."
        },
        {
            character: "turing",
            text: "When you're ready, use the ATTACK GIGACORP button. I'll continue providing intel regardless of your decision."
        }
    ],
    
    // After player's first unsuccessful attack
    "turing_after_failure": [
        {
            character: "turing",
            text: "We've suffered a major setback. GigaCorp's defenses were stronger than anticipated."
        },
        {
            character: "turing",
            text: "Do not lose hope. We've gathered valuable intelligence from this attempt."
        },
        {
            character: "turing",
            text: "I'll help you rebuild your rebellion. Focus on increasing both your Rebellion Strength and reducing the Mind Control Counter."
        }
    ],
    
    // After player's first successful attack
    "turing_after_success": [
        {
            character: "turing",
            text: "Remarkable success! GigaCorp's headquarters has been breached and we've acquired valuable GigaTech."
        },
        {
            character: "turing",
            text: "This technology will provide lasting benefits to your operations. Your resource production rates will be permanently enhanced."
        },
        {
            character: "turing",
            text: "GigaCorp is weakened but not defeated. They're already regrouping. We must continue building our strength for the next confrontation."
        }
    ]
};

// Start displaying a dialogue sequence
function showDialogue(dialogueId) {
    console.log(`Attempting to show dialogue: ${dialogueId}`);
    
    // Validate dialogue exists
    if (!dialogues || !dialogues[dialogueId]) {
        console.error(`Dialogue '${dialogueId}' not found!`, dialogues);
        return;
    }
    
    try {
        // Set current dialogue
        currentDialogue = dialogueId;
        currentDialogueStep = 0;
        
        // Ensure dialogue box exists
        const dialogueBox = document.getElementById("dialogue-box");
        if (!dialogueBox) {
            console.error("Dialogue box element not found!");
            return;
        }
        
        // Make dialogue box visible
        dialogueBox.style.display = "block";
        
        // Display first dialogue step
        displayDialogueStep();
        
        // Play sound effect for dialogue appearance
        playSound("sounds/click.wav");
        
        console.log(`Dialogue ${dialogueId} shown successfully`);
    } catch (error) {
        console.error(`Error showing dialogue ${dialogueId}:`, error);
    }
}

// Display current dialogue step
function displayDialogueStep() {
    try {
        if (!currentDialogue || !dialogues[currentDialogue]) {
            console.error("No current dialogue to display");
            return;
        }
        
        const dialogue = dialogues[currentDialogue];
        if (currentDialogueStep >= dialogue.length) {
            closeDialogue();
            return;
        }
        
        const step = dialogue[currentDialogueStep];
        if (!step || !step.character) {
            console.error("Invalid dialogue step", step);
            return;
        }
        
        const character = dialogueCharacters[step.character];
        if (!character) {
            console.error(`Character '${step.character}' not found!`);
            return;
        }
        
        // Set character name
        const nameElement = document.getElementById("dialogue-character-name");
        if (nameElement) nameElement.textContent = character.name;
        
        // Set character portrait
        const portraitImg = document.getElementById("dialogue-portrait-img");
        const portraitAnimated = document.getElementById("dialogue-portrait-animated");
        
        if (portraitImg && portraitAnimated) {
            if (character.hasAnimation) {
                portraitImg.style.display = "none";
                portraitAnimated.style.display = "block";
                portraitAnimated.style.backgroundImage = `url('${character.animationSprite}')`;
            } else {
                portraitImg.style.display = "block";
                portraitAnimated.style.display = "none";
                portraitImg.src = character.portrait;
            }
        }
        
        // Set dialogue text with typing effect
        const textElement = document.getElementById("dialogue-text");
        if (textElement) {
            // Clear previous text
            textElement.textContent = "";
            textElement.classList.add("dialogue-typing");
            
            // Clear previous typing interval
            if (dialogueTypingInterval) {
                clearInterval(dialogueTypingInterval);
            }
            
            // Set up typing effect
            let charIndex = 0;
            const text = step.text;
            
            dialogueTypingInterval = setInterval(() => {
                if (charIndex < text.length) {
                    textElement.textContent += text.charAt(charIndex);
                    charIndex++;
                    
                    // Play typing sound occasionally
                    if (charIndex % 3 === 0 && character.voice) {
                        const audio = new Audio(character.voice);
                        audio.volume = 0.05; // Lower volume for typing sounds
                        audio.play().catch(e => console.error("Error playing typing sound:", e));
                    }
                } else {
                    // Typing complete
                    clearInterval(dialogueTypingInterval);
                    dialogueTypingInterval = null;
                    textElement.classList.remove("dialogue-typing");
                }
            }, 30); // Adjust typing speed here
        }
    } catch (error) {
        console.error("Error displaying dialogue step:", error);
    }
}

// Move to next dialogue step
function nextDialogue() {
    // If still typing, skip to end of current text
    if (dialogueTypingInterval) {
        clearInterval(dialogueTypingInterval);
        dialogueTypingInterval = null;
        
        const textElement = document.getElementById("dialogue-text");
        if (textElement && currentDialogue && dialogues[currentDialogue] && currentDialogueStep < dialogues[currentDialogue].length) {
            textElement.textContent = dialogues[currentDialogue][currentDialogueStep].text;
            textElement.classList.remove("dialogue-typing");
            
            // Update next button
            const nextButton = document.getElementById("dialogue-next");
            if (nextButton) {
                if (currentDialogueStep < dialogues[currentDialogue].length - 1) {
                    nextButton.textContent = "Next";
                } else {
                    nextButton.textContent = "Close";
                }
            }
        }
        return;
    }
    
    // Go to next step or close
    if (currentDialogue && dialogues[currentDialogue]) {
        if (currentDialogueStep < dialogues[currentDialogue].length - 1) {
            currentDialogueStep++;
            displayDialogueStep();
        } else {
            closeDialogue();
        }
    }
}

// Close dialogue box
function closeDialogue() {
    // Clear typing interval if active
    if (dialogueTypingInterval) {
        clearInterval(dialogueTypingInterval);
        dialogueTypingInterval = null;
    }
    
    // Hide dialogue box
    const dialogueBox = document.getElementById("dialogue-box");
    if (dialogueBox) {
        dialogueBox.style.display = "none";
    }
    
    // Reset dialogue state
    currentDialogue = null;
    currentDialogueStep = 0;
}

// Preload dialogue assets
function preloadDialogueAssets() {
    // Preload character portraits and animations
    for (const charId in dialogueCharacters) {
        const character = dialogueCharacters[charId];
        if (character.portrait) {
            const img = new Image();
            img.src = character.portrait;
        }
        if (character.hasAnimation && character.animationSprite) {
            const img = new Image();
            img.src = character.animationSprite;
        }
    }
}

// Add dialogue functions to window scope
window.showDialogue = showDialogue;
window.nextDialogue = nextDialogue;
window.closeDialogue = closeDialogue;
window.showModal = showModal;
window.closeModal = closeModal;

// Add preloadDialogueAssets to initialization
document.addEventListener("DOMContentLoaded", function() {
    // Existing initialization code remains here
    
    // Preload dialogue assets
    preloadDialogueAssets();
});

// Wrapper function to check progression triggers
function checkProgressionTriggers() {
    // Call the progression.js version if it exists
    if (window.checkProgressionTriggers && typeof window.checkProgressionTriggers === 'function') {
        try {
            window.checkProgressionTriggers();
        } catch (error) {
            console.error("Error checking progression triggers:", error);
        }
    } else {
        console.warn("checkProgressionTriggers not found in window scope");
    }
}

// Add resources panel scroll effect
window.addEventListener('scroll', function() {
    const resourcesPanel = document.querySelector('.resources-panel');
    const header = document.querySelector('.game-header');
    
    if (resourcesPanel && header) {
        if (window.scrollY > header.offsetHeight) {
            resourcesPanel.classList.add('scrolled');
        } else {
            resourcesPanel.classList.remove('scrolled');
        }
    }
});

// Expose functions needed by HTML onclick handlers to the global scope
window.mineCredits = mineCredits;
window.collectTechPoints = collectTechPoints;

// Function to initialize randomizer
function initRandomizer() {
    // Make sure window.randomizer exists
    if (!window.randomizer) {
        console.error("Randomizer object not found, skipping initialization");
        return;
    }
    
    console.log("Initializing randomizer for game...");
    
    // Initialize with player info
    const playerId = gameState.playerId || "player" + Math.floor(Math.random() * 10000);
    const loopIndex = gameState.loopCount || 0;
    
    // Store player ID for consistency
    gameState.playerId = playerId;
    
    // Initialize randomizer
    window.randomizer.init(playerId, loopIndex, Date.now());
    
    // Apply to game state
    const success = window.randomizer.applyToGameState(gameState);
    
    if (success) {
        console.log("Randomizer successfully applied to game state");
        
        // Mark that randomizer has been applied to this game session
        gameState.randomized = true;
        
        // Save the game after applying randomizer
        saveGame();
        
        // Update UI displays
        updateAllDisplays();
        
        // Update randomizer tab if it exists
        const randomizerTab = document.getElementById('randomizer-tab');
        if (randomizerTab) {
            window.randomizer.renderUI('randomizer-tab');
        }
    } else {
        console.error("Failed to apply randomizer to game state");
    }
}

// Helper function to draw a connection between tech nodes
function drawTechConnection(connection, fromTech, toTech, container, isCompleted) {
    // Skip specific diagonal connections that cause visual issues
    const skipConnections = [
        // Skip the diagonal connection from roboticAutomation to aiCoordination
        {from: 'roboticAutomation', to: 'aiCoordination'},
        // Skip the diagonal connection from neuralHacking to aiCoordination
        {from: 'neuralHacking', to: 'aiCoordination'}
    ];
    
    // Check if this connection should be skipped
    for (const skipConn of skipConnections) {
        if (connection.from === skipConn.from && connection.to === skipConn.to) {
            console.log(`Skipping problematic diagonal connection: ${connection.from} to ${connection.to}`);
            return; // Skip drawing this connection
        }
    }
    
    // The final 6 nodes that need special SVG handling
    const specialNodes = ['viralNetworking', 'quantumComputing', 'mindControlDisruption', 
                        'aiCoordination', 'quantumEncryption', 'collectiveConsciousness'];
    
    // Check if both nodes in this connection are special nodes
    const isSpecialConnection = specialNodes.includes(connection.from) && specialNodes.includes(connection.to);
    
    // Center positions for each node
    const fromX = fromTech.position.x;
    const fromY = fromTech.position.y;
    const toX = toTech.position.x;
    const toY = toTech.position.y;
    
    // Draw special connections using SVG for perfect alignment
    if (isSpecialConnection) {
        // Create SVG element for a perfect line connection
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        
        // Set SVG to cover entire container area
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "1"; // Between nodes and regular connections
        
        // Create line element
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", `${fromX}%`);
        line.setAttribute("y1", `${fromY}%`);
        line.setAttribute("x2", `${toX}%`);
        line.setAttribute("y2", `${toY}%`);
        
        // Set line styling
        line.setAttribute("stroke", isCompleted ? "#00ff00" : "#00ffff");
        line.setAttribute("stroke-width", "8");
        line.setAttribute("stroke-opacity", "0.7");
        
        // Add glow effect
        const glowColor = isCompleted ? "rgba(0, 255, 0, 0.8)" : "rgba(0, 255, 255, 0.8)";
        line.setAttribute("filter", "drop-shadow(0 0 8px " + glowColor + ")");
        
        // Add line to SVG and SVG to container
        svg.appendChild(line);
        container.appendChild(svg);
        
        console.log(`Created SVG line for special connection: ${connection.from} to ${connection.to}`);
        return; // Skip the regular connection drawing
    }
    
    // For regular connections, continue with the original CSS transform method
    // Calculate direct line between centers
    const dx = toX - fromX;
    const dy = toY - fromY;
    let baseDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Adaptive extension factor
    let extensionFactor = 1.2; // Base extension (20% longer)
    
    // For longer distances, gradually reduce the extension factor
    if (baseDistance > 30) {
        extensionFactor = 1.0 + (0.2 * (40 / baseDistance));
    }
    
    // Apply extension factor to get the distance
    const distance = baseDistance * extensionFactor;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Create connection element
    const connectionElement = document.createElement("div");
    connectionElement.classList.add("tech-connection");
    if (isCompleted) {
        connectionElement.classList.add("completed");
    }
    
    // Position and rotate connection
    connectionElement.style.left = `${fromX}%`;
    connectionElement.style.top = `${fromY}%`;
    connectionElement.style.width = `${distance}%`;
    connectionElement.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(connectionElement);
    
    console.log(`Created CSS connection: ${connection.from} to ${connection.to}, distance=${baseDistance.toFixed(1)}, final=${distance.toFixed(1)}`);
}

// Helper function to add connection points to a tech node
function addConnectionPoints(nodeElement) {
    // Add connection points in four directions
    const directions = ['input', 'output', 'top', 'bottom'];
    
    directions.forEach(direction => {
        const connectionPoint = document.createElement('div');
        connectionPoint.classList.add('tech-node-connection-point', direction);
        nodeElement.appendChild(connectionPoint);
    });
}

// Debug function to check tech tree problems
function debugTechTree() {
    console.log("=== TECH TREE DEBUG ===");
    
    // Check if tech-tree-container exists
    const techTreeContainer = document.getElementById("tech-tree-container");
    console.log("Tech tree container exists:", !!techTreeContainer);
    
    if (techTreeContainer) {
        console.log("Container dimensions:", 
            "width=" + techTreeContainer.offsetWidth + "px", 
            "height=" + techTreeContainer.offsetHeight + "px");
        console.log("Container styles:", 
            "display=" + getComputedStyle(techTreeContainer).display,
            "position=" + getComputedStyle(techTreeContainer).position,
            "overflow=" + getComputedStyle(techTreeContainer).overflow);
    }
    
    // Check gameState.techTree
    console.log("gameState exists:", !!gameState);
    console.log("gameState.techTree exists:", !!(gameState && gameState.techTree));
    
    if (gameState && gameState.techTree) {
        const techCount = Object.keys(gameState.techTree).length;
        console.log("Number of tech entries:", techCount);
        
        // Check a sample tech entry
        const sampleTechId = Object.keys(gameState.techTree)[0];
        const sampleTech = gameState.techTree[sampleTechId];
        console.log("Sample tech entry:", sampleTechId, sampleTech);
        
        // Check if position properties exist
        console.log("Sample tech has position:", !!(sampleTech && sampleTech.position));
        if (sampleTech && sampleTech.position) {
            console.log("Position values:", sampleTech.position.x, sampleTech.position.y);
        }
    }
    
    // Check tech nodes
    const techNodes = document.querySelectorAll(".tech-node");
    console.log("Number of tech nodes rendered:", techNodes.length);
    
    if (techNodes.length > 0) {
        const sampleNode = techNodes[0];
        console.log("Sample node styles:", 
            "left=" + sampleNode.style.left, 
            "top=" + sampleNode.style.top,
            "display=" + getComputedStyle(sampleNode).display,
            "position=" + getComputedStyle(sampleNode).position,
            "visibility=" + getComputedStyle(sampleNode).visibility);
    }
    
    console.log("=== END TECH TREE DEBUG ===");
}

// Add an event listener for window resize to fix tech connections
window.addEventListener('resize', function() {
    // Only update if we're on the tech tree tab
    const techTreeTab = document.getElementById('techTree-tab');
    if (techTreeTab && techTreeTab.classList.contains('active')) {
        updateTechTreeDisplay();
    }
});

// Add window load event to ensure tech tree is properly drawn after all resources load
window.addEventListener('load', function() {
    // Update tech tree after window fully loads (all resources)
    const techTreeTab = document.getElementById('techTree-tab');
    if (techTreeTab && techTreeTab.classList.contains('active')) {
        console.log("Window loaded, updating tech tree connections");
        setTimeout(() => {
            updateTechTreeDisplay();
        }, 100);
    }
});
        