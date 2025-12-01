// ZzFX - Zuper Zmall Zound Zynth - v1.2.0
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

let zzfxV = 0.3; // Volume
let zzfxX: AudioContext | undefined; // Audio Context

// Play a sound
export const zzfx = (...parameters: (number | undefined)[]) => {
    if (!zzfxX) zzfxX = new (window.AudioContext || (window as any).webkitAudioContext)();
    let R = zzfxX.sampleRate; // Use actual sample rate

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
    let startSlide = slide *= 500 * PI2 / R / R;
    let startFrequency = frequency *= (1 + randomness * 2 * Math.random() - randomness) * PI2 / R;

    // Generate waveform
    let b = [], t = 0, tm = 0, i = 0, n = 1;
    let length = R * (attack + decay + sustain + release + delay) | 0;

    for (; i < length; b[i++] = n) {
        if (!(++t % (100 * repeatTime | 0))) {
            n = -n;
            volume *= 1 - repeatTime;
            frequency *= 1 + repeatTime;
            startSlide *= 1 + repeatTime;
        }

        startSlide += deltaSlide *= 500 * PI2 / R / R / R;
        startFrequency += startSlide += slide;

        tm += startFrequency;
        let s = Math.sin(tm * shapeCurve);

        // Apply shape
        // 0: Sine, 1: Triangle, 2: Sawtooth, 3: Tan, 4: Noise
        if (shape === 1) {
            s = sign(s); // Square/Triangle-ish
        } else if (shape === 2) {
            s = (tm % PI2) / PI2 * 2 - 1; // Sawtooth
        } else if (shape === 3) {
            s = Math.tan(tm); // Tan
        } else if (shape === 4) {
            s = Math.random() * 2 - 1; // Noise
        }

        // Apply modulation and bit crush
        s = s * volume * (1 - bitCrush + bitCrush * Math.sin(t * PI2 * modulation / R));

        // Apply Envelope
        s *= (
            i < attack ? i / attack :
                i < attack + decay ? 1 - ((i - attack) / decay) * (1 - sustainVolume) :
                    i < attack + decay + sustain ? sustainVolume :
                        i < length - delay ? (length - i - delay) / release * sustainVolume :
                            0
        );

        s = delay ? s / 2 + (delay > i ? 0 : (i < length - delay ? 1 : 0) * b[i - delay | 0] / 2) : s;
    }

    // Play sound
    let buffer = zzfxX.createBuffer(1, b.length, R);
    buffer.getChannelData(0).set(b);
    let source = zzfxX.createBufferSource();
    source.buffer = buffer;
    source.connect(zzfxX.destination);
    source.start();
    return source;
}

// Sound Presets
export const SOUNDS = {
    // Volume, Randomness, Freq, Attack, Sustain, Release, Shape, ShapeCurve, Slide, DeltaSlide, PitchJump, PitchJumpTime, RepeatTime
    MOVE: [1.0, 0, 220, 0, .05, .05, 0, 1, 0, 0, 0, 0, 0], // Simple Sine Blip
    ROTATE: [0.5, 0, 300, 0, .05, .05, 0, 1, 0, 0, 0, 0, 0], // Higher Sine Blip
    COLLECT: [1.2, 0, 880, 0, .1, .3, 1, 1, 0, 0, 0, 0, 0], // Square/Chime
    WIN: [1.0, 0, 440, 0, .2, .5, 2, 1, .1, 0, 0, 0, 0], // Sawtooth Fanfare
    LOSE: [1.0, 0, 150, .1, .2, .5, 4, 1, -1, 0, 0, 0, 0], // Noise Decay
    BUMP: [1.0, 0, 100, .01, .1, .2, 4, 1, 0, 0, 0, 0, 0], // Short Noise
    CLICK: [0.5, 0, 1000, 0, .01, .01, 4, 1, 0, 0, 0, 0, 0], // Tiny Click
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
