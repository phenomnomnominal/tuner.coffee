## IO:
___

The **`Input`** module is in charge of creating the connection to the users
microphone, and using the other modules to perform real-time pitch detection.

    Tuner.Input = do ->

### init:
___

Everything starts with the call to `getUserMedia`. Passing in `{ audio: true }`
sets up the connection to the users microphone, and the `success` or `error`
callback will be triggered depending on the result.

      init = ->
        navigator.getUserMedia audio: true, success, error

### success:
___

      success = (stream) ->

If a successful connection is made to the user media device (microphone), the
audio set-up is intialised. The source of the audio (the `stream` from the
microphone) is connected through the low-pass filter and the high-pass filter,
and ends up in the `dataBuffer`. The `dataBuffer` must be connected to the
destination, but as the `dataBuffer` does not create any output, no audible
sound is played.

        audioContext = Tuner.Constants.AUDIO_CONTEXT
        src = audioContext.createMediaStreamSource stream
        src.connect Tuner.Filter.LP
        Tuner.Filter.LP.connect Tuner.Filter.HP
        Tuner.Filter.HP.connect Tuner.DataBuffer.filler
        Tuner.DataBuffer.filler.connect audioContext.destination

Finally, the interval that calls the pitch detection function is started. It
will be triggered `10` times a second.

        setInterval Tuner.PitchDetection.process, 100

### Error:
___

There are quite a few things that can go wrong with the connection, so for
now it is just logged to the console.

      error = (e) ->
        console.error e

It is also worth having a global error logger, in case something goes wrong
somewhere else.

      window.onerror = error

      { init }
