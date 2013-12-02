## Gaussian window function:
___

A **[Gaussian][Gauss]** window function is used on the time-domain buffer data.
Because a time-domain Gaussian is also Gaussian in the frequency-domain, and
since the *log* of a  Gaussian is a parabola, the resulting data can be used
for exact quadratic interpolation in the frequency domain, which results in
very accurate frequency estimation.

[Gauss]: http://en.wikipedia.org/wiki/Window_function#Gaussian_windows

    Tuner.Gauss = do ->

**`gauss`** is the actual window function, which is evaluated for a given
position `i`, in a buffer of size `length`. The **`α`** value of the Gaussian
is inversely proportional to the standard deviation of the function, meaning
that the larger **`α`** is, the narrower the peak of the function is.

      gauss = (length, i, α = 0.5, pow = Math.pow, E = Math.E) ->
        pow(E, -0.5 * pow((i - (length - 1) / 2) / (α * (length - 1) / 2), 2))

Applying the windowing function to a buffer is just a matter of calling the
**`gauss`** function on each item in the buffer.

      process = (input, α) ->
        length = input.length
        for i in [0...length]
          input[i] *= gauss(length, i, α)

      { process }
