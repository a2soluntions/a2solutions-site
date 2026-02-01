'use client';
import React from 'react';
import { Shield, ArrowLeft, Lock, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <nav className="fixed w-full z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors text-sm font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </a>
            <span className="font-black text-xl tracking-tighter uppercase text-white">
              A2<span className="text-slate-500">Solutions</span>
            </span>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-[#0f172a] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div className="mb-10 text-center">
             <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
                <Shield className="w-8 h-8" />
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Política de Privacidade</h1>
             <p className="text-slate-500 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-slate-400">
            
            <section>
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-500"/> 1. Introdução</h2>
              <p>
                A <strong>A2Solutions</strong> leva a sua privacidade a sério. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso site e serviços, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">2. Coleta de Dados</h2>
              <p>Atualmente, nosso site funciona principalmente como um portfólio e vitrine de produtos. Coletamos o mínimo de dados possível:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Dados de Navegação:</strong> Informações anônimas sobre como você interage com o site (cookies).</li>
                <li><strong>Dados de Contato:</strong> Ao clicar nos botões de compra, você é redirecionado ao WhatsApp. Não armazenamos seu número em nosso banco de dados automaticamente, a menos que você feche negócio conosco.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">3. Uso das Informações</h2>
              <p>Utilizamos os dados apenas para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Melhorar a performance e segurança do site.</li>
                <li>Responder a solicitações de orçamento e suporte técnico.</li>
                <li>Cumprir obrigações legais.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">4. Cookies</h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento do site. Você pode gerenciar as preferências de cookies diretamente nas configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3">5. Seus Direitos (LGPD)</h2>
              <p>Você tem direito a:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Confirmar a existência de tratamento de dados.</li>
                <li>Acessar seus dados.</li>
                <li>Corrigir dados incompletos ou desatualizados.</li>
                <li>Solicitar a exclusão de seus dados pessoais de nossos registros (caso existam).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-500"/> 6. Contato</h2>
              <p>
                Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato conosco:
              </p>
              <p className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 font-bold text-white">
                 E-mail: contato@a2solutions.com.br <br/>
                 WhatsApp: (34) 99840-8962
              </p>
            </section>

          </div>
        </div>
      </div>

    </div>
  );
}