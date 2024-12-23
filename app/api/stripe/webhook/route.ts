import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import User from '@/lib/types/user';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  const session = event.data.object as any;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await User.findOneAndUpdate(
        { stripeCustomerId: session.customer },
        {
          subscriptionStatus: session.status,
          subscriptionId: session.id,
        }
      );
      break;
      
    case 'customer.subscription.deleted':
      await User.findOneAndUpdate(
        { stripeCustomerId: session.customer },
        {
          subscriptionStatus: 'canceled',
          subscriptionId: null,
        }
      );
      break;
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};