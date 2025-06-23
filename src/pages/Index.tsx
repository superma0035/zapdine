
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, QrCode, BarChart3, Users, Star, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode className="h-8 w-8 text-orange-600" />,
      title: "QR Code Ordering",
      description: "Customers scan QR codes at their table to instantly access your digital menu and place orders."
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      title: "Digital Menu Management", 
      description: "Easy-to-use dashboard to add, edit, and organize your menu items with photos and descriptions."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Real-time Analytics",
      description: "Track orders, revenue, and customer preferences with comprehensive reporting tools."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Table Management",
      description: "Organize your restaurant layout and track orders by table for efficient service."
    }
  ];

  const benefits = [
    "Reduce wait times and improve customer experience",
    "Eliminate printing costs for physical menus", 
    "Increase order accuracy with digital ordering",
    "Boost revenue with data-driven insights",
    "Streamline operations with automated workflows"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">Z</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">ZapDine</span>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Restaurant with
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> Digital Ordering</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            ZapDine revolutionizes restaurant operations with QR code menus, seamless ordering, and powerful analytics. 
            Join thousands of restaurants already boosting efficiency and customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-medium transition-all duration-200 text-lg"
            >
              Watch Demo
            </Button>
          </div>
          
          {/* Trial Banner */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg p-4 mb-12 inline-block">
            <div className="flex items-center gap-2 text-green-800">
              <Star className="h-5 w-5 text-green-600" />
              <span className="font-semibold">14-Day Free Trial</span>
              <span className="text-green-700">• No Credit Card Required • Full Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive restaurant management tools designed to increase efficiency and customer satisfaction.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Restaurants Choose ZapDine</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="lg:text-right">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">10,000+</div>
                  <div className="text-gray-700 mb-6">Restaurants Trust ZapDine</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-2xl text-gray-900">98%</div>
                      <div className="text-gray-600">Customer Satisfaction</div>
                    </div>
                    <div>
                      <div className="font-bold text-2xl text-gray-900">45%</div>
                      <div className="text-gray-600">Revenue Increase</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful restaurants using ZapDine to streamline operations and delight customers.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-4 text-sm opacity-75">
            14-day free trial • No setup fees • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">Z</span>
                </div>
                <span className="text-xl font-bold">ZapDine</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing restaurant operations with smart digital solutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ZapDine. All rights reserved.</p>
            <p className="mt-2">
              Powered by <a href="https://spslabs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">SPS Labs</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
