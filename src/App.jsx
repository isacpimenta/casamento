import { MapPin, Gift, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    // Aumentei o pb-20 para empurrar o conteúdo inferior para cima
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-between pt-10 pb-20 md:pt-5 md:pb-20 px-6">
      
      {/* Ramos Decorativos */}
      <img 
        className="absolute top-[-5%] right-[-10%] md:top-[0%] md:right-[-15%] w-48 md:w-164 opacity-60 pointer-events-none" 
        src="/ramo1.png" 
        alt="" 
      />
      <img 
        className="absolute bottom-[-5%] left-[-15%] md:bottom-[-20%] md:left-[-15%] w-64 md:w-180 opacity-60 pointer-events-none rotate-12" 
        src="/ramo2.png" 
        alt="" 
      />

      {/* Cabeçalho */}
      <div className="text-center z-10">
        <p className="text-lg md:text-2xl tracking-[0.2em] font-light text-gray-800">SAVE</p>
        <h1 className="font-great-vibes text-5xl md:text-7xl my-2 text-[var(--color-green3)] leading-tight">
          The new
        </h1>
        <p className="text-lg md:text-2xl tracking-[0.2em] font-light text-gray-800">DATE</p>
      </div>

      {/* Moldura em Losango Restaurada */}
      <div className="relative z-10 my-4">
        <div className="w-52 h-52 md:w-64 md:h-64 border border-[var(--color-green3)] rotate-45 overflow-hidden flex items-center justify-center bg-gray-100 shadow-lg">
          <img 
            src="/foto.png" 
            alt="Foto do Casal" 
            className="w-[145%] h-[145%] object-cover -rotate-45" 
          />
        </div>
      </div>

      {/* Seção da Data e Nomes */}
      <div className="flex flex-col items-center w-full z-10">
        <h2 className="font-great-vibes text-3xl md:text-4xl text-[var(--color-green3)]">
          Thursday
        </h2>

        <div className="flex justify-center items-center gap-4 my-1">
          <p className="font-rubik text-gray-600 font-medium">NOV</p>
          <h1 className="font-rubik text-5xl md:text-6xl font-bold text-gray-800">19</h1>
          <p className="font-rubik text-gray-600 font-medium">2026</p>
        </div>

        <div className="flex flex-col items-center gap-2 w-full max-w-[300px]">
          <img className="h-8 object-contain" src="/flecha.png" alt="" />
          <img className="w-full object-contain" src="/matdeba.png" alt="Matheus Abreu & Débora Senna" />
        </div>
      </div>

      {/* Botões de Ação - Subidos com mb-4 ou ajuste de justify */}
      <div className="flex flex-col items-center gap-4 z-10 mb-2">
        <div className="flex gap-6">
          <button 
            onClick={() => navigate("/local")} 
            className='p-3 rounded-full border border-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] hover:text-white transition-all duration-300 animate-bounce'
          >
            <MapPin size={24} />
          </button>
          
          <button 
            onClick={() => navigate("/presentes")} 
            className='p-3 rounded-full border border-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] hover:text-white transition-all duration-300 animate-bounce [animation-delay:0.2s]'
          >
            <Gift size={24} />
          </button>
          
          <button 
            onClick={() => navigate("/confirmar")} 
            className='p-3 rounded-full border border-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] hover:text-white transition-all duration-300 animate-bounce [animation-delay:0.4s]'
          >
            <Check size={24} />
          </button>
        </div>
        
        <p className='font-bebas text-xs tracking-widest text-[var(--color-green3)] opacity-80 uppercase'>
          Clique nos ícones para acessar
        </p>
      </div>
    </div>
  )
}

export default App