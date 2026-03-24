import { Heart, CheckCircle, X, Gift, MessageCircle, Lock, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Firebase imports
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

// --- CONFIGURAÇÕES ---
const chavePix = "matheusabreu021@gmail.com";
const telefones = {
  matheus: "5521968237181",
  debora: "5521974791293" // Verifique se este é o número correto da Débora
};

const produtos = [
  { id: 1, nome: 'Mesa de jantar', preco: '1.699,00', imagem: 'https://api.vezzomoveis.com.br/wp-content/uploads/2025/08/1756152685314-8608bda9-9255-4ede-a166-d78709545e6e.jpg', link: 'https://vezzomoveis.com.br/p/mesa-de-jantar-pedro-120x80cm-com-4-cadeiras-2' },
  { id: 2, nome: 'Batedeira', preco: '589,99', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_729765-MLB93922643864_102025-F-batedeira-planetaria-electrolux-750w-cinza-inox-5l-ekm40.webp', link: 'https://lista.mercadolivre.com.br/batedeira-planetaria-philco-oster-electrolux' },
  { id: 3, nome: 'Aparelho de jantar Oxford (Samambaia)', preco: '569,90', imagem: 'https://m.media-amazon.com/images/I/41qyU2HAEyL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Aparelho-Jantar-pe%C3%A7as-Flat-Samambaia/dp/B0CJFZJ14T' },
  { id: 4, nome: 'Smart TV 50"', preco: '2.649,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_914360-MLA95971415370_102025-F.webp', link: 'https://www.mercadolivre.com.br/samsung-vision-ai-tv-50-qled-ultra-4k-q7f-2025/p/MLB48954926' },
  { id: 5, nome: 'Micro-ondas', preco: '770,50', imagem: 'https://m.media-amazon.com/images/I/51jWG1vyGyL._AC_SX679_.jpg', link: 'https://lista.mercadolivre.com.br/micro-ondas-brastemp-electrolux-philco' },
  { id: 6, nome: 'Airfryer ', preco: '599,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_912987-MLB93641988552_102025-F-fritadeira-eletrica-air-fryer-oven-electrolux-12l-eaf85.webp', link: 'https://lista.mercadolivre.com.br/airfryer-philco-electrolux' },
  { id: 7, nome: 'Panela de pressão elétrica', preco: '562,32', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_704890-MLB73089588811_112023-F-panela-eletrica-de-presso-electrolux-multifuncional-em-inox.webp', link: 'https://lista.mercadolivre.com.br/panela-pressao-eletrica-philco-oster-electrolux' },
  { id: 8, nome: 'Conjunto de panelas (Inox)', preco: '775,90', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/jogo-de-panelas-tramontina-inox-10-pecas-allegra/magazineluiza/235025200/9c5d18cc48226057abb74715f7b94362.jpg', link: 'https://www.magazineluiza.com.br/jogo-de-panelas-tramontina-inox-10-pecas-allegra/p/235025200/ud/cjpn/' },
  { id: 9, nome: 'Máquina de lavar 15kg (Inox)', preco: '1.899,00', imagem: 'https://m.media-amazon.com/images/I/41pS08Q7EoL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Lavadora-Electrolux-LED15-Essential-Filter/dp/B09B8W3KQP' },
  { id: 10, nome: 'Cama e Colchão Queen Size', preco: '1.899,99', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/cama-box-queen-box-colchao-ortobom-de-mola/magazineluiza/229910300/9a23e8427f7c7744f9f070a0a0adacb2.jpg', link: 'https://www.magazineluiza.com.br/cama-box-queen-box-colchao-ortobom-de-mola/p/229910300/co/cmbx/' },
  { id: 11, nome: 'Geladeira', preco: '2.749,30', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/geladeira-brastemp-frost-free-duplex-375l-branco-com-compartimento-extrafrio-fresh-zone-brm44hb/magazineluiza/013085501/bb29edd5ceef484b6b327ea331f3ad57.jpg', link: 'https://www.magazineluiza.com.br/geladeira-brastemp-frost-free-duplex-375l-branco-com-compartimento-extrafrio-fresh-zone-brm44hb/p/013085501/ed/ref2/' },
  { id: 12, nome: 'Guarda-roupas de Casal', preco: '2.087,10', imagem: 'https://api.vezzomoveis.com.br/wp-content/uploads/2025/04/0001-4865-4-1.jpg', link: 'https://vezzomoveis.com.br/p/guarda-roupa-3-portas-tucson-cinamomo-off-white-200x218' },
  { id: 13, nome: 'Jogo de sofás', preco: '2.699,00', imagem: 'https://api.vezzomoveis.com.br/wp-content/uploads/2025/04/generated-image-1761241704382.jpg', link: 'https://vezzomoveis.com.br/p/conjunto-de-sofa-2-3-lugares-le-mans-cinza' },
  { id: 14, nome: 'Ar-condicionado', preco: '2.417,41', imagem: 'https://m.media-amazon.com/images/I/61SqDV4ba2L._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Condicionado-Samsung-WindFree-Inverter-12-000/dp/B0DSLQP69S' },
  { id: 15, nome: 'Fogão (Inox)', preco: '1.880,00', imagem: 'https://imgs.pontofrio.com.br/12731636/1xg.jpg?imwidth=500', link: 'https://www.pontofrio.com.br/fogao-brastemp-5-bocas-bfs5ncr-com-mesa-de-inox-botoes-removiveis-e-exclusivo-aro-protetor-bivolt-inox/p/12731636' },
  { id: 16, nome: 'Lava-louças', preco: '1.842,03', imagem: 'https://m.media-amazon.com/images/I/41yb7JiKeVL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Lava-Lou-Servi-Brastemp-BLF08BS/dp/B0BTFCXSMS' },
  { id: 17, nome: 'Aspirador robô', preco: '2.349,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_699121-MLA99439268056_112025-F.webp', link: 'https://www.mercadolivre.com.br/aspirador-de-po-rob-xiaomi-x10-bhr6068eu-branco/p/MLB39142701' },
  { id: 18, nome: 'Soundbar', preco: '920,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_936543-MLA99989050845_112025-F.webp', link: 'https://lista.mercadolivre.com.br/soundbar-samsung' },
  { id: 19, nome: 'Rack para TV', preco: '374,60', imagem: 'https://imgs.casasbahia.com.br/1526900438/1xg.jpg?imwidth=500', link: 'https://www.casasbahia.com.br/rack-retro-madesa-reims-para-tv-ate-75-polegadas-pes-de-madeira-branco/p/1526900438' },
  { id: 20, nome: 'Ventilador de coluna', preco: '319,98', imagem: 'https://carrefourbr.vtexassets.com/arquivos/ids/186811503/ventilador-de-coluna-arno-x-treme-7-ve7c-40cm-7-pas-3-velocidades-preto-127v-1.jpg?v=638774706077200000', link: 'https://www.carrefour.com.br/ventilador-de-coluna-arno-xtreme-7-ve7c-40cm-7-pas-3-velocidades-preto-127v-3507998/p' },
  { id: 21, nome: 'Mixer', preco: '236,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_748028-MLB107587273619_022026-F-mixer-philco-800w-3-em-1-turbo-com-processador-e-batedor.webp', link: 'https://lista.mercadolivre.com.br/mixer-philco-oster-electrolux' },
  { id: 22, nome: 'Churrasqueira elétrica', preco: '251,90', imagem: 'https://a-static.mlcdn.com.br/420x420/churrasqueira-eletrica-philco-pcq1500d-com-grelha/magazineluiza/020908800/6c31e419e970b91cb537c6f0e9d4d829.jpg', link: 'https://www.magazineluiza.com.br/churrasqueira-eletrica-philco-pcq1500d-com-grelha/p/020908800/fj/chua/' },
  { id: 23, nome: 'Alexa Echo Dot', preco: '429,01', imagem: 'https://m.media-amazon.com/images/I/61evEYmxBZL._AC_SX569_.jpg', link: 'https://www.amazon.com.br/Echo-Dot-5%C2%AA-gera%C3%A7%C3%A3o-Cor-Preta/dp/B09B8VGCR8' },
  { id: 24, nome: 'Torradeira', preco: '125,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_636264-MLA100008506009_122025-F.webp', link: 'https://lista.mercadolivre.com.br/torradeira-philco-oster-electrolux' },
  { id: 25, nome: 'Edredom Queen Size', preco: '120,00', imagem: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&auto=format&fit=crop', link: 'https://lista.mercadolivre.com.br/edredom-queen-size' },
  { id: 26, nome: 'Purificador de água', preco: '430,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_637245-MLA99954587293_112025-F.webp', link: 'https://www.mercadolivre.com.br/purificador-de-agua-philco-brancocinza-ppu11b/p/MLB36524375?pdp_filters=item_id:MLB5039404588#is_advertising=true&searchVariation=MLB36524375&backend_model=search-backend&position=6&search_layout=grid&type=pad&tracking_id=80b11ae3-3909-46cf-a4e5-48e984f4d743&ad_domain=VQCATCORE_LST&ad_position=6&ad_click_id=MWNlYTc4Y2MtNzZhZS00MjljLTk4MTQtYzU4MDdhYWExOTZl' },
  { id: 27, nome: 'Furadeira / Parafusadeira', preco: '160,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_889490-MLA99461631446_112025-F.webp', link: 'https://lista.mercadolivre.com.br/furadeira-parafusadeira' },
  { id: 28, nome: 'Varal + Cortina com black-out', preco: '320,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_652290-MLB77868683480_072024-F-cortina-blackout-100-280x230-corta-luz-sala-quarto.webp', link: 'https://lista.mercadolivre.com.br/cortina-blackout-com-varal' },
  { id: 29, nome: 'Tapete de sisal para sala', preco: '220,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_801743-MLA99978254855_112025-F.webp', link: 'https://lista.mercadolivre.com.br/tapete-sisal-sala' },
  { id: 30, nome: 'Armário de cozinha 2m x 1,40m', preco: '950,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_756815-MLB104143512703_012026-F.webp', link: 'https://lista.mercadolivre.com.br/armario-cozinha-2m' },
  { id: 31, nome: 'Cafeteira', preco: '190,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_802146-MLA100024540029_122025-F.webp', link: 'https://lista.mercadolivre.com.br/cafeteira-electrolux' },
  { id: 32, nome: 'Espelho orgânico corpo inteiro', preco: '380,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_936790-MLA96100703939_102025-F.webp', link: 'https://lista.mercadolivre.com.br/espelho-organico-corpo-inteiro' },
  { id: 33, nome: 'Climatizador 16 litros', preco: '448,32', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_843341-MLA99946710327_112025-F.webp', link: 'https://lista.mercadolivre.com.br/climatizador-16-litros' },
  { id: 34, nome: 'Kit 2 mesas de cabeceira com gaveta', preco: '380,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_951710-MLA99535765652_122025-F.webp', link: 'https://lista.mercadolivre.com.br/kit-mesa-de-cabeceira-gaveta' },
  { id: 35, nome: 'Mesa de escrivaninha com cadeira', preco: '600,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_652711-MLA99939260445_112025-F.webp', link: 'https://lista.mercadolivre.com.br/escrivaninha-com-gaveta' },
  { id: 36, nome: 'Cota Lua de Mel - R$ 2.000', preco: '2.000,00', imagem: '/ouro.png', cota: true },
  { id: 37, nome: 'Cota Lua de Mel - R$ 1.500', preco: '1.500,00', imagem: '/prata.png', cota: true },
  { id: 38, nome: 'Cota Lua de Mel - R$ 1.000', preco: '1.000,00', imagem: '/bronze.png', cota: true },
  { id: 39, nome: 'Cota Lua de Mel - R$ 500', preco: '500,00', imagem: '/apoio.png', cota: true },
];

function Presentes() {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [feedbackCopia, setFeedbackCopia] = useState(false);
  const [presentesStatus, setPresentesStatus] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "presentes"), (snapshot) => {
      const mapStatus = {};
      snapshot.forEach((doc) => {
        mapStatus[doc.id] = doc.data().comprador;
      });
      setPresentesStatus(mapStatus);
    });
    return () => unsub();
  }, []);

const handleConfirmar = async (metodo, destinatario) => {
    if (!nomeConvidado.trim()) {
      alert("Por favor, digite seu nome! ❤️");
      return;
    }

    const telefone = telefones[destinatario];
    const saudacao = destinatario === 'matheus' ? "Olá Matheus!" : "Olá Débora!";

    const baseMsg = `${saudacao}\n\n` +
                    `🎁 *Presente:* ${produtoSelecionado.nome}\n` +
                    `💰 *Valor:* R$ ${produtoSelecionado.preco}\n` +
                    `👤 *Convidado:* ${nomeConvidado}\n` +
                    `📍 *Ação:* ${metodo}`;

    const mensagemFinal = produtoSelecionado.link 
      ? `${baseMsg}\n\n🔗 *Sugestão de Link:* ${produtoSelecionado.link}`
      : baseMsg;

    const urlZap = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagemFinal)}`;

    try {
      // CORREÇÃO AQUI: Removido o doc() duplicado e adicionada verificação
      if (produtoSelecionado && !produtoSelecionado.cota) {
        await setDoc(doc(db, "presentes", String(produtoSelecionado.id)), {
          comprador: nomeConvidado,
          produto: produtoSelecionado.nome,
          metodo: metodo,
          data: new Date()
        });
      }
      
      // Abre o WhatsApp
      window.open(urlZap, '_blank'); 
      
      // Limpa os estados e fecha o modal
      setModalAberto(false);
      setNomeConvidado('');
    } catch (error) {
      console.error("Erro detalhado do Firebase:", error);
      alert("Erro ao confirmar. Verifique sua conexão ou as permissões do banco.");
    }
  };

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setFeedbackCopia(true);
    setTimeout(() => setFeedbackCopia(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] flex flex-col items-center py-10 px-4">
      <h1 className="font-great-vibes text-[var(--color-green3)] text-5xl mb-2 text-center drop-shadow-sm">
        Lista de Presentes
      </h1>
      <p className="text-center font-rubik text-gray-600 text-sm max-w-md mb-8 px-4">
        Sua presença é o maior presente! Caso queira nos mimar, escolha um item abaixo.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {produtos.map((produto) => {
          const ganhador = !produto.cota && presentesStatus[produto.id];

          return (
            <div key={produto.id} className={`bg-white rounded-xl p-4 shadow-sm transition-all flex flex-col items-center justify-between h-full ${ganhador ? 'opacity-70 bg-gray-50' : 'hover:border-green-100 hover:shadow-md'}`}>
              <div className="w-full h-32 flex items-center justify-center mb-3 relative">
                <img src={produto.imagem} alt={produto.nome} className={`max-h-full max-w-full object-contain mix-blend-multiply ${ganhador ? 'grayscale' : ''}`} />
                {ganhador && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 p-2 rounded-full shadow-sm">
                      <Lock size={20} className="text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col items-center gap-2">
                <h3 className="font-rubik text-gray-700 text-sm font-medium text-center leading-tight">
                  {produto.nome}
                </h3>
                
                {ganhador ? (
                  <div className="w-full bg-green-50 border border-green-100 text-green-700 py-2 px-1 rounded-lg flex items-center justify-center gap-1">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="font-rubik font-bold text-[10px] uppercase truncate">
                      Reservado por: {ganhador}
                    </span>
                  </div>
                ) : (
                  <button onClick={() => abrirModal(produto)} className="w-full bg-[#8F9E78] hover:bg-[#7A8965] text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm font-bold text-sm">
                    <Gift size={16} /> Presentear
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center bg-gradient-to-t from-[#F0F7F4] via-[#F0F7F4]/90 to-transparent z-40 pointer-events-none">
        <button 
          onClick={() => navigate("/")} 
          className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-[var(--color-green3)]/20 text-[var(--color-green3)] hover:bg-[var(--color-green3)] hover:text-white font-rubik font-bold transition-all duration-300 active:scale-95"
        >
          <Heart size={18} className="animate-pulse" />
          Voltar para o convite
        </button>
      </div>

      <div className="h-20" />

      {/* Modal Mobile com Opções de WhatsApp */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Confirmar Presente</h2>
                <p className="text-sm text-slate-400">Para quem você quer avisar?</p>
              </div>
              <button onClick={() => setModalAberto(false)} className="bg-slate-50 p-2 rounded-full text-slate-400"><X size={20}/></button>
            </div>

            <div className="bg-green1/5 border border-green1/10 rounded-2xl p-4 mb-6">
              <p className="text-green3 font-semibold text-sm leading-tight">{produtoSelecionado?.nome}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Seu nome ou apelido</label>
                <input 
                  type="text" 
                  placeholder="Ex: Tio João, Amiga da Faculdade..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-green1 focus:bg-white rounded-xl p-4 outline-none transition-all mt-1"
                  value={nomeConvidado}
                  onChange={(e) => setNomeConvidado(e.target.value)}
                />
              </div>

              {produtoSelecionado?.cota && (
                <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 flex items-center justify-between mb-2">
                   <div className="overflow-hidden">
                    <p className="text-[9px] uppercase text-slate-400 font-bold">Chave PIX (E-mail)</p>
                    <p className="text-xs font-mono text-slate-600 truncate">{chavePix}</p>
                   </div>
                   <button 
                    onClick={() => { navigator.clipboard.writeText(chavePix); alert("Chave PIX copiada!"); }}
                    className="text-green3 p-2 hover:bg-green1/10 rounded-lg transition-colors"
                   >
                    <Copy size={20} />
                   </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleConfirmar(produtoSelecionado.cota ? "Cota via PIX" : "Reserva de item", "debora")}
                  className="flex flex-col items-center gap-2 bg-green3 text-white py-4 rounded-2xl font-bold hover:bg-green2 transition-all shadow-md shadow-green3/20"
                >
                  <MessageCircle size={22} />
                  <span className="text-sm">Avisar Débora</span>
                </button>

                <button 
                  onClick={() => handleConfirmar(produtoSelecionado.cota ? "Cota via PIX" : "Reserva de item", "matheus")}
                  className="flex flex-col items-center gap-2 bg-green3 text-white py-4 rounded-2xl font-bold hover:bg-green2 transition-all shadow-md shadow-green3/20"
                >
                  <MessageCircle size={22} />
                  <span className="text-sm">Avisar Matheus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default Presentes;