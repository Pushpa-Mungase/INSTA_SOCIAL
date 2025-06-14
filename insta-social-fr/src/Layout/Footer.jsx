import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
           
      <div className="relative px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Insta Social
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Your one-stop solution for scheduling and sharing content across
                  platforms. Simplify your workflow with ease and boost your social presence.
                </p>
              </div>
              
              {/* Stats or Features */}
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">50K+</div>
                  <div className="text-gray-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">1M+</div>
                  <div className="text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">99%</div>
                  <div className="text-gray-400">Uptime</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                <a href="/" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform">
                  Home
                </a>
                <a href="/features" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform">
                  Features
                </a>
                <a href="/pricing" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform">
                  Pricing
                </a>
                <a href="/about" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform">
                  About
                </a>
                <a href="/blog" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform">
                  Blog
                </a>
                <a href="/support" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform">
                  Support
                </a>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, color: "hover:text-blue-400", bg: "hover:bg-blue-400/20" },
                  { Icon: Twitter, color: "hover:text-sky-400", bg: "hover:bg-sky-400/20" },
                  { Icon: Instagram, color: "hover:text-pink-400", bg: "hover:bg-pink-400/20" },
                  { Icon: Linkedin, color: "hover:text-blue-500", bg: "hover:bg-blue-500/20" },
                  { Icon: Mail, color: "hover:text-purple-400", bg: "hover:bg-purple-400/20" }
                ].map(({ Icon, color, bg }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`p-3 rounded-full border border-gray-700 text-gray-300 ${color} ${bg} transition-all duration-300 hover:scale-110 hover:border-transparent`}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-white">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <button className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-black font-semibold rounded-r-lg transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <p>&copy; 2025 Insta Social. All rights reserved.</p>
                <div className="flex space-x-6">
                  <a href="/privacy" className="hover:text-purple-400 transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="hover:text-purple-400 transition-colors duration-300">
                    Terms of Service
                  </a>
                  <a href="/cookies" className="hover:text-purple-400 transition-colors duration-300">
                    Cookie Policy
                  </a>
                </div>
              </div>
              
              {/* <div className="text-sm text-gray-400">
                Made with <span className="text-red-400 animate-pulse">♥</span> for creators
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}