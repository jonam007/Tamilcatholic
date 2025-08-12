import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Calendar, Heart, FileText, Search, ArrowRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      name: 'தமிழ் வேதாகமம்',
      description: 'முழு வேதாகமம் தமிழில் படித்து, தேடி, அத்தியாயம் வாரியாக உலாவவும்',
      icon: Book,
      href: '/bible',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      name: 'தினசரி வாசகங்கள்',
      description: 'ஒவ்வொரு நாளுக்கும் முதல் வாசகம், நற்செய்தி வாசகம் மற்றும் பதிலுரைப் பாடல்',
      icon: Calendar,
      href: '/readings',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      name: 'செபக் கோரிக்கைகள்',
      description: 'உங்கள் செப விண்ணப்பங்களை சமர்ப்பித்து, மற்றவர்களுக்காகவும் செபிக்கவும்',
      icon: Heart,
      href: '/prayers',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      name: 'ஆன்மீக கட்டுரைகள்',
      description: 'அர்થமுள்ள ஆன்மீக கட்டுரைகள், சிந்தனைகள் மற்றும் போதனைகள்',
      icon: FileText,
      href: '/blog',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  const todayReading = {
    date: new Date().toLocaleDateString('ta-IN'),
    firstReading: 'ஏசாயா 55:10-11',
    psalm: 'திருப்பாடல் 65:10-14',
    gospel: 'மத்தேயு 13:1-23'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              அருள்வாக்கு
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              தமிழ் கத்தோலிக்க சமூகத்திற்கான ஆன்மீக தளம்
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              வேதாகமம், தினசரி வாசகங்கள், செப விண்ணப்பங்கள் மற்றும் ஆன்மீக வளர்ச்சிக்கான அனைத்தும் ஒரே இடத்தில்
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/readings"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                இன்றைய வாசகங்கள்
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/bible"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-lg font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                வேதாகமம் படிக்க
                <Book className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-cyan-200 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>
      </section>

      {/* Today's Reading Quick Access */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              இன்றைய வாசகங்கள்
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {todayReading.date}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
                    <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">முதல் வாசகம்</h3>
                  <p className="text-gray-600 dark:text-gray-300">{todayReading.firstReading}</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                    <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">பதிலுரைப் பாடல்</h3>
                  <p className="text-gray-600 dark:text-gray-300">{todayReading.psalm}</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                    <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">நற்செய்தி</h3>
                  <p className="text-gray-600 dark:text-gray-300">{todayReading.gospel}</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Link
                  to="/readings"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  முழு வாசகம் படிக்க
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              எங்கள் சேவைகள்
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              உங்கள் ஆன்மீக பயணத்திற்கான அனைத்து வளங்களும் ஒரே இடத்தில்
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.name}
                  to={feature.href}
                  className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className={`h-5 w-5 ${feature.color}`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            இன்றே தொடங்குங்கள்
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            உங்கள் ஆன்மீக வளர்ச்சிக்கான பயணத்தை இன்றே ஆரம்பிக்கவும்
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/prayers"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              செப விண்ணப்பம் அனுப்பவும்
              <Heart className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
            >
              கட்டுரைகள் படிக்க
              <FileText className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;