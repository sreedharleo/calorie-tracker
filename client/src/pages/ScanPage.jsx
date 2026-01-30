import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ScanPage = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Free up memory if there was a previous preview
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setAnalyzing(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await api.post('/food/analyze', formData);
            console.log("Analysis result:", response.data);
            const { items, image_url } = response.data;
            navigate('/log-meal', {
                state: {
                    analyzedData: items,
                    image: imagePreview,
                    serverImageUrl: image_url
                }
            });
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Failed to analyze image. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="h-screen flex flex-col relative bg-black">
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <h1 className="text-white font-semibold shadow-black drop-shadow-md">Scan Meal</h1>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white">
                    <Zap className="h-5 w-5" />
                </button>
            </div>

            {/* Main Content Area (Camera Viewport Placeholder) */}
            <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
                {imagePreview ? (
                    <div className="relative w-full h-full">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                        {/* Scanning Laser Effect */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="w-full h-[2px] bg-primary/80 shadow-[0_0_15px_4px_rgba(46,139,87,0.6)] absolute top-0 left-0 animate-scan z-10"></div>
                            {/* Optional: subtle gradient overlay that follows the laser? */}
                            <div className="w-full h-32 bg-gradient-to-b from-primary/20 to-transparent absolute top-0 left-0 animate-scan -translate-y-full"></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10">
                            <Camera className="h-10 w-10 text-text-muted" />
                        </div>
                        <p className="text-text-muted">Tap to capture or upload a meal</p>
                    </div>
                )}

                {/* Overlay Scanning Frame - Only show when NOT previewing or maybe keep as guide? */}
                {!imagePreview && (
                    <div className="absolute inset-x-12 inset-y-32 border-2 border-primary/50 rounded-3xl pointer-events-none">
                        <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-xl" />
                    </div>
                )}
            </div>

            {/* Bottom Action Area */}
            <div className="absolute bottom-[90px] left-0 right-0 z-20 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {imagePreview ? (
                    <div className="flex w-full gap-3">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setImagePreview(null)}
                        >
                            Retake
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleAnalyze}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze Meal'
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-6">
                        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all">
                            <ImageIcon className="h-6 w-6 text-white" />
                        </button>

                        <button
                            onClick={handleCameraClick}
                            className="h-20 w-20 rounded-full bg-primary border-4 border-white/20 flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 transition-transform"
                        >
                            <Camera className="h-8 w-8 text-white" />
                        </button>

                        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all opacity-0 pointer-events-none">
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanPage;
