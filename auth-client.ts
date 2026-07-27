import { createAuthClient } from "better-auth/react";

// No baseURL needed: the client and the API routes are served from the
// same origin once deployed, so relative requests just work.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
