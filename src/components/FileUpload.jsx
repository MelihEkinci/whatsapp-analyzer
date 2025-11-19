import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            readFile(files[0]);
        }
    }, [onFileUpload]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            readFile(files[0]);
        }
    };

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            onFileUpload(text);
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                    WhatsApp Chat Analyzer
                </h1>
                <p className="text-slate-400 text-lg">
                    Unlock insights from your conversations. Private & Secure.
                </p>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.02, borderColor: '#4ade80' }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-xl p-12 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/50 backdrop-blur-sm cursor-pointer transition-colors hover:bg-slate-800/80"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-full">
                        <Upload className="w-12 h-12 text-green-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold text-slate-200">
                            Drop your chat file here
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                            or click to browse (supports .txt)
                        </p>
                    </div>
                </div>
                <input
                    type="file"
                    id="fileInput"
                    accept=".txt"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                delay={0.5}
                className="mt-8 text-xs text-slate-500"
            >
                Your data is processed locally and never leaves your device.
            </motion.p>
        </div>
    );
};

export default FileUpload;
