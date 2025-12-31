// Test MongoDB Connection
// Run this with: node test-db-connection.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    console.log('Connection String:', process.env.MONGODB_URI?.replace(/\/\/(.+):(.+)@/, '//$1:****@'));

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('\n✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    if (collections.length === 0) {
      console.log('   (No collections yet - this is normal for a new database)');
    } else {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection closed. Setup successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\n🔍 Common issues:');
    console.error('   1. Check username and password in MONGODB_URI');
    console.error('   2. Ensure IP whitelist allows your IP (or use 0.0.0.0/0)');
    console.error('   3. Verify database user has read/write permissions');
    console.error('   4. Check if special characters in password are URL-encoded');
    process.exit(1);
  }
}

testConnection();
