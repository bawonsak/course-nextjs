const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2025 Your Company
      </footer>
    </div>
  );
}

export default AdminLayout;