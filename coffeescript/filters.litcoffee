## Filters:
___

The tuner can recognise pitches between C1 (`32.7Hz`) and B7 (`3951.1Hz`), so
any frequencies outside of that range can be ignored.

    Tuner.Filter = do ->

### LP:
___

A **[low-pass filter][LP]** is also used to attenuate frequencies above `4kHz`.

[LP]: http://en.wikipedia.org/wiki/Low-pass_filter

      LP = do ->
        lp = Tuner.Constants.AUDIO_CONTEXT.createBiquadFilter()
        lp.type = lp.LOWPASS
        lp.frequency = Tuner.Constants.LOW_PASS_FREQUENCY
        lp.Q = Tuner.Constants.FILTER_Q
        lp

### HP:
___

A **[high-pass filter][HP]** is used to attenuate frequencies below `20Hz` - but
they are outside the frequency response of most basic microphones anyway.

[HP]: http://en.wikipedia.org/wiki/High-pass_filter

      HP = do ->
        hp = Tuner.Constants.AUDIO_CONTEXT.createBiquadFilter()
        hp.type = hp.HIGHPASS
        hp.frequency = Tuner.Constants.HIGH_PASS_FREQUENCY
        hp.Q = Tuner.Constants.FILTER_Q
        hp

      { LP, HP }
