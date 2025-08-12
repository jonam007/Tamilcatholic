import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Book, ChevronRight, Search } from 'lucide-react';
import { bibleAPI } from '../services/api';

interface BibleBook {
  _id: string;
  name: string;
  tamilName: string;
  shortName: string;
  testament: 'old' | 'new';
  order: number;
  chapters?: Array<{
    number: number;
    verses: Array<{
      number: number;
      text: string;
    }>;
  }>;
}

const Bible: React.FC = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchVerses();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchBooks = async () => {
    try {
      const response = await bibleAPI.getBooks();
      if (response.success) {
        setBooks(response.books);
      }
    } catch (error) {
      console.error('Error fetching Bible books:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchVerses = async () => {
    setSearchLoading(true);
    try {
      const response = await bibleAPI.searchVerses(searchQuery, 10);
      if (response.success) {
        setSearchResults(response.results);
      }
    } catch (error) {
      console.error('Error searching verses:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const oldTestamentBooks = books.filter(book => book.testament === 'old');
  const newTestamentBooks = books.filter(book => book.testament === 'new');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            தமிழ் வேதாகமம்
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            பழைய ஏற்பாடு மற்றும் புதிய ஏற்பாடு
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="வேதாகம வசனங்களில் தேடவும்..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.trim().length >= 2 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              தேடல் முuள்கள்
            </h2>
            {searchLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-4 mb-8">
                {searchResults.map((result, index) => (
                  <Link
                    key={index}
                    to={`/bible/${result.bookId}/chapter/${result.chapterNumber}#verse-${result.verseNumber}`}
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                          {result.reference}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {result.text}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  முuள்கள் கிடைக்கவில்லை
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  "{searchQuery}" க்கான தேடல் முtuல்கள் கிடைக்கவில்லை.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Old Testament */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              பழைய ஏற்பாடு
            </h2>
            <div className="grid gap-3">
              {oldTestamentBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/bible/${book._id}`}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                      {book.order}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {book.tamilName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {book.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* New Testament */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              புதிய ஏற்பாடு
            </h2>
            <div className="grid gap-3">
              {newTestamentBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/bible/${book._id}`}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-semibold text-sm">
                      {book.order}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {book.tamilName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {book.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bible;