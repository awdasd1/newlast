import React from 'react';
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      {selectedFile ? (
        <div className="flex items-center bg-indigo-100 rounded-full px-3 py-1 ml-2">
          <span className="text-xs text-indigo-800 truncate max-w-[100px]">
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={onClearFile}
            className="ml-1 text-indigo-600 hover:text-indigo-800"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          className="text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Paperclip size={20} />
        </button>
      )}
    </div>
  );
};

export default FileUploadButton;
