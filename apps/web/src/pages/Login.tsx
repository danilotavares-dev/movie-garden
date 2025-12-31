import { use, useState } from 'react'
import { Logo } from '@movie-garden/ui'

export function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen w-full bg-custom-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#D9D9D9] bg-opacity-60 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Logo className="h-16 w-16" />
          <h1 className="text-2xl font-bold text-[#113A2D] tracking-wide">
            Bem-vindo de volta!
          </h1>
          <p className="text-zinc-600 text-sm">
            Acesse sua conta para continuar
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              className="bg-[#808080] bg-opacity-50 border border-white/5 text-zinc-600 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label
                className="text-zinc-700 text-sm font-medium"
                htmlFor="password"
              >
                Senha
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-[#808080] bg-opacity-50 border border-white/5 text-zinc-900 placeholder:text-zinc-600 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-[#113A2D] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>

            <a
              href="/"
              className="text-xs text-[#113A2D] hover:text-[#1a5542] font-semibold transition-colors"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="button" // Mudaremos para 'submit' quando tiver backend
            className="mt-2 bg-[#113A2D] hover:bg-[#1a5542] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#113A2D]/20 active:scale-95"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Não tem uma conta?{' '}
            <a
              href="/"
              className="text-[#113A2D] hover:underline font-medium hover:text-[#113A2D] transition-colors"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
