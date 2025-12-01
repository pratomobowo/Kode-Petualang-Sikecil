// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

let zzfxV = 0.3; // Volume
let zzfxR = 44100; // Sample Rate
let zzfxX: AudioContext | undefined; // Audio Context

// Play a sound
export const zzfx = (...parameters: (number | undefined)[]) => {
    if (!zzfxX) zzfxX = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create oscillator
    let [
        volume = 1,
        randomness = .05,
        frequency = 220,
        attack = 0,
        sustain = 0,
        release = .1,
        shape = 0,
        shapeCurve = 1,
        slide = 0,
        deltaSlide = 0,
        pitchJump = 0,
        pitchJumpTime = 0,
        repeatTime = 0,
        noise = 0,
        modulation = 0,
        bitCrush = 0,
        delay = 0,
        sustainVolume = 1,
        decay = 0,
        tremolo = 0
    ] = parameters;

    // Init parameters
    let PI2 = Math.PI * 2;
    let sign = (v: number) => v > 0 ? 1 : -1;
    let startSlide = slide *= 500 * PI2 / zzfxR / zzfxR;
    let startFrequency = frequency *= (1 + randomness * 2 * Math.random() - randomness) * PI2 / zzfxR;

    // Generate waveform
    let b = [], t = 0, tm = 0, i = 0, n = 1;
    let length = zzfxR * (attack + decay + sustain + release + delay) | 0;

    for (; i < length; b[i++] = n) {
        if (!(++t % (100 * repeatTime | 0))) {
            n = -n;
            volume *= 1 - repeatTime;
            frequency *= 1 + repeatTime;
            startSlide *= 1 + repeatTime;
        }

        startSlide += deltaSlide *= 500 * PI2 / zzfxR / zzfxR / zzfxR;
        startFrequency += startSlide += slide;

        tm += startFrequency;
        let s = Math.sin(tm * shapeCurve);
        let k = Math.abs(s);

        // Apply shape
        s = shape === 0 ? s :
            shape === 1 ? sign(s) :
                shape === 2 ? (k > 1 ? sign(s) : s) :
                    shape === 3 ? sign(s) * (1 - k) :
                        Math.sin(tm);

        s = s * volume * (1 - bitCrush + bitCrush * Math.sin(t * PI2 * modulation / zzfxR)) * (
            i < attack ? i / attack :
                i < attack + decay ? 1 - ((i - attack) / decay) * (1 - sustainVolume) :
                    i < attack + decay + sustain ? sustainVolume :
                        i < length - delay ? (length - i - delay) / release * sustainVolume :
                            0
        );

        s = delay ? s / 2 + (delay > i ? 0 : (i < length - delay ? 1 : 0) * b[i - delay | 0] / 2) : s;
    }

    // Play sound
    let buffer = zzfxX.createBuffer(1, b.length, zzfxR);
    buffer.getChannelData(0).set(b);
    let source = zzfxX.createBufferSource();
    source.buffer = buffer;
    source.connect(zzfxX.destination);
    source.start();
    return source;
}

// Sound Presets
export const SOUNDS = {
    MOVE: [1.0, 0, 130.8, 0, .1, 0, 1, 0.6, 0, 0, 0, 0, 0, .5], // Short blip
    ROTATE: [0.5, 0, 200, 0, .05, 0, 1, 1.8, 0, 0, 0, 0, 0, .1], // Quieter blip
    COLLECT: [1.2, 0, 1046, 0, .1, .2, 1, 1.8, 0, 0, 0, 0, 0, 0], // High pitched chime
    WIN: [1.5, 0, 523.2, .1, .5, .4, 2, 2.5, 0, 0, 0, 0, .1, 0], // Fanfare-ish
    LOSE: [1.0, 0, 100, .1, .5, .5, 3, 3, 0, 0, 0, 0, 0, 2], // Low buzz
    BUMP: [1.0, 0, 150, .05, .1, .1, 3, 1, -5, 0, 0, 0, 0, 5], // Dissonant noise
    CLICK: [0.5, 0, 1500, 0, .01, 0, 1, 1, 0, 0, 0, 0, 0, 5], // Click
};

export const playSound = (soundName: keyof typeof SOUNDS, isMuted: boolean = false) => {
    if (isMuted) return;
    try {
        // @ts-ignore
        zzfx(...SOUNDS[soundName]);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};
