import { useState } from 'react';
import { api } from '~/trpc/react';
import { useSession } from 'next-auth/react';

const SettingsPage = () => {
  const { data: session } = useSession();
  const { data: userData } = api.user.getUser.useQuery(undefined, {
    enabled: !!session,
  });
  const updateUser = api.user.updateUser.useMutation();

  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser.mutate({ name, email });
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit">Update</button>
    </form>
  );
};

export default SettingsPage;
