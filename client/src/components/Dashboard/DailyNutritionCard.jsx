import React from 'react';
import { motion } from 'framer-motion';

const DailyNutritionCard = ({ totals = { calories: 0, protein: 0, carbs: 0, fats: 0 } }) => {
    // Determine progress based on arbitrary goals (could come from user profile)
    // Goals: 2000 kcal, 150g Protein, 250g Carbs, 65g Fats
    const goals = {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fats: 65
    };

    const nutrients = [
        { label: 'Calories', value: `${Math.round(totals.calories || 0)} kcal`, progress: Math.min(100, ((totals.calories || 0) / goals.calories) * 100), color: 'bg-primary' },
        { label: 'Protein', value: `${Math.round(totals.protein || 0)}g`, progress: Math.min(100, ((totals.protein || 0) / goals.protein) * 100), color: 'bg-teal-400' },
        { label: 'Carbs', value: `${Math.round(totals.carbs || 0)}g`, progress: Math.min(100, ((totals.carbs || 0) / goals.carbs) * 100), color: 'bg-secondary' },
        { label: 'Fats', value: `${Math.round(totals.fats || 0)}g`, progress: Math.min(100, ((totals.fats || 0) / goals.fats) * 100), color: 'bg-slate-500' },
    ];

    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-xl font-medium text-gray-800">
                Daily nutritions
            </h2>
            <div className="space-y-6">
                {nutrients.map((item, index) => (
                    <div key={item.label} className="w-full">
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium text-gray-700">{item.label}</span>
                            <span className="text-gray-500">{item.value}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full rounded-full ${item.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyNutritionCard;
