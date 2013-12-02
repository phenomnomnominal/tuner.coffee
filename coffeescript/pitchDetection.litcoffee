## Pitch Detection:
___

    Tuner.PitchDetection = do ->

A few local references are made, for the sake of brevity.

      bandwidth = Tuner.Constants.SAMPLE_RATE / Tuner.Constants.FFTSIZE
      maxPeaks = 0
      maxPeakCount = 0
      
      dataBuffer = Tuner.DataBuffer
      fft = Tuner.FFT

### process:
___

**`process`** is where the real magic of the tuner happens. 10 times 
each second, the data in the buffer is proccessed. This involves several
steps:

      process = ->

A copy is made of the buffer data.

        bufferCopy = dataBuffer[0...dataBuffer.length]

The Gaussian window is applied to the buffer data.
   
        Tuner.Gauss.process bufferCopy
        
The buffer data is downsampled by a factor of four and then upsampled
the original data rate by inserting `0`s.

        resampled = bufferCopy.map (val, index) -> if index % 4 then 0 else val

The FFT is then applied to the upsampled data.
    
        fft.transform resampled
        spectrum = (s for s in fft.spectrum)
        spectrum = spectrum[0...spectrum.length / 4]

The first second of data is assumed to be noise, so it is passed to the
**`NoiseRemoval`** module to handle. Once it has got enough data, `limit`
will be set, and the data will skip that step.

        unless Tuner.NoiseRemoval.limit
          Tuner.NoiseRemoval.process spectrum

The values from the FFT spectrum are sorted by their peak value.

        spectrumPeaks = spectrum.map (val, index) -> x: index, y: val
        spectrumPeaks.sort (peakA, peakB) -> (peakB.y - peakA.y)

The top `8` highest peaks are selected, provided they are large enough.

        peaks = spectrumPeaks[0...8].filter (peak) -> peak.y > Tuner.NoiseRemoval.limit

If there are any peaks found, any values from either side of the peaks
are removed (as they are also likely to be peaks, but they provide no
useful information). The remaining peaks are sorted by their frequency
again, with lower values having lover indexes.

        if peaks.length > 0 and Tuner.NoiseRemoval.limit
          for p in [0...peaks.length]
            for q in [0...peaks.length]
              if p isnt q
                if Math.abs(peaks[p]?.x - peaks[q]?.x) < 5
                  peaks.splice q, 1
          peaks.sort (a, b) -> (a.x - b.x)

The maximum number of peaks that has been seen recently is recorded, 
as it is sometimes the case that harmonics are percieved longer that
the fundamental.
      
          maxPeaks = if maxPeaks < peaks.length then peaks.length else maxPeaks
          if maxPeaks > 0 then maxPeakCount = 0

A test is run to check if the highest peak is a harmonic by checking
the most common frequency ratios - namely `1.5` times the fundamental
(perfect 5th) and `2` times the fundamental (perfect octave) - and then
swap the values if needed.

          firstFreq = peaks[0].x * bandwidth
          if peaks.length > 1
            secondFreq = peaks[1].x * bandwidth
            if 1.4 < (firstFreq / secondFreq) < 1.6
              peak = peaks[1]
          if peaks.length > 2
            thirdFreq = peaks[2].x * bandwidth
            if 1.4 < (firstFreq / thirdFreq) < 1.6
              peak = peaks[2]
          if peaks.length > 1 or maxPeaks is 1
            if not peak?
              peak = peaks[0]

If a maximal peak in the FFT spectrum is found, parabolic interpolation
is performed on the log of the peak and the values either side, giving
an accurate frequency representation.

            l = x: peak.x - 1, y: Math.log(spectrum[peak.x - 1])
            p = x: peak.x, y: Math.log(spectrum[peak.x])
            r = x: peak.x + 1, y: Math.log(spectrum[peak.x + 1])

            interp = (0.5 * ((l.y - r.y) / (l.y - (2 * p.y) + r.y)) + p.x)

The frequency estimation is compared with the generated pitch value 
to find the closest pitch, and the number of cents that the input audio
is away from it.

            freq = interp * bandwidth
            [note, cents] = Tuner.frequencyUtils.getPitch freq

This information is then displayed to the user.

            Tuner.Display.update bufferCopy, note, cents

If no large enough peaks are found, the display isn't changed, and if
none are found for a sufficiently long time, the display is cleared.

        else
          maxPeaks = 0
          maxPeakCount++
          Tuner.Display.update bufferCopy

      { process }
  