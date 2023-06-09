import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { FlightCreation };

function FlightCreation(props) {
    const isStudent = props?.isStudent;
    const pilotId = props?.pilotId;
    const router = useRouter();
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        start_date: Yup.string()
            .required('Start date is required'),
        duration: Yup.number()
            .typeError("Please enter a valid number")
            .required('Duration is required')
            .min(1, "Minimum flight time is 1")
            .max(12, "Maximum flight time is 12"),
    });

    if(isStudent){
        validationSchema.grade = Yup.string().required('Grade is required')
    }
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return createFlight(pilotId, data);
    }

    function createFlight(id, data) {
        return userService.createFlight(id, data)
            .then(() => {
                alertService.success('Flight created', { keepAfterRouteChange: true });
                router.push(`./${id}`);
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Start date</label>
                <input name="start_date" type="date" {...register('start_date')} className={`form-control ${errors.start_date ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.start_date?.message}</div>
            </div>
            <div className="form-group">
                <label>Duration</label>
                <input name="duration" type="number" {...register('duration')} className={`form-control ${errors.duration ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.duration?.message}</div>
            </div>
            {isStudent && <div className="form-group">
                <label>Grade</label>
                <br></br>
                <select {...register('grade')}>
                    <option value="A">Excellent</option>
                    <option value="B">Satisfactory</option>
                    <option value="C">Mediocre</option>
                    <option value="D">Insufficient</option>
                    <option value="F">Failure</option>
                </select>
                <div className="invalid-feedback">{errors.grade?.message}</div>
            </div>}
            
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href={`/users/edit/${pilotId}`} className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}