import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-white mb-4">
              <Book className="h-8 w-8" />
              <span className="text-xl font-bold">அருள்வாக்கு</span>
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
              தமிழ் கத்தோலிக்க சமூகத்திற்கான ஆன்மீக தளம். தினசரி வாசகங்கள், 
              வேதாகம வசனங்கள், செப விண்ணப்பங்கள் மற்றும் ஆன்மீக கட்டுரைகள் 
              இங்கே கிடைக்கும்.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@arulvakku.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+91-9876543210"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">விரைவு இணைப்புகள்</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/bible"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  வேதாகமம்
                </Link>
              </li>
              <li>
                <Link
                  to="/readings"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  தினசரி வாசகங்கள்
                </Link>
              </li>
              <li>
                <Link
                  to="/prayers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  செபக் கோரிக்கைகள்
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  கட்டுரைகள்
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">வளங்கள்</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  எங்களைப் பற்றி
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  தொடர்பு கொள்ளுங்கள்
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  தனியுரிமை கொள்கை
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  பயன்பாட்டு நிபந்தனைகள்
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} அருள்வாக்கு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 text-gray-400 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <span>தமிழ் கத்தோலிக்க சமூகத்திற்காக அன்புடன் உருவாக்கப்பட்டது</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;