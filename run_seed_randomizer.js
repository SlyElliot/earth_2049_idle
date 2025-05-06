// Run-Seed Randomizer Framework
// Procedurally generates randomized conditions for each game loop

// Main class for seeded random number generation
class PRNG {
    constructor(seed) {
        // Convert seed string to a numeric seed if needed
        if (typeof seed === 'string') {
            seed = this.hashString(seed);
        }
        
        // Initialize state with seed
        this.state = BigInt(seed) & BigInt("0xFFFFFFFFFFFFFFFF"); // 64-bit mask
    }
    
    // Simple hash function for strings
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    // SHA-256 like hash for seed generation
    static generateSeed(playerId, loopIndex, timestamp) {
        const input = `${playerId}-${loopIndex}-${timestamp}`;
        
        // Using a simple hash for demonstration
        // In production, use a proper SHA-256 implementation
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = ((hash << 5) - hash) + input.charCodeAt(i);
            hash |= 0;
        }
        
        return Math.abs(hash).toString(16).padStart(16, '0');
    }
    
    // Generate a random number between 0 and 1
    random() {
        // xorshift64* algorithm (simple but effective PRNG)
        this.state ^= this.state >> BigInt(12);
        this.state ^= this.state << BigInt(25);
        this.state ^= this.state >> BigInt(27);
        
        // Convert to floating point between 0 and 1
        const result = Number((this.state * BigInt("0x2545F4914F6CDD1D")) >> BigInt(32)) / 0x100000000;
        return Math.abs(result);
    }
    
    // Generate an integer between min and max (inclusive)
    randint(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
    
    // Pick a random item from an array
    pick(array, weights = null) {
        if (array.length === 0) return null;
        
        if (weights) {
            // Weighted random selection
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
            const randomValue = this.random() * totalWeight;
            
            let weightSum = 0;
            for (let i = 0; i < array.length; i++) {
                weightSum += weights[i];
                if (randomValue <= weightSum) {
                    return array[i];
                }
            }
            
            // Fallback
            return array[array.length - 1];
        }
        
        // Simple random selection
        return array[Math.floor(this.random() * array.length)];
    }
    
    // Pick multiple random items from an array
    sample(array, count, weights = null) {
        if (count >= array.length) {
            return [...array]; // Return a copy of the entire array
        }
        
        const result = [];
        const tempArray = [...array];
        const tempWeights = weights ? [...weights] : null;
        
        for (let i = 0; i < count; i++) {
            const index = tempWeights 
                ? this.weightedIndex(tempWeights)
                : Math.floor(this.random() * tempArray.length);
                
            result.push(tempArray[index]);
            
            // Remove the selected item to avoid duplicates
            tempArray.splice(index, 1);
            if (tempWeights) tempWeights.splice(index, 1);
        }
        
        return result;
    }
    
    // Get a weighted random index
    weightedIndex(weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const randomValue = this.random() * totalWeight;
        
        let weightSum = 0;
        for (let i = 0; i < weights.length; i++) {
            weightSum += weights[i];
            if (randomValue <= weightSum) {
                return i;
            }
        }
        
        return weights.length - 1;
    }
    
    // Shuffle an array (Fisher-Yates algorithm)
    shuffle(array) {
        const result = [...array]; // Create a copy
        
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]]; // Swap
        }
        
        return result;
    }
    
    // Weighted shuffle
    weightedShuffle(array, weights) {
        // Create weighted entries
        const weighted = array.map((item, i) => ({ 
            item, 
            weight: weights[i] || 1 
        }));
        
        // Sort by random weight
        weighted.sort((a, b) => {
            const randomA = this.random() * a.weight;
            const randomB = this.random() * b.weight;
            return randomB - randomA;
        });
        
        // Return shuffled items
        return weighted.map(w => w.item);
    }
    
    // Get the current state (for saving/debugging)
    getState() {
        return this.state.toString(16);
    }
    
    // Set the state (for restoring)
    setState(stateStr) {
        this.state = BigInt('0x' + stateStr);
    }
}

// Main randomizer class
class RunSeedRandomizer {
    constructor() {
        this.rng = null;
        this.seed = null;
        this.blueprint = {
            sectorOwnership: {},
            diplomacy: {},
            mindControlIndex: 0,
            turingDisposition: "Observation",
            mutators: []
        };
        
        // Load data from JSON files (placeholder)
        this.loadData();
    }
    
    // Initialize with player info
    init(playerId, loopIndex, timestamp = Date.now()) {
        // Generate seed
        this.seed = PRNG.generateSeed(playerId, loopIndex, timestamp);
        
        // Initialize RNG
        this.rng = new PRNG(this.seed);
        
        console.log(`Randomizer initialized with seed: ${this.seed}`);
        
        // Generate the run blueprint
        this.generateRunBlueprint(loopIndex);
        
        return this.blueprint;
    }
    
    // Load data from JSON files
    loadData() {
        // Initialize with default data
        this.data = {
            districts: [
                "downtown", "industrialZone", "techDistrict", "harborArea", 
                "livingTowers", "governmentQuarter", "muskersTerritory",
                "cryptidsDomain", "shillzCentral", "mechRebelsBase", 
                "hackersDen", "revolutionaryHub", "abandonedSector",
                "aiLabs", "gigaCorpHQ"
            ],
            homeDistricts: {
                "ShillZ": "shillzCentral",
                "GigaCorp": "gigaCorpHQ",
                "Muskers": "muskersTerritory",
                "Cryptids": "cryptidsDomain",
                "Hackers": "hackersDen",
                "MechRebels": "mechRebelsBase"
            },
            factions: [
                "ShillZ", "GigaCorp", "Muskers", "Cryptids", "Hackers", "MechRebels"
            ],
            factionWeights: {
                "ShillZ": 50,
                "GigaCorp": 40,
                "Muskers": 50,
                "Cryptids": 40,
                "Hackers": 50,
                "MechRebels": 40
            },
            diplomacyRules: {
                "ShillZ": {
                    ally_choices: ["Muskers", "Hackers", "MechRebels"],
                    rival_choices: ["GigaCorp", "Cryptids"]
                },
                "GigaCorp": {
                    ally_choices: ["Muskers", "Cryptids"],
                    rival_choices: ["ShillZ", "Hackers", "MechRebels"]
                },
                "Muskers": {
                    ally_choices: ["ShillZ", "GigaCorp", "MechRebels"],
                    rival_choices: ["Cryptids", "Hackers"]
                },
                "Cryptids": {
                    ally_choices: ["GigaCorp", "Hackers"],
                    rival_choices: ["ShillZ", "Muskers", "MechRebels"]
                },
                "Hackers": {
                    ally_choices: ["ShillZ", "Cryptids", "MechRebels"],
                    rival_choices: ["GigaCorp", "Muskers"]
                },
                "MechRebels": {
                    ally_choices: ["ShillZ", "Muskers", "Hackers"],
                    rival_choices: ["GigaCorp", "Cryptids"]
                }
            },
            mutators: [
                {
                    id: "economyBoost",
                    name: "Economy Boost",
                    description: "Increases all resource generation",
                    category: "Economy",
                    effect: {
                        "credits": 1.25,
                        "followers": 1.2,
                        "influence": 1.15,
                        "techPoints": 1.2,
                        "energy": 1.15
                    }
                },
                {
                    id: "resourceScarcity",
                    name: "Resource Scarcity",
                    description: "Decreases resource generation",
                    category: "Economy",
                    effect: {
                        "credits": 0.8,
                        "followers": 0.85,
                        "influence": 0.9,
                        "techPoints": 0.85,
                        "energy": 0.9
                    }
                },
                {
                    id: "diplomaticTensions",
                    name: "Diplomatic Tensions",
                    description: "Makes factions more hostile",
                    category: "Diplomacy",
                    effect: {
                        "reputationGainRate": 0.75,
                        "reputationLossRate": 1.25
                    }
                }
            ],
            dispositions: [
                {
                    name: "Observation",
                    minMindControl: 0,
                    maxMindControl: 30
                },
                {
                    name: "Assistance",
                    minMindControl: 31,
                    maxMindControl: 60
                },
                {
                    name: "Control",
                    minMindControl: 61,
                    maxMindControl: 100
                }
            ]
        };
        
        // Log the initial data
        console.log("Initialized randomizer with default data:", this.data);
        
        // Try to load data from JSON files
        fetch('data/randomizer/districts.json')
            .then(response => response.json())
            .then(data => {
                this.data.districts = data.districts || this.data.districts;
                this.data.homeDistricts = data.homeDistricts || this.data.homeDistricts;
                console.log("Districts data loaded");
            })
            .catch(error => {
                console.error("Error loading districts data:", error);
                // Fallback data already set
            });
        
        // Load factions data
        fetch('data/randomizer/factions.json')
            .then(response => response.json())
            .then(data => {
                this.data.factions = data.factions || this.data.factions;
                this.data.factionWeights = data.factionWeights || this.data.factionWeights;
                this.data.diplomacyRules = data.diplomacyRules || this.data.diplomacyRules;
                console.log("Factions data loaded");
            })
            .catch(error => {
                console.error("Error loading factions data:", error);
                // Fallback data already set
            });
        
        // Load mutators data
        fetch('data/randomizer/mutators.json')
            .then(response => response.json())
            .then(data => {
                this.data.mutators = data.mutators || this.data.mutators;
                this.data.dispositions = data.dispositions || this.data.dispositions;
                console.log("Mutators data loaded");
            })
            .catch(error => {
                console.error("Error loading mutators data:", error);
                // Fallback data already set
            });
    }
    
    // Generate a complete run blueprint
    generateRunBlueprint(loopIndex) {
        // Reset blueprint
        this.blueprint = {
            seed: this.seed,
            sectorOwnership: {},
            diplomacy: {},
            mindControlIndex: 0,
            turingDisposition: "Observation",
            mutators: []
        };
        
        // Step 1: Roll sector ownership
        this.rollSectorOwnership();
        
        // Step 2: Roll diplomacy network
        this.rollDiplomacy();
        
        // Step 3: Roll mind control index and Turing disposition
        this.rollMindControlAndDisposition(loopIndex);
        
        // Step 4: Roll mutators
        this.rollMutators(loopIndex);
        
        // Save blueprint
        this.saveRunBlueprint();
        
        return this.blueprint;
    }
    
    // Roll sector ownership
    rollSectorOwnership() {
        // Get all non-home districts
        const homeDistricts = Object.values(this.data.homeDistricts);
        const nonHomeDistricts = this.data.districts.filter(d => !homeDistricts.includes(d));
        
        // Shuffle districts
        const shuffledDistricts = this.rng.shuffle(nonHomeDistricts);
        
        // Get weighted factions
        const factions = this.data.factions;
        const weights = factions.map(f => this.data.factionWeights[f] || 50);
        const shuffledFactions = this.rng.weightedShuffle(factions, weights);
        
        // Assign home districts
        for (const [faction, district] of Object.entries(this.data.homeDistricts)) {
            this.blueprint.sectorOwnership[district] = faction;
        }
        
        // Assign other districts
        let factionIndex = 0;
        const factionCounts = {};
        factions.forEach(f => factionCounts[f] = 1); // Start with 1 for home district
        
        for (const district of shuffledDistricts) {
            let assigned = false;
            
            // Try each faction in turn
            for (let i = 0; i < shuffledFactions.length; i++) {
                const faction = shuffledFactions[(factionIndex + i) % shuffledFactions.length];
                
                // Check if faction is below 30% threshold
                if (factionCounts[faction] / this.data.districts.length < 0.3) {
                    this.blueprint.sectorOwnership[district] = faction;
                    factionCounts[faction]++;
                    assigned = true;
                    break;
                }
            }
            
            // If no faction is below threshold, assign to the one with fewest districts
            if (!assigned) {
                const minFaction = factions.reduce((min, f) => 
                    factionCounts[f] < factionCounts[min] ? f : min, factions[0]);
                
                this.blueprint.sectorOwnership[district] = minFaction;
                factionCounts[minFaction]++;
            }
            
            // Move to next faction in rotation
            factionIndex = (factionIndex + 1) % shuffledFactions.length;
        }
        
        console.log("Sector ownership assigned:", this.blueprint.sectorOwnership);
    }
    
    // Roll diplomacy
    rollDiplomacy() {
        const factions = this.data.factions;
        
        // Initialize empty diplomacy graph
        factions.forEach(f => {
            this.blueprint.diplomacy[f] = {
                allies: [],
                rivals: []
            };
        });
        
        // For each faction, assign allies and rivals
        for (const faction of factions) {
            const rules = this.data.diplomacyRules[faction];
            
            if (!rules) {
                console.warn(`No diplomacy rules found for faction: ${faction}`);
                continue;
            }
            
            // Pick 1-2 allies
            const allyCount = this.rng.randint(1, Math.min(2, rules.ally_choices.length));
            const allies = this.rng.sample(rules.ally_choices, allyCount);
            
            // Pick 1-2 rivals
            const rivalCount = this.rng.randint(1, Math.min(2, rules.rival_choices.length));
            const rivals = this.rng.sample(rules.rival_choices, rivalCount);
            
            // Apply constraints
            // Cannot ally with GigaCorp and Hackers simultaneously
            if (allies.includes("GigaCorp") && allies.includes("Hackers")) {
                const toRemove = this.rng.random() < 0.5 ? "GigaCorp" : "Hackers";
                const index = allies.indexOf(toRemove);
                allies.splice(index, 1);
            }
            
            // Assign
            this.blueprint.diplomacy[faction].allies = allies;
            this.blueprint.diplomacy[faction].rivals = rivals;
        }
        
        console.log("Diplomacy network generated:", this.blueprint.diplomacy);
    }
    
    // Roll mind control index and Turing disposition
    rollMindControlAndDisposition(loopIndex) {
        // Base mind control increases with loop
        const baseMindControl = Math.min(30 + loopIndex * 5, 80);
        
        // Random variation
        const variation = this.rng.randint(5, 15);
        
        // Previous run + minimum increase
        let mindControl = baseMindControl + variation;
        
        // Clamp between 0 and 100
        mindControl = Math.max(0, Math.min(100, mindControl));
        
        this.blueprint.mindControlIndex = mindControl;
        
        // Determine Turing disposition
        for (const disposition of this.data.dispositions) {
            if (mindControl >= disposition.minMindControl && 
                mindControl <= disposition.maxMindControl) {
                this.blueprint.turingDisposition = disposition.name;
                break;
            }
        }
        
        console.log(`Mind Control Index: ${mindControl}, Disposition: ${this.blueprint.turingDisposition}`);
    }
    
    // Roll mutators
    rollMutators(loopIndex) {
        // No mutators on first loop
        if (loopIndex === 0) {
            return;
        }
        
        // Determine how many mutators to apply (0-2)
        const mutatorCount = this.rng.randint(0, Math.min(2, this.data.mutators.length));
        
        if (mutatorCount === 0) {
            return;
        }
        
        // Get previous mutators to avoid repeats
        let previousMutators = [];
        try {
            const prevData = localStorage.getItem('previousMutators');
            if (prevData) {
                previousMutators = JSON.parse(prevData);
            }
        } catch (error) {
            console.warn("Could not load previous mutators:", error);
        }
        
        // Filter out previous mutators
        let availableMutators = this.data.mutators.filter(
            mutator => !previousMutators.includes(mutator.id)
        );
        
        // If no mutators are available, reset
        if (availableMutators.length === 0) {
            availableMutators = this.data.mutators;
        }
        
        // Select random mutators
        const selectedMutators = this.rng.sample(availableMutators, mutatorCount);
        
        // Store in blueprint
        this.blueprint.mutators = selectedMutators;
        
        // Save for next time
        localStorage.setItem('previousMutators', 
            JSON.stringify(selectedMutators.map(m => m.id)));
        
        console.log("Applied mutators:", selectedMutators);
    }
    
    // Save blueprint to storage
    saveRunBlueprint() {
        try {
            localStorage.setItem('runBlueprint', JSON.stringify(this.blueprint));
            console.log("Run blueprint saved successfully");
        } catch (error) {
            console.error("Failed to save run blueprint:", error);
        }
    }
    
    // Get current blueprint
    getBlueprint() {
        return this.blueprint;
    }
    
    // Apply blueprint to game state
    applyToGameState(gameState) {
        if (!gameState) {
            console.error("No game state provided");
            return false;
        }
        
        console.log("Applying randomizer blueprint to game state:", this.blueprint);
        
        // Initialize faction standings if it doesn't exist
        if (!gameState.factionStanding) {
            console.log("Creating factionStanding object in gameState");
            gameState.factionStanding = {
                "ShillZ": 0,
                "GigaCorp": -50, // Player starts opposed to GigaCorp
                "Muskers": 0,
                "Cryptids": 0,
                "Hackers": 0,
                "MechRebels": 0
            };
        }
        
        // Apply sector ownership
        if (gameState.territories) {
            console.log("Applying sector ownership to territories");
            for (const [district, faction] of Object.entries(this.blueprint.sectorOwnership)) {
                // Convert district name to match territory keys if needed
                let territoryKey = district;
                
                // Handle possible naming mismatches between district IDs and territory keys
                if (!gameState.territories[district]) {
                    // Try to find a matching territory by doing a case-insensitive comparison
                    const possibleMatch = Object.keys(gameState.territories).find(
                        key => key.toLowerCase() === district.toLowerCase()
                    );
                    if (possibleMatch) {
                        territoryKey = possibleMatch;
                        console.log(`Found matching territory: ${district} -> ${territoryKey}`);
                    }
                }
                
                if (gameState.territories[territoryKey]) {
                    // Set owner property
                    gameState.territories[territoryKey].owner = faction;
                    
                    // Set controlled property - but don't set "unlocked" to keep game progression
                    if (typeof gameState.territories[territoryKey].controlled === 'undefined') {
                        gameState.territories[territoryKey].controlled = true;
                    }
                    
                    console.log(`Set territory ${territoryKey} owner to ${faction}`);
                } else {
                    console.warn(`Territory ${district} (${territoryKey}) not found in gameState. Available territories:`, Object.keys(gameState.territories));
                }
            }
        } else {
            console.warn("No territories object found in gameState");
        }
        
        // Apply diplomacy
        console.log("Applying diplomacy settings");
        for (const [faction, relations] of Object.entries(this.blueprint.diplomacy)) {
            // Set initial standings
            // Allies get positive standing
            relations.allies.forEach(ally => {
                if (gameState.factionStanding.hasOwnProperty(ally)) {
                    gameState.factionStanding[ally] = 20;
                    console.log(`Set ${ally} as ally (standing: 20)`);
                }
            });
            
            // Rivals get negative standing
            relations.rivals.forEach(rival => {
                if (gameState.factionStanding.hasOwnProperty(rival)) {
                    gameState.factionStanding[rival] = -20;
                    console.log(`Set ${rival} as rival (standing: -20)`);
                }
            });
        }
        
        // Apply mind control and disposition
        gameState.mindControlIndex = this.blueprint.mindControlIndex;
        gameState.turingDisposition = this.blueprint.turingDisposition;
        console.log(`Set mindControlIndex to ${gameState.mindControlIndex}`);
        console.log(`Set turingDisposition to ${gameState.turingDisposition}`);
        
        // Apply mutators
        console.log("Applying mutators");
        this.blueprint.mutators.forEach(mutator => {
            // Apply effect based on category
            if (mutator.category === "Economy") {
                // Apply economic effects
                if (gameState.rates) {
                    for (const [resource, multiplier] of Object.entries(mutator.effect)) {
                        if (gameState.rates[resource]) {
                            gameState.rates[resource] *= multiplier;
                        }
                    }
                }
            } else if (mutator.category === "Territory") {
                // Apply territory effects
                // Example: mission spawn rates
                gameState.missionRateMultipliers = gameState.missionRateMultipliers || {};
                for (const [key, value] of Object.entries(mutator.effect)) {
                    gameState.missionRateMultipliers[key] = value;
                }
            } else if (mutator.category === "Director") {
                // Apply AI Director effects
                gameState.directorModifiers = gameState.directorModifiers || {};
                for (const [key, value] of Object.entries(mutator.effect)) {
                    gameState.directorModifiers[key] = value;
                }
            } else if (mutator.category === "Diplomacy") {
                // Apply diplomacy effects
                gameState.diplomacyModifiers = gameState.diplomacyModifiers || {};
                for (const [key, value] of Object.entries(mutator.effect)) {
                    gameState.diplomacyModifiers[key] = value;
                }
            }
            
            // Log the applied mutator
            console.log(`Applied mutator: ${mutator.name} - ${mutator.description}`);
        });
        
        console.log("Randomizer blueprint successfully applied to game state");
        return true;
    }
    
    // Add UI rendering methods to the RunSeedRandomizer class

    // Add after the applyToGameState method
    renderUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`UI container not found: ${containerId}`);
            return;
        }
        
        // Create the UI structure
        let html = `
            <div class="randomizer-ui">
                <div class="randomizer-header">
                    <h3>Run Seed Randomizer</h3>
                    <div class="randomizer-seed">Seed: ${this.seed || 'Not initialized'}</div>
                </div>
                
                <div class="randomizer-sections">
                    <!-- Sector Ownership Section -->
                    <div class="randomizer-section">
                        <h4>Sector Ownership</h4>
                        <table class="randomizer-table">
                            <thead>
                                <tr>
                                    <th>District</th>
                                    <th>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        // Add sector ownership rows
        for (const [district, faction] of Object.entries(this.blueprint.sectorOwnership)) {
            html += `
                <tr>
                    <td>${district}</td>
                    <td>${faction}</td>
                </tr>
            `;
        }
        
        html += `
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Diplomacy Section -->
                    <div class="randomizer-section">
                        <h4>Diplomatic Network</h4>
                        <table class="randomizer-table">
                            <thead>
                                <tr>
                                    <th>Faction</th>
                                    <th>Allies</th>
                                    <th>Rivals</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        // Add diplomacy rows
        for (const [faction, relations] of Object.entries(this.blueprint.diplomacy)) {
            const allies = relations.allies.map(a => `<span class="faction-ally">${a}</span>`).join(', ');
            const rivals = relations.rivals.map(r => `<span class="faction-rival">${r}</span>`).join(', ');
            
            html += `
                <tr>
                    <td>${faction}</td>
                    <td>${allies || 'None'}</td>
                    <td>${rivals || 'None'}</td>
                </tr>
            `;
        }
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Mind Control & Disposition -->
                <div class="randomizer-section">
                    <h4>Global Parameters</h4>
                    <div class="randomizer-item">
                        <strong>Mind Control Index:</strong> ${this.blueprint.mindControlIndex}/100
                    </div>
                    <div class="randomizer-item">
                        <strong>Turing Disposition:</strong> ${this.blueprint.turingDisposition}
                    </div>
                </div>
                
                <!-- Mutators -->
                <div class="randomizer-section">
                    <h4>Active Mutators</h4>
        `;
        
        // Add mutators
        if (this.blueprint.mutators.length === 0) {
            html += `<div class="randomizer-item">No active mutators</div>`;
        } else {
            for (const mutator of this.blueprint.mutators) {
                html += `
                    <div class="mutator-item">
                        <div class="mutator-name">${mutator.name}</div>
                        <div class="mutator-description">${mutator.description}</div>
                    </div>
                `;
            }
        }
        
        html += `
                </div>
                
                <!-- Controls -->
                <div class="randomizer-controls">
                    <button class="randomizer-button" id="randomizer-simulate-btn">Simulate Next Loop</button>
                    <button class="randomizer-button" id="randomizer-save-btn">Save Blueprint</button>
                    <button class="randomizer-button" id="randomizer-apply-btn">Apply to Game</button>
                </div>
            </div>
        `;
        
        // Update the container
        container.innerHTML = html;
        
        // Add event listeners
        const simulateBtn = document.getElementById('randomizer-simulate-btn');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => {
                // Get current loop index
                const loopIndex = (window.gameState?.loopCount || 0) + 1;
                
                // Re-initialize with new loop
                this.init('player1', loopIndex, Date.now());
                
                // Update UI
                this.renderUI(containerId);
            });
        }
        
        const saveBtn = document.getElementById('randomizer-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveRunBlueprint();
                alert('Run blueprint saved!');
            });
        }
        
        const applyBtn = document.getElementById('randomizer-apply-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                if (window.gameState) {
                    this.applyToGameState(window.gameState);
                    alert('Applied to game state!');
                } else {
                    alert('Game state not available');
                }
            });
        }
    }
}

// Create a global instance
window.randomizer = new RunSeedRandomizer();

// Initialize the randomizer when the game starts
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Run Seed Randomizer");
    
    // Default player ID if not available
    const playerId = window.gameState?.playerId || "player1";
    
    // Get loop index from game state
    const loopIndex = window.gameState?.loopCount || 0;
    
    // Initialize with current time
    window.randomizer.init(playerId, loopIndex, Date.now());
    
    // Apply to game state
    if (window.gameState) {
        window.randomizer.applyToGameState(window.gameState);
    }
    
    // Use the randomizer tab instead of creating a new container
    const randomizerTab = document.getElementById('randomizer-tab');
    if (randomizerTab) {
        window.randomizer.renderUI('randomizer-tab');
    } else {
        console.error("Randomizer tab not found in the DOM");
    }
}); 