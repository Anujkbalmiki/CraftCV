import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, RefreshCw, Shield, Sparkles, Sliders } from 'lucide-react';
import { ResumeTemplateId } from '../../types';
import { RESUME_TEMPLATES } from '../../data/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userApiKey: string;
  onSaveApiKey: (key: string) => void;
  defaultTemplateId: ResumeTemplateId;
  onSelectDefaultTemplate: (id: ResumeTemplateId) => void;
  hasServerKey: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userApiKey,
  onSaveApiKey,
  defaultTemplateId,
  onSelectDefaultTemplate,
  hasServerKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(userApiKey);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'api' | 'preferences'>('api');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage('Verifying Gemini API connectivity...');
    try {
      const headers: Record<string, string> = {};
      if (apiKeyInput.trim()) {
        headers['x-gemini-api-key'] = apiKeyInput.trim();
      }

      const res = await fetch('/api/health', { headers });
      const data = await res.json();

      if (data.status === 'ok' && (data.hasApiKey || data.hasServerKey)) {
        setTestingStatus('success');
        setTestMessage(
          apiKeyInput.trim()
            ? 'Custom Gemini API Key verified and active!'
            : 'Connected successfully to Craft-CV server AI engine (gemini-3.8-flash).'
        );
      } else {
        setTestingStatus('error');
        setTestMessage('Connection reached server, but no valid Gemini API key is configured.');
      }
    } catch (err: any) {
      setTestingStatus('error');
      setTestMessage(`Connection test failed: ${err.message || 'Network error'}`);
    }
  };

  const handleSave = () => {
    onSaveApiKey(apiKeyInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Settings & AI Credentials
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="px-6 pt-3 flex gap-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30">
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'api'
                ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Gemini AI Connection
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Default Template & Preferences
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {activeTab === 'api' ? (
            <div className="space-y-4">
              {/* Server connection status badge */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${hasServerKey || userApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
                      {hasServerKey
                        ? 'Built-in Server AI Active'
                        : userApiKey
                        ? 'Using Custom User Key'
                        : 'Awaiting API Key'}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Model: gemini-3.8-flash (Multimodal Vision & Generation)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingStatus === 'testing'}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${testingStatus === 'testing' ? 'animate-spin' : ''}`} />
                  Test
                </button>
              </div>

              {/* Status banner if tested */}
              {testingStatus === 'success' && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{testMessage}</span>
                </div>
              )}

              {testingStatus === 'error' && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{testMessage}</span>
                </div>
              )}

              {/* Custom API key entry */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-neutral-500" /> Custom Google Gemini API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5">
                  Stored safely in browser local state. Leave empty to use the built-in server Gemini API.
                </p>
              </div>

              {/* Security info */}
              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200 space-y-0.5">
                  <p className="font-semibold">Privacy & Security First</p>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                    Resume data is processed securely through standard server-side APIs for parsing and tailoring. No candidate documents are shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                  Default Resume Template
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {RESUME_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => onSelectDefaultTemplate(tmpl.id)}
                      className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        defaultTemplateId === tmpl.id
                          ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60 font-semibold'
                          : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <div>
                        <div className="text-xs text-neutral-900 dark:text-white">{tmpl.name}</div>
                        <div className="text-[11px] text-neutral-500">{tmpl.subtitle}</div>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                        {tmpl.atsCompatibilityScore}% ATS
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
