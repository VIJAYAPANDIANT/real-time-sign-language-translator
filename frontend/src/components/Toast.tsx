
import { useToast } from '../contexts/ToastContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-green-500" />,
          error: <AlertCircle className="w-5 h-5 text-red-500" />,
          info: <Info className="w-5 h-5 text-blue-500" />,
        };
        
        const bgs = {
          success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        };

        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 border rounded-lg shadow-lg min-w-[300px] ${bgs[toast.type]}`}
            role="alert"
          >
            <div className="flex-shrink-0 mr-3">{icons[toast.type]}</div>
            <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
