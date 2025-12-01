import React from 'react';
import { Play, ArrowUp, ArrowRight, RotateCcw } from 'lucide-react';

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-brand-blue">

                {/* Header */}
                <div className="bg-brand-blue p-6 text-center">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Selamat Datang, Petualang! 🤖
                    </h2>
                    <p className="text-blue-100 mt-2 font-medium">
                        Bantu Robo mencapai rumahnya!
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">

                    {/* Step 1: Goal */}
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-yellow w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                            1
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 mb-1">Tujuan Kamu</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Arahkan Robo 🤖 ke Rumah 🏠. Hati-hati jangan sampai menabrak batu 🪨 atau keluar jalur!
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Controls */}
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-yellow w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                            2
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 mb-1">Buat Perintah</h3>
                            <p className="text-gray-600 leading-relaxed mb-2">
                                Gunakan tombol panah untuk menyusun langkah Robo:
                            </p>
                            <div className="flex gap-2">
                                <div className="bg-brand-blue/10 p-2 rounded-lg border border-brand-blue/20"><ArrowUp className="text-brand-blue" /></div>
                                <div className="bg-brand-blue/10 p-2 rounded-lg border border-brand-blue/20"><ArrowRight className="text-brand-blue" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Run */}
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-yellow w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                            3
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 mb-1">Jalankan!</h3>
                            <p className="text-gray-600 leading-relaxed mb-2">
                                Kalau sudah yakin, tekan tombol <span className="font-bold text-green-600">Jalankan!</span>
                            </p>
                            <div className="flex gap-2 items-center">
                                <button className="bg-brand-green text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm pointer-events-none">
                                    Jalankan! <Play size={16} className="fill-white" />
                                </button>
                                <span className="text-gray-400 text-sm">Salah langkah? Tekan <RotateCcw size={14} className="inline" /> Reset.</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-brand-blue hover:bg-blue-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Siap, Ayo Mulai! 🚀
                    </button>
                </div>

            </div>
        </div>
    );
};
