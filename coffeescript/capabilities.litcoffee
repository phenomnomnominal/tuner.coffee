## Shim & Functionality checks:
___

There are a few main APIs that the browser needs for the core functionality of
the tuner to work. `Tuner.mightWork` is a boolean that is set based on the
availability of these APIs. It should hopefully indicate whether the device has
the features that are required for the tuner to work.

    Tuner.mightWork = do ->

### AudioContext:
___

First, there is a check for the **`AudioContext`** constructor. This is the
interface to the **[Web Audio API][WAAPI]**, which provides the ability to
manipulate audio data from JavaScript.

[WAAPI]: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html

      window.AudioContext = do ->
        window.AudioContext or
        window.mozAudioContext or
        window.webkitAudioContext or
        window.msAudioContext or
        window.oAudioContext

Some differences between different versions of the API specification need to be
normalised.

      AudioContext.prototype.createScriptProcessor = do ->
        AudioContext.prototype.createScriptProcessor or
        AudioContext.prototype.createJavaScriptNode

### getUserMedia:
___

Then there is a check for the **[`getUserMedia`][gUM]** function, which allows
the browser to have access to the data-stream from any audio or video inputs
on the device.

[gUM]: https://developer.mozilla.org/en-US/docs/Web/API/Navigator.getUserMedia

      navigator.getUserMedia = do ->
        navigator.getUserMedia or
        navigator.mozGetUserMedia or
        navigator.webkitGetUserMedia or
        navigator.msGetUserMedia or
        navigator.oGetUserMedia

If both the **`AudioContext`** constructor and the **`getUserMedia`** function
are available then there is a reasonable chance that the tuner will work -
there are still probably going to be false positives though!

      mightWork = window.AudioContext and navigator.getUserMedia
