import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const Account = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-1 md:p-6 rounded-lg">
        <div className="flex items-center mb-6">
          <Link to="/settings">
            <Button variant="ghost" className="p-2 rounded-full">
              <ArrowLeft className="text-foreground" />
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold ml-4">Account Settings</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <Button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;