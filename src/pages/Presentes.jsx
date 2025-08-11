import { QrCode, Copy, Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Presentes() {
  const navigate = useNavigate();
  const [modalVisivel, setModalVisivel] = useState(false);

  const chaveTexto = "d105ae1a-f575-4bbe-9b60-bc5a6d8d0530";

  const copiarPix = () => {
    navigator.clipboard.writeText(chaveTexto);
    setModalVisivel(true);
    setTimeout(() => {
      setModalVisivel(false);
    }, 2500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8 min-h-screen bg-white text-[var(--color-green3)]">
      <h1 className="font-great-vibes text-5xl mb-2">Presente</h1>
      <p className="text-center font-rubik text-gray-700 max-w-md mb-6">
        Sua presença já é um presente! Mas, se quiser nos presentear, você pode fazer um Pix usando o QR Code abaixo 💚
      </p>

      <div className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col items-center">
        <QrCode className="w-6 h-6 text-[var(--color-green3)] mb-2" />
        <img
          src="/QR CODE.jpg"
          alt="QR Code Pix"
          className="w-64 h-64 object-contain mb-4"
        />

        <div className="flex flex-col items-center gap-2">
          <p className="font-bold font-rubik text-sm text-center">
            Chave Pix (copiar abaixo):
          </p>
          <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-full">
            <span className="text-sm font-mono">{chaveTexto}</span>
            <button
              onClick={copiarPix}
              className="text-[var(--color-green3)] hover:text-white hover:bg-[var(--color-green3)] p-1 rounded-full transition"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-10 flex items-center gap-2 cursor-pointer text-[var(--color-green3)] hover:underline"
      >
        <Heart size={18} />
        Voltar para o convite
      </button>

      {/* Modal flutuante (feedback visual) */}
      {modalVisivel && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[var(--color-green3)] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-opacity duration-300 ease-out animate-[fadeInUp_0.3s_ease-out]">
          <CheckCircle size={20} />
          <span className="text-sm">Chave Pix copiada com sucesso!</span>
        </div>
      )}

      {/* Animação via Tailwind padrão usando plugin animate-[...] */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Presentes;
