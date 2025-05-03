
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthCard from '@/components/auth/AuthCard';
import { 
  Camera, 
  CheckCircle, 
  DollarSign, 
  Briefcase,
  Users,
  BarChart,
  Menu,
  CalendarRange
} from 'lucide-react';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const features = [
    {
      title: "Easy Booking Management",
      description: "Manage all your client appointments in one place",
      icon: <CalendarRange className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Track Expenses & Revenue",
      description: "Get a clear picture of your business finances",
      icon: <BarChart className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Professional Invoicing",
      description: "Create and send beautiful invoices to your clients",
      icon: <DollarSign className="h-10 w-10 text-rose-500" />
    },
    {
      title: "User Management",
      description: "Manage your team members with different permission levels",
      icon: <Users className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Service Type Management",
      description: "Define your services and their pricing",
      icon: <Briefcase className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Bank Account Tracking",
      description: "Keep track of all your business bank accounts in one place",
      icon: <CheckCircle className="h-10 w-10 text-rose-500" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-rose-600">Business Manager</Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-rose-500">Features</a>
            <a href="#about" className="text-gray-600 hover:text-rose-500">About</a>
            {user ? (
              <Link to="/dashboard" className="text-rose-600 hover:text-rose-700">Dashboard</Link>
            ) : (
              <Link to="/login" className="text-rose-600 hover:text-rose-700">Login</Link>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-2">
            <div className="container mx-auto px-4 flex flex-col space-y-2">
              <a href="#features" className="py-2 text-gray-600 hover:text-rose-500">Features</a>
              <a href="#about" className="py-2 text-gray-600 hover:text-rose-500">About</a>
              {user ? (
                <Link to="/dashboard" className="py-2 text-rose-600 hover:text-rose-700">Dashboard</Link>
              ) : (
                <Link to="/login" className="py-2 text-rose-600 hover:text-rose-700">Login</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Login/Signup Card */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Complete Business Management Solution
              </h1>
              <p className="text-lg mb-6 text-gray-600">
                Streamline your business operations with our all-in-one platform for bookings, finances, and customer management.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" asChild>
                  <Link to={user ? "/dashboard" : "#features"}>Explore Features</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <AuthCard />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Business dashboard" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h2 className="text-3xl font-bold mb-6">About This Platform</h2>
              <p className="text-gray-600 mb-4">
                Our business management platform is designed for independent professionals and small businesses 
                in the service industry. We help you handle appointments, track finances, and manage your client 
                relationships all in one place.
              </p>
              <p className="text-gray-600 mb-6">
                Built with modern technology and a user-friendly interface, our platform eliminates the 
                need for multiple disconnected tools, saving you time and reducing administrative overhead.
              </p>
              <Button asChild>
                <Link to="/login">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Business Manager</h3>
              <p className="mt-1 text-gray-300">Simplify your business operations</p>
            </div>
            <div className="flex space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white">About</a>
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Business Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
