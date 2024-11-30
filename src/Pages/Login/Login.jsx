import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  // Error message state
    const [successMessage, setSuccessMessage] = useState('');  // Success message state
    const navigate = useNavigate();
    
    // Check if the user is authenticated by checking localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
    // Handle form submission (login)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // Set success message
            setSuccessMessage('Login successful! Redirecting to dashboard...');
            setErrorMessage(''); // Clear any previous error message
            
            // Set user as logged in
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            navigate('/'); // Navigate to home page after successful login
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid email or password';
            setErrorMessage(errorMessage); // Set error message
            setSuccessMessage(''); // Clear any previous success message
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated'); // Remove login status
        localStorage.removeItem('token'); // Optionally remove token
        setSuccessMessage('Logout successful! Redirecting to login page...');
        setErrorMessage(''); // Clear any previous error message
        setTimeout(() => {
            navigate('/login'); // Navigate to login page after logout
        }, 2000); // Adding delay to let the user see the success message
    };

    return (
        <div className="login-container">
            <h2>{isAuthenticated ? "Welcome Back!" : "Login"}</h2>

            {/* Display Success or Error messages */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

            {!isAuthenticated ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn text-xl btn-primary">Login</button>
                </form>
            ) : (
                <div>
                    <h3>Welcome Back!</h3>
                    <button type='submit' onClick={handleLogout} className="btn text-xl btn-primary">Logout</button>
                </div>
            )}
            <p className='text-xl'>Don't have an account? <a className='text-xl font-bold' href="/register">Register</a></p>
        </div>
    );
};

export default Login;
