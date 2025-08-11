import { CheckCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Importa Firestore
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

// Importa SweetAlert2
import Swal from 'sweetalert2';

function ConfirmarPresenca() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [comparecer, setComparecer] = useState(null);
  const [formValido, setFormValido] = useState(false);

  useEffect(() => {
    const nomeValido = nome.trim().length > 0;
    const respostaValida = comparecer === 'sim' || comparecer === 'nao';
    setFormValido(nomeValido && respostaValida);
  }, [nome, comparecer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValido) {
      await Swal.fire({
        title: 'Ops!',
        text: 'Por favor, preencha seu nome corretamente e escolha uma opção.',
        icon: 'warning',
        confirmButtonColor: '#facc15',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Enviando confirmação...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    try {
      const convidadosRef = collection(db, 'convidados');
      const q = query(convidadosRef, where('nome', '==', nome.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(convidadosRef, {
          nome: nome.trim(),
          comparecer,
          dataConfirmacao: new Date().toISOString(),
        });
      } else {
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, 'convidados', docId);
        await updateDoc(docRef, {
          comparecer,
          dataConfirmacao: new Date().toISOString(),
        });
      }

      await Swal.fire({
        title: `Obrigado, ${nome.trim()}!`,
        text: `Sua resposta foi: ${comparecer === 'sim' ? 'Sim, vou comparecer' : 'Não poderei comparecer'}.`,
        icon: 'success',
        confirmButtonColor: '#4ade80',
        confirmButtonText: 'Fechar',
      });

      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      await Swal.fire({
        title: 'Erro',
        text: 'Não foi possível enviar sua confirmação. Tente novamente.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Tentar de novo',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-green3)] text-center px-6">
      <CheckCircle className="text-white w-20 h-20 mb-6" />

      <h1 className="text-3xl font-great-vibes text-white mb-4">
        Confirmação de Presença
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-50 p-6 rounded-lg shadow-md">
        <h1 className='font-bebas text-[var(--color-green3)] mb-3'>TODOS OS CONVIDADOS DEVEM PREENCHER !</h1>
        
        <label className="block mb-4 text-left font-rubik text-gray-700">
          Nome completo:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-green3)]"
            placeholder="Digite seu nome completo"
            autoComplete="off"
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
          disabled={!formValido}
          className={`cursor-pointer w-full py-2 rounded-full text-white transition duration-300
            ${formValido ? 'bg-[var(--color-green3)] hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Enviar
        </button>
      </form>

      <button
        onClick={() => navigate('/')}
        className="mt-10 flex items-center gap-2 cursor-pointer text-white hover:underline"
      >
        <Heart size={18} />
        Voltar para o convite
      </button>
    </div>
  );
}

export default ConfirmarPresenca;
