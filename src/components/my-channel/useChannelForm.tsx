// hooks/useChannelForm.ts
import { useState, useCallback } from 'react';
import { Channel } from '../../hooks/my-channel/useGetMychannel';

export const useChannelForm = (initialChannel: Channel | undefined) => {
  const [editForm, setEditForm] = useState({
    name: initialChannel?.name || '',
    description: initialChannel?.description || '',
    slug: initialChannel?.slug || '',
    channelProfileImage: null as File | null,
    bannerImage: null as File | null,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setEditForm(prev => ({ ...prev, [name]: files[0] }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setEditForm({
      name: initialChannel?.name || '',
      description: initialChannel?.description || '',
      slug: initialChannel?.slug || '',
      channelProfileImage: null,
      bannerImage: null,
    });
  }, [initialChannel]);


// when i'm using useEffect the update form is correctly populated
//   const resetForm = useEffect(() => {
//     setEditForm({
//       name: initialChannel?.name || '',
//       description: initialChannel?.description || '',
//       slug: initialChannel?.slug || '',
//       channelProfileImage: null,
//       bannerImage: null,
//     });
//   }, [initialChannel]);


  return { editForm, handleInputChange, handleFileChange, resetForm };
};