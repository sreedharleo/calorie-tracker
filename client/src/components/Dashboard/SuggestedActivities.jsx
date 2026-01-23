import React from 'react';
import { Footprints, Activity, Dumbbell, Flower2 } from 'lucide-react';
// Using Flower2 as proxy for Pilates/Yoga if needed, or stick to simple icons

const SuggestedActivities = () => {
    const activities = [
        { name: 'Walking', icon: Footprints },
        { name: 'Running', icon: Activity },
        { name: 'Workout', icon: Dumbbell },
        { name: 'Pilates', icon: Flower2 },
    ];

    return (
        <div className="mt-6 w-full rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-serif text-xl font-medium text-gray-800">
                Suggested activities
            </h2>
            <div className="flex justify-between">
                {activities.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-2">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-primary hover:text-white">
                            <item.icon className="h-6 w-6" />
                        </button>
                        <span className="text-xs font-medium text-gray-500">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedActivities;
