import { Link } from "react-router-dom";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaRobot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br bg-blue-100 pt-20 pb-12 mt-0.5 text-center">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 items-center justify-center">
          {/* Logo and about */}
          <div className="col-span-1  text-center">
            <div className="flex items-center  justify-center gap-2 mb-4">
              <FaRobot className="text-blue-500 h-8 w-8" />
              <span className="text-2xl font-bold">AI Interview</span>
            </div>
            <p className="text-gray-600 text-base mb-6 mx-auto max-w-md">
              Transform your interview skills with AI-powered coaching. Get personalized practice and feedback to land your dream job.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center transition-transform hover:scale-110">
                <FaFacebookF size={18} color="white" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center transition-transform hover:scale-110">
                <FaXTwitter size={18} color="white" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center transition-transform hover:scale-110">
                <FaInstagram size={18} color="white" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center transition-transform hover:scale-110">
                <FaLinkedinIn size={18} color="white" />
              </a>
            </div>
          </div>

          {/* Navigation - Platform */}
          <div className="col-span-1 text-center">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">How it Works</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Pricing</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">FAQ</Link></li>
              <li><Link to="/demo" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Try Demo</Link></li>
            </ul>
          </div>

          {/* Navigation - Company */}
          <div className="col-span-1 text-center">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Press</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors duration-300 text-base">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom footer with copyright */}
        <div className="pt-8 border-t border-gray-300 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600 mb-4">© {new Date().getFullYear()} AI Interview. All rights reserved.</p>
          <p className="text-sm text-gray-600 mb-4"><Link to="/team">Made with ❤️ by AI Interview Team</Link></p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300">Terms of Service</Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;