import React, { useState } from 'react';
import { ChevronLeft, Search, Plus, Salad, Utensils, Beef, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MealLogger = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    // Get analyzed data if available
    const analyzedData = location.state?.analyzedData;
    const scannedImage = location.state?.image;

    // Use analyzed data if present, otherwise default suggested meals
    const mealsToDisplay = analyzedData ? analyzedData.map((item, index) => ({
        id: index,
        name: item.name,
        calories: `${item.calories} kcal`,
        portion: item.portion_size,
        icon: Utensils,
        confidence: item.confidence_score,
        color: 'bg-green-100 text-green-600'
    })) : [
        { id: 1, name: 'Chicken Caprese', calories: '740 kcal', icon: Salad, color: 'bg-orange-100 text-orange-600' },
        { id: 2, name: 'Veggie Stir-Fry', calories: '560 kcal', icon: Utensils, color: 'bg-green-100 text-green-600' },
        { id: 3, name: 'Beef with Broccoli', calories: '840 kcal', icon: Beef, color: 'bg-red-100 text-red-600' },
        { id: 4, name: 'Taco Stuffed Peppers', calories: '690 kcal', icon: Utensils, color: 'bg-yellow-100 text-yellow-600' },
    ];

    return (
        <div className="min-h-screen bg-background pb-24 px-6 pt-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-gray-100">
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="font-serif text-xl font-medium text-orange-500">
                    {analyzedData ? 'Analyzed Results' : 'Log your meal'}
                </h1>
                <div className="w-10"></div>
            </div>

            {/* Scanned Image Preview */}
            {scannedImage && (
                <div className="mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                    <img src={scannedImage} alt="Scanned meal" className="h-full w-full object-cover" />
                </div>
            )}

            {/* Meal Type Header */}
            {!analyzedData && (
                <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                        <Utensils className="h-4 w-4 text-orange-500" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-800">Lunch</h2>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-8 relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for meal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl bg-gray-100 py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Suggested/Detected Meals List */}
            <div className="mb-8">
                <h3 className="mb-4 font-serif text-lg font-medium text-gray-800">
                    {analyzedData ? 'Detected items' : 'Suggested meals'}
                </h3>
                <div className="space-y-3">
                    {mealsToDisplay.map((meal) => (
                        <motion.div
                            key={meal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 flex-shrink-0 rounded-full ${meal.color} flex items-center justify-center`}>
                                    <meal.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">{meal.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {meal.calories}
                                        {meal.portion && <span className="text-gray-400"> • {meal.portion}</span>}
                                    </p>
                                </div>
                            </div>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-primary hover:text-white">
                                <Plus className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Log Meal Button */}
            <div className="fixed bottom-8 left-0 right-0 px-6">
                <button className="w-full rounded-full bg-secondary py-4 font-semibold text-white shadow-lg transition-transform active:scale-95 hover:bg-opacity-90">
                    Log meal
                </button>
            </div>
        </div>
    );
};

export default MealLogger;
