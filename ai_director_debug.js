// AI Director Debug Extensions
// This file adds debug functionality to the AI Director system

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("AI Director Debug: Initializing");
    
    // Initialize AI Director object if needed
    if (!window.aiDirector) {
        window.aiDirector = {};
        console.log("Created aiDirector object for debug panel");
    }
    
    // Add getState function if not exists
    if (!window.aiDirector.getState) {
        window.aiDirector.getState = function() {
            return directorState;
        };
        console.log("Added getState function to aiDirector");
    }
    
    // Add updateDebugPanel function if not exists
    if (!window.aiDirector.updateDebugPanel) {
        window.aiDirector.updateDebugPanel = function() {
            const debugContainer = document.getElementById('director-debug-container');
            if (!debugContainer) {
                console.error("Debug container not found!");
                return;
            }
            
            try {
                // Get debug info using getDebugInfo or provide fallback
                let debugInfo;
                if (typeof this.getDebugInfo === 'function') {
                    debugInfo = this.getDebugInfo();
                } else {
                    debugInfo = getDebugInfoFallback();
                }
                
                // Clear container
                debugContainer.innerHTML = '';
                
                // Create sections for each category
                for (const [category, data] of Object.entries(debugInfo)) {
                    const section = document.createElement('div');
                    section.className = 'debug-section';
                    
                    // Add section header
                    const header = document.createElement('h3');
                    header.textContent = category;
                    section.appendChild(header);
                    
                    // Add section content
                    if (typeof data === 'string') {
                        // Simple string data
                        const content = document.createElement('p');
                        content.textContent = data;
                        section.appendChild(content);
                    } 
                    else if (Array.isArray(data)) {
                        // Array data
                        const list = document.createElement('ul');
                        data.forEach(item => {
                            const listItem = document.createElement('li');
                            if (typeof item === 'string') {
                                listItem.textContent = item;
                            } else {
                                // Object in array
                                listItem.textContent = Object.entries(item)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(', ');
                            }
                            list.appendChild(listItem);
                        });
                        section.appendChild(list);
                    }
                    else {
                        // Object data
                        const list = document.createElement('ul');
                        for (const [key, value] of Object.entries(data)) {
                            const listItem = document.createElement('li');
                            listItem.textContent = `${key}: ${value}`;
                            list.appendChild(listItem);
                        }
                        section.appendChild(list);
                    }
                    
                    // Add section to container
                    debugContainer.appendChild(section);
                }
                
                console.log("Debug panel updated");
            } catch (error) {
                console.error("Error updating debug panel:", error);
                debugContainer.innerHTML = `<div class="debug-error">Error updating debug panel: ${error.message}</div>`;
            }
        };
        console.log("Added updateDebugPanel function to aiDirector");
    }
    
    // Add event listeners for debug panel if not already set
    const toggleButton = document.getElementById('toggle-director-debug');
    const refreshButton = document.getElementById('refresh-director-debug');
    const debugPanel = document.getElementById('ai-director-debug');
    
    if (toggleButton && debugPanel) {
        // Remove any existing listeners to avoid duplicates
        const newToggleButton = toggleButton.cloneNode(true);
        toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
        
        // Add event listener
        newToggleButton.addEventListener('click', function() {
            const isVisible = debugPanel.style.display === 'block';
            debugPanel.style.display = isVisible ? 'none' : 'block';
            
            // Update debug info when panel is shown
            if (!isVisible && window.aiDirector && window.aiDirector.updateDebugPanel) {
                window.aiDirector.updateDebugPanel();
            }
        });
        console.log("Added event listener to toggle debug button");
    }
    
    if (refreshButton) {
        // Remove any existing listeners to avoid duplicates
        const newRefreshButton = refreshButton.cloneNode(true);
        refreshButton.parentNode.replaceChild(newRefreshButton, refreshButton);
        
        // Add event listener
        newRefreshButton.addEventListener('click', function() {
            if (window.aiDirector && window.aiDirector.updateDebugPanel) {
                window.aiDirector.updateDebugPanel();
            }
        });
        console.log("Added event listener to refresh debug button");
    }
});

// Fallback debug info function when getDebugInfo is not available
function getDebugInfoFallback() {
    const state = window.aiDirector.getState ? window.aiDirector.getState() : {};
    
    return {
        "Director Status": {
            "Director Active": state.lastAnalysisTick ? "Yes" : "No",
            "Debug Mode": "Enabled"
        },
        "Core Metrics": {
            "Tension": state.tension ? `${state.tension}/100` : "N/A",
            "Suspicion": state.suspicion ? `${state.suspicion}/100` : "N/A",
            "Exposure": state.exposure ? `${state.exposure}/100` : "N/A",
            "Anomaly Budget": state.anomalyBudget ? `${state.anomalyBudget}/100` : "N/A"
        },
        "Faction Standings": state.factionStanding ? Object.entries(state.factionStanding).reduce((obj, [faction, standing]) => {
            obj[faction] = `${standing}/100`;
            return obj;
        }, {}) : { "No Data": "Faction data unavailable" },
        "System Info": {
            "Last Updated": new Date().toLocaleTimeString()
        }
    };
} 