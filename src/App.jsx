import { MapPin, Gift, Check } from 'lucide-react'

function App() {
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

        <img className="max-h-8" src="/flecha.png" alt="" />
        <img src="/matdeba.png" alt="" />
      </div>

      <div className="flex gap-2 mt-5 z-0">
        <button className='rounded-full py-1 px-1 border-2 cursor-pointer border-y-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] transition duration-200 animate-bounce [animation-duration:2s]'>
          <MapPin className='hover:text-white text-[var(--color-green3)]' />
        </button>
        <button className='rounded-full py-1 px-1 border-2 cursor-pointer border-y-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] transition duration-200 animate-bounce [animation-duration:2s] [animation-delay:0.2s]'>
          <Gift className='hover:text-white text-[var(--color-green3)]' />
        </button>
        <button className='rounded-full py-1 px-1 border-2 cursor-pointer border-y-[var(--color-green3)] text-[var(--color-green3)] hover:bg-[var(--color-green3)] transition duration-200 animate-bounce [animation-duration:2s] [animation-delay:0.4s]'>
          <Check className='hover:text-white text-[var(--color-green3)]' />
        </button>
      </div>
    </div>
  )
}

export default App

        {/* <button className="relative inline-block px-6 py-2 font-rubik bg-[var(--color-green3)] text-white border border-[var(--color-green3)] rounded-full overflow-hidden group">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-green3)] to-[var(--color-green1)] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
          <span className="relative z-10">CONFIRMAR PRESENÇA</span>
        </button> */}

        // botao antigo