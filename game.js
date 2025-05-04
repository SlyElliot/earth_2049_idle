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
            position: { x: 50, y: 10 } // Position in % from top-left
        },
        underworldContacts: {
            name: "Underworld Contacts",
            cost: { influence: 20 },
            effectDesc: "Unlocks Black Market Access item.",
            unlocksItem: "blackMarketAccess",
            completed: false,
            requires: [],
            icon: "🤝",
            position: { x: 80, y: 10 }
        },
        basicAutomation: {
            name: "Basic Automation",
            cost: { techPoints: 25 },
            effectDesc: "Unlocks Auto-Miner MK1 boost.",
            unlocksBoost: "autoMiner",
            completed: false,
            requires: [],
            icon: "⚙️",
            position: { x: 20, y: 10 }
        },
        recruitmentAlgorithms: {
            name: "Recruitment Algorithms",
            cost: { techPoints: 50, influence: 10 },
            effectDesc: "Unlocks Recruiter Node boost.",
            unlocksBoost: "recruiterNode",
            completed: false,
            requires: ["basicAutomation"],
            icon: "👥",
            position: { x: 20, y: 25 }
        },
        dataMining: {
            name: "Data Mining",
            cost: { techPoints: 75 },
            effectDesc: "Unlocks Network Tap boost.",
            unlocksBoost: "networkTap",
            completed: false,
            requires: ["basicAutomation"],
            icon: "📊",
            position: { x: 35, y: 25 }
        },
        energyManagement: {
            name: "Energy Management",
            cost: { techPoints: 100, energy: 10 },
            effectDesc: "Unlocks Power Relay boost.",
            unlocksBoost: "powerRelay",
            completed: false,
            requires: ["basicAutomation"],
            icon: "⚡",
            position: { x: 5, y: 25 }
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
            position: { x: 20, y: 40 }
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
            position: { x: 35, y: 40 }
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
            position: { x: 80, y: 25 }
        },
        neuralHacking: {
            name: "Neural Hacking",
            cost: { techPoints: 300, energy: 50 },
            effectDesc: "Break through mental barriers. Counters Mind Control.",
            effect: { mindControlResistance: 0.2 },
            completed: false,
            requires: ["secureEncryption", "advancedDataMining"],
            icon: "🧠",
            position: { x: 50, y: 40 }
        },
        roboticAutomation: {
            name: "Robotic Automation",
            cost: { techPoints: 350, energy: 75, credits: 300 },
            effectDesc: "Autonomous robots to handle dangerous tasks. +20% Energy Rate.",
            effect: { energyRateBonus: 0.2 },
            completed: false,
            requires: ["energyManagement"],
            icon: "🤖",
            position: { x: 5, y: 40 }
        },
        viralNetworking: {
            name: "Viral Networking",
            cost: { influence: 300, techPoints: 200 },
            effectDesc: "Create self-replicating social networks. +25% Follower Rate.",
            effect: { followersRateBonus: 0.25 },
            completed: false,
            requires: ["massMediaManipulation"],
            icon: "🦠",
            position: { x: 20, y: 55 }
        },
        quantumComputing: {
            name: "Quantum Computing",
            cost: { techPoints: 500, energy: 100 },
            effectDesc: "Breakthrough in computation technology. +30% Tech Points Rate.",
            effect: { techPointsRateBonus: 0.3 },
            completed: false,
            requires: ["advancedDataMining", "neuralHacking"],
            icon: "🔬",
            position: { x: 50, y: 55 }
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
            position: { x: 35, y: 70 }
        },
        mindControlDisruption: {
            name: "Mind Control Disruption",
            cost: { techPoints: 600, energy: 200, influence: 150 },
            effectDesc: "Actively counter GigaCorp's control. -50% Mind Control Counter.",
            effect: { mindControlReduction: 0.5 },
            completed: false,
            requires: ["neuralHacking"],
            icon: "📡",
            position: { x: 65, y: 55 }
        },
        decentralizedOps: {
            name: "Decentralized Operations",
            cost: { techPoints: 400, influence: 200 },
            effectDesc: "Create cell-based structure to evade detection. +15% All Resources.",
            effect: { allResourcesBonus: 0.15 },
            completed: false,
            requires: ["blackMarketExpansion", "neuralHacking"],
            icon: "🌐",
            position: { x: 80, y: 40 }
        },
        quantumEncryption: {
            name: "Quantum Encryption",
            cost: { techPoints: 800, energy: 250 },
            effectDesc: "Unbreakable communication channels. +40% Influence Rate.",
            effect: { influenceRateBonus: 0.4 },
            completed: false,
            requires: ["quantumComputing"],
            icon: "🔏",
            position: { x: 50, y: 85 }
        },
        collectiveConsciousness: {
            name: "Collective Consciousness",
            cost: { techPoints: 1000, influence: 500, energy: 300, followers: 300 },
            effectDesc: "Link minds of your followers. +50% Rebellion Strength.",
            effect: { rebellionStrengthRateBonus: 0.5 },
            completed: false,
            requires: ["mindControlDisruption", "aiCoordination", "quantumEncryption"],
            icon: "👁️",
            position: { x: 50, y: 95 }
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
    // Load or initialize game state
    loadGame();
    
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
    
    // Initial display updates
    updateResourceDisplay();
    updateBoostsDisplay();
    updateItemsDisplay();
    updateTechTreeDisplay();
    updateTerritoriesDisplay();
    updateMissionsDisplay();
    updateAllDisplays();
    
    // Update tech button cost
    document.getElementById("techPoints-cost").textContent = 5;
    
    // Add initial log message
    addLogMessage("Welcome to Earth 2049, where your rebellion begins.");
    
    // Start game loop
    gameLoop();
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
        const followerFromInfluence = gameState.resources.influence * 0.000001;
        gameState.rates.followers += followerFromInfluence;
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
}

// --- Manual Actions ---

function mineCredits() {
    playSound("sounds/click.wav"); // Play click sound
    gameState.resources.credits += 1;
    updateResourceDisplay(); // Update UI immediately
    // Add visual feedback if desired (e.g., clicking animation)
}

function collectTechPoints() {
    const cost = 5; // Cost in credits
    if (gameState.resources.credits >= cost) {
        playSound("sounds/click.wav"); // Play click sound
        gameState.resources.credits -= cost;
        gameState.resources.techPoints += 1;
        updateResourceDisplay(); // Update UI immediately
    } else {
        addLogMessage("Insufficient credits to collect Tech Points.");
    }
}

function generateEnergy() {
    const cost = 10; // Cost in credits
    if (gameState.resources.credits >= cost) {
        playSound("sounds/click.wav"); // Play click sound
        gameState.resources.credits -= cost;
        gameState.resources.energy += 1;
        updateResourceDisplay(); // Update UI immediately
    } else {
        addLogMessage("Insufficient credits to generate Energy.");
    }
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
    const boost = gameState.baseProductionBoosts[boostId];
    if (!boost) return;

    const cost = {};
    let canAfford = true;
    for (const resource in boost.baseCost) {
        const currentCost = boost.baseCost[resource] * Math.pow(boost.costMultiplier, boost.level);
        cost[resource] = currentCost;
        if (gameState.resources[resource] < currentCost) {
            canAfford = false;
            break;
        }
    }

    if (canAfford) {
        playSound("sounds/click.wav"); // Play click sound
        for (const resource in cost) {
            gameState.resources[resource] -= cost[resource];
        }
        boost.level++;
        addLogMessage(`${boost.name} upgraded to Level ${boost.level}.`);
        updateRates();
        updateResourceDisplay();
        updateBoostsDisplay(); // Refresh boost display
    } else {
        addLogMessage(`Insufficient resources to upgrade ${boost.name}.`);
    }
}

function buyItem(itemId) {
    const item = gameState.items[itemId];
    if (!item) return;
    if (item.max && item.count >= item.max) {
        addLogMessage(`Maximum count reached for ${item.name}.`);
        return;
    }

    // Check if item requires a tech that hasn't been completed yet
    if (item.requiresTech && gameState.techTree[item.requiresTech] && 
        !gameState.techTree[item.requiresTech].completed) {
        addLogMessage(`Research ${gameState.techTree[item.requiresTech].name} first to unlock ${item.name}.`);
        return;
    }

    const cost = {};
    let canAfford = true;
    for (const resource in item.baseCost) {
        const currentCost = item.baseCost[resource] * Math.pow(item.costMultiplier, item.count);
        cost[resource] = currentCost;
        if (gameState.resources[resource] < currentCost) {
            canAfford = false;
            break;
        }
    }

    if (canAfford) {
        playSound("sounds/click.wav"); // Play click sound
        for (const resource in cost) {
            gameState.resources[resource] -= cost[resource];
        }
        item.count++;
        addLogMessage(`Constructed ${item.name} (Total: ${item.count}).`);
        updateRates();
        updateResourceDisplay();
        updateItemsDisplay(); // Refresh item display
    } else {
        addLogMessage(`Insufficient resources to construct ${item.name}.`);
    }
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
    console.log(`DEBUG: Switching to tab: ${tabId}`); // ADDED
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
        console.log(`DEBUG: Displaying content for ${tabId}`); // ADDED
    } else {
        console.error(`DEBUG: Content element not found for ${tabId}`); // ADDED
    }

    // Activate the selected tab button
    const selectedTabButton = document.querySelector(`button[data-tab="${tabId}"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add("active");
    } else {
        console.error(`DEBUG: Tab button not found for ${tabId}`); // ADDED
    }

    // Also hide achievements section when switching main tabs
    const achievementsSection = document.getElementById("achievements-section");
    if (achievementsSection) {
        achievementsSection.style.display = "none";
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
    const logContainer = document.getElementById("log-container");
    if (logContainer) {
        const logEntry = document.createElement("div");
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        // Auto-scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
    } else {
        console.error("DEBUG: log-container not found!"); // ADDED
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

// Update resource display
function updateResourceDisplay() {
    try { // Added try-catch
        document.getElementById("credits-value").textContent = formatNumber(gameState.resources.credits);
        document.getElementById("credits-rate").textContent = formatNumber(gameState.rates.credits) + "/s";

        // Show followers as integers (rounded)
        document.getElementById("followers-value").textContent = Math.floor(gameState.resources.followers);
        document.getElementById("followers-rate").textContent = formatNumber(gameState.rates.followers) + "/s";
        
        // Add tooltip for followers rate to show influence bonus
        const followersRateElement = document.getElementById("followers-rate");
        if (followersRateElement && gameState.resources.influence > 0) {
            const influenceBonus = gameState.resources.influence * 0.000001;
            followersRateElement.title = `+${formatNumber(influenceBonus)}/s from Influence`;
        }

        document.getElementById("influence-value").textContent = formatNumber(gameState.resources.influence);
        document.getElementById("influence-rate").textContent = formatNumber(gameState.rates.influence) + "/s";
        
        // Add tooltip for influence value to show follower generation
        const influenceElement = document.getElementById("influence-value");
        if (influenceElement && gameState.resources.influence > 0) {
            const followersGenerated = gameState.resources.influence * 0.000001;
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
        console.error("Error in updateResourceDisplay:", error); // Added error logging
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
    
    // Second pass: Draw connections first (so they're behind the nodes)
    for (const connection of connections) {
        const fromTech = gameState.techTree[connection.from];
        const toTech = gameState.techTree[connection.to];
        
        if (!fromTech || !toTech || !fromTech.position || !toTech.position) {
            continue;
        }
        
        // Calculate connection coordinates
        const fromX = fromTech.position.x;
        const fromY = fromTech.position.y;
        const toX = toTech.position.x;
        const toY = toTech.position.y;
        
        // Calculate line properties
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Create connection element
        const connectionElement = document.createElement("div");
        connectionElement.classList.add("tech-connection");
        if (connection.isCompleted) {
            connectionElement.classList.add("completed");
        }
        
        // Position and rotate connection
        connectionElement.style.left = `${fromX}%`;
        connectionElement.style.top = `${fromY}%`;
        connectionElement.style.width = `${distance}%`;
        connectionElement.style.transform = `rotate(${angle}deg)`;
        
        techTreeContainer.appendChild(connectionElement);
    }
    
    // Third pass: Draw the nodes
    window.selectedTechId = null;
    
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
            nodeElement.style.transform = "translate(-50%, -50%)"; // Center the node
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
        
        techTreeContainer.appendChild(nodeElement);
    }
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
                captureTerritory(territoryId);
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

// Function to update all displays
function updateAllDisplays() {
    console.log("DEBUG: updateAllDisplays called.");
    updateResourceDisplay();
    updateBoostsDisplay();
    updateItemsDisplay();
    updateTechTreeDisplay();
    updateTerritoriesDisplay();
    updateMissionsDisplay(); // Ensure this line is present
    updateAchievementsDisplay();
    updatePrestigeButton();
}

// --- Game Loop and Saving ---

// Main game loop (runs every second)
function gameLoop() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000; // Time difference in seconds

    updateRates(); // Recalculate rates based on current boosts, items, tech, territories

    // Generate resources based on rates
    for (const resource in gameState.rates) {
        if (gameState.resources.hasOwnProperty(resource)) {
            gameState.resources[resource] += gameState.rates[resource] * delta;
        }
    }
    
    // Round followers to integers
    gameState.resources.followers = Math.floor(gameState.resources.followers);
    
    // Calculate rebellion strength from other resources
    updateRebellionStrength();

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

    // Update UI
    updateResourceDisplay(); // Refresh all displays

    // Check for progression triggers
    checkProgressionTriggers();

    gameState.lastUpdate = now;
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

// Modify updateAllDisplays to include missions
function updateAllDisplays() {
    console.log("DEBUG: updateAllDisplays called.");
    updateBoostsDisplay();
    updateItemsDisplay();
    updateTechTreeDisplay();
    updateTerritoriesDisplay();
    updateMissionsDisplay(); // Ensure this line is present
    updateAchievementsDisplay();
    updatePrestigeButton();
}

// Modify gameLoop to check for mission completion
function gameLoop() {
    const now = Date.now();
    const delta = (now - gameState.lastUpdate) / 1000; // Time difference in seconds

    updateRates(); // Recalculate rates based on current boosts, items, etc.

    // Generate resources
    for (const resource in gameState.rates) {
        gameState.resources[resource] += gameState.rates[resource] * delta;
    }

    // Check for mission completion (Ensure this block is present)
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

    updateResourceDisplay(); // Update resource values in the UI
    updateButtonStates(); // Update button disabled states
    
    // Add safe check for checkProgressionTriggers function
    if (typeof checkProgressionTriggers === 'function') {
        try {
            checkProgressionTriggers();
        } catch (error) {
            console.warn("Error in progression system:", error);
        }
    }

    gameState.lastUpdate = now;
}

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
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalContent = document.getElementById("modal-content"); // Target the correct content div

    if (modal && modalTitle && modalContent) {
        modalTitle.textContent = title;
        modalContent.innerHTML = contentHTML; // Use innerHTML to render HTML content
        modal.style.display = "flex"; // Use flex instead of block for centering
    } else {
        console.error("Modal elements not found!");
    }
}
window.showModal = showModal; // Expose globally if needed by progression.js

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
        // Clear content to prevent old buttons from persisting
        const modalContent = document.getElementById("modal-content");
        if (modalContent) {
            modalContent.innerHTML = "";
        }
    } else {
        console.error("Modal element not found!");
    }
}
window.closeModal = closeModal; // Expose globally for onclick in modal

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

    /* Preserve achievements but reset unlocked tabs */
    gameState.progression = {
        unlockedTabs: ["boosts-tab"],
        achievements: gameState.progression.achievements || {}
    };

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
    if (!dialogues[dialogueId]) {
        console.error(`Dialogue '${dialogueId}' not found!`);
        return;
    }
    
    // Set current dialogue
    currentDialogue = dialogueId;
    currentDialogueStep = 0;
    
    // Display first step
    displayDialogueStep();
    
    // Show dialogue box
    const dialogueBox = document.getElementById("dialogue-box");
    if (dialogueBox) {
        dialogueBox.style.display = "block";
    }
    
    // Play sound effect for dialogue appearance
    playSound("sounds/click.wav");
}

// Display current dialogue step
function displayDialogueStep() {
    if (!currentDialogue || !dialogues[currentDialogue]) return;
    
    const dialogue = dialogues[currentDialogue];
    if (currentDialogueStep >= dialogue.length) {
        closeDialogue();
        return;
    }
    
    const step = dialogue[currentDialogueStep];
    const character = dialogueCharacters[step.character];
    
    if (!character) {
        console.error(`Character '${step.character}' not found!`);
        return;
    }
    
    // Set character name
    const nameElement = document.getElementById("dialogue-character-name");
    if (nameElement) nameElement.textContent = character.name;
    
    // Set character portrait
    const portraitImgElement = document.getElementById("dialogue-portrait-img");
    const portraitAnimatedElement = document.getElementById("dialogue-portrait-animated");
    
    if (portraitImgElement && portraitAnimatedElement) {
        if (character.hasAnimation) {
            portraitImgElement.style.display = "none";
            portraitAnimatedElement.style.display = "block";
            // If we have a specific animation sprite, set it
            if (character.animationSprite) {
                portraitAnimatedElement.style.backgroundImage = `url('${character.animationSprite}')`;
            }
        } else {
            portraitImgElement.style.display = "block";
            portraitAnimatedElement.style.display = "none";
            portraitImgElement.src = character.portrait;
        }
    }
    
    // Set dialogue text with typing effect
    const textElement = document.getElementById("dialogue-text");
    if (textElement) {
        // Clear previous typing interval
        if (dialogueTypingInterval) {
            clearInterval(dialogueTypingInterval);
            dialogueTypingInterval = null;
        }
        
        // Start typing effect
        textElement.textContent = "";
        textElement.classList.add("dialogue-typing");
        
        const text = step.text;
        let charIndex = 0;
        
        dialogueTypingInterval = setInterval(() => {
            if (charIndex < text.length) {
                textElement.textContent += text.charAt(charIndex);
                charIndex++;
                
                // Play voice sound occasionally
                if (character.voice && Math.random() < 0.1) {
                    playSound(character.voice);
                }
            } else {
                // Done typing
                clearInterval(dialogueTypingInterval);
                dialogueTypingInterval = null;
                textElement.classList.remove("dialogue-typing");
                
                // Update buttons
                const nextButton = document.getElementById("dialogue-next");
                if (nextButton) {
                    if (currentDialogueStep < dialogue.length - 1) {
                        nextButton.textContent = "Next";
                    } else {
                        nextButton.textContent = "Close";
                    }
                }
            }
        }, 30); // Adjust typing speed as needed
    }
    
    // Update next button text
    const nextButton = document.getElementById("dialogue-next");
    if (nextButton) {
        nextButton.textContent = "Skip typing...";
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

// Add preloadDialogueAssets to initialization
document.addEventListener("DOMContentLoaded", function() {
    // Existing initialization code remains here
    
    // Preload dialogue assets
    preloadDialogueAssets();
});



        