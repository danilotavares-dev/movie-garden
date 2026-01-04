import { Logo } from '@movie-garden/ui'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Cadastro() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen w-full bg-custom-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-[600px] bg-[#D9D9D9] bg-opacity-60 backdrop-blur-md rounded-3xl px-12 py-11 shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-16 w-16" />
          <h1 className="text-[#113A2D] text-3xl font-bold tracking-wide">
            Crie sua conta
          </h1>
          <p className="text-zinc-600 text-sm mt-2">
            Junte-se à comunidade Movie Garden
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="user"
            >
              Nome de usuário
            </label>
            <input
              id="user"
              type="text"
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'passward'}
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-zinc-700 text-sm font-medium ml-1"
              htmlFor="confirm password"
            >
              Confirmação de senha
            </label>
            <input
              id="conf_password"
              type="password"
              className="bg-[#808080] bg-opacity-40 border border-white/10 text-zinc-900 rounded-xl px-4 py-3 outline-none focus:border-[#113A2D] focus:ring-1 focus:ring-[#113A2D] transition-all"
            />
          </div>
          <button
            type="button"
            className="mt-4 bg-[#113A2D] hover:bg-[#1a5542] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#113A2D]/20 active:scale-95"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-600 text-sm">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-[#113A2D] hover:underline font-medium hover:text-[#113A2D] transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
