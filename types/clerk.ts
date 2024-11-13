import { UserPlan } from './user'

export interface ClerkUser {
  id: string;
  email: string;
  public_metadata: {
    plan?: UserPlan;
  };
} 