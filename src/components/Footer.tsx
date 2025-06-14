
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              DSA Mastery Hub
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your ultimate destination for mastering Data Structures and Algorithms. 
              From beginner to expert, we provide all the resources you need for interview success.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Problem Sheets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Code Playground</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Progress Tracker</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Interview Prep</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">DSA Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Articles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cheat Sheets</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 DSA Mastery Hub. Made with ❤️ for the coding community.
          </p>
        </div>
      </div>
    </footer>
  );
};
