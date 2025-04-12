// lib/user.js
import { useUser } from '@clerk/nextjs';
import User from '@/models/User';

export const syncUserToDB = async (clerkUser) => {
  try {
    const userData = {
      clerkUserId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      profileImage: clerkUser.profileImageUrl
    };

    const response = await fetch('/api/users/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    return await response.json();
  } catch (error) {
    console.error('User sync failed:', error);
  }
};

// Use in components
export const useSyncUser = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      syncUserToDB(user);
    }
  }, [user]);
};