# Earth 2049 Idle Game

A cyberpunk idle game set in the year 2049.

## Setup and Running the Game

### Prerequisites
- [Node.js](https://nodejs.org/) (includes npm)

### Method 1: Using the Batch File (Recommended for Windows)

1. Double-click the `run-game.bat` file
2. The script will install all dependencies and start the game server
3. A browser window will open with the game (or navigate to http://localhost:3000)

### Method 2: Using Command Line

If you're on a network path (UNC path starting with \\), you'll need to map the network drive first:

1. Open Command Prompt as administrator
2. Map a network drive to your UNC path:
   ```
   net use Z: \\LogicalCloud\Public\Sly_Elliot\Earth2039\Earth2049Game\earth_2049_idle_Actual_Game
   ```
   (Replace Z: with any available drive letter)

3. Navigate to the mapped drive:
   ```
   Z:
   ```

4. Install dependencies and start the server:
   ```
   npm install
   npm start
   ```

5. Open your web browser and go to http://localhost:3000

### Troubleshooting

If you encounter errors with UNC paths:
- Try mapping a network drive as described in Method 2
- Run the batch file instead of using npm commands directly
- Make sure you have write permissions to the directory

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