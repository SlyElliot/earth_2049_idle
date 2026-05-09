# Earth 2049 Idle Game

A cyberpunk idle game set in the year 2049.

The repo root is now the canonical app root. Run the game from `C:\earth_2049_idle_Actual_Game`.

## Setup and Running the Game

### Prerequisites
- [Node.js](https://nodejs.org/) (includes npm)

### Method 1: Using Command Line

1. Open a terminal in the repo root:
   ```
   C:\earth_2049_idle_Actual_Game
   ```
2. Install dependencies if needed:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your web browser and go to `http://localhost:3000`

### Method 2: If You Are Launching From a UNC Path

If you're on a network path (UNC path starting with `\\`), map the network drive first:

1. Open Command Prompt as administrator
2. Map a network drive to your UNC path:
   ```
   net use Z: \\LogicalCloud\Public\Sly_Elliot\Earth2039\Earth2049Game\earth_2049_idle_Actual_Game
   ```
   Replace `Z:` with any available drive letter.
3. Navigate to the mapped drive and run:
   ```
   Z:
   npm install
   npm start
   ```

### Troubleshooting

- If you encounter UNC path errors, use a mapped drive as described above.
- Make sure you have write permissions to the directory.
- If dependencies were previously tracked in Git, re-run `npm install` after checking out the cleaned repo.

## Game Features

- Resource management
- Automated production boosts
- Research tech tree
- Territory control
- Missions system
- And more!

## Development

- `npm start` - Start the game server
- `npm run dev` - Start the server with auto-reload (using nodemon)
