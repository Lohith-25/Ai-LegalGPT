import React from 'react';

interface CaseOption {
  id: string;
  name: string;
  description: string;
}

interface SidebarProps {
  selectedCase: string;
  onCaseSelect: (caseType: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const CASE_OPTIONS: CaseOption[] = [
  {
    id: 'FIR',
    name: 'FIR Registration',
    description: 'File a First Information Report',
  },
  {
    id: 'Consumer Complaint',
    name: 'Consumer Complaint',
    description: 'File a consumer protection complaint',
  },
  {
    id: 'Rental Dispute',
    name: 'Rental Dispute',
    description: 'Resolve tenancy issues',
  },
  {
    id: 'Cyber Crime',
    name: 'Cyber Crime',
    description: 'Report cyber crime',
  },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCase,
  onCaseSelect,
  onNewChat,
  onClearHistory,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="sidebar">
      <div className="mb-6">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-semibold mb-4 transition"
        >
          + New Chat
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">
          Case Types
        </h3>
        {CASE_OPTIONS.map(caseOption => (
          <div
            key={caseOption.id}
            className={`sidebar-item ${selectedCase === caseOption.id ? 'active' : ''}`}
            onClick={() => onCaseSelect(caseOption.id)}
            role="button"
            tabIndex={0}
          >
            <div className="font-semibold text-sm">{caseOption.name}</div>
            <div className="text-xs opacity-80">{caseOption.description}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">
          Language
        </h3>
        <div className="space-y-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                language === lang.code
                  ? 'bg-white bg-opacity-30 font-semibold'
                  : 'bg-white bg-opacity-10 hover:bg-opacity-20'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white border-opacity-20">
        <button
          onClick={onClearHistory}
          className="w-full py-2 px-3 text-sm bg-white bg-opacity-10 hover:bg-opacity-20 rounded transition"
        >
          Clear History
        </button>
      </div>
    </div>
  );
};
