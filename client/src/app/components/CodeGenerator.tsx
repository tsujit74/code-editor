import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeGeneratorProps {
  activeFile: {
    language: string;
    path: string;
  };
  onGenerate: (prompt: string, language: string) => Promise<string>;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ activeFile, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for code generation');
      return;
    }

    setIsLoading(true);
    try {
      const code = await onGenerate(prompt, activeFile.language);
      setGeneratedCode(code);
    } catch (error) {
      toast.error('Failed to generate code. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Wand2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                AI Code Generator
              </h2>
              <p className="text-sm text-gray-400">
                Generate {activeFile.language} code with natural language
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Describe what you need
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl text-sm text-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200 resize-none"
                placeholder={`Example: "Create a ${activeFile.language} function to calculate factorial recursively"`}
                rows={4}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {prompt.length}/500
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={`w-full py-3 px-6 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
              isLoading
                ? 'bg-emerald-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg hover:shadow-emerald-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Code
              </>
            )}
          </button>

          {generatedCode && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-1 bg-gray-800 rounded-md text-gray-300">
                    {activeFile.language}
                  </span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="text-sm flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Modern Code Block */}
              <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800/50 backdrop-blur-sm flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <pre className="overflow-x-auto p-6 pt-12 text-sm font-mono text-gray-200">
                  <code className="whitespace-pre-wrap break-words">{generatedCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;