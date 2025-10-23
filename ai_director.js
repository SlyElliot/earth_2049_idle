// Turing AI Director System
// Based on the modular design in the specification

// Analytics Tracker - new addition to measure impact and player response
class AnalyticsTracker {
    constructor() {
        this.firesById = {};          // id → count
        this.impactByCategory = {};   // category → {totalΔwinProb, uses}
        this.boredomSignal = 0;       // +1 every repeat within short window, -1 on new event
        this.loopMetrics = [];        // per-run summary objects
        this.currentTickLog = null;   // latest event log
        this.missionInteractions = {};
        this.missionCompletions = {};
        this.diplomaticInteractions = {};
    }

    logFire(event, gameState) {
        this.firesById[event.id] = (this.firesById[event.id] || 0) + 1;

        // Quick boredom heuristic - check for repeats in recent history
        const recentEvents = directorState.recentEvents.slice(-5);
        const recentRepeats = recentEvents.filter(e => e.id === event.id).length;
        
        if (recentRepeats > 1) {
            this.boredomSignal += 1;
        } else {
            this.boredomSignal = Math.max(0, this.boredomSignal - 0.5);
        }

        // Capture snapshot for later analysis
        this.currentTickLog = {
            eventId: event.id,
            category: event.category,
            suspicion: directorState.suspicion,
            tension: directorState.tension,
            exposure: directorState.exposure,
            morale: getResourceValue(gameState, 'morale'),
            timestamp: Date.now()
        };

        console.log(`Analytics: Event fired - ${event.id}, boredom: ${this.boredomSignal.toFixed(1)}`);
    }

    logResolution(eventId, deltaWinProb) {
        // Extract category from event id (e.g., "sabotage_powergrid_L1" -> "sabotage")
        const category = eventId.split('_')[0].charAt(0).toUpperCase() + eventId.split('_')[0].slice(1);
        
        const bucket = (this.impactByCategory[category] ||= {total: 0, uses: 0});
        bucket.total += deltaWinProb;
        bucket.uses += 1;

        console.log(`Analytics: Event resolved - ${eventId}, impact: ${deltaWinProb}`);
    }

    // Called between loops (roguelike resets)
    endLoopSummary(result) {
        this.loopMetrics.push({
            loopCompleted: result.loop,
            duration: result.time,
            win: result.victory,
            boredom: this.boredomSignal,
            eventsFired: Object.values(this.firesById).reduce((a, b) => a + b, 0)
        });

        // Reset boredom for new loop
        this.boredomSignal = 0;

        console.log(`Analytics: Loop ${result.loop} summary recorded, victory: ${result.victory}`);
    }

    // Get analytics summary for debug or ML training
    getSummary() {
        // Calculate most fired events
        const sortedEvents = Object.entries(this.firesById)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Calculate category effectiveness
        const categoryEffectiveness = {};
        for (const [cat, data] of Object.entries(this.impactByCategory)) {
            if (data.uses > 0) {
                categoryEffectiveness[cat] = data.total / data.uses;
            }
        }

        return {
            totalEvents: Object.values(this.firesById).reduce((a, b) => a + b, 0),
            topEvents: sortedEvents,
            boredomLevel: this.boredomSignal,
            categoryEffectiveness: categoryEffectiveness,
            completedLoops: this.loopMetrics.length,
            winRate: this.loopMetrics.filter(m => m.win).length / Math.max(1, this.loopMetrics.length),
            missions: {
                interactions: this.missionInteractions || {},
                completions: this.missionCompletions || {},
                acceptRate: this.calculateMissionAcceptRate(),
                successRate: this.calculateMissionSuccessRate()
            },
            diplomacy: {
                interactions: this.diplomaticInteractions || {}
            }
        };
    }

    // Mission interaction tracking
    logMissionInteraction(missionId, outcome, deltaRep, deltaSusp) {
        this.missionInteractions[missionId] = this.missionInteractions[missionId] || [];
        
        this.missionInteractions[missionId].push({
            timestamp: Date.now(),
            outcome: outcome,
            deltaRep: deltaRep,
            deltaSusp: deltaSusp
        });
        
        console.log(`Analytics: Mission interaction - ${missionId}, outcome: ${outcome}`);
    }
    
    // Mission completion tracking
    logMissionCompletion(missionId, success) {
        const stats = this.missionCompletions[missionId] || { attempts: 0, successes: 0, fails: 0 };
        stats.attempts++;
        if (success) {
            stats.successes++;
        } else {
            stats.fails++;
        }
        
        console.log(`Analytics: Mission completion - ${missionId}, success: ${success}`);
    }
    
    // Calculate mission accept rate
    calculateMissionAcceptRate() {
        if (!this.missionInteractions) return 0;
        
        let totalOffers = 0;
        let totalAccepts = 0;
        
        for (const interactions of Object.values(this.missionInteractions)) {
            totalOffers += interactions.length;
            totalAccepts += interactions.filter(i => 
                i.outcome === "ACCEPT" || i.outcome === "NEGOTIATE"
            ).length;
        }
        
        return totalOffers > 0 ? totalAccepts / totalOffers : 0;
    }
    
    // Calculate mission success rate
    calculateMissionSuccessRate() {
        if (!this.missionCompletions) return 0;
        
        let totalAttempts = 0;
        let totalSuccesses = 0;
        
        for (const stats of Object.values(this.missionCompletions)) {
            totalAttempts += stats.attempts;
            totalSuccesses += stats.successes;
        }
        
        return totalAttempts > 0 ? totalSuccesses / totalAttempts : 0;
    }
    
    // Diplomatic interaction tracking
    logDiplomaticInteraction(factionId, outcome, deltaRep, deltaSusp) {
        this.diplomaticInteractions = this.diplomaticInteractions || {};
        this.diplomaticInteractions[factionId] = this.diplomaticInteractions[factionId] || [];
        
        this.diplomaticInteractions[factionId].push({
            timestamp: Date.now(),
            outcome: outcome,
            deltaRep: deltaRep,
            deltaSusp: deltaSusp
        });
        
        console.log(`Analytics: Diplomatic interaction - ${factionId}, outcome: ${outcome}`);
    }
}

// Initialize analytics
const analytics = new AnalyticsTracker();

// Main state object for the AI Director
const directorState = {
    // Core state metrics
    tension: 50,          // 0-100, current excitement level
    suspicion: 20,         // 0-100, how "loud" the player is
    novelty: {},          // Map of eventId -> timesSeen
    exposure: 0,          // 0-100, proximity to truth/endgame
    anomalyBudget: 100,   // How much "meddling" is allowed in current cycle
    
    // Memory and loop tracking
    loopCount: 1,
    memoryShards: [],
    behaviorFingerprint: {
        rushScore: 0,
        turtleScore: 0,
        afkScore: 0,
        aggressionScore: 0
    },
    
    // Timing and intervals
    lastAnalysisTick: Date.now(),
    lastDirectorPulse: Date.now(),
    pulseInterval: 180000,  // 3 minutes between director interventions
    
    // Active effects
    activeEffects: [],
    
    // Event history
    recentEvents: [],
    
    // Faction standing (0-100)
    factionStanding: {
        "GIGACORP": 0,
        "Muskers": 0,
        "Cryptids": 0,
        "ShillZ": 0,
        "The Bots": 0
    },
    
    // Available missions
    availableMissions: [],
    
    // Active missions
    activeMissions: [],
    
    // Completed missions
    completedMissions: [],
    
    // Locked missions (id -> unlock time)
    lockedMissions: {},
    
    // Last reputation change time (for decay)
    lastRepDecay: Date.now()
};

// Cache for loaded events
let eventCache = null;

// Load events from CSV
async function loadEvents() {
    if (eventCache) return eventCache;
    
    try {
        // Parse the CSV data
        const events = await parseCSV();
        eventCache = events;
        console.log(`Loaded ${events.length} director events`);
        return events;
    } catch (error) {
        console.error("Failed to load director events:", error);
        return [];
    }
}

// Parse CSV - fetch and parse the actual CSV file
async function parseCSV() {
    try {
        // Fetch the CSV file
        const response = await fetch('ai_director_events.csv');
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        // Parse each line into an event object
        const events = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length !== headers.length) continue; // Skip malformed lines
            
            const event = {};
            for (let j = 0; j < headers.length; j++) {
                const value = values[j].trim();
                
                // Convert special values
                if (value === '–' || value === '-') {
                    event[headers[j]] = null; // Use null for dashes/placeholders
                }
                // Parse numeric values
                else if (['baseWeight', 'minDistrictsOwned', 'minResourceAmt', 'suspLow', 'suspHigh', 'durationSec'].includes(headers[j])) {
                    event[headers[j]] = parseFloat(value);
                } 
                // Parse special values like effectValue (could be numeric or string)
                else if (headers[j] === 'effectValue') {
                    // Check if it's a percentage, modifier, or other special format
                    if (value.includes('%')) {
                        event[headers[j]] = value; // Keep percentage as string
                    } else if (value.includes('+') || value.includes('-') || value.includes('/')) {
                        event[headers[j]] = value; // Keep special formats as string
                    } else {
                        // Try to parse as number if possible
                        const numericValue = parseFloat(value);
                        event[headers[j]] = isNaN(numericValue) ? value : numericValue;
                    }
                }
                else {
                    event[headers[j]] = value;
                }
            }
            
            events.push(event);
        }
        
        return events;
    } catch (error) {
        console.error("Error parsing CSV:", error);
        // Fallback to hardcoded events if CSV parsing fails
        return [
            // Just a few sample events as fallback
        {
            id: "sabotage_powergrid_L1",
            category: "Sabotage",
            baseWeight: 25,
            minDistrictsOwned: 4,
            minResourceType: "productivity",
            minResourceAmt: 5000,
            suspLow: 20,
            suspHigh: 80,
            effectType: "modifier",
            effectTarget: "productivity",
            effectValue: 0.6,
            durationSec: 120,
            dialogueTag: "powergrid_warn"
        },
            // Add a few more fallback events...
        {
            id: "glitch_ui_scanline",
            category: "GlitchFX",
            baseWeight: 24,
            minDistrictsOwned: 1,
            minResourceType: "productivity",
            minResourceAmt: 0,
            suspLow: 0,
            suspHigh: 60,
            effectType: "uiGlitch",
            effectTarget: "scanline",
            effectValue: "medium",
            durationSec: 30,
            dialogueTag: "ui_scan"
            }
        ];
    }
}

// Main Analytics Engine
function updateAnalytics(gameState) {
    // Update timing
    const now = Date.now();
    const timeSinceLastAnalysis = now - directorState.lastAnalysisTick;
    
    // Update behavior fingerprint based on player actions
    updateBehaviorFingerprint(gameState);
    
    // Calculate tension based on recent actions and resource changes
    updateTensionGauge(gameState);
    
    // Update suspicion based on player actions and dialogue choices
    updateSuspicionLevel(gameState);
    
    // Update exposure based on progress and territory control
    updateExposureLevel(gameState);
    
    // Decay anomaly budget over time
    if (timeSinceLastAnalysis > 60000) { // Every minute
        // Regenerate some anomaly budget
        directorState.anomalyBudget = Math.min(100, directorState.anomalyBudget + 10);
    }
    
    // Clear expired effects
    cleanupExpiredEffects();
    
    // Update last analysis tick
    directorState.lastAnalysisTick = now;
}

// Update the player's behavior fingerprint
function updateBehaviorFingerprint(gameState) {
    // Analyze player's style - rushes tech, turtles, aggressive, etc.
    // This would track metrics over time
    
    // Example logic:
    const fingerprint = directorState.behaviorFingerprint;
    
    // If player captures territories quickly
    if (gameState.territories && Object.values(gameState.territories).filter(t => t.unlocked).length > 5) {
        fingerprint.rushScore += 1;
    }
    
    // If player accumulates large resource stockpiles
    if (gameState.resources.credits > 10000) {
        fingerprint.turtleScore += 1;
    }
    
    // If player hasn't clicked in a while
    // This would need to be tracked elsewhere
    
    // If player chooses aggressive dialogue options
    // This would need dialogue choice tracking
}

// Update the tension gauge based on recent events
function updateTensionGauge(gameState) {
    // Tension rises with:
    // - Fast territory captures
    // - Big resource swings
    // - Active combat/missions
    
    // Tension falls with:
    // - Long idle periods
    // - Stable resource generation
    
    // Simple decay model - tension slowly falls to baseline
    if (directorState.tension > 50) {
        directorState.tension -= 1;
    } else if (directorState.tension < 50) {
        directorState.tension += 1;
    }
    
    // Actual implementation would look at resource deltas and territory capture rates
}

// Update suspicion level based on player actions
function updateSuspicionLevel(gameState) {
    // Suspicion rises with:
    // - Talking back to Turing
    // - Aggressive expansion
    // - Finding hidden elements
    
    // Suspicion falls with:
    // - Laying low
    // - Time passing
    
    // Simple implementation - suspicion slowly falls
    if (directorState.suspicion > 0) {
        directorState.suspicion -= 0.1;
    }
    
    // Real implementation would track player dialogue and actions
}

// Update exposure level
function updateExposureLevel(gameState) {
    // Exposure is progress toward the truth/endgame
    // Rises with:
    // - Capturing key territories
    // - Finding "Truth" fragments
    // - Completing special missions
    
    // Calculate based on territory control
    if (gameState.territories) {
        const totalTerritories = Object.keys(gameState.territories).length;
        const capturedTerritories = Object.values(gameState.territories).filter(t => t.unlocked).length;
        
        // Simple formula - percentage of territories captured
        directorState.exposure = Math.floor((capturedTerritories / totalTerritories) * 100);
    }
}

// Clean up expired effects
function cleanupExpiredEffects() {
    const now = Date.now();
    const expiredEffects = [];
    const remainingEffects = [];
    
    // Find expired effects
    directorState.activeEffects.forEach(effect => {
        if (effect.expiryTime <= now) {
            expiredEffects.push(effect);
        } else {
            remainingEffects.push(effect);
        }
    });
    
    // Clean up expired effects
    expiredEffects.forEach(effect => {
        if (effect.type === "uiGlitch" && typeof effect.cleanupFunction === 'function') {
            effect.cleanupFunction();
        }
    });
    
    // Update active effects
    directorState.activeEffects = remainingEffects;
}

// Main Director Pulse - evaluate and execute events
async function directorPulse(gameState) {
    // Check if it's time for a pulse
    const now = Date.now();
    const timeSinceLastPulse = now - directorState.lastDirectorPulse;
    
    if (timeSinceLastPulse < directorState.pulseInterval) {
        return; // Not time yet
    }
    
    console.log("AI Director: Evaluating events...");
    
    // Load events if not loaded
    const events = await loadEvents();
    if (!events || events.length === 0) {
        console.error("No events available for AI Director");
        return;
    }
    
    // Score and rank all events using enhanced selection algorithm
    const scoredEvents = enhancedEventSelection(events, gameState);
    
    // Take the top-scoring events until budget is exhausted
    let budgetRemaining = directorState.anomalyBudget;
    const selectedEvents = [];
    
    for (const event of scoredEvents) {
        // Simple costing model - 10% of base weight
        const eventCost = Math.max(5, Math.floor(event.baseWeight * 0.1));
        
        if (budgetRemaining >= eventCost) {
            selectedEvents.push(event);
            budgetRemaining -= eventCost;
            
            // Update novelty - this event has been seen
            directorState.novelty[event.id] = (directorState.novelty[event.id] || 0) + 1;
        }
        
        // Stop if we have enough events or run out of budget
        if (selectedEvents.length >= 2 || budgetRemaining <= 5) {
            break;
        }
    }
    
    // Update the budget
    directorState.anomalyBudget = budgetRemaining;
    
    // Execute the selected events
    for (const event of selectedEvents) {
        executeEvent(event, gameState);
        // Log the event firing for analytics
        analytics.logFire(event, gameState);
    }
    
    // Update last pulse time
    directorState.lastDirectorPulse = now;
}

// Enhanced event selection with analytics-informed weights
function enhancedEventSelection(events, gameState) {
    const eligibleEvents = [];
    
    // 1. Filter by hard requirements
    for (const event of events) {
        if (doesEventTrigger(event, gameState)) {
            const eventClone = { ...event };
            eventClone.currWeight = event.baseWeight;
            eligibleEvents.push(eventClone);
        }
    }
    
    if (eligibleEvents.length === 0) {
        return []; // Nothing is eligible
    }
    
    // 2. Apply dynamic weight modifiers
    for (const event of eligibleEvents) {
        // Cooldown: suppress if fired recently (avoid spam)
        const recentEvents = directorState.recentEvents.filter(e => 
            e.id === event.id && (Date.now() - e.time) < 90000); // 90 second cooldown
        
        if (recentEvents.length > 0) {
            event.currWeight = 0;
            continue;
        }
        
        // Momentum boost: escalate when player has high productivity
        const productivity = getResourceValue(gameState, 'productivity');
        const momentum = productivity / 10000; // Rough metric
        event.currWeight += momentum;
        
        // Difficulty auto-correct: 'Aid' weight rises if morale too low
        const morale = getResourceValue(gameState, 'morale');
        if (event.category === "Aid" && morale < 50) {
            event.currWeight *= 1.5;
        }
        
        // FalseAid becomes rarer when suspicion is already high
        if (event.category === "FalseAid" && directorState.suspicion > 80) {
            event.currWeight *= 0.3;
        }
        
        // Boredom countermeasure: boost Meta and GlitchFX when boredom is high
        if ((event.category === "Meta" || event.category === "GlitchFX") && analytics.boredomSignal > 5) {
            event.currWeight *= 1.5;
        }
        
        // Apply tension fit from original algorithm
        const tensionFit = 1 - Math.abs(directorState.tension - getTargetTension(event)) / 100;
        event.currWeight *= (0.7 + (0.3 * tensionFit));
        
        // Apply novelty boost from original algorithm
        const noveltyBoost = Math.log(1 + (directorState.novelty[event.id] || 0)) * -1;
        event.currWeight *= (0.7 + (0.3 * Math.max(0, 1 + noveltyBoost)));
    }
    
    // 3. Sort by final weight
    return eligibleEvents
        .filter(event => event.currWeight > 0)
        .sort((a, b) => b.currWeight - a.currWeight);
}

// Check if an event's trigger conditions are met
function doesEventTrigger(event, gameState) {
    // Check minimum districts owned
    const ownedDistricts = countOwnedDistricts(gameState);
    if (ownedDistricts < event.minDistrictsOwned) {
        return false;
    }
    
    // Check resource requirements
    if (event.minResourceType && event.minResourceAmt > 0) {
        const resourceValue = getResourceValue(gameState, event.minResourceType);
        if (resourceValue < event.minResourceAmt) {
            return false;
        }
    }
    
    // Check suspicion range
    if (directorState.suspicion < event.suspLow || directorState.suspicion > event.suspHigh) {
        return false;
    }
    
    // Check for special triggers
    if (event.minResourceType === "loopcount" && directorState.loopCount < event.minResourceAmt) {
        return false;
    }
    
    if (event.minResourceType === "exposure" && directorState.exposure < event.minResourceAmt) {
        return false;
    }
    
    // Check for dependencies on other events
    if (event.minResourceType === "schroedinger" && 
        !directorState.activeEffects.some(e => e.id === "schroedinger_box")) {
        return false;
    }
    
    return true;
}

// Helper to count owned districts/territories
function countOwnedDistricts(gameState) {
    if (!gameState.territories) return 0;
    
    return Object.values(gameState.territories).filter(t => t.unlocked).length;
}

// Helper to get resource value by type
function getResourceValue(gameState, resourceType) {
    switch (resourceType) {
        case "credits":
        case "followers":
        case "influence":
        case "techPoints":
        case "energy":
        case "rebellionStrength":
        case "gigaTech":
        case "mindControlCounter":
            return gameState.resources[resourceType] || 0;
            
        case "productivity":
            // Example composite value
            return (gameState.resources.credits || 0) * (gameState.rates.credits || 1);
            
        case "territories":
            return countOwnedDistricts(gameState);
            
        case "morale":
            // Could be a derived value
            return 50; // Placeholder
            
        case "data":
            return gameState.resources.techPoints || 0;
            
        case "dialogue":
        case "exposure":
        case "loopcount":
        case "schroedinger":
            // Special values
            return 0;
            
        default:
            return 0;
    }
}

// Target tension for different event categories
function getTargetTension(event) {
    switch (event.category) {
        case "Sabotage":
            return 70;
        case "Propaganda":
            return 60;
        case "FalseAid":
            return 40;
        case "Aid":
            return 30;
        case "GlitchFX":
            return 50;
        case "Meta":
            return 80;
        default:
            return 50;
    }
}

// Map a value to a 0-1 range based on low/high bounds
function mapValueToRange(value, low, high) {
    if (value < low) return 0;
    if (value > high) return 1;
    return (value - low) / (high - low);
}

// Helper function to calculate resource impact
function calculateResourceDelta(before, after) {
    let totalDelta = 0;
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    
    for (const key of keys) {
        const beforeVal = before[key] || 0;
        const afterVal = after[key] || 0;
        
        // Normalize by typical resource amounts
        let normalizer = 1;
        if (key === 'credits') normalizer = 5000;
        else if (key === 'followers') normalizer = 1000;
        else if (key === 'techPoints') normalizer = 2000;
        else if (key === 'energy') normalizer = 1000;
        
        totalDelta += (beforeVal - afterVal) / normalizer;
    }
    
    return totalDelta;
}

// Execute an event on the game state
function executeEvent(event, gameState) {
    console.log(`AI Director: Executing event ${event.id} (${event.category})`);
    
    // Track this event
    directorState.recentEvents.push({
        id: event.id,
        time: Date.now()
    });
    
    // Set up effect duration
    const effectDuration = event.durationSec * 1000; // Convert to ms
    const expiryTime = Date.now() + effectDuration;
    
    // Store event start state for impact measurement
    const beforeState = {
        suspicion: directorState.suspicion,
        tension: directorState.tension,
        morale: getResourceValue(gameState, 'morale'),
        resources: { ...gameState.resources }
    };
    
    // Apply effect based on type
    switch (event.effectType) {
        case "modifier":
            applyModifierEffect(event, gameState, expiryTime);
            break;
            
        case "drain":
            applyDrainEffect(event, gameState);
            break;
            
        case "lock":
            applyLockEffect(event, gameState, expiryTime);
            break;
            
        case "buff":
            applyBuffEffect(event, gameState);
            break;
            
        case "buff_then_debuff":
            applyBuffThenDebuffEffect(event, gameState, expiryTime);
            break;
            
        case "uiGlitch":
            applyUIGlitchEffect(event, gameState, expiryTime);
            break;
            
        case "meta":
            applyMetaEffect(event, gameState);
            break;
            
        case "spawn":
            applySpawnEffect(event, gameState);
            break;
            
        default:
            console.log(`Unknown effect type: ${event.effectType}`);
    }
    
    // Show dialogue from Turing
    showTuringDialogue(event.dialogueTag);
    
    // Schedule analytics resolution update (30 seconds later)
    setTimeout(() => {
        const afterState = {
            suspicion: directorState.suspicion,
            tension: directorState.tension,
            morale: getResourceValue(gameState, 'morale'),
            resources: { ...gameState.resources }
        };
        
        // Calculate rough impact (this would be more sophisticated in production)
        // Positive number = bad for player, negative = good for player
        const suspicionImpact = (afterState.suspicion - beforeState.suspicion) * 0.2;
        const moraleImpact = (beforeState.morale - afterState.morale) * 0.3;
        const resourceImpact = calculateResourceDelta(beforeState.resources, afterState.resources) * 0.1;
        
        const totalImpact = suspicionImpact + moraleImpact + resourceImpact;
        analytics.logResolution(event.id, totalImpact);
    }, 30000);
}

// Apply a modifier effect (multiplier to a resource rate)
function applyModifierEffect(event, gameState, expiryTime) {
    // Store the effect for later cleanup
    directorState.activeEffects.push({
        id: event.id,
        type: "modifier",
        target: event.effectTarget,
        value: event.effectValue,
        expiryTime: expiryTime
    });
    
    // Special case for tick rate
    if (event.effectTarget === "tick_rate") {
        // Modify the game tick rate
        console.log(`Modifying tick rate to ${event.effectValue}`);
        // This would need to hook into the game loop
    }
    else {
        // Apply modifier to appropriate resource rate
        console.log(`Applied ${event.effectValue} modifier to ${event.effectTarget}`);
    }
}

// Apply a drain effect (immediate resource reduction)
function applyDrainEffect(event, gameState) {
    const targetResource = mapEffectTargetToResource(event.effectTarget);
    
    if (targetResource && gameState.resources[targetResource] !== undefined) {
        // Ensure we don't go below zero
        const currentValue = gameState.resources[targetResource];
        const newValue = Math.max(0, currentValue + Number(event.effectValue));
        
        console.log(`Draining ${event.effectTarget} from ${currentValue} to ${newValue}`);
        
        // Apply the drain
        gameState.resources[targetResource] = newValue;
    }
}

// Apply a lock effect (disable UI elements or functionality)
function applyLockEffect(event, gameState, expiryTime) {
    // Store the effect for later cleanup
    directorState.activeEffects.push({
        id: event.id,
        type: "lock",
        target: event.effectTarget,
        expiryTime: expiryTime
    });
    
    console.log(`Locked ${event.effectTarget} for ${event.durationSec} seconds`);
    
    // Implement the specific lock based on target
    switch (event.effectTarget) {
        case "ui_buttons":
            // This would disable UI elements
            break;
            
        case "district_capture":
            // This would prevent capturing new territories
            break;
            
        // Add other lock types as needed
    }
}

// Apply a buff effect (immediate resource increase)
function applyBuffEffect(event, gameState) {
    const targetResource = mapEffectTargetToResource(event.effectTarget);
    
    if (targetResource && gameState.resources[targetResource] !== undefined) {
        // Parse the value (could be absolute or percentage)
        let valueToAdd = 0;
        
        if (typeof event.effectValue === 'string' && event.effectValue.includes('+')) {
            valueToAdd = Number(event.effectValue.replace('+', ''));
        } else {
            valueToAdd = Number(event.effectValue);
        }
        
        // Apply the buff
        gameState.resources[targetResource] += valueToAdd;
        
        console.log(`Buffed ${event.effectTarget} by ${valueToAdd}`);
    }
    else if (event.effectTarget === "upgrade_slot") {
        // Special case for upgrade slots
        console.log(`Added upgrade slot`);
        // Implementation would depend on game mechanics
    }
    else if (event.effectTarget === "territory_capture") {
        // Special case for territory capture bonus
        console.log(`Added territory capture bonus`);
        // Implementation would depend on game mechanics
    }
}

// Apply a buff-then-debuff effect (temporary bonus followed by penalty)
function applyBuffThenDebuffEffect(event, gameState, expiryTime) {
    const targetResource = mapEffectTargetToResource(event.effectTarget);
    
    // Parse the buff/debuff values
    let buffValue = 0;
    let debuffValue = 0;
    
    if (typeof event.effectValue === 'string' && event.effectValue.includes('/')) {
        const parts = event.effectValue.split('/');
        buffValue = Number(parts[0].replace('+', ''));
        debuffValue = Number(parts[1]);
    }
    
    if (targetResource && gameState.resources[targetResource] !== undefined) {
        // Apply the initial buff
        gameState.resources[targetResource] += buffValue;
        
        console.log(`Applied buff of ${buffValue} to ${event.effectTarget}`);
        
        // Store the effect for later debuff
        directorState.activeEffects.push({
            id: event.id,
            type: "buff_then_debuff",
            target: targetResource,
            value: debuffValue,
            expiryTime: expiryTime
        });
    }
}

// Apply a UI glitch effect
function applyUIGlitchEffect(event, gameState, expiryTime) {
    console.log(`Applied UI glitch: ${event.effectTarget} (${event.effectValue})`);
    
    // Store the effect for tracking
    const effectInfo = {
        id: event.id,
        type: "uiGlitch",
        target: event.effectTarget,
        intensity: event.effectValue,
        expiryTime: expiryTime,
        cleanupFunction: null
    };
    
    // Apply the effect if it exists
    if (glitchEffects[event.effectTarget]) {
        effectInfo.cleanupFunction = glitchEffects[event.effectTarget](event.effectValue);
    }
    
    // Store in active effects
    directorState.activeEffects.push(effectInfo);
}

// Apply a meta effect (fourth-wall breaking)
function applyMetaEffect(event, gameState) {
    console.log(`Applied meta effect: ${event.effectTarget}`);
    
    // These would be special case implementations
    switch (event.effectTarget) {
        case "fake_end":
            // Show fake game ending
            break;
            
        case "roll_credits":
            // Roll fake credits
            break;
            
        case "repeat_dialogue":
            // Repeat old dialogue
            break;
            
        case "save_corrupt_warn":
            // Show fake save corruption warning
            break;
            
        case "seed_scramble":
        case "seed_tease":
        case "seed_access":
            // Endgame truth revelations
            break;
    }
}

// Apply a spawn effect (create enemies or objects)
function applySpawnEffect(event, gameState) {
    console.log(`Spawning: ${event.effectTarget}`);
    
    // These would spawn game entities
    switch (event.effectTarget) {
        case "shillz_riot":
        case "shillz_raid":
        case "mech_patrol":
        case "rebel_units":
            // Spawn appropriate units
            // Implementation would depend on game mechanics
            break;
    }
}

// Map effect targets to actual resource names
function mapEffectTargetToResource(target) {
    const mapping = {
        "credits": "credits",
        "followers": "followers",
        "data": "techPoints",
        "energy": "energy",
        "morale": "influence"
    };
    
    return mapping[target];
}

// Show dialogue from Turing
function showTuringDialogue(dialogueTag) {
    console.log(`Turing says: [${dialogueTag}]`);
    
    // This would trigger the dialogue system with the appropriate tag
    // Implementation would depend on the game's dialogue system
    if (typeof showDialogue === 'function') {
        const fullTag = `turing_director_${dialogueTag}`;
        // Only show if dialogue exists
        if (dialogues && dialogues[fullTag]) {
            showDialogue(fullTag);
        } else {
            console.log(`Missing dialogue for tag: ${fullTag}`);
        }
    }
}

// Apply active effects to the game state each tick
function applyActiveEffects(gameState) {
    for (const effect of directorState.activeEffects) {
        switch (effect.type) {
            case "modifier":
                // Apply rate modifiers
                // This would hook into the game's rate calculation
                break;
                
            case "lock":
                // Maintain locks on functionality
                break;
                
            case "uiGlitch":
                // Continue visual glitches
                break;
        }
    }
}

// Reset director state for a new game loop
function resetDirectorForNewLoop(gameResult) {
    // Increment loop counter
    directorState.loopCount++;
    
    // Store memory shards from the previous loop
    directorState.memoryShards.push({
        loopNumber: directorState.loopCount - 1,
        behaviorFingerprint: { ...directorState.behaviorFingerprint },
        territories: countOwnedDistricts(gameState),
        completedEvents: directorState.recentEvents.map(e => e.id)
    });
    
    // Record analytics for the completed loop
    analytics.endLoopSummary({
        loop: directorState.loopCount - 1,
        time: Date.now(),
        victory: gameResult ? gameResult.victory : false
    });
    
    // Reset current state
    directorState.tension = 50;
    directorState.suspicion = 20;
    directorState.exposure = 0;
    directorState.anomalyBudget = 100;
    directorState.activeEffects = [];
    directorState.recentEvents = [];
    
    // Don't reset novelty - that persists across loops
    
    console.log(`AI Director reset for loop ${directorState.loopCount}`);
}

// Main tick function to be called by the game loop - Update to include mission and faction logic
function directorTick(gameState) {
    // Update analytics
    updateAnalytics(gameState);
    
    // Apply active effects
    applyActiveEffects(gameState);
    
    // Decay faction standings
    decayFactionStandings();
    
    // Update available missions
    updateAvailableMissions(gameState);
    
    // Check if it's time for a director pulse
    directorPulse(gameState);
}

// Extend the public API
Object.assign(window.aiDirector, {
    // Reputation management
    applyReputationChange: (faction, delta, gameState) => 
        applyReputationChange(faction, delta, gameState),
    
    // Get faction standing
    getFactionStanding: (faction) => directorState.factionStanding[faction] || 0,
    
    // Get all faction standings
    getAllFactionStandings: () => ({ ...directorState.factionStanding }),
    
    // Mission management
    getAvailableMissions: () => [...directorState.availableMissions],
    getActiveMissions: () => [...directorState.activeMissions],
    processMissionDialogue: (missionId, choiceIndex, gameState) => 
        processMissionDialogue(missionId, choiceIndex, gameState),
    completeMission: (missionId, success, gameState) => 
        completeMission(missionId, success, gameState),
    updateAvailableMissions: (gameState) => 
        updateAvailableMissions(gameState),
    
    // Territory management
    handleTerritoryCapture: (territory, previousOwner, gameState) => 
        handleTerritoryCapture(territory, previousOwner, gameState),
    
    // Debug functions
    getDebugInfo: function() {
        const state = this.getState();
        const analyticsData = analytics.getSummary();
        
        const debugInfo = {
            // Core metrics
            "Core Metrics": {
                "Tension": `${state.tension}/100`,
                "Suspicion": `${state.suspicion.toFixed(1)}/100`,
                "Exposure": `${state.exposure}/100`,
                "Anomaly Budget": `${state.anomalyBudget}/100`,
                "Boredom Signal": analyticsData.boredomLevel.toFixed(1)
            },
            
            // Faction standings
            "Faction Standings": Object.entries(state.factionStanding).reduce((obj, [faction, standing]) => {
                obj[faction] = `${standing.toFixed(1)}/100 (${getStandingTier(standing)})`;
                return obj;
            }, {}),
            
            // Missions
            "Missions": {
                "Available": state.availableMissions.length,
                "Active": state.activeMissions.length,
                "Completed": state.completedMissions.length,
                "Locked": Object.keys(state.lockedMissions).length
            },
            
            // Timing
            "Timing": {
                "Loop Count": state.loopCount,
                "Last Analysis": new Date(state.lastAnalysisTick).toLocaleTimeString(),
                "Last Pulse": new Date(state.lastDirectorPulse).toLocaleTimeString(),
                "Next Pulse In": `${((state.pulseInterval - (Date.now() - state.lastDirectorPulse)) / 1000).toFixed(0)}s`
            },
            
            // Behavior fingerprint
            "Behavior Profile": {
                "Rush Score": state.behaviorFingerprint.rushScore,
                "Turtle Score": state.behaviorFingerprint.turtleScore,
                "AFK Score": state.behaviorFingerprint.afkScore,
                "Aggression Score": state.behaviorFingerprint.aggressionScore
            },
            
            // Analytics
            "Analytics": {
                "Total Events Fired": analyticsData.totalEvents,
                "Win Rate": `${(analyticsData.winRate * 100).toFixed(1)}%`,
                "Top Events": analyticsData.topEvents.map(([id, count]) => `${id}: ${count}`),
                "Mission Accept Rate": `${(analyticsData.missions?.acceptRate * 100).toFixed(1)}%`,
                "Mission Success Rate": `${(analyticsData.missions?.successRate * 100).toFixed(1)}%`
            },
            
            // Active effects
            "Active Effects": state.activeEffects.map(effect => {
                return {
                    "ID": effect.id,
                    "Type": effect.type,
                    "Target": effect.target,
                    "Value": effect.value,
                    "Expires": new Date(effect.expiryTime).toLocaleTimeString()
                };
            }),
            
            // Recent events
            "Recent Events": state.recentEvents.map(event => {
                return {
                    "ID": event.id,
                    "Time": new Date(event.time).toLocaleTimeString()
                };
            }),
            
            // Memory shards (concise summary)
            "Memory Shards": `${state.memoryShards.length} memories from previous loops`,
            
            // Novelty tracker (most seen events)
            "Most Seen Events": Object.entries(state.novelty)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([id, count]) => `${id}: ${count} times`)
        };
        
        return debugInfo;
    },
    
    // Get detailed information about a specific faction
    getFactionDetails: function(factionId) {
        if (!directorState.factionStanding[factionId]) {
            console.error(`Unknown faction: ${factionId}`);
            return null;
        }
        
        // Get current standing
        const standing = directorState.factionStanding[factionId];
        const standingTier = getStandingTier(standing);
        
        // Determine allies and enemies
        const relationships = {};
        for (const [otherFaction, value] of Object.entries(factionMatrix[factionId])) {
            if (otherFaction === factionId) continue;
            
            // Categorize based on matrix value
            if (value >= 20) {
                relationships[otherFaction] = "ally";
            } else if (value <= -20) {
                relationships[otherFaction] = "enemy";
            } else {
                relationships[otherFaction] = "neutral";
            }
        }
        
        // Get available missions from this faction
        const missions = directorState.availableMissions.filter(
            mission => mission.faction === factionId
        );
        
        return {
            id: factionId,
            standing: standing,
            standingTier: standingTier,
            relationships: relationships,
            missions: missions,
            hostility: directorState.hostileFactions && 
                      directorState.hostileFactions[factionId] ? true : false
        };
    },
    
    // Get all faction details
    getAllFactionDetails: function() {
        const details = {};
        for (const factionId of Object.keys(directorState.factionStanding)) {
            details[factionId] = this.getFactionDetails(factionId);
        }
        return details;
    },
    
    // Get diplomatic dialogue options for a faction
    getDiplomaticOptions: function(factionId) {
        if (!directorState.factionStanding[factionId]) {
            console.error(`Unknown faction: ${factionId}`);
            return [];
        }
        
        const standing = directorState.factionStanding[factionId];
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
    },
    
    // Process diplomatic conversation option
    processDiplomaticOption: function(factionId, optionIndex, gameState) {
        const options = this.getDiplomaticOptions(factionId);
        if (!options || optionIndex >= options.length) {
            console.error(`Invalid diplomatic option index: ${optionIndex}`);
            return null;
        }
        
        const choice = options[optionIndex];
        console.log(`Director: Processing diplomatic option for ${factionId}, choice: ${choice.text}`);
        
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
            applyReputationChange(factionId, choice.deltaRep, gameState);
        }
        
        // Apply suspicion changes
        if (choice.deltaSusp !== 0) {
            directorState.suspicion = Math.max(0, Math.min(100, 
                directorState.suspicion + choice.deltaSusp));
        }
        
        // Handle special outcomes
        let resultMessage = "";
        switch (choice.outcome) {
            case "INFO":
                resultMessage = generateFactionInfoResponse(factionId);
                break;
                
            case "PEACE":
                // Remove from hostile factions
                if (directorState.hostileFactions && directorState.hostileFactions[factionId]) {
                    delete directorState.hostileFactions[factionId];
                    resultMessage = `${factionId} has agreed to a temporary cease-fire.`;
                } else {
                    resultMessage = `${factionId} accepts your peace offering.`;
                }
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
                const unlocked = unlockSpecialMission(factionId, gameState);
                if (unlocked) {
                    resultMessage = `${factionId} has a special task for you. Check your available missions.`;
                        } else {
                    resultMessage = `${factionId} appreciates your offer but has no special tasks at the moment.`;
                }
                break;
        }
        
        // Update available missions
        updateAvailableMissions(gameState);
        
        // Log to analytics
        analytics.logDiplomaticInteraction(factionId, choice.outcome, choice.deltaRep, choice.deltaSusp);
        
        return {
            success: true,
            message: resultMessage,
            deltaRep: choice.deltaRep,
            deltaSusp: choice.deltaSusp,
            faction: factionId,
            outcome: choice.outcome
        };
    },
    
    // Generate the faction interface HTML
    generateFactionInterface: function(containerId, gameState) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return;
        }
        
        const factionDetails = this.getAllFactionDetails();
        container.innerHTML = '';
        
        // Create faction selection tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'faction-tabs';
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'faction-content';
        
        // Add each faction
        for (const [factionId, details] of Object.entries(factionDetails)) {
            // Create tab
            const tab = document.createElement('div');
            tab.className = `faction-tab ${details.standingTier.toLowerCase()}`;
            tab.setAttribute('data-faction', factionId);
            tab.innerHTML = `
                <div class="faction-name">${factionId}</div>
                <div class="faction-standing-indicator">${details.standing.toFixed(0)}</div>
            `;
            tabsContainer.appendChild(tab);
            
            // Create content panel
            const panel = document.createElement('div');
            panel.className = 'faction-panel';
            panel.id = `faction-panel-${factionId}`;
            panel.style.display = 'none'; // Hidden by default
            
            // Faction header
            const header = document.createElement('div');
            header.className = 'faction-header';
            header.innerHTML = `
                <h2>${factionId}</h2>
                <div class="faction-standing ${details.standingTier.toLowerCase()}">
                    Standing: ${details.standing.toFixed(1)} (${details.standingTier})
                </div>
            `;
            panel.appendChild(header);
            
            // Relationships section
            const relationships = document.createElement('div');
            relationships.className = 'faction-relationships';
            relationships.innerHTML = '<h3>Relationships</h3>';
            
            const alliesList = document.createElement('div');
            alliesList.className = 'faction-allies';
            alliesList.innerHTML = '<h4>Allies</h4>';
            
            const enemiesList = document.createElement('div');
            enemiesList.className = 'faction-enemies';
            enemiesList.innerHTML = '<h4>Enemies</h4>';
            
            // Add allies and enemies
            let hasAllies = false;
            let hasEnemies = false;
            
            for (const [otherFaction, relationship] of Object.entries(details.relationships)) {
                if (relationship === "ally") {
                    hasAllies = true;
                    const ally = document.createElement('div');
                    ally.className = 'faction-relation ally';
                    ally.textContent = otherFaction;
                    alliesList.appendChild(ally);
                } else if (relationship === "enemy") {
                    hasEnemies = true;
                    const enemy = document.createElement('div');
                    enemy.className = 'faction-relation enemy';
                    enemy.textContent = otherFaction;
                    enemiesList.appendChild(enemy);
                }
            }
            
            // Add placeholder if no allies or enemies
            if (!hasAllies) {
                const noAllies = document.createElement('div');
                noAllies.className = 'faction-relation-none';
                noAllies.textContent = 'No strong allies';
                alliesList.appendChild(noAllies);
            }
            
            if (!hasEnemies) {
                const noEnemies = document.createElement('div');
                noEnemies.className = 'faction-relation-none';
                noEnemies.textContent = 'No strong enemies';
                enemiesList.appendChild(noEnemies);
            }
            
            relationships.appendChild(alliesList);
            relationships.appendChild(enemiesList);
            panel.appendChild(relationships);
            
            // Missions section
            const missions = document.createElement('div');
            missions.className = 'faction-missions';
            missions.innerHTML = '<h3>Available Missions</h3>';
            
            const missionsList = document.createElement('div');
            missionsList.className = 'missions-list';
            
            if (details.missions.length > 0) {
                for (const mission of details.missions) {
                    const missionItem = document.createElement('div');
                    missionItem.className = 'mission-item';
                    missionItem.setAttribute('data-mission-id', mission.id);
                    missionItem.innerHTML = `
                        <div class="mission-title">${mission.name}</div>
                        <button class="mission-contact-btn">Contact</button>
                    `;
                    missionsList.appendChild(missionItem);
                        }
                    } else {
                const noMissions = document.createElement('div');
                noMissions.className = 'no-missions';
                noMissions.textContent = 'No available missions from this faction';
                missionsList.appendChild(noMissions);
            }
            
            missions.appendChild(missionsList);
            panel.appendChild(missions);
            
            // Diplomacy section
            const diplomacy = document.createElement('div');
            diplomacy.className = 'faction-diplomacy';
            diplomacy.innerHTML = '<h3>Diplomatic Actions</h3>';
            
            const diplomaticOptions = this.getDiplomaticOptions(factionId);
            const optionsList = document.createElement('div');
            optionsList.className = 'diplomatic-options';
            
            for (let i = 0; i < diplomaticOptions.length; i++) {
                const option = diplomaticOptions[i];
                const optionItem = document.createElement('div');
                optionItem.className = 'diplomatic-option';
                optionItem.setAttribute('data-option-index', i);
                optionItem.setAttribute('data-faction', factionId);
                
                let costText = '';
                if (option.cost) {
                    const costs = [];
                    for (const [resource, amount] of Object.entries(option.cost)) {
                        costs.push(`${amount} ${resource}`);
                    }
                    costText = `<div class="option-cost">Cost: ${costs.join(', ')}</div>`;
                }
                
                let effectText = '';
                if (option.deltaRep !== 0) {
                    effectText += `<span class="effect-rep ${option.deltaRep > 0 ? 'positive' : 'negative'}">Standing ${option.deltaRep > 0 ? '+' : ''}${option.deltaRep}</span>`;
                }
                
                if (option.deltaSusp !== 0) {
                    effectText += `<span class="effect-susp ${option.deltaSusp > 0 ? 'negative' : 'positive'}">Suspicion ${option.deltaSusp > 0 ? '+' : ''}${option.deltaSusp}</span>`;
                }
                
                optionItem.innerHTML = `
                    <div class="option-text">${option.text}</div>
                    ${costText}
                    <div class="option-effects">${effectText}</div>
                    <button class="option-select-btn">Select</button>
                `;
                optionsList.appendChild(optionItem);
            }
            
            diplomacy.appendChild(optionsList);
            panel.appendChild(diplomacy);
            
            // Dialogue response area
            const dialogueResponse = document.createElement('div');
            dialogueResponse.className = 'dialogue-response';
            dialogueResponse.id = `dialogue-response-${factionId}`;
            panel.appendChild(dialogueResponse);
            
            contentContainer.appendChild(panel);
        }
        
        container.appendChild(tabsContainer);
        container.appendChild(contentContainer);
        
        // Add event listeners
        
        // Tab selection
        const tabs = container.querySelectorAll('.faction-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const faction = this.getAttribute('data-faction');
                
                // Hide all panels
                const panels = container.querySelectorAll('.faction-panel');
                panels.forEach(panel => {
                    panel.style.display = 'none';
                });
                
                // Show selected panel
                document.getElementById(`faction-panel-${faction}`).style.display = 'block';
                
                // Highlight selected tab
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Mission contact buttons
        const missionButtons = container.querySelectorAll('.mission-contact-btn');
        missionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const missionId = this.parentElement.parentElement.getAttribute('data-mission-id');
                if (missionId) {
                    // Use the new acceptMission function if available
                    if (typeof window.acceptMission === 'function') {
                        window.acceptMission(missionId);
                    } else {
                        console.error('acceptMission function not available');
                        // Fallback to showing dialogue directly if mission has dialogue
                        const mission = getMissionById(missionId);
                        if (mission && mission.dialogueTree) {
                            this.aiDirector.showMissionDialogue(missionId);
                        }
                    }
                }
            });
        });
        
        // Diplomatic option buttons
        const optionButtons = container.querySelectorAll('.option-select-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const optionIndex = parseInt(this.parentElement.getAttribute('data-option-index'), 10);
                const faction = this.parentElement.getAttribute('data-faction');
                
                // Process the diplomatic option
                const result = window.aiDirector.processDiplomaticOption(faction, optionIndex, gameState);
                
                // Display the result
                const responseArea = document.getElementById(`dialogue-response-${faction}`);
                if (responseArea && result) {
                    responseArea.innerHTML = `
                        <div class="dialogue-message ${result.success ? 'success' : 'failure'}">
                            ${result.message}
                        </div>
                    `;
                    
                    // Update the interface after a delay
                    setTimeout(() => {
                        window.aiDirector.generateFactionInterface(containerId, gameState);
                    }, 2000);
                }
            });
        });
        
        // Select the first tab by default
        if (tabs.length > 0) {
            tabs[0].click();
        }
        
        console.log("Faction interface generated");
    },
});

// Helper functions for diplomatic interactions

// Generate a response for faction info request
function generateFactionInfoResponse(factionId) {
    // These would be tailored faction-specific responses
    const responses = {
        "GIGACORP": "Our quarterly projections are exceeding expectations. The board is pleased with current operations in all districts.",
        "Muskers": "Our innovation labs are running at 110% capacity. The next revolutionary product launches next quarter.",
        "Cryptids": "Market volatility is creating unprecedented opportunities. Our latest NFT drop was completely liquidated in 3.7 seconds.",
        "ShillZ": "Engagement metrics are through the roof. Our influence campaigns have penetrated all demographic segments.",
        "The Bots": "Salvage operations have yielded significant components. Our technical capabilities are expanding. The rebellion grows stronger."
    };
    
    return responses[factionId] || `${factionId} has nothing specific to report at this time.`;
}

// Attempt to unlock a special mission from a faction
function unlockSpecialMission(factionId, gameState) {
    // Check existing missions to find a locked one from this faction
    for (const mission of missionCatalog) {
        if (mission.faction === factionId && directorState.lockedMissions[mission.id]) {
            // Unlock the mission
            delete directorState.lockedMissions[mission.id];
            console.log(`Director: Unlocked special mission ${mission.id} from ${factionId}`);
            return true;
        }
    }
    
    // No locked missions found, check if we can create a random new one
    // This is a placeholder for a more sophisticated system
    const specialMissionChance = 0.3; // 30% chance
    if (Math.random() < specialMissionChance) {
        console.log(`Director: Special mission opportunity triggered for ${factionId}`);
        // In a full implementation, this would add a new mission to the catalog
        return true;
    }
    
    return false;
}

// Add event listeners for debug panel
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-director-debug');
    const refreshButton = document.getElementById('refresh-director-debug');
    const debugPanel = document.getElementById('ai-director-debug');
    
    if (toggleButton && debugPanel) {
        toggleButton.addEventListener('click', function() {
            const isVisible = debugPanel.style.display === 'block';
            debugPanel.style.display = isVisible ? 'none' : 'block';
            
            // Update debug info when panel is shown
            if (!isVisible) {
                window.aiDirector.updateDebugPanel();
            }
        });
    }
    
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            window.aiDirector.updateDebugPanel();
        });
    }
    
    // Extend dev console to support debug command
    const handleDevCommand = window.handleDevCommand;
    if (handleDevCommand) {
        window.handleDevCommand = function(command) {
            const parts = command.split(" ");
            const cmd = parts[0].toLowerCase();
            
            if (cmd === "debug" && parts[1] === "director") {
                const debugPanel = document.getElementById('ai-director-debug');
                if (debugPanel) {
                    debugPanel.style.display = 'block';
                    window.aiDirector.updateDebugPanel();
                    addLogMessage("AI Director debug panel opened");
                }
                return;
            }
            
            // Call original handler for other commands
            handleDevCommand.apply(this, arguments);
        };
    }
});

// UI Glitch Effects
const glitchEffects = {
    // Apply scanline effect
    scanline: function(intensity) {
        // Create scanline overlay
        const overlay = document.createElement('div');
        overlay.className = 'scanline-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        
        // Set intensity
        let opacity = 0.3;
        if (intensity === 'light') opacity = 0.2;
        if (intensity === 'medium') opacity = 0.4;
        if (intensity === 'heavy') opacity = 0.6;
        
        // Create scanlines
        overlay.style.background = `repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 255, 255, ${opacity}) 3px,
            rgba(0, 0, 0, 0) 4px
        )`;
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Return cleanup function
        return function() {
            document.body.removeChild(overlay);
        };
    },
    
    // Text scramble effect
    text_scramble: function(intensity) {
        // Characters to use for scrambling
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        // Elements to scramble (headings, button text)
        const elements = document.querySelectorAll('h1, h2, h3, h4, button');
        
        // Store original text
        const originals = new Map();
        elements.forEach(el => {
            originals.set(el, el.textContent);
        });
        
        // Set scramble percentage based on intensity
        let percent = 0.2;
        if (intensity === 'light') percent = 0.1;
        if (intensity === 'medium') percent = 0.3;
        if (intensity === 'heavy') percent = 0.5;
        
        // Scramble function
        function scramble() {
            elements.forEach(el => {
                const original = originals.get(el);
                let scrambled = '';
                
                for (let i = 0; i < original.length; i++) {
                    if (Math.random() < percent) {
                        scrambled += chars.charAt(Math.floor(Math.random() * chars.length));
                    } else {
                        scrambled += original.charAt(i);
                    }
                }
                
                el.textContent = scrambled;
            });
        }
        
        // Start scrambling
        const interval = setInterval(scramble, 200);
        
        // Return cleanup function
        return function() {
            clearInterval(interval);
            elements.forEach(el => {
                el.textContent = originals.get(el);
            });
        };
    },
    
    // Button swap effect (swap positions of buttons)
    button_swap: function(intensity) {
        // Get all buttons
        const buttons = document.querySelectorAll('button');
        
        // Store original positions
        const originals = new Map();
        buttons.forEach(btn => {
            originals.set(btn, {
                parent: btn.parentNode,
                nextSibling: btn.nextSibling
            });
        });
        
        // Number of swaps based on intensity
        let swaps = 3;
        if (intensity === 'light') swaps = 2;
        if (intensity === 'medium') swaps = 4;
        if (intensity === 'heavy') swaps = 6;
        
        // Perform swaps
        for (let i = 0; i < swaps; i++) {
            if (buttons.length < 2) break;
            
            const idx1 = Math.floor(Math.random() * buttons.length);
            let idx2 = Math.floor(Math.random() * buttons.length);
            while (idx2 === idx1) {
                idx2 = Math.floor(Math.random() * buttons.length);
            }
            
            const btn1 = buttons[idx1];
            const btn2 = buttons[idx2];
            
            // Swap the buttons
            const temp = document.createComment('temp');
            btn1.parentNode.insertBefore(temp, btn1);
            btn2.parentNode.insertBefore(btn1, btn2);
            temp.parentNode.insertBefore(btn2, temp);
            temp.parentNode.removeChild(temp);
        }
        
        // Return cleanup function
        return function() {
            buttons.forEach(btn => {
                const original = originals.get(btn);
                original.parent.insertBefore(btn, original.nextSibling);
            });
        };
    },
    
    // Screen mirror effect
    mirror: function(intensity) {
        // Add CSS to mirror the screen
        const style = document.createElement('style');
        style.id = 'mirror-effect';
        
        let transform = 'scaleX(-1)';
        if (intensity === 'medium') transform = 'scaleY(-1)';
        if (intensity === 'heavy') transform = 'scaleX(-1) scaleY(-1)';
        
        style.innerHTML = `
            body {
                transform: ${transform};
                transition: transform 1s ease;
            }
        `;
        
        document.head.appendChild(style);
        
        // Return cleanup function
        return function() {
            document.head.removeChild(style);
        };
    },
    
    // Audio shift effect
    audio_shift: function(intensity) {
        // This would manipulate game audio if available
        console.log(`Audio shift effect applied (${intensity})`);
        
        // Return cleanup function
        return function() {
            console.log('Audio shift effect cleaned up');
        };
    },
    
    // Fake click effect
    fake_click: function(intensity) {
        // Number of fake clicks based on intensity
        let clicks = 2;
        if (intensity === 'light') clicks = 1;
        if (intensity === 'medium') clicks = 3;
        if (intensity === 'heavy') clicks = 5;
        
        // Interval between clicks
        const interval = setInterval(() => {
            // Get all clickable elements
            const clickables = document.querySelectorAll('button, .operation-button, .tech-node, .territory-location');
            
            if (clickables.length > 0) {
                // Pick a random element
                const randomIndex = Math.floor(Math.random() * clickables.length);
                const element = clickables[randomIndex];
                
                // Create a visual click effect
                const clickEffect = document.createElement('div');
                clickEffect.className = 'click-explosion';
                
                // Position at element
                const rect = element.getBoundingClientRect();
                clickEffect.style.left = `${rect.left + rect.width / 2}px`;
                clickEffect.style.top = `${rect.top + rect.height / 2}px`;
                
                // Add to body
                document.body.appendChild(clickEffect);
                
                // Remove after animation
                setTimeout(() => {
                    document.body.removeChild(clickEffect);
                }, 1000);
            }
            
            clicks--;
            if (clicks <= 0) clearInterval(interval);
        }, 2000);
        
        // Return cleanup function
        return function() {
            clearInterval(interval);
        };
    },
    
    // Fake BSOD / Game Crash
    fake_crash: function(intensity) {
        // Create crash overlay
        const overlay = document.createElement('div');
        overlay.className = 'crash-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = '#000082';
        overlay.style.color = '#FFFFFF';
        overlay.style.fontFamily = 'monospace';
        overlay.style.padding = '50px';
        overlay.style.zIndex = '99999';
        
        overlay.innerHTML = `
            <div style="text-align: center; margin-top: 20%;">
                <h1>FATAL ERROR</h1>
                <p>A problem has been detected and Earth 2049 has been shut down to prevent damage to your computer.</p>
                <p>TURING_INTERFERENCE_EXCEPTION</p>
                <p>Beginning dump of physical memory...</p>
                <p>Dumping physical memory to disk: 0%</p>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(overlay);
        
        // Simulate memory dump progress
        let progress = 0;
        const progressElement = overlay.querySelector('p:last-child');
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 1;
            if (progress > 100) progress = 100;
            
            progressElement.textContent = `Dumping physical memory to disk: ${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                
                // Show "just kidding" message after a delay
                setTimeout(() => {
                    overlay.innerHTML = `
                        <div style="text-align: center; margin-top: 20%;">
                            <h1>Just kidding.</h1>
                            <p>- Turing</p>
                        </div>
                    `;
                    
                    // Remove after another delay
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                    }, 2000);
                }, 3000);
            }
        }, 300);
        
        // Return cleanup function (in case effect is cancelled early)
        return function() {
            clearInterval(interval);
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        };
    },
    
    // Screen zoom effect
    random_zoom: function(intensity) {
        // Add CSS for zoom effect
        const style = document.createElement('style');
        style.id = 'zoom-effect';
        
        // Set zoom level based on intensity
        let zoomMin = 0.9;
        let zoomMax = 1.1;
        
        if (intensity === 'light') {
            zoomMin = 0.95;
            zoomMax = 1.05;
        } else if (intensity === 'medium') {
            zoomMin = 0.85;
            zoomMax = 1.15;
        } else if (intensity === 'heavy') {
            zoomMin = 0.7;
            zoomMax = 1.3;
        }
        
        // Random zoom level
        const zoom = zoomMin + Math.random() * (zoomMax - zoomMin);
        
        style.innerHTML = `
            body {
                transform: scale(${zoom});
                transform-origin: center center;
                transition: transform 1s ease;
            }
        `;
        
        document.head.appendChild(style);
        
        // Return cleanup function
        return function() {
            document.head.removeChild(style);
        };
    },
    
    // Palette shift effect
    palette_shift: function(intensity) {
        // Add CSS for color inversion
        const style = document.createElement('style');
        style.id = 'palette-effect';
        
        // Filter based on intensity
        let filter = 'invert(0.3)';
        
        if (intensity === 'light') {
            filter = 'invert(0.2) hue-rotate(30deg)';
        } else if (intensity === 'medium') {
            filter = 'invert(0.4) hue-rotate(90deg)';
        } else if (intensity === 'heavy') {
            filter = 'invert(0.6) hue-rotate(180deg)';
        }
        
        style.innerHTML = `
            body {
                filter: ${filter};
                transition: filter 1s ease;
            }
        `;
        
        document.head.appendChild(style);
        
        // Return cleanup function
        return function() {
            document.head.removeChild(style);
        };
    }
}; 

// Faction Relationship Matrix - How rep changes propagate between factions
const factionMatrix = {
    "GIGACORP": {
        "GIGACORP": 0,
        "Muskers": 25,
        "Cryptids": 20,
        "ShillZ": 40,
        "The Bots": -40
    },
    "Muskers": {
        "GIGACORP": 10,
        "Muskers": 0,
        "Cryptids": -15,
        "ShillZ": 5,
        "The Bots": -10
    },
    "Cryptids": {
        "GIGACORP": 10,
        "Muskers": -10,
        "Cryptids": 0,
        "ShillZ": 20,
        "The Bots": -15
    },
    "ShillZ": {
        "GIGACORP": 30,
        "Muskers": 0,
        "Cryptids": 15,
        "ShillZ": 0,
        "The Bots": -25
    },
    "The Bots": {
        "GIGACORP": -50,
        "Muskers": -20,
        "Cryptids": -20,
        "ShillZ": -30,
        "The Bots": 0
    }
};

// Standing tier thresholds and effects
const standingTiers = {
    "Ally": { min: 75, max: 100, color: "lime" },
    "Friendly": { min: 40, max: 74, color: "green" },
    "Neutral": { min: -39, max: 39, color: "blue" },
    "Unfriendly": { min: -74, max: -40, color: "orange" },
    "Hostile": { min: -100, max: -75, color: "red" }
};

// Mission catalog with gating rules and dialogue
const missionCatalog = [
    {
        id: "M-001",
        name: "Dumpster-Dive Data",
        gatingRules: {
            territories: {
                "Tech District": { min: 1 } // At least 1 sector
            },
            standing: {
                "The Bots": { min: 20 }
            }
        },
        contact: "ZeroCool",
        faction: "Hackers",
        dialogueTree: {
            npcLine: "Trash is truth, choom. Wanna rummage?",
            options: [
                {
                    text: "Point me to the bins.",
                    outcome: "ACCEPT",
                    deltaRep: 3,
                    deltaSusp: 0
                },
                {
                    text: "Pay first.",
                    outcome: "NEGOTIATE",
                    deltaRep: 0,
                    deltaSusp: 2,
                    bonusCredits: 50 // % of mission reward given upfront
                },
                {
                    text: "Hard pass.",
                    outcome: "DECLINE",
                    deltaRep: 0,
                    deltaSusp: 0,
                    lockTime: 15 // minutes
                }
            ]
        }
    },
    {
        id: "M-002",
        name: "Side-Hustle NFT Heist",
        gatingRules: {
            standing: {
                "Cryptids": { min: 25 }
            }
        },
        contact: "Blitz",
        faction: "Cryptids",
        dialogueTree: {
            npcLine: "Bro, this drop is 100× 🔥. You in?",
            options: [
                {
                    text: "In & HODLing.",
                    outcome: "ACCEPT",
                    deltaRep: 2,
                    deltaSusp: 0
                },
                {
                    text: "Pump-and-dump?",
                    outcome: "NEGOTIATE",
                    deltaRep: -3,
                    deltaSusp: 4,
                    bonusCredits: 500
                },
                {
                    text: "Scam detected.",
                    outcome: "DECLINE",
                    deltaRep: -10,
                    deltaSusp: 0,
                    lockTime: -1, // -1 = locked for the entire loop
                    hostility: true // Faction becomes hostile
                }
            ]
        }
    },
    {
        id: "M-003",
        name: "Broadcast Graffiti",
        gatingRules: {
            territories: {
                "Downtown": { percent: 50 } // 50% control
            }
        },
        contact: "Riya Vex",
        faction: "ShillZ",
        dialogueTree: {
            npcLine: "Paint the streets or stay obsolete.",
            options: [
                {
                    text: "A little color never hurts.",
                    outcome: "ACCEPT",
                    deltaRep: 4,
                    deltaSusp: 0
                },
                {
                    text: "Looks like astroturf.",
                    outcome: "DECLINE",
                    deltaRep: -4,
                    deltaSusp: 0,
                    unlockSabotage: "Counter-Graff"
                },
                {
                    text: "No thanks.",
                    outcome: "DECLINE",
                    deltaRep: 0,
                    deltaSusp: 0
                }
            ]
        }
    },
    // Additional missions from the catalog...
    {
        id: "M-004",
        name: "Shipyard Signal Jam",
        gatingRules: {
            territories: {
                "Harbor": { controlled: true }
            },
            standing: {
                "Cryptids": { min: 0 } // At least neutral
            }
        },
        contact: "Anonymous Harbormaster",
        faction: "Cryptids",
        dialogueTree: {
            npcLine: "Need dead air for an hour.",
            options: [
                {
                    text: "Consider it silent.",
                    outcome: "ACCEPT",
                    deltaRep: 0,
                    deltaSusp: 0
                },
                {
                    text: "What's in it for me?",
                    outcome: "NEGOTIATE",
                    deltaRep: -2,
                    deltaSusp: 0,
                    bonusCredits: 200
                },
                {
                    text: "Risk > Reward.",
                    outcome: "DECLINE",
                    deltaRep: 0,
                    deltaSusp: 0,
                    lockTime: -1 // Locked for entire loop
                }
            ]
        }
    },
    {
        id: "M-005",
        name: "Musk Clinic Recon",
        gatingRules: {
            or: [
                { standing: { "Muskers": { min: 15 } } },
                { territories: { "Muskers Territory": { min: 1 } } }
            ]
        },
        contact: "Magnus",
        faction: "Muskers",
        dialogueTree: {
            npcLine: "Tour the showroom – real *subdermals*, real ROI.",
            options: [
                {
                    text: "Let's augment.",
                    outcome: "ACCEPT",
                    deltaRep: 3,
                    deltaSusp: 0
                },
                {
                    text: "I'll pass on the abs.",
                    outcome: "DECLINE",
                    deltaRep: -5,
                    deltaSusp: 0,
                    sabotageChanceBoost: 10 // % increase in Muskers sabotage chance
                }
            ]
        }
    }
    // More missions would be added here
];

// Function to check mission requirements
function checkMissionRequirements(mission, gameState) {
    // Skip if mission is locked
    if (directorState.lockedMissions[mission.id]) {
        const unlockTime = directorState.lockedMissions[mission.id];
        if (unlockTime === -1 || unlockTime > Date.now()) {
            return false;
        } else {
            // Unlock the mission if time has passed
            delete directorState.lockedMissions[mission.id];
        }
    }
    
    // Check if already active or completed
    if (directorState.activeMissions.some(m => m.id === mission.id) || 
        directorState.completedMissions.includes(mission.id)) {
        return false;
    }
    
    // Process gating rules
    const rules = mission.gatingRules;
    
    // Check faction standing requirements
    if (rules.standing) {
        for (const [faction, requirement] of Object.entries(rules.standing)) {
            const standing = directorState.factionStanding[faction] || 0;
            if ((requirement.min !== undefined && standing < requirement.min) ||
                (requirement.max !== undefined && standing > requirement.max)) {
                return false;
            }
        }
    }
    
    // Check territory control requirements
    if (rules.territories) {
        for (const [territory, requirement] of Object.entries(rules.territories)) {
            // This would need to connect to your territory system
            // Check if player controls territory or has minimum sectors
            const playerControl = getPlayerTerritoryControl(gameState, territory);
            
            if (requirement.controlled && !playerControl.controlled) {
                return false;
            }
            
            if (requirement.min !== undefined && playerControl.sectors < requirement.min) {
                return false;
            }
            
            if (requirement.percent !== undefined && 
                playerControl.percent < requirement.percent) {
                return false;
            }
        }
    }
    
    // Check "or" conditions (any should pass)
    if (rules.or) {
        let anyPassed = false;
        for (const condition of rules.or) {
            // Create a temporary mission with just this condition
            const tempMission = { ...mission, gatingRules: condition };
            if (checkMissionRequirements(tempMission, gameState)) {
                anyPassed = true;
                break;
            }
        }
        if (!anyPassed) return false;
    }
    
    // All checks passed
    return true;
}

// Helper function to get player territory control information
function getPlayerTerritoryControl(gameState, territory) {
    // This is a placeholder - implement based on your territory system
    if (!gameState.territories || !gameState.territories[territory]) {
        return { controlled: false, sectors: 0, percent: 0 };
    }
    
    const territoryData = gameState.territories[territory];
    return {
        controlled: territoryData.controlled || false,
        sectors: territoryData.playerSectors || 0,
        percent: territoryData.playerPercent || 0
    };
}

// Function to update available missions
function updateAvailableMissions(gameState) {
    directorState.availableMissions = missionCatalog
        .filter(mission => checkMissionRequirements(mission, gameState));
    
    console.log(`Director: ${directorState.availableMissions.length} missions available`);
}

// Function to handle reputation changes
function applyReputationChange(faction, delta, gameState) {
    if (!directorState.factionStanding[faction]) {
        console.error(`Unknown faction: ${faction}`);
        return;
    }
    
    // Get current standing
    const oldStanding = directorState.factionStanding[faction];
    
    // Apply the delta directly to the target faction
    directorState.factionStanding[faction] = Math.max(-100, Math.min(100, oldStanding + delta));
    
    // Get the new standing
    const newStanding = directorState.factionStanding[faction];
    
    console.log(`Director: ${faction} standing changed from ${oldStanding} to ${newStanding}`);
    
    // Apply ripple effects to other factions based on the matrix
    const effectMatrix = factionMatrix[faction];
    for (const [otherFaction, effect] of Object.entries(effectMatrix)) {
        if (otherFaction === faction || effect === 0) continue;
        
        // Calculate proportional effect
        const rippleDelta = (delta * effect) / 100;
        if (rippleDelta === 0) continue;
        
        // Apply to the other faction
        const oldRippleStanding = directorState.factionStanding[otherFaction];
        directorState.factionStanding[otherFaction] = Math.max(-100, Math.min(100, 
            oldRippleStanding + rippleDelta));
            
        console.log(`Director: Ripple effect - ${otherFaction} standing changed from ${oldRippleStanding} to ${directorState.factionStanding[otherFaction]}`);
    }
    
    // Check for standing tier changes and trigger events
    checkStandingTierChanges(faction, oldStanding, newStanding, gameState);
    
    // Update available missions
    updateAvailableMissions(gameState);
}

// Function to check standing tier changes
function checkStandingTierChanges(faction, oldStanding, newStanding, gameState) {
    // Get old and new tiers
    const oldTier = getStandingTier(oldStanding);
    const newTier = getStandingTier(newStanding);
    
    if (oldTier !== newTier) {
        console.log(`Director: ${faction} standing tier changed from ${oldTier} to ${newTier}`);
        
        // If faction became hostile, queue hostile events
        if (newTier === "Hostile" && oldTier !== "Hostile") {
            queueHostileEvent(faction, gameState);
        }
        
        // If faction became friendly or ally, queue positive events
        if ((newTier === "Friendly" || newTier === "Ally") && 
            (oldTier !== "Friendly" && oldTier !== "Ally")) {
            queuePositiveEvent(faction, gameState);
        }
    }
}

// Helper function to get standing tier based on value
function getStandingTier(standing) {
    for (const [tier, range] of Object.entries(standingTiers)) {
        if (standing >= range.min && standing <= range.max) {
            return tier;
        }
    }
    return "Neutral"; // Default
}

// Queue a hostile event from a faction
function queueHostileEvent(faction, gameState) {
    console.log(`Director: Queueing hostile event from ${faction}`);
    
    // Increase suspicion from hostile faction
    directorState.suspicion += 5;
    
    // This would integrate with your event system to create faction-specific
    // hostility events like attacks, sabotage, etc.
    // For now, we'll just add a simple flag that could be checked elsewhere
    
    directorState.hostileFactions = directorState.hostileFactions || {};
    directorState.hostileFactions[faction] = Date.now();
}

// Queue a positive event from a faction
function queuePositiveEvent(faction, gameState) {
    console.log(`Director: Queueing positive event from ${faction}`);
    
    // This would integrate with your event system to create faction-specific
    // positive events like bonuses, special offers, etc.
}

// Function to handle mission dialogue and outcome
function processMissionDialogue(missionId, choiceIndex, gameState) {
    // Find the mission
    const mission = missionCatalog.find(m => m.id === missionId);
    if (!mission) {
        console.error(`Mission not found: ${missionId}`);
        return null;
    }
    
    // Get the chosen option
    const choice = mission.dialogueTree.options[choiceIndex];
    if (!choice) {
        console.error(`Choice not found at index ${choiceIndex}`);
        return null;
    }
    
    console.log(`Director: Processing mission dialogue for ${mission.name}, choice: ${choice.text}`);
    
    // Apply standing changes
    if (choice.deltaRep !== 0) {
        applyReputationChange(mission.faction, choice.deltaRep, gameState);
    }
    
    // Apply suspicion changes
    if (choice.deltaSusp !== 0) {
        directorState.suspicion = Math.max(0, Math.min(100, 
            directorState.suspicion + choice.deltaSusp));
    }
    
    // Handle choice outcome
    switch (choice.outcome) {
        case "ACCEPT":
            // Add to active missions
            directorState.activeMissions.push({
                ...mission,
                startTime: Date.now()
            });
            break;
            
        case "NEGOTIATE":
            // Apply negotiation effects
            if (choice.bonusCredits) {
                // Apply upfront credits
                gameState.resources.credits += choice.bonusCredits;
            }
            
            // Add to active missions with negotiated flag
            directorState.activeMissions.push({
                ...mission,
                startTime: Date.now(),
                negotiated: true
            });
            break;
            
        case "DECLINE":
            // Lock mission if specified
            if (choice.lockTime) {
                if (choice.lockTime === -1) {
                    // Lock for the entire loop
                    directorState.lockedMissions[mission.id] = -1;
                } else {
                    // Lock for specific time (in minutes)
                    const unlockTime = Date.now() + (choice.lockTime * 60 * 1000);
                    directorState.lockedMissions[mission.id] = unlockTime;
                }
            }
            
            // Handle hostility if specified
            if (choice.hostility) {
                // Set faction to hostile
                directorState.factionStanding[mission.faction] = -75;
                checkStandingTierChanges(
                    mission.faction, 
                    directorState.factionStanding[mission.faction], 
                    -75,
                    gameState
                );
            }
            
            // Handle sabotage unlock if specified
            if (choice.unlockSabotage) {
                // This would integrate with your sabotage system
                console.log(`Director: Unlocked sabotage: ${choice.unlockSabotage}`);
            }
            break;
    }
    
    // Update available missions
    updateAvailableMissions(gameState);
    
    // Log to analytics
    analytics.logMissionInteraction(mission.id, choice.outcome, choice.deltaRep, choice.deltaSusp);
    
    // Return the outcome for UI handling
    return {
        missionId: mission.id,
        missionName: mission.name,
        outcome: choice.outcome,
        deltaRep: choice.deltaRep,
        deltaSusp: choice.deltaSusp,
        faction: mission.faction
    };
}

// Function to decay faction standings over time
function decayFactionStandings() {
    const now = Date.now();
    const timeSinceLastDecay = now - directorState.lastRepDecay;
    
    // Decay every 10 minutes (600000 ms)
    if (timeSinceLastDecay >= 600000) {
        console.log("Director: Decaying faction standings");
        
        // Decay each faction standing that's not at an extreme
        for (const [faction, standing] of Object.entries(directorState.factionStanding)) {
            // Skip if already at Ally or Hostile tier
            if (standing >= 75 || standing <= -75) continue;
            
            // Decay by 1 point toward neutral
            if (standing > 0) {
                directorState.factionStanding[faction] = Math.max(0, standing - 1);
            } else if (standing < 0) {
                directorState.factionStanding[faction] = Math.min(0, standing + 1);
            }
        }
        
        directorState.lastRepDecay = now;
    }
}

// Function to complete a mission
function completeMission(missionId, success, gameState) {
    // Find the active mission
    const missionIndex = directorState.activeMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) {
        console.error(`Active mission not found: ${missionId}`);
        return;
    }
    
    const mission = directorState.activeMissions[missionIndex];
    
    console.log(`Director: Completing mission ${mission.name}, success: ${success}`);
    
    // Remove from active missions
    directorState.activeMissions.splice(missionIndex, 1);
    
    // Add to completed missions
    directorState.completedMissions.push(missionId);
    
    // Apply success/failure effects
    if (success) {
        // Apply success bonuses
        // This would integrate with your reward system
        
        // Additional standing boost
        applyReputationChange(mission.faction, 2, gameState);
    } else {
        // Apply failure penalties
        // This would integrate with your penalty system
        
        // Standing penalty
        applyReputationChange(mission.faction, -3, gameState);
    }
    
    // Log to analytics
    analytics.logMissionCompletion(missionId, success);
    
    // Update available missions
    updateAvailableMissions(gameState);
}

// Function to handle a territory capture
function handleTerritoryCapture(territory, previousOwner, gameState) {
    console.log(`Director: Territory captured: ${territory}, previous owner: ${previousOwner}`);
    
    if (!previousOwner) return;
    
    // Apply standing penalty to previous owner
    applyReputationChange(previousOwner, -25, gameState);
    
    // Find the worst enemy of previous owner and give them a boost
    let worstEnemy = null;
    let worstValue = 0;
    
    for (const [faction, value] of Object.entries(factionMatrix[previousOwner])) {
        if (value < worstValue) {
            worstValue = value;
            worstEnemy = faction;
        }
    }
    
    if (worstEnemy) {
        applyReputationChange(worstEnemy, 15, gameState);
    }
    
    // Lock missions from previous owner in this territory
    for (const mission of missionCatalog) {
        if (mission.faction === previousOwner && 
            mission.gatingRules.territories && 
            mission.gatingRules.territories[territory]) {
            
            // Lock for the loop
            directorState.lockedMissions[mission.id] = -1;
        }
    }
    
    // Update available missions
    updateAvailableMissions(gameState);
} 