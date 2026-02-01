'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Download, Check, Zap, Monitor, Cloud, ShieldCheck, ArrowRight, Code, PlayCircle, X, MessageCircle, HelpCircle, Layers, Calendar, Clock, Lock, Loader2 } from 'lucide-react';

export default function StoreFront() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const WHATSAPP_NUMBER = "553498408962"; 

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'Lançado')
        .order('id', { ascending: false });
      
      if (!error && data) setProjects(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleBuy = async (project: any) => {
    // Se for ASSINATURA, usa o link direto colado no admin
    if (project.payment_type === 'subscription') {
        if (project.link_url) {
            window.open(project.link_url, '_blank');
        } else {
            alert('Link de assinatura indisponível no momento.');
        }
        return;
    }

    // Se for VITALÍCIO, usa automação
    try {
      setBuyingId(project.id);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          title: project.title,
          price: project.price,
          downloadUrl: project.download_url
        })
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else alert('Erro ao processar pagamento.');
    } catch (error) {
      alert('Erro de conexão.');
    } finally {
      setBuyingId(null);
    }
  };

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Code className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">A2<span className="text-indigo-500">Solutions</span></span>
          </div>
          <div className="flex gap-6 text-sm font-medium items-center">
             <a href="#produtos" className="hidden md:block hover:text-white transition-colors">Softwares</a>
             <a href="#dev" className="hidden md:block hover:text-white transition-colors text-indigo-400">Desenvolvimento</a>
             <a href="/admin" className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
               Login
             </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-indigo-600/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Layers className="w-3 h-3" /> Software House Especializada
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
            Tecnologia que move <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">o seu negócio.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desenvolvemos o ecossistema ideal para sua empresa. Escolha entre <strong>Aplicativos Desktop (Offline)</strong> sem mensalidade ou <strong>Sistemas Web (Nuvem)</strong> com acesso de qualquer lugar.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#produtos" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                Ver Catálogo <ArrowRight className="w-4 h-4"/>
            </a>
            <a href="#dev" className="px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-white border border-white/5 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2">
                Orçamento Personalizado
            </a>
          </div>
        </div>
      </header>

      {/* VITRINE DE PRODUTOS */}
      <section id="produtos" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
             <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Monitor className="text-indigo-500"/> Nossos Softwares</h2>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">Carregando catálogo...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-white/5"><p className="text-slate-400">Nenhum software publicado no momento.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((proj) => (
                <div key={proj.id} className="group bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
                  
                  {/* IMAGEM */}
                  <div className="relative aspect-square bg-black overflow-hidden cursor-pointer" onClick={() => setSelectedProject(proj)}>
                    {proj.image_url ? (
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1e293b] text-slate-600"><span className="text-xs font-bold uppercase">Sem Imagem</span></div>
                    )}
                    
                    {/* Badge de Categoria Dinâmico */}
                    <div className={`absolute top-4 left-4 px-3 py-1 backdrop-blur-md rounded-lg border text-[10px] font-bold uppercase flex items-center gap-1 ${
                        proj.payment_type === 'subscription' 
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' 
                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    }`}>
                        {proj.payment_type === 'subscription' ? <Cloud className="w-3 h-3"/> : <Monitor className="w-3 h-3"/>}
                        {proj.payment_type === 'subscription' ? 'Assinatura' : 'Vitalício'}
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span className="px-5 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs font-bold uppercase flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" /> Ver Detalhes
                        </span>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{proj.title}</h3>
                    </div>
                    
                    {/* Preço com Label */}
                    <div className="mb-4">
                        <span className="text-2xl font-black text-white">
                            {proj.price > 0 ? `R$ ${proj.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'GRÁTIS'}
                        </span>
                        <span className="text-xs text-slate-500 ml-2 font-bold uppercase">
                            {proj.payment_type === 'subscription' ? '/ Mês' : 'Pago 1x'}
                        </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">{proj.description || "Sem descrição."}</p>
                    
                    <button onClick={() => setSelectedProject(proj)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all mb-2">
                       Mais Informações
                    </button>
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium uppercase">
                        <Check className="w-3 h-3 text-emerald-500"/> 
                        {proj.payment_type === 'subscription' ? 'Acesso Imediato' : 'Download Imediato'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- SEÇÃO DE DESENVOLVIMENTO --- */}
      <section id="dev" className="py-20 px-6 bg-indigo-900/10 border-y border-indigo-500/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                    <Code className="w-3 h-3" /> Fábrica de Software
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white">Precisa de algo exclusivo? Nós criamos para você.</h2>
                <p className="text-slate-400 text-lg">
                    Além dos nossos produtos de prateleira, a A2Solutions desenvolve sistemas personalizados. Web Sites, Aplicativos Mobile, Dashboards Corporativos e Integrações.
                </p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-slate-300"><Check className="w-5 h-5 text-emerald-500"/> Levantamento de Requisitos</li>
                    <li className="flex items-center gap-2 text-slate-300"><Check className="w-5 h-5 text-emerald-500"/> Design UX/UI Moderno</li>
                    <li className="flex items-center gap-2 text-slate-300"><Check className="w-5 h-5 text-emerald-500"/> Entregas Ágeis</li>
                </ul>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Ola,%20gostaria%20de%20um%20orcamento%20de%20desenvolvimento.`} target="_blank" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 mt-4">
                    Solicitar Orçamento <MessageCircle className="w-4 h-4"/>
                </a>
            </div>
            <div className="flex-1 relative">
                {/* Visual Abstrato */}
                <div className="relative bg-[#020617] border border-white/10 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"/>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                        <div className="w-3 h-3 rounded-full bg-emerald-500"/>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                        <p className="text-indigo-400">const <span className="text-white">A2Solutions</span> = async () =&gt; {'{'}</p>
                        <p className="text-slate-500 pl-4">// Transformando ideias em código</p>
                        <p className="text-emerald-400 pl-4">await <span className="text-white">buildFuture</span>();</p>
                        <p className="text-white">{'}'}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-2">
                <h2 className="text-3xl font-black text-white">Dúvidas Frequentes</h2>
                <p className="text-slate-400">Entenda nossos modelos de negócio.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500"/> Tem mensalidade?</h3>
                    <p className="text-sm text-slate-400">Depende. Nossos <strong>Softwares Desktop</strong> são de pagamento único (Vitalício). Já os <strong>Sistemas Web</strong> funcionam por assinatura para manter os servidores ativos.</p>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500"/> Preciso de internet?</h3>
                    <p className="text-sm text-slate-400">Para os Aplicativos Desktop (Offline), não. Para os Sistemas Web, sim, pois seus dados ficam seguros na nuvem.</p>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Code className="w-4 h-4 text-blue-500"/> Vocês fazem sistemas personalizados?</h3>
                    <p className="text-sm text-slate-400">Sim! Temos uma equipe de desenvolvimento pronta para criar soluções sob medida para sua empresa. Entre em contato pelo WhatsApp.</p>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> O suporte está incluso?</h3>
                    <p className="text-sm text-slate-400">Sim! Oferecemos suporte para instalação e dúvidas. O atendimento é realizado via WhatsApp mediante <strong>agendamento prévio</strong>.</p>
                </div>
            </div>
        </div>
      </section>

      {/* MODAL DETALHES */}
      {selectedProject && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl relative flex flex-col md:flex-row">
                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 text-white hover:text-red-500 rounded-full z-20 transition-colors">
                    <X className="w-6 h-6"/>
                </button>
                <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative">
                     {selectedProject.video_url ? (
                        <iframe className="w-full h-64 md:h-full aspect-video" src={`https://www.youtube.com/embed/${getYoutubeId(selectedProject.video_url)}?autoplay=1`} title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                     ) : (
                        <img src={selectedProject.image_url} className="w-full h-full object-cover" />
                     )}
                </div>
                <div className="w-full md:w-2/5 p-8 flex flex-col bg-[#0f172a] overflow-y-auto custom-scrollbar">
                    <h2 className="text-3xl font-black text-white mb-2 leading-tight">{selectedProject.title}</h2>
                    <div className="flex gap-2 mb-6">
                        <span className={`px-3 py-1 border text-[10px] font-bold uppercase rounded-lg ${selectedProject.payment_type === 'subscription' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            {selectedProject.category}
                        </span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase rounded-lg">
                            {selectedProject.payment_type === 'subscription' ? 'Assinatura' : 'Vitalício'}
                        </span>
                    </div>
                    <div className="prose prose-invert prose-sm text-slate-300 mb-8 flex-1 whitespace-pre-line leading-relaxed">{selectedProject.description}</div>
                    <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                         <div className="flex justify-between items-end mb-2">
                            <span className="text-slate-400 text-sm">{selectedProject.payment_type === 'subscription' ? 'Valor Mensal' : 'Valor Único'}</span>
                            <span className="text-3xl font-black text-white">R$ {selectedProject.price.toFixed(2)}</span>
                         </div>
                         {selectedProject.price > 0 ? (
                            <button onClick={() => handleBuy(selectedProject)} disabled={buyingId === selectedProject.id} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                {buyingId === selectedProject.id ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShoppingCart className="w-5 h-5" />} 
                                {buyingId === selectedProject.id ? 'Processando...' : (selectedProject.payment_type === 'subscription' ? 'ASSINAR AGORA' : 'COMPRAR AGORA')}
                            </button>
                         ) : (
                            <a href={selectedProject.download_url} target="_blank" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" /> BAIXAR AGORA
                            </a>
                         )}
                         <p className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3"/> Garantia de 7 dias</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* WHATSAPP FLUTUANTE */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 transition-all hover:scale-110 hover:rotate-3" title="Fale conosco no WhatsApp">
        <MessageCircle className="w-7 h-7 text-white fill-current" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-[#020617]"></span>
      </a>

      {/* FOOTER */}
      <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Code className="text-white w-4 h-4" /></div>
                    <span className="font-bold text-white text-lg">A2Solutions</span>
                </div>
                <p className="text-slate-500 text-sm max-w-sm">Software House especializada em automação comercial e desenvolvimento web. Soluções desktop e nuvem para potencializar seu negócio.</p>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest opacity-70">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="/legal#termos" className="hover:text-indigo-400 transition-colors">Termos de Uso</a></li>
                    <li><a href="/legal#privacidade" className="hover:text-indigo-400 transition-colors">Política de Privacidade</a></li>
                    <li><a href="/legal#privacidade" className="hover:text-indigo-400 transition-colors">LGPD</a></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest opacity-70">Ajuda</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="/legal#ajuda" className="hover:text-indigo-400 transition-colors">Central de Ajuda</a></li>
                    <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="hover:text-indigo-400 transition-colors">Falar no WhatsApp</a></li>
                    <li><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20consultar%20meu%20pedido`} target="_blank" className="hover:text-indigo-400 transition-colors">Meus Pedidos</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-[10px] text-slate-600 uppercase tracking-wider">
            © 2026 A2Solutions. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
