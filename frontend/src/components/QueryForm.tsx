import React, { useState } from 'react';

interface QueryFormProps {
  onSubmit: (data: {
    location: string;
    description: string;
    file?: File;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Accept pdf, doc, docx, txt
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError('');
      } else {
        setError('Please upload a PDF, Word, or text file');
        setFile(null);
        setFileName('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!location.trim()) {
      setError('Please enter your location');
      return;
    }

    if (!description.trim() && !file) {
      setError('Please describe your issue or upload a document');
      return;
    }

    if (description.trim() && description.trim().length < 20) {
      setError('Please provide more details (at least 20 characters)');
      return;
    }

    try {
      await onSubmit({ location, description, file: file || undefined });
      setLocation('');
      setDescription('');
      setFile(null);
      setFileName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-700 block mb-2">
          Your Location / State
        </label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g., Mumbai, Maharashtra"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
          disabled={isLoading}
        />
      </div>

      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-700 block mb-2">
          Describe Your Issue
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Provide details about your legal issue..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
          rows={3}
          disabled={isLoading}
        />
        <div className="text-xs text-gray-500 mt-1">
          {description.length}/500 characters
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-700 block mb-2">
          Or Upload a Legal Document (Optional)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            disabled={isLoading}
          />
        </div>
        {fileName && (
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            ✓ {fileName}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message mb-3 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? 'Analyzing...' : 'Get Legal Guidance'}
      </button>
    </form>
  );
};
