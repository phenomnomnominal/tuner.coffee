## Constants:
___

    Tuner.Constants = do ->

### AudioContext constants:
___

* Audio Context - global instance of **`AudioContext`**
* Sample rate - samples per second through the Web Audio API

      audioContext = new AudioContext()

      AUDIO_CONTEXT: audioContext
      SAMPLE_RATE: audioContext.sampleRate

### Filter constants:
___

* Low Pass Frequency - attenuation frequency for the low-pass filter.
* High Pass Frequency - attenuation frequency for the high-pass filter.
* Filter Q - cut-off frequency peak resonance.

      LOW_PASS_FREQUENCY: 4000
      HIGH_PASS_FREQUENCY: 20
      FILTER_Q: 0.1

### DataBuffer constants:
___

* Buffer Fill Size - shifting window buffer window size.

      BUFFER_FILL_SIZE: 2048

### FFT constants:
___

* FFT size - Fourier transform input buffer size.

      FFTSIZE: 8192

### Pitch constants:
___

* Reference Pitch - default reference pitch for frequency generation.

      REFERENCE_PITCH: 440
