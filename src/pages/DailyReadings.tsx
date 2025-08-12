import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Book, Star, Heart, Download } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { readingsAPI } from '../services/api';
import { format } from 'date-fns';

interface Reading {
  _id: string;
  date: Date;
  season: string;
  firstReading: {
    title: string;
    reference: string;
    text: string;
  };
  responsorialPsalm: {
    title: string;
    reference: string;
    text: string;
    response: string;
  };
  gospelAcclamation: {
    verse: string;
    text: string;
  };
  gospel: {
    title: string;
    reference: string;
    text: string;
  };
  reflection?: string;
}

const DailyReadings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReading(selectedDate);
  }, [selectedDate]);

  const fetchReading = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const response = await readingsAPI.getReadingsByDate(dateString);
      if (response.success) {
        setReading(response.reading);
      } else {
        setReading(null);
      }
    } catch (error: any) {
      console.error('Error fetching reading:', error);
      setError(error.message || 'வாசகம் பெற முடியவில்லை');
      setReading(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | Date[]) => {
    if (date instanceof Date) {
      setSelectedDate(date);
    }
  };

  const downloadPDF = async () => {
    if (!reading) return;
    
    // This would integrate with the backend PDF generation
    try {
      const response = await fetch(`/api/readings/${reading._id}/pdf`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `daily-reading-${format(selectedDate, 'yyyy-MM-dd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            தினசரி வாசகங்கள்
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            ஒவ்வொரு நாளுக்கும் நிர்ணயிக்கப்பட்ட வாசகங்கள்
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                நாள் தேர்ந்தெடுக்கவும்
              </h2>
              <div className="calendar-container">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="w-full border-0 bg-transparent"
                  tileClassName={({ date, view }) => {
                    if (view === 'month') {
                      const today = new Date();
                      if (date.toDateString() === today.toDateString()) {
                        return 'bg-indigo-600 text-white rounded-lg';
                      }
                      if (date.toDateString() === selectedDate.toDateString()) {
                        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 rounded-lg';
                      }
                    }
                    return '';
                  }}
                />
              </div>
              
              {/* Selected Date Info */}
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">
                  தேர்ந்தெடுக்கப்பட்ட நாள்
                </h3>
                <p className="text-indigo-700 dark:text-indigo-300 mt-1">
                  {selectedDate.toLocaleDateString('ta-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Readings Content */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  வாசகம் கிடைக்கவில்லை
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {error}
                </p>
              </div>
            ) : reading ? (
              <div className="space-y-6">
                {/* Header with Season and Download */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedDate.toLocaleDateString('ta-IN', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h2>
                      <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-1">
                        {reading.season}
                      </p>
                    </div>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* First Reading */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        முதல் வாசகம்
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {reading.firstReading.reference}
                      </p>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {reading.firstReading.text}
                    </p>
                  </div>
                </div>

                {/* Responsorial Psalm */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        பதிலுரைப் பாடல்
                      </h3>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        {reading.responsorialPsalm.reference}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      பதில்: {reading.responsorialPsalm.response}
                    </p>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {reading.responsorialPsalm.text}
                    </p>
                  </div>
                </div>

                {/* Gospel Acclamation */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        நற்செய்திக்கு முன் வாழ்த்தொலி
                      </h3>
                      <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                        {reading.gospelAcclamation.verse}
                      </p>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {reading.gospelAcclamation.text}
                    </p>
                  </div>
                </div>

                {/* Gospel */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        நற்செய்தி வாசகம்
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        {reading.gospel.reference}
                      </p>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {reading.gospel.text}
                    </p>
                  </div>
                </div>

                {/* Reflection */}
                {reading.reflection && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      சிந்தனை
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                        {reading.reflection}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  வாசகம் கிடைக்கவில்லை
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  தேர்ந்தெடுக்கப்பட்ட நாளுக்கு வாசகம் கிடைக்கவில்லை.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReadings;