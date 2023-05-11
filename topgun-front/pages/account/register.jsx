import { useRouter } from 'next/router';
import { useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';

export default Register;

function Register() {
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
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return userService.register(user)
            .then(() => {
                alertService.success('Registration successful', { keepAfterRouteChange: true });
                router.push('login');
            })
            .catch(alertService.error);
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body">
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
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Register
                        </button>
                        <Link href="/account/login" className="btn btn-link">Cancel</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
