const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_manager';

async function createIndexes() {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const db = mongoose.connection;

    // Create indexes for Users collection
    console.log('Creating indexes for Users collection...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    console.log('Users indexes created');

    // Create indexes for Tasks collection
    console.log('Creating indexes for Tasks collection...');
    await db.collection('tasks').createIndex({ assignedTo: 1 });
    await db.collection('tasks').createIndex({ status: 1 });
    await db.collection('tasks').createIndex({ dueDate: 1 });
    await db.collection('tasks').createIndex({ createdAt: -1 });
    // Compound index for common queries
    await db.collection('tasks').createIndex({ assignedTo: 1, status: 1 });
    await db.collection('tasks').createIndex({ assignedTo: 1, dueDate: 1 });
    console.log('Tasks indexes created');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

// Execute the function
createIndexes(); 