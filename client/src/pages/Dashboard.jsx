import React from 'react';
import { motion } from 'framer-motion';
import DailyNutritionCard from '../components/Dashboard/DailyNutritionCard';
import SuggestedActivities from '../components/Dashboard/SuggestedActivities';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-24 px-6 pt-12">
            {/* Header */}
            <header className="mb-8 text-center">
                <h1 className="font-serif text-2xl font-medium text-gray-800">
                    Here is your health plan
                </h1>
            </header>

            {/* Daily Nutrition Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <DailyNutritionCard />
            </motion.div>

            {/* Suggested Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <SuggestedActivities />
            </motion.div>

            {/* Get Started / Log Meal Action */}
            <div className="mt-8">
                <button
                    onClick={() => navigate('/log-meal')}
                    className="w-full rounded-2xl bg-secondary py-4 font-semibold text-white shadow-lg transition-transform active:scale-95 hover:bg-opacity-90"
                >
                    Get started
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
