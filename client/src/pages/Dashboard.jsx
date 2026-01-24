import React from 'react';
import { motion } from 'framer-motion';
import DailyNutritionCard from '../components/Dashboard/DailyNutritionCard';
import SuggestedActivities from '../components/Dashboard/SuggestedActivities';
import FoodHistoryList from '../components/Dashboard/FoodHistoryList';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [foodLogs, setFoodLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/food/history');
                setFoodLogs(response.data);

                // Calculate today's totals
                const today = new Date().toDateString();
                const todayLogs = response.data.filter(log => new Date(log.timestamp).toDateString() === today);

                const newTotals = todayLogs.reduce((acc, log) => {
                    return {
                        calories: acc.calories + (log.total_calories || 0),
                        protein: acc.protein + (log.total_protein || 0),
                        carbs: acc.carbs + (log.total_carbs || 0),
                        fats: acc.fats + (log.total_fats || 0)
                    };
                }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

                setTotals(newTotals);

            } catch (error) {
                console.error("Failed to fetch food history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

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
                <DailyNutritionCard totals={totals} />
            </motion.div>

            {/* Food History List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <FoodHistoryList foodLogs={foodLogs} />
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
