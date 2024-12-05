import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Register';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation after successful registration

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);

            // Show success message using SweetAlert
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'swal-button'
                }
            }).then(() => {
                // After the alert is closed, navigate to login page
                navigate('/login');
            });
        } catch (err) {
            setError(err.response.data.message || 'Registration failed');

            // Show error message using SweetAlert
            Swal.fire({
                title: 'Error!',
                text: err.response.data.message || 'Registration failed',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    return (
        <div className="register-container">
            <h2 className='text-2xl font-bold text-center mx-auto'>Registration page</h2>
            <form className='w-1/2 mx-auto' onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="btn btn-primary text-2xl font-bold">
                    Register
                </button>
            </form>

            <p className='text-lg'>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default Register;
