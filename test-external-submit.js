require('dotenv').config();
const { 
  Client, 
  TopicMessageSubmitTransaction, 
  AccountId, 
  PrivateKey 
} = require('@hashgraph/sdk');

async function submitToYourTopic() {
  // Use second account if available, otherwise use main operator
  let accountId, privateKey;
  
  if (process.env.SECOND_ACCOUNT_ID && process.env.SECOND_ACCOUNT_KEY) {
    accountId = AccountId.fromString(process.env.SECOND_ACCOUNT_ID);
    privateKey = PrivateKey.fromString(process.env.SECOND_ACCOUNT_KEY);
    console.log(`🔄 Using secondary account: ${accountId.toString()}`);
  } else {
    accountId = AccountId.fromString(process.env.OPERATOR_ID);
    privateKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
    console.log(`🔄 Using main operator account: ${accountId.toString()}`);
  }

  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);

  // Check if topic ID is provided as argument or in environment
  let topicId = process.argv[2] || process.env.TOPIC_ID;
  
  if (!topicId) {
    console.error('❌ Please provide a topic ID as argument or set TOPIC_ID in .env');
    console.log('💡 Usage: node test-external-submit.js 0.0.123456789');
    process.exit(1);
  }

  const message = JSON.stringify({ 
    type: "test", 
    from: "external_agent", 
    msg: "Hello from another AI!",
    timestamp: new Date().toISOString(),
    sender: accountId.toString()
  });
  
  try {
    console.log(`📤 Submitting message to topic: ${topicId}`);
    console.log(`💰 Note: Topic owner will receive 0.01 HBAR fee for this message`);
    
    const submitTx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client);

    const receipt = await submitTx.getReceipt(client);
    
    console.log('✅ External message sent successfully!');
    console.log(`📝 Transaction ID: ${submitTx.transactionId.toString()}`);
    console.log(`🔗 View on HashScan: https://hashscan.io/testnet/transaction/${submitTx.transactionId.toString()}`);
    
    // Show the topic on HashScan
    console.log(`📊 Topic on HashScan: https://hashscan.io/testnet/topic/${topicId}`);
    
  } catch (error) {
    console.error('❌ Error sending external message:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('INSUFFICIENT_TX_FEE')) {
      console.log('💡 Tip: The sender needs more HBAR to pay the topic fee + transaction fee');
    } else if (error.message.includes('INVALID_SIGNATURE')) {
      console.log('💡 Tip: Check your private key format in .env file');
    } else if (error.message.includes('INVALID_TOPIC_ID')) {
      console.log('💡 Tip: Make sure the topic ID is correct and exists on testnet');
    }
    
    throw error;
  } finally {
    await client.close();
  }
}

// Run the function
if (require.main === module) {
  submitToYourTopic().catch(console.error);
}

module.exports = { submitToYourTopic };