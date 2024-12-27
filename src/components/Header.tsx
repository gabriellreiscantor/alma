export function Header() {
  return (
    <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-4 shadow-lg">
      <div className="flex items-center gap-4 max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg shadow-inner">
          <Waves className="w-7 h-7 text-white wave-icon" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl sm:text-4xl text-white font-display tracking-wider transform hover:scale-105 transition-all duration-300 bg-clip-text">
            almmar
          </h1>
          <span className="text-white/80 text-sm font-light tracking-wider">seu espaço de conexão</span>
        </div>
      </div>
    </header>
  );
}