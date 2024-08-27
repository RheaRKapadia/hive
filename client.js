async function syncUserData() {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to sync user data');
      }
      console.log('User data synced successfully');
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }

  // Function to run after Clerk has loaded and the user is signed in
  function onClerkLoad() {
    if (window.Clerk) {
      window.Clerk.addListener(({ user }) => {
        if (user) {
          syncUserData();
        }
      });
    }
  }

  // Call onClerkLoad when the page loads
  document.addEventListener('DOMContentLoaded', onClerkLoad);
