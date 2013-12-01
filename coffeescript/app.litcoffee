## Tuner:
___

The global **`Tuner`** object acts as a container for the different modules of
the tuner.

    (exports ? @).Tuner = do ->

It also just happens to be a function that initialises the running
and display of the tuner.

      init = (containerSelector = '#Tuner') ->
        Tuner.Display.init containerSelector
        if Tuner.mightWork
          Tuner.Input.init()

      init
