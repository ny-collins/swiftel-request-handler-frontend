import { useForm, Controller } from 'react-hook-form';
import { User } from '../types';

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
        <form onSubmit={handleSubmit(onSave)}>
            <div className="form-group">
                <label>Username</label>
                <input className="input-field" {...register("username", { required: "Username is required" })} />
                {errors.username && <p className="error-text">{errors.username.message}</p>}
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" className="input-field" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="form-group">
                <label>Role</label>
                <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Role is required' }}
                    render={({ field }) => (
                        <select className="input-field" value={field.value || ''} onChange={field.onChange}>
                            {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    )}
                />
            </div>
            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
