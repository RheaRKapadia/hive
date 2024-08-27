const { clerkClient } = require('@clerk/clerk-sdk-node');
const admin = require('./firebaseAdmin');

async function syncUserToFirebase(req, res) {
  try {
    const userId = req.auth.userId;
    const user = await clerkClient.users.getUser(userId);

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.imageUrl,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('users').doc(userId).set(userData, { merge: true });

    console.log(`User data synced to Firebase for user ${userId}`);
    res.status(200).json({ message: 'User data synced successfully' });
  } catch (error) {
    console.error('Error syncing user data to Firebase:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
}

module.exports = { syncUserToFirebase };
