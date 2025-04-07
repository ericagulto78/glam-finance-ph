
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
import { Calendar, Bell, Mail, Calendar as CalendarIcon } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(false);
  const [emailReportFrequency, setEmailReportFrequency] = useState('weekly');
  const [reminderTime, setReminderTime] = useState('24');
  
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

  return (
    <div className="h-full">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your application preferences"
      />

      <div className="p-6">
        <Tabs defaultValue="reminders" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
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
          </TabsList>

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
                    defaultValue="manager@example.com"
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
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
