import React, { useState } from 'react';
import { ChevronLeft, Search, Plus, Salad, Utensils, Beef, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

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
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        color: 'bg-green-100 text-green-600'
    })) : [
        { id: 1, name: 'Chicken Caprese', calories: '740 kcal', protein: 45, carbs: 12, fats: 55, icon: Salad, color: 'bg-orange-100 text-orange-600' },
        { id: 2, name: 'Veggie Stir-Fry', calories: '560 kcal', protein: 18, carbs: 65, fats: 22, icon: Utensils, color: 'bg-green-100 text-green-600' },
        { id: 3, name: 'Beef with Broccoli', calories: '840 kcal', protein: 52, carbs: 35, fats: 40, icon: Beef, color: 'bg-red-100 text-red-600' },
        { id: 4, name: 'Taco Stuffed Peppers', calories: '690 kcal', protein: 38, carbs: 45, fats: 32, icon: Utensils, color: 'bg-yellow-100 text-yellow-600' },
    ];
    // State to track selected items (IDs)
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isLogging, setIsLogging] = useState(false);

    const toggleSelection = (id) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleLogMeal = async () => {
        setIsLogging(true);
        try {
            // Determine items to log: if selection exists, log selected. Else, log all.
            const hasSelection = selectedItems.size > 0;
            const itemsToProcess = hasSelection
                ? mealsToDisplay.filter(meal => selectedItems.has(meal.id))
                : mealsToDisplay;

            const itemsToLog = itemsToProcess.map(meal => {
                // Parse calories string "740 kcal" -> 740
                const calories = parseInt(meal.calories.replace(/[^0-9]/g, ''), 10);
                return {
                    name: meal.name,
                    calories: calories || 0,
                    protein: meal.protein || 0.0,
                    carbs: meal.carbs || 0.0,
                    fats: meal.fats || 0.0,
                    portion_size: meal.portion || "1 serving",
                    confidence_score: meal.confidence || 0.0
                };
            });

            const payload = {
                image_url: location.state?.serverImageUrl || scannedImage || null, // Prefer server URL
                items: itemsToLog
            };

            await api.post('/food/log', payload);
            navigate('/'); // Redirect to Dashboard
        } catch (error) {
            console.error("Failed to log meal:", error);
            alert("Failed to log meal. Please try again.");
        } finally {
            setIsLogging(false);
        }
    };

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
                            <button
                                onClick={() => toggleSelection(meal.id)}
                                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${selectedItems.has(meal.id)
                                    ? 'bg-secondary text-white'
                                    : 'bg-gray-100 text-gray-400 hover:bg-primary hover:text-white'
                                    }`}>
                                {selectedItems.has(meal.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Log Meal Button */}
            {/* Located higher up to avoid mobile nav (approx bottom-24 or bottom-28) */}
            <div className="fixed bottom-24 left-0 right-0 px-6 z-50">
                <button
                    onClick={handleLogMeal}
                    disabled={isLogging}
                    className="w-full rounded-2xl bg-secondary py-4 font-semibold text-white shadow-xl shadow-secondary/20 transition-all active:scale-95 hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLogging ? 'Logging...' : (selectedItems.size === 0 ? 'Log all meals' : `Log ${selectedItems.size} meal${selectedItems.size !== 1 ? 's' : ''}`)}
                </button>
            </div>
        </div>
    );
};

export default MealLogger;
