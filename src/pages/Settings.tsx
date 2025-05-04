
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Bell, Mail, Calendar as CalendarIcon, User, Shield, UserPlus } from 'lucide-react';
import { ADMIN_EMAIL } from '@/integrations/supabase/client';
import BusinessProfileForm from '@/components/BusinessProfileForm';

const Settings = () => {
  const { toast } = useToast();
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(false);
  const [emailReportFrequency, setEmailReportFrequency] = useState('weekly');
  const [reminderTime, setReminderTime] = useState('24');
  const [googleConnected, setGoogleConnected] = useState(user?.app_metadata?.provider === 'google');
  
  const handleSaveReminders = () => {
    toast({
      title: "Reminder settings saved",
      description: "Your booking reminder preferences have been updated.",
    });
  };

  const handleSaveCalendar = () => {
    if (googleCalendarEnabled) {
      toast({
        title: "Google Calendar integration",
        description: "You'll be redirected to authorize access to your Google Calendar.",
      });
    } else {
      toast({
        title: "Google Calendar integration disabled",
        description: "Your bookings will no longer sync with Google Calendar.",
      });
    }
  };

  const handleSaveReports = () => {
    toast({
      title: "Email report settings saved",
      description: `You'll now receive ${emailReportFrequency} email reports.`,
    });
  };

  const handleConnectWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setGoogleConnected(true);
    } catch (error: any) {
      toast({
        title: "Google connection failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your application preferences"
      />

      <div className="p-6">
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building size={16} />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Mail size={16} />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User size={16} />
              <span>Account</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield size={16} />
                <span>Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Business Information Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Manage your business details that appear on invoices and your public profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Booking Reminders</CardTitle>
                <CardDescription>
                  Configure when and how you want to be reminded of upcoming bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="reminder-toggle">Enable booking reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications before upcoming appointments
                    </p>
                  </div>
                  <Switch 
                    id="reminder-toggle"
                    checked={reminderEnabled}
                    onCheckedChange={setReminderEnabled}
                  />
                </div>

                {reminderEnabled && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="reminder-time">Reminder time</Label>
                      <Select 
                        value={reminderTime} 
                        onValueChange={setReminderTime}
                      >
                        <SelectTrigger id="reminder-time" className="w-full">
                          <SelectValue placeholder="Select reminder time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour before</SelectItem>
                          <SelectItem value="3">3 hours before</SelectItem>
                          <SelectItem value="12">12 hours before</SelectItem>
                          <SelectItem value="24">1 day before</SelectItem>
                          <SelectItem value="48">2 days before</SelectItem>
                          <SelectItem value="168">1 week before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveReminders}>Save reminder settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Google Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Google Calendar Integration</CardTitle>
                <CardDescription>
                  Sync your bookings with Google Calendar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="google-calendar-toggle">Enable Google Calendar sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add your bookings to your Google Calendar
                    </p>
                  </div>
                  <Switch 
                    id="google-calendar-toggle"
                    checked={googleCalendarEnabled}
                    onCheckedChange={setGoogleCalendarEnabled}
                  />
                </div>

                {googleCalendarEnabled && (
                  <div className="p-4 border rounded-md bg-muted/50">
                    <p className="text-sm">
                      By enabling this feature, you'll need to grant GlamFinance access to your Google Calendar. 
                      You can revoke this access at any time.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveCalendar}>
                  {googleCalendarEnabled ? 'Connect with Google Calendar' : 'Save settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Email Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Email Reports</CardTitle>
                <CardDescription>
                  Receive automated email reports about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="report-frequency">Report frequency</Label>
                  <Select 
                    value={emailReportFrequency} 
                    onValueChange={setEmailReportFrequency}
                  >
                    <SelectTrigger id="report-frequency" className="w-full">
                      <SelectValue placeholder="Select report frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="report-email">Email address</Label>
                  <Input
                    id="report-email"
                    type="email"
                    placeholder="Enter your email address"
                    defaultValue={user?.email || ""}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Reports will be sent to this email address
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveReports}>Save report settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account and connected services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Google Account</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect your Google account for easier sign-in and integrations
                    </p>
                  </div>
                  
                  {googleConnected ? (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center justify-between">
                      <span className="text-sm">
                        <UserPlus className="h-4 w-4 inline mr-2" />
                        Your Google account is connected
                      </span>
                    </div>
                  ) : (
                    <Button onClick={handleConnectWithGoogle} variant="outline" className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                          s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20
                          s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                          C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                          c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                          c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                      </svg>
                      Connect Google Account
                    </Button>
                  )}
                  
                  <Alert>
                    <AlertDescription className="text-sm">
                      Connecting your Google account allows seamless integration with Google Calendar
                      and simplifies sign-in. Your data remains secure and private.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Settings Tab (Only for admin users) */}
          {isAdmin && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Administrator Settings</CardTitle>
                  <CardDescription>
                    Manage user accounts and system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Pending User Approvals</h3>
                        <p className="text-sm text-muted-foreground">
                          Review and approve new user sign-ups
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "User approval management will be available in the next update.",
                        });
                      }}>
                        Manage Users
                      </Button>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertDescription className="text-sm">
                      As an administrator, you can approve or reject new user sign-ups.
                      This helps maintain control over who has access to your business data.
                      <br /><br />
                      <strong>Current administrator:</strong> {ADMIN_EMAIL}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
