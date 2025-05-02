
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  User, 
  Camera, 
  CheckCircle, 
  DollarSign, 
  HeartHandshake, 
  Menu 
} from 'lucide-react';

const Landing: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const features = [
    {
      title: "Book Online",
      description: "Schedule your makeup session at your convenience",
      icon: <Calendar className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Personalized Experience",
      description: "Services tailored to your unique style and preferences",
      icon: <User className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Professional Results",
      description: "Look your best with our expert makeup artists",
      icon: <Camera className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Satisfaction Guaranteed",
      description: "We ensure you're happy with our services",
      icon: <CheckCircle className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Competitive Pricing",
      description: "Quality services at affordable rates",
      icon: <DollarSign className="h-10 w-10 text-rose-500" />
    },
    {
      title: "Customer Support",
      description: "We're always here to help with your questions",
      icon: <HeartHandshake className="h-10 w-10 text-rose-500" />
    }
  ];

  const services = [
    {
      name: "Bridal Makeup",
      description: "Make your special day even more memorable with our professional bridal makeup services.",
      price: "₱5,000+"
    },
    {
      name: "Special Occasion",
      description: "Perfect for parties, photoshoots, or any event where you want to look your best.",
      price: "₱3,500+"
    },
    {
      name: "Daily Makeup",
      description: "Everyday makeup that enhances your natural beauty for work or casual outings.",
      price: "₱1,500+"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-rose-600">Makeup Studio</Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#services" className="text-gray-600 hover:text-rose-500">Services</a>
            <a href="#about" className="text-gray-600 hover:text-rose-500">About</a>
            <a href="#contact" className="text-gray-600 hover:text-rose-500">Contact</a>
            {user ? (
              <Link to="/bookings" className="text-rose-600 hover:text-rose-700">My Account</Link>
            ) : (
              <Link to="/login" className="text-rose-600 hover:text-rose-700">Login</Link>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-2">
            <div className="container mx-auto px-4 flex flex-col space-y-2">
              <a href="#services" className="py-2 text-gray-600 hover:text-rose-500">Services</a>
              <a href="#about" className="py-2 text-gray-600 hover:text-rose-500">About</a>
              <a href="#contact" className="py-2 text-gray-600 hover:text-rose-500">Contact</a>
              {user ? (
                <Link to="/bookings" className="py-2 text-rose-600 hover:text-rose-700">My Account</Link>
              ) : (
                <Link to="/login" className="py-2 text-rose-600 hover:text-rose-700">Login</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Professional Makeup Services for Every Occasion
              </h1>
              <p className="text-lg mb-6 text-gray-600">
                Our team of expert makeup artists will help you look and feel your best
                for any event, from weddings to photoshoots.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" asChild>
                  <Link to={user ? "/bookings" : "/login"}>Book Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#services">View Services</a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1457972729786-0411a3b2b626?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Makeup services" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
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

      {/* Services */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-rose-600">{service.price}</span>
                  <Button variant="outline" asChild>
                    <Link to={user ? "/bookings" : "/login"}>Book Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="About us" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h2 className="text-3xl font-bold mb-6">About Our Studio</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2015, our makeup studio has been providing exceptional beauty services
                to clients for various occasions. Our team of professional makeup artists is dedicated
                to enhancing your natural beauty and making you feel confident.
              </p>
              <p className="text-gray-600 mb-6">
                We use only high-quality, cruelty-free products and stay updated with the latest
                trends and techniques in the beauty industry to ensure you receive the best service possible.
              </p>
              <Button asChild>
                <Link to="/login">Join Our Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <p className="text-gray-600 mb-4">
                    Have questions about our services or want to book an appointment?
                    Contact us through any of the following:
                  </p>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-700">
                      <span className="mr-2">📱</span> +63 912 345 6789
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="mr-2">📧</span> contact@makeupstudio.com
                    </p>
                    <p className="flex items-center text-gray-700">
                      <span className="mr-2">📍</span> 123 Beauty Lane, Manila, Philippines
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sunday</span>
                      <span>10:00 AM - 3:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t">
                <Button className="w-full" size="lg">
                  <Link to={user ? "/bookings" : "/login"}>Book an Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Makeup Studio</h3>
              <p className="mt-1 text-gray-300">Making you beautiful since 2015</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white">Pinterest</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Makeup Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
