import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import Swal from 'sweetalert2';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

function Dashboard() {
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const timeoutId = useRef(null);

  const resetTimeout = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      logout();
      Swal.fire({ icon: 'info', title: 'Sessão expirada', text: 'Você foi deslogado por inatividade.', timer: 2500, showConfirmButton: false });
    }, SESSION_TIMEOUT);
  };

  const logout = () => {
    localStorage.removeItem('adminLogged');
    navigate('/');
  };

  useEffect(() => {
    const logged = localStorage.getItem('adminLogged');
    if (logged !== 'true') { navigate('/'); return; }
    fetchConvidados();
    resetTimeout();
    return () => clearTimeout(timeoutId.current);
  }, [navigate]);

  useEffect(() => { resetTimeout(); }, [filtro, expandedId]);

  const fetchConvidados = async () => {
    try {
      setLoading(true);
      const convidadosRef = collection(db, 'convidados');
      const querySnapshot = await getDocs(convidadosRef);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConvidados(list);
    } catch (error) {
      console.error('Erro:', error);
      Swal.fire({ title: 'Erro', text: 'Não foi possível carregar os dados.', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Função para exportar CSV (abre no Excel)
  const exportarParaExcel = () => {
    const headers = ['Nome', 'Status', 'Data da Resposta'];
    const rows = convidados.map(c => [
      `"${c.nome || ''}"`,
      c.comparecer === 'sim' ? 'Confirmado' : 'Recusou',
      `"${formatTimestamp(c.dataConfirmacao)}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "lista_convidados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convidadosFiltrados = convidados.filter(c => c.nome?.toLowerCase().includes(filtro.toLowerCase()));
  const confirmados = convidadosFiltrados.filter(c => c.comparecer === 'sim');
  const naoConfirmados = convidadosFiltrados.filter(c => c.comparecer === 'nao');

  function formatTimestamp(ts) {
    if (!ts) return '—';
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString('pt-BR');
    const parsed = Date.parse(ts);
    return !isNaN(parsed) ? new Date(parsed).toLocaleString('pt-BR') : String(ts);
  }

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="text-xl">Carregando...</p></div>;

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-gray-800">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold uppercase tracking-wide font-bebas">Lista de Presenças</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition">Logout</button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <div className="flex gap-2">
            <button onClick={exportarParaExcel} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                Exportar (Excel)
            </button>
            <button onClick={fetchConvidados} className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition">
                Recarregar
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-3xl font-extrabold mb-6 text-green-700 border-b-4 border-green-600 pb-2 font-bebas">Confirmados ({confirmados.length})</h2>
          <ul className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
            {confirmados.map(({ id, nome, dataConfirmacao }) => (
              <li key={id} className="cursor-pointer bg-green-50 rounded-lg shadow-sm p-4 hover:bg-green-100 transition" onClick={() => toggleExpand(id)}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-900">{nome}</span>
                  <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded-full uppercase">Confirmado</span>
                </div>
                {expandedId === id && <p className="mt-2 text-sm text-green-700 italic">(Em {formatTimestamp(dataConfirmacao)})</p>}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-extrabold mb-6 text-red-700 border-b-4 border-red-600 pb-2 font-bebas">Recusaram ({naoConfirmados.length})</h2>
          <ul className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
            {naoConfirmados.map(({ id, nome, dataConfirmacao }) => (
              <li key={id} className="cursor-pointer bg-red-50 rounded-lg shadow-sm p-4 hover:bg-red-100 transition" onClick={() => toggleExpand(id)}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-red-900">{nome}</span>
                  <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full uppercase">Recusou</span>
                </div>
                {expandedId === id && <p className="mt-2 text-sm text-red-700 italic">(Em {formatTimestamp(dataConfirmacao)})</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;