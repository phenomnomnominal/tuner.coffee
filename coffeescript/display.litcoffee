## UI and display functionality:
___

The **`Display`** module is in charge of creating the URL and communicating
with the user.

    Tuner.Display = do ->
      REPO_URL = 'https://github.com/phenomnomnominal/tuner.coffee'

### Templates:
___

Since all that is passed to the **`Tuner`** function is the selector for an
empty container, all the mark-up for the UI must be contained internally:

      Templates =
          MarkUp: """
                  <canvas></canvas>
                  <div class='target'></div>
                  <div class='dial'>
                    <div class='marker'></div>
                  </div>
                  <div class='note'>
                    <div class='name'></div>
                  </div>
                  <div class='help'>
                    <a href='#{REPO_URL}' target='_blank'>?</a>
                  </div>
                  """
          Fallback: """
                    <div class='sorry'>
                      <div>
                        <h1>Sorry...</h1>
                        <p>Looks like you need a better browser to use this tuner.</p>
                      </div>
                    </div>
                    <div class='help'>
                      <a href='#{REPO_URL}' target='_blank'>?</a>
                    </div>
                    """

### Shortcuts:
___

There are a few shortcuts to some commonly used functions, just to make
things a bit easier.

      $ = document.querySelector.bind document
      $.style = getComputedStyle.bind window
      $.class =
        add: (selector) ->
          el = $ selector
          (names...) -> names.forEach (name) -> el.classList.add name
        remove: (selector) ->
          el = $ selector
          (names...) -> names.forEach (name) -> el.classList.remove name

### init:
___

      init = (containerSelector, theme) ->

**`init`** sets the `'tuner'` class on the container element, and sets the
theme.

        $.class.add(containerSelector) 'tuner', theme

#### Render:

It then looks at the result of the capabilities test (the
`Tuner.mightWork` value), and inserts the correct template.

        if Tuner.mightWork
          $(containerSelector).innerHTML = Templates.MarkUp
        else
          $(containerSelector).innerHTML = Templates.Fallback

#### Event Listeners:

It also adds event listeners for the `'resize'` event (which makes sure
that the `<canvas>` is the right size), and the `'hover'` event for the help
link.

        resize = ->
          tunerStyle = $.style $(containerSelector)
          tunerHeight = parseInt tunerStyle.height, 10
          tunerWidth = parseInt tunerStyle.width, 10
          canvas = $ 'canvas'
          if canvas
            canvas.height = tunerHeight
            canvas.width = tunerWidth

          $.class.remove(containerSelector) 'small', 'medium', 'large'
          if tunerWidth < 420
            size = 'small'
          if 420 <= tunerWidth < 820
            size = 'medium'
          if 820 <= tunerWidth
            size = 'large'
          $.class.add(containerSelector) size

        addEventListener 'resize', resize
        resize()

        helpLink = $ '.help a'
        helpLink.addEventListener 'mouseover', -> helpLink.innerText = 'tuner.coffee'
        helpLink.addEventListener 'mouseout', -> helpLink.innerText = '?'

### update:
___

There are two main parts of the UI that need to be update.

#### HTML:

The name of the note that is currently being detected has to be updated or
removed, and the centre marker needs to be offset by the right number of cents.

      update = do ->

This means updating a CSS3 Transform from JavaScript, which unfortunately means
a little bit of black magic to get the right prefix:

        transform = do ->
          style = $.style document.documentElement
          spellings = [
            'transform',
            '-moz-transform', 'mozTransform', 'MozTransform',
            '-webkit-transform', 'webkitTransform', 'WebkitTransform',
            '-o-transform', 'oTransform', 'OTransform',
            '-ms-transform', 'msTransform', 'MsTransform'
          ]
          for spelling in spellings
            if {}.hasOwnProperty.call(style, spelling) or style[spelling]?
              return spelling

It is mostly a simple case of adding and removing classes, and creating the
new elements for the note name.

        updateHTML = (buffer, pitch, cents) ->
          $.class.remove('.tuner') 'tuned', 'untuned'
          name = $ '.name'
          marker = $('.marker').style
          name.innerHTML = ''
          if pitch? and cents?
            if Math.abs(cents) < 4
              $.class.add('.tuner') 'tuned'
            else
              $.class.add('.tuner') 'untuned'
            letter = document.createElement 'span'
            letter.textContent = pitch.substr 0, 1
            name.appendChild letter
            if '#' in pitch
              accidental = document.createElement 'sup'
              accidental.textContent = '#'
              name.appendChild accidental

But then it gets a little bit gross when the `translateY` value is updated.

            height = parseInt $.style($('.tuner')).height, 10
            marker.setProperty transform, "translateY(#{-(height / 2) * cents / 50}px)"
          else
            marker.setProperty transform, "translateY(0px)"

#### Canvas:

For the `<canvas>`, it is just a case of reading the audio data out of the
`buffer` and drawing it onto the screen.

The all-time peak amplitude is stored so that most data fits within the
`<canvas>`.

        timeMax = 0
        updateCanvas = (buffer) ->
          canvas = $ 'canvas'
          context = canvas.getContext '2d'
          context.clearRect 0, 0, canvas.width, canvas.height
          max = buffer.reduce (max = 0, next) -> 
            if Math.abs(next) > max then Math.abs(next) else max
          timeMax = if max > timeMax then max else timeMax
          timeHeight = canvas.height / buffer.length
          context.fillStyle = '#A5C7FD'
          for s in [0...buffer.length]
            y = timeHeight * s
            width = (canvas.width / 3) * (buffer[s] / timeMax)
            x = canvas.width / 2
            context.fillRect x, y, width, 0.5

#### update:

The **`update`** function simply calls the **`updateHTML`** function and then
the **`updateCanvas`** function.

        update = (buffer, pitch, cents)->
          updateHTML buffer, pitch, cents
          updateCanvas buffer

      { init, update }
