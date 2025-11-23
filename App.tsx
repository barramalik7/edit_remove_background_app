import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { Button } from './components/Button';
import { editImageWithGemini } from './services/geminiService';
import { AppState, ImageData } from './types';

const SUGGESTED_PROMPTS = [
  "Remove the background",
  "Place the product on a white marble table",
  "Add a soft studio lighting effect",
  "Make it look like a vintage photo",
  "Add a reflection shadow at the bottom"
];

function App() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (img: ImageData) => {
    setImage(img);
    setAppState(AppState.READY_TO_EDIT);
    setGeneratedUrl(null);
    setError(null);
    // Reset prompt to empty on new upload? Maybe keep it if they want to apply same style.
    // Let's keep prompt but clear result.
  };

  const handleGenerate = async () => {
    if (!image || !prompt.trim()) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const result = await editImageWithGemini(image, prompt);
      
      if (result.imageUrl) {
        setGeneratedUrl(result.imageUrl);
        setAppState(AppState.COMPLETED);
      } else {
        throw new Error("No image was returned from the model. Try a different prompt.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setImage(null);
    setGeneratedUrl(null);
    setPrompt('');
    setAppState(AppState.IDLE);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <Header />

      <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* Error Toast */}
        {error && (
          <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Upload Stage */}
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-10 max-w-xl">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Transform Your Photos
              </h2>
              <p className="text-slate-400 text-lg">
                Upload a product shot or any image, describe what you want to change, and let Gemini 2.5 Flash do the magic.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        )}

        {/* Editor Stage */}
        {appState !== AppState.IDLE && image && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Left Panel: Controls */}
            <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
              
              {/* Input Area */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold text-white">Instructions</label>
                    <button 
                        onClick={handleReset}
                        className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-2"
                    >
                        Start Over
                    </button>
                </div>
                <textarea 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                  rows={4}
                  placeholder="E.g., Remove the background and replace it with a solid blue color..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={appState === AppState.PROCESSING}
                />
                
                {/* Quick Actions */}
                <div className="mt-4">
                    <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Quick Prompts</p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_PROMPTS.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPrompt(p)}
                                disabled={appState === AppState.PROCESSING}
                                className="text-xs px-3 py-1.5 rounded-lg bg-slate-700/30 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-colors text-left truncate max-w-full"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <Button 
                        onClick={handleGenerate} 
                        className="w-full" 
                        isLoading={appState === AppState.PROCESSING}
                        disabled={!prompt.trim()}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                    >
                        {appState === AppState.PROCESSING ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
              </div>

               <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/10">
                    <h4 className="text-sm font-semibold text-blue-200 mb-1">Pro Tip</h4>
                    <p className="text-xs text-blue-300/80 leading-relaxed">
                        Be specific with your instructions. Mention colors, lighting, or objects you want to add or remove.
                    </p>
               </div>
            </div>

            {/* Right Panel: Result Viewer */}
            <div className="lg:col-span-2 h-full min-h-[400px] order-1 lg:order-2">
              <ResultViewer 
                original={image} 
                generatedUrl={generatedUrl} 
                isLoading={appState === AppState.PROCESSING} 
              />
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full py-6 text-center text-slate-500 text-xs border-t border-slate-800/50">
        <p>© {new Date().getFullYear()} Product Perfect AI. Built with React & Gemini.</p>
      </footer>
    </div>
  );
}

export default App;
