## Tuner:
___

The global **`Tuner`** object acts as a container for the different modules of
the tuner.

    (exports ? @).Tuner = do ->

It also just happens to be a function that initialises the running
and display of the tuner.

      init = (containerSelector = '#Tuner', theme = 'light') ->
        Tuner.Display.init containerSelector, theme
        if Tuner.mightWork
          Tuner.Input.init()

It has a function attached to it that will stop the tuner running and clear the
UI.

      init.destroy = ->
        Tuner.Input.destroy()
        Tuner.Display.destroy()

      init
