import React from 'react';
import { ImageData } from '../types';

interface ResultViewerProps {
  original: ImageData | null;
  generatedUrl: string | null;
  isLoading: boolean;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ original, generatedUrl, isLoading }) => {
  if (!original) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
      {/* Original Image */}
      <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50 aspect-square flex items-center justify-center">
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/10">
          Original
        </div>
        <img 
          src={original.dataUrl} 
          alt="Original Upload" 
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Generated Image */}
      <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50 aspect-square flex items-center justify-center">
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-xs font-medium text-white border border-white/10 shadow-lg shadow-blue-900/20">
          AI Result
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
             <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-slate-400 font-medium animate-pulse">Thinking...</p>
          </div>
        ) : generatedUrl ? (
          <>
            <img 
              src={generatedUrl} 
              alt="AI Generated" 
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <a 
              href={generatedUrl} 
              download="gemini-edit.png"
              className="absolute bottom-4 right-4 p-3 bg-white text-slate-900 rounded-xl shadow-xl hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
              title="Download Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </>
        ) : (
          <div className="text-center p-8">
            <p className="text-slate-500 text-sm">Enter a prompt to generate an edited version.</p>
          </div>
        )}
      </div>
    </div>
  );
};
