"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      setStatus('error')
      return
    }

    const verifySubscription = async () => {
      try {
        const res = await fetch('/api/verify-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!res.ok) throw new Error('Failed to verify subscription')

        setStatus('success')
      } catch (error) {
        console.error('Error verifying subscription:', error)
        setStatus('error')
      }
    }

    verifySubscription()
  }, [searchParams])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>There was an error processing your subscription. Please try again.</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Subscription Successful!</h1>
      <p className="mb-4">Thank you for subscribing to our service.</p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Go to Home
      </button>
    </div>
  )
}

