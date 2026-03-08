import { Heart, CheckCircle, X, Gift, MessageCircle, Lock, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Firebase imports
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

// --- CONFIGURAÇÕES ---
const chavePix = "matheusabreu021@gmail.com";
const telefoneDono = "5521968237181";

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

  const handleConfirmar = async (metodo) => {
    if (!nomeConvidado.trim()) {
      alert("Por favor, digite seu nome! ❤️");
      return;
    }

    const saudacao = "Olá Matheus e Débora!";
    const baseMsg = `${saudacao}\n\n` +
                    `🎁 *Presente:* ${produtoSelecionado.nome}\n` +
                    `💰 *Valor:* R$ ${produtoSelecionado.preco}\n` +
                    `👤 *Convidado:* ${nomeConvidado}\n` +
                    `📍 *Ação:* ${metodo}`;

    const mensagemFinal = produtoSelecionado.link 
      ? `${baseMsg}\n\n🔗 *Sugestão de Link:* ${produtoSelecionado.link}`
      : baseMsg;

    const urlZap = `https://api.whatsapp.com/send?phone=${telefoneDono}&text=${encodeURIComponent(mensagemFinal)}`;

    try {
      if (!produtoSelecionado.cota) {
        await setDoc(doc(db, "presentes", String(produtoSelecionado.id)), {
          comprador: nomeConvidado,
          produto: produtoSelecionado.nome,
          metodo: metodo,
          data: new Date()
        });
      }
      window.location.href = urlZap;
      setModalAberto(false);
      setNomeConvidado('');
    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar.");
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

      {/* Botão Fixo no Rodapé */}
      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center bg-gradient-to-t from-[#F0F7F4] via-[#F0F7F4]/90 to-transparent z-40 pointer-events-none">
        <button 
          onClick={() => navigate("/")} 
          className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-[var(--color-green3)]/20 text-[var(--color-green3)] hover:bg-[var(--color-green3)] hover:text-white font-rubik font-bold transition-all duration-300 active:scale-95"
        >
          <Heart size={18} className="animate-pulse" />
          Voltar para o convite
        </button>
      </div>

      {/* Spacer para o conteúdo não ficar escondido atrás do botão fixo */}
      <div className="h-20" />

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col items-center animate-[scaleUp_0.3s_ease-out]">
            
            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full">
              <X size={20} />
            </button>

            <h2 className="font-great-vibes text-3xl text-[var(--color-green3)] mb-1">Como presentear?</h2>
            <p className="text-gray-500 text-sm mb-4 font-rubik leading-tight">
              Item: <strong className="text-gray-800">{produtoSelecionado?.nome}</strong>
            </p>

            <div className="w-full mb-6">
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block px-1 text-left">Seu Nome:</label>
              <input 
                type="text" 
                value={nomeConvidado}
                onChange={(e) => setNomeConvidado(e.target.value)}
                placeholder="Ex: João e Maria"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[var(--color-green3)]"
              />
            </div>

            {/* SE FOR COTA LUA DE MEL */}
            {produtoSelecionado?.cota ? (
              <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 mb-3 flex flex-col items-center">
                  <img src="/QR CODE.jpeg" alt="QR Code" className="w-32 h-32 object-contain" />
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">Valor sugerido: R$ {produtoSelecionado?.preco}</p>
                </div>
                <div className="w-full flex items-center gap-2 bg-gray-100 p-2 rounded-lg mb-4 border border-gray-200">
                  <span className="text-[10px] font-mono text-gray-600 truncate flex-1">{chavePix}</span>
                  <button onClick={copiarPix} className="bg-[var(--color-green3)] text-white p-1.5 rounded-md">
                    {feedbackCopia ? <CheckCircle size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <button onClick={() => handleConfirmar("Contribuição via Pix")} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                  <MessageCircle size={18} /> Confirmar e Avisar no WhatsApp
                </button>
              </div>
            ) : (
              /* SE FOR PRODUTO FÍSICO */
              <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-green-50 p-4 rounded-xl mb-6">
                  <p className="text-xs text-green-800 font-rubik leading-relaxed">
                    Ao confirmar, o item será <strong>reservado</strong> na lista para você. Você poderá comprá-lo na loja que preferir.
                  </p>
                </div>
                <button onClick={() => handleConfirmar("Reserva para compra física")} className="w-full bg-[#8F9E78] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                  <Lock size={18} /> Reservar e Avisar no WhatsApp
                </button>
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