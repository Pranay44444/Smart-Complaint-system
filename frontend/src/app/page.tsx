import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Smart Complaint</h1>
        <p className="text-gray-600 text-lg mb-8">The intelligent platform to manage and resolve issues.</p>
        
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </Link>
          
          <Link 
            href="/register/org" 
            className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register your Organization
          </Link>
        </div>
      </div>
    </div>
  );
}
