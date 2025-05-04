// Mission Dialogues System
// Contains dialogue trees and handlers for mission interactions

// Main dialogue container for ShillZ faction missions
const shillZDialogues = {
    // Mission M-001: Dumpster-Dive Data
    "M-001": {
        missionName: "Dumpster-Dive Data",
        contact: "Riya Vex",
        title: "Chief Information Officer",
        portrait: "images/riya_portrait.png",
        npcLine: "GigaCorp's digital waste bins are full of raw data gold. Want to dive in?",
        choices: [
            {
                text: "I'll sift through their trash.",
                outcome: "ACCEPT",
                deltaRep: 3,
                deltaSusp: 0,
                responseText: "Perfect. Your garbage is their secrets. I've marked the server locations in your HUD."
            },
            {
                text: "What's my cut of the data?",
                outcome: "NEGOTIATE",
                deltaRep: 0,
                deltaSusp: 2,
                bonusCredits: 150,
                responseText: "Business-minded, I like it. Here's a down payment. There's always more data in the ocean."
            },
            {
                text: "I don't dig through trash.",
                outcome: "DECLINE",
                deltaRep: -2,
                deltaSusp: 0,
                responseText: "Your loss. Someone else will get these valuable scraps. Don't come crying when you need the data."
            }
        ]
    },
    
    // Mission M-002: Side-Hustle NFT Heist
    "M-002": {
        missionName: "Side-Hustle NFT Heist",
        contact: "Riya Vex",
        title: "Chief Information Officer",
        portrait: "images/riya_portrait.png",
        npcLine: "We've got a lead on some ultra-rare NFTs launching on the blockchain. Perfect for our botnet to collect and flip.",
        choices: [
            {
                text: "Let's corner the market.",
                outcome: "ACCEPT",
                deltaRep: 3,
                deltaSusp: 0,
                responseText: "Perfect timing! The drop happens in 8 minutes. Our bots are ready to snap them up before anyone else can click."
            },
            {
                text: "I want 60% of the profits.",
                outcome: "NEGOTIATE",
                deltaRep: -3,
                deltaSusp: 4,
                bonusCredits: 350,
                responseText: "Ambitious! Fine, here's an advance. But the boss won't like your demands - remember who controls the narrative here."
            },
            {
                text: "NFTs are a scam.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: 0,
                responseText: "How naive. The value isn't in the art - it's in controlling the conversation. Your loss."
            }
        ]
    },
    
    // Mission M-003: Broadcast Graffiti
    "M-003": {
        missionName: "Broadcast Graffiti",
        contact: "Riya Vex",
        title: "Chief Information Officer",
        portrait: "images/riya_portrait.png",
        npcLine: "The walls of this city are our canvas, the masses our audience. Ready to paint some truth through the lies?",
        choices: [
            {
                text: "A little color never hurts.",
                outcome: "ACCEPT",
                deltaRep: 4,
                deltaSusp: 0,
                responseText: "Smart move. Our engagement metrics will soar through the roof. I've sent the designs to your AR interface."
            },
            {
                text: "What's the real agenda here?",
                outcome: "NEGOTIATE",
                deltaRep: -1,
                deltaSusp: 3,
                bonusCredits: 200,
                responseText: "Always questioning... I respect that. The agenda is simple - distract the masses while our data miners work. Here's a little bonus for your insight."
            },
            {
                text: "I don't do vandalism.",
                outcome: "DECLINE",
                deltaRep: -3,
                deltaSusp: 0,
                responseText: "It's not vandalism, it's communication. But sure, stay pure while GigaCorp owns every pixel in this city. Your loss."
            }
        ]
    },
    
    // Mission M-004: Shipyard Signal Jam
    "M-004": {
        missionName: "Shipyard Signal Jam",
        contact: "Riya Vex",
        title: "Chief Information Officer",
        portrait: "images/riya_portrait.png",
        npcLine: "GigaCorp's automated shipping yard needs to go offline for about an hour. Total communication blackout. Interested?",
        choices: [
            {
                text: "I'll make it disappear.",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 5,
                responseText: "Perfect. Once their comms are down, our people can slip the modified containers in. This will boost our reach tenfold."
            },
            {
                text: "Sounds risky. Pay me upfront.",
                outcome: "NEGOTIATE",
                deltaRep: 0,
                deltaSusp: 8,
                bonusCredits: 250,
                responseText: "Fine, here's half now. But you'd better deliver. If this fails, there are plenty of hungry operatives who'd take your place."
            },
            {
                text: "That's a federal offense.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: -3,
                responseText: "Oh, suddenly concerned about legality? Everything in this city is illegal if you're not GigaCorp. Remember whose side you're on."
            }
        ]
    },
    
    // Mission M-005: Musk Clinic Recon
    "M-005": {
        missionName: "Musk Clinic Recon",
        contact: "Riya Vex",
        title: "Chief Information Officer",
        portrait: "images/riya_portrait.png",
        npcLine: "Muskers just opened a new augmentation clinic downtown. We need intel on what they're really implanting in people.",
        choices: [
            {
                text: "I'll pose as a customer.",
                outcome: "ACCEPT",
                deltaRep: 3,
                deltaSusp: 2,
                responseText: "Perfect cover. Get scanned, check out their systems, and don't let them put anything in you. We need to know what data they're harvesting."
            },
            {
                text: "I'll need fake credentials.",
                outcome: "NEGOTIATE",
                deltaRep: 1,
                deltaSusp: 4,
                bonusCredits: 180,
                responseText: "Smart thinking. Here's some funds for the premium identity package. Don't get caught or we'll disavow you faster than a crashed stock."
            },
            {
                text: "Too risky for my blood.",
                outcome: "DECLINE",
                deltaRep: -2,
                deltaSusp: 0,
                responseText: "Shame. Those implants have backdoors that make our ad targeting look primitive. Someone braver will have to do it."
            }
        ]
    },
    
    // Mission M-012: Deep-Fake Address
    "M-012": {
        missionName: "Deep-Fake Address",
        contact: "Riya Vex",
        title: "Chief Information Officer",
        portrait: "images/riya_portrait.png",
        npcLine: "Need someone with your... untraceable profile to launch this citywide deepfake broadcast. The Mayor's face, our message. Interested?",
        choices: [
            {
                text: "I'll be your digital puppeteer.",
                outcome: "ACCEPT",
                deltaRep: 3,
                deltaSusp: 6,
                responseText: "Perfect. This will redirect public sentiment by at least 15 percentage points. Remember, it's not fake news if it feels true to the audience."
            },
            {
                text: "Double my usual fee for the risk.",
                outcome: "NEGOTIATE",
                deltaRep: 0,
                deltaSusp: 8,
                bonusCredits: 300,
                responseText: "Ah, a mercenary after my own heart. Fine, your account just got padded. Now make this broadcast indistinguishable from reality."
            },
            {
                text: "Too risky for my operation.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: 0,
                responseText: "Your caution is... disappointing. There are a hundred others who'd kill for this opportunity to shape reality. I'll find someone with actual ambition."
            }
        ]
    },
    
    // Mission M-015: Corporate "Gift" Pickup
    "M-015": {
        missionName: 'Corporate "Gift" Pickup',
        contact: "Riya Vex",
        portrait: "images/riya_portrait.png",
        npcLine: "One of our GigaCorp influencers left a package at drop point Sigma. Retrieve it without triggering corporate surveillance. Simple, right?",
        choices: [
            {
                text: "I'll get your package. Discreetly.",
                outcome: "ACCEPT",
                deltaRep: 3,
                deltaSusp: 0,
                specialEvent: "CORPORATE_GIFT",
                responseText: "Excellent. Remember, avoid the main corridors. Security's been heightened since our last... information exchange. Message me when you have it."
            },
            {
                text: "What's inside this mysterious gift?",
                outcome: "QUESTION",
                deltaRep: 0,
                deltaSusp: 2,
                responseText: "Curious, aren't we? Let's just say it's data that could either boost our campaign metrics or compromise a certain executive's public standing. Need-to-know basis, understand?"
            },
            {
                text: "Sounds like a setup. I'll pass.",
                outcome: "DECLINE",
                deltaRep: -2,
                deltaSusp: -1,
                responseText: "Your paranoia is showing. Fine, I'll find someone who understands the value of corporate... reciprocity. But remember who controls the narrative in this sector."
            }
        ]
    },
    
    // Mission M-017: Pirate Radio Take-Over
    "M-017": {
        missionName: "Pirate Radio Take-Over",
        contact: "Riya Vex",
        portrait: "images/riya_portrait.png",
        npcLine: "Downtown's analog radio tower - ancient tech, massive reach. Perfect channel for our unfiltered signal to the unconnected masses. Take it over?",
        choices: [
            {
                text: "Let's broadcast some truth.",
                outcome: "ACCEPT",
                deltaRep: 4,
                deltaSusp: 3,
                responseText: "Outstanding. Our content team has prepared a 6-hour broadcast that will penetrate even the most algorithm-resistant minds. This will generate beautiful chaos."
            },
            {
                text: "I want full creative control.",
                outcome: "NEGOTIATE",
                deltaRep: -2,
                deltaSusp: 5,
                bonusMorale: 20,
                responseText: "Bold demand. Very bold. We'll grant you limited editorial input, but our key messaging points remain non-negotiable. The narrative must be cohesive across platforms."
            },
            {
                text: "Radio is dead tech. Waste of time.",
                outcome: "DECLINE",
                deltaRep: -3,
                deltaSusp: 0,
                responseText: "Your digital privilege is showing. Millions still rely on radio. But sure, keep thinking everyone has your level of tech access. This narrow vision is why revolutions fail."
            }
        ]
    },
    
    // Mission M-008: Couch Surfer Rally
    "M-008": {
        missionName: "Couch Surfer Rally",
        contact: "Riya Vex",
        portrait: "images/riya_portrait.png",
        npcLine: "The displaced in Abandoned Sector need mobilizing. They've got numbers, we've got message. Connect with their network leaders and plant our narrative seeds.",
        choices: [
            {
                text: "I'll rally the disenfranchised.",
                outcome: "ACCEPT",
                deltaRep: 3,
                deltaSusp: 4,
                responseText: "Outstanding. These people have legitimate grievances - we just need to channel their anger in the right direction. Our content team has prepared targeted messaging."
            },
            {
                text: "They need real help, not propaganda.",
                outcome: "QUESTION",
                deltaRep: -1,
                deltaSusp: -2,
                specialEvent: "SHELTER_AID",
                responseText: "Look at you, all humanitarian. Fine, we'll include some actual resource distribution with our campaign. Happy? Now they'll get emergency shelter AND proper talking points."
            },
            {
                text: "Exploiting the homeless? Hard pass.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: -3,
                responseText: "Such moral superiority! We're AMPLIFYING their voices. But fine, leave them voiceless and invisible. Your 'ethics' won't keep them warm or fed or HEARD."
            }
        ]
    },
    
    // Mission M-016: Memecoin Rally Raid
    "M-016": {
        missionName: "Memecoin Rally Raid",
        contact: "Riya Vex",
        portrait: "images/riya_portrait.png",
        npcLine: "Financial District is hosting a massive crypto event. Perfect opportunity to inject our narrative into the market consciousness. Ready to manipulate some whales?",
        choices: [
            {
                text: "Time to pump some propaganda.",
                outcome: "ACCEPT",
                deltaRep: 4,
                deltaSusp: 5,
                cryptidsRep: -2,
                responseText: "Beautiful. Our social teams will amplify your presence there. Drop our message packets at these exact timestamps for maximum virality during price movements."
            },
            {
                text: "What's my share of this pump scheme?",
                outcome: "NEGOTIATE",
                deltaRep: 2,
                deltaSusp: 7,
                bonusCredits: 500,
                cryptidsRep: -4,
                responseText: "Mercenary mindset - I respect it. Here's an advance. Position yourself near these whale accounts during the rally. When they pump, we dump our narrative AND some tokens."
            },
            {
                text: "Crypto bros are toxic. Not my scene.",
                outcome: "DECLINE",
                deltaRep: -3,
                deltaSusp: 0,
                cryptidsRep: 2,
                responseText: "Interesting moral line you've drawn. The finance-tech intersection is THE battlefield for narrative control, but sure, keep your hands clean while others shape reality."
            }
        ]
    },
    
    // Mission M-018: Smuggle Water Rations
    "M-018": {
        missionName: "Smuggle Water Rations",
        contact: "Riya Vex",
        portrait: "images/riya_portrait.png",
        npcLine: "Drought protocols hit the Living Towers hard. Corporate rationing keeping the poor thirsty. Deliver these water cards - with our branding, of course.",
        choices: [
            {
                text: "Water and message delivered.",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 2,
                gigaCorpRep: -3,
                responseText: "Perfect. Nothing builds loyalty like meeting basic needs when the corps won't. Make sure our logo is prominently displayed at distribution. We need that brand association."
            },
            {
                text: "Can we drop the propaganda part?",
                outcome: "QUESTION",
                deltaRep: -2,
                deltaSusp: -1,
                specialEvent: "PURE_AID",
                responseText: "How adorably naive. This isn't charity - it's strategic narrative placement. But fine, we'll tone down the messaging. The implied debt will have to be enough."
            },
            {
                text: "Too risky with water enforcement active.",
                outcome: "DECLINE",
                deltaRep: -3,
                deltaSusp: 0,
                responseText: "Water cops got you scared? Disappointing. Those people will remember who abandoned them when they were thirsty. There's no neutral position in a drought."
            }
        ]
    },
    
    // Mission M-019: Botnet Seed Drop
    "M-019": {
        missionName: "Botnet Seed Drop",
        contact: "Riya Vex",
        portrait: "images/riya_portrait.png",
        npcLine: "We need to plant seed nodes for our new botnet across the Tech District. Fast data collection, minimal footprint.",
        choices: [
            {
                text: "I can place the seeds.",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 3,
                responseText: "Perfect. Each node you plant multiplies our reach exponentially. This will give us eyes and ears everywhere."
            },
            {
                text: "I want access to the data.",
                outcome: "NEGOTIATE",
                deltaRep: 0,
                deltaSusp: 6,
                bonusCredits: 0,
                bonusMorale: 50,
                responseText: "Ambitious! I can't give you full access, but I'll set you up with a premium feed. Just don't get greedy with what you see."
            },
            {
                text: "Sounds like a trap.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: -2,
                responseText: "Paranoid much? Fine, we'll find someone else. But don't come asking for intel when you need it most."
            }
        ]
    }
};

// Store mission outcomes for processing
const missionOutcomes = {};

// Show the mission dialogue for a given mission ID
function showMissionDialogue(missionId) {
    // Check if this is a ShillZ mission
    const dialogue = shillZDialogues[missionId];
    if (!dialogue) {
        console.error(`No dialogue found for mission ${missionId}`);
        return;
    }
    
    // Create dialogue container if it doesn't exist
    let container = document.getElementById('mission-dialogue-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mission-dialogue-container';
        document.body.appendChild(container);
    }
    
    // Mark container with mission ID for reference
    container.setAttribute('data-mission-id', missionId);
    
    // Set faction-specific class
    container.className = "faction-shillz";
    
    // Create the dialogue structure
    container.innerHTML = `
        <div class="mission-dialogue-box">
            <div class="mission-dialogue-header">
                <div class="faction-info">
                    <div class="faction-label">ShillZ Faction</div>
                    <div class="npc-name">${dialogue.contact}</div>
                    <div class="npc-title">${dialogue.title || "Representative"}</div>
                </div>
                <button class="close-dialogue-btn" onclick="closeMissionDialogue()">&times;</button>
            </div>
            <div class="mission-dialogue-content">
                <div class="npc-portrait">
                    <img src="${dialogue.portrait || 'images/riya_portrait.png'}" alt="${dialogue.contact}" id="npc-portrait-img">
                </div>
                <div class="dialogue-right-column">
                    <div class="npc-text">${dialogue.npcLine}</div>
                    <div class="player-choices"></div>
                    <div class="npc-response" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add the choices
    const choicesDiv = container.querySelector('.player-choices');
    dialogue.choices.forEach((choice, index) => {
        const choiceBtn = document.createElement('button');
        choiceBtn.className = 'choice-btn';
        choiceBtn.textContent = choice.text;
        
        // Set data attributes for handling the choice
        choiceBtn.setAttribute('data-mission-id', missionId);
        choiceBtn.setAttribute('data-choice-index', index);
        
        // Add click handler
        choiceBtn.addEventListener('click', handleMissionChoice);
        
        choicesDiv.appendChild(choiceBtn);
    });
    
    // Display the dialogue
    container.style.display = 'flex';
    
    console.log(`Showing mission dialogue for ${missionId}: ${dialogue.missionName}`);
}

// Handle player choice in mission dialogue
function handleMissionChoice(event) {
    // Get the mission ID and choice index
    const missionId = event.currentTarget.getAttribute('data-mission-id');
    const choiceIndex = parseInt(event.currentTarget.getAttribute('data-choice-index'));
    
    console.log(`Player chose option ${choiceIndex + 1} for mission ${missionId}`);
    
    // Hide the choices and show the response
    const choicesContainer = document.querySelector('.player-choices');
    const responseContainer = document.querySelector('.npc-response');
    if (choicesContainer) choicesContainer.style.display = 'none';
    if (responseContainer) responseContainer.style.display = 'block';
    
    // Get the dialogue for this mission
    const dialogue = shillZDialogues[missionId];
    if (!dialogue) {
        console.error(`No dialogue found for mission ${missionId}`);
        return;
    }
    
    // Get the choice
    const choice = dialogue.choices[choiceIndex];
    if (!choice) {
        console.error(`No choice found at index ${choiceIndex} for mission ${missionId}`);
        return;
    }
    
    // Display the response
    responseContainer.innerHTML = `<p>${choice.responseText || "..."}</p>`;
    
    // Process mission outcomes directly
    const gameState = window.gameState || {};
    
    // Apply reputation change
    if (choice.deltaRep !== 0) {
        console.log(`Applying reputation change for ShillZ: ${choice.deltaRep}`);
        // Update ShillZ reputation in game state
        if (!gameState.factionStanding) gameState.factionStanding = {};
        gameState.factionStanding["ShillZ"] = (gameState.factionStanding["ShillZ"] || 0) + choice.deltaRep;
        
        // Log the change
        if (window.addLogMessage) {
            window.addLogMessage(`ShillZ faction standing changed by ${choice.deltaRep}`);
        }
    }
    
    // Apply suspicion change
    if (choice.deltaSusp !== 0) {
        console.log(`Applying suspicion change: ${choice.deltaSusp}`);
        if (!gameState.suspicion) gameState.suspicion = 0;
        gameState.suspicion = Math.max(0, Math.min(100, gameState.suspicion + choice.deltaSusp));
        
        // Log the change
        if (window.addLogMessage) {
            window.addLogMessage(`Suspicion level changed by ${choice.deltaSusp}`);
        }
    }
    
    // Process mission outcome based on choice
    switch(choice.outcome) {
        case "ACCEPT":
            console.log(`Mission ${missionId} accepted`);
            // Add mission to active missions
            if (!gameState.activeMissions) gameState.activeMissions = [];
            gameState.activeMissions.push(missionId);
            
            // Log acceptance
            if (window.addLogMessage) {
                window.addLogMessage(`Mission ${dialogue.missionName} accepted`);
            }
            break;
            
        case "DECLINE":
            console.log(`Mission ${missionId} declined`);
            // Log decline
            if (window.addLogMessage) {
                window.addLogMessage(`Mission ${dialogue.missionName} declined`);
            }
            break;
            
        case "NEGOTIATE":
            console.log(`Mission ${missionId} negotiated`);
            // Add mission to active missions with negotiated flag
            if (!gameState.activeMissions) gameState.activeMissions = [];
            gameState.activeMissions.push(missionId);
            
            // Apply any bonus resources from negotiation
            if (choice.bonusCredits && gameState.resources) {
                gameState.resources.credits = (gameState.resources.credits || 0) + choice.bonusCredits;
                console.log(`Added ${choice.bonusCredits} bonus credits from negotiation`);
            }
            
            // Log negotiation
            if (window.addLogMessage) {
                window.addLogMessage(`Mission ${dialogue.missionName} negotiated`);
            }
            break;
    }
    
    // Update missions tab
    if (typeof window.updateMissionsTab === 'function') {
        setTimeout(window.updateMissionsTab, 500);
    }
    
    // Show continue button
    const continueBtn = document.createElement('button');
    continueBtn.className = 'continue-btn';
    continueBtn.textContent = 'Continue';
    continueBtn.addEventListener('click', closeMissionDialogue);
    responseContainer.appendChild(continueBtn);
}

// Process mission outcomes
function processMissionOutcomes(missionId, outcomes) {
    console.log(`Processing outcomes for mission ${missionId}:`, outcomes);
    
    const gameState = window.gameState || {};
    
    // Apply ShillZ reputation change
    if (outcomes.deltaRep !== 0 && window.aiDirector && window.aiDirector.applyReputationChange) {
        window.aiDirector.applyReputationChange("ShillZ", outcomes.deltaRep, gameState);
    }
    
    // Apply suspicion change
    if (outcomes.deltaSusp !== 0 && window.aiDirector) {
        if (window.aiDirector.directorState) {
            window.aiDirector.directorState.suspicion = Math.max(0, Math.min(100, 
                window.aiDirector.directorState.suspicion + outcomes.deltaSusp));
        }
    }
    
    // Apply bonus credits
    if (outcomes.bonusCredits && gameState.resources) {
        gameState.resources.credits = (gameState.resources.credits || 0) + outcomes.bonusCredits;
        console.log(`Added ${outcomes.bonusCredits} bonus credits`);
        
        // Show floating credit particles
        if (window.showResourceParticle) {
            window.showResourceParticle('credits', outcomes.bonusCredits);
        }
    }
    
    // Apply bonus morale
    if (outcomes.bonusMorale && gameState.resources) {
        gameState.resources.influence = (gameState.resources.influence || 0) + outcomes.bonusMorale;
        console.log(`Added ${outcomes.bonusMorale} bonus morale (influence)`);
        
        // Show floating morale/influence particles
        if (window.showResourceParticle) {
            window.showResourceParticle('influence', outcomes.bonusMorale);
        }
    }
    
    // Apply other faction reputation changes
    if (outcomes.factionRep) {
        for (const [faction, delta] of Object.entries(outcomes.factionRep)) {
            if (window.aiDirector && window.aiDirector.applyReputationChange) {
                window.aiDirector.applyReputationChange(faction, delta, gameState);
            }
        }
    }
    
    // Handle special events
    if (outcomes.specialEvent) {
        handleSpecialEvent(outcomes.specialEvent, gameState);
    }
    
    // Update mission state based on outcome
    updateMissionState(missionId, outcomes.outcome);
    
    // Log to analytics if available
    if (window.analytics && window.analytics.logMissionInteraction) {
        window.analytics.logMissionInteraction(missionId, outcomes.outcome, outcomes.deltaRep, outcomes.deltaSusp);
    }
}

// Handle special mission events
function handleSpecialEvent(eventType, gameState) {
    console.log(`Handling special event: ${eventType}`);
    
    switch (eventType) {
        case "CORPORATE_GIFT":
            // 80% chance of good outcome, 20% chance of bad
            if (Math.random() < 0.8) {
                // Good outcome - bonus credits
                const bonus = 1000;
                if (gameState.resources) {
                    gameState.resources.credits = (gameState.resources.credits || 0) + bonus;
                    
                    // Show floating particles
                    if (window.showResourceParticle) {
                        window.showResourceParticle('credits', bonus);
                    }
                    
                    // Add to log
                    if (window.addLogMessage) {
                        window.addLogMessage(`Corporate gift contained ${bonus} credits!`);
                    }
                }
            } else {
                // Bad outcome - lose credits, gain suspicion
                const penalty = 500;
                if (gameState.resources) {
                    gameState.resources.credits = Math.max(0, (gameState.resources.credits || 0) - penalty);
                    
                    // Show floating particles
                    if (window.showResourceParticle) {
                        window.showResourceParticle('credits', -penalty);
                    }
                    
                    // Add suspicion
                    if (window.aiDirector && window.aiDirector.directorState) {
                        window.aiDirector.directorState.suspicion += 5;
                    }
                    
                    // Add to log
                    if (window.addLogMessage) {
                        window.addLogMessage("The corporate gift was a trap! Lost credits and gained suspicion.");
                    }
                }
            }
            break;
            
        case "SHELTER_AID":
            // Provide genuine aid to the homeless
            if (gameState.resources) {
                // Costs some credits but gives morale
                const cost = 200;
                const moraleGain = 50;
                
                gameState.resources.credits = Math.max(0, (gameState.resources.credits || 0) - cost);
                gameState.resources.influence = (gameState.resources.influence || 0) + moraleGain;
                
                // Show floating particles
                if (window.showResourceParticle) {
                    window.showResourceParticle('credits', -cost);
                    window.showResourceParticle('influence', moraleGain);
                }
                
                // Add to log
                if (window.addLogMessage) {
                    window.addLogMessage(`Provided actual aid to the homeless. -${cost} credits, +${moraleGain} morale.`);
                }
            }
            break;
            
        case "PURE_AID":
            // Provide water without propaganda
            if (gameState.resources) {
                // Costs credits but gives morale and small ShillZ rep
                const cost = 150;
                const moraleGain = 40;
                
                gameState.resources.credits = Math.max(0, (gameState.resources.credits || 0) - cost);
                gameState.resources.influence = (gameState.resources.influence || 0) + moraleGain;
                
                // Add small ShillZ rep for the altruism
                if (window.aiDirector && window.aiDirector.applyReputationChange) {
                    window.aiDirector.applyReputationChange("ShillZ", 1, gameState);
                }
                
                // Show floating particles
                if (window.showResourceParticle) {
                    window.showResourceParticle('credits', -cost);
                    window.showResourceParticle('influence', moraleGain);
                }
                
                // Add to log
                if (window.addLogMessage) {
                    window.addLogMessage(`Provided pure aid without propaganda. -${cost} credits, +${moraleGain} morale.`);
                }
            }
            break;
            
        case "BOTNET_ACCESS":
            // Grant partial botnet access
            if (gameState.perks) {
                gameState.perks.botnetAccess = true;
                
                // Add tech points as a bonus
                if (gameState.resources) {
                    const techBonus = 2;
                    gameState.resources.techPoints = (gameState.resources.techPoints || 0) + techBonus;
                    
                    // Show floating particles
                    if (window.showResourceParticle) {
                        window.showResourceParticle('techPoints', techBonus);
                    }
                }
                
                // Add to log
                if (window.addLogMessage) {
                    window.addLogMessage("Gained limited access to ShillZ botnet. New hacking options available.");
                }
            }
            break;
    }
}

// Update mission state based on player's choice
function updateMissionState(missionId, outcome) {
    // Add to active missions if accepted
    if (outcome === "ACCEPT" || outcome === "NEGOTIATE") {
        if (window.aiDirector && window.aiDirector.directorState) {
            const directorState = window.aiDirector.directorState;
            
            // Find mission in catalog
            const mission = window.missionCatalog ? 
                window.missionCatalog.find(m => m.id === missionId) : 
                { id: missionId, faction: "ShillZ" };
            
            if (mission) {
                // Add to active missions if not already there
                if (!directorState.activeMissions.some(m => m.id === missionId)) {
                    directorState.activeMissions.push({
                        ...mission,
                        startTime: Date.now(),
                        negotiated: outcome === "NEGOTIATE"
                    });
                    
                    console.log(`Added mission ${missionId} to active missions`);
                }
            }
        }
    }
    
    // Lock mission if declined
    if (outcome === "DECLINE") {
        if (window.aiDirector && window.aiDirector.directorState) {
            const directorState = window.aiDirector.directorState;
            
            // Lock for 10 minutes
            const unlockTime = Date.now() + (10 * 60 * 1000);
            directorState.lockedMissions = directorState.lockedMissions || {};
            directorState.lockedMissions[missionId] = unlockTime;
            
            console.log(`Locked mission ${missionId} until ${new Date(unlockTime).toLocaleTimeString()}`);
        }
    }
}

// Close the mission dialogue
function closeMissionDialogue() {
    const dialogueContainer = document.getElementById('mission-dialogue-container');
    if (dialogueContainer) {
        dialogueContainer.style.display = 'none';
    }
}

// Replace placeholders in text with game values
function replacePlaceholders(text) {
    const gameState = window.gameState || {};
    
    // Replace placeholders like {credits}, {energy}, etc.
    return text.replace(/\{(\w+)\}/g, (match, key) => {
        if (gameState.resources && gameState.resources[key] !== undefined) {
            return gameState.resources[key];
        }
        return match;
    });
}

// Get all ShillZ mission dialogue IDs
function getShillZDialogueIds() {
    return Object.keys(shillZDialogues);
}

// Get a random ShillZ mission dialogue
function getRandomShillZDialogue() {
    const ids = getShillZDialogueIds();
    if (ids.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * ids.length);
    return ids[randomIndex];
}

// Make sure to expose these functions to the global scope
window.getRandomShillZDialogue = getRandomShillZDialogue;
window.showMissionDialogue = showMissionDialogue;
window.getShillZDialogueIds = getShillZDialogueIds;
window.processMissionOutcomes = processMissionOutcomes;
window.handleMissionChoice = handleMissionChoice;
window.handleSpecialEvent = handleSpecialEvent;

// Update the missions tab with available missions
function updateMissionsTab() {
    const missionsTab = document.getElementById('missions-tab');
    if (!missionsTab) {
        console.warn('Missions tab not found in the DOM');
        return;
    }
    
    // Get the game state
    const gameState = window.gameState || {};
    
    // Get available mission IDs (for ShillZ, we'll use a predefined list)
    const shillZMissions = ["M-001", "M-002", "M-003", "M-004", "M-005", "M-019"];
    const availableMissions = shillZMissions.map(id => {
        const dialogue = shillZDialogues[id];
        return {
            id: id,
            name: dialogue ? dialogue.missionName : id,
            faction: "ShillZ"
        };
    });
    
    // Get active missions from game state
    const activeMissionIds = gameState.activeMissions || [];
    const activeMissions = activeMissionIds.map(id => {
        const dialogue = shillZDialogues[id];
        return {
            id: id,
            name: dialogue ? dialogue.missionName : id,
            faction: "ShillZ"
        };
    });
    
    console.log('Active missions:', activeMissions);
    console.log('Available missions:', availableMissions);
    
    // Create missions list HTML
    let missionsHTML = '<h2>Missions</h2>';
    
    // Active missions section
    if (activeMissions.length > 0) {
        missionsHTML += '<div class="missions-group active-missions"><h3>Active Missions</h3>';
        activeMissions.forEach(mission => {
            missionsHTML += `
            <div class="mission-item active" data-mission-id="${mission.id}">
                <div class="mission-header">
                    <h4>${mission.name}</h4>
                    <span class="mission-faction">${mission.faction}</span>
                </div>
                <div class="mission-actions">
                    <button class="mission-complete-btn" data-mission-id="${mission.id}" data-success="true">Complete</button>
                    <button class="mission-fail-btn" data-mission-id="${mission.id}" data-success="false">Fail</button>
                </div>
            </div>`;
        });
        missionsHTML += '</div>';
    }
    
    // Available missions section - filter out active missions
    const filteredAvailableMissions = availableMissions.filter(mission => 
        !activeMissionIds.includes(mission.id)
    );
    
    if (filteredAvailableMissions.length > 0) {
        missionsHTML += '<div class="missions-group available-missions"><h3>Available Missions</h3>';
        filteredAvailableMissions.forEach(mission => {
            missionsHTML += `
            <div class="mission-item available" data-mission-id="${mission.id}">
                <div class="mission-header">
                    <h4>${mission.name}</h4>
                    <span class="mission-faction">${mission.faction}</span>
                </div>
                <div class="mission-actions">
                    <button class="mission-contact-btn" data-mission-id="${mission.id}">Contact</button>
                </div>
            </div>`;
        });
        missionsHTML += '</div>';
    }
    
    // Update the missions tab content
    missionsTab.innerHTML = missionsHTML;
    
    // Add event listeners to mission buttons
    const contactButtons = missionsTab.querySelectorAll('.mission-contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const missionId = this.getAttribute('data-mission-id');
            if (typeof window.showMissionDialogue === 'function') {
                window.showMissionDialogue(missionId);
            }
        });
    });
    
    // Add event listeners for completion buttons
    const completeButtons = missionsTab.querySelectorAll('.mission-complete-btn, .mission-fail-btn');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const missionId = this.getAttribute('data-mission-id');
            const success = this.getAttribute('data-success') === 'true';
            
            // Process mission completion directly
            console.log(`Completing mission ${missionId}, success: ${success}`);
            
            // Remove from active missions
            if (gameState.activeMissions) {
                const index = gameState.activeMissions.indexOf(missionId);
                if (index !== -1) {
                    gameState.activeMissions.splice(index, 1);
                }
            }
            
            // Track completed missions
            if (!gameState.completedMissions) gameState.completedMissions = [];
            gameState.completedMissions.push(missionId);
            
            // Apply completion effects
            if (success) {
                // Apply success effects (reward resources, reputation, etc.)
                if (!gameState.factionStanding) gameState.factionStanding = {};
                gameState.factionStanding["ShillZ"] = (gameState.factionStanding["ShillZ"] || 0) + 5;
                
                // Add resources reward
                if (gameState.resources) {
                    gameState.resources.credits = (gameState.resources.credits || 0) + 500;
                    gameState.resources.followers = (gameState.resources.followers || 0) + 100;
                }
                
                // Log success
                if (window.addLogMessage) {
                    const dialogue = shillZDialogues[missionId];
                    window.addLogMessage(`Mission ${dialogue ? dialogue.missionName : missionId} completed successfully!`);
                }
            } else {
                // Apply failure effects
                if (!gameState.factionStanding) gameState.factionStanding = {};
                gameState.factionStanding["ShillZ"] = (gameState.factionStanding["ShillZ"] || 0) - 2;
                
                // Log failure
                if (window.addLogMessage) {
                    const dialogue = shillZDialogues[missionId];
                    window.addLogMessage(`Mission ${dialogue ? dialogue.missionName : missionId} failed.`);
                }
            }
            
            // Update the missions tab
            setTimeout(updateMissionsTab, 500);
        });
    });
}

// Make sure to call this function when the game loads
document.addEventListener('DOMContentLoaded', function() {
    // Initial update of the missions tab
    updateMissionsTab();
    
    // Set up periodic refresh of missions tab
    setInterval(updateMissionsTab, 60000); // Refresh every minute
});

// Make this function available globally
window.updateMissionsTab = updateMissionsTab; 