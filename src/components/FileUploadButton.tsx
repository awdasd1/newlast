import React, { useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ 
  onFileSelect, 
  selectedFile,
  onClearFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer p-2 rounded-full hover:bg-gray-200 transition-colors ${
            isDragging ? 'bg-gray-200' : ''
          }`}
          title="Attach a file"
        >
          <Paperclip size={20} className="text-gray-600" />
        </div>
      ) : (
        <div className="flex items-center bg-indigo-100 rounded-full px-3 py-1 mr-2">
          <span className="text-xs text-indigo-800 mr-1 max-w-[100px] truncate">
            {selectedFile.name} ({getFileSize(selectedFile.size)})
          </span>
          <button
            onClick={onClearFile}
            className="text-indigo-600 hover:text-indigo-800"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;
