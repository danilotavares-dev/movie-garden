import { Logo } from '../Logo'
import { SearchIcon } from '../SearchIcon'
import { UserAvatar } from '../UserAvatar'

export function CatalogHeader() {
  return (
    <header className="bg-[#D9D9D9] bg-opacity-60 border-none rounded-xl flex items-center justify-between mb-5 p-2 w-full">
      <Logo className="h-10 w-10" />

      <label className="px-3 bg-[#040404] bg-opacity-60 flex gap-2 rounded-xl h-9 w-full items-center flex-1 mx-4 max-w-[700px] hover:bg-opacity-70 transition-all hover:scale-x-95 cursor-text group">
        <SearchIcon className="h-4 w-4 text-zinc-500 group-hover:opacity-100 cursor-text transition-opacity" />

        <input
          type="text"
          placeholder="Pesquisar"
          className="bg-transparent outline-none border-none w-full h-full rounded-xl placeholder-zinc-400"
        />
      </label>

      <UserAvatar className="p-1 h-8 w-8" />
    </header>
  )
}
