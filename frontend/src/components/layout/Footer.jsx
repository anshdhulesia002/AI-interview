export const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 py-8 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Interview AI. All rights reserved.</p>
        <p className="mt-1">Empowering candidates through intelligent interview simulations.</p>
      </div>
    </footer>
  );
};
