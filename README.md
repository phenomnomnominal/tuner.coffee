## tuner.coffee

**tuner.coffee** is a JavaScript implementation of a chromatic tuner using [**`getUserMedia`**][gUM] and the [**Web Audio API**][WAAPI], written in [**CoffeeScript**][Coffee]!

## What does it do?

**tuner.coffee** aims to provide an accurate, real-time chromatic tuner, that can easily be dropped into any website. It uses modern browser features like the [**Web Audio API**][WAAPI] and the [**`getUserMedia`**][gUM] function to listen with the user's microphone and find the nearest pitch in real-time.

## How can I use it?

Easy! Just grab the JS & CSS files from the **[github repo][github]** and include them in your page as follows:

    <link rel='stylesheet' type='text/css' href='tuner.css'/>
    <script type='text/javascript' src='tuner.min.js'></script>

This will create a global **Tuner** function, which takes `2` arguments:

* `containerSelector` - the CSS selector for the element to place the tuner in. *(Defaults to `'#Tuner'`)*

* `theme` - the CSS class of the theme to add to the tuner, current options are `'dark'` or `'light'`. *(Defaults to `'light'`)*

You need to call the function in your own JS file - or just directly on the page:

    <script>
        Tuner('.mySelector', 'dark'); 
    </script>

This will create the tuner in your page, and ask the user for permission to use their microphone.

It can be seen in action [here][tuner].

## What browsers does this work in?

Currently tested and working in latest Chrome (both Desktop and Android), and the latest Firefox.

## Documentation:

* [app.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/app)
* [capabilities.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/capabilities.html)
* [constants.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/constants.html)
* [dataBuffer.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/dataBuffer.html)
* [display.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/display.html)
* [fft.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/fft.html)
* [filters.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/filters.html)
* [frequencies.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/frequencies.html)
* [gauss.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/gauss.html)
* [io.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/io.html)
* [noiseRemoval.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/noiseRemoval.html)
* [pitchDetection.litcoffee](http://phenomnomnominal.github.io/projects/tuner/docs/pitchDetection.html)

[gUM]: https://developer.mozilla.org/en-US/docs/Web/API/Navigator.getUserMedia
[WAAPI]: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
[Coffee]: http://coffeescript.org
[Docco]: http://jashkenas.github.io/docco/
[docs]: http://phenomnomnominal.github.io/projects/tuner/docs/app
[github]: https://github.com/phenomnomnominal/tuner.coffee
[tuner]: http://phenomnomnominal.github.io/projects/tuner

