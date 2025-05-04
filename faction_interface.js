// Faction Interface System
// This file adds a UI for viewing faction standings, allies/enemies, and diplomatic interactions

// Initialize aiDirector object if it doesn't exist
if (!window.aiDirector) {
    window.aiDirector = {};
    console.log("Created empty aiDirector object for faction interface");
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("Faction Interface: Initializing");
    
    // Create the faction interface container if it doesn't exist
    if (!document.getElementById('faction-interface-container')) {
        const container = document.createElement('div');
        container.id = 'faction-interface-container';
        container.className = 'game-panel faction-panel';
        container.style.display = 'none'; // Hidden by default
        document.body.appendChild(container);
    }
    
    // Add styles
    addFactionStyles();
    
    // Initialize game state if not exists
    if (!window.gameState) {
        window.gameState = {
            resources: {
                credits: 0,
                followers: 0,
                influence: 0,
                techPoints: 0,
                energy: 0,
                rebellionStrength: 0,
                gigaTech: 0,
                mindControlCounter: 0
            },
            factionStanding: {
                "ShillZ": 0,
                "GigaCorp": 0,
                "Muskers": 0,
                "Cryptids": 0,
                "Hackers": 0,
                "MechRebels": 0
            },
            activeMissions: [],
            completedMissions: [],
            suspicion: 0
        };
    }
    
    // Set up faction contact definitions
    if (!window.factionContacts) {
        window.factionContacts = {
            "ShillZ": { name: "Riya Vex", portrait: "images/riya_portrait.png" },
            "GigaCorp": { name: "Executive Zhu", portrait: "images/executive_portrait.png" },
            "Muskers": { name: "Magnus", portrait: "images/magnus_portrait.png" },
            "Cryptids": { name: "Blitz", portrait: "images/blitz_portrait.png" },
            "Hackers": { name: "ZeroCool", portrait: "images/zerocool_portrait.png" },
            "MechRebels": { name: "Iron Skull", portrait: "images/ironskull_portrait.png" }
        };
    }
    
    // Generate the faction interface
    const gameState = window.gameState || {};
    generateFactionInterface('faction-interface-container', gameState);
    
    // Add logging function if not exists
    if (!window.addLogMessage) {
        window.addLogMessage = function(message) {
            console.log(`LOG: ${message}`);
            
            const logContainer = document.getElementById('log-container');
            if (logContainer) {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                
                const logTime = document.createElement('span');
                logTime.className = 'log-time';
                const now = new Date();
                logTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                
                logEntry.appendChild(logTime);
                logEntry.appendChild(document.createTextNode(` ${message}`));
                
                logContainer.appendChild(logEntry);
                
                // Scroll to bottom
                logContainer.scrollTop = logContainer.scrollHeight;
            }
        };
    }
});

// Function to show the faction interface
function showFactionInterface(gameState) {
    console.log("Faction Interface: Showing interface");
    
    // Generate the faction interface content
    generateFactionInterface('faction-interface-container', gameState);
}

// Function to hide the faction interface
function hideFactionInterface() {
    console.log("Faction Interface: Hiding interface");
    
    const container = document.getElementById('faction-interface-container');
    if (container) {
        container.innerHTML = ''; // Clear content instead of hiding
    }
}

// Function to toggle the faction interface
function toggleFactionInterface(gameState) {
    const container = document.getElementById('faction-interface-container');
    if (container && container.children.length > 0) {
        hideFactionInterface();
    } else {
        showFactionInterface(gameState);
    }
}

// Get faction details directly from gameState
function getFactionDetails(factionId) {
    const gameState = window.gameState || {};
    const standing = (gameState.factionStanding && gameState.factionStanding[factionId]) || 0;
    
    return {
        id: factionId,
        standing: standing,
        standingTier: getStandingTier(standing),
        contact: factionContacts[factionId] || { name: factionId + " Contact" }
    };
}

// Get all faction details
function getAllFactionDetails() {
    const factions = ["ShillZ", "GigaCorp", "Muskers", "Cryptids", "Hackers", "MechRebels"];
    const details = {};
    
    factions.forEach(factionId => {
        details[factionId] = getFactionDetails(factionId);
    });
    
    return details;
}

// Helper function to get standing tier based on value
function getStandingTier(standing) {
    if (standing >= 75) return "Ally";
    if (standing >= 40) return "Friendly";
    if (standing >= -39) return "Neutral";
    if (standing >= -74) return "Unfriendly";
    return "Hostile";
}

// Function to get diplomatic dialogue options for a faction
function getDiplomaticOptions(factionId, standing) {
    // Determine standing tier
    function getStandingTier(standing) {
        if (standing >= 75) return "Ally";
        if (standing >= 40) return "Friendly";
        if (standing >= -39) return "Neutral";
        if (standing >= -74) return "Unfriendly";
        return "Hostile";
    }
    
    const standingTier = getStandingTier(standing);
    
    // Generate dialogue options based on standing
    const options = [];
    
    // Basic options available to all standing levels
    options.push({
        text: "Inquire about current situation",
        outcome: "INFO",
        deltaRep: 0,
        deltaSusp: 0
    });
    
    // Standing-specific options
    if (standingTier === "Hostile") {
        options.push({
            text: "Attempt to make peace",
            outcome: "PEACE",
            deltaRep: 5,
            deltaSusp: -5,
            cost: { credits: 1000 }
        });
    } else if (standingTier === "Unfriendly") {
        options.push({
            text: "Offer support",
            outcome: "SUPPORT",
            deltaRep: 10,
            deltaSusp: 0,
            cost: { credits: 500 }
        });
        options.push({
            text: "Diplomatic exchange",
            outcome: "DIPLOMACY",
            deltaRep: 5,
            deltaSusp: 0
        });
    } else if (standingTier === "Neutral") {
        options.push({
            text: "Offer assistance",
            outcome: "ASSIST",
            deltaRep: 8,
            deltaSusp: 0,
            cost: { credits: 300 }
        });
        options.push({
            text: "Form business relationship",
            outcome: "BUSINESS",
            deltaRep: 15,
            deltaSusp: 5,
            cost: { credits: 1000 }
        });
        options.push({
            text: "Express concerns",
            outcome: "CONCERN",
            deltaRep: -8,
            deltaSusp: 0
        });
    } else if (standingTier === "Friendly" || standingTier === "Ally") {
        options.push({
            text: "Strengthen alliance",
            outcome: "STRENGTHEN",
            deltaRep: 10,
            deltaSusp: 0,
            cost: { credits: 500 }
        });
        options.push({
            text: "Special favor",
            outcome: "FAVOR",
            deltaRep: 5,
            deltaSusp: 10,
            unlockMission: true
        });
        options.push({
            text: "Express disagreement",
            outcome: "DISAGREE",
            deltaRep: -12,
            deltaSusp: -5
        });
    }
    
    return options;
}

// Function to process diplomatic conversation option
function processDiplomaticOption(factionId, optionIndex, gameState) {
    const standing = window.aiDirector.getFactionStanding(factionId);
    const options = getDiplomaticOptions(factionId, standing);
    
    if (!options || optionIndex >= options.length) {
        console.error(`Invalid diplomatic option index: ${optionIndex}`);
        return null;
    }
    
    const choice = options[optionIndex];
    console.log(`Faction Interface: Processing diplomatic option for ${factionId}, choice: ${choice.text}`);
    
    // Check if player can afford the cost
    if (choice.cost) {
        for (const [resource, amount] of Object.entries(choice.cost)) {
            if ((gameState.resources[resource] || 0) < amount) {
                return {
                    success: false,
                    message: `Not enough ${resource} to complete this action`
                };
            }
        }
        
        // Apply the cost
        for (const [resource, amount] of Object.entries(choice.cost)) {
            gameState.resources[resource] -= amount;
        }
    }
    
    // Apply standing changes
    if (choice.deltaRep !== 0) {
        window.aiDirector.applyReputationChange(factionId, choice.deltaRep, gameState);
    }
    
    // Handle special outcomes
    let resultMessage = "";
    switch (choice.outcome) {
        case "INFO":
            resultMessage = generateFactionInfoResponse(factionId);
            break;
            
        case "PEACE":
            resultMessage = `${factionId} accepts your peace offering.`;
            break;
            
        case "SUPPORT":
        case "ASSIST":
            resultMessage = `${factionId} appreciates your support and will remember this.`;
            break;
            
        case "DIPLOMACY":
        case "BUSINESS":
            resultMessage = `${factionId} agrees to formalize your relationship.`;
            break;
            
        case "CONCERN":
        case "DISAGREE":
            resultMessage = `${factionId} notes your concerns but remains committed to their path.`;
            break;
            
        case "STRENGTHEN":
            resultMessage = `${factionId} is pleased to strengthen your alliance.`;
            break;
            
        case "FAVOR":
            // Attempt to unlock a special mission
            const unlocked = Math.random() < 0.7; // 70% chance for demo purposes
            if (unlocked) {
                resultMessage = `${factionId} has a special task for you. Check your available missions.`;
            } else {
                resultMessage = `${factionId} appreciates your offer but has no special tasks at the moment.`;
            }
            break;
    }
    
    return {
        success: true,
        message: resultMessage,
        deltaRep: choice.deltaRep,
        deltaSusp: choice.deltaSusp,
        faction: factionId,
        outcome: choice.outcome
    };
}

// Helper function to generate faction info responses
function generateFactionInfoResponse(factionId) {
    // These would be tailored faction-specific responses
    const responses = {
        "GigaCorp": "Our quarterly projections are exceeding expectations. The board is pleased with current operations in all districts.",
        "Muskers": "Our augmentation clinics are operating at 98% capacity. New subdermal implant line launches next quarter.",
        "Cryptids": "Market volatility is creating unprecedented opportunities. Our latest NFT drop was completely liquidated in 3.7 seconds.",
        "ShillZ": "Engagement metrics are through the roof. Our influence campaigns have penetrated all demographic segments.",
        "Hackers": "Dark net chatter suggests corporate security is focusing on the wrong vectors. We've identified several new exploitable backdoors.",
        "MechRebels": "Salvage operations have yielded significant components. Our technical capabilities are expanding."
    };
    
    return responses[factionId] || `${factionId} has nothing specific to report at this time.`;
}

// Function to generate HTML for faction interface
function generateFactionInterface(containerId, gameState) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    
    // Get faction details
    const factionDetails = getAllFactionDetails();
    container.innerHTML = '';
    
    // Create faction cards layout
    let htmlContent = '<div class="faction-cards">';
    
    // Add each faction
    for (const [factionId, details] of Object.entries(factionDetails)) {
        // Create faction card
        htmlContent += `
            <div class="faction-card ${details.standingTier.toLowerCase()}">
                <div class="faction-header">
                    <h3>${factionId}</h3>
                    <div class="faction-standing ${details.standingTier.toLowerCase()}">
                        Standing: ${details.standing.toFixed(1)} (${details.standingTier})
                    </div>
                </div>
                <div class="faction-contact">
                    <div class="contact-name">Contact: ${details.contact.name}</div>
                    <button class="contact-button" data-faction="${factionId}">Contact</button>
                </div>
                <div id="faction-message-${factionId}" class="faction-message"></div>
            </div>
        `;
    }
    
    htmlContent += '</div>';
    container.innerHTML = htmlContent;
    
    // Add event listeners to contact buttons
    const contactButtons = container.querySelectorAll('.contact-button');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const faction = this.getAttribute('data-faction');
            contactFaction(faction, gameState);
        });
    });
    
    console.log("Faction interface generated");
}

// Function to add CSS styles for faction interface
function addFactionStyles() {
    // Check if styles already exist
    if (document.getElementById('faction-interface-styles')) {
        return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'faction-interface-styles';
    style.innerHTML = `
        .faction-tabs {
            display: flex;
            border-bottom: 1px solid #444;
            margin-bottom: 1rem;
        }
        
        .faction-tab {
            padding: 0.5rem 1rem;
            cursor: pointer;
            border: 1px solid #333;
            border-bottom: none;
            margin-right: 0.25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .faction-tab.active {
            background-color: #222;
            border-bottom: 1px solid #222;
            position: relative;
            top: 1px;
        }
        
        .faction-name {
            font-weight: bold;
        }
        
        .faction-standing-indicator {
            font-size: 0.8rem;
        }
        
        .faction-panel {
            padding: 1rem;
            border: 1px solid #333;
            margin-top: -1px;
        }
        
        .faction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .faction-standing {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }
        
        /* Standing tier colors */
        .faction-tab.ally, .faction-standing.ally { border-color: #00FF00; color: #00FF00; }
        .faction-tab.friendly, .faction-standing.friendly { border-color: #00CC00; color: #00CC00; }
        .faction-tab.neutral, .faction-standing.neutral { border-color: #0088FF; color: #0088FF; }
        .faction-tab.unfriendly, .faction-standing.unfriendly { border-color: #FF8800; color: #FF8800; }
        .faction-tab.hostile, .faction-standing.hostile { border-color: #FF0000; color: #FF0000; }
        
        .faction-relationships, .faction-missions, .faction-diplomacy {
            margin-bottom: 1.5rem;
        }
        
        .faction-allies, .faction-enemies {
            margin-bottom: 1rem;
        }
        
        .faction-relation {
            padding: 0.25rem 0.5rem;
            margin: 0.25rem 0;
            display: inline-block;
            margin-right: 0.5rem;
        }
        
        .faction-relation.ally {
            background-color: rgba(0, 200, 0, 0.2);
            border: 1px solid #00CC00;
        }
        
        .faction-relation.enemy {
            background-color: rgba(200, 0, 0, 0.2);
            border: 1px solid #CC0000;
        }
        
        .mission-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            border: 1px solid #333;
            margin-bottom: 0.5rem;
        }
        
        .diplomatic-option {
            padding: 0.5rem;
            border: 1px solid #333;
            margin-bottom: 0.5rem;
        }
        
        .option-text {
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .option-cost {
            color: #FF8800;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        
        .option-effects {
            margin-bottom: 0.5rem;
        }
        
        .effect-rep.positive { color: #00CC00; }
        .effect-rep.negative { color: #CC0000; }
        .effect-susp.positive { color: #00CC00; }
        .effect-susp.negative { color: #CC0000; }
        
        .dialogue-response {
            margin-top: 1rem;
            padding: 0.5rem;
            min-height: 2rem;
        }
        
        .dialogue-message {
            padding: 0.5rem;
            border-radius: 4px;
        }
        
        .dialogue-message.success {
            background-color: rgba(0, 200, 0, 0.2);
            border: 1px solid #00CC00;
        }
        
        .dialogue-message.failure {
            background-color: rgba(200, 0, 0, 0.2);
            border: 1px solid #CC0000;
        }
        
        /* Close button for the panel */
        .faction-panel-close {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        }
        
        .faction-panel-close:hover {
            color: #fff;
        }
    `;
    document.head.appendChild(style);
    
    console.log("Faction interface styles added");
}

// Export public API
window.factionInterface = {
    show: showFactionInterface,
    hide: hideFactionInterface,
    toggle: toggleFactionInterface,
    generate: generateFactionInterface
};

// Map faction IDs to contact persons
const factionContacts = {
    "ShillZ": { name: "Riya Vex", portrait: "images/riya_portrait.png" },
    "GigaCorp": { name: "Executive Zhu", portrait: "images/executive_portrait.png" },
    "Muskers": { name: "Magnus", portrait: "images/magnus_portrait.png" },
    "Cryptids": { name: "Blitz", portrait: "images/blitz_portrait.png" },
    "Hackers": { name: "ZeroCool", portrait: "images/zerocool_portrait.png" },
    "MechRebels": { name: "Iron Skull", portrait: "images/ironskull_portrait.png" }
};

// Get ShillZ mission IDs
function getShillZMissionIds() {
    return [
        "M-001", // Dumpster-Dive Data
        "M-003", // Broadcast Graffiti
        "M-006", // Vintage Tape Drop
        "M-008", // Couch Surfer Rally
        "M-012", // Deep-Fake Address
        "M-015", // Corporate "Gift" Pickup
        "M-017", // Pirate Radio Take-Over
        "M-018", // Smuggle Water Rations
        "M-019", // Botnet Seed Drop
    ];
}

// Contact faction for a dialogue interaction
function contactFaction(factionId, gameState) {
    console.log(`Contacting faction: ${factionId}`);
    
    const contact = factionContacts[factionId];
    if (!contact) {
        console.error(`No contact defined for faction: ${factionId}`);
        return;
    }
    
    // For ShillZ, directly trigger a mission dialogue
    if (factionId === "ShillZ") {
        // Get a random mission ID for ShillZ
        const missionIds = ["M-001", "M-002", "M-003", "M-004", "M-005", "M-019"];
        const randomIndex = Math.floor(Math.random() * missionIds.length);
        const missionId = missionIds[randomIndex];
        
        console.log(`Directly triggering ShillZ mission: ${missionId}`);
        if (typeof window.showMissionDialogue === 'function') {
            window.showMissionDialogue(missionId);
        } else {
            console.error("Mission dialogue system not available");
            showFactionMessage(factionId, "Communication systems offline. Try again later.");
        }
    } else {
        // For other factions, use default dialogue system
        showFactionMessage(factionId, `${contact.name} is not available for communication at this time.`);
    }
}

// Show a message in the faction dialogue area
function showFactionMessage(factionId, message) {
    const responseArea = document.getElementById(`faction-message-${factionId}`);
    if (responseArea) {
        responseArea.innerHTML = `<div class="dialogue-message">${message}</div>`;
        responseArea.style.display = 'block';
    }
}

// Make sure to expose key functions to the global window
window.contactFaction = contactFaction;
window.getShillZMissionIds = getShillZMissionIds;
window.getFactionDetails = getFactionDetails;
window.getAllFactionDetails = getAllFactionDetails; 