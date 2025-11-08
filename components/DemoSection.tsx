import React, { useState, useCallback, useEffect, useRef } from 'react';
import { summarizeContent, generateVideo } from '../services/geminiService';
import LoadingSpinner from './icons/LoadingSpinner';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';
import CopyIcon from './icons/CopyIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface VideoData {
  url: string;
  blob: Blob;
}

interface Bookmark {
    time: number;
    label: string;
}

const DemoSection: React.FC = () => {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [error, setError] = useState('');
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');
  const videoRef = useRef<HTMLVideoElement>(null);


  const checkApiKey = useCallback(async () => {
    try {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        }
    } catch (e) {
        console.error("Error checking for API key:", e);
        setApiKeySelected(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKey = async () => {
    try {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions and improve UX
            setApiKeySelected(true); 
        }
    } catch (e) {
        console.error("Error opening API key selection:", e);
        setError("Could not open API key selection dialog.");
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // remove data:image/jpeg;base64,
        const base64String = reader.result?.toString().split(',')[1] || '';
        setUserImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please paste your study notes first.');
      return;
    }
    setError('');
    setSummary('');
    setVideoData(null);
    setBookmarks([]);
    
    setIsLoadingSummary(true);
    let currentSummary = '';
    try {
      currentSummary = await summarizeContent(content);
      setSummary(currentSummary);
    } catch (err: any) {
      setError(err.message);
      setIsLoadingSummary(false);
      return;
    }
    setIsLoadingSummary(false);

    setIsLoadingVideo(true);
    try {
        const data = await generateVideo(currentSummary, userImage || undefined);
        setVideoData(data);
    } catch (err: any) {
        setError(err.message);
        if (err.message.includes("API Key validation failed")) {
            setApiKeySelected(false);
        }
    } finally {
        setIsLoadingVideo(false);
    }
  };
  
  const handleDownload = () => {
    if (!videoData) return;
    const link = document.createElement('a');
    link.href = videoData.url;
    link.setAttribute('download', 'ace-ai-video.mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    if (videoData && navigator.share) {
      const file = new File([videoData.blob], 'ace-ai-video.mp4', { type: 'video/mp4' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Ace AI Study Video',
            text: 'Check out this video I created with Ace AI!',
          });
        } catch (error) {
          console.error('Error sharing:', error);
          setError('Could not share the video.');
        }
      } else {
        setError('Sharing this file type is not supported on your browser.');
      }
    } else {
      setError('Sharing is not supported on your browser, or there is no video to share.');
    }
  };

  const handleCopyLink = () => {
    if (!videoData) return;
    navigator.clipboard.writeText(videoData.url).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Link'), 2000);
    }, () => {
        setError('Failed to copy link.');
    });
  };

  const addBookmark = () => {
    if (videoRef.current && bookmarkLabel.trim()) {
        const newBookmark: Bookmark = {
            time: videoRef.current.currentTime,
            label: bookmarkLabel.trim(),
        };
        setBookmarks(prev => [...prev, newBookmark].sort((a,b) => a.time - b.time));
        setBookmarkLabel('');
    }
  };

  const jumpToBookmark = (time: number) => {
    if (videoRef.current) {
        videoRef.current.currentTime = time;
        videoRef.current.play();
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const isGenerating = isLoadingSummary || isLoadingVideo;
  const videoLoadingMessages = [
        "Brewing creativity... your video is on its way.",
        "Analyzing pixels and prompts...",
        "Composing your visual masterpiece...",
        "This can take a few minutes, good things come to those who wait!",
        "Almost there... adding the final touches."
    ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        let interval: number;
        if (isLoadingVideo) {
            interval = window.setInterval(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % videoLoadingMessages.length);
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLoadingVideo, videoLoadingMessages.length]);


  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">See Ace AI in Action</h2>
          <p className="text-lg text-gray-600 mt-2">From text to video in just a few clicks.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          {/* Step 1: Input */}
          <div className="mb-6">
            <label htmlFor="notes" className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <span className="bg-indigo-600 text-white rounded-full w-8 h-8 text-sm flex items-center justify-center mr-3">1</span>
              Paste Your Study Material
            </label>
            <textarea
              id="notes"
              rows={8}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="Paste your notes from a PDF, DOCX, or text file here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isGenerating}
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">For best results, use 200+ words.</p>
          </div>
          
           {/* Step 2: Image and Generate */}
          <div className="mb-6">
             <label htmlFor="image-upload" className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 text-sm flex items-center justify-center mr-3">2</span>
                Add an Image to Your Video (Optional)
            </label>
            <input 
                type="file" 
                id="image-upload"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                disabled={isGenerating}
            />
            {userImage && <img src={`data:image/jpeg;base64,${userImage}`} alt="Preview" className="mt-4 rounded-lg max-h-40" />}
          </div>

          <div className="text-center mb-6">
            {!apiKeySelected ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Action Required</p>
                    <p>Video generation requires a Gemini API key. Please select one to proceed.</p>
                    <p className="text-sm mt-2">Learn about billing at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">ai.google.dev/gemini-api/docs/billing</a>.</p>
                    <button 
                        onClick={handleSelectKey} 
                        className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                        Select API Key
                    </button>
                </div>
            ) : (
                <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
                >
                {isGenerating ? <LoadingSpinner /> : '✨ Generate Summary & Video'}
                </button>
            )}
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Step 3: Output */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Summary Output */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                 <span className="bg-purple-600 text-white rounded-full w-8 h-8 text-sm flex items-center justify-center mr-3">3</span>
                 AI-Generated Summary
              </h3>
              <div className="bg-gray-100 p-4 rounded-lg min-h-[200px] border border-gray-200">
                {isLoadingSummary ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                    <span className="ml-2">Summarizing...</span>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{summary || 'Your summary will appear here...'}</p>
                )}
              </div>
            </div>

            {/* Video Output */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <span className="bg-cyan-500 text-white rounded-full w-8 h-8 text-sm flex items-center justify-center mr-3">4</span>
                AI-Generated Video
              </h3>
              <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center border border-gray-700">
                {isLoadingVideo ? (
                  <div className="text-white text-center p-4">
                    <LoadingSpinner />
                    <p className="mt-2 text-sm">{videoLoadingMessages[currentMessageIndex]}</p>
                  </div>
                ) : videoData ? (
                  <video ref={videoRef} src={videoData.url} controls className="w-full h-full rounded-lg"></video>
                ) : (
                  <p className="text-gray-400">Your video will appear here...</p>
                )}
              </div>
              {videoData && (
                <div className='mt-4'>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleDownload} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"><DownloadIcon className="w-4 h-4" /> Download</button>
                        <button onClick={handleShare} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"><ShareIcon className="w-4 h-4" /> Share</button>
                        <button onClick={handleCopyLink} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><CopyIcon className="w-4 h-4" /> {copyButtonText}</button>
                    </div>
                     <p className="text-xs text-gray-500 mt-2 text-center">Share uses the Web Share API. Copied link is temporary and works only in this browser.</p>
                    
                     <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Bookmarks</h4>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text"
                                value={bookmarkLabel}
                                onChange={(e) => setBookmarkLabel(e.target.value)}
                                placeholder="Bookmark label..."
                                className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                            <button onClick={addBookmark} className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-200 transition-colors" title="Add bookmark at current time">
                                <BookmarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <ul className="space-y-2 max-h-32 overflow-y-auto">
                            {bookmarks.length > 0 ? bookmarks.map((bookmark, index) => (
                                <li key={index}>
                                    <button onClick={() => jumpToBookmark(bookmark.time)} className="w-full text-left text-sm p-2 bg-gray-50 rounded-md hover:bg-gray-100">
                                        <span className="font-mono text-indigo-600">{formatTime(bookmark.time)}</span> - <span className="text-gray-700">{bookmark.label}</span>
                                    </button>
                                </li>
                            )) : <p className="text-sm text-gray-500">No bookmarks added yet.</p>}
                        </ul>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;