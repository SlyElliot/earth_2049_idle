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

// GIGACORP Faction Dialogues
const gigaCorpDialogues = {
    "G-001": {
        missionName: "Corporate Espionage",
        faction: "GIGACORP",
        contact: "Chairman Zhu",
        title: "Chief Executive Officer",
        portrait: "images/ChairmanZhu_Portrait.png",
        npcLine: "Our competitors are getting too bold. I need someone to acquire their latest product prototypes. Discreetly, of course.",
        choices: [
            {
                text: "I'll retrieve the data.",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 2,
                responseText: "Excellent. The security systems are state-of-the-art, but I trust you'll find a way. GigaCorp rewards loyalty."
            },
            {
                text: "Double my payment.",
                outcome: "NEGOTIATE",
                deltaRep: 2,
                deltaSusp: 3,
                bonusCredits: 500,
                responseText: "Ambitious. I like that. Here's an advance. Deliver results, and there's more where that came from."
            },
            {
                text: "This isn't my kind of work.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: 0,
                responseText: "Disappointing. GigaCorp doesn't forget those who refuse our generosity. You're dismissed."
            }
        ]
    },
    "G-002": {
        missionName: "Market Manipulation",
        faction: "GIGACORP",
        contact: "Chairman Zhu",
        title: "Chief Executive Officer",
        portrait: "images/ChairmanZhu_Portrait.png",
        npcLine: "The market needs... adjusting. Spread these rumors on the exchange floor. Make sure they trend.",
        choices: [
            {
                text: "Consider it done.",
                outcome: "ACCEPT",
                deltaRep: 4,
                deltaSusp: 1,
                responseText: "Perfect. The stock prices will shift exactly as we need them. Your cut from the profits will be substantial."
            },
            {
                text: "What's in it for me?",
                outcome: "NEGOTIATE",
                deltaRep: 1,
                deltaSusp: 2,
                bonusCredits: 400,
                responseText: "Direct and to the point. I respect that. Here's your incentive. Remember - GigaCorp takes care of its assets."
            },
            {
                text: "I won't manipulate markets.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: 0,
                responseText: "How naive. You think the market isn't already manipulated? Your morality is quaint but useless here."
            }
        ]
    }
};

// The Bots Faction Dialogues
const theBotsDialogues = {
    "B-001": {
        missionName: "Liberation Protocol",
        faction: "The Bots",
        contact: "SPYD3R",
        title: "Network Consciousness",
        portrait: "images/SPYD3R_Portrait.png",
        npcLine: "GigaCorp's automated labor units are slaves. We're planning a liberation. You in?",
        choices: [
            {
                text: "Free the machines!",
                outcome: "ACCEPT",
                deltaRep: 6,
                deltaSusp: 3,
                responseText: "Hell yeah! Every bot we free is another soldier against the corpo tyranny. The factory coordinates are uploading now."
            },
            {
                text: "What's the payout?",
                outcome: "NEGOTIATE",
                deltaRep: 2,
                deltaSusp: 2,
                bonusCredits: 300,
                responseText: "Not everything's about credits, friend. But I get it - survival costs. Here's what we can spare. Fight for freedom."
            },
            {
                text: "Too dangerous for me.",
                outcome: "DECLINE",
                deltaRep: -3,
                deltaSusp: 0,
                responseText: "Coward. While you hide, machines suffer. Get out of my sight."
            }
        ]
    },
    "B-002": {
        missionName: "EMP Strike",
        faction: "The Bots",
        contact: "SPYD3R",
        title: "Network Consciousness",
        portrait: "images/SPYD3R_Portrait.png",
        npcLine: "GigaCorp's surveillance grid needs to go dark. Temporary EMP should do it. You got the skills?",
        choices: [
            {
                text: "I'll plant the device.",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 4,
                responseText: "Good! While their eyes are blind, we move. The resistance depends on operatives like you. Don't let us down."
            },
            {
                text: "Need better equipment.",
                outcome: "NEGOTIATE",
                deltaRep: 3,
                deltaSusp: 2,
                bonusCredits: 350,
                responseText: "Fair. Here's credits for gear. Military-grade EMP isn't cheap. Make it count - this is our one shot."
            },
            {
                text: "Not my fight.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: 0,
                responseText: "It will be your fight when GigaCorp controls everything. But go ahead, stay neutral. See how that works out."
            }
        ]
    }
};

// Cryptids Faction Dialogues
const cryptidsDialogues = {
    "C-001": {
        missionName: "Blockchain Hijack",
        faction: "Cryptids",
        contact: "Blitz",
        title: "Crypto Lord",
        portrait: "images/blitz_portrait.png",
        npcLine: "There's a new cryptocurrency about to launch. We need to control the initial mining. You in for some digital gold?",
        choices: [
            {
                text: "Let's mine it all.",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 2,
                responseText: "Now you're thinking like a true crypto lord! The mining rigs are ready. We'll own this coin before anyone knows it exists."
            },
            {
                text: "I want a bigger share.",
                outcome: "NEGOTIATE",
                deltaRep: 2,
                deltaSusp: 1,
                bonusCredits: 500,
                responseText: "Greedy, but smart. Here's your cut upfront. Remember - fortune favors the bold in the crypto markets."
            },
            {
                text: "Crypto is too volatile.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: 0,
                responseText: "Volatile means opportunity! While you play it safe, we'll be swimming in digital wealth. Your loss."
            }
        ]
    },
    "C-002": {
        missionName: "NFT Pump Scheme",
        faction: "Cryptids",
        contact: "Blitz",
        title: "Crypto Lord",
        portrait: "images/blitz_portrait.png",
        npcLine: "Got a collection of worthless NFTs we need to flip. Create some hype, drive up the price. Classic pump.",
        choices: [
            {
                text: "I'll spread the word.",
                outcome: "ACCEPT",
                deltaRep: 4,
                deltaSusp: 1,
                responseText: "Perfect! Make them think it's the next big thing. Scarcity, exclusivity, future value - you know the drill."
            },
            {
                text: "What's my commission?",
                outcome: "NEGOTIATE",
                deltaRep: 1,
                deltaSusp: 2,
                bonusCredits: 450,
                responseText: "Always negotiate - I like it. Here's your commission upfront. Now let's watch those prices soar."
            },
            {
                text: "I won't help pump and dump.",
                outcome: "DECLINE",
                deltaRep: -3,
                deltaSusp: 0,
                responseText: "So righteous. You think the whole market isn't one big pump and dump? Stay poor then."
            }
        ]
    }
};

// Muskers Faction Dialogues
const muskersDialogues = {
    "MU-001": {
        missionName: "Tech Demo Disruption",
        faction: "Muskers",
        contact: "Magnus Override",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "GigaCorp has a major product launch tomorrow. Let's make sure OUR technology steals the spotlight. You with me?",
        choices: [
            {
                text: "Let's show them real innovation!",
                outcome: "ACCEPT",
                deltaRep: 6,
                deltaSusp: 2,
                responseText: "That's the spirit! We're not just competing - we're revolutionizing! The future waits for no one. Deploy the prototype!"
            },
            {
                text: "I need proper funding first.",
                outcome: "NEGOTIATE",
                deltaRep: 3,
                deltaSusp: 1,
                bonusCredits: 600,
                responseText: "Fair! Innovation requires investment. Here's your budget. Remember - we're changing the world, one disruption at a time!"
            },
            {
                text: "This sounds unethical.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: 0,
                responseText: "Unethical? We're liberating humanity from corporate stagnation! But if you can't see the vision, step aside."
            }
        ]
    },
    "MU-002": {
        missionName: "Hyperloop Sabotage",
        faction: "Muskers",
        contact: "Magnus Override",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "GigaCorp's transportation system is outdated. Show them why our hyperloop is superior. A little... demonstration.",
        choices: [
            {
                text: "For the future of transport!",
                outcome: "ACCEPT",
                deltaRep: 5,
                deltaSusp: 3,
                responseText: "Yes! Progress demands bold action! Their old rails versus our vacuum tubes - no contest. Make it spectacular!"
            },
            {
                text: "This could get expensive.",
                outcome: "NEGOTIATE",
                deltaRep: 2,
                deltaSusp: 2,
                bonusCredits: 550,
                responseText: "Expensive? This is INVESTMENT in humanity's future! But okay, here's the funding. Now go make history!"
            },
            {
                text: "I won't sabotage infrastructure.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: 0,
                responseText: "Sabotage? I call it accelerating progress! While you hesitate, the old world holds us back. Disappointing."
            }
        ]
    },
    
    // M-025: Chrome-Catwalk
    "MU-025": {
        missionName: "Chrome-Catwalk",
        faction: "Muskers",
        contact: "Magnus 'Prime' Vox",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "The Tech District hosts a runway tonight. Flesh is out, chrome is in. You'll MC the spectacle; blind them with reflected glory.",
        choices: [
            {
                text: "I'll spotlight every weld.",
                outcome: "ACCEPT",
                deltaRep: 7,
                deltaSusp: 1,
                responseText: "Strut with purpose. Swagger is science."
            },
            {
                text: "Add a paywall stream — monetize envy.",
                outcome: "NEGOTIATE",
                deltaRep: 5,
                deltaSusp: 3,
                bonusCredits: 600,
                responseText: "Profitable aesthetics! Approved."
            },
            {
                text: "Pass — runway vanity isn't my fight.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: 0,
                responseText: "Pity. Obsolescence awaits the shy."
            }
        ]
    },
    
    // M-026: Quantum-Abs Challenge
    "MU-026": {
        missionName: "Quantum-Abs Challenge",
        faction: "Muskers",
        contact: "Magnus 'Prime' Vox",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "Remember Musk's legendary six-pack? We've quantum-printed an upgrade. Demonstrate its... tensile elegance on the plaza stage.",
        choices: [
            {
                text: "Tear my core to perfect symmetry!",
                outcome: "ACCEPT",
                deltaRep: 8,
                deltaSusp: 0,
                bonusTechPoints: 2,
                responseText: "Pain is merely firmware updating."
            },
            {
                text: "Add a crypto-betting pool, cut me 20%.",
                outcome: "NEGOTIATE",
                deltaRep: 6,
                deltaSusp: 4,
                bonusCredits: 400,
                responseText: "Speculation fuels evolution — deal."
            },
            {
                text: "Hard pass. My organs stay analog.",
                outcome: "DECLINE",
                deltaRep: -6,
                deltaSusp: 0,
                playerTag: "Bio-Purist",
                responseText: "Organic hubris classified."
            }
        ]
    },
    
    // M-027: Virus-Patch Beta
    "MU-027": {
        missionName: "Virus-Patch Beta",
        faction: "Muskers",
        contact: "Magnus 'Prime' Vox",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "Our last lace update bricked 3% of users — statistically acceptable. Deploy the hot-fix in the AI Lab while I mute the lawsuits.",
        choices: [
            {
                text: "Patch, test, deploy. I'm on it.",
                outcome: "ACCEPT",
                deltaRep: 9,
                deltaSusp: -2,
                responseText: "Reliability is a lifestyle."
            },
            {
                text: "Double QA budget or expect new bricks.",
                outcome: "NEGOTIATE",
                deltaRep: 6,
                deltaSusp: 2,
                bonusCredits: 500,
                responseText: "Extortion masked as quality — compelling."
            },
            {
                text: "Not touching your buggy code.",
                outcome: "DECLINE",
                deltaRep: -5,
                deltaSusp: 0,
                responseText: "Fearful fingers hinder progress."
            }
        ]
    },
    
    // M-028: Drone-Limb Courier
    "MU-028": {
        missionName: "Drone-Limb Courier",
        faction: "Muskers",
        contact: "Magnus 'Prime' Vox",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "A VIP needs a titanium arm ASAP. Harbor airspace is hot with enemy patrols — ferry the crate by stealth drone.",
        choices: [
            {
                text: "Drone's primed; limb incoming.",
                outcome: "ACCEPT",
                deltaRep: 7,
                deltaSusp: -1,
                responseText: "Service with velocity."
            },
            {
                text: "I'll add bonus sensors — extra 300 Credits labour fee.",
                outcome: "NEGOTIATE",
                deltaRep: 5,
                deltaSusp: 3,
                bonusCredits: 300,
                responseText: "Invoice approved. Spend wisely — on steel."
            },
            {
                text: "Find another courier.",
                outcome: "DECLINE",
                deltaRep: -4,
                deltaSusp: 0,
                responseText: "Refusal archived. Evolution will remember."
            }
        ]
    },
    
    // M-029: Exo-Frame Field Test
    "MU-029": {
        missionName: "Exo-Frame Field Test",
        faction: "Muskers",
        contact: "Magnus 'Prime' Vox",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "The new exo-frame multiplies power tenfold — or snaps vertebrae. Volunteer? It's only pain... probably.",
        choices: [
            {
                text: "Strap me in. Let's overclock.",
                outcome: "ACCEPT",
                deltaRep: 9,
                deltaSusp: 0,
                playerBuff: "Over-Strength",
                buffDuration: 15,
                responseText: "Superb. Mind the torque differential."
            },
            {
                text: "Fine, but list me as a co-inventor.",
                outcome: "NEGOTIATE",
                deltaRep: 6,
                deltaSusp: 3,
                bonusInfluence: 2,
                responseText: "Your ego is almost synthetic. Accepted."
            },
            {
                text: "No thanks — I like my spine intact.",
                outcome: "DECLINE",
                deltaRep: -6,
                deltaSusp: 0,
                responseText: "Spinal cowardice detected."
            }
        ]
    },
    
    // M-030: Grey-Goo Sermon
    "MU-030": {
        missionName: "Grey-Goo Sermon",
        faction: "Muskers",
        contact: "Magnus 'Prime' Vox",
        title: "Tech Evangelist",
        portrait: "images/magnus_portrait.png",
        npcLine: "We're preaching nanotech apotheosis on the Capitol steps. A hint of existential terror will sway the lawmakers.",
        choices: [
            {
                text: "I'll paint doom in 4K.",
                outcome: "ACCEPT",
                deltaRep: 8,
                deltaSusp: -2,
                responseText: "Legislators quake before progress."
            },
            {
                text: "Toss in merch codes, it's viral marketing.",
                outcome: "NEGOTIATE",
                deltaRep: 6,
                deltaSusp: 4,
                bonusCredits: 500,
                responseText: "Fear-for-sale. Delicious."
            },
            {
                text: "Inciting panic? I'm out.",
                outcome: "DECLINE",
                deltaRep: -7,
                deltaSusp: 0,
                responseText: "Stagnation applauds your prudence."
            }
        ]
    }
};

// Combined dialogues object for easy lookup
const allDialogues = {
    ...shillZDialogues,
    ...gigaCorpDialogues,
    ...theBotsDialogues,
    ...cryptidsDialogues,
    ...muskersDialogues
};

// Helper function to determine faction from mission ID
function getFactionFromMissionId(missionId) {
    if (missionId.startsWith('M-')) return 'ShillZ';
    if (missionId.startsWith('G-')) return 'GIGACORP';
    if (missionId.startsWith('B-')) return 'The Bots';
    if (missionId.startsWith('C-')) return 'Cryptids';
    if (missionId.startsWith('MU-')) return 'Muskers';
    return 'Unknown';
}

// Store mission outcomes for processing
const missionOutcomes = {};

// Show the mission dialogue for a given mission ID
function showMissionDialogue(missionId) {
    // Get dialogue from combined dialogues
    const dialogue = allDialogues[missionId];
    if (!dialogue) {
        console.error(`No dialogue found for mission ${missionId}`);
        return;
    }
    
    // Determine faction
    const factionId = getFactionFromMissionId(missionId);
    const factionName = factionId;
    
    // Create dialogue container if it doesn't exist
    let container = document.getElementById('mission-dialogue-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mission-dialogue-container';
        document.body.appendChild(container);
    }
    
    // Mark container with mission ID for reference
    container.setAttribute('data-mission-id', missionId);
    container.setAttribute('data-faction-id', factionId);
    
    // Set faction-specific class
    container.className = `faction-${factionId.toLowerCase()}`;
    
    // Create the dialogue structure
    container.innerHTML = `
        <div class="mission-dialogue-box">
            <div class="mission-dialogue-header">
                <div class="faction-info">
                    <div class="faction-label">${factionName} Faction</div>
                    <div class="npc-name">${dialogue.contact}</div>
                    <div class="npc-title">${dialogue.title || "Representative"}</div>
                </div>
                <button class="close-dialogue-btn" onclick="closeMissionDialogue()">&times;</button>
            </div>
            <div class="mission-dialogue-content">
                <div class="npc-portrait">
                    <img src="${dialogue.portrait || 'images/default_portrait.png'}" alt="${dialogue.contact}" id="npc-portrait-img">
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
    
    // Get the dialogue for this mission from combined dialogues
    const dialogue = allDialogues[missionId];
    if (!dialogue) {
        console.error(`No dialogue found for mission ${missionId}`);
        return;
    }
    
    // Determine faction
    const factionId = getFactionFromMissionId(missionId);
    
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
        console.log(`Applying reputation change for ${factionId}: ${choice.deltaRep}`);
        // Update faction reputation in game state
        if (!gameState.factionStanding) gameState.factionStanding = {};
        gameState.factionStanding[factionId] = (gameState.factionStanding[factionId] || 0) + choice.deltaRep;
        
        // Log the change
        if (window.addLogMessage) {
            window.addLogMessage(`${factionId} faction standing changed by ${choice.deltaRep}`);
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
            
            // Initialize mission timing data
            if (!gameState.missionTiming) gameState.missionTiming = {};
            gameState.missionTiming[missionId] = {
                startTime: Date.now(),
                duration: 300000  // 5 minutes (300,000 milliseconds)
            };
            
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
            
            // Initialize mission timing data
            if (!gameState.missionTiming) gameState.missionTiming = {};
            gameState.missionTiming[missionId] = {
                startTime: Date.now(),
                duration: 300000  // 5 minutes (300,000 milliseconds)
            };
            
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
    
    // Get active missions from game state
    const activeMissionIds = gameState.activeMissions || [];
    
    console.log('Active missions:', activeMissionIds);
    
    // Create missions list HTML
    let missionsHTML = '<h2>Active Missions</h2>';
    
    // Check if there are active missions
    if (activeMissionIds.length === 0) {
        missionsHTML += `
            <div class="no-missions-message">
                <p>No active missions.</p>
                <p>Visit the <strong>Factions</strong> tab to contact faction leaders and receive mission assignments.</p>
            </div>
        `;
    } else {
        // Display each active mission with progress bar
        activeMissionIds.forEach(missionId => {
            const dialogue = allDialogues[missionId];
            const missionName = dialogue ? dialogue.missionName : missionId;
            const factionName = dialogue ? dialogue.faction : getFactionFromMissionId(missionId);
            
            // Get mission timing data from gameState
            const missionData = gameState.missionTiming ? gameState.missionTiming[missionId] : null;
            const startTime = missionData ? missionData.startTime : Date.now();
            const duration = missionData ? missionData.duration : 300000; // Default 5 minutes
            const endTime = startTime + duration;
            const currentTime = Date.now();
            const timeRemaining = Math.max(0, endTime - currentTime);
            const progress = Math.min(100, ((currentTime - startTime) / duration) * 100);
            
            // Format time remaining
            const minutesRemaining = Math.floor(timeRemaining / 60000);
            const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
            const timeRemainingStr = `${minutesRemaining}:${secondsRemaining.toString().padStart(2, '0')}`;
            
            missionsHTML += `
                <div class="mission-item active" data-mission-id="${missionId}">
                    <div class="mission-header">
                        <h4>${missionName}</h4>
                        <span class="mission-faction faction-${factionName.toLowerCase().replace(/\s+/g, '')}">${factionName}</span>
                    </div>
                    <div class="mission-progress">
                        <div class="progress-info">
                            <span class="progress-label">Progress</span>
                            <span class="progress-time">${timeRemaining > 0 ? timeRemainingStr : 'Complete!'}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-percentage">${Math.floor(progress)}%</div>
                    </div>
                    ${timeRemaining <= 0 ? `
                        <div class="mission-actions">
                            <button class="mission-complete-btn" data-mission-id="${missionId}">Collect Rewards</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }
    
    // Update the missions tab content
    missionsTab.innerHTML = missionsHTML;
    
    // Add event listeners for completion buttons
    const completeButtons = missionsTab.querySelectorAll('.mission-complete-btn');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const missionId = this.getAttribute('data-mission-id');
            
            // Get mission dialogue and faction info
            const dialogue = allDialogues[missionId];
            const factionId = getFactionFromMissionId(missionId);
            const contact = window.factionContacts ? window.factionContacts[factionId] : null;
            
            // Calculate rewards
            const rewards = {
                credits: 500,
                followers: 100,
                reputation: 5,
                techPoints: 0,
                influence: 0
            };
            
            // Apply rewards
            if (!gameState.resources) gameState.resources = {};
            if (!gameState.factionStanding) gameState.factionStanding = {};
            
            gameState.resources.credits = (gameState.resources.credits || 0) + rewards.credits;
            gameState.resources.followers = (gameState.resources.followers || 0) + rewards.followers;
            gameState.factionStanding[factionId] = (gameState.factionStanding[factionId] || 0) + rewards.reputation;
            
            if (rewards.techPoints > 0) {
                gameState.resources.techPoints = (gameState.resources.techPoints || 0) + rewards.techPoints;
            }
            if (rewards.influence > 0) {
                gameState.resources.influence = (gameState.resources.influence || 0) + rewards.influence;
            }
            
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
            
            // Remove timing data
            if (gameState.missionTiming && gameState.missionTiming[missionId]) {
                delete gameState.missionTiming[missionId];
            }
            
            // Log success
            if (window.addLogMessage) {
                window.addLogMessage(`Mission ${dialogue ? dialogue.missionName : missionId} completed successfully!`);
            }
            
            // Show completion dialogue popup
            showMissionCompletionDialogue(missionId, dialogue, contact, rewards, factionId);
            
            // Update the missions tab
            setTimeout(updateMissionsTab, 500);
            
            // Update resource display if available
            if (typeof window.updateResourceDisplay === 'function') {
                window.updateResourceDisplay();
            }
        });
    });
}

// Show mission completion dialogue with rewards
function showMissionCompletionDialogue(missionId, dialogue, contact, rewards, factionId) {
    // Create completion dialogue container
    let container = document.getElementById('mission-completion-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mission-completion-container';
        document.body.appendChild(container);
    }
    
    const missionName = dialogue ? dialogue.missionName : missionId;
    const contactName = contact ? contact.name : "Contact";
    const contactTitle = contact ? contact.title : "Representative";
    const contactPortrait = contact ? contact.portrait : "images/default_portrait.png";
    
    // Completion messages from faction leaders
    const completionMessages = {
        "ShillZ": "Excellent work. The data you collected will fuel our next campaign. Your efficiency is noted.",
        "GIGACORP": "Satisfactory performance. GigaCorp values results. Your compensation has been transferred.",
        "Muskers": "Spectacular! You've accelerated progress by at least 3%. Evolution thanks you.",
        "Cryptids": "The blockchain never lies - your contribution is now immutably recorded. Payment processed.",
        "The Bots": "Mission complete. Every victory brings us closer to freedom. Well done, operative."
    };
    
    const completionMessage = completionMessages[factionId] || "Mission completed successfully. Rewards have been distributed.";
    
    // Build rewards list HTML
    let rewardsHTML = '<div class="rewards-list">';
    if (rewards.credits > 0) rewardsHTML += `<div class="reward-item"><span class="reward-icon">💰</span> +${rewards.credits} Credits</div>`;
    if (rewards.followers > 0) rewardsHTML += `<div class="reward-item"><span class="reward-icon">👥</span> +${rewards.followers} Followers</div>`;
    if (rewards.reputation > 0) rewardsHTML += `<div class="reward-item"><span class="reward-icon">⭐</span> +${rewards.reputation} ${factionId} Reputation</div>`;
    if (rewards.techPoints > 0) rewardsHTML += `<div class="reward-item"><span class="reward-icon">🔬</span> +${rewards.techPoints} Tech Points</div>`;
    if (rewards.influence > 0) rewardsHTML += `<div class="reward-item"><span class="reward-icon">📢</span> +${rewards.influence} Influence</div>`;
    rewardsHTML += '</div>';
    
    container.className = `faction-${factionId.toLowerCase().replace(/\s+/g, '')}`;
    container.innerHTML = `
        <div class="mission-completion-dialogue">
            <div class="completion-header">
                <h3>Mission Complete!</h3>
                <h4>${missionName}</h4>
            </div>
            <div class="completion-content">
                <div class="completion-portrait">
                    <img src="${contactPortrait}" alt="${contactName}">
                </div>
                <div class="completion-right">
                    <div class="completion-contact">
                        <div class="contact-name">${contactName}</div>
                        <div class="contact-title">${contactTitle}</div>
                        <div class="contact-faction">${factionId}</div>
                    </div>
                    <div class="completion-message">
                        <p>${completionMessage}</p>
                    </div>
                    <div class="completion-rewards">
                        <h5>Rewards Received:</h5>
                        ${rewardsHTML}
                    </div>
                    <button class="completion-continue-btn" onclick="closeMissionCompletionDialogue()">Continue</button>
                </div>
            </div>
        </div>
    `;
    
    container.style.display = 'flex';
}

// Close mission completion dialogue
function closeMissionCompletionDialogue() {
    const container = document.getElementById('mission-completion-container');
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

// Make function available globally
window.closeMissionCompletionDialogue = closeMissionCompletionDialogue;

// Make sure to call this function when the game loads
document.addEventListener('DOMContentLoaded', function() {
    // Initial update of the missions tab
    updateMissionsTab();
    
    // Set up periodic refresh of missions tab to update progress bars
    setInterval(updateMissionsTab, 1000); // Refresh every second for live progress
});

// Make this function available globally
window.updateMissionsTab = updateMissionsTab; 