import searchIcon from './assets/search.png'

export function CatalogHeader() {
    return (
        <header className="bg-[#D9D9D9] bg-opacity-60 border-none rounded-xl flex items-center justify-between mb-5 p-3 w-full">
            <div className="bg-[#113A2D] bg-opacity-60 rounded-full h-10 w-10 hover:scale-105 hover:opacity-90"></div>

            <label className="px-3 bg-[#040404] bg-opacity-60 flex gap-2 rounded-xl h-10 w-full items-center flex-1 mx-4 max-w-[700px] hover:bg-opacity-70 transition-all hover:scale-105 cursor-text group">
                <img className="h-6 w-6 group-hover:opacity-100 cursor-pointer transition-opacity" src={searchIcon} alt="pesquisar" />
                <input type="text" placeholder="Pesquisar" className="bg-transparent outline-none border-none w-full h-full rounded-xl placeholder-zinc-400"/>
            </label>

            <div className="bg-[#040404] bg-opacity-60 rounded-full h-10 w-10 hover:scale-105 hover:opacity-90"></div>
        </header>
    )
}