import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6907bbc1d9a3081c7edf7dd0", 
  requiresAuth: true // Ensure authentication is required for all operations
});
