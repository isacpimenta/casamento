import { ShoppingCart, Heart, Copy, CheckCircle, X, Gift, ExternalLink, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// --- SEUS DADOS (Edite aqui) ---
const chavePix = "d105ae1a-f575-4bbe-9b60-bc5a6d8d0530";
const enderecoEntrega = "Rua das Flores, 123, Bairro Jardim, Cidade - RJ, CEP 12345-000"; 

// Lista de produtos atualizada com a propriedade 'link'
const produtos = [
  { id: 1, nome: 'Batedeira Planetária', preco: '289,00', imagem: 'https://imgs.pontofrio.com.br/55048232/1g.jpg?imwidth=500', link: 'https://www.magazineluiza.com.br/busca/batedeira+planetaria/' },
  { id: 2, nome: 'Cafeteira Expresso', preco: '499,04', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/cafeteira-expresso-arno-nescafe-dolce-gusto-genio-s-basic-de-capsula-15-bar-branco/magazineluiza/023518000/d6012474990b9460535e79373a6fee62.jpg', link: 'https://www.magazineluiza.com.br/busca/cafeteira+expresso/' },
  { id: 3, nome: 'Jogo de Panelas', preco: '531,00', imagem: 'https://m.media-amazon.com/images/I/41eDru-nYHL._AC_SX679_.jpg', link: 'https://www.amazon.com.br/s?k=jogo+de+panelas' },
  { id: 4, nome: 'Liquidificador Turbo', preco: '131,91', imagem: 'https://m.media-amazon.com/images/I/51cWrgmxJmL._AC_SY300_SX300_QL70_ML2_.jpg', link: 'https://www.amazon.com.br/s?k=liquidificador' },
  { id: 5, nome: 'Torradeira Elétrica', preco: '99,00', imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_970967-MLA99550727340_122025-F.webp', link: 'https://lista.mercadolivre.com.br/torradeira-eletrica' },
  { id: 6, nome: 'Air Fryer 4L', preco: '249,00', imagem: 'https://m.magazineluiza.com.br/a-static/420x420/air-fryer-philco-paf40a-preta-4l/magazineluiza/240303200/17acf438db9a927eb79b3b0c3b0ae237.jpg', link: 'https://www.magazineluiza.com.br/busca/air+fryer/' },
];

function Presentes() {
  const navigate = useNavigate();
  
  // Estados
  const [modalPixAberto, setModalPixAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tipoPresente, setTipoPresente] = useState('pix'); // 'pix' ou 'compra'
  
  // Feedbacks visuais
  const [feedbackCopia, setFeedbackCopia] = useState(false);
  const [feedbackEndereco, setFeedbackEndereco] = useState(false);

  // --- Funções Auxiliares ---

  const abrirOpcaoPresentear = (produto) => {
    setProdutoSelecionado(produto);
    setTipoPresente('pix'); // Reseta a aba para Pix sempre que abrir
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
      
      {/* --- Cabeçalho --- */}
      <h1 className="font-great-vibes text-[var(--color-green3)] text-5xl mb-2 text-center drop-shadow-sm">
        Lista de Presentes
      </h1>
      <p className="text-center font-rubik text-gray-600 text-sm max-w-md mb-8 px-4">
        Sua presença é o maior presente! Caso queira nos mimar, escolha um item abaixo.
      </p>

      {/* --- Grid de Produtos --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {produtos.map((produto) => (
          <div key={produto.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-between h-full border border-transparent hover:border-green-100">
            
            {/* Imagem */}
            <div className="w-full h-32 flex items-center justify-center mb-3">
              <img 
                src={produto.imagem} 
                alt={produto.nome} 
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Info e Botão */}
            <div className="w-full flex flex-col items-center gap-2">
              <h3 className="font-rubik text-gray-700 text-sm font-medium text-center leading-tight">
                {produto.nome}
              </h3>
              
              <button 
                onClick={() => abrirOpcaoPresentear(produto)}
                className="w-full bg-[#8F9E78] hover:bg-[#7A8965] text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm group"
              >
                <Gift size={16} />
                <span className="font-rubik font-bold text-sm">Presentear</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Botão Voltar --- */}
      <button
        onClick={() => navigate("/")}
        className="mt-12 flex items-center gap-2 text-[var(--color-green3)] hover:text-[#6b7a55] font-rubik transition-colors"
      >
        <Heart size={18} />
        Voltar para o convite
      </button>

      {/* --- MODAL (Lightbox) --- */}
      {modalPixAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col items-center animate-[scaleUp_0.3s_ease-out]">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setModalPixAberto(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="font-great-vibes text-3xl text-[var(--color-green3)] mb-1">Muito Obrigado!</h2>
            <p className="text-gray-500 text-sm text-center mb-4 font-rubik">
              Você escolheu: <strong className="text-gray-800">{produtoSelecionado?.nome}</strong>
            </p>

            {/* --- SELETOR DE ABAS (Tabs) --- */}
            <div className="flex w-full bg-gray-100 p-1 rounded-lg mb-6 relative">
              <button 
                onClick={() => setTipoPresente('pix')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${tipoPresente === 'pix' ? 'bg-white text-[var(--color-green3)] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Enviar Valor (Pix)
              </button>
              <button 
                onClick={() => setTipoPresente('compra')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${tipoPresente === 'compra' ? 'bg-white text-[var(--color-green3)] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Comprar e Enviar
              </button>
            </div>

            {/* --- CONTEÚDO: OPÇÃO PIX --- */}
            {tipoPresente === 'pix' && (
              <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-4 w-full flex flex-col items-center">
                   <img src="/QR CODE.jpg" alt="QR Code Pix" className="w-40 h-40 object-contain mix-blend-darken" />
                   <p className="text-xs text-gray-400 mt-2 font-mono text-center">Valor sugerido: R$ {produtoSelecionado?.preco}</p>
                </div>
                
                <div className="w-full flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                  <span className="text-xs font-mono text-gray-600 truncate flex-1 select-all">{chavePix}</span>
                  <button onClick={copiarPix} className="bg-[var(--color-green3)] text-white p-2 rounded-md hover:bg-[#6b7a55] transition shrink-0" title="Copiar Chave">
                    {feedbackCopia ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                {feedbackCopia && <span className="text-xs text-green-600 mt-2 font-medium animate-pulse">Chave Pix copiada!</span>}
              </div>
            )}

            {/* --- CONTEÚDO: OPÇÃO COMPRAR --- */}
            {tipoPresente === 'compra' && (
              <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Para enviar o presente físico, utilize o endereço abaixo na hora da compra:
                </p>

                {/* Box do Endereço (Clicável para copiar) */}
                <div 
                  onClick={copiarEndereco}
                  className="w-full bg-orange-50 border border-orange-100 p-4 rounded-xl mb-4 relative group cursor-pointer hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-400 shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Endereço de Entrega</p>
                      <p className="text-sm text-gray-700 leading-relaxed font-rubik">{enderecoEntrega}</p>
                    </div>
                    <div className="text-orange-300 group-hover:text-orange-500 transition-colors">
                       {feedbackEndereco ? <CheckCircle size={16}/> : <Copy size={16} />}
                    </div>
                  </div>
                  {feedbackEndereco && <div className="absolute top-2 right-2 text-[10px] text-green-600 font-bold bg-white px-1 rounded">Copiado!</div>}
                </div>

                {/* Botão Link Externo */}
                <a 
                  href={produtoSelecionado?.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[var(--color-green3)] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#6b7a55] transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Ir para a Loja <ExternalLink size={18} />
                </a>
                <p className="text-[10px] text-gray-400 mt-3 text-center">Você será redirecionado para o site da loja.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- CSS In-JS para animações simples --- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default Presentes;