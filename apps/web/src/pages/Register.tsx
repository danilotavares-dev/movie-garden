import { useState, type FormEvent } from 'react'
import { Logo } from '@movie-garden/ui'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDialog } from '../components/AppDialog'

export function Register() {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { showDialog } = useAppDialog()

  async function handleRegisterEvent(event: FormEvent) {
    event.preventDefault()

    if (password !== confirmPassword) {
      showDialog('As senhas não coincidem.', {
        title: 'Verifique os dados',
        variant: 'error',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3333/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.status === 201) {
        showDialog('Conta criada com sucesso! 🌱', {
          title: 'Tudo certo',
          variant: 'success',
        })
        navigate('/login')
      } else {
        const data: unknown = await response.json().catch(() => null)
        const message =
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof data.message === 'string'
            ? data.message
            : 'Ocorreu um erro ao criar a conta.'
        showDialog(message, {
          title: 'Não foi possível criar a conta',
          variant: 'error',
        })
      }
    } catch (error) {
      console.error(error)
      showDialog('Erro de conexão com o servidor.', {
        title: 'Falha de conexão',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-custom-gradient flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[600px] bg-[#D9D9D9] bg-opacity-60 backdrop-blur-md rounded-3xl px-5 sm:px-12 py-7 sm:py-11 shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-16 w-16" />
          <h1 className="text-[#113A2D] text-2xl sm:text-3xl font-bold tracking-wide">
            {t('registerPage.title')}
          </h1>
          <p className="text-zinc-600 text-sm mt-2">
            {t('registerPage.subtitle')}
          </p>
        </div>

        <form onSubmit={handleRegisterEvent} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="user"
            >
              {t('registerPage.usernameLabel')}
            </label>
            <input
              id="user"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('registerPage.usernamePlaceholder')}
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="email"
            >
              {t('registerPage.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('registerPage.emailPlaceholder')}
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="password"
            >
              {t('registerPage.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('registerPage.passwordPlaceholder')}
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="confirm-password"
            >
              {t('registerPage.checkPasswordLabel')}
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('registerPage.checkPasswordPlaceholder')}
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-[#113A2D] hover:bg-[#1a5542] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#113A2D]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading
              ? t('registerPage.creatingAccount')
              : t('registerPage.createAccount')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-600 text-sm">
            {t('registerPage.alreadyAccount')}{' '}
            <Link
              to="/login"
              className="text-[#113A2D] hover:underline font-medium hover:text-[#113A2D] transition-colors"
            >
              {t('registerPage.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
