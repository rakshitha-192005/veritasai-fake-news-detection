import React, { useState } from 'react';
import { 
  Sparkles, Link as LinkIcon, FileText, Image as ImageIcon, 
  Mic, Upload, RefreshCw, Globe2, AlertCircle 
} from 'lucide-react';
import { apiService } from '../services/api';
import { PredictionResponse } from '../types';
import { PredictionCard } from '../components/PredictionCard';

interface LiveAnalyzerProps {
  onOpenChatWithContext: (pred: PredictionResponse) => void;
}

export const LiveAnalyzer: React.FC<LiveAnalyzerProps> = ({ onOpenChatWithContext }) => {
  const [activeInputTab, setActiveInputTab] = useState<'text' | 'url' | 'ocr' | 'pdf'>('text');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Sample quick test payloads
  const sampleFakeNews = () => {
    setHeadline("SHOCKING: Secret Remedy Discovered by Anonymous Researchers Banished by Authorities!");
    setContent("Unbelievable breakthrough cure discovered overnight! Doctors are stunned as hidden details leak online. Global health agencies refuse to comment while conspiracy grows.");
    setActiveInputTab('text');
  };

  const sampleRealNews = () => {
    setHeadline("NASA Announces Successful Orbiting of Next-Generation Space Telescope");
    setContent("Official representatives at NASA confirmed today that the deep-space satellite successfully achieved stable orbit. Peer-reviewed sensor calibration data shows optimal performance according to published scientific findings.");
    setActiveInputTab('text');
  };

  const handleTextAnalyze = async () => {
    if (!content.trim() && !headline.trim()) {
      setError("Please enter a news article, headline, or text payload.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.analyzeText(content, headline, language, 'text');
      setPrediction(res);
    } catch (err: any) {
      setError("Analysis failed. Please check backend service connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlAnalyze = async () => {
    if (!urlInput.trim()) {
      setError("Please provide a valid article or social media URL.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.analyzeText("", `URL Target: ${urlInput}`, language, 'url');
      setPrediction(res);
    } catch (err: any) {
      setError("Failed to scrape URL payload.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ocr' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      let res: PredictionResponse;
      if (type === 'ocr') {
        res = await apiService.uploadImageOCR(file);
      } else {
        res = await apiService.uploadDocumentPDF(file);
      }
      setPrediction(res);
    } catch (err: any) {
      setError(`Failed to process ${type.toUpperCase()} file upload.`);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => prev + " " + transcript);
    };

    recognition.start();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" /> Real-Time Multi-Modal AI Analyzer
          </h1>
          <p className="text-xs text-slate-400">Analyze articles, URLs, screenshots, PDFs, and voice input with Explainable AI</p>
        </div>

        {/* Preset Sample Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={sampleFakeNews}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            Load Sample Fake News
          </button>
          <button
            onClick={sampleRealNews}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
          >
            Load Sample Real News
          </button>
        </div>
      </div>

      {/* Input Box Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {[
              { id: 'text', label: 'Article / Text', icon: FileText },
              { id: 'url', label: 'URL / Social Link', icon: LinkIcon },
              { id: 'ocr', label: 'Screenshot OCR', icon: ImageIcon },
              { id: 'pdf', label: 'PDF Document', icon: Upload },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveInputTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    activeInputTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="kn">Kannada (కన్నడ)</option>
              <option value="ml">Malayalam (മലയാളം)</option>
              <option value="fr">French (Français)</option>
              <option value="de">German (Deutsch)</option>
              <option value="es">Spanish (Español)</option>
              <option value="ar">Arabic (العربية)</option>
            </select>
          </div>
        </div>

        {/* Input Form Views */}
        {activeInputTab === 'text' && (
          <div className="space-y-4">
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Article Headline (Optional)..."
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Paste full news article text or story here for real-time deep learning verification..."
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 resize-none"
              ></textarea>

              <button
                onClick={handleVoiceInput}
                title="Voice Input (Speech to Text)"
                className={`absolute bottom-3 right-3 p-2 rounded-lg border transition ${
                  isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleTextAnalyze}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running Multi-Model AI Detection...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Deep AI Verification
                </>
              )}
            </button>
          </div>
        )}

        {activeInputTab === 'url' && (
          <div className="space-y-4">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste article URL or social media post link (Twitter/X, Reddit, Facebook)..."
              className="w-full px-4 py-3.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
            <button
              onClick={handleUrlAnalyze}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Scrape & Verify Link
            </button>
          </div>
        )}

        {activeInputTab === 'ocr' && (
          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 text-center space-y-4 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Upload Screenshot or News Image</p>
              <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP. EasyOCR & Tesseract text extraction.</p>
            </div>
            <label className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition">
              Select Image File
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'ocr')} className="hidden" />
            </label>
          </div>
        )}

        {activeInputTab === 'pdf' && (
          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 text-center space-y-4 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Upload News PDF or Document</p>
              <p className="text-xs text-slate-400 mt-1">Extracts clean text body for multi-page document verification.</p>
            </div>
            <label className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition">
              Select Document File
              <input type="file" accept=".pdf,.txt,.docx" onChange={(e) => handleFileUpload(e, 'pdf')} className="hidden" />
            </label>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Output Results */}
      {prediction && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-outfit uppercase tracking-wider">Analysis Results & Explainable AI</h2>
          <PredictionCard prediction={prediction} onOpenChatWithContext={onOpenChatWithContext} />
        </div>
      )}
    </div>
  );
};
