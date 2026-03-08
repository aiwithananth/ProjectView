import { useUsers } from '../../hooks/useUsers';
import { Select } from './Select';

export function UserSelect({ value, onChange, label = 'Owner', placeholder = 'Select owner...', ...props }) {
  const { data: users, isLoading } = useUsers();
  
  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading users...</div>;
  }
  
  const options = users?.map(user => ({
    value: user.id,
    label: user.name,
  })) || [];
  
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      {...props}
    />
  );
}

