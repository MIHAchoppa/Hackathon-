/**
 * Agent UI Controller
 * Manages the agent dashboard and real-time status updates
 */

class AgentDashboardController {
    constructor() {
        this.dashboard = document.getElementById('agent-dashboard');
        this.phaseElement = document.getElementById('agent-phase');
        this.iterationElement = document.getElementById('agent-iteration');
        this.confidenceElement = document.getElementById('agent-confidence');
        this.memoryElement = document.getElementById('agent-memory');
        this.reasoningChainContainer = document.getElementById('agent-reasoning-chain');
        this.reasoningStepsContainer = document.getElementById('reasoning-steps');
        
        this.agent = null;
        this.updateInterval = null;
    }
    
    /**
     * Initialize dashboard with agent instance
     * @param {Object} agent - Autonomous agent instance
     */
    initialize(agent) {
        this.agent = agent;
        this.show();
        this.startMonitoring();
    }
    
    /**
     * Show dashboard
     */
    show() {
        if (this.dashboard) {
            this.dashboard.style.display = 'block';
        }
    }
    
    /**
     * Hide dashboard
     */
    hide() {
        if (this.dashboard) {
            this.dashboard.style.display = 'none';
        }
    }
    
    /**
     * Start monitoring agent status
     */
    startMonitoring() {
        // Update immediately
        this.updateStatus();
        
        // Update every second
        this.updateInterval = setInterval(() => {
            this.updateStatus();
        }, 1000);
    }
    
    /**
     * Stop monitoring
     */
    stopMonitoring() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    /**
     * Update dashboard with current agent status
     */
    updateStatus() {
        if (!this.agent) return;
        
        const status = this.agent.getStatus();
        
        // Update phase
        if (this.phaseElement) {
            this.phaseElement.textContent = this.formatPhase(status.phase);
            this.phaseElement.style.color = this.getPhaseColor(status.phase);
        }
        
        // Update iteration
        if (this.iterationElement) {
            this.iterationElement.textContent = status.iteration;
        }
        
        // Update confidence
        if (this.confidenceElement) {
            const confidence = status.confidence || 0;
            this.confidenceElement.textContent = `${Math.round(confidence)}%`;
            this.confidenceElement.style.color = this.getConfidenceColor(confidence);
        }
        
        // Update memory
        if (this.memoryElement) {
            this.memoryElement.textContent = status.memory;
        }
        
        // Update reasoning chain if active
        if (status.running && status.reasonings > 0) {
            this.updateReasoningChain();
        }
    }
    
    /**
     * Format phase name for display
     * @param {string} phase - Phase name
     * @returns {string} Formatted phase
     */
    formatPhase(phase) {
        const phaseMap = {
            'idle': 'Idle 💤',
            'starting': 'Starting 🚀',
            'observing': 'Observing 👁️',
            'reasoning': 'Reasoning 🧠',
            'acting': 'Acting ⚡',
            'learning': 'Learning 📚'
        };
        return phaseMap[phase] || phase;
    }
    
    /**
     * Get color for phase
     * @param {string} phase - Phase name
     * @returns {string} Color
     */
    getPhaseColor(phase) {
        const colorMap = {
            'idle': '#94a3b8',
            'starting': '#3b82f6',
            'observing': '#8b5cf6',
            'reasoning': '#ec4899',
            'acting': '#f59e0b',
            'learning': '#10b981'
        };
        return colorMap[phase] || '#ffffff';
    }
    
    /**
     * Get color for confidence level
     * @param {number} confidence - Confidence score
     * @returns {string} Color
     */
    getConfidenceColor(confidence) {
        if (confidence >= 90) return '#10b981'; // Green
        if (confidence >= 70) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    }
    
    /**
     * Update reasoning chain display
     */
    updateReasoningChain() {
        if (!this.agent || !this.reasoningChainContainer || !this.reasoningStepsContainer) return;
        
        const report = this.agent.getReport();
        const reasoningChain = report.reasoningChain;
        
        if (reasoningChain.length === 0) return;
        
        // Show reasoning chain
        this.reasoningChainContainer.style.display = 'block';
        
        // Clear previous steps
        this.reasoningStepsContainer.innerHTML = '';
        
        // Display last 5 reasoning steps
        const recentSteps = reasoningChain.slice(-5);
        
        recentSteps.forEach((step, index) => {
            const stepElement = this.createReasoningStepElement(step, index + 1);
            this.reasoningStepsContainer.appendChild(stepElement);
        });
    }
    
    /**
     * Create reasoning step element
     * @param {Object} step - Reasoning step
     * @param {number} stepNumber - Step number
     * @returns {HTMLElement} Step element
     */
    createReasoningStepElement(step, stepNumber) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'reasoning-step';
        
        const header = document.createElement('div');
        header.className = 'reasoning-step-header';
        
        const title = document.createElement('div');
        title.className = 'reasoning-step-title';
        title.textContent = `Step ${stepNumber}`;
        
        const confidence = document.createElement('div');
        confidence.className = 'reasoning-step-confidence';
        confidence.textContent = `${step.confidence}%`;
        confidence.style.backgroundColor = this.getConfidenceColor(step.confidence);
        
        header.appendChild(title);
        header.appendChild(confidence);
        
        const content = document.createElement('div');
        content.className = 'reasoning-step-content';
        
        // Add observations count
        const obsText = document.createElement('p');
        obsText.textContent = `📊 Observations: ${step.observations.length}`;
        content.appendChild(obsText);
        
        // Add conclusions
        if (step.conclusions && step.conclusions.length > 0) {
            const conclusionsDiv = document.createElement('div');
            conclusionsDiv.className = 'reasoning-conclusions';
            
            const conclusionsTitle = document.createElement('strong');
            conclusionsTitle.textContent = 'Conclusions:';
            conclusionsDiv.appendChild(conclusionsTitle);
            
            step.conclusions.forEach(conclusion => {
                const conclusionP = document.createElement('p');
                conclusionP.className = 'reasoning-conclusion';
                conclusionP.textContent = `• ${conclusion.conclusion} (${conclusion.confidence}%)`;
                conclusionsDiv.appendChild(conclusionP);
            });
            
            content.appendChild(conclusionsDiv);
        }
        
        stepDiv.appendChild(header);
        stepDiv.appendChild(content);
        
        return stepDiv;
    }
    
    /**
     * Show agent execution result
     * @param {Object} result - Execution result
     */
    showExecutionResult(result) {
        if (!result) return;
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'agent-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">
                ${result.success ? '✅' : '❌'} Agent Execution ${result.success ? 'Complete' : 'Failed'}
            </div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
                Iterations: ${result.iterations.length}<br>
                Confidence: ${Math.round(result.overallConfidence)}%
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    /**
     * Get formatted agent report
     * @returns {string} Formatted report
     */
    getFormattedReport() {
        if (!this.agent) return 'No agent initialized';
        
        const report = this.agent.getReport();
        
        return `
=================================
AUTONOMOUS AGENT REPORT
=================================

STATUS:
- Phase: ${report.status.phase}
- Iteration: ${report.status.iteration}
- Running: ${report.status.running}
- Confidence: ${report.status.confidence}%
- Memory Items: ${report.status.memory}

METRICS:
- Observations: ${report.status.observations}
- Reasonings: ${report.status.reasonings}
- Actions: ${report.status.actions}
- Learnings: ${report.status.learnings}

REASONING CHAIN:
${report.reasoningChain.map((step, i) => `
  Step ${i + 1}:
  - Observations: ${step.observations.length}
  - Confidence: ${step.confidence}%
  - Conclusions: ${step.conclusions.length}
`).join('')}

ACTION LOG:
${report.actionLog.map((action, i) => `
  Action ${i + 1}:
  - Type: ${action.action}
  - Success: ${action.success}
  - Confidence: ${action.confidence}%
`).join('')}

LEARNING HISTORY:
${report.learningHistory.map((learning, i) => `
  Learning ${i + 1}:
  - Action: ${learning.action}
  - Success: ${learning.actualSuccess}
  - Insights: ${learning.insights.length}
`).join('')}

PATTERNS LEARNED:
${Object.entries(report.patterns).map(([key, pattern]) => `
  ${key}: ${pattern.count} occurrences, avg confidence: ${Math.round(pattern.avgConfidence)}%
`).join('')}

=================================
        `.trim();
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentDashboardController };
}
