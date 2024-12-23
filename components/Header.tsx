'use client';

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Subscription App
        </Link>
        <div>
          {session ? (
            <>
              <span className="mr-4">Signed in as {session.user?.email}</span>
              <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => signIn('google')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Sign in with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

