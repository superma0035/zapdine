
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Mail, Phone, User, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [showResetSent, setShowResetSent] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'phone' | 'username'>('email');
  const [searchParams] = useSearchParams();
  const { signIn, signUp, signInWithPhone, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  const welcomeMessage = searchParams.get('message') === 'welcome';
  const resetMessage = searchParams.get('message') === 'reset';
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
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Reset Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          setShowResetSent(true);
          setEmail('');
        }
      } else if (isLogin) {
        let result;
        if (loginType === 'phone') {
          result = await signInWithPhone(identifier, password);
        } else {
          result = await signIn(identifier, password);
        }
        
        if (result.error) {
          toast({
            title: "Login Failed",
            description: result.error.message,
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

        const { error } = await signUp(email, password, fullName.trim(), username.trim(), phone || undefined);
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
          setPhone('');
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

  const resetForm = () => {
    setIsLogin(true);
    setIsForgotPassword(false);
    setShowEmailSent(false);
    setShowResetSent(false);
    setEmail('');
    setPassword('');
    setFullName('');
    setUsername('');
    setPhone('');
    setIdentifier('');
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
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  🎉 Your 14-day free trial starts now! After confirming your email, you'll have full access to all features.
                  Don't forget to upgrade before your trial ends to keep your data and continue using ZapDine.
                </AlertDescription>
              </Alert>
              <Button
                onClick={resetForm}
                className="w-full bg-brand-500 hover:bg-brand-600"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>

          <footer className="mt-8 text-center">
            <p className="text-gray-600">
              Powered by <a href="https://spslabs.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">SPS Labs</a>
            </p>
          </footer>
        </div>
      </div>
    );
  }

  if (showResetSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-2xl text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-brand-600">Reset Email Sent</h1>
          </div>

          <Card className="border-brand-100">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Password Reset Instructions Sent
              </h3>
              <p className="text-gray-600 mb-4">
                We've sent password reset instructions to your email. 
                Please check your inbox and follow the link to reset your password.
              </p>
              <Button
                onClick={resetForm}
                className="w-full bg-brand-500 hover:bg-brand-600"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>

          <footer className="mt-8 text-center">
            <p className="text-gray-600">
              Powered by <a href="https://spslabs.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">SPS Labs</a>
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

        {/* Welcome/Reset Messages */}
        {welcomeMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Welcome to ZapDine{userEmail ? `, ${userEmail.split('@')[0]}` : ''}! 
              Your account has been confirmed successfully. Your 14-day free trial has started!
            </AlertDescription>
          </Alert>
        )}

        {resetMessage && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You can now reset your password using the form below.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-brand-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              {isForgotPassword && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsForgotPassword(false)}
                  className="p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <CardTitle className="text-center text-brand-600 flex-1">
                {isForgotPassword 
                  ? 'Reset Your Password'
                  : isLogin 
                    ? 'Sign In to Your Account' 
                    : 'Create Your ZapDine Account'
                }
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isForgotPassword ? (
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
              ) : (
                <>
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
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="focus:border-brand-500 focus:ring-brand-500"
                        />
                      </div>
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
                    </>
                  )}
                  
                  {isLogin && (
                    <>
                      <Tabs value={loginType} onValueChange={(value) => setLoginType(value as typeof loginType)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="email" className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            Email
                          </TabsTrigger>
                          <TabsTrigger value="username" className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Username
                          </TabsTrigger>
                          <TabsTrigger value="phone" className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            Phone
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="email" className="space-y-2 mt-4">
                          <Label htmlFor="identifier">Email Address</Label>
                          <Input
                            id="identifier"
                            type="email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="focus:border-brand-500 focus:ring-brand-500"
                          />
                        </TabsContent>
                        <TabsContent value="username" className="space-y-2 mt-4">
                          <Label htmlFor="identifier">Username</Label>
                          <Input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className="focus:border-brand-500 focus:ring-brand-500"
                          />
                        </TabsContent>
                        <TabsContent value="phone" className="space-y-2 mt-4">
                          <Label htmlFor="identifier">Phone Number</Label>
                          <Input
                            id="identifier"
                            type="tel"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter your phone number"
                            required
                            className="focus:border-brand-500 focus:ring-brand-500"
                          />
                        </TabsContent>
                      </Tabs>
                    </>
                  )}
                  
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
                </>
              )}
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 transition-colors"
              >
                {loading ? 'Please wait...' : (
                  isForgotPassword ? 'Send Reset Email' :
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
            
            {isLogin && !isForgotPassword && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            
            {!isForgotPassword && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setFullName('');
                    setUsername('');
                    setPhone('');
                    setIdentifier('');
                  }}
                  className="text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors"
                >
                  {isLogin 
                    ? "Don't have an account? Create one now" 
                    : "Already have an account? Sign in instead"
                  }
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-gray-600">
            Powered by <a href="https://spslabs.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">SPS Labs</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
