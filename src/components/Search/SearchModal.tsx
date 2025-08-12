import React, { useState, useEffect } from 'react';
import { X, Search, Book, Calendar, FileText, Heart } from 'lucide-react';
import { searchAPI } from '../../services/api';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', name: 'அனைத்தும்', icon: Search },
    { id: 'bible', name: 'வேதாகமம்', icon: Book },
    { id: 'readings', name: 'வாசகங்கள்', icon: Calendar },
    { id: 'blog', name: 'கட்டுரைகள்', icon: FileText },
    { id: 'prayers', name: 'செபங்கள்', icon: Heart },
  ];

  const performSearch = async (searchQuery: string, type: string = 'all') => {
    if (searchQuery.trim().length < 2) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await searchAPI.search(searchQuery, type);
      setResults(response);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        performSearch(query, activeTab);
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, activeTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults(null);
      setActiveTab('all');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderBibleResults = (bibleResults: any[]) => (
    <div className="space-y-3">
      {bibleResults.map((result, index) => (
        <Link
          key={index}
          to={`/bible/${result.bookId}/chapter/${result.chapterNumber}#verse-${result.verseNumber}`}
          onClick={onClose}
          className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <Book className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {result.reference}
              </div>
              <div className="text-gray-700 dark:text-gray-300 mt-1">
                {result.text.substring(0, 200)}...
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderReadingResults = (readingResults: any[]) => (
    <div className="space-y-3">
      {readingResults.map((result) => (
        <Link
          key={result.id}
          to={`/readings/${result.date.split('T')[0]}`}
          onClick={onClose}
          className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
            <div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                {new Date(result.date).toLocaleDateString('ta-IN')} - {result.season}
              </div>
              <div className="text-gray-700 dark:text-gray-300 mt-1">
                {result.firstReading} • {result.gospel}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderBlogResults = (blogResults: any[]) => (
    <div className="space-y-3">
      {blogResults.map((result) => (
        <Link
          key={result.id}
          to={`/blog/${result.slug}`}
          onClick={onClose}
          className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {result.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {result.author} • {result.category} • {result.readingTime} நிமிடம்
              </div>
              <div className="text-gray-700 dark:text-gray-300 mt-1">
                {result.excerpt}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderPrayerResults = (prayerResults: any[]) => (
    <div className="space-y-3">
      {prayerResults.map((result) => (
        <div
          key={result.id}
          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <Heart className="h-5 w-5 text-red-600 dark:text-red-400 mt-1" />
            <div>
              <div className="text-sm font-medium text-red-600 dark:text-red-400">
                {result.name} - {result.location}
              </div>
              <div className="text-gray-700 dark:text-gray-300 mt-1">
                {result.intention}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {new Date(result.createdAt).toLocaleDateString('ta-IN')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4 pt-20">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              தேடல்
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="வேதாகமம், வாசகங்கள், கட்டுரைகள் அல்லது செபங்களில் தேடவும்..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : results && results.hasResults ? (
              <div className="space-y-6">
                {(activeTab === 'all' || activeTab === 'bible') && results.results.bible?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      வேதாகம வசனங்கள்
                    </h3>
                    {renderBibleResults(results.results.bible)}
                  </div>
                )}
                
                {(activeTab === 'all' || activeTab === 'readings') && results.results.readings?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      தினசரி வாசகங்கள்
                    </h3>
                    {renderReadingResults(results.results.readings)}
                  </div>
                )}
                
                {(activeTab === 'all' || activeTab === 'blog') && results.results.blog?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      கட்டுரைகள்
                    </h3>
                    {renderBlogResults(results.results.blog)}
                  </div>
                )}
                
                {(activeTab === 'all' || activeTab === 'prayers') && results.results.prayers?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      செபக் கோரிக்கைகள்
                    </h3>
                    {renderPrayerResults(results.results.prayers)}
                  </div>
                )}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  முtulைv கிடைக்கவில்லை
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  "{query}" க்கான தேடல் முtuல்கள் கிடைக்கவில்லை. வேறு சொற்களை முயற்சி செய்யவும்.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                தேட வேண்டிய வார்த்தைகளை உள்ளிடவும்
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;