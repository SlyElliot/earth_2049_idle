// Script to add a faction interface button to the game UI

document.addEventListener('DOMContentLoaded', function() {
    console.log("Faction Interface Trigger: Initializing");
    
    // Initialize the AIDirector if needed
    if (!window.aiDirector) {
        window.aiDirector = {};
        console.log("Created empty aiDirector object for faction interface");
    }
    
    // Add event listener for the faction tab
    const factionTab = document.querySelector('.tab[data-tab="factions-tab"]');
    if (factionTab) {
        console.log("Found faction tab, adding event listener");
        factionTab.addEventListener('click', function() {
            generateFactionInterfaceForTab();
        });
    } else {
        console.warn("Faction tab not found");
    }
});

// Generate faction interface when tab is selected
function generateFactionInterfaceForTab() {
    if (window.factionInterface) {
        // Get the current game state
        const gameState = {
            resources: {
                credits: typeof getResourceValue === 'function' ? getResourceValue('credits') : 5000,
                energy: typeof getResourceValue === 'function' ? getResourceValue('energy') : 2000,
                techPoints: typeof getResourceValue === 'function' ? getResourceValue('techPoints') : 3000,
                followers: typeof getResourceValue === 'function' ? getResourceValue('followers') : 1500
            },
            territories: {
                // Sample territories or try to get from game state
                "Downtown": { controlled: true, playerSectors: 3, playerPercent: 60 },
                "Tech District": { controlled: false, playerSectors: 1, playerPercent: 20 },
                "Harbor": { controlled: false, playerSectors: 0, playerPercent: 0 }
            }
        };
        
        // Generate the faction interface
        window.factionInterface.generate('faction-interface-container', gameState);
    } else {
        console.error("Faction interface not loaded!");
        
        // Create a message to show in the faction tab
        const container = document.getElementById('faction-interface-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Faction interface not loaded. Please check the console for errors.</p>
                </div>
            `;
        }
    }
}

// Add a function to update button state based on game state
function updateFactionButton(gameState) {
    const factionTab = document.querySelector('.tab[data-tab="factions-tab"]');
    if (!factionTab) return;
    
    // Example: highlight button if there are new faction events
    if (gameState && gameState.newFactionEvents) {
        factionTab.style.border = '2px solid #00FFFF';
        factionTab.style.boxShadow = '0 0 10px #00FFFF';
    } else {
        factionTab.style.border = '';
        factionTab.style.boxShadow = '';
    }
}

// Add a global function to switch tabs that can be called from other scripts
if (typeof window.switchToFactionTab !== 'function') {
    window.switchToFactionTab = function() {
        const factionTab = document.querySelector('.tab[data-tab="factions-tab"]');
        if (factionTab) {
            factionTab.click();
        }
    };
} 