
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Mail } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const welcomeMessage = searchParams.get('message') === 'welcome';
  const userEmail = searchParams.get('email');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate('/dashboard');
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Please enter your full name",
            variant: "destructive"
          });
          return;
        }
        if (!username.trim()) {
          toast({
            title: "Error",
            description: "Please enter a username",
            variant: "destructive"
          });
          return;
        }

        const { error } = await signUp(email, password, fullName.trim(), username.trim());
        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setShowEmailSent(true);
          setEmail('');
          setPassword('');
          setFullName('');
          setUsername('');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (showEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-2xl text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-brand-600">Check Your Email</h1>
          </div>

          <Card className="border-brand-100">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to ZapDine!
              </h3>
              <p className="text-gray-600 mb-4">
                We've sent you a confirmation email with a warm welcome message. 
                Please check your inbox and click the confirmation link to activate your account.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                After confirming your email, you'll be redirected back here to login and start managing your restaurant.
              </p>
              <Button
                onClick={() => {
                  setShowEmailSent(false);
                  setIsLogin(true);
                }}
                className="w-full bg-brand-500 hover:bg-brand-600"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>

          <footer className="mt-8 text-center">
            <p className="text-gray-600">
              Powered by <span className="font-semibold text-brand-600">SPS Labs</span>
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">Z</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-600">ZapDine</h1>
          <p className="text-gray-600 mt-2">Restaurant Management Made Simple</p>
        </div>

        {/* Welcome Message */}
        {welcomeMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Welcome to ZapDine{userEmail ? `, ${userEmail.split('@')[0]}` : ''}! 
              Your account has been confirmed successfully. Please login below to start managing your restaurant.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-brand-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-brand-600">
              {isLogin ? 'Sign In to Your Account' : 'Create Your ZapDine Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required={!isLogin}
                      className="focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      required={!isLogin}
                      className="focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="focus:border-brand-500 focus:ring-brand-500"
                  minLength={6}
                />
                {!isLogin && (
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 transition-colors"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setFullName('');
                  setUsername('');
                }}
                className="text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Create one now" 
                  : "Already have an account? Sign in instead"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-gray-600">
            Powered by <span className="font-semibold text-brand-600">SPS Labs</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
