import { User } from '../types';

// Mock user database in memory. In a real app, this would be a database.
const MOCK_USERS = [
  { id: 'admin1', email: 'admin@city.com', password: 'adminpassword', role: 'admin' as const },
  { id: 'user1', email: 'user@example.com', password: 'userpassword', role: 'user' as const },
];

const STORAGE_KEY = 'improve-my-city-user';

export const login = async (email, password): Promise<User | null> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (user) {
    // Only store non-sensitive info in the session
    const sessionUser: User = { id: user.id, email: user.email, role: user.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }
  
  return null;
};

export const signUp = async (email, password): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  if (MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  
  const newUser = {
    id: `user${MOCK_USERS.length + 1}`,
    email,
    password, // In a real app, this should be securely hashed!
    role: 'user' as const
  };

  MOCK_USERS.push(newUser);
  
  const sessionUser: User = { id: newUser.id, email: newUser.email, role: newUser.role };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEY);
  if (userJson) {
    try {
      const userData = JSON.parse(userJson);
      // Basic validation
      if (userData.id && userData.email && userData.role) {
        return userData as User;
      }
      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
  return null;
};