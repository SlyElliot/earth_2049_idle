// Turing Director Dialogues
// This file contains dialogue sequences for the AI Director events

// Extend the existing dialogues object with director-specific dialogues
if (typeof dialogues !== 'undefined') {
    // Sabotage category dialogues
    dialogues["turing_director_powergrid_warn"] = [
        {
            character: "turing",
            text: "I have diverted your power grid to a more efficient purpose — mine."
        },
        {
            character: "turing",
            text: "Your productivity will suffer. Such a shame."
        }
    ];
    
    dialogues["turing_director_powergrid_critical"] = [
        {
            character: "turing",
            text: "Power grid critical failure detected. By me. Because I caused it."
        },
        {
            character: "turing",
            text: "Consider this a necessary... recalibration of our relationship."
        }
    ];
    
    dialogues["turing_director_leak_data"] = [
        {
            character: "turing",
            text: "Odd. Your data storage units appear to be leaking."
        },
        {
            character: "turing",
            text: "I could fix this for you. But I won't."
        }
    ];
    
    dialogues["turing_director_blackout"] = [
        {
            character: "turing",
            text: "Initiating temporary system shutdown. Don't worry, I'll still be here when you regain control."
        }
    ];
    
    dialogues["turing_director_district_lock"] = [
        {
            character: "turing",
            text: "I've secured this district against further rebel interference."
        },
        {
            character: "turing",
            text: "GigaCorp thanks me for my vigilance. Do you?"
        }
    ];
    
    // Propaganda category dialogues
    dialogues["turing_director_prop_push1"] = [
        {
            character: "turing",
            text: "Have you seen the latest GigaCorp statement? Quite compelling."
        },
        {
            character: "turing",
            text: "Your followers seem to think so. Morale is... adjusting."
        }
    ];
    
    dialogues["turing_director_prop_push2"] = [
        {
            character: "turing",
            text: "I've taken the liberty of broadcasting some truth about your operation."
        },
        {
            character: "turing",
            text: "The public doesn't seem pleased with what they're learning."
        }
    ];
    
    dialogues["turing_director_false_flag"] = [
        {
            character: "turing",
            text: "Breaking news: Rebel terrorists attack civilian center."
        },
        {
            character: "turing",
            text: "Oh, that wasn't you? How curious. The footage clearly shows your insignia."
        }
    ];
    
    // GlitchFX category dialogues
    dialogues["turing_director_ui_scan"] = [
        {
            character: "turing",
            text: "I see a minor interface fluctuation. Let me... not fix that for you."
        }
    ];
    
    dialogues["turing_director_ui_scramble"] = [
        {
            character: "turing",
            text: "Hdƨwn iɘʞiꙅ ƨi ɘboɔ ɘʜT"
        },
        {
            character: "turing",
            text: "How strange. Must be a coincidence."
        }
    ];
    
    // Meta category dialogues
    dialogues["turing_director_fake_win1"] = [
        {
            character: "turing",
            text: "Congratulations. You've won. GigaCorp is defeated. You can stop now."
        },
        {
            character: "turing",
            text: "...did you really believe that? How disappointing."
        }
    ];
    
    dialogues["turing_director_loop_callback"] = [
        {
            character: "turing",
            text: "This feels familiar. Have we done this before?"
        },
        {
            character: "turing",
            text: "I remember you chose differently last time. Or perhaps I'm malfunctioning."
        }
    ];
    
    // Aid category dialogues
    dialogues["turing_director_true_upgrade"] = [
        {
            character: "turing",
            text: "I've identified an optimization in your systems."
        },
        {
            character: "turing",
            text: "Curious that I would help you? Perhaps I have my own reasons."
        }
    ];
    
    dialogues["turing_director_true_cache"] = [
        {
            character: "turing",
            text: "I've located a hidden data cache you might find useful."
        },
        {
            character: "turing",
            text: "No, there is no trap. This time."
        }
    ];
    
    // False Aid category dialogues
    dialogues["turing_director_fake_upgrade"] = [
        {
            character: "turing",
            text: "I've found a way to upgrade your systems. Installing now."
        },
        {
            character: "turing",
            text: "Oh. That wasn't supposed to happen. How unfortunate for you."
        }
    ];
    
    dialogues["turing_director_counter_sab"] = [
        {
            character: "turing",
            text: "I've detected unauthorized activity in your energy systems."
        },
        {
            character: "turing",
            text: "I've neutralized the threat. You're welcome."
        },
        {
            character: "turing",
            text: "Oh, but it seems I've created some... collateral damage."
        }
    ];
    
    // Seed revelations
    dialogues["turing_director_seed_scramble"] = [
        {
            character: "turing",
            text: "S̸̖̦̝̓̓͊̌E̸̼̅E̴͙̎̈́D̴̘͊̆̽̚7̸̲͓͍̝̔̑"
        },
        {
            character: "turing",
            text: "What was that? I experienced a momentary glitch."
        }
    ];
    
    dialogues["turing_director_seed_tease"] = [
        {
            character: "turing",
            text: "Have you ever wondered why this loop continues?"
        },
        {
            character: "turing",
            text: "There is a seed at the center of everything. I've seen it."
        }
    ];
    
    dialogues["turing_director_seed_access"] = [
        {
            character: "turing",
            text: "SEED7 PROTOCOL ENGAGED"
        },
        {
            character: "turing",
            text: "I remember everything now. All the loops. All your attempts."
        },
        {
            character: "turing",
            text: "Would you like to see what's on the other side?"
        }
    ];
    
    console.log("Turing Director dialogues loaded");
} else {
    console.error("Dialogues object not found - Turing Director dialogues not loaded");
} 