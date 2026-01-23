import React from 'react';
import { motion } from 'framer-motion';

const DailyNutritionCard = () => {
    const nutrients = [
        { label: 'Calories', value: '2000 kcal', progress: 75, color: 'bg-primary' },
        { label: 'Protein', value: '35%', progress: 35, color: 'bg-teal-400' },
        { label: 'Carbs', value: '50%', progress: 50, color: 'bg-secondary' },
        { label: 'Fats', value: '15%', progress: 15, color: 'bg-slate-500' },
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
