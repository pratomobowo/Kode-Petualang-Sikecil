// Simple Sound Synthesizer using Standard Web Audio API
// More robust than buffer-based approaches for simple beeps

let audioCtx: AudioContext | undefined;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

type SoundType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface SoundParams {
    type: SoundType;
    freq: number;
    duration: number;
    vol: number;
    slide?: number; // Frequency slide in Hz
}

export const SOUNDS: Record<string, SoundParams[]> = {
    MOVE: [
        { type: 'sine', freq: 300, duration: 0.1, vol: 0.3 }
    ],
    ROTATE: [
        { type: 'sine', freq: 400, duration: 0.05, vol: 0.2 }
    ],
    COLLECT: [
        { type: 'square', freq: 880, duration: 0.1, vol: 0.1 },
        { type: 'square', freq: 1760, duration: 0.2, vol: 0.1 } // High ping
    ],
    WIN: [
        { type: 'triangle', freq: 523.25, duration: 0.2, vol: 0.2 }, // C5
        { type: 'triangle', freq: 659.25, duration: 0.2, vol: 0.2 }, // E5
        { type: 'triangle', freq: 783.99, duration: 0.4, vol: 0.2 }, // G5
        { type: 'triangle', freq: 1046.50, duration: 0.6, vol: 0.2 } // C6
    ],
    LOSE: [
        { type: 'sawtooth', freq: 150, duration: 0.3, vol: 0.2, slide: -50 },
        { type: 'sawtooth', freq: 100, duration: 0.4, vol: 0.2, slide: -50 }
    ],
    BUMP: [
        { type: 'sawtooth', freq: 100, duration: 0.1, vol: 0.3, slide: -50 }
    ],
    CLICK: [
        { type: 'triangle', freq: 800, duration: 0.05, vol: 0.1 }
    ]
};

const playTone = (ctx: AudioContext, params: SoundParams, startTime: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = params.type;
    osc.frequency.setValueAtTime(params.freq, startTime);

    if (params.slide) {
        osc.frequency.linearRampToValueAtTime(params.freq + params.slide, startTime + params.duration);
    }

    gain.gain.setValueAtTime(params.vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + params.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + params.duration);
};

export const playSound = (soundName: keyof typeof SOUNDS, isMuted: boolean = false) => {
    if (isMuted) return;

    try {
        const ctx = initAudio();
        const now = ctx.currentTime;
        const sequence = SOUNDS[soundName];

        let timeOffset = 0;
        sequence.forEach(note => {
            playTone(ctx, note, now + timeOffset);
            timeOffset += note.duration * 0.8; // Overlap slightly
        });

    } catch (e) {
        console.error("Audio play failed", e);
    }
};
