import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import SocialLogin from "../SocialLogin/SocialLogin";

const SignUp = () => {

    // Form use korchi : "React hook form" theke 
    // "React hook form" theke ai form use korle alada vabe handleSubmit er function use kore form er date gula nite hoyna.
    const { register, watch, formState: { errors }, } = useForm();

    const navigate = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { createUser } = useContext(AuthContext); // Get the signup function from AuthProvider

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUser(email, password);
            navigate('/'); // Redirect to the home page after successful signup
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    console.log(watch('example'));

    return (
        <>
            <Helmet>
                <title>Bistro Boss || Sign Up</title>
            </Helmet>
            <div className=" min-h-screen bg-base-200 ">
                <div className="hero-content flex-col ">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold text-center">Sign Up</h1>
                    </div>
                    <div className="card  w-full max-w-sm shadow-2xl bg-base-100">
                        <form onSubmit={handleRegister} className="card-body">
                            {/* Name Section */}
                            {/* <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" {...register("name", { required: true })} placeholder="name" className="input input-bordered" />
                                {errors.name && <span className="text-xl font-semibold text-red-400">The name field is required </span>}
                            </div>
                            {/* Photo Section */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo URL</span>
                                </label>
                                <input type="text" {...register("photoURL")} placeholder="PhotoURL" className="input input-bordered" />
                                {errors.photoURL && <span className="text-xl font-semibold text-red-400">The Photo URL is required </span>}
                            </div> 
                            {/* Email Section */}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            {/* Password Section */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <div className="form-control mt-6">
                                <input className="btn btn-primary text-xl font-semibold" type="submit" value='Sign Up' />
                            </div>
                        </form>
                        <div>
                            <h2 className="mb-6 px-4 text-center"> Already have an account please <Link to='/login'><span className="text-xl font-bold text-red-400">Login</span></Link></h2>
                        </div>
                    </div>
                </div>
                <SocialLogin></SocialLogin>
            </div>
        </>

    );
};
export default SignUp;


import { useContext } from "react";
import { Context } from "./AuthProvider";
import { Link } from "react-router-dom";

const Register = () => {

    const { createUser } = useContext(Context);

    const handleRegistration = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        createUser(email, password)
            .then(result => {
                console.log(result.user);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className=" min-h-screen bg-base-200 mx-auto flex justify-center">
            <div className=" flex-col  ">
                <div className="text-center lg:text-left p-4">
                    <h1 className="text-2xl font-bold text-center">Registration Now!</h1>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 p-4">
                    <form onSubmit={handleRegistration} className="my-10">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name : </span>
                            </label>
                            <input type="text" name="name" placeholder="Your Name" required className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email : </span>
                            </label>
                            <input type="email" name="email" placeholder="Your Email" required className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password : </span>
                            </label>
                            <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary bg-red-600 w-full rounded-md">Register</button>
                        </div>
                    </form>
                    <p>Already have an account ? Please <Link className="text-green-400" to='/login'>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;