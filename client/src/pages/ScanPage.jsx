import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Check, X, Edit2 } from 'lucide-react';
import api from '../api/axios';

export default function ScanPage() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
            // Auto analyze
            analyzeImage(selectedFile);
        }
    };

    const analyzeImage = async (imageFile) => {
        setAnalyzing(true);
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const res = await api.post('/food/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Add 'selected' property and default quantity/calories editing
            const detected = res.data.map(item => ({
                ...item,
                selected: item.confidence_score > 0.8, // Auto-select high confidence
                originalCalories: item.calories,
                multiplier: 1
            }));
            setResults(detected);
        } catch (err) {
            console.error("Analysis failed", err);
            alert("Failed to analyze image");
        } finally {
            setAnalyzing(false);
        }
    };

    const toggleSelect = (index) => {
        const newResults = [...results];
        newResults[index].selected = !newResults[index].selected;
        setResults(newResults);
    };

    const updateMultiplier = (index, value) => {
        const newResults = [...results];
        const item = newResults[index];
        item.multiplier = parseFloat(value);
        item.calories = Math.round(item.originalCalories * item.multiplier);
        setResults(newResults);
    }

    const handleSave = async () => {
        const selectedItems = results.filter(i => i.selected);
        if (selectedItems.length === 0) return alert("Select at least one item");

        try {
            await api.post('/food/log', {
                items: selectedItems.map(item => ({
                    name: item.name,
                    calories: item.calories,
                    portion_size: `${item.multiplier}x ${item.portion_size}`,
                    confidence_score: item.confidence_score
                })),
                image_url: "mock_url_for_now" // The server creates URL but we should probably upload separate or handle it. 
                // For MVP, server saves image on 'analyze', but ideally 'log' should reference it. 
                // We'll just send items for now as per schema.
            });
            navigate('/');
        } catch (err) {
            console.error("Save failed", err);
            alert("Failed to save log");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Camera View / Image Preview */}
            <div className="relative h-96 bg-black flex items-center justify-center overflow-hidden">
                {image ? (
                    <img src={image} alt="Capture" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                        <Camera className="h-16 w-16 mb-2" />
                        <p>Tap to capture</p>
                    </div>
                )}

                {/* File Input Overlay */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                />

                {analyzing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="font-semibold">Analyzing Food...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {results && (
                <div className="p-4 bg-gray-50 rounded-t-3xl -mt-6 relative min-h-[calc(100vh-20rem)] text-gray-900">
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

                    <h2 className="text-xl font-bold mb-4">Detected Foods</h2>

                    <div className="space-y-4">
                        {results.map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border-2 transition-all ${item.selected ? 'border-primary bg-indigo-50' : 'border-transparent bg-white shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1" onClick={() => toggleSelect(index)}>
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-xs text-gray-500">Confidence: {Math.round(item.confidence_score * 100)}%</p>
                                    </div>
                                    <button
                                        onClick={() => toggleSelect(index)}
                                        className={`h-6 w-6 rounded-full flex items-center justify-center border ${item.selected ? 'bg-primary border-primary text-white' : 'border-gray-300'
                                            }`}
                                    >
                                        {item.selected && <Check className="h-4 w-4" />}
                                    </button>
                                </div>

                                {item.selected && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase">Portion</label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-sm font-medium">{item.portion_size} x</span>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    min="0.1"
                                                    value={item.multiplier}
                                                    onChange={(e) => updateMultiplier(index, e.target.value)}
                                                    className="w-16 p-1 border rounded text-center"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <label className="text-xs font-medium text-gray-500 uppercase">Calories</label>
                                            <p className="text-xl font-bold text-primary">{item.calories} <span className="text-xs font-normal text-gray-400">kcal</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-gray-500 font-medium">Total Estimated</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {results.filter(i => i.selected).reduce((acc, i) => acc + i.calories, 0)} kcal
                            </span>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                            Log Meal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
