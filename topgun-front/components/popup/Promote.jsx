import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { Promote };

function Promote(props) {
    const pilotId = props?.pilotId;
    const router = useRouter();
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        institution_name: Yup.string()
            .required('Institution name is required'),
        course_name: Yup.string()
            .required('Course name is required'),
        graduation_date: Yup.string()
            .required('Graduation date is required'),

    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return promote(pilotId, data);
    }

    function promote(id, data) {
        return userService.promotePilot(id, data)
            .then(() => {
                alertService.success('Pilot promoted to instructor', { keepAfterRouteChange: true });
                router.push(`./${id}`);
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Institution name</label>
                <input name="institution_name" type="text" {...register('institution_name')} className={`form-control ${errors.institution_name ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.institution_name?.message}</div>
            </div>
            <div className="form-group">
                <label>Course name</label>
                <input name="course_name" type="text" {...register('course_name')} className={`form-control ${errors.course_name ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.course_name?.message}</div>
            </div>
            <div className="form-group">
                <label>Graduation date</label>
                <input name="graduation_date" type="date" {...register('graduation_date')} className={`form-control ${errors.graduation_date ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.graduation_date?.message}</div>
            </div>
            
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