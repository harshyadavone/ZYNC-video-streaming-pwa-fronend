// components/ChannelForm.tsx
import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription  } from '../ui/dialog';
import { Loader2 } from 'lucide-react';

interface ChannelFormProps {
  // TODO: make this necessary field
  isSubmitting?: boolean;
  isOpen: boolean;
  title: string;
  editForm: {
    name: string;
    description: string;
    slug: string;
    channelProfileImage: File | null;
    bannerImage: File | null;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChannelForm: React.FC<ChannelFormProps> = ({
  isOpen,
  title,
  editForm,
  onClose,
  onSubmit,
  onInputChange,
  onFileChange,
  isSubmitting,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {title === 'Update Channel' ? 'Make changes to your channel here.' : 'Create your new channel here.'} Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit}>
        <div className="mb-4 ">
          <label htmlFor="name" className="block text-sm font-medium">Channel Name</label>
          <Input id="name" name="name" value={editForm.name} onChange={onInputChange} className="mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <Textarea id="description" name="description" value={editForm.description} onChange={onInputChange} className="mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium">Slug</label>
          <Input id="slug" name="slug" value={editForm.slug} onChange={onInputChange} className="mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="channelProfileImage" className="block text-sm font-medium">Channel Profile Image</label>
          <Input id="channelProfileImage" name="channelProfileImage" type="file" onChange={onFileChange} className="mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="bannerImage" className="block text-sm font-medium">Banner Image</label>
          <Input id="bannerImage" name="bannerImage" type="file" onChange={onFileChange} className="mt-1 block w-full" />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {title === 'Update Channel' ? 'Saving Changes...' : 'Creating Channel...'}
            </>
          ) : (
            title === 'Update Channel' ? 'Save Changes' : 'Create Channel'
          )}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

export default ChannelForm;