import React, { useCallback, useState } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageData) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Extract pure Base64
      const base64 = dataUrl.split(',')[1];
      onImageSelected({
        base64,
        mimeType: file.type,
        dataUrl
      });
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <div 
      className={`
        w-full max-w-2xl mx-auto relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
          : 'border-slate-700 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/50'
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shadow-inner ring-1 ring-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Upload Product Photo</h3>
          <p className="text-slate-400 text-sm">Drag & drop or click to browse</p>
        </div>
        <div className="pt-2">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-700/50 text-xs font-medium text-slate-300 border border-slate-700">
            Supports JPG, PNG, WEBP
          </span>
        </div>
      </div>
    </div>
  );
};
