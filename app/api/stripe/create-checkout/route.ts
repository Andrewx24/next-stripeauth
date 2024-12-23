import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import stripe from '@/lib/stripe';
import User from '@/lib/types/user';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const { email } = await req.json();

    const user = await User.findOne({ email });
    
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({ email });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const stripeSession = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'your-stripe-price-id', // Create this in Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
