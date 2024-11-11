// components/Layout.js
export default function Layout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
