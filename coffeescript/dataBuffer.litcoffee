### Data Buffer:
___

In order to always have enough data to get sufficient resolution while running
the tuner in real-time, a shifting window buffer is used. This buffer always
contains `8192` samples, however the data is shifted along every `2048` samples.

    Tuner.DataBuffer = do ->

The buffer is initialised here, as well as the indices that are used to shift
data around within the buffer.

      buffer = [0...Tuner.Constants.FFTSIZE].map -> 0
      bufferFillSize = Tuner.Constants.BUFFER_FILL_SIZE

      shiftToStart = 0
      shiftToEnd = buffer.length - Tuner.Constants.BUFFER_FILL_SIZE
      shiftFromStart = Tuner.Constants.BUFFER_FILL_SIZE
      shiftFromEnd = buffer.length

      insertStart = buffer.length - Tuner.Constants.BUFFER_FILL_SIZE
      insertEnd = buffer.length

The actual **`ScriptProcessorNode`** that does the shifting operation is then
created, and the `onaudioprocess` handler is assigned.

      filler = Tuner.Constants.AUDIO_CONTEXT.createScriptProcessor bufferFillSize

### onaudioprocess:
___

      filler.onaudioprocess = (e) ->

First the data is read out of the `inputBuffer` and converted into an Array,

        input = (d for d in e.inputBuffer.getChannelData(0))

then the last `6144` samples are shifted along in the buffer,

        buffer[shiftToStart...shiftToEnd] = buffer[shiftFromStart...shiftFromEnd]

and the `inputBuffer` is added to the end of the buffer.

        buffer[insertStart...insertEnd] = input[0...input.length]

The **`ScriptProcessorNode`** is attached to the `buffer` and then the buffer
is returned from the module.

      buffer.filler = filler
      buffer
