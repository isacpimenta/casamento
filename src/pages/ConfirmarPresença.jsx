import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ConfirmarPresenca() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [comparecer, setComparecer] = useState(null); // 'sim' ou 'nao'

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome.trim() || !comparecer) {
      alert('Por favor, preencha seu nome e escolha uma opção.');
      return;
    }

    alert(`Obrigado, ${nome}! Sua resposta foi: ${comparecer === 'sim' ? 'Sim, vou comparecer' : 'Não poderei comparecer'}.`);

    // Aqui você pode fazer envio para backend se quiser

    navigate('/'); // volta para a página inicial depois do envio
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      <CheckCircle className="text-[var(--color-green3)] w-20 h-20 mb-6" />

      <h1 className="text-3xl font-great-vibes text-[var(--color-green3)] mb-4">
        Confirmação de Presença
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-50 p-6 rounded-lg shadow-md">
        <label className="block mb-4 text-left font-rubik text-gray-700">
          Nome completo:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-green3)]"
            placeholder="Digite seu nome completo"
            required
          />
        </label>

        <fieldset className="mb-4 text-left font-rubik text-gray-700">
          <legend className="mb-2">Você poderá comparecer?</legend>

          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="comparecer"
              value="sim"
              checked={comparecer === 'sim'}
              onChange={() => setComparecer('sim')}
              className="cursor-pointer form-radio text-[var(--color-green3)]"
              required
            />
            <span className="ml-2">Sim</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="comparecer"
              value="nao"
              checked={comparecer === 'nao'}
              onChange={() => setComparecer('nao')}
              className="cursor-pointer form-radio text-[var(--color-green3)]"
            />
            <span className="ml-2">Não</span>
          </label>
        </fieldset>

        <button
          type="submit"
          className="cursor-pointer w-full bg-[var(--color-green3)] text-white py-2 rounded-full hover:opacity-90 transition duration-300"
        >
          Enviar
        </button>
      </form>

      <button
        onClick={handleBack}
        className="cursor-pointer mt-6 px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300"
      >
        Voltar para o convite
      </button>
    </div>
  );
}

export default ConfirmarPresenca;
