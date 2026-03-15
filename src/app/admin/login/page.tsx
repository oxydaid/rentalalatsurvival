"use client"

import { login } from "@/app/actions/auth"
import { useActionState } from "react"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-earth-900 mb-6">Admin Login</h1>
        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
              {state.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-earth-700">Username</label>
            <input 
              name="username" 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Password</label>
            <input 
              name="password" 
              type="password" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          Default: admin / admin123
        </div>
      </div>
    </div>
  )
}
