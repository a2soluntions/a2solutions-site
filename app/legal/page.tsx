'use client';
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, FileText, Clock, Calendar, Check, X, Monitor, Cloud } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto space-y-12 py-12">
        
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para Loja
        </a>

        <header className="space-y-4">
          <h1 className="text-4xl font-black text-white">Central Legal & Ajuda</h1>
          <p className="text-slate-500">Transparência total sobre nossos produtos e serviços.</p>
        </header>

        {/* --- TERMOS DE USO (ATUALIZADO: HÍBRIDO) --- */}
        <section id="termos" className="space-y-6 border-b border-white/5 pb-12">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <FileText className="text-indigo-500"/> <h2>Termos de Uso e Licenciamento</h2>
          </div>
          
          <div className="prose prose-invert prose-sm text-slate-400 space-y-4">
            <p>Ao adquirir qualquer solução da A2Solutions, você concorda com os termos abaixo, que variam de acordo com o tipo de produto:</p>
            
            {/* Bloco Desktop */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2 mb-2"><Monitor className="w-4 h-4 text-emerald-500"/> 1. Softwares Desktop (Offline / Vitalício)</h3>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Licença:</strong> A compra concede uma licença de uso vitalícia para instalação em 1 (um) computador. O software é seu para sempre na versão adquirida.</li>
                    <li><strong>Dados:</strong> O funcionamento é 100% offline. Seus dados ficam salvos localmente no seu PC. É responsabilidade do usuário fazer backups.</li>
                    <li><strong>Atualizações:</strong> Correções de bugs críticas são gratuitas. Novas versões com funcionalidades extras podem ser cobradas à parte (opcional).</li>
                </ul>
            </div>

            {/* Bloco Web */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2 mb-2"><Cloud className="w-4 h-4 text-blue-500"/> 2. Sistemas Web (Online / Assinatura)</h3>
                <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Modelo de Assinatura:</strong> O acesso ao sistema é concedido enquanto a assinatura (mensal ou anual) estiver ativa e paga.</li>
                    <li><strong>Cancelamento:</strong> Você pode cancelar a qualquer momento. O acesso ao sistema permanecerá ativo até o fim do ciclo já pago. Após isso, o acesso é bloqueado.</li>
                    <li><strong>Dados na Nuvem:</strong> Seus dados são armazenados em nossos servidores seguros. Caso a assinatura seja cancelada por mais de 90 dias, os dados podem ser excluídos permanentemente para liberar espaço.</li>
                </ul>
            </div>

            <p><strong>3. Proibições:</strong> É estritamente proibida a revenda, engenharia reversa, modificação ou pirataria de qualquer código-fonte de propriedade da A2Solutions.</p>
            
            <p><strong>4. Reembolso e Garantia:</strong> Oferecemos 7 dias de garantia incondicional a partir da data da compra para desistência ou falhas técnicas não solucionáveis.</p>
          </div>
        </section>

        {/* POLÍTICA DE PRIVACIDADE & LGPD */}
        <section id="privacidade" className="space-y-4 border-b border-white/5 pb-12">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Lock className="text-emerald-500"/> <h2>Política de Privacidade e LGPD</h2>
          </div>
          <div className="prose prose-invert prose-sm text-slate-400">
            <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD):</p>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong>Coleta de Dados:</strong> Coletamos apenas Nome, Email e Telefone para gestão da sua licença ou assinatura.</li>
              <li><strong>Softwares Desktop:</strong> Nós NÃO temos acesso aos seus dados financeiros/empresariais lançados no sistema. Tudo fica no seu HD.</li>
              <li><strong>Sistemas Web:</strong> Seus dados são criptografados e armazenados em servidores seguros. A A2Solutions não compartilha essas informações com terceiros para fins publicitários.</li>
            </ul>
          </div>
        </section>

        {/* AJUDA E SUPORTE (COM AGENDAMENTO) */}
        <section id="ajuda" className="space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <ShieldCheck className="text-blue-500"/> <h2>Suporte Técnico</h2>
          </div>
          
          {/* Aviso de Agendamento */}
          <div className="bg-[#1e293b] border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"/>
            
            <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-indigo-400"/> Atendimento Agendado
            </h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Para garantir um atendimento de qualidade e dedicado a você, todo suporte técnico, dúvidas complexas ou auxílio na instalação <strong>deve ser agendado previamente</strong>.
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-500 bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500"/> Atendimento Humanizado</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500"/> Acesso Remoto (se necessário)</div>
                <div className="flex items-center gap-2"><X className="w-4 h-4 text-red-500"/> Não realizamos suporte imediato sem hora marcada</div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Precisa agendar um horário ou tirar uma dúvida comercial?</p>
            <a href="https://wa.me/553498408962" target="_blank" className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-900/20 w-full justify-center sm:w-auto">
                <Calendar className="w-4 h-4"/> Agendar Suporte no WhatsApp
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}