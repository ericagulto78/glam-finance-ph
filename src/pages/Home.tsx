
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, DollarSign, ChartPieIcon, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        // Fetch the business profile of the admin user to display on homepage
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .limit(1)
          .single();
          
        if (!error && data) {
          setBusinessProfile(data);
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
      }
    };
    
    fetchBusinessProfile();
  }, []);
  
  // If user is logged in, redirect them to dashboard
  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">You're already logged in!</h1>
          <p className="mb-6">Redirecting you to your dashboard...</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-rose to-gold-light py-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {businessProfile?.name || "Business Manager"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Streamline your business operations with our all-in-one management platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="font-semibold px-8">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="font-semibold px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-rose/20 p-3 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-rose-dark" />
              </div>
              <h3 className="text-xl font-medium mb-2">Booking Management</h3>
              <p className="text-muted-foreground">Easily schedule and manage all your client appointments</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-gold/20 p-3 rounded-full mb-4">
                <DollarSign className="h-6 w-6 text-gold-dark" />
              </div>
              <h3 className="text-xl font-medium mb-2">Financial Tracking</h3>
              <p className="text-muted-foreground">Monitor your income, expenses, and generate reports</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-rose/20 p-3 rounded-full mb-4">
                <ChartPieIcon className="h-6 w-6 text-rose-dark" />
              </div>
              <h3 className="text-xl font-medium mb-2">Business Analytics</h3>
              <p className="text-muted-foreground">Gain insights with powerful data visualization tools</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-gold/20 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-gold-dark" />
              </div>
              <h3 className="text-xl font-medium mb-2">Client Management</h3>
              <p className="text-muted-foreground">Maintain client records and build stronger relationships</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Our Platform</h2>
              <p className="mb-4 text-muted-foreground">
                {businessProfile?.name || "Business Manager"} is designed specifically for service-based businesses. 
                Our platform helps streamline operations, boost productivity, and increase profitability.
              </p>
              <p className="mb-6 text-muted-foreground">
                Whether you're a solo entrepreneur or manage a team, our tools adapt to your needs
                and grow with your business.
              </p>
              <Link to="/register">
                <Button className="flex items-center gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="bg-card p-6 rounded-lg shadow border">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Contact Information</h3>
                {businessProfile && (
                  <div className="space-y-2 text-muted-foreground">
                    {businessProfile.name && <p><span className="font-medium">Business:</span> {businessProfile.name}</p>}
                    {businessProfile.email && <p><span className="font-medium">Email:</span> {businessProfile.email}</p>}
                    {businessProfile.phone && <p><span className="font-medium">Phone:</span> {businessProfile.phone}</p>}
                    {businessProfile.website && <p><span className="font-medium">Website:</span> {businessProfile.website}</p>}
                    {businessProfile.address && <p><span className="font-medium">Address:</span> {businessProfile.address}</p>}
                  </div>
                )}
                {!businessProfile && (
                  <p className="text-muted-foreground">Contact information will be available soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card py-8 px-6 border-t mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {businessProfile?.name || "Business Manager"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
