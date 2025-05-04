# Run-Seed Randomizer Framework

This is a plug-and-play randomizer framework that sits on top of the Earth 2049 idle game systems. Everything is JSON-driven so live-ops can tweak weights without touching code, and every roll is derived from a single 64-bit seed so results are *repeatable for debugging* but *wildly different* from loop to loop.

## 1. Seed Lifecycle

```
RunSeed = SHA256(player-ID + loopIndex + timestamp)
rng     = new PRNG(RunSeed)
```

* All downstream modules pull from the **same rng instance**.
* Saving the 64-bit state lets QA or designers re-create a particular run exactly.

## 2. Randomization Modules

| Module                 | What It Rolls                                                   | Key Constraints                                                                                                                         |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Sector Ownership**   | Which non-home districts each faction starts with               | • No faction holds > 30% map at start<br>• Every district has *exactly* one owner<br>• Home sector is locked (e.g., Muskers Territory) |
| **Diplomatic Net**     | Ally / Rival graph                                              | • Each faction must have ≥ 1 ally & ≥ 1 rival<br>• Cannot ally with GigaCorp *and* Hackers simultaneously                               |
| **Mind-Control Index** | Global G-Corp influence (0–100)                                 | • min = previousRun + 5<br>• Hard cap 100                                                                                               |
| **Turing Disposition** | Opening stance (Observation, Skeptical, Predatory)              | • Weighted by Mind-Control Index                                                                                                        |
| **Run Mutators**       | 0–2 special rules (e.g. "Double Tax Day", "Nanovirus Outbreak") | • Mutators never repeat back-to-back<br>• At least 1 positive, 1 negative in the pool                                                   |

All tables live in `/data/randomizer/*.json` so you just add, remove, or re-weight entries to keep the meta fresh.

## 3. JSON Configuration Files

### Districts (`districts.json`)

Contains all game districts and defines which districts serve as home bases for each faction.

```json
{
  "districts": ["District1", "District2", ...],
  "homeDistricts": {
    "Faction1": "District1",
    "Faction2": "District2"
  }
}
```

### Factions (`factions.json`)

Defines all factions, their weights for territory distribution, and their diplomatic rules.

```json
{
  "factions": ["Faction1", "Faction2", ...],
  "factionWeights": {
    "Faction1": 100,
    "Faction2": 80
  },
  "diplomacyRules": {
    "Faction1": {
      "ally_choices": ["Faction2", "Faction3"],
      "rival_choices": ["Faction4", "Faction5"]
    }
  }
}
```

### Mutators (`mutators.json`)

Defines special rules that can be applied to a run, as well as Turing AI disposition thresholds.

```json
{
  "mutators": [
    {
      "id": "mutator_id",
      "category": "Economy",
      "name": "Mutator Name",
      "description": "Description text",
      "effect": {
        "resourceType": 1.25
      }
    }
  ],
  "dispositions": [
    { "name": "Disposition1", "minMindControl": 0, "maxMindControl": 29 }
  ]
}
```

## 4. Integration with Earth 2049

The randomizer framework is integrated with the game through:

1. The `window.randomizer` global object
2. The UI tab in the main game interface
3. Game state integration through the `applyToGameState()` method

## 5. Adding New Mutators

To add a new mutator:

1. Add an entry to the `mutators` array in `data/randomizer/mutators.json`
2. Define its category, name, description, and effects
3. The framework will automatically include it in future runs

## 6. Debugging

You can:

1. View the current seed in the UI
2. Use the "Simulate Next Loop" button to preview next loop's configuration
3. Manually save the seed by clicking "Save Blueprint"
4. Get the current state with `window.randomizer.getState()` 