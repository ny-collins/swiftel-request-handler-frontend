import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/error.utils';
import { useNavigate } from 'react-router-dom';

interface MakeRequestForm {
    title: string;
    description: string;
    type: 'monetary' | 'non-monetary';
    amount?: number;
}

const createRequest = async (requestData: MakeRequestForm) => {
    const { data } = await api.post('/requests', requestData);
    return data;
};

const MakeRequest = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<MakeRequestForm>({
        defaultValues: {
            type: 'non-monetary'
        }
    });

    const requestType = watch('type');

    const mutation = useMutation({
        mutationFn: createRequest,
        onSuccess: () => {
            toast.success('Request submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['myRequests'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
            navigate('/my-requests');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    const onSubmit = (data: MakeRequestForm) => {
        const payload = {
            ...data,
            amount: data.type === 'monetary' ? Number(data.amount) : undefined,
        };
        mutation.mutate(payload);
    };

    return (
        <>
            <div className="page-header">
                <h1>Make a New Request</h1>
                <p>Fill out the form below to submit your request.</p>
            </div>
            <div className="card" style={{ maxWidth: '700px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            className="input-field" 
                            {...register("title", { required: "Title is required" })} 
                        />
                        {errors.title && <p className="error-text">{errors.title.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea 
                            id="description" 
                            className="textarea-field" 
                            {...register("description", { required: "Description is required" })} 
                        />
                        {errors.description && <p className="error-text">{errors.description.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Request Type</label>
                        <select id="type" className="select-field" {...register("type")}>
                            <option value="non-monetary">Non-Monetary</option>
                            <option value="monetary">Monetary</option>
                        </select>
                    </div>

                    {requestType === 'monetary' && (
                        <div className="form-group">
                            <label htmlFor="amount">Amount (USD)</label>
                            <input 
                                type="number" 
                                id="amount" 
                                className="input-field" 
                                {...register("amount", { 
                                    required: "Amount is required for monetary requests",
                                    valueAsNumber: true,
                                    min: { value: 0.01, message: "Amount must be positive" }
                                })} 
                                step="0.01"
                            />
                            {errors.amount && <p className="error-text">{errors.amount.message}</p>}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default MakeRequest;
