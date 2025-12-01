import Link from 'next/link';
import { Bot, Gamepad2, Home } from 'lucide-react';

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4 font-sans text-white">
            <div className="w-full max-w-4xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg text-yellow-300">
                        Pilih Permainan
                    </h1>
                    <p className="text-xl opacity-90">
                        Mau main apa hari ini? 🎮
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">

                    {/* Game 1: Kode Petualang Cilik */}
                    <Link
                        href="/robo/levels"
                        className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-md border-4 border-white/30 rounded-3xl p-6 md:p-8 transition-all hover:scale-105 active:scale-95 shadow-xl flex flex-col items-center text-center"
                    >
                        <div className="bg-blue-500 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                            <Bot size={48} className="text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Kode Petualang Cilik</h2>
                        <p className="opacity-80 leading-relaxed">
                            Belajar logika coding dengan membantu Robo mencari jalan pulang! 🤖
                        </p>
                        <div className="mt-6 bg-yellow-400 text-purple-900 font-bold px-6 py-2 rounded-full text-sm group-hover:bg-yellow-300 transition-colors">
                            Main Sekarang!
                        </div>
                    </Link>

                    {/* Game 2: Placeholder */}
                    <div className="relative bg-black/20 border-4 border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center grayscale opacity-70 cursor-not-allowed">
                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Segera Hadir
                        </div>
                        <div className="bg-gray-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <Gamepad2 size={48} className="text-white/50" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white/50">Game Misterius</h2>
                        <p className="opacity-50 leading-relaxed">
                            Petualangan baru sedang disiapkan... Tunggu tanggal mainnya! 🚀
                        </p>
                    </div>

                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white hover:underline transition-colors">
                        <Home size={18} /> Kembali ke Halaman Utama
                    </Link>
                </div>

            </div>
        </div>
    );
}
