import React, { useState, useEffect } from 'react';
import { Heart, Send, Filter, Clock, MapPin, User } from 'lucide-react';
import { prayersAPI } from '../services/api';
import { toast } from 'react-toastify';

interface Prayer {
  _id: string;
  name: string;
  location: string;
  intention: string;
  category: string;
  createdAt: string;
  isUrgent?: boolean;
}

interface PrayerFormData {
  name: string;
  location: string;
  intention: string;
  category: string;
  email?: string;
}

const PrayerRequests: React.FC = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<PrayerFormData>({
    name: '',
    location: '',
    intention: '',
    category: 'other',
    email: ''
  });

  const categories = [
    { id: 'all', name: 'அனைத்தும்', color: 'gray' },
    { id: 'health', name: 'உடல்நலம்', color: 'red' },
    { id: 'family', name: 'குடும்பம்', color: 'blue' },
    { id: 'work', name: 'வேலை', color: 'green' },
    { id: 'studies', name: 'கல்வி', color: 'yellow' },
    { id: 'spiritual', name: 'ஆன்மீகம்', color: 'purple' },
    { id: 'other', name: 'பிற', color: 'gray' }
  ];

  useEffect(() => {
    fetchPrayers();
  }, [currentPage, selectedCategory]);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const response = await prayersAPI.getPrayers(currentPage, 10, selectedCategory);
      if (response.success) {
        setPrayers(response.prayers);
        setTotalPages(response.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching prayers:', error);
      toast.error('செப கோरிக்கைகளை பெற முடியவில்லை');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location.trim() || !formData.intention.trim()) {
      toast.error('அனைத்து தேவையான புலங்களையும் நிரப்பவும்');
      return;
    }

    setSubmitting(true);
    try {
      const response = await prayersAPI.submitPrayer(formData);
      if (response.success) {
        toast.success('உங்கள் செப கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது');
        setFormData({
          name: '',
          location: '',
          intention: '',
          category: 'other',
          email: ''
        });
        setShowSubmitForm(false);
      }
    } catch (error: any) {
      console.error('Error submitting prayer:', error);
      toast.error(error.message || 'செப கோரிக்கையை சமர்ப்பிக்க முடியவில்லை');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'gray';
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            செப கோரிக்கைகள்
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            ஒருவருக்காக ஒருவர் செபிக்கும் சமூகம்
          </p>
          
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            <Send className="h-5 w-5" />
            <span>செப கோரிக்கை அனுப்பவும்</span>
          </button>
        </div>

        {/* Submit Form */}
        {showSubmitForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              செப கோரிக்கை சமர்ப்பிக்கவும்
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  பெயர் *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="உங்கள் பெயர்"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  இடம் *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="உங்கள் ஊர்/மாநிலம்"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  வகை
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {categories.filter(cat => cat.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ইমেইল (விருchaoppional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="your@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  செப கோரிक்கை *
                </label>
                <textarea
                  name="intention"
                  value={formData.intention}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="நீங்கள் எதற்காக செபிக்க வேண்டும் என்று விரும்புகிறீர்கள்?"
                />
              </div>

              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>சமர்ப்பித்து கொண்டிருchaます...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>சமர்ப்பிக்கவும்</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  ரத்து செய்
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">வகைப்படி தேர்வு</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prayers List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : prayers.length > 0 ? (
          <>
            <div className="grid gap-6 mb-8">
              {prayers.map((prayer) => (
                <div
                  key={prayer._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="flex items-center text-gray-600 dark:text-gray-400">
                            <User className="h-4 w-4 mr-1" />
                            {prayer.name}
                          </span>
                          <span className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {prayer.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(prayer.category)}-100 dark:bg-${getCategoryColor(prayer.category)}-900 text-${getCategoryColor(prayer.category)}-800 dark:text-${getCategoryColor(prayer.category)}-200`}>
                            {getCategoryName(prayer.category)}
                          </span>
                          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(prayer.createdAt).toLocaleDateString('ta-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {prayer.intention}
                    </p>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center italic">
                    இந்த நோக்கத்திற்காக செபிக்கவும் 🙏
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  முன்
                </button>
                
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  பக்கம் {currentPage} / {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  அடுത்து
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              செப கோரிக்கைகள் இல்லை
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              தேர்ந்தெடுக்கப்பட்ட வகையில் செப கோரிக்கைகள் இல்லை.
            </p>
            <button
              onClick={() => setShowSubmitForm(true)}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Send className="h-5 w-5" />
              <span>முதல் கோரிக்கையை அனுப்பவும்</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequests;