import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
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
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-[#8e51ff] group-hover:text-purple-900 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full group-hover:bg-purple-300/30 transition-all duration-300"></div>
                  </div>
                  <span className="text-xl font-bold text-[#8e51ff]">
                    INSTA-SOCIAL
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed pt-1">
                  Your one-stop solution for scheduling and sharing content across
                  platforms. Simplify your workflow with ease and boost your social presence.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                <a href="/" className="!text-white opacity-[0.5] transition-colors  duration-300 hover:translate-x-1 transform">
                  Home
                </a>
                <a href="/features" className="!text-white opacity-[0.5]  transition-colors duration-300 hover:translate-x-1 transform">
                  Features
                </a>
                <a href="/pricing" className="!text-white opacity-[0.5]  transition-colors duration-300 hover:translate-x-1 transform">
                  Pricing
                </a>
                <a href="/about" className="!text-white opacity-[0.5]  transition-colors duration-300 hover:translate-x-1 transform">
                  About
                </a>
                <a href="/blog" className="!text-white opacity-[0.5]  transition-colors duration-300 hover:translate-x-1 transform">
                  Blog
                </a>
                <a href="/support" className="!text-white opacity-[0.5]  transition-colors duration-300 hover:translate-x-1 transform">
                  Support
                </a>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>

              {/* Social Icons */}
              <div className="flex space-x-4 text-white">
                {[
                  { Icon: Facebook },
                  { Icon: Twitter  },
                  { Icon: Instagram },
                  { Icon: Linkedin  },
                  { Icon: Mail}
                ].map(({ Icon, color, bg }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`p-3 rounded-full border border-gray-700 text-gray-300 ${color} ${bg} transition-all duration-300 hover:scale-110 hover:border-transparent`}
                  >
                    <Icon size={20} className="text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <p>&copy; 2025 Insta Social. All rights reserved.</p>
                <div className="flex space-x-6 !text-gray-400">
                  <a href="/privacy" className="!text-gray-400 hover:!text-gray-300 transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="!text-gray-400 hover:!text-gray-300 transition-colors duration-300">
                    Terms of Service
                  </a>
                  <a href="/cookies" className="!text-gray-400 hover:!text-gray-300 transition-colors duration-300">
                    Cookie Policy
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}