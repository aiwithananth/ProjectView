import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { useCreateUser } from '../../hooks/useUsers';

export function AddUserModal({ isOpen, onClose, onCreated, initialName = '' }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState('');
  const createUser = useCreateUser();

  useEffect(() => {
    if (isOpen) setName(initialName);
  }, [isOpen, initialName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await createUser.mutateAsync({ name, email });
      onCreated?.(user);
      setName('');
      setEmail('');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add user">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createUser.isPending}>
            Add user
          </Button>
        </div>
      </form>
    </Modal>
  );
}
