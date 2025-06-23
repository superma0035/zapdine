
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, Users, Clock, Shield, ArrowRight, CheckCircle, Smartphone, QrCode, CreditCard } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: QrCode,
      title: "QR Code Ordering",
      description: "Customers scan QR codes to instantly access your menu and place orders"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Perfectly optimized for smartphones, tablets, and desktop devices"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with real-time order processing"
    }
  ];

  const benefits = [
    "Reduce wait times for customers",
    "Increase order accuracy",
    "Real-time order management",
    "Digital menu management",
    "Customer feedback system",
    "Analytics and insights",
    "Mobile-responsive design",
    "Secure payment processing"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">Z</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ZapDine
              </span>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Revolutionize Your
              <span className="block text-white/90">Restaurant Experience</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Transform your dining service with QR-powered ordering that delights customers and streamlines operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 rounded-xl font-semibold bg-transparent backdrop-blur-sm w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ZapDine?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Built for modern restaurants that want to provide exceptional dining experiences
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-orange-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 border border-orange-100">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Everything You Need to Succeed
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 sm:p-8 text-white">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 fill-current" />
                  <h4 className="text-xl font-semibold mb-2">Join 1000+ Restaurants</h4>
                  <p className="text-white/90 mb-6">Already using ZapDine to enhance their customer experience</p>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-white text-orange-600 hover:bg-gray-100 w-full shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started Today
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ZapDine Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Simple setup, powerful results
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Setup Your Restaurant</h3>
              <p className="text-gray-600 leading-relaxed">Create your profile, upload your menu, and generate QR codes for your tables in minutes.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Customers Scan & Order</h3>
              <p className="text-gray-600 leading-relaxed">Diners scan the QR code, browse your menu, and place orders directly from their phones.</p>
            </div>

            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Manage & Fulfill</h3>
              <p className="text-gray-600 leading-relaxed">Receive orders in real-time, track preparation, and deliver exceptional experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of restaurants already using ZapDine to create better dining experiences
          </p>
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">Z</span>
              </div>
              <h3 className="text-xl font-bold">ZapDine</h3>
            </div>
            <p className="text-gray-400 mb-4">Revolutionizing restaurant dining experiences</p>
            <p className="text-gray-500">
              Powered by <span className="font-semibold text-orange-500">SPS Labs</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
