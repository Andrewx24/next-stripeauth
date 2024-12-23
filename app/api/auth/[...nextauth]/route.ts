import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import User from '@/lib/types/user';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user }) {
      const dbUser = await User.findOne({ email: user.email });
      session.user.subscriptionStatus = dbUser?.subscriptionStatus || 'none';
      return session;
    },
  },
});

export { handler as GET, handler as POST };
