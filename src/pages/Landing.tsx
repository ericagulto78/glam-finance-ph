
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthCard from '@/components/auth/AuthCard';
import { 
  Calculator,
  Briefcase,
  Users,
  BarChart,
  Menu,
  CalendarRange,
  CheckCircle,
  ChevronRight,
  Clock,
  Building
} from 'lucide-react';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const features = [
    {
      title: "Efficient Booking Management",
      description: "Manage all your client appointments in one intuitive dashboard",
      icon: <CalendarRange className="h-10 w-10 text-indigo-600" />
    },
    {
      title: "Financial Analytics",
      description: "Get real-time insights on your business performance with advanced analytics",
      icon: <BarChart className="h-10 w-10 text-indigo-600" />
    },
    {
      title: "Professional Invoicing",
      description: "Create and deliver branded invoices that get you paid faster",
      icon: <Calculator className="h-10 w-10 text-indigo-600" />
    },
    {
      title: "Team Collaboration",
      description: "Manage your team with customizable permission levels and tasks",
      icon: <Users className="h-10 w-10 text-indigo-600" />
    },
    {
      title: "Service Portfolio",
      description: "Define and optimize your service offerings and pricing structure",
      icon: <Briefcase className="h-10 w-10 text-indigo-600" />
    },
    {
      title: "Payment Tracking",
      description: "Keep track of all your payments and financial accounts in one place",
      icon: <CheckCircle className="h-10 w-10 text-indigo-600" />
    }
  ];

  const testimonials = [
    {
      quote: "This platform has transformed how I manage my studio. The financial insights alone have saved me hours of work every week.",
      name: "Sarah Johnson",
      role: "Photography Studio Owner"
    },
    {
      quote: "The booking system is intuitive and my clients love the professional experience from start to finish.",
      name: "Michael Chen",
      role: "Independent Consultant"
    },
    {
      quote: "Being able to manage my team and track our performance in one place has been a game-changer for our growing business.",
      name: "Alessandra Rodriguez",
      role: "Agency Director"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Business Manager</span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Testimonials</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</a>
            {user ? (
              <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">Dashboard</Link>
            ) : (
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Login</Link>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-2">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <a href="#features" className="py-2 text-gray-600 hover:text-indigo-600 font-medium">Features</a>
              <a href="#testimonials" className="py-2 text-gray-600 hover:text-indigo-600 font-medium">Testimonials</a>
              <a href="#about" className="py-2 text-gray-600 hover:text-indigo-600 font-medium">About</a>
              {user ? (
                <Link to="/dashboard" className="py-2 text-indigo-600 hover:text-indigo-700 font-medium">Dashboard</Link>
              ) : (
                <Link to="/login" className="py-2 text-indigo-600 hover:text-indigo-700 font-medium">Login</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Login/Signup Card */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                Run Your Business <span className="text-indigo-600">Smarter</span>, Not Harder
              </h1>
              <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                The all-in-one platform designed for service professionals to streamline operations, 
                increase revenue, and deliver exceptional client experiences.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  <Link to="/register" className="flex items-center">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <a href="#features" className="flex items-center">
                    Learn More
                  </a>
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
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Business Growth</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to manage and scale your service business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white">
                <div className="flex flex-col">
                  <div className="mb-4 bg-indigo-50 p-3 rounded-lg w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of businesses that are growing with our platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-md">
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="36" fill="currentColor" viewBox="0 0 45 36">
                      <path d="M13.415.43c-2.523-.092-4.825.63-6.94 1.546C2.368 3.398 0 7.794 0 12.213c0 5.568 4.432 10 10 10 5.568 0 10-4.432 10-10s-4.432-10-10-10c-.173 0-.345.003-.516.009-1.347.085-2.68.37-3.94.84 2.7-1.27 5.8-1.83 8.88-.93 3.08.9 5.67 3.48 6.58 6.55.06.26.08.52.08.78.07 2.16-.86 4.29-2.49 5.69-1.62 1.39-3.8 2.08-5.97 1.88V20c1.41.12 2.83-.22 4.07-1.01 1.24-.79 2.16-1.98 2.58-3.34.52-1.36.5-2.85-.01-4.19-1.03-2.71-3.13-4.61-5.87-5.32-2.73-.7-5.7.02-8 1.92.4-.88 1.08-1.55 1.93-1.93.85-.37 1.78-.43 2.66-.17-.37-.54-.88-.92-1.52-1.09s-1.3-.03-1.86.28c-1.13.6-1.93 1.73-2.18 3-.25 1.27.01 2.58.7 3.7h1.79c.38 0 .72-.24.84-.6.17-.51.53-.94 1.01-1.19.48-.24 1.04-.28 1.56-.1.51.18.94.57 1.15 1.08.22.51.22 1.09 0 1.6-.22.51-.64.9-1.15 1.08-.52.18-1.08.14-1.56-.1-.48-.25-.84-.67-1.01-1.19-.12-.36-.47-.6-.84-.6h-1.8c-.91 1.26-1.24 2.9-.91 4.44.34 1.53 1.33 2.83 2.68 3.53 2.44 1.26 5.37.86 7.51-1.01 2.15-1.87 2.87-4.95 1.8-7.6.23.17.46.36.68.55 1.47 1.34 2.18 3.34 1.85 5.29-.32 1.95-1.7 3.63-3.54 4.35 0 .06 0 .12-.01.18C23.86 19.66 28.89 15.45 29 10c.06-2.94-1.12-5.78-3.25-7.86-2.14-2.08-5-3.17-7.92-3.05-.81.02-1.62.11-2.42.26V.43h-1.99Z"/>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-1 italic">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Business dashboard on laptop" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">About Our Platform</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our business management platform is designed specifically for service professionals 
                and small businesses. We combine powerful technology with intuitive design to help you 
                manage appointments, track finances, and grow your client relationships - all in one place.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Save Time</h3>
                    <p className="mt-1 text-gray-600">Automate repetitive tasks and reduce administrative overhead</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Improve Client Experience</h3>
                    <p className="mt-1 text-gray-600">Deliver a seamless, professional experience from booking to payment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <BarChart className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Grow Your Revenue</h3>
                    <p className="mt-1 text-gray-600">Make data-driven decisions with real-time business insights</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  <Link to="/register">Start Your Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to grow your business?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-indigo-100">
            Join thousands of service professionals who are streamlining their operations and increasing revenue.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
              <Link to="/register">Sign Up Free</Link>
            </Button>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold">Business Manager</span>
              </Link>
              <p className="mt-4 text-gray-400 max-w-md">
                The all-in-one platform for service professionals to streamline operations, 
                increase revenue, and deliver exceptional client experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Business Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
