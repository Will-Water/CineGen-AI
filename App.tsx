import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StageScript from './components/StageScript';
import StageAssets from './components/StageAssets';
import StageDirector from './components/StageDirector';
import StageExport from './components/StageExport';
import Dashboard from './components/Dashboard';
import { ProjectState } from './types';
import { Key, Save, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { saveProjectToDB } from './services/storageService';
import { setGlobalApiKey } from './services/geminiService';

const HomeLinks = () => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-zinc-800 bg-black/70 px-4 py-2 text-[11px] font-mono text-zinc-400 backdrop-blur-sm">
    <a
      href="https://github.com/Will-Water/CineGen-AI"
      target="_blank"
      rel="noreferrer"
      className="hover:text-white transition-colors"
    >
      GitHub
    </a>
    <span className="text-zinc-700">|</span>
    <a
      href="https://anikuku.com/?from=open-source"
      target="_blank"
      rel="noreferrer"
      className="hover:text-white transition-colors"
    >
      anikuku.com
    </a>
  </div>
);

function App() {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [inputKey, setInputKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Ref to hold debounce timer
  const saveTimeoutRef = useRef<any>(null);

  // Load API Key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('cinegen_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setGlobalApiKey(storedKey);
    }
  }, []);

  // Auto-save logic
  useEffect(() => {
    if (!project) return;

    setSaveStatus('unsaved');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await saveProjectToDB(project);
        setSaveStatus('saved');
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 1000); // Debounce 1s

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [project]);

  const handleSaveKey = () => {
    if (!inputKey.trim()) return;
    setApiKey(inputKey);
    setGlobalApiKey(inputKey);
    localStorage.setItem('cinegen_api_key', inputKey);
  };

  const handleClearKey = () => {
    localStorage.removeItem('cinegen_api_key');
    setApiKey('');
    setGlobalApiKey('');
    setProject(null);
  };

  const updateProject = (updates: Partial<ProjectState>) => {
    if (!project) return;
    setProject(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const setStage = (stage: 'script' | 'assets' | 'director' | 'export') => {
    updateProject({ stage });
  };

  const handleOpenProject = (proj: ProjectState) => {
    setProject(proj);
  };

  const handleExitProject = async () => {
    // Force save before exiting
    if (project) {
      await saveProjectToDB(project);
    }
    setProject(null);
  };

  const renderStage = () => {
    if (!project) return null;
    switch (project.stage) {
      case 'script':
        return <StageScript project={project} updateProject={updateProject} />;
      case 'assets':
        return <StageAssets project={project} updateProject={updateProject} />;
      case 'director':
        return <StageDirector project={project} updateProject={updateProject} />;
      case 'export':
        return <StageExport project={project} />;
      default:
        return <div className="text-white">未知阶段</div>;
    }
  };

  // API Key Entry Screen (Industrial Design)
  if (!apiKey) {
    return (
      <>
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Background Accents */}
          <div className="absolute top-0 right-0 p-64 bg-indigo-900/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-48 bg-zinc-900/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="w-full max-w-md bg-[#0A0A0A] border border-zinc-800 p-8 rounded-xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">

            <div className="flex items-center gap-3 mb-8 border-b border-zinc-900 pb-6">
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">CineGen AI Director</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Authentication Required</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Google Gemini API Key</label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter your API Key..."
                  className="w-full bg-[#141414] border border-zinc-800 text-white px-4 py-3 text-sm rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-900 transition-all font-mono placeholder:text-zinc-700"
                />
                <p className="mt-3 text-[10px] text-zinc-600 leading-relaxed">
                  本应用需要 Gemini 2.5 Flash 及 Veo 视频生成权限。请确保您的 API Key 关联了已开通结算功能的 Google Cloud 项目。
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline ml-1">查看文档</a>
                </p>
              </div>

              <button
                onClick={handleSaveKey}
                disabled={!inputKey}
                className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Access <ArrowRight className="w-3 h-3" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-700 font-mono">
                <ShieldCheck className="w-3 h-3" />
                Key is stored locally in your browser
              </div>
            </div>
          </div>
        </div>
        <HomeLinks />
      </>
    );
  }

  // Dashboard View
  if (!project) {
    return (
      <>
        <button onClick={handleClearKey} className="fixed top-4 right-4 z-50 text-[10px] text-zinc-600 hover:text-red-500 transition-colors uppercase font-mono tracking-widest">
          Sign Out
        </button>
        <Dashboard onOpenProject={handleOpenProject} />
        <HomeLinks />
      </>
    );
  }

  // Workspace View
  return (
    <div className="flex h-screen bg-[#121212] font-sans text-gray-100 selection:bg-indigo-500/30">
      <Sidebar
        currentStage={project.stage}
        setStage={setStage}
        onExit={handleExitProject}
        projectName={project.title}
      />

      <main className="ml-72 flex-1 h-screen overflow-hidden relative">
        {renderStage()}

        {/* Save Status Indicator */}
        <div className="absolute top-4 right-6 pointer-events-none opacity-50 flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm z-50">
          {saveStatus === 'saving' ? (
            <>
              <Save className="w-3 h-3 animate-pulse" />
              保存中...
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 text-green-500" />
              已保存
            </>
          )}
        </div>
      </main>

      <div className="lg:hidden fixed inset-0 bg-black z-[100] flex items-center justify-center p-8 text-center">
        <p className="text-zinc-500">为了获得最佳体验，请使用桌面浏览器访问。</p>
      </div>
    </div>
  );
}

export default App;
