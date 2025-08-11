import { useForm, Controller } from 'react-hook-form';
import { User } from '../types';
import Button from './ui/Button';
import { Input } from './ui/Input';
import Select from './ui/Select';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (data: User) => void;
  isSaving: boolean;
}

const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'board_member', label: 'Board Member' },
];

const EditUserModal = ({ user, onClose, onSave, isSaving }: EditUserModalProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<User>({ defaultValues: user });

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit User: {user.username}</h2>
        <form onSubmit={handleSubmit(onSave)} className="user-edit-form">
            <div className="form-group">
                <label>Username</label>
                <Input {...register("username", { required: "Username is required" })} />
                {errors.username && <p className="error-text">{errors.username.message}</p>}
            </div>
            <div className="form-group">
                <label>Email</label>
                <Input type="email" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="form-group">
                <label>Role</label>
                <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Role is required' }}
                    render={({ field }) => (
                        <Select 
                            options={roleOptions} 
                            value={field.value || ''} 
                            onChange={field.onChange} 
                        />
                    )}
                />
            </div>
            <div className="modal-actions">
                <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
