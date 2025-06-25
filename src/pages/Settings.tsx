
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Building, Lock, Mail, AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const Settings = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { data: restaurants, refetch: refetchRestaurants } = useRestaurants();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Profile form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');

  // Restaurant form states
  const [restaurantName, setRestaurantName] = useState(restaurants?.[0]?.name || '');
  const [restaurantDescription, setRestaurantDescription] = useState(restaurants?.[0]?.description || '');
  const [restaurantAddress, setRestaurantAddress] = useState(restaurants?.[0]?.address || '');
  const [restaurantPhone, setRestaurantPhone] = useState(restaurants?.[0]?.phone || '');

  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username,
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const restaurant = restaurants?.[0];
      if (!restaurant) {
        toast({
          title: "No Restaurant Found",
          description: "Please create a restaurant first.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('restaurants')
        .update({
          name: restaurantName,
          description: restaurantDescription,
          address: restaurantAddress,
          phone: restaurantPhone,
        })
        .eq('id', restaurant.id);

      if (error) throw error;

      await refetchRestaurants();
      toast({
        title: "Restaurant Updated",
        description: "Your restaurant information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactTeam = () => {
    const subject = encodeURIComponent('ZapDine Support Request');
    const body = encodeURIComponent(`Hello ZapDine Team,

I need assistance with:

Restaurant: ${restaurants?.[0]?.name || 'N/A'}
User: ${profile?.full_name || 'N/A'} (${profile?.email || 'N/A'})

Please describe your issue:


Best regards,
${profile?.full_name || 'User'}`);
    
    window.open(`mailto:support@spslabs.com?subject=${subject}&body=${body}`, '_blank');
  };

  const renderProfileSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              value={profile?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600">
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderRestaurantSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Restaurant Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {restaurants?.[0] ? (
          <form onSubmit={handleUpdateRestaurant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Enter restaurant name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantDescription">Description</Label>
              <Input
                id="restaurantDescription"
                value={restaurantDescription}
                onChange={(e) => setRestaurantDescription(e.target.value)}
                placeholder="Brief description of your restaurant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantAddress">Address</Label>
              <Input
                id="restaurantAddress"
                value={restaurantAddress}
                onChange={(e) => setRestaurantAddress(e.target.value)}
                placeholder="Restaurant address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantPhone">Phone Number</Label>
              <Input
                id="restaurantPhone"
                value={restaurantPhone}
                onChange={(e) => setRestaurantPhone(e.target.value)}
                placeholder="Restaurant phone number"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600">
              {loading ? 'Updating...' : 'Update Restaurant'}
            </Button>
          </form>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No restaurant found. Please create a restaurant first from the dashboard.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderPasswordSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
            />
          </div>
          <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
          <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600">
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderContactSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Contact Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Need help with ZapDine? Our support team is here to assist you.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Support Options:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Technical issues</li>
            <li>• Account management</li>
            <li>• Feature requests</li>
            <li>• Billing questions</li>
          </ul>
        </div>
        <Button onClick={handleContactTeam} className="bg-amber-500 hover:bg-amber-600">
          <Mail className="w-4 h-4 mr-2" />
          Contact Support Team
        </Button>
        <p className="text-xs text-gray-500">
          This will open your default email client with a pre-filled support request.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="flex h-screen">
        <Sidebar activeTab="settings" onTabChange={() => {}} />
        
        <div className="flex-1 md:pl-64">
          <main className="p-6 overflow-auto h-full">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account and restaurant settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-4">
                      <nav className="space-y-2">
                        <button
                          onClick={() => setActiveSection('profile')}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'profile' 
                              ? 'bg-amber-500 text-white' 
                              : 'text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => setActiveSection('restaurant')}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'restaurant' 
                              ? 'bg-amber-500 text-white' 
                              : 'text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          Restaurant
                        </button>
                        <button
                          onClick={() => setActiveSection('password')}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'password' 
                              ? 'bg-amber-500 text-white' 
                              : 'text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          Password
                        </button>
                        <button
                          onClick={() => setActiveSection('contact')}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'contact' 
                              ? 'bg-amber-500 text-white' 
                              : 'text-gray-700 hover:bg-amber-50'
                          }`}
                        >
                          Support
                        </button>
                      </nav>
                    </CardContent>
                  </Card>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                  {activeSection === 'profile' && renderProfileSection()}
                  {activeSection === 'restaurant' && renderRestaurantSection()}
                  {activeSection === 'password' && renderPasswordSection()}
                  {activeSection === 'contact' && renderContactSection()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
