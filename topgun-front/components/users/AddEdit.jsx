import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        main: Yup.string()
            .required('Address is required'),
        postal_code: Yup.string()
            .required('Postal Code is required'),
        city: Yup.string()
            .required('City is required'),
        birth_date: Yup.string()
            .required('Birth Date is required'),
        profile: Yup.string()
            .required('Profile is required'),
        license_number: Yup.number()
            .when('profile', {
                is: ('PIL' || 'INS'),
                then: Yup.number()
                    .typeError("Please enter a valid number")
                    .required('License number is required')
                    .min(1,"License number must be positive")
            }),
        institution_name: Yup.string()
            .when('profile', {
                is: 'INS',
                then: Yup.string().required('Must enter institution name'),
            }),
        course_name: Yup.string()
            .when('profile', {
                is: 'INS',
                then: Yup.string().required('Must enter course name'),
            }),
        graduation_date: Yup.string()
            .when('profile', {
                is: 'INS',
                then: Yup.string().required('Must enter graduation date'),
            }),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Password is required') : null)
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const [selectedProfile, setSelectedProfile] = useState('STU');

    const handleProfileChange = (event) => {
        setSelectedProfile(event.target.value);
    };

    // set default form values if in edit mode
    if (!isAddMode) {
        formOptions.defaultValues = props.user;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        return userService.createPilot(data)
            .then(() => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.update(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="form-group">
                <label>Address</label>
                <input name="main" type="text" {...register('main')} className={`form-control ${errors.main ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.main?.message}</div>
            </div>
            <div className="form-group">
                <label>Complement</label>
                <input name="complement" type="text" {...register('complement')} className={`form-control ${errors.complement ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.complement?.message}</div>
            </div>
            <div className="form-group">
                <label>Postal Code</label>
                <input name="postal_code" type="text" {...register('postal_code')} className={`form-control ${errors.postal_code ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.postal_code?.message}</div>
            </div>
            <div className="form-group">
                <label>City</label>
                <input name="city" type="text" {...register('city')} className={`form-control ${errors.city ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.city?.message}</div>
            </div>
            <div className="form-group">
                <label>Birth Date</label>
                <input name="birth_date" type="date" {...register('birth_date')} className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.birth_date?.message}</div>
            </div>
            <div className="form-group">
                <label>Profile</label>
                <br></br>
                <select {...register('profile')} value={selectedProfile} onChange={handleProfileChange}>
                    <option value="STU">Student</option>
                    <option value="PIL">Pilot</option>
                    <option value="INS">Instructor</option>
                </select>
                <div className="invalid-feedback">{errors.profile?.message}</div>
            </div>
            {(selectedProfile === 'PIL' || selectedProfile === 'INS')  && (
                <div className="form-group">
                    <label>License number</label>
                    <input name="license_number" type="number" {...register('license_number')} className={`form-control ${errors.license_number ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.license_number?.message}</div>
                </div>
            )}
            {selectedProfile === 'INS' && (
                <div className="form-group">
                    <label>Institution name</label>
                    <input name="institution_name" type="text" {...register('institution_name')} className={`form-control ${errors.institution_name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.institution_name?.message}</div>
                </div>
            )}
            {selectedProfile === 'INS' && (
                <div className="form-group">
                    <label>Course name</label>
                    <input name="course_name" type="text" {...register('course_name')} className={`form-control ${errors.course_name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.course_name?.message}</div>
                </div>
            )}
            {selectedProfile === 'INS' && (
                <div className="form-group">
                    <label>Graduation date</label>
                    <input name="graduation_date" type="date" {...register('graduation_date')} className={`form-control ${errors.graduation_date ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.graduation_date?.message}</div>
                </div>
            )}
            <div className="form-group">
                <label>Username</label>
                <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}