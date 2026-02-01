'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';
import { 
  Check, AlertCircle, Lock, ArrowRight, X,
  FileText, Trash2, Edit3, LogOut,
  Package, Save, CreditCard, Copy, 
  Image as ImageIcon, ExternalLink, RefreshCw, ArrowLeft, AlertTriangle, Calendar, Link as LinkIcon
} from 'lucide-react';

export default function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  
  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dados
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [priceDisplay, setPriceDisplay] = useState('');

  // FORMULÁRIO COM TIPO DE PAGAMENTO
  const [form, setForm] = useState({
    title: '',
    category: 'Aplicativos',
    description: '',
    price: 0,
    status: 'Lançado',
    tags: '',
    image_url: '',
    product_file_url: '',
    payment_type: 'unique', // 'unique' ou 'subscription'
    link_url: '' // Usado apenas para assinaturas
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [zipping, setZipping] = useState(false);
  
  // UI
  const [toast, setToast] = useState({ show: false, type: 'success', text: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null as number | null });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProjects();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects();
    });
    return () => subscription.unsubscribe();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000); 
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (error) showToast('error', error.message);
    else setProjects(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginLoading(false);
    if (error) showToast('error', 'Login falhou.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numberValue = Number(rawValue) / 100;
    const formatted = numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    setPriceDisplay(formatted);
    setForm({ ...form, price: numberValue });
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    const initialPrice = project.price ? project.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
    setPriceDisplay(initialPrice);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description || '',
      price: project.price || 0,
      status: project.status,
      tags: project.tags ? (Array.isArray(project.tags) ? project.tags.join(', ') : project.tags) : '',
      image_url: project.image_url || '',
      product_file_url: project.download_url || '',
      payment_type: project.payment_type || 'unique',
      link_url: project.link_url || ''
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    const { error } = await supabase.from('projects').delete().eq('id', deleteModal.id);
    if (error) showToast('error', error.message);
    else {
        setProjects(prev => prev.filter(p => p.id !== deleteModal.id));
        showToast('success', 'Projeto excluído.');
        if (editingId === deleteModal.id) resetForm();
    }
    setDeleteModal({ show: false, id: null });
  };

  const resetForm = () => {
    setEditingId(null);
    setPriceDisplay('');
    setForm({ 
      title: '', category: 'Aplicativos', description: '', price: 0, status: 'Lançado', 
      tags: '', image_url: '', product_file_url: '', payment_type: 'unique', link_url: '' 
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    if (!e.target.files?.length) return;
    const isImg = type === 'image';
    const file = e.target.files[0];

    if (file.size > 50 * 1024 * 1024) {
        showToast('error', 'Arquivo > 50MB. Use Google Drive.');
        return;
    }

    const setLoader = isImg ? setUploadingImage : setUploadingFile;
    
    try {
      setLoader(true);
      let fileToUpload = file;
      let fileName = file.name;
      const folder = isImg ? 'images' : 'products';

      const isCompressed = fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z');
      if (!isImg && !isCompressed) {
          setZipping(true); 
          showToast('success', 'Compactando...');
          const zip = new JSZip();
          zip.file(fileName, file);
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          fileToUpload = new File([zipBlob], fileName.split('.')[0] + ".zip", { type: 'application/zip' });
          fileName = fileToUpload.name;
          setZipping(false); 
      }

      const cleanName = fileName.replace(/[^a-zA-Z0-9.]/g, '');
      const filePath = `${folder}/${Date.now()}_${cleanName}`;
      
      const { error } = await supabase.storage.from('portfolio').upload(filePath, fileToUpload);
      if (error) throw error;
      
      const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
      setForm(current => ({ ...current, [isImg ? 'image_url' : 'product_file_url']: data.publicUrl }));
      showToast('success', isImg ? 'Capa definida!' : 'Arquivo pronto!');
      
    } catch (error: any) { 
      setZipping(false);
      showToast('error', error.message); 
    } finally { setLoader(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!form.title) throw new Error("Título obrigatório.");
      const tagsArray = form.tags ? (typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(t => t !== '') : form.tags) : [];
      
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        price: form.price,
        status: form.status,
        tags: tagsArray,
        image_url: form.image_url,
        download_url: form.product_file_url,
        payment_type: form.payment_type,
        link_url: form.link_url
      };

      const { error } = editingId 
        ? await supabase.from('projects').update(payload).eq('id', editingId)
        : await supabase.from('projects').insert([payload]);

      if (error) throw error;

      showToast('success', editingId ? 'Atualizado!' : 'Publicado!');
      if (!editingId) resetForm();
      fetchProjects();
    } catch (error: any) {
      showToast('error', error.message);
    } finally { setLoading(false); }
  };

  if (!session) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock className="text-indigo-500 w-8 h-8" /></div>
        <h2 className="text-2xl font-black text-white">Admin A2</h2>
        <form onSubmit={handleLogin} className="space-y-3 text-left">
           <input type="email" className="w-full bg-[#1e293b] rounded-xl px-4 py-3 text-white outline-none" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" autoFocus />
           <input type="password" className="w-full bg-[#1e293b] rounded-xl px-4 py-3 text-white outline-none" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
           <button disabled={loginLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold uppercase text-xs tracking-widest">{loginLoading ? '...' : 'Entrar'}</button>
        </form>
        <a href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white"><ArrowLeft className="w-3 h-3" /> Voltar</a>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#020617] text-slate-300 font-sans p-4 overflow-hidden flex flex-col relative">
      
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-right ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {toast.type === 'success' ? <Check className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>} <span className="font-bold text-sm">{toast.text}</span>
        </div>
      )}
      
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0f172a] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-red-400"><AlertTriangle className="w-6 h-6"/><h3 className="font-bold text-lg text-white">Excluir?</h3></div>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => setDeleteModal({show: false, id: null})} className="flex-1 py-2 bg-slate-800 text-white rounded-lg">Cancelar</button>
                    <button onClick={confirmDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg">Sim</button>
                </div>
            </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 shrink-0 px-2">
          <div className="flex items-center gap-4">
              <a href="/" className="w-10 h-10 bg-[#1e293b] hover:bg-indigo-600 rounded-lg flex items-center justify-center text-white"><ArrowLeft className="w-5 h-5"/></a>
              <h1 className="text-xl font-bold text-white flex items-center gap-2"><Package className="w-5 h-5 text-indigo-500"/> Dashboard</h1>
          </div>
          <div className="flex gap-2">
            {editingId && <button onClick={resetForm} className="text-xs font-bold text-slate-500 hover:text-white uppercase flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg"><RefreshCw className="w-3 h-3"/> Cancelar</button>}
            <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 uppercase flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"><LogOut className="w-3 h-3"/> Sair</button>
          </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
         
         {/* FORMULÁRIO */}
         <div className="lg:col-span-7 bg-[#0f172a] rounded-2xl border border-white/5 p-5 flex flex-col h-full shadow-xl">
             
             {/* LINHA 1: Nome, Preço, Tipo */}
             <div className="grid grid-cols-12 gap-3 mb-3">
                <div className="col-span-5"><label className="text-[10px] font-bold text-slate-500 uppercase">Nome</label><input className="w-full bg-[#1e293b] rounded-lg px-3 py-2 text-white text-xs outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Nome..." /></div>
                <div className="col-span-3"><label className="text-[10px] font-bold text-slate-500 uppercase">Preço</label><input className="w-full bg-[#1e293b] rounded-lg px-3 py-2 text-xs font-bold text-emerald-400 outline-none" value={priceDisplay} onChange={handlePriceChange} placeholder="R$ 0,00" /></div>
                <div className="col-span-4"><label className="text-[10px] font-bold text-slate-500 uppercase">Cobrança</label>
                  <select className="w-full bg-[#1e293b] rounded-lg px-3 py-2 text-white text-xs outline-none border border-transparent focus:border-indigo-500" value={form.payment_type} onChange={e => setForm({...form, payment_type: e.target.value})}>
                    <option value="unique">Pagamento Único (Automático)</option>
                    <option value="subscription">Assinatura Mensal (Manual)</option>
                  </select>
                </div>
             </div>

             {/* LINHA 2: Categoria, Tags, Status */}
             <div className="grid grid-cols-12 gap-3 mb-3">
                <div className="col-span-4"><label className="text-[10px] font-bold text-slate-500 uppercase">Categoria</label><select className="w-full bg-[#1e293b] rounded-lg px-3 py-2 text-white text-xs outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>Aplicativos</option><option>Sistemas Web</option><option>Desktop</option></select></div>
                <div className="col-span-5"><label className="text-[10px] font-bold text-slate-500 uppercase">Tags</label><input className="w-full bg-[#1e293b] rounded-lg px-3 py-2 text-white text-xs outline-none" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags..." /></div>
                <div className="col-span-3"><label className="text-[10px] font-bold text-slate-500 uppercase">Status</label><select className="w-full bg-[#1e293b] rounded-lg px-3 py-2 text-white text-xs outline-none" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Lançado</option><option>Em Breve</option></select></div>
             </div>

             <div className="flex gap-3 mb-3 h-64">
                <div className="flex-1 flex flex-col h-full">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Descrição</label>
                    <textarea className="w-full h-full bg-[#1e293b] rounded-lg px-3 py-2 text-slate-300 text-xs outline-none resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detalhes do projeto..." />
                </div>
                <div className="h-full aspect-square flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Capa (Quadrada)</label>
                    <div className="relative w-full h-full bg-[#1e293b] rounded-xl overflow-hidden border-2 border-dashed border-slate-700 hover:border-indigo-500 group cursor-pointer flex items-center justify-center">
                        {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" /> : <div className="text-center"><ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1"/><span className="text-[9px] text-slate-500 uppercase font-bold">Foto</span></div>}
                        <input type="file" accept="image/*" onChange={e => handleUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>
             </div>

             {/* RODAPÉ INTELIGENTE */}
             <div className="grid grid-cols-12 gap-3 pt-3 border-t border-white/5 items-end">
                
                {form.payment_type === 'subscription' ? (
                   /* SE FOR ASSINATURA: MOSTRA CAMPO DE LINK */
                   <div className="col-span-9 space-y-1">
                      <label className="text-[10px] font-bold text-indigo-400 uppercase flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Link do Plano (Mercado Pago)</label>
                      <input 
                          className="w-full h-10 bg-[#1e293b] border border-indigo-500/30 rounded-lg px-3 text-xs text-white outline-none focus:border-indigo-500"
                          placeholder="Cole aqui o link da assinatura criado no MP..."
                          value={form.link_url}
                          onChange={e => setForm({...form, link_url: e.target.value})}
                      />
                   </div>
                ) : (
                   /* SE FOR ÚNICO: MOSTRA UPLOAD/DRIVE */
                   <div className="col-span-9 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Arquivo (Link Drive ou Upload)</label>
                      <div className="flex gap-1 h-10">
                          <div className="relative flex-1 bg-[#1e293b] hover:bg-slate-800 rounded-lg px-3 flex items-center gap-2 cursor-pointer border border-transparent hover:border-indigo-500/30">
                              <FileText className={`w-4 h-4 ${form.product_file_url ? 'text-emerald-400' : 'text-slate-500'}`}/>
                              <span className="text-[10px] font-bold text-white truncate flex-1">{zipping ? 'Compactando...' : (form.product_file_url ? (form.product_file_url.length > 50 ? form.product_file_url.substring(0,50)+'...' : 'Link/Arquivo Definido') : 'Clique para Anexar')}</span>
                              <input type="file" onChange={e => handleUpload(e, 'file')} disabled={uploadingFile || zipping} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                          <input 
                              className="bg-[#1e293b] px-3 w-1/3 rounded-lg text-[10px] text-white outline-none border border-transparent focus:border-indigo-500/30"
                              placeholder="Ou cole link drive..."
                              value={form.product_file_url}
                              onChange={e => setForm({...form, product_file_url: e.target.value})}
                          />
                      </div>
                   </div>
                )}

                <div className="col-span-3">
                    <button onClick={handleSubmit} disabled={loading || zipping} className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2">
                        {loading ? '...' : <><Save className="w-4 h-4" /> {editingId ? 'Salvar' : 'Publicar'}</>}
                    </button>
                </div>
             </div>
         </div>

         {/* LISTA DE PROJETOS */}
         <div className="lg:col-span-5 bg-[#0f172a] rounded-2xl border border-white/5 flex flex-col overflow-hidden h-full shadow-xl">
             <div className="p-4 border-b border-white/5 bg-[#1e293b]/30"><h2 className="text-xs font-bold text-slate-400 uppercase">Projetos ({projects.length})</h2></div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {projects.map(proj => (
                    <div key={proj.id} className={`p-2 rounded-xl flex items-center gap-3 border ${editingId === proj.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#1e293b]/30 border-transparent'}`}>
                        <div className="w-12 h-12 rounded bg-black shrink-0 overflow-hidden">{proj.image_url ? <img src={proj.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-slate-600 m-3"/>}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs text-white truncate">{proj.title}</h3>
                          <div className="flex gap-2 items-center">
                             <span className={`text-[9px] px-1.5 rounded font-bold ${proj.payment_type === 'subscription' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {proj.payment_type === 'subscription' ? 'Assinatura' : 'Vitalício'}
                             </span>
                             <span className="text-[9px] text-white font-bold">R$ {proj.price}</span>
                          </div>
                        </div>
                        <div className="flex gap-1"><button onClick={() => handleEdit(proj)} className="p-1.5 bg-slate-800 rounded hover:text-white text-slate-400"><Edit3 className="w-3 h-3"/></button><button onClick={() => setDeleteModal({show: true, id: proj.id})} className="p-1.5 bg-slate-800 rounded hover:text-red-400 text-slate-400"><Trash2 className="w-3 h-3"/></button></div>
                    </div>
                ))}
             </div>
         </div>

      </div>
    </div>
  );
}