import React, { use, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const Register = () => {
    const { createUser, signInWithGoogle, updateUserProfile } = use(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle Form Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const image = form.image.value.trim();
        const password = form.password.value;

        if (!name) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please enter your name.' });
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password should be at least 6 characters long.'
            });
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUser(email, password);
            const user = userCredential.user;

            // Update user profile in Firebase
            if (updateUserProfile) {
                await updateUserProfile(name, image);
            }

            // Save user to MongoDB
            const newUser = {
                name,
                email,
                image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=632EE3&color=fff`,
                created_at: new Date().toISOString()
            };

            await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: `Welcome, ${name}!`,
                timer: 1500,
                showConfirmButton: false
            });

            form.reset();
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
            let message = 'Registration failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Please provide a valid email address.';
            }
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: message
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Sign In
    const handleGoogleSignUp = async () => {
        try {
            setLoading(true);
            const result = await signInWithGoogle();
            const user = result.user;

            const newUser = {
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                created_at: new Date().toISOString()
            };

            await fetch(`${import.meta.env.VITE_API_URL}/users`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: `Signed in as ${user.displayName || user.email}`,
                timer: 1500,
                showConfirmButton: false
            });

            navigate('/');
        } catch (error) {
            console.error('Google Sign Up Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Google Sign In Failed',
                text: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12 px-4 flex justify-center items-center">
            {/* White Card Container */}
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                        Register Now!
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Login Now
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Mariam Swarna"
                            className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400 placeholder:text-xs"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="smsowkothasan@gmail.com"
                            className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400 placeholder:text-xs"
                            required
                        />
                    </div>

                    {/* Image-URL */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Image-URL
                        </label>
                        <input
                            type="text"
                            name="image"
                            placeholder="https://..."
                            className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400 placeholder:text-xs"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••••••"
                            className="input input-bordered w-full rounded-lg text-sm bg-white border-gray-200 focus:border-primary focus:outline-none placeholder:text-gray-400 placeholder:text-xs"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-2.5 rounded-xl font-semibold text-sm normal-case shadow-sm hover:shadow transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Registering...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="divider text-xs text-gray-400 my-4 uppercase font-medium">
                    OR
                </div>

                {/* Google Sign In */}
                <div>
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full border border-gray-200 hover:bg-gray-50 bg-white py-2.5 rounded-xl text-xs font-medium text-gray-700 flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Sign Up With Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;