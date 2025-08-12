import { useForm, Controller } from 'react-hook-form';
import { Request } from '../types';

interface EditRequestModalProps {
  request: Request;
  onClose: () => void;
  onSave: (data: Request) => void;
  isSaving: boolean;
}

const EditRequestModal = ({ request, onClose, onSave, isSaving }: EditRequestModalProps) => {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<Request>({ defaultValues: request });
  const isMonetary = watch("type") === 'monetary';

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit Request</h2>
        <form onSubmit={handleSubmit(onSave)}>
            <div className="form-group">
                <label>Title</label>
                <input className="input-field" {...register("title", { required: "Title is required" })} />
                {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea className="input-field" {...register("description", { required: "Description is required" })} />
                {errors.description && <p className="error-text">{errors.description.message}</p>}
            </div>
            <div className="form-group">
                <label className="checkbox-label">
                    <Controller
                        name="type"
                        control={control}
                        defaultValue="non-monetary"
                        render={({ field }) => (
                            <input 
                                type="checkbox"
                                {...field} 
                                checked={field.value === 'monetary'}
                                onChange={(e) => field.onChange(e.target.checked ? 'monetary' : 'non-monetary')}
                            />
                        )}
                    />
                    Is this a monetary request?
                </label>
            </div>
            {isMonetary && (
                <div className="form-group">
                    <label>Amount (KES)</label>
                    <input type="number" className="input-field" {...register("amount", { required: "Amount is required for monetary requests", valueAsNumber: true, min: { value: 1, message: "Amount must be positive" } })} min="0.01" step="0.01" />
                    {errors.amount && <p className="error-text">{errors.amount.message}</p>}
                </div>
            )}
            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequestModal;
