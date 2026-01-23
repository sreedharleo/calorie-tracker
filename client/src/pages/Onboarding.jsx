import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Using react-router-dom for navigation
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ChevronRight, Check } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // Uncomment when Auth is ready

const Onboarding = () => {
    const navigate = useNavigate();
    // const { updateUserProfile } = useAuth();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: ''
    });

    const steps = [
        {
            title: "Let's get to know you",
            subtitle: "To calculate your personalized plan, we need a few details.",
            fields: ['age', 'gender']
        },
        {
            title: "Body Measurements",
            subtitle: "This helps us estimate your daily energy needs.",
            fields: ['height', 'weight']
        },
        {
            title: "Your Goal",
            subtitle: "What are you aiming for?",
            fields: ['goal']
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Submit form
            console.log("Submitting:", formData);
            navigate('/');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="w-full max-w-md relative z-10">
                <div className="mb-8">
                    <div className="flex space-x-2 mb-8">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-surface-hover'}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">{steps[step].title}</h1>
                        <p className="text-text-muted mb-8">{steps[step].subtitle}</p>

                        <div className="space-y-4">
                            {step === 0 && (
                                <>
                                    <Input
                                        name="age"
                                        type="number"
                                        placeholder="Age"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Male', 'Female'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gender: g.toLowerCase() })}
                                                className={`h-12 rounded-xl border border-white/10 font-medium transition-all ${formData.gender === g.toLowerCase()
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-surface/50 text-text-muted hover:bg-surface-hover'
                                                    }`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {step === 1 && (
                                <>
                                    <Input
                                        name="height"
                                        type="number"
                                        placeholder="Height (cm)"
                                        value={formData.height}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="weight"
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </>
                            )}

                            {step === 2 && (
                                <div className="space-y-3">
                                    {['Lose Weight', 'Maintain', 'Gain Muscle'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, goal: g })}
                                            className={`w-full p-4 rounded-xl border border-white/10 text-left transition-all flex items-center justify-between ${formData.goal === g
                                                    ? 'bg-primary/20 border-primary text-white'
                                                    : 'bg-surface/50 text-text-muted hover:bg-surface-hover'
                                                }`}
                                        >
                                            <span>{g}</span>
                                            {formData.goal === g && <Check className="h-5 w-5 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleNext}
                                className="w-full sm:w-auto"
                            >
                                {step === steps.length - 1 ? 'Get Started' : 'Next'}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;
