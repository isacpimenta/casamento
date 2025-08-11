import { MapPin, Share2, MapPlus, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LocalFesta() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const endereco =
    "Rua Marechal Deodoro da Fonseca, S/N Lote 04, Quadra 1 - Santa Cruz da Serra, Duque de Caxias - RJ, 25260-300";
  const mapsUrl = "https://maps.app.goo.gl/nabZ64scgY7pdqUm9"; // atualize com seu link real

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mapsUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center max-w-md mx-auto">
      <h1 className="text-4xl font-great-vibes text-[var(--color-green3)] mt-10 mb-4">
        Local da Festa
      </h1>

      <div className="flex items-center gap-2 mb-4 text-[var(--color-green3)] font-rubik text-sm text-center">
        <MapPin size={20} />
        <p>{endereco}</p>
      </div>

      <div className="w-full h-60 rounded-lg overflow-hidden shadow-md mb-6">
        <iframe
          title="Mapa do local da festa"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.4717356742667!2d-43.2690361!3d-22.636193799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997348620e892b%3A0x8a6790e439e004a5!2sS%C3%ADtio%20do%20Meu%20Pai!5e0!3m2!1spt-BR!2sbr!4v1753510522387!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="flex gap-6 mb-8">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-[var(--color-green3)] text-white rounded-full hover:opacity-90 transition duration-300"
          title="Ver no Google Maps"
        >
          <MapPlus size={24} />
        </a>

        <button
          onClick={handleCopyLink}
          className="p-3 border border-[var(--color-green3)] text-[var(--color-green3)] rounded-full hover:bg-[var(--color-green3)] hover:text-white transition duration-300"
          title="Compartilhar Local"
        >
          {copied ? (
            <span className="text-sm">✔</span>
          ) : (
            <Share2 size={24} />
          )}
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer text-[var(--color-green3)] hover:underline"
      >
        <Heart size={18} />
        Voltar para o convite
      </button>
    </div>
  );
}
