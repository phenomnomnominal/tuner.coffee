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

      init
