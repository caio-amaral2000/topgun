import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { Graduate };

function Graduate(props) {
    const pilotId = props?.pilotId;
    const router = useRouter();
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        license_number: Yup.number()
            .typeError("Please enter a valid number")
            .required('License number is required')
            .min(1,"License number must be positive"),

    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return graduate(pilotId, data);
    }

    function graduate(id, data) {
        return userService.graduateStudent(id, data)
            .then(() => {
                alertService.success('Student graduated to pilot', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>License number</label>
                <input name="license_number" type="number" {...register('license_number')} className={`form-control ${errors.license_number ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.license_number?.message}</div>
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