import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Plus, Flame, Utensils } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [todayCalories, setTodayCalories] = useState(0);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/food/history');
            setLogs(res.data);
            calculateTodayCalories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const calculateTodayCalories = (history) => {
        const today = new Date().toDateString();
        const sum = history
            .filter(log => new Date(log.timestamp).toDateString() === today)
            .reduce((acc, log) => acc + log.total_calories, 0);
        setTodayCalories(sum);
    };

    const progress = Math.min((todayCalories / (user?.daily_calorie_target || 2000)) * 100, 100);

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="bg-white shadow px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.email?.split('@')[0]}</h1>
                <p className="text-gray-500">Keep up the good work!</p>
            </div>

            {/* Summary Card */}
            <div className="px-4 mt-6">
                <div className="bg-primary rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Calories Today</p>
                            <h2 className="text-4xl font-bold">{todayCalories}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-100 text-sm">Goal</p>
                            <p className="text-xl font-semibold">{user?.daily_calorie_target || 0}</p>
                        </div>
                    </div>

                    <div className="w-full bg-indigo-900/30 rounded-full h-3">
                        <div
                            className="bg-white rounded-full h-3 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="mt-2 text-xs text-indigo-100 text-right">
                        {user?.daily_calorie_target - todayCalories} kcal remaining
                    </div>
                </div>
            </div>

            {/* Recent Meals */}
            <div className="px-4 mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Meals</h3>
                <div className="space-y-4">
                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
                            <Utensils className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p>No meals logged yet</p>
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gray-100 p-2 rounded-full">
                                        {/* Placeholder for image thumbnail if available */}
                                        <span className="text-xl">🥗</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {log.items.map(i => i.name).join(', ') || 'Meal'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-primary">{log.total_calories}</span>
                                    <span className="text-xs text-gray-500">kcal</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FAB */}
            <Link
                to="/scan"
                className="fixed bottom-6 right-6 bg-secondary text-white p-4 rounded-full shadow-xl hover:bg-emerald-600 transition-colors"
            >
                <Plus className="h-8 w-8" />
            </Link>
        </div>
    );
}
