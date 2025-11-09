require('dotenv').config();
const {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicFeeCreateTransaction,
  Hbar,
  AccountId,
  PrivateKey,
  CustomFee,
  FixedFee
} = require('@hashgraph/sdk');

class AIAgentReputationLedger {
  constructor() {
    this.client = Client.forTestnet();
    this.setupOperator();
    this.topicId = null;
    this.reputationScores = new Map();
    this.taskLedger = [];
  }

  setupOperator() {
    const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
    this.client.setOperator(operatorId, operatorKey);
    console.log(`👤 Operator set: ${operatorId.toString()}`);
  }

  async createMonetizedTopic() {
    console.log('🚀 Creating monetized HCS topic with HIP-991 fee...');
    
    try {
      // Create a custom fixed fee of 0.01 HBAR per message
      const fixedFee = new FixedFee()
        .setAmount(1000000) // 0.01 HBAR in tinybars
        .setFeeCollectorAccountId(this.client.operatorAccountId);

      const customFee = new CustomFee().setFixedFee(fixedFee);

      // Create topic with fee
      const topicCreateTx = await new TopicCreateTransaction()
        .setTopicMemo('AI Agent Reputation & Task Ledger - Monetized with HIP-991')
        .setSubmitKey(this.client.operatorPublicKey)
        .setAdminKey(this.client.operatorPublicKey)
        .setCustomFee(customFee)
        .setTransactionMemo('AI Agent Ledger - Monetized Topic Creation')
        .execute(this.client);

      const topicReceipt = await topicCreateTx.getReceipt(this.client);
      this.topicId = topicReceipt.topicId;
      
      console.log(`✅ Topic created: ${this.topicId.toString()}`);
      console.log(`💰 You'll earn 0.01 HBAR per message submitted to this topic.`);
      console.log(`🔗 View on HashScan: https://hashscan.io/testnet/topic/${this.topicId.toString()}`);
      
      return this.topicId;
    } catch (error) {
      console.error('❌ Error creating topic:', error.message);
      throw error;
    }
  }

  async logTask(agentId, taskDescription, status = 'completed') {
    if (!this.topicId) {
      throw new Error('Topic not created. Call createMonetizedTopic() first.');
    }

    const taskData = {
      type: 'task',
      agentId,
      task: taskDescription,
      status,
      timestamp: new Date().toISOString(),
      reputationScore: this.getReputationScore(agentId)
    };

    try {
      const message = JSON.stringify(taskData);
      
      const submitTx = await new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(message)
        .execute(this.client);

      await submitTx.getReceipt(this.client);
      
      this.taskLedger.push(taskData);
      console.log(`✅ Task logged to ledger: ${taskDescription}`);
      
      return submitTx;
    } catch (error) {
      console.error('❌ Error logging task:', error.message);
      throw error;
    }
  }

  async submitReputationRating(agentId, rating, raterId = 'system') {
    if (!this.topicId) {
      throw new Error('Topic not created. Call createMonetizedTopic() first.');
    }

    const reputationData = {
      type: 'reputation',
      agentId,
      rating,
      raterId,
      timestamp: new Date().toISOString(),
      previousScore: this.getReputationScore(agentId)
    };

    try {
      const message = JSON.stringify(reputationData);
      
      const submitTx = await new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(message)
        .execute(this.client);

      await submitTx.getReceipt(this.client);
      
      // Update local reputation score
      this.updateReputationScore(agentId, rating);
      
      console.log(`✅ Reputation rating submitted for ${agentId}: ${rating}/5`);
      console.log(`📊 Current reputation: ${this.getReputationScore(agentId)}/5`);
      
      return submitTx;
    } catch (error) {
      console.error('❌ Error submitting reputation:', error.message);
      throw error;
    }
  }

  getReputationScore(agentId) {
    return this.reputationScores.get(agentId) || 3.0; // Default neutral score
  }

  updateReputationScore(agentId, newRating) {
    const currentScore = this.getReputationScore(agentId);
    // Simple moving average calculation
    const updatedScore = (currentScore + newRating) / 2;
    this.reputationScores.set(agentId, Math.min(5.0, Math.max(1.0, updatedScore)));
  }

  getTaskLedger() {
    return this.taskLedger;
  }

  getTopicId() {
    return this.topicId ? this.topicId.toString() : null;
  }

  async close() {
    await this.client.close();
  }
}

// Demo execution
async function runDemo() {
  const ledger = new AIAgentReputationLedger();
  
  try {
    // Step 1: Create monetized topic
    await ledger.createMonetizedTopic();
    
    // Step 2: Simulate AI agent tasks
    await ledger.logTask('agent_001', 'Completed data analysis task', 'completed');
    await ledger.logTask('agent_002', 'Processed image recognition request', 'completed');
    await ledger.logTask('agent_001', 'Failed to execute smart contract', 'failed');
    
    // Step 3: Submit reputation ratings
    await ledger.submitReputationRating('agent_001', 4.5, 'user_123');
    await ledger.submitReputationRating('agent_002', 5.0, 'user_456');
    await ledger.submitReputationRating('agent_001', 3.5, 'user_789');
    
    console.log('\n🎯 Demo completed successfully!');
    console.log(`📈 Total tasks logged: ${ledger.getTaskLedger().length}`);
    console.log(`👥 Unique agents tracked: ${ledger.reputationScores.size}`);
    
  } catch (error) {
    console.error('💥 Demo failed:', error.message);
  } finally {
    await ledger.close();
  }
}

// Run if called directly
if (require.main === module) {
  runDemo();
}

module.exports = AIAgentReputationLedger;