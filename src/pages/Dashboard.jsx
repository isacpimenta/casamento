import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import Swal from 'sweetalert2';

function Dashboard() {
  const [convidados, setConvidados] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  // Buscar convidados
  const fetchConvidados = async () => {
    try {
      setLoading(true);
      const convidadosRef = collection(db, 'convidados');
      const querySnapshot = await getDocs(convidadosRef);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConvidados(list);
    } catch (error) {
      console.error('Erro ao buscar convidados:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Não foi possível carregar os dados. Tente novamente mais tarde.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Fechar',
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar logs
  const fetchLogs = async () => {
    try {
      const logsRef = collection(db, 'tentativas_login');
      const snapshot = await getDocs(logsRef);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenar mais recentes primeiro (timestamp pode ser objeto Firestore)
      list.sort((a, b) => {
        const timeA = a.timestamp?.seconds ? a.timestamp.seconds : a.timestamp || 0;
        const timeB = b.timestamp?.seconds ? b.timestamp.seconds : b.timestamp || 0;
        return timeB - timeA;
      });
      setLogs(list);
      console.log('Logs carregados:', list);
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    }
  };

  useEffect(() => {
    fetchConvidados();
    fetchLogs();
  }, []);

  const convidadosFiltrados = convidados.filter(c =>
    c.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const confirmados = convidadosFiltrados.filter(c => c.comparecer === 'sim');
  const naoConfirmados = convidadosFiltrados.filter(c => c.comparecer === 'nao');

  // Função para formatar timestamp Firestore ou Date num string local BR
  function formatTimestamp(ts) {
    if (!ts) return '—';
    if (typeof ts === 'object' && ts !== null && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('pt-BR');
    }
    if (ts?.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString('pt-BR');
    }
    if (typeof ts === 'number') {
      return new Date(ts).toLocaleString('pt-BR');
    }
    const parsed = Date.parse(ts);
    if (!isNaN(parsed)) return new Date(parsed).toLocaleString('pt-BR');
    return String(ts);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Lista de Presenças</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={fetchConvidados}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Carregando...' : 'Recarregar lista'}
        </button>
      </div>

      {loading ? (
        <p className="text-center mt-10">Carregando convidados...</p>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Vai Comparecer ({confirmados.length})
            </h2>
            {confirmados.length === 0 ? (
              <p>Nenhum confirmado ainda.</p>
            ) : (
              <ul className="list-disc list-inside">
                {confirmados.map(({ id, nome, dataConfirmacao }) => (
                  <li key={id}>
                    {nome} — Confirmado em {formatTimestamp(dataConfirmacao)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Não Vai Comparecer ({naoConfirmados.length})
            </h2>
            {naoConfirmados.length === 0 ? (
              <p>Nenhum recusou ainda.</p>
            ) : (
              <ul className="list-disc list-inside">
                {naoConfirmados.map(({ id, nome, dataConfirmacao }) => (
                  <li key={id}>
                    {nome} — Respondido em {formatTimestamp(dataConfirmacao)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Logs de Acesso ({logs.length})
            </h2>
            {logs.length === 0 ? (
              <p>Nenhuma tentativa registrada.</p>
            ) : (
              <ul className="list-disc list-inside">
                {logs.map(log => (
                  <li key={log.id}>
                    [{formatTimestamp(log.timestamp)}] — {log.sucesso ? '✅' : '❌'} Tentativa de login
                    {log.ip && ` — IP: ${log.ip}`}
                    <br />
                    <small>Senha tentada: {log.senhaTentada ?? '—'}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
