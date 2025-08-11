import api from '../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

interface RequestForm {
    title: string;
    description: string;
    type: 'monetary' | 'non-monetary';
    amount?: number;
}

const MakeRequest = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, control, formState: { errors } } = useForm<RequestForm>();
    const isMonetary = watch("type") === 'monetary';

    const onSubmit = async (data: RequestForm) => {
        try {
            const requestData = {
                ...data,
                amount: data.type === 'monetary' ? Number(data.amount) : undefined,
            };
            await api.post('/requests', requestData);
            toast.success('Request submitted successfully!');
            navigate('/my-requests');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit request.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Make a New Request</h1>
            </div>
            <div className="card make-request-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="title">Request Title</label>
                        <input id="title" className="input-field" {...register("title", { required: "Title is required" })} />
                        {errors.title && <p className="error-text">{errors.title.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" className="input-field" {...register("description", { required: "Description is required" })} />
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
                            <label htmlFor="amount">Amount (KES)</label>
                            <input type="number" id="amount" className="input-field" {...register("amount", { required: "Amount is required for monetary requests", valueAsNumber: true, min: { value: 1, message: "Amount must be positive" } })} min="0.01" step="0.01" />
                            {errors.amount && <p className="error-text">{errors.amount.message}</p>}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

export default MakeRequest;
