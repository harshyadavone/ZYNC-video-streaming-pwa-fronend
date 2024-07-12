import { Link } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from './ui/switch';

const Notification = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card p-6 rounded-lg shadow-md border border-solid">
        <div className="flex items-center mb-6">
          <Link to="/settings">
            <Button variant="ghost" className="p-2 rounded-full">
              <ArrowLeft className="text-foreground" />
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold ml-4">Notification Settings</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="text-primary" />
              <label htmlFor="push-notifications" className="text-sm font-medium text-foreground">
                Push Notifications
              </label>
            </div>
            <Switch id="push-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="text-primary" />
              <label htmlFor="email-notifications" className="text-sm font-medium text-foreground">
                Email Notifications
              </label>
            </div>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="text-primary" />
              <label htmlFor="sms-notifications" className="text-sm font-medium text-foreground">
                SMS Notifications
              </label>
            </div>
            <Switch id="sms-notifications" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="account-activity" className="mr-2" />
                <label htmlFor="account-activity" className="text-sm text-foreground">Account Activity</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="new-features" className="mr-2" />
                <label htmlFor="new-features" className="text-sm text-foreground">New Features and Updates</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="marketing" className="mr-2" />
                <label htmlFor="marketing" className="text-sm text-foreground">Marketing and Promotions</label>
              </div>
            </div>
          </div>
          <div>
            <Button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;