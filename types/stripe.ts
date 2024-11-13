import { PlanType } from './user'

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      metadata?: {
        userId?: string;
        plan?: PlanType;
      };
      client_reference_id?: string;
      amount_total?: number;
      currency?: string;
      payment_status?: string;
    };
  };
} 