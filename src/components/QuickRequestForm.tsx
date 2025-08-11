import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import toast from 'react-hot-toast';

interface QuickRequestFormFields {
    title: string;
    description: string;
}

const QuickRequestForm = () => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<QuickRequestFormFields>();

    const mutation = useMutation({
        mutationFn: (newData: QuickRequestFormFields) => 
            api.post('/requests', { ...newData, type: 'non-monetary' }),
        onSuccess: () => {
            toast.success('Quick request submitted!');
            reset();
            queryClient.invalidateQueries({ queryKey: ['requests', true] }); // Invalidate employee's requests
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] }); // Invalidate stats
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Submission failed.');
        }
    });

    const onSubmit = (data: QuickRequestFormFields) => {
        mutation.mutate(data);
    };

    return (
        <div className="card">
            <h3>Make a Quick (Non-Monetary) Request</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Title</label>
                    <input className="input-field" {...register('title', { required: 'Title is required' })} />
                    {errors.title && <p className="error-text">{errors.title.message}</p>}
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea className="input-field" {...register('description', { required: 'Description is required' })} />
                    {errors.description && <p className="error-text">{errors.description.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Submitting...' : 'Submit Quick Request'}
                </button>
            </form>
        </div>
    );
};

export default QuickRequestForm;
