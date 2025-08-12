import { MapPin, Gift, Check, Pointer } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center h-screen w-screen overflow-hidden py-10 px-10">
      <div className="text-center">
        <p className="text-2xl">SAVE</p>
        <h1 className="font-great-vibes text-6xl mt-5 text-[var(--color-green3)]">
          The new
        </h1>
        <p className="text-2xl">DATE</p>
      </div>

      <img src="/foto.png" alt="" />

      <img className="absolute top-0 right-[-190px] opacity-50" src="/ramo1.png" alt="" />
      <img className="absolute top-100 left-[-190px] opacity-50" src="/ramo2.png" alt="" />

      <div className="flex flex-col items-center w-full">
        <h1 className="font-great-vibes text-3xl mt-5 text-[var(--color-green3)]">
          Thursday
        </h1>

        <div className="flex justify-center items-center gap-4">
          <p className="font-rubik">NOV</p>
          <h1 className="font-rubik text-5xl">19</h1>
          <p className="font-rubik">2026</p>
        </div>

        <img className="max-h-8 mt-2 mb-2" src="/flecha.png" alt="" />
        <img src="/matdeba.png" alt="" />
      </div>

      <div className="flex gap-2 mt-5 z-0">
        <button onClick={() => navigate("/local")} className='rounded-full py-1 px-1 border-2 cursor-pointer border-y-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] transition duration-200 animate-bounce [animation-duration:2s]'>
          <MapPin className='hover:text-white text-[var(--color-green3)]' />
        </button>
        <button onClick={() => navigate("/presentes")} className='rounded-full py-1 px-1 border-2 cursor-pointer border-y-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] transition duration-200 animate-bounce [animation-duration:2s] [animation-delay:0.2s]'>
          <Gift className='hover:text-white text-[var(--color-green3)]' />
        </button>
        <button onClick={() => navigate("/confirmar")} className='rounded-full py-1 px-1 border-2 cursor-pointer border-y-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] transition duration-200 animate-bounce [animation-duration:2s] [animation-delay:0.4s]'>
          <Check className='hover:text-white text-[var(--color-green3)]' />
        </button>
      </div>

      <p className='font-bebas mt-3 text-[var(--color-green3)]'>Clique nos ícones para acessar</p>
    </div>
  )
}

export default App