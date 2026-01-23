import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import welcomeBg from '../assets/welcome_bg.png';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${welcomeBg})` }}
            >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-12 text-center">

                {/* Logo/Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Utensils className="h-8 w-8 text-white" />
                </div>

                {/* Title */}
                <h1 className="mb-2 font-serif text-4xl font-medium text-white tracking-wide">
                    Calorie Friend
                </h1>

                {/* Subtitle */}
                <p className="mb-12 text-lg font-light text-gray-200">
                    Your way to healthier you
                </p>

                {/* Start Button */}
                <button
                    onClick={() => navigate('/onboarding')}
                    className="group relative mb-6 w-full max-w-sm overflow-hidden rounded-full bg-primary px-8 py-4 font-semibold text-white transition-transform active:scale-95 hover:bg-primary-dark"
                >
                    Start now
                </button>

                {/* Login Link */}
                <p className="text-sm font-light text-gray-300">
                    Already have an account?
                    <button onClick={() => navigate('/login')} className="ml-1 font-medium text-white hover:underline">
                        Log in.
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Welcome;
