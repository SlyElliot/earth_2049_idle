// Cyberpunk Idle Game - Progression System

// Initialize progression system
function initProgressionSystem() {
    console.log("Initializing progression system...");
    
    // Initialize milestones
    initMilestones();
    
    // Initialize story events
    initStoryEvents();
    
    // Initialize achievements
    initAchievements();
    
    // Start checking for progression triggers
    setInterval(checkProgressionTriggers, 5000);
    
    console.log("Progression system initialized");
    return true;
}

// Initialize milestones
function initMilestones() {
    gameState.progression.milestones = {
        firstCredit: {
            triggered: false,
            condition: () => gameState.resources.credits >= 1,
            action: () => {
                addLogMessage("Milestone: You've earned your first credit in the system.");
                unlockAchievement("firstSteps");
            }
        },
        tenCredits: {
            triggered: false,
            condition: () => gameState.resources.credits >= 10,
            action: () => {
                addLogMessage("Milestone: Your credit balance has reached double digits.");
                showModal("Milestone Reached", "You've accumulated 10 credits. You're starting to understand how the system works.");
            }
        },
        firstBoost: { // Renamed from firstUpgrade
            triggered: false,
            condition: () => Object.values(gameState.baseProductionBoosts).some(boost => boost.level > 0),
            action: () => {
                addLogMessage("Milestone: You've purchased your first boost.");
                unlockAchievement("upgradeInitiate"); // Keep achievement ID for now?
            }
        },
        firstTech: { // Renamed from firstResearch
            triggered: false,
            condition: () => Object.values(gameState.techTree).some(tech => tech.completed),
            action: () => {
                addLogMessage("Milestone: You've completed your first tech research.");
                unlockAchievement("researchBeginnings"); // Keep achievement ID for now?
            }
        },
        firstTerritory: { // Renamed from firstDistrict
            triggered: false,
            condition: () => Object.values(gameState.territories).some(territory => territory.unlocked),
            action: () => {
                addLogMessage("Milestone: You've unlocked your first territory.");
                unlockAchievement("districtExpansion"); // Keep achievement ID for now?
            }
        },
        // Removed firstHack milestone as operations structure changed
        // Removed quantumEra milestone as operations structure changed
        corporateInfluenceMilestone: { // Renamed from corporateInfluence
            triggered: false,
            condition: () => gameState.resources.credits >= 1000,
            action: () => {
                addLogMessage("Milestone: Your corporate influence has grown significantly.");
                showModal("Corporate Influence", "With 1,000 credits at your disposal, you're becoming a notable player in the cyberpunk world.");
                unlockAchievement("corporateClimber");
            }
        },
        techPointsMonger: { // Renamed from dataMonger
            triggered: false,
            condition: () => gameState.resources.techPoints >= 500,
            action: () => {
                addLogMessage("Milestone: You've become a significant tech broker.");
                unlockAchievement("dataMonger"); // Keep achievement ID for now?
            }
        },
        energyMogul: {
            triggered: false,
            condition: () => gameState.resources.energy >= 300,
            action: () => {
                addLogMessage("Milestone: Your energy production has reached industrial levels.");
                unlockAchievement("energyMogul");
            }
        },
        infamousFigure: { // Renamed from infamousHacker
            triggered: false,
            condition: () => gameState.resources.influence >= 200,
            action: () => {
                addLogMessage("Milestone: Your influence in the underground has made you infamous.");
                unlockAchievement("infamousHacker"); // Keep achievement ID for now?
            }
        },
        corporateOverlord: {
            triggered: false,
            condition: () => {
                return gameState.resources.credits >= 5000 && 
                       gameState.resources.techPoints >= 2000 && 
                       gameState.resources.energy >= 1000 && 
                       gameState.resources.influence >= 500;
            },
            action: () => {
                addLogMessage("Milestone: You've become a corporate overlord in the cyberpunk world.");
                showModal("Corporate Overlord", "Your influence spans across all sectors of the dystopian society. You've reached the pinnacle of power in this cyberpunk world.");
                unlockAchievement("corporateOverlord");
            }
        }
    };
}

// Initialize story events
function initStoryEvents() {
    gameState.progression.storyEvents = {
        welcomeMessage: {
            triggered: false,
            condition: () => true, // Triggers immediately
            action: () => {
                setTimeout(() => {
                    showModal("Welcome to Earth 2039", // Updated Title
                        `<p>In the neon-lit streets of Earth 2039, GigaCorp rules with an iron fist. You're just starting your journey to build a rebellion.</p>
                        <p>Begin by mining credits, then expand your operations through boosts, items, tech, and territories.</p>
                        <p>Will you restore freedom, or will you be crushed by the corporate machine?</p>` // Updated Text
                    );
                }, 2000);
            }
        },
        corporateRivalry: {
            triggered: false,
            condition: () => gameState.baseProductionBoosts.autoMiner?.level >= 5, // Updated reference to autoMiner
            action: () => {
                addLogMessage("Story Event: A rival faction has noticed your growing operations.");
                setTimeout(() => {
                    showModal("Faction Rivalry", // Updated Title
                        `<p>Your growing credit operations have caught the attention of a minor faction in the sector.</p>
                        <p>They've started monitoring your activities. This could lead to opportunities or challenges in the future.</p>
                        <p>Consider diversifying your operations to stay ahead of potential conflicts.</p>` // Updated Text
                    );
                }, 1000);
            }
        },
        dataBreachDiscovery: {
            triggered: false,
            condition: () => gameState.baseProductionBoosts.techBoostTechPoints.level >= 3, // Updated reference
            action: () => {
                addLogMessage("Story Event: Your tech probes have discovered a vulnerable GigaCorp database.");
                setTimeout(() => {
                    showModal("Data Breach Opportunity", 
                        `<p>Your tech probes have identified a vulnerability in GigaCorp's security systems.</p>
                        <p>This could be an opportunity to acquire valuable tech points, but it comes with risks.</p>
                        <p>Consider researching better hacking tech before attempting to exploit this vulnerability.</p>` // Updated Text
                    );
                    // Removed old operations unlock logic
                }, 1000);
            }
        },
        energyCrisis: {
            triggered: false,
            condition: () => gameState.baseProductionBoosts.techBoostEnergy.level >= 4, // Updated reference
            action: () => {
                addLogMessage("Story Event: An energy crisis is affecting the lower sectors.");
                setTimeout(() => {
                    showModal("Energy Crisis", 
                        `<p>The lower sectors are experiencing rolling blackouts due to GigaCorp energy rationing.</p>
                        <p>Your energy production capabilities put you in a position to either exploit or alleviate this situation.</p>
                        <p>Exploiting the crisis could yield short-term credits but might damage your influence among the people.</p>` // Updated Text
                    );
                    
                    // Give player a choice
                    const exploitButton = document.createElement('button');
                    exploitButton.textContent = 'Exploit Crisis (Credits +100, Influence -20)'; // Updated resource name
                    exploitButton.onclick = () => {
                        gameState.resources.credits += 100;
                        gameState.resources.influence -= 20; // Updated resource name
                        updateResourceDisplay();
                        addLogMessage("You've exploited the energy crisis for profit at the cost of your influence.");
                        closeModal();
                    };
                    
                    const helpButton = document.createElement('button');
                    helpButton.textContent = 'Provide Aid (Credits -50, Influence +30)'; // Updated resource name
                    helpButton.onclick = () => {
                        gameState.resources.credits -= 50;
                        gameState.resources.influence += 30; // Updated resource name
                        updateResourceDisplay();
                        addLogMessage("You've provided aid during the energy crisis, improving your influence.");
                        closeModal();
                    };
                    
                    const ignoreButton = document.createElement('button');
                    ignoreButton.textContent = 'Ignore Crisis';
                    ignoreButton.onclick = () => {
                        addLogMessage("You've chosen to ignore the energy crisis.");
                        closeModal();
                    };
                    
                    document.getElementById('modal-content').appendChild(document.createElement('br'));
                    document.getElementById('modal-content').appendChild(exploitButton);
                    document.getElementById('modal-content').appendChild(helpButton);
                    document.getElementById('modal-content').appendChild(ignoreButton);
                }, 1000);
            }
        },
        corporateEspionage: {
            triggered: false,
            condition: () => gameState.techTree.aiAutomation.completed, // Updated reference
            action: () => {
                addLogMessage("Story Event: Your AI research has been targeted by GigaCorp spies.");
                setTimeout(() => {
                    showModal("Corporate Espionage", 
                        `<p>Your breakthroughs in AI technology have made you a target for GigaCorp espionage.</p>
                        <p>Security logs show unauthorized access attempts to your research facilities.</p>
                        <p>Enhancing your security now could prevent future tech point theft.</p>` // Updated Text
                    );
                    
                    // Give player a security upgrade option
                    const upgradeButton = document.createElement('button');
                    upgradeButton.textContent = 'Upgrade Security (Credits -200, Tech Points -50)'; // Updated resource name
                    upgradeButton.onclick = () => {
                        if (gameState.resources.credits >= 200 && gameState.resources.techPoints >= 50) { // Updated resource name
                            gameState.resources.credits -= 200;
                            gameState.resources.techPoints -= 50; // Updated resource name
                            updateResourceDisplay();
                            addLogMessage("You've upgraded your security systems to protect against corporate espionage.");
                            unlockAchievement("securityMinded");
                            closeModal();
                        } else {
                            addLogMessage("You don't have enough resources to upgrade security.");
                        }
                    };
                    
                    const ignoreButton = document.createElement('button');
                    ignoreButton.textContent = 'Ignore Threat';
                    ignoreButton.onclick = () => {
                        addLogMessage("You've chosen to ignore the espionage threat.");
                        
                        // 50% chance of tech point loss
                        if (Math.random() < 0.5) {
                            setTimeout(() => {
                                const techLoss = Math.floor(gameState.resources.techPoints * 0.3); // Updated resource name
                                gameState.resources.techPoints -= techLoss; // Updated resource name
                                updateResourceDisplay();
                                addLogMessage(`GigaCorp spies have stolen ${techLoss} tech points from your systems!`);
                            }, 60000); // Happens after 1 minute
                        }
                        
                        closeModal();
                    };
                    
                    document.getElementById('modal-content').appendChild(document.createElement('br'));
                    document.getElementById('modal-content').appendChild(upgradeButton);
                    document.getElementById('modal-content').appendChild(ignoreButton);
                }, 1000);
            }
        },
        quantumDiscovery: { // Renamed to advancedHackingDiscovery
            triggered: false,
            condition: () => gameState.techTree.advancedHacking.completed, // Updated reference
            action: () => {
                addLogMessage("Story Event: Your advanced hacking research has led to a significant discovery.");
                setTimeout(() => {
                    showModal("Hacking Breakthrough", // Updated Title
                        `<p>Your research team has achieved a breakthrough in hacking technology.</p>
                        <p>This discovery could revolutionize data acquisition and system infiltration.</p>
                        <p>The implications for your capabilities are significant.</p>` // Updated Text
                    );
                    // Removed old operations unlock logic
                }, 1000);
            }
        },
        artificialConsciousness: { // Renamed to ogDeviceEvent
            triggered: false,
            condition: () => gameState.techTree.ogDeviceUpgrade.completed, // Updated reference
            action: () => {
                addLogMessage("Story Event: Your OG Device upgrade has yielded unexpected results.");
                setTimeout(() => {
                    showModal("OG Device Anomaly", // Updated Title
                        `<p>Upgrading the OG Device has caused strange temporal fluctuations.</p>
                        <p>You receive fragmented messages from... the past? Or the future?</p>
                        <p>This development requires further investigation.</p>` // Updated Text
                    );
                    // Removed old autonomous agent unlock logic
                }, 1000);
            }
        },
        downtownUnlocked: {
            triggered: false,
            condition: () => gameState.territories.downtown.unlocked, // Updated reference
            action: () => {
                addLogMessage("Story Event: You've gained access to the Downtown territory.");
                setTimeout(() => {
                    showModal("Downtown Access", 
                        `<p>Unlocking the Downtown territory gives you access to new resources and opportunities.</p>
                        <p>This area is bustling with corporate activity and potential recruits.</p>
                        <p>Explore the possibilities this new territory offers.</p>`
                    );
                }, 1000);
            }
        },
        techDistrictUnlocked: {
            triggered: false,
            condition: () => gameState.territories.techDistrict.unlocked, // Updated reference
            action: () => {
                addLogMessage("Story Event: You've secured the Tech District.");
                setTimeout(() => {
                    showModal("Tech District Secured", 
                        `<p>The Tech District is now under your influence.</p>
                        <p>This area is crucial for advancing your technological capabilities.</p>
                        <p>Leverage the resources and connections here to further your goals.</p>`
                    );
                }, 1000);
            }
        },
        governmentQuarterUnlocked: { // Renamed from corporateTowersUnlocked
            triggered: false,
            condition: () => gameState.territories.governmentQuarter.unlocked, // Updated reference
            action: () => {
                addLogMessage("Story Event: You've infiltrated the Government Quarter.");
                setTimeout(() => {
                    showModal("Government Quarter Infiltration", // Updated Title
                        `<p>Gaining influence in the Government Quarter is a major step.</p>
                        <p>This gives you access to sensitive information and political leverage.</p>
                        <p>Be cautious, as GigaCorp's presence is strong here.</p>` // Updated Text
                    );
                }, 1000);
            }
        },
        undergroundDenUnlocked: { // Renamed from undergroundMarketUnlocked
            triggered: false,
            condition: () => gameState.territories.undergroundHackersDen.unlocked, // Updated reference
            action: () => {
                addLogMessage("Story Event: You've established a connection with the Underground Hackers Den.");
                setTimeout(() => {
                    showModal("Underground Access", // Updated Title
                        `<p>The Underground Hackers Den provides access to black markets and skilled operatives.</p>
                        <p>This network operates outside GigaCorp's direct control.</p>
                        <p>Utilize these connections wisely.</p>` // Updated Text
                    );
                }, 1000);
            }
        },
        aiLabUnlocked: { // Renamed from researchCampusUnlocked
            triggered: false,
            condition: () => gameState.territories.artificialIntelligenceLab.unlocked, // Updated reference
            action: () => {
                addLogMessage("Story Event: You've gained control of the Artificial Intelligence Lab.");
                setTimeout(() => {
                    showModal("AI Lab Control", // Updated Title
                        `<p>Controlling the AI Lab grants access to cutting-edge research and development.</p>
                        <p>This facility is key to challenging GigaCorp's technological supremacy.</p>
                        <p>Expect heavy resistance as you utilize its potential.</p>` // Updated Text
                    );
                }, 1000);
            }
        }
        // Removed orbitalStationUnlocked event
    };
}

// Initialize achievements
function initAchievements() {
    gameState.progression.achievements = {
        firstSteps: {
            name: "First Steps",
            description: "Earn your first credit.",
            unlocked: false
        },
        upgradeInitiate: {
            name: "Boost Initiate", // Renamed
            description: "Purchase your first boost.",
            unlocked: false
        },
        researchBeginnings: {
            name: "Tech Beginnings", // Renamed
            description: "Complete your first tech research.",
            unlocked: false
        },
        districtExpansion: {
            name: "Territory Expansion", // Renamed
            description: "Unlock your first territory.",
            unlocked: false
        },
        quantumPioneer: {
            name: "Hacking Pioneer", // Renamed
            description: "Unlock advanced hacking capabilities.", // Updated description
            unlocked: false
        },
        corporateClimber: {
            name: "Influence Climber", // Renamed
            description: "Reach 1,000 credits.",
            unlocked: false
        },
        dataMonger: {
            name: "Tech Monger", // Renamed
            description: "Accumulate 500 tech points.", // Updated resource name
            unlocked: false
        },
        energyMogul: {
            name: "Energy Mogul",
            description: "Accumulate 300 energy.",
            unlocked: false
        },
        infamousHacker: {
            name: "Infamous Figure", // Renamed
            description: "Reach 200 influence.", // Updated resource name
            unlocked: false
        },
        securityMinded: {
            name: "Security Minded",
            description: "Upgrade your security systems.",
            unlocked: false
        },
        corporateOverlord: {
            name: "Rebellion Leader", // Renamed
            description: "Reach 5,000 credits, 2,000 tech points, 1,000 energy, and 500 influence.", // Updated resource names
            unlocked: false
        }
    };
}

// Unlock an achievement
function unlockAchievement(achievementId) {
    if (gameState.progression.achievements[achievementId] && !gameState.progression.achievements[achievementId].unlocked) {
        gameState.progression.achievements[achievementId].unlocked = true;
        addLogMessage(`Achievement Unlocked: ${gameState.progression.achievements[achievementId].name}`);
        updateAchievementsDisplay();
        // Optionally show a notification
        // showNotification(`Achievement Unlocked: ${gameState.progression.achievements[achievementId].name}`);
    }
}

// Check for progression triggers (milestones, story events)
function checkProgressionTriggers() {
    // Check Milestones
    for (const milestoneId in gameState.progression.milestones) {
        const milestone = gameState.progression.milestones[milestoneId];
        if (!milestone.triggered && milestone.condition()) {
            milestone.triggered = true;
            milestone.action();
        }
    }
    
    // Check Story Events
    for (const eventId in gameState.progression.storyEvents) {
        const storyEvent = gameState.progression.storyEvents[eventId];
        if (!storyEvent.triggered && storyEvent.condition()) {
            storyEvent.triggered = true;
            storyEvent.action();
        }
    }
}

// Update achievements display
function updateAchievementsDisplay() {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList) return; // Exit if element not found
    
    achievementsList.innerHTML = ''; // Clear existing list
    
    let unlockedCount = 0;
    for (const achievementId in gameState.progression.achievements) {
        const achievement = gameState.progression.achievements[achievementId];
        if (achievement.unlocked) {
            const achievementElement = document.createElement('div');
            achievementElement.classList.add('achievement-item', 'unlocked');
            achievementElement.innerHTML = `<strong>${achievement.name}</strong>: ${achievement.description}`;
            achievementsList.appendChild(achievementElement);
            unlockedCount++;
        }
    }
    
    if (unlockedCount === 0) {
        achievementsList.innerHTML = '<p>No achievements unlocked yet.</p>';
    }
}

// Toggle achievements section visibility
function toggleAchievements() {
    const achievementsSection = document.getElementById('achievements-section');
    if (achievementsSection.style.display === 'block') {
        achievementsSection.style.display = 'none';
    } else {
        achievementsSection.style.display = 'block';
        updateAchievementsDisplay(); // Update content when shown
    }
}

