import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const FoodHistoryList = ({ foodLogs }) => {
    // Flatten logs into items with timestamp context if needed, 
    // but schema says FoodLog has list of items. 
    // Let's display grouped by log for now, or just list all items today.

    // We want to list individual food items logged.
    // Each log has 'items' array.

    if (!foodLogs || foodLogs.length === 0) {
        return (
            <div className="w-full rounded-2xl bg-white p-6 shadow-sm mt-6 text-center">
                <h2 className="mb-4 font-serif text-xl font-medium text-gray-800 text-left">
                    Today's Meals
                </h2>
                <p className="text-gray-500 text-sm">No meals logged yet today.</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm mt-6">
            <h2 className="mb-6 font-serif text-xl font-medium text-gray-800">
                Today's Meals
            </h2>
            <div className="space-y-4">
                {foodLogs.map((log) => (
                    log.items.map((item, index) => (
                        <motion.div
                            key={`${log.id}-${item.id || index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                    <Utensils className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-xs text-gray-400">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-semibold text-primary">{item.calories} kcal</span>
                                <span className="text-xs text-gray-400">{item.portion_size}</span>
                            </div>
                        </motion.div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default FoodHistoryList;
