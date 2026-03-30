import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  History, 
  Upload, 
  Download, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Shield, 
  Scale,
  MoreVertical,
  Plus
} from 'lucide-react';
import { api } from '../utils/api';
import { useUser } from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';

const CaseWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [activeCase, setActiveCase] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'guidance' | 'timeline'>('guidance');
  const [isLoading, setIsLoading] = useState(true);
  
  // Note/Guidance state
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('guidance');
  
  // Document state
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/cases/${id}`);
      setActiveCase(data);
    } catch (error) {
      toast.error("Failed to load case details or access denied.");
      navigate('/home');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/cases/${id}/documents`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      toast.success("Document uploaded successfully");
      fetchCaseDetails();
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await api.post(`/cases/${id}/notes`, {
        content: newNote,
        note_type: noteType
      });
      setNewNote('');
      toast.success("Note added");
      fetchCaseDetails();
    } catch (error) {
      toast.error("Failed to post note");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!activeCase) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 px-4 pb-12">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto">
        {/* Professional Workspace Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-900 rounded-lg">
              <Scale className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{activeCase.title}</h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase">Active Case</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4" /> Professional Workspace • Case ID: #{activeCase.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Counsel</p>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeCase.lawyer_name}</p>
             </div>
             <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
             <div className="text-right hidden sm:block">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Client</p>
               <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeCase.client_name}</p>
             </div>
             <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
               <MoreVertical className="w-5 h-5 text-gray-500" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Workspace Zones</h3>
              </div>
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => setActiveTab('guidance')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'guidance' ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <MessageSquare className="w-4 h-4" /> Legal Guidance & Chat
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'documents' ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <FileText className="w-4 h-4" /> Document Vault
                </button>
                <button 
                  onClick={() => setActiveTab('timeline')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'timeline' ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <History className="w-4 h-4" /> Case Timeline
                </button>
              </div>
            </div>

            {/* Quick Actions / Security Info */}
            <div className="bg-blue-900 rounded-xl shadow-sm p-6 text-white overflow-hidden relative">
              <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <LockIcon className="w-4 h-4" /> End-to-End Secure
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                This workspace is encrypted. Only you and your legal counsel can access shared documents and communications.
              </p>
            </div>
          </div>

          {/* Main Workspace Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Guidance & Communications */}
            {activeTab === 'guidance' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-[600px]">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-900" /> Professional Guidance
                  </h2>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
                  {activeCase.notes.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-gray-500">No official guidance posted yet.</p>
                    </div>
                  ) : (
                    activeCase.notes.map((note: any) => (
                      <div key={note.id} className={`flex gap-4 ${note.author_id === user?.id ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs">
                             {note.author_name?.[0]}
                          </div>
                        </div>
                        <div className={`max-w-[70%] space-y-1 ${note.author_id === user?.id ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 justify-end">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{note.author_name}</span>
                             <span className="text-[10px] text-gray-300">{new Date(note.created_at).toLocaleString()}</span>
                          </div>
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${note.author_id === user?.id ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                            {note.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <form onSubmit={handlePostNote} className="relative">
                    <textarea 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Type official guidance or a case update..."
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 pr-32 focus:ring-2 focus:ring-blue-900 outline-none text-sm dark:text-white transition-all min-h-[100px]"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                       <select 
                        value={noteType} 
                        onChange={(e) => setNoteType(e.target.value)}
                        className="text-[10px] uppercase font-bold bg-gray-100 dark:bg-gray-800 border-none rounded px-2 py-1 outline-none"
                       >
                         <option value="guidance">Guidance</option>
                         <option value="status_update">Update</option>
                         <option value="legal_report">Report</option>
                       </select>
                       <button 
                        type="submit"
                        className="p-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-lg"
                       >
                         <Send className="w-5 h-5" />
                       </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Document Vault */}
            {activeTab === 'documents' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[600px]">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-900" /> Evidence & Document Vault
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Shared formal records and submitted evidence</p>
                  </div>
                  <label className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-800 transition shadow-md">
                    <Plus className="w-4 h-4" /> Upload Document
                    <input type="file" className="hidden" onChange={handleUploadDocument} disabled={isUploading} />
                  </label>
                </div>

                <div className="p-6">
                  {activeCase.documents.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-gray-500">No documents shared yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeCase.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-900 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={doc.file_name}>{doc.file_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] font-bold text-emerald-600 uppercase">{doc.file_type}</span>
                               <span className="text-[10px] text-gray-400">• Posted by {doc.uploader_name}</span>
                            </div>
                          </div>
                          <a 
                            href={`http://localhost:8080${doc.file_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline View */}
            {activeTab === 'timeline' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[600px]">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-900" /> Procedural History
                </h2>
                
                <div className="relative border-l-2 border-gray-100 dark:border-gray-700 ml-4 space-y-12">
                   {/* Combined timeline of docs and notes */}
                   {[...activeCase.documents, ...activeCase.notes]
                     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                     .map((item: any, idx: number) => (
                       <div key={idx} className="relative pl-8">
                         <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-900"></div>
                         <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(item.created_at).toLocaleString()}</span>
                            <h4 className="mt-1 font-bold text-gray-900 dark:text-white">
                              {item.file_name ? `Document Uploaded: ${item.file_name}` : `Professional Update posted by ${item.author_name}`}
                            </h4>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {item.content || `Shared by ${item.uploader_name}`}
                            </p>
                         </div>
                       </div>
                     ))
                   }
                   <div className="relative pl-8">
                     <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                     <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(activeCase.created_at).toLocaleString()}</span>
                        <h4 className="mt-1 font-bold text-emerald-600 uppercase tracking-widest text-xs font-bold">Case Connection Formed</h4>
                        <p className="text-sm text-gray-500 mt-2">Attorney {activeCase.lawyer_name} accepted the consultation and initiated the secure workspace.</p>
                     </div>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon component
const LockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default CaseWorkspace;
