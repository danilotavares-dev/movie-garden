import { useState, type FormEvent, type ReactNode } from 'react'
import axios from 'axios'
import { Logo } from '@movie-garden/ui'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../services/api'

export function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await api.post('/password-reset/request', { email })
      setIsSubmitted(true)
    } catch (error) {
      const serverMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined
      setError(
        typeof serverMessage === 'string'
          ? serverMessage
          : t('forgotPasswordPage.error'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="text-xl sm:text-2xl font-bold text-[#113A2D] tracking-wide">
        {t('forgotPasswordPage.title')}
      </h1>
      <p className="text-zinc-600 text-sm text-center mt-2">
        {isSubmitted
          ? t('forgotPasswordPage.success')
          : t('forgotPasswordPage.subtitle')}
      </p>

      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
          <label className="text-zinc-700 text-sm font-medium" htmlFor="email">
            {t('forgotPasswordPage.emailLabel')}
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('forgotPasswordPage.emailPlaceholder')}
              className="mt-2 w-full bg-[#808080] bg-opacity-50 border border-white/5 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D]"
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#113A2D] hover:bg-[#1a5542] text-white font-bold py-3 rounded-xl disabled:opacity-70"
          >
            {isLoading
              ? t('forgotPasswordPage.sending')
              : t('forgotPasswordPage.submit')}
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="block text-center mt-7 text-[#113A2D] hover:underline font-medium"
      >
        {t('forgotPasswordPage.backToLogin')}
      </Link>
    </AuthShell>
  )
}

export function ResetPassword() {
  const { t } = useTranslation()
  const token = new URLSearchParams(window.location.search).get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirmation) {
      setError(t('forgotPasswordPage.passwordMismatch'))
      return
    }

    setIsLoading(true)
    setError('')
    try {
      await api.post('/password-reset/confirm', { token, password })
      setIsDone(true)
    } catch {
      setError(t('forgotPasswordPage.invalidToken'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="text-xl sm:text-2xl font-bold text-[#113A2D] tracking-wide">
        {t('resetPasswordPage.title')}
      </h1>
      <p className="text-zinc-600 text-sm text-center mt-2">
        {isDone
          ? t('resetPasswordPage.success')
          : t('resetPasswordPage.subtitle')}
      </p>

      {!isDone && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('resetPasswordPage.passwordPlaceholder')}
            className="bg-[#808080] bg-opacity-50 border border-white/5 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={t('resetPasswordPage.confirmPlaceholder')}
            className="bg-[#808080] bg-opacity-50 border border-white/5 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D]"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !token}
            className="bg-[#113A2D] hover:bg-[#1a5542] text-white font-bold py-3 rounded-xl disabled:opacity-70"
          >
            {isLoading
              ? t('resetPasswordPage.saving')
              : t('resetPasswordPage.submit')}
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="block text-center mt-7 text-[#113A2D] hover:underline font-medium"
      >
        {t('forgotPasswordPage.backToLogin')}
      </Link>
    </AuthShell>
  )
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-custom-gradient flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[600px] bg-[#D9D9D9] bg-opacity-60 rounded-3xl p-5 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Logo className="h-16 w-16" />
          {children}
        </div>
      </div>
    </div>
  )
}
