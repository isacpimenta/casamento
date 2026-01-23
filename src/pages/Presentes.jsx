import { ShoppingCart, Heart, Copy, CheckCircle, X, Gift, ExternalLink, MapPin, MessageCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Firebase imports
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

// --- CONFIGURAÇÕES ---
const chavePix = "d105ae1a-f575-4bbe-9b60-bc5a6d8d0530";
const telefoneDono = "5521966630496";
const enderecoEntrega = "Rua Topázios, S/N, Vila Sarapuí, Duque de Caxias - RJ, CEP 25050-007"; 

const produtos = [
  { id: 1, nome: 'Mesa de jantar Vezzo', preco: '1.699,00', imagem: 'https://api.vezzomoveis.com.br/wp-content/uploads/2025/08/1756152685314-8608bda9-9255-4ede-a166-d78709545e6e.jpg', link: 'https://vezzomoveis.com.br/p/mesa-de-jantar-pedro-120x80cm-com-4-cadeiras-2' },
  { id: 2, nome: 'Batedeira Brastemp ou Electrolux', preco: '589,99', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_729765-MLB93922643864_102025-F-batedeira-planetaria-electrolux-750w-cinza-inox-5l-ekm40.webp', link: 'https://produto.mercadolivre.com.br/MLB-3420538594-batedeira-planetaria-electrolux-750w-cinza-inox-5l-ekm40-_JM' },
  { id: 3, nome: 'Aparelho de jantar Oxford (Samambaia)', preco: '569,90', imagem: 'https://m.media-amazon.com/images/I/41qyU2HAEyL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Aparelho-Jantar-pe%C3%A7as-Flat-Samambaia/dp/B0CJFZJ14T?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A3KG85QHM2TXT8' },
  { id: 4, nome: 'Smart TV Samsung 50"', preco: '2.649,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_914360-MLA95971415370_102025-F.webp', link: 'https://www.mercadolivre.com.br/samsung-vision-ai-tv-50-qled-ultra-4k-q7f-2025/p/MLB48954926' },
  { id: 5, nome: 'Micro-ondas Brastemp ou Electrolux', preco: '770,50', imagem: 'https://m.media-amazon.com/images/I/51jWG1vyGyL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Micro-Ondas-Electrolux-Prata-Painel-Integrado/dp/B076XCSJ4Q?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=A1ZZFT5FULY4LN&th=1' },
  { id: 6, nome: 'Airfryer Brastemp ou Electrolux', preco: '599,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_912987-MLB93641988552_102025-F-fritadeira-eletrica-air-fryer-oven-electrolux-12l-eaf85.webp', link: 'https://produto.mercadolivre.com.br/MLB-5577509276-fritadeira-eletrica-air-fryer-oven-electrolux-12l-eaf85-_JM' },
  { id: 7, nome: 'Panela de pressão elétrica', preco: '562,32', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_704890-MLB73089588811_112023-F-panela-eletrica-de-presso-electrolux-multifuncional-em-inox.webp', link: 'https://produto.mercadolivre.com.br/MLB-2667363292-panela-eletrica-de-presso-electrolux-multifuncional-em-inox-_JM' },
  { id: 8, nome: 'Conjunto de panelas inox premium', preco: '775,90', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/jogo-de-panelas-tramontina-inox-10-pecas-allegra/magazineluiza/235025200/9c5d18cc48226057abb74715f7b94362.jpg', link: 'https://www.magazineluiza.com.br/jogo-de-panelas-tramontina-inox-10-pecas-allegra/p/235025200/ud/cjpn/' },
  { id: 9, nome: 'Máquina de lavar 15kg (Inox)', preco: '1.899,00', imagem: 'https://m.media-amazon.com/images/I/41pS08Q7EoL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Lavadora-Electrolux-LED15-Essential-Filter/dp/B09B8W3KQP?th=1' },
  { id: 10, nome: 'Cama e Colchão Queen Size', preco: '1.899,99', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/cama-box-queen-box-colchao-ortobom-de-mola/magazineluiza/229910300/9a23e8427f7c7744f9f070a0a0adacb2.jpg', link: 'https://www.magazineluiza.com.br/cama-box-queen-box-colchao-ortobom-de-mola/p/229910300/co/cmbx/' },
  { id: 11, nome: 'Geladeira Brastemp', preco: '2.749,30', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/geladeira-brastemp-frost-free-duplex-375l-branco-com-compartimento-extrafrio-fresh-zone-brm44hb/magazineluiza/013085501/bb29edd5ceef484b6b327ea331f3ad57.jpg', link: 'https://www.magazineluiza.com.br/geladeira-brastemp-frost-free-duplex-375l-branco-com-compartimento-extrafrio-fresh-zone-brm44hb/p/013085501/ed/ref2/' },
  { id: 12, nome: 'Guarda-roupas Vezzo', preco: '2.087,10', imagem: 'https://api.vezzomoveis.com.br/wp-content/uploads/2025/04/0001-4865-4-1.jpg', link: 'https://vezzomoveis.com.br/p/guarda-roupa-3-portas-tucson-cinamomo-off-white-200x218' },
  { id: 13, nome: 'Jogo de sofás Vezzo', preco: '2.699,00', imagem: 'https://api.vezzomoveis.com.br/wp-content/uploads/2025/04/generated-image-1761241704382.jpg', link: 'https://vezzomoveis.com.br/p/conjunto-de-sofa-2-3-lugares-le-mans-cinza' },
  { id: 14, nome: 'Ar-condicionado Samsung', preco: '2.417,41', imagem: 'https://m.media-amazon.com/images/I/61SqDV4ba2L._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Condicionado-Samsung-WindFree-Inverter-12-000/dp/B0DSLQP69S' },
  { id: 15, nome: 'Fogão inox Brastemp ou Electrolux', preco: '1.880,00', imagem: 'https://imgs.pontofrio.com.br/12731636/1xg.jpg?imwidth=500', link: 'https://www.pontofrio.com.br/fogao-brastemp-5-bocas-bfs5ncr-com-mesa-de-inox-botoes-removiveis-e-exclusivo-aro-protetor-bivolt-inox/p/12731636' },
  { id: 16, nome: 'Lava-louças Brastemp ou Electrolux', preco: '1.842,03', imagem: 'https://m.media-amazon.com/images/I/41yb7JiKeVL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/Lava-Lou-Servi-Brastemp-BLF08BS/dp/B0BTFCXSMS' },
  { id: 17, nome: 'Aspirador robô Samsung ou Xiaomi', preco: '2.349,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_699121-MLA99439268056_112025-F.webp', link: 'https://www.mercadolivre.com.br/aspirador-de-po-rob-xiaomi-x10-bhr6068eu-branco/p/MLB39142701' },
  { id: 18, nome: 'Home Theater ou Soundbar Samsung', preco: '920,90', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_936543-MLA99989050845_112025-F.webp', link: 'https://www.mercadolivre.com.br/caixa-de-som-tv-sound-bar-jbl-bluetooth-som-cinema-sb180-cor-preto-frequncia-5060hz/p/MLB34289961' },
  { id: 19, nome: 'Rack para TV', preco: '374,60', imagem: 'https://imgs.casasbahia.com.br/1526900438/1xg.jpg?imwidth=500', link: 'https://www.casasbahia.com.br/rack-retro-madesa-reims-para-tv-ate-75-polegadas-pes-de-madeira-branco/p/1526900438' },
  { id: 20, nome: 'Ventilador de coluna Arno', preco: '319,98', imagem: 'https://carrefourbr.vtexassets.com/arquivos/ids/186811503/ventilador-de-coluna-arno-x-treme-7-ve7c-40cm-7-pas-3-velocidades-preto-127v-1.jpg?v=638774706077200000', link: 'https://www.carrefour.com.br/ventilador-de-coluna-arno-xtreme-7-ve7c-40cm-7-pas-3-velocidades-preto-127v-3507998/p' },
  { id: 21, nome: 'Processador de alimentos multifuncional', preco: '236,90', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/multi-processador-philco-1000w-preto-concept-pmp11a-5-em-1-101201031/magazineluiza/240328100/3ed991e9b7d0b9af5a974006ecb48d7f.jpg', link: 'https://www.magazineluiza.com.br/multi-processador-philco-1000w-preto-concept-pmp11a-5-em-1-101201031/p/240328100/ep/prsa/' },
  { id: 22, nome: 'Churrasqueira elétrica', preco: '251,90', imagem: 'https://a-static.mlcdn.com.br/420x420/churrasqueira-eletrica-philco-pcq1500d-com-grelha/magazineluiza/020908800/6c31e419e970b91cb537c6f0e9d4d829.jpg', link: 'https://www.magazineluiza.com.br/churrasqueira-eletrica-philco-pcq1500d-com-grelha/p/020908800/fj/chua/' },
  { id: 23, nome: 'Cota Lua de Mel - R$ 2.000', preco: '2.000,00', imagem: '/ouro.png', cota: true },
  { id: 24, nome: 'Cota Lua de Mel - R$ 1.500', preco: '1.500,00', imagem: '/prata.png', cota: true },
  { id: 25, nome: 'Cota Lua de Mel - R$ 1.000', preco: '1.000,00', imagem: '/bronze.png', cota: true },
  { id: 26, nome: 'Cota Lua de Mel - R$ 500', preco: '500,00', imagem: '/apoio.png', cota: true },
  { id: 27, nome: 'Alexa Echo Dot (5ª geração)', preco: '429,01', imagem: 'https://m.media-amazon.com/images/I/61evEYmxBZL._AC_SX569_.jpg', link: 'https://www.amazon.com.br/Echo-Dot-5%C2%AA-gera%C3%A7%C3%A3o-Cor-Preta/dp/B09B8VGCR8?th=1' },
];

function Presentes() {
  const navigate = useNavigate();
  
  const [modalPixAberto, setModalPixAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tipoPresente, setTipoPresente] = useState('pix');
  const [nomeConvidado, setNomeConvidado] = useState('');
  
  const [feedbackCopia, setFeedbackCopia] = useState(false);
  const [feedbackEndereco, setFeedbackEndereco] = useState(false);
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

  const handleConfirmarPresente = async (metodo) => {
    if (!nomeConvidado.trim()) {
      alert("Por favor, digite seu nome! ❤️");
      return;
    }

    // 1. Prepara a URL antes de qualquer await (Crítico para iOS)
    const saudacao = "Olá Matheus e Débora!";
    const baseMsg = `${saudacao}\n\n` +
                    `🎁 *Presente:* ${produtoSelecionado.nome}\n` +
                    `💰 *Valor:* R$ ${produtoSelecionado.preco}\n` +
                    `👤 *Convidado:* ${nomeConvidado}\n` +
                    `📍 *Ação:* ${metodo}`;

    const mensagemFinal = produtoSelecionado.link 
      ? `${baseMsg}\n\n🔗 *Link do Produto:* ${produtoSelecionado.link}`
      : baseMsg;

    const urlZap = `https://api.whatsapp.com/send?phone=${telefoneDono}&text=${encodeURIComponent(mensagemFinal)}`;

    try {
      // 2. Bloqueia o item no Firebase (Apenas se não for cota)
      if (!produtoSelecionado.cota) {
        await setDoc(doc(db, "presentes", String(produtoSelecionado.id)), {
          comprador: nomeConvidado,
          produto: produtoSelecionado.nome,
          metodo: metodo,
          data: new Date()
        });
      }

      // 3. Redirecionamento compatível com Safari/iOS
      window.location.href = urlZap;

      setModalPixAberto(false);
      setNomeConvidado('');

    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar reserva.");
    }
  };

  const abrirOpcaoPresentear = (produto) => {
    setProdutoSelecionado(produto);
    // Se for cota, forçamos o estado para 'pix' para esconder a aba de reserva
    setTipoPresente('pix');
    setModalPixAberto(true);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setFeedbackCopia(true);
    setTimeout(() => setFeedbackCopia(false), 2500);
  };

  const copiarEndereco = () => {
    navigator.clipboard.writeText(enderecoEntrega);
    setFeedbackEndereco(true);
    setTimeout(() => setFeedbackEndereco(false), 2500);
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
                  <button onClick={() => abrirOpcaoPresentear(produto)} className="w-full bg-[#8F9E78] hover:bg-[#7A8965] text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm font-bold text-sm">
                    <Gift size={16} /> Presentear
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => navigate("/")} className="mt-12 flex items-center gap-2 text-[var(--color-green3)] hover:text-[#6b7a55] font-rubik transition-colors">
        <Heart size={18} /> Voltar para o convite
      </button>

      {/* --- MODAL --- */}
      {modalPixAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col items-center animate-[scaleUp_0.3s_ease-out]">
            
            <button onClick={() => setModalPixAberto(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full">
              <X size={20} />
            </button>

            <h2 className="font-great-vibes text-3xl text-[var(--color-green3)] mb-1 text-center">Como presentear?</h2>
            <p className="text-gray-500 text-sm text-center mb-4 font-rubik leading-tight">
              Item: <strong className="text-gray-800">{produtoSelecionado?.nome}</strong>
            </p>

            <div className="w-full mb-4">
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block px-1">Seu Nome:</label>
              <input 
                type="text" 
                value={nomeConvidado}
                onChange={(e) => setNomeConvidado(e.target.value)}
                placeholder="Ex: João e Maria"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-green3)]"
              />
            </div>

            {/* SELETOR DE ABAS: Oculto se for COTA */}
            {!produtoSelecionado?.cota && (
              <div className="flex w-full bg-gray-100 p-1 rounded-lg mb-6">
                <button 
                  onClick={() => setTipoPresente('reservar')} 
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${tipoPresente === 'reservar' ? 'bg-white text-[var(--color-green3)] shadow-sm' : 'text-gray-400'}`}
                >
                  RESERVAR ITEM
                </button>
                <button 
                  onClick={() => setTipoPresente('pix')} 
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${tipoPresente !== 'reservar' ? 'bg-white text-[var(--color-green3)] shadow-sm' : 'text-gray-400'}`}
                >
                  COMPRAR AGORA
                </button>
              </div>
            )}

            {/* CONTEÚDO RESERVAR (Apenas produtos normais) */}
            {!produtoSelecionado?.cota && tipoPresente === 'reservar' && (
              <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-xs text-gray-500 text-center mb-6 px-2">
                  Escolha esta opção se for comprar em uma loja física depois. O item será bloqueado na lista agora.
                </p>
                <button onClick={() => handleConfirmarPresente("Reserva para compra física")} className="w-full bg-[#8F9E78] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                  <Lock size={18} /> Confirmar Reserva e Avisar
                </button>
              </div>
            )}

            {/* CONTEÚDO COMPRAR AGORA / PIX (Para todos, mas com sub-abas apenas para produtos normais) */}
            {(produtoSelecionado?.cota || tipoPresente !== 'reservar') && (
              <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                
                {/* SUB-ABAS: Ocultas se for COTA */}
                {!produtoSelecionado?.cota && (
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setTipoPresente('pix')} className={`flex-1 py-2 text-[10px] font-bold border rounded-lg transition-all ${tipoPresente === 'pix' ? 'border-[var(--color-green3)] bg-green-50 text-[var(--color-green3)]' : 'border-gray-200 text-gray-400'}`}>
                      VIA PIX
                    </button>
                    <button onClick={() => setTipoPresente('compra')} className={`flex-1 py-2 text-[10px] font-bold border rounded-lg transition-all ${tipoPresente === 'compra' ? 'border-[var(--color-green3)] bg-green-50 text-[var(--color-green3)]' : 'border-gray-200 text-gray-400'}`}>
                      IR AO SITE
                    </button>
                  </div>
                )}

                {/* VISÃO PIX */}
                {(tipoPresente === 'pix' || produtoSelecionado?.cota) && (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 mb-3 w-full flex flex-col items-center">
                      <img src="/QR CODE.jpg" alt="QR Code" className="w-32 h-32 object-contain" />
                      <p className="text-[10px] text-gray-400 mt-1 font-mono">Valor: R$ {produtoSelecionado?.preco}</p>
                    </div>
                    <div className="w-full flex items-center gap-2 bg-gray-100 p-2 rounded-lg mb-4 border border-gray-200">
                      <span className="text-[10px] font-mono text-gray-600 truncate flex-1">{chavePix}</span>
                      <button onClick={copiarPix} className="bg-[var(--color-green3)] text-white p-1.5 rounded-md">
                        {feedbackCopia ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <button onClick={() => handleConfirmarPresente("Contribuição via Pix")} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                      <MessageCircle size={18} /> Confirmar e Avisar
                    </button>
                  </div>
                )}

                {/* VISÃO IR AO SITE (Apenas produtos normais) */}
                {!produtoSelecionado?.cota && tipoPresente === 'compra' && (
                  <div className="flex flex-col items-center">
                    <div onClick={copiarEndereco} className="w-full bg-orange-50 border border-orange-100 p-3 rounded-xl mb-4 cursor-pointer hover:bg-orange-100 transition-all">
                      <div className="flex items-start gap-2">
                        <MapPin className="text-orange-400 shrink-0 mt-1" size={16} />
                        <div className="flex-1">
                          <p className="text-[9px] text-orange-400 font-bold uppercase">Endereço de Entrega (Copiar)</p>
                          <p className="text-[11px] text-gray-700 leading-tight">{enderecoEntrega}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mb-4">Bloquearemos o item e enviaremos o link do produto para o seu WhatsApp!</p>
                    <button onClick={() => handleConfirmarPresente("Compra em Loja Externa")} className="w-full bg-[var(--color-green3)] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                      <MessageCircle size={18} /> Confirmar e Receber Link
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default Presentes;