## Noise Removal: 
___

Since the tuner will likely use just a standard device microphone, background
noise is going to be a big issue - things like noisy fans, people talking.

The first second of audio data is presumed to be purely noise. This may be a
dangerous assumption, but given that the user will need to grant permission
for the microphone to be accessed, it shoud be okay.

    Tuner.NoiseRemoval = do ->
      processCount = 0
      limit = -Infinity

### NoiseRemoval.process:

The `process` function will be called `10` times in the first second, and the
maximal value from the `10` FFT spectrums is set as the `limit`. The value
of the `limit` is limited to `0.001` to hopefully prevent any real data
from setting a `limit` that is too high.

      process = (spectrum) ->
        if processCount < 10
          limit = spectrum.reduce (p = limit, n) -> if n > p then n else p
          limit = if limit  > 0.001 then 0.001 else limit
          processCount++

The peak noise value from the initial second of data is set on the 
**`NoiseRemoval`** module.

        else
          Tuner.NoiseRemoval.limit = limit

      { process }
