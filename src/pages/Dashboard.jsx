import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

function Dashboard() {
  const [convidados, setConvidados] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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
      list.sort((a, b) => {
        const timeA = a.timestamp?.seconds ? a.timestamp.seconds : a.timestamp || 0;
        const timeB = b.timestamp?.seconds ? b.timestamp.seconds : b.timestamp || 0;
        return timeB - timeA;
      });
      setLogs(list);
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Função para gerar PDF da lista confirmados
  const imprimirConfirmadosPDF = () => {
    if (confirmados.length === 0) {
      Swal.fire('Lista vazia', 'Não há convidados confirmados para imprimir.', 'info');
      return;
    }

    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Lista de Convidados Confirmados', 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    let y = 30;
    confirmados.forEach((c, i) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const dataConfirm = formatTimestamp(c.dataConfirmacao);
      doc.text(`${i + 1}. ${c.nome} (Confirmado em ${dataConfirm})`, 14, y);
      y += 10;
    });

    doc.save('confirmados.pdf');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-gray-800">
      <h1 className="text-5xl font-bold mb-10 text-center uppercase tracking-wide font-bebas">
        Lista de Presenças
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={fetchConvidados}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-700 hover:bg-green-800 transition'
          }`}
        >
          {loading ? 'Carregando...' : 'Recarregar lista'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Confirmados */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold text-green-700 border-b-4 border-green-600 pb-2 font-bebas">
              Vai Comparecer ({confirmados.length})
            </h2>
            <button
              onClick={imprimirConfirmadosPDF}
              className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded shadow font-semibold transition"
              title="Imprimir lista de confirmados"
            >
              Imprimir Confirmados
            </button>
          </div>
          {confirmados.length === 0 ? (
            <p className="italic text-green-600">Nenhum confirmado ainda.</p>
          ) : (
            <ul className="space-y-4 max-h-[28rem] overflow-y-auto pr-2">
              {confirmados.map(({ id, nome, dataConfirmacao }) => (
                <li
                  key={id}
                  className="cursor-pointer bg-green-50 rounded-lg shadow-sm p-4 transition hover:shadow-md hover:bg-green-100"
                  onClick={() => toggleExpand(id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-900">{nome}</span>
                    <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full select-none">
                      Confirmado
                    </span>
                  </div>
                  {expandedId === id && (
                    <p className="mt-2 text-sm text-green-700 italic">
                      (Confirmado em {formatTimestamp(dataConfirmacao)})
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Não Confirmados */}
        <section>
          <h2 className="text-3xl font-extrabold mb-6 text-red-700 border-b-4 border-red-600 pb-2 font-bebas">
            Não Vai Comparecer ({naoConfirmados.length})
          </h2>
          {naoConfirmados.length === 0 ? (
            <p className="italic text-red-600">Nenhum recusou ainda.</p>
          ) : (
            <ul className="space-y-4 max-h-[28rem] overflow-y-auto pr-2">
              {naoConfirmados.map(({ id, nome, dataConfirmacao }) => (
                <li
                  key={id}
                  className="cursor-pointer bg-red-50 rounded-lg shadow-sm p-4 transition hover:shadow-md hover:bg-red-100"
                  onClick={() => toggleExpand(id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-red-900">{nome}</span>
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full select-none">
                      Recusou
                    </span>
                  </div>
                  {expandedId === id && (
                    <p className="mt-2 text-sm text-red-700 italic">
                      (Respondido em {formatTimestamp(dataConfirmacao)})
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Logs */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-blue-700 border-b-2 border-blue-700 pb-1 font-bebas">
          Logs de Acesso ({logs.length})
        </h2>
        {logs.length === 0 ? (
          <p className="italic text-blue-600">Nenhuma tentativa registrada.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <li
                key={log.id}
                className={`p-4 rounded border ${
                  log.sucesso
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    {log.sucesso ? '✅ Sucesso' : '❌ Falha'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  {log.ip && (
                    <p>
                      <span className="font-semibold">IP: </span>
                      {log.ip}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Senha tentada: </span>
                    <span className="font-mono">{log.senhaTentada ?? '—'}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
