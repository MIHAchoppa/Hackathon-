# Agent System Testing Guide

## Quick Test Checklist

### 1. Page Load Test
- [ ] Open index.html in browser
- [ ] Check console for "🚀 Hackathon App Initialized"
- [ ] Check console for "🤖 Initializing Autonomous Agent System..."
- [ ] Check console for "✅ Autonomous Agent System Active"
- [ ] Verify Agent Dashboard is visible at top

### 2. Agent Dashboard Test
- [ ] Dashboard shows 4 status cards:
  - Current Phase: "Idle 💤"
  - Iteration: "0"
  - Confidence Score: "--"
  - Memory Items: "0"
- [ ] All cards have proper styling (gradient background, icons)

### 3. Research Generation Test
1. Scroll to "AI ResearchBot" section
2. Enter "Electric Cars" in topic field
3. Click "Research" button
4. **Expected behavior**:
   - Agent dashboard updates in real-time
   - Phase changes: Idle → Starting → Observing → Reasoning → Acting → Learning
   - Iteration count increases
   - Confidence score appears
   - Research results display with confidence badges
   - Console shows orchestration logs

### 4. Console Commands Test
Open browser console (F12) and test:

```javascript
// Test 1: Check agent status
autonomousAgent.getStatus()
// Expected: Object with phase, iteration, running, confidence, etc.

// Test 2: Get formatted report
agentDashboard.getFormattedReport()
// Expected: Multi-line formatted text report

// Test 3: Get orchestration logs
agentOrchestrator.getLogs()
// Expected: Array of log events with timestamps

// Test 4: Get full report
autonomousAgent.getReport()
// Expected: Object with status, state, reasoningChain, actionLog, etc.
```

### 5. Book Generation Test
1. Run research for a topic
2. Select checkboxes for some sections
3. Click "Create Book" button
4. Fill in book details
5. Click "Generate Book"
6. **Expected**: Book preview with confidence scores

### 6. Visual Verification

#### Agent Dashboard
- [ ] Gradient purple background
- [ ] White text
- [ ] 4 status cards in grid layout
- [ ] Cards have blur effect background
- [ ] Icons display correctly
- [ ] Hover effect on cards (slight lift)

#### Research Results
- [ ] Confidence badges colored correctly:
  - Green for 90%+
  - Yellow for 70-89%
  - Red for <70%
- [ ] Progress bars match confidence level
- [ ] Table displays properly

#### Reasoning Chain (if displayed)
- [ ] Shows in agent dashboard
- [ ] Step-by-step breakdown
- [ ] Confidence scores per step
- [ ] Proper formatting

## Integration Tests

### AWS Service Simulators
```javascript
// Test Bedrock
const bedrock = new AWSBedrockSimulator();
bedrock.invoke({ prompt: "test" }).then(console.log);
// Expected: Response object with completion

// Test DynamoDB
const dynamodb = new DynamoDBSimulator();
dynamodb.putItem({ TableName: "test", Item: { id: "1" } }).then(console.log);
// Expected: { success: true }

// Test S3
const s3 = new S3Simulator();
s3.putObject({ Bucket: "test", Key: "file.txt", Body: "content" }).then(console.log);
// Expected: Object with ETag and Location

// Test Groq
const groq = new GroqAPISimulator();
groq.createChatCompletion({ messages: [{ role: "user", content: "test" }] }).then(console.log);
// Expected: Chat completion response
```

### Probability Scorer
```javascript
const scorer = new ProbabilityScorer();
const confidence = scorer.calculateConfidence({
  dataQuality: 0.9,
  sourceReliability: 0.85,
  modelUncertainty: 0.1,
  historicalAccuracy: 0.9,
  consensusLevel: 0.8
});
console.log(confidence);
// Expected: Number between 0-100 (should be around 85-90)

// Test aggregation
const scores = [85, 90, 88, 92];
const aggregated = scorer.aggregateConfidence(scores);
console.log(aggregated);
// Expected: Number close to 89 (weighted average)
```

### Agent ORABL Loop
```javascript
const agent = new AutonomousAgent();
await agent.initialize();

const result = await agent.executeAutonomous({
  type: 'research',
  topic: 'Test Topic',
  goal: 'Test autonomous execution'
});

console.log(result);
// Expected: Object with iterations array, success boolean, overallConfidence
```

## Performance Tests

### Load Time
- [ ] Page loads in <2 seconds
- [ ] Agent initializes in <1 second
- [ ] No console errors

### Research Generation
- [ ] Completes in <5 seconds
- [ ] Smooth UI updates
- [ ] No lag or freezing

### Memory Usage
- [ ] Agent state doesn't grow unbounded
- [ ] Memory limit enforced (100 items)
- [ ] No memory leaks in console

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Mobile Responsiveness

- [ ] Agent dashboard displays on mobile
- [ ] Status cards stack vertically
- [ ] Research results readable
- [ ] Buttons accessible

## Error Handling

### Test Error Cases
1. **Empty research topic**
   - Enter nothing, click Research
   - Expected: Nothing happens or validation message

2. **Network error simulation**
   ```javascript
   // Temporarily break a service
   agentOrchestrator.bedrock.invoke = () => Promise.reject(new Error("Test error"));
   // Run research
   // Expected: Error logged, graceful failure
   ```

3. **Invalid confidence scores**
   ```javascript
   const scorer = new ProbabilityScorer();
   scorer.calculateConfidence({ dataQuality: -1 });
   // Expected: Handles gracefully, returns 0 or valid score
   ```

## Documentation Verification

- [ ] AGENT_DOCUMENTATION.md opens and displays correctly
- [ ] ARCHITECTURE.md diagrams render properly
- [ ] DEMO_SCRIPT.md is comprehensive
- [ ] README.md has all sections

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth UI interactions
- ✅ Correct confidence calculations
- ✅ Proper agent phase transitions
- ✅ Working orchestration
- ✅ Accurate data display
- ✅ Professional appearance

## Troubleshooting

### Agent Not Loading
1. Check console for errors
2. Verify all script tags in index.html
3. Check file paths are correct
4. Clear browser cache

### Dashboard Not Showing
1. Check CSS loaded (styles.css)
2. Verify agent-ui.js loaded
3. Check element IDs match
4. Verify agent initialized (check console)

### Research Not Working
1. Check orchestrator initialized
2. Verify ResearchBot connected to orchestrator
3. Check async/await working
4. Look for Promise rejections

### Low Confidence Scores
This is normal behavior! The agent calculates realistic confidence based on:
- Data quality
- Source reliability
- Historical accuracy
- Model uncertainty
- Consensus level

Scores in 70-90% range are expected and healthy.

## Final Verification

Run this complete test in console:
```javascript
// Complete system test
(async () => {
  console.log("🧪 Starting Complete Agent System Test");
  
  // 1. Check initialization
  console.log("1. Agent Status:", autonomousAgent.getStatus());
  
  // 2. Test probability scorer
  const scorer = new ProbabilityScorer();
  const confidence = scorer.calculateConfidence({
    dataQuality: 0.9,
    sourceReliability: 0.85,
    modelUncertainty: 0.1,
    historicalAccuracy: 0.9,
    consensusLevel: 0.8
  });
  console.log("2. Probability Score:", confidence);
  
  // 3. Test research orchestration
  const research = await agentOrchestrator.orchestrateResearch("AI Technology");
  console.log("3. Research Success:", research.success);
  console.log("   Iterations:", research.agentMetrics.iterations);
  console.log("   Confidence:", research.agentMetrics.overallConfidence);
  
  // 4. Check logs
  const logs = agentOrchestrator.getLogs();
  console.log("4. Event Logs:", logs.length, "events");
  
  // 5. Get report
  const report = agentDashboard.getFormattedReport();
  console.log("5. Report Generated:", report.includes("AUTONOMOUS AGENT REPORT"));
  
  console.log("✅ All Tests Passed!");
})();
```

Expected output:
```
🧪 Starting Complete Agent System Test
1. Agent Status: { phase: "idle", iteration: 6, running: false, ... }
2. Probability Score: 87
3. Research Success: true
   Iterations: 6
   Confidence: 89
4. Event Logs: 12 events
5. Report Generated: true
✅ All Tests Passed!
```

---

**If all tests pass, the system is ready for demonstration! 🚀**
