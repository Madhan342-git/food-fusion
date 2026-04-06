import('dotenv').then(m => m.default.config());
import('mongoose').then(async (mongoose) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
    
    // Import User model
    const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
    const User = mongoose.model('User', userSchema);
    
    // Delete the user with the problematic password
    const result = await User.deleteOne({ email: '99220040292@klu.ac.in' });
    console.log('Deleted users:', result.deletedCount);
    
    // List remaining users
    const allUsers = await User.find({}, { email: 1, name: 1 });
    console.log('Remaining users:', allUsers.length);
    allUsers.forEach(u => console.log('  -', u.email, '(', u.name, ')'));
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
  }
});
