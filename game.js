// Cyberpunk Idle Game - Main Script

// Game state (Updated based on GDD)
let gameState = {
    resources: {
        credits: 10,
        followers: 0,
        influence: 0,
        techPoints: 0,
        energy: 0,
        rebellionStrength: 0,
        gigaTech: 0,
        mindControlCounter: 0
    },
    rates: {
        credits: 0,
        followers: 0,
        influence: 0,
        techPoints: 0,
        energy: 0,
        rebellionStrength: 0,
        gigaTech: 0,
        mindControlCounter: 0
    },
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
            requires: []
        },
        underworldContacts: {
            name: "Underworld Contacts",
            cost: { influence: 20 },
            effectDesc: "Unlocks Black Market Access item.",
            unlocksItem: "blackMarketAccess",
            completed: false,
            requires: []
        },
        basicAutomation: {
            name: "Basic Automation",
            cost: { techPoints: 25 },
            effectDesc: "Unlocks Auto-Miner MK1 boost.",
            unlocksBoost: "autoMiner",
            completed: false,
            requires: []
        },
        recruitmentAlgorithms: {
            name: "Recruitment Algorithms",
            cost: { techPoints: 50, influence: 10 },
            effectDesc: "Unlocks Recruiter Node boost.",
            unlocksBoost: "recruiterNode",
            completed: false,
            requires: ["basicAutomation"]
        },
        dataMining: {
            name: "Data Mining",
            cost: { techPoints: 75 },
            effectDesc: "Unlocks Network Tap boost.",
            unlocksBoost: "networkTap",
            completed: false,
            requires: ["basicAutomation"]
        },
        energyManagement: {
            name: "Energy Management",
            cost: { techPoints: 100, energy: 10 },
            effectDesc: "Unlocks Power Relay boost.",
            unlocksBoost: "powerRelay",
            completed: false,
            requires: ["basicAutomation"]
        },
        massMediaManipulation: {
            name: "Mass Media Manipulation",
            cost: { techPoints: 150, influence: 75 },
            effectDesc: "Unlocks Propaganda Network item. +5% Follower Rate.",
            unlocksItem: "propagandaNetwork",
            effect: { followersRateBonus: 0.05 },
            completed: false,
            requires: ["recruitmentAlgorithms"]
        },
        advancedDataMining: {
            name: "Advanced Data Mining",
            cost: { techPoints: 200 },
            effectDesc: "Unlocks Data Broker License item. +5% Tech Point Rate.",
            unlocksItem: "dataBrokerLicense",
            effect: { techPointsRateBonus: 0.05 },
            completed: false,
            requires: ["dataMining"]
        },
        aiCoordination: {
            name: "AI Coordination",
            cost: { techPoints: 500, influence: 100, energy: 50 },
            effectDesc: "Unlocks AI Coordinator boost and Autonomous Agent HQ item.",
            unlocksBoost: "aiCoordinator",
            unlocksItem: "autonomousAgentHQ",
            completed: false,
            requires: ["massMediaManipulation", "advancedDataMining", "energyManagement"]
        },
        // Add more tech nodes from GDD...
    },
    // Districts / Territories (GDD - Replaces Districts)
    territories: {
        slumsOutskirts: {
            name: "Slums Outskirts",
            cost: { credits: 100, followers: 10 },
            effect: { creditsRateBonus: 0.05 }, // +5% Credits Rate
            effectDesc: "Basic control, small credit income boost.",
            unlocked: false,
            active: false,
            requires: [] // No prereqs for first one
        },
        marketDistrict: {
            name: "Market District",
            cost: { credits: 500, influence: 25 },
            effect: { influenceRateBonus: 0.05 }, // +5% Influence Rate
            effectDesc: "Control trade routes, boost influence gain.",
            unlocked: false,
            active: false,
            requires: ["slumsOutskirts"] // Requires previous territory
        },
        techQuarter: {
            name: "Tech Quarter",
            cost: { credits: 1000, techPoints: 100 },
            effect: { techPointsRateBonus: 0.05 }, // +5% Tech Point Rate
            effectDesc: "Access to tech hubs, boost tech point gain.",
            unlocked: false,
            active: false,
            requires: ["marketDistrict"]
        },
        energyGridNode: {
            name: "Energy Grid Node",
            cost: { credits: 2000, energy: 50 },
            effect: { energyRateBonus: 0.05 }, // +5% Energy Rate
            effectDesc: "Control power distribution, boost energy gain.",
            unlocked: false,
            active: false,
            requires: ["techQuarter"]
        },
        // Add more territories from GDD...
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
        theme: "dark"
    },
    lastUpdate: Date.now()
};

// --- Initialization ---

// Function to load game state from localStorage
function loadGame() {
    const savedState = localStorage.getItem("cyberpunkIdleGameSave");
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            // Basic merge - overwrite defaults with saved values
            // A more robust merge would handle added/removed properties
            gameState = deepMerge(gameState, parsedState);
            addLogMessage("Game loaded successfully.");
        } catch (e) {
            console.error("Failed to parse saved state:", e);
            addLogMessage("Failed to load save game. Starting new game.");
            localStorage.removeItem("cyberpunkIdleGameSave"); // Clear corrupted save
        }
    }
    // Ensure essential structures exist after load
    gameState.resources = gameState.resources || {};
    gameState.rates = gameState.rates || {};
    gameState.baseProductionBoosts = gameState.baseProductionBoosts || {};
    gameState.items = gameState.items || {};
    gameState.techTree = gameState.techTree || {};
    gameState.territories = gameState.territories || {};
    gameState.progression = gameState.progression || { unlockedTabs: ["boosts-tab"], achievements: {} };
    gameState.settings = gameState.settings || { soundEnabled: true, theme: "dark" };
    gameState.lastUpdate = gameState.lastUpdate || Date.now();
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
        localStorage.setItem("cyberpunkIdleGameSave", JSON.stringify(gameState));
        // addLogMessage("Game saved successfully."); // Reduce log spam
    } catch (e) {
        console.error("Failed to save game state:", e);
        addLogMessage("Error saving game!");
    }
}

// Function to initialize the game
document.addEventListener("DOMContentLoaded", function initGame() {
    loadGame();
    initProgressionSystem(); // Initialize progression system
    updateResourceDisplay();
    updateAllDisplays(); // Initial display update for all tabs
    setInterval(gameLoop, 1000); // Main game loop runs every second
    setInterval(saveGame, 15000); // Autosave every 15 seconds

    // Add event listener for dev console
    const devConsoleInput = document.getElementById("dev-console-input");
    if (devConsoleInput) {
        devConsoleInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                handleDevCommand(devConsoleInput.value);
                devConsoleInput.value = ""; // Clear input after command
            }
        });
    }

    // Set initial active tab
    if (gameState.progression.unlockedTabs && gameState.progression.unlockedTabs.length > 0) {
        switchTab(gameState.progression.unlockedTabs[0]);
    } else {
        switchTab("boosts-tab"); // Default to boosts if none saved
    }

    console.log("Game initialized successfully.");
    addLogMessage("Welcome to Earth 2039. Initiate operations.");
});

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

    // 5. Apply Global Multipliers to Rates
    for (const resource in gameState.rates) {
        const bonusKey = `${resource}RateBonus`;
        if (gameState.globalMultipliers.hasOwnProperty(bonusKey)) {
            gameState.rates[resource] *= gameState.globalMultipliers[bonusKey];
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

// --- Purchase/Action Functions ---

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

        updateRates();
        updateResourceDisplay();
        updateTechTreeDisplay(); // Refresh tech display
        updateBoostsDisplay(); // Refresh boosts in case one was unlocked
        updateItemsDisplay(); // Refresh items in case one was unlocked
    } else {
        addLogMessage(`Insufficient resources to research ${tech.name}.`);
    }
}

function unlockTerritory(territoryId) {
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
        territory.active = true; // Automatically activate on unlock? Or require separate activation?
        addLogMessage(`Territory unlocked and activated: ${territory.name}.`);
        updateRates();
        updateResourceDisplay();
        updateTerritoriesDisplay(); // Refresh territory display
    } else {
        addLogMessage(`Insufficient resources to unlock ${territory.name}.`);
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

        document.getElementById("followers-value").textContent = formatNumber(gameState.resources.followers);
        document.getElementById("followers-rate").textContent = formatNumber(gameState.rates.followers) + "/s";

        document.getElementById("influence-value").textContent = formatNumber(gameState.resources.influence);
        document.getElementById("influence-rate").textContent = formatNumber(gameState.rates.influence) + "/s";

        document.getElementById("techPoints-value").textContent = formatNumber(gameState.resources.techPoints);
        document.getElementById("techPoints-rate").textContent = formatNumber(gameState.rates.techPoints) + "/s";

        document.getElementById("energy-value").textContent = formatNumber(gameState.resources.energy);
        document.getElementById("energy-rate").textContent = formatNumber(gameState.rates.energy) + "/s";

        document.getElementById("rebellionStrength-value").textContent = formatNumber(gameState.resources.rebellionStrength);
        document.getElementById("rebellionStrength-rate").textContent = formatNumber(gameState.rates.rebellionStrength) + "/s";

        document.getElementById("gigaTech-value").textContent = formatNumber(gameState.resources.gigaTech);
        document.getElementById("gigaTech-rate").textContent = formatNumber(gameState.rates.gigaTech) + "/s";

        document.getElementById("mindControlCounter-value").textContent = formatNumber(gameState.resources.mindControlCounter);
        document.getElementById("mindControlCounter-rate").textContent = formatNumber(gameState.rates.mindControlCounter) + "/s";
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
            // Add unlock check if items can be locked/unlocked via tech
            let isUnlocked = true;
            if (item.requiresTech && (!gameState.techTree[item.requiresTech] || !gameState.techTree[item.requiresTech].completed)) {
                isUnlocked = false;
            }
            if (!isUnlocked) continue;

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
    const techTreeList = document.getElementById("techTree-list");
    if (!techTreeList) {
        console.error("DEBUG: techTree-list element not found!");
        return;
    }
    console.log("DEBUG: techTree-list element found:", techTreeList);
    techTreeList.innerHTML = ""; // Clear previous content

    if (!gameState || !gameState.techTree) {
        console.error("DEBUG: gameState.techTree is missing or invalid!");
        return;
    }
    console.log("DEBUG: gameState.techTree:", JSON.stringify(gameState.techTree));

    let techCount = 0;
    try { // Added try-catch
        for (const techId in gameState.techTree) {
            techCount++;
            const tech = gameState.techTree[techId];
             if (!tech || typeof tech !== 'object') { // Added check
                console.error(`DEBUG: Invalid tech data for ID: ${techId}`);
                continue;
            }

            // Check prerequisites
            let prereqsMet = true;
            if (tech.requires && tech.requires.length > 0) {
                for (const reqId of tech.requires) {
                    if (!gameState.techTree[reqId] || !gameState.techTree[reqId].completed) {
                        prereqsMet = false;
                        break;
                    }
                }
            }

            if (!prereqsMet) continue; // Don't display if prerequisites aren't met

            const cost = {};
            let canAfford = true;
            let costString = "";
             if (!tech.cost || typeof tech.cost !== 'object') { // Added check
                 console.error(`DEBUG: Invalid cost for tech: ${techId}`);
                 continue;
            }
            for (const resource in tech.cost) {
                cost[resource] = tech.cost[resource];
                costString += `${formatNumber(tech.cost[resource])} ${resource}, `;
                if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < tech.cost[resource]) {
                    canAfford = false;
                }
            }
            costString = costString.slice(0, -2); // Remove trailing comma and space

            const techElement = document.createElement("div");
            techElement.classList.add("research-item"); // Use existing class
            techElement.innerHTML = `
                <div class="research-name">${tech.name || 'Unnamed Tech'} ${tech.completed ? "(Completed)" : ""}</div>
                <div class="research-desc">${tech.effectDesc || ''}</div>
                <div class="research-cost">Cost: ${costString}</div>
                <button class="neon-button" onclick="researchTech('${techId}')" ${tech.completed || !canAfford ? "disabled" : ""}>
                    ${tech.completed ? "Researched" : "Research"}
                </button>
            `;
            techTreeList.appendChild(techElement);
        }
    } catch (error) {
        console.error("Error processing tech tree:", error); // Added error logging
    }
    console.log(`DEBUG: Looped through ${techCount} tech nodes.`);
}

// Update Territories display
function updateTerritoriesDisplay() {
    console.log("DEBUG: updateTerritoriesDisplay called.");
    const territoriesList = document.getElementById("territories-list");
    if (!territoriesList) {
        console.error("DEBUG: territories-list element not found!");
        return;
    }
    console.log("DEBUG: territories-list element found:", territoriesList);
    territoriesList.innerHTML = ""; // Clear previous content

    if (!gameState || !gameState.territories) {
        console.error("DEBUG: gameState.territories is missing or invalid!");
        return;
    }
    console.log("DEBUG: gameState.territories:", JSON.stringify(gameState.territories));

    let territoryCount = 0;
    try { // Added try-catch
        for (const territoryId in gameState.territories) {
            territoryCount++;
            const territory = gameState.territories[territoryId];
             if (!territory || typeof territory !== 'object') { // Added check
                console.error(`DEBUG: Invalid territory data for ID: ${territoryId}`);
                continue;
            }

            // Check prerequisites for unlocking
            let prereqsMet = true;
            if (territory.requires && territory.requires.length > 0) {
                for (const reqId of territory.requires) {
                    // Check if required territory exists and is unlocked
                    if (!gameState.territories[reqId] || !gameState.territories[reqId].unlocked) {
                        prereqsMet = false;
                        break;
                    }
                }
            }

            // Only display if unlocked OR if prereqs are met (allowing unlock)
            if (!territory.unlocked && !prereqsMet) continue;

            let cost = {};
            let canAffordUnlock = true;
            let unlockCostString = "";
            if (!territory.unlocked) {
                 if (!territory.cost || typeof territory.cost !== 'object') { // Added check
                     console.error(`DEBUG: Invalid cost for territory: ${territoryId}`);
                     continue;
                 }
                for (const resource in territory.cost) {
                    cost[resource] = territory.cost[resource];
                    unlockCostString += `${formatNumber(territory.cost[resource])} ${resource}, `;
                    if (!gameState.resources || gameState.resources[resource] === undefined || gameState.resources[resource] < territory.cost[resource]) {
                        canAffordUnlock = false;
                    }
                }
                unlockCostString = unlockCostString.slice(0, -2);
            }

            let effectString = "";
            if (territory.effect && typeof territory.effect === 'object') { // Added check
                for (const effectKey in territory.effect) {
                    if (effectKey.endsWith("RateBonus")) {
                        effectString += `${territory.effect[effectKey] > 0 ? '+' : ''}${(territory.effect[effectKey] * 100).toFixed(0)}% ${effectKey.replace("RateBonus", "")} Rate, `;
                    } else {
                        effectString += `${effectKey}: ${territory.effect[effectKey]}, `;
                    }
                }
                effectString = effectString.slice(0, -2);
            }

            const territoryElement = document.createElement("div");
            territoryElement.classList.add("district-item"); // Use existing class
            territoryElement.innerHTML = `
                <div class="district-name">${territory.name || 'Unnamed Territory'} ${territory.unlocked ? (territory.active ? "(Active)" : "(Inactive)") : "(Locked)"}</div>
                <div class="district-effect">Effect: ${effectString}</div>
                ${!territory.unlocked ? `<div class="district-cost">Unlock Cost: ${unlockCostString}</div>` : ''}
                ${territory.unlocked ?
                    `<button class="neon-button" onclick="activateTerritory('${territoryId}')">
                        ${territory.active ? "Deactivate" : "Activate"}
                     </button>` :
                    `<button class="neon-button" onclick="unlockTerritory('${territoryId}')" ${!canAffordUnlock ? "disabled" : ""}>
                        Unlock
                     </button>`
                }
            `;
            territoriesList.appendChild(territoryElement);
        }
    } catch (error) {
        console.error("Error processing territories:", error); // Added error logging
    }
    console.log(`DEBUG: Looped through ${territoryCount} territories.`);
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
    console.log("DEBUG: updateAllDisplays called."); // ADDED
    updateResourceDisplay();
    updateBoostsDisplay();
    updateItemsDisplay();
    updateTechTreeDisplay();
    updateTerritoriesDisplay();
    updateAchievementsDisplay();
    // Update Missions display when implemented
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

    // Update UI
    updateAllDisplays(); // Refresh all displays

    // Check for progression triggers
    checkProgressionTriggers();

    gameState.lastUpdate = now;
}

// --- Developer Console ---
function handleDevCommand(commandString) {
    const parts = commandString.trim().toLowerCase().split(" ");
    const command = parts[0];
    const resourceName = parts[1];
    const amount = parseFloat(parts[2]);

    if (command === "add" && resourceName && !isNaN(amount) && amount > 0) {
        let targetResource = null;
        // Find the resource key in gameState.resources matching the input name
        for (const key in gameState.resources) {
            if (key.toLowerCase() === resourceName) {
                targetResource = key;
                break;
            }
        }

        if (targetResource) {
            gameState.resources[targetResource] += amount;
            addLogMessage(`DEV: Added ${amount} ${targetResource}.`);
            updateResourceDisplay(); // Update UI immediately
        } else {
            addLogMessage(`DEV Error: Unknown resource name '${resourceName}'. Valid: credits, followers, influence, techpoints, energy, rebellionstrength, gigatech, mindcontrolcounter`);
        }
    } else if (command === "help") {
         addLogMessage("DEV Commands: add <resource> <amount>");
         addLogMessage("Valid resources: credits, followers, influence, techpoints, energy, rebellionstrength, gigatech, mindcontrolcounter");
    } else {
        addLogMessage(`DEV Error: Invalid command format. Use 'add <resource> <amount>' or 'help'.`);
    }
}

// Expose functions needed by HTML onclick handlers to the global scope
window.mineCredits = mineCredits;
window.collectTechPoints = collectTechPoints;
window.generateEnergy = generateEnergy;
window.buyBoost = buyBoost;
window.buyItem = buyItem;
window.researchTech = researchTech;
window.unlockTerritory = unlockTerritory;
window.activateTerritory = activateTerritory;
window.switchTab = switchTab;
window.toggleAchievements = toggleAchievements;
window.handleDevCommand = handleDevCommand; // If needed globally, though listener is preferred




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

    gameState.lastUpdate = now;
}

// Modify or Add updateButtonStates to include missions
function updateButtonStates() {
    // ... (existing button updates for boosts, items, tech, territories) ...

    // Update Boost buttons
    const boostButtons = document.querySelectorAll('#boosts-list button[onclick^="buyBoost"]');
    boostButtons.forEach(button => {
        try {
            const boostId = button.getAttribute('onclick').match(/buyBoost\('([^']+)'\)/)[1];
            const boost = gameState.baseProductionBoosts[boostId];
            if (!boost) return;
            const cost = calculateCost(boost.baseCost, boost.costMultiplier, boost.level);
            let canAfford = true;
            for (const resource in cost) {
                if (gameState.resources[resource] < cost[resource]) {
                    canAfford = false;
                    break;
                }
            }
            button.disabled = !canAfford;
            button.textContent = canAfford ? `Buy (${formatResourceList(cost)})` : `Insufficient (${formatResourceList(cost)})`;
        } catch (e) { console.error("Error updating boost button state:", e, button); }
    });

    // Update Item buttons
    const itemButtons = document.querySelectorAll('#items-list button[onclick^="buyItem"]');
    itemButtons.forEach(button => {
        try {
            const itemId = button.getAttribute('onclick').match(/buyItem\('([^']+)'\)/)[1];
            const item = gameState.items[itemId];
            if (!item) return;
            const cost = calculateCost(item.baseCost, item.costMultiplier, item.count);
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
                button.textContent = "Max Owned";
            } else {
                button.textContent = canAfford ? `Buy (${formatResourceList(cost)})` : `Insufficient (${formatResourceList(cost)})`;
            }
        } catch (e) { console.error("Error updating item button state:", e, button); }
    });

    // Update Tech buttons
    const techButtons = document.querySelectorAll('#techTree-list button[onclick^="buyTech"]');
    techButtons.forEach(button => {
        try {
            const techId = button.getAttribute('onclick').match(/buyTech\('([^']+)'\)/)[1];
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
            button.disabled = !canAfford;
            button.textContent = canAfford ? `Research (${formatResourceList(cost)})` : `Insufficient (${formatResourceList(cost)})`;
        } catch (e) { console.error("Error updating tech button state:", e, button); }
    });

    // Update Territory buttons
    const territoryButtons = document.querySelectorAll('#territories-list button[onclick^="unlockTerritory"]');
    territoryButtons.forEach(button => {
        try {
            const territoryId = button.getAttribute('onclick').match(/unlockTerritory\('([^']+)'\)/)[1];
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
            button.textContent = canAfford ? `Unlock (${formatResourceList(cost)})` : `Insufficient (${formatResourceList(cost)})`;
        } catch (e) { console.error("Error updating territory button state:", e, button); }
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
                button.textContent = `Start Mission`;
            }
        } catch (e) { console.error("Error updating mission button state:", e, button); }
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
        modal.style.display = "block";
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


