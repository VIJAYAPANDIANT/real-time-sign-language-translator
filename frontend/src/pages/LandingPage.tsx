
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, Globe } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
            Break the silence with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Real-Time ASL
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Instantly translate American Sign Language into text and speech using just your webcam. Powered by advanced computer vision and AI.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/translate')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Translating
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-full text-lg transition-all"
            >
              View Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No Extra Hardware</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Works directly in your browser using any standard webcam. No specialized gloves or cameras required.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-500 dark:text-gray-400">
              State-of-the-art WebSockets stream video frames for near-instantaneous translation feedback.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Accessible Design</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Built with large text, high contrast, text-to-speech, and full keyboard navigation in mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
