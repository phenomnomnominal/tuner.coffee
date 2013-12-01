(function() {
  (typeof exports !== "undefined" && exports !== null ? exports : this).Tuner = (function() {
    var init;
    init = function(containerSelector) {
      if (containerSelector == null) {
        containerSelector = '#Tuner';
      }
      Tuner.Display.init(containerSelector);
      if (Tuner.mightWork) {
        return Tuner.Input.init();
      }
    };
    return init;
  })();

}).call(this);

(function() {
  Tuner.mightWork = (function() {
    var mightWork;
    window.AudioContext = (function() {
      return window.AudioContext || window.mozAudioContext || window.webkitAudioContext || window.msAudioContext || window.oAudioContext;
    })();
    AudioContext.prototype.createScriptProcessor = (function() {
      return AudioContext.prototype.createScriptProcessor || AudioContext.prototype.createJavaScriptNode;
    })();
    navigator.getUserMedia = (function() {
      return navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    })();
    return mightWork = window.AudioContext && navigator.getUserMedia;
  })();

}).call(this);

(function() {
  Tuner.Constants = (function() {
    var audioContext;
    audioContext = new AudioContext();
    return {
      AUDIO_CONTEXT: audioContext,
      SAMPLE_RATE: audioContext.sampleRate,
      LOW_PASS_FREQUENCY: 4000,
      HIGH_PASS_FREQUENCY: 20,
      FILTER_Q: 0.1,
      BUFFER_FILL_SIZE: 2048,
      FFTSIZE: 8192,
      REFERENCE_PITCH: 440
    };
  })();

}).call(this);

(function() {
  Tuner.DataBuffer = (function() {
    var buffer, bufferFillSize, filler, insertEnd, insertStart, shiftFromEnd, shiftFromStart, shiftToEnd, shiftToStart, _i, _ref, _results;
    buffer = (function() {
      _results = [];
      for (var _i = 0, _ref = Tuner.Constants.FFTSIZE; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(function() {
      return 0;
    });
    bufferFillSize = Tuner.Constants.BUFFER_FILL_SIZE;
    shiftToStart = 0;
    shiftToEnd = buffer.length - Tuner.Constants.BUFFER_FILL_SIZE;
    shiftFromStart = Tuner.Constants.BUFFER_FILL_SIZE;
    shiftFromEnd = buffer.length;
    insertStart = buffer.length - Tuner.Constants.BUFFER_FILL_SIZE;
    insertEnd = buffer.length;
    filler = Tuner.Constants.AUDIO_CONTEXT.createScriptProcessor(bufferFillSize);
    filler.onaudioprocess = function(e) {
      var d, input, _ref1, _ref2;
      input = (function() {
        var _j, _len, _ref1, _results1;
        _ref1 = e.inputBuffer.getChannelData(0);
        _results1 = [];
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          d = _ref1[_j];
          _results1.push(d);
        }
        return _results1;
      })();
      [].splice.apply(buffer, [shiftToStart, shiftToEnd - shiftToStart].concat(_ref1 = buffer.slice(shiftFromStart, shiftFromEnd))), _ref1;
      return ([].splice.apply(buffer, [insertStart, insertEnd - insertStart].concat(_ref2 = input.slice(0, input.length))), _ref2);
    };
    buffer.filler = filler;
    return buffer;
  })();

}).call(this);

(function() {
  var __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Tuner.Display = (function() {
    var $, REPO_URL, Templates, init, update;
    REPO_URL = 'https://github.com/phenomnomnominal/tuner.coffee';
    Templates = {
      MarkUp: "<canvas></canvas>\n<div class='target'></div>\n<div class='dial'>\n  <div class='marker'></div>\n</div>\n<div class='note'>\n  <div class='name'></div>\n</div>\n<div class='help'>\n  <a href='" + REPO_URL + "' target='_blank'>?</a>\n</div>",
      Fallback: "<div class='sorry'>\n  <div>\n    <h1>Sorry...</h1>\n    <p>Looks like you need a better browser to use this tuner.</p>\n  </div>\n</div>\n<div class='help'>\n  <a href='" + REPO_URL + "' target='_blank'>?</a>\n</div>"
    };
    $ = document.querySelector.bind(document);
    $.style = getComputedStyle.bind(window);
    $["class"] = {
      add: function(selector) {
        var el;
        el = $(selector);
        return function() {
          var names;
          names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return names.forEach(function(name) {
            return el.classList.add(name);
          });
        };
      },
      remove: function(selector) {
        var el;
        el = $(selector);
        return function() {
          var names;
          names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return names.forEach(function(name) {
            return el.classList.remove(name);
          });
        };
      }
    };
    init = function(containerSelector, theme) {
      var helpLink, resize;
      if (theme == null) {
        theme = 'light';
      }
      $["class"].add(containerSelector)('tuner', theme);
      if (Tuner.mightWork) {
        $(containerSelector).innerHTML = Templates.MarkUp;
      } else {
        $(containerSelector).innerHTML = Templates.Fallback;
      }
      resize = function() {
        var canvas, size, tunerHeight, tunerStyle, tunerWidth;
        tunerStyle = $.style($(containerSelector));
        tunerHeight = parseInt(tunerStyle.height, 10);
        tunerWidth = parseInt(tunerStyle.width, 10);
        canvas = $('canvas');
        if (canvas) {
          canvas.height = tunerHeight;
          canvas.width = tunerWidth;
        }
        $["class"].remove(containerSelector)('small', 'medium', 'large');
        if (tunerWidth < 420) {
          size = 'small';
        }
        if ((420 <= tunerWidth && tunerWidth < 820)) {
          size = 'medium';
        }
        if (820 <= tunerWidth) {
          size = 'large';
        }
        return $["class"].add(containerSelector)(size);
      };
      addEventListener('resize', resize);
      resize();
      helpLink = $('.help a');
      helpLink.addEventListener('mouseover', function() {
        return helpLink.innerText = 'tuner.coffee';
      });
      return helpLink.addEventListener('mouseout', function() {
        return helpLink.innerText = '?';
      });
    };
    update = (function() {
      var timeMax, transform, updateCanvas, updateHTML;
      transform = (function() {
        var spelling, spellings, style, _i, _len;
        style = $.style(document.documentElement);
        spellings = ['transform', '-moz-transform', 'mozTransform', 'MozTransform', '-webkit-transform', 'webkitTransform', 'WebkitTransform', '-o-transform', 'oTransform', 'OTransform', '-ms-transform', 'msTransform', 'MsTransform'];
        for (_i = 0, _len = spellings.length; _i < _len; _i++) {
          spelling = spellings[_i];
          if ({}.hasOwnProperty.call(style, spelling) || (style[spelling] != null)) {
            return spelling;
          }
        }
      })();
      updateHTML = function(buffer, pitch, cents) {
        var accidental, height, letter, marker, name;
        $["class"].remove('.tuner')('tuned', 'untuned');
        name = $('.name');
        marker = $('.marker').style;
        name.innerHTML = '';
        if ((pitch != null) && (cents != null)) {
          if (Math.abs(cents) < 4) {
            $["class"].add('.tuner')('tuned');
          } else {
            $["class"].add('.tuner')('untuned');
          }
          letter = document.createElement('span');
          letter.textContent = pitch.substr(0, 1);
          name.appendChild(letter);
          if (__indexOf.call(pitch, '#') >= 0) {
            accidental = document.createElement('sup');
            accidental.textContent = '#';
            name.appendChild(accidental);
          }
          height = parseInt($.style($('.tuner')).height, 10);
          return marker.setProperty(transform, "translateY(" + (-(height / 2) * cents / 50) + "px)");
        } else {
          return marker.setProperty(transform, "translateY(0px)");
        }
      };
      timeMax = 0;
      updateCanvas = function(buffer) {
        var canvas, context, max, s, timeHeight, width, x, y, _i, _ref, _results;
        canvas = $('canvas');
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        max = buffer.reduce(function(max, next) {
          if (max == null) {
            max = 0;
          }
          if (Math.abs(next) > max) {
            return Math.abs(next);
          } else {
            return max;
          }
        });
        timeMax = max > timeMax ? max : timeMax;
        timeHeight = canvas.height / buffer.length;
        context.fillStyle = '#A5C7FD';
        _results = [];
        for (s = _i = 0, _ref = buffer.length; 0 <= _ref ? _i < _ref : _i > _ref; s = 0 <= _ref ? ++_i : --_i) {
          y = timeHeight * s;
          width = (canvas.width / 3) * (buffer[s] / timeMax);
          x = canvas.width / 2;
          _results.push(context.fillRect(x, y, width, 0.5));
        }
        return _results;
      };
      return update = function(buffer, pitch, cents) {
        updateHTML(buffer, pitch, cents);
        return updateCanvas(buffer);
      };
    })();
    return {
      init: init,
      update: update
    };
  })();

}).call(this);

(function() {
  Tuner.FFT = (function() {
    var FFT;
    FFT = (function() {
      function FFT(bufferSize, sampleRate) {
        var bit, limit, _i, _j, _results, _results1,
          _this = this;
        this.bufferSize = bufferSize;
        this.sampleRate = sampleRate;
        this.bandwidth = this.sampleRate / this.bufferSize;
        this.spectrum = new Float32Array(this.bufferSize / 2);
        this.real = new Float32Array(this.bufferSize);
        this.imag = new Float32Array(this.bufferSize);
        this.reverseTable = new Uint32Array(this.bufferSize);
        limit = 1;
        bit = bufferSize >> 1;
        while (limit < bufferSize) {
          (function() {
            _results = [];
            for (var _i = 0; 0 <= limit ? _i < limit : _i > limit; 0 <= limit ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this).forEach(function(i) {
            return _this.reverseTable[i + limit] = _this.reverseTable[i] + bit;
          });
          limit <<= 1;
          bit >>= 1;
        }
        this.sinTable = new Float32Array(this.bufferSize);
        this.cosTable = new Float32Array(this.bufferSize);
        (function() {
          _results1 = [];
          for (var _j = 0; 0 <= bufferSize ? _j < bufferSize : _j > bufferSize; 0 <= bufferSize ? _j++ : _j--){ _results1.push(_j); }
          return _results1;
        }).apply(this).forEach(function(i) {
          _this.sinTable[i] = Math.sin(-Math.PI / i);
          return _this.cosTable[i] = Math.cos(-Math.PI / i);
        });
      }

      FFT.prototype.transform = function(buffer) {
        var bufferSize, cPSI, cPSR, cosTable, halfSize, imag, pSSI, pSSR, real, reverseTable, sinTable, spectrum, _i, _j, _results, _results1;
        bufferSize = this.bufferSize;
        cosTable = this.cosTable;
        sinTable = this.sinTable;
        reverseTable = this.reverseTable;
        real = this.real;
        imag = this.imag;
        spectrum = this.spectrum;
        halfSize = 1;
        (function() {
          _results = [];
          for (var _i = 0; 0 <= bufferSize ? _i < bufferSize : _i > bufferSize; 0 <= bufferSize ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).forEach(function(i) {
          real[i] = buffer[reverseTable[i]];
          return imag[i] = 0;
        });
        while (halfSize < bufferSize) {
          pSSR = cosTable[halfSize];
          pSSI = sinTable[halfSize];
          cPSR = 1;
          cPSI = 0;
          (function() {
            _results1 = [];
            for (var _j = 0; 0 <= halfSize ? _j < halfSize : _j > halfSize; 0 <= halfSize ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this).forEach(function(fftStep) {
            var i, offset, ti, tmpReal, tr;
            i = fftStep;
            while (i < bufferSize) {
              offset = i + halfSize;
              tr = (cPSR * real[offset]) - (cPSI * imag[offset]);
              ti = (cPSR * imag[offset]) + (cPSI * real[offset]);
              real[offset] = real[i] - tr;
              imag[offset] = imag[i] - ti;
              real[i] += tr;
              imag[i] += ti;
              i += halfSize << 1;
            }
            tmpReal = cPSR;
            cPSR = (tmpReal * pSSR) - (cPSI * pSSI);
            return cPSI = (tmpReal * pSSI) + (cPSI * pSSR);
          });
          halfSize = halfSize << 1;
        }
        return this.calculateSpectrum();
      };

      FFT.prototype.calculateSpectrum = function() {
        var bSi, imag, real, spectrum, sqrt, _i, _ref, _results;
        spectrum = this.spectrum;
        real = this.real;
        imag = this.imag;
        bSi = 2 / this.bufferSize;
        sqrt = Math.sqrt;
        return (function() {
          _results = [];
          for (var _i = 0, _ref = this.bufferSize / 2; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).forEach(function(index) {
          var i, r;
          r = real[index];
          i = imag[index];
          return spectrum[index] = bSi * sqrt(r * r + i * i);
        });
      };

      return FFT;

    })();
    return new FFT(Tuner.Constants.FFTSIZE, Tuner.Constants.SAMPLE_RATE / 4);
  })();

}).call(this);

(function() {
  Tuner.Filter = (function() {
    var HP, LP;
    LP = (function() {
      var lp;
      lp = Tuner.Constants.AUDIO_CONTEXT.createBiquadFilter();
      lp.type = lp.LOWPASS;
      lp.frequency = Tuner.Constants.LOW_PASS_FREQUENCY;
      lp.Q = Tuner.Constants.FILTER_Q;
      return lp;
    })();
    HP = (function() {
      var hp;
      hp = Tuner.Constants.AUDIO_CONTEXT.createBiquadFilter();
      hp.type = hp.HIGHPASS;
      hp.frequency = Tuner.Constants.HIGH_PASS_FREQUENCY;
      hp.Q = Tuner.Constants.FILTER_Q;
      return hp;
    })();
    return {
      LP: LP,
      HP: HP
    };
  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty;

  Tuner.frequencyUtils = (function() {
    var createFrequencies, getPitch;
    createFrequencies = (function() {
      var OCTAVES, PITCH_NAMES;
      PITCH_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      OCTAVES = [1, 2, 3, 4, 5, 6, 7];
      return function(reference) {
        var freqs, note;
        if (reference == null) {
          reference = Tuner.Constants.REFERENCE_PITCH;
        }
        freqs = {};
        note = 4;
        OCTAVES.forEach(function(octave) {
          return PITCH_NAMES.forEach(function(pitch) {
            var pitchName;
            pitchName = pitch + octave;
            return freqs[pitchName] = Math.pow(2, (note++ - 49) / 12) * reference;
          });
        });
        return freqs;
      };
    })();
    getPitch = function(freq, minDiff) {
      var cents, diff, key, note, rat, val, _ref;
      if (minDiff == null) {
        minDiff = Infinity;
      }
      _ref = Tuner.frequencies;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        val = _ref[key];
        if (Math.abs(freq - val) < minDiff) {
          minDiff = Math.abs(freq - val);
          diff = freq - val;
          rat = freq / val;
          note = key;
        }
      }
      cents = 1200 * (Math.log(freq / Tuner.frequencies[note]) / Math.LN2);
      return [note, cents];
    };
    return {
      createFrequencies: createFrequencies,
      getPitch: getPitch
    };
  })();

  Tuner.frequencies = Tuner.frequencyUtils.createFrequencies();

}).call(this);

(function() {
  Tuner.Gauss = (function() {
    var gauss, process;
    gauss = function(length, i, α, pow, E) {
      if (α == null) {
        α = 0.5;
      }
      if (pow == null) {
        pow = Math.pow;
      }
      if (E == null) {
        E = Math.E;
      }
      return pow(E, -0.5 * pow((i - (length - 1) / 2) / (α * (length - 1) / 2), 2));
    };
    process = function(input, α) {
      var i, length, _i, _results;
      length = input.length;
      _results = [];
      for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
        _results.push(input[i] *= gauss(length, i, α));
      }
      return _results;
    };
    return {
      process: process
    };
  })();

}).call(this);

(function() {
  Tuner.Input = (function() {
    var error, init, success;
    init = function() {
      return navigator.getUserMedia({
        audio: true
      }, success, error);
    };
    success = function(stream) {
      var audioContext, src;
      audioContext = Tuner.Constants.AUDIO_CONTEXT;
      src = audioContext.createMediaStreamSource(stream);
      src.connect(Tuner.Filter.LP);
      Tuner.Filter.LP.connect(Tuner.Filter.HP);
      Tuner.Filter.HP.connect(Tuner.DataBuffer.filler);
      Tuner.DataBuffer.filler.connect(audioContext.destination);
      return setInterval(Tuner.PitchDetection.process, 100);
    };
    error = function(e) {
      return console.error(e);
    };
    window.onerror = error;
    return {
      init: init
    };
  })();

}).call(this);

(function() {
  Tuner.NoiseRemoval = (function() {
    var limit, process, processCount;
    processCount = 0;
    limit = -Infinity;
    process = function(spectrum) {
      if (processCount < 10) {
        limit = spectrum.reduce(function(p, n) {
          if (p == null) {
            p = limit;
          }
          if (n > p) {
            return n;
          } else {
            return p;
          }
        });
        limit = limit > 0.001 ? 0.001 : limit;
        return processCount++;
      } else {
        return Tuner.NoiseRemoval.limit = limit;
      }
    };
    return {
      process: process
    };
  })();

}).call(this);

(function() {
  Tuner.PitchDetection = (function() {
    var bandwidth, dataBuffer, fft, maxPeakCount, maxPeaks, process;
    bandwidth = Tuner.Constants.SAMPLE_RATE / Tuner.Constants.FFTSIZE;
    maxPeaks = 0;
    maxPeakCount = 0;
    dataBuffer = Tuner.DataBuffer;
    fft = Tuner.FFT;
    process = function() {
      var bufferCopy, cents, firstFreq, freq, interp, l, note, p, peak, peaks, q, r, resampled, s, secondFreq, spectrum, spectrumPeaks, thirdFreq, _i, _j, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      bufferCopy = dataBuffer.slice(0, dataBuffer.length);
      Tuner.Gauss.process(bufferCopy);
      resampled = bufferCopy.map(function(val, index) {
        if (index % 4) {
          return 0;
        } else {
          return val;
        }
      });
      fft.transform(resampled);
      spectrum = (function() {
        var _i, _len, _ref, _results;
        _ref = fft.spectrum;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s);
        }
        return _results;
      })();
      spectrum = spectrum.slice(0, spectrum.length / 4);
      if (!Tuner.NoiseRemoval.limit) {
        Tuner.NoiseRemoval.process(spectrum);
      }
      spectrumPeaks = spectrum.map(function(val, index) {
        return {
          x: index,
          y: val
        };
      });
      spectrumPeaks.sort(function(peakA, peakB) {
        return peakB.y - peakA.y;
      });
      peaks = spectrumPeaks.slice(0, 8).filter(function(peak) {
        return peak.y > Tuner.NoiseRemoval.limit;
      });
      if (peaks.length > 0 && Tuner.NoiseRemoval.limit) {
        for (p = _i = 0, _ref = peaks.length; 0 <= _ref ? _i < _ref : _i > _ref; p = 0 <= _ref ? ++_i : --_i) {
          for (q = _j = 0, _ref1 = peaks.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; q = 0 <= _ref1 ? ++_j : --_j) {
            if (p !== q) {
              if (Math.abs(((_ref2 = peaks[p]) != null ? _ref2.x : void 0) - ((_ref3 = peaks[q]) != null ? _ref3.x : void 0)) < 5) {
                peaks.splice(q, 1);
              }
            }
          }
        }
        peaks.sort(function(a, b) {
          return a.x - b.x;
        });
        maxPeaks = maxPeaks < peaks.length ? peaks.length : maxPeaks;
        if (maxPeaks > 0) {
          maxPeakCount = 0;
        }
        firstFreq = peaks[0].x * bandwidth;
        if (peaks.length > 1) {
          secondFreq = peaks[1].x * bandwidth;
          if ((1.4 < (_ref4 = firstFreq / secondFreq) && _ref4 < 1.6)) {
            peak = peaks[1];
          }
        }
        if (peaks.length > 2) {
          thirdFreq = peaks[2].x * bandwidth;
          if ((1.4 < (_ref5 = firstFreq / thirdFreq) && _ref5 < 1.6)) {
            peak = peaks[2];
          }
        }
        if (peaks.length > 1 || maxPeaks === 1) {
          if (peak == null) {
            peak = peaks[0];
          }
          l = {
            x: peak.x - 1,
            y: Math.log(spectrum[peak.x - 1])
          };
          p = {
            x: peak.x,
            y: Math.log(spectrum[peak.x])
          };
          r = {
            x: peak.x + 1,
            y: Math.log(spectrum[peak.x + 1])
          };
          interp = 0.5 * ((l.y - r.y) / (l.y - (2 * p.y) + r.y)) + p.x;
          freq = interp * bandwidth;
          _ref6 = Tuner.frequencyUtils.getPitch(freq), note = _ref6[0], cents = _ref6[1];
          return Tuner.Display.update(bufferCopy, note, cents);
        }
      } else {
        maxPeaks = 0;
        maxPeakCount++;
        return Tuner.Display.update(bufferCopy);
      }
    };
    return {
      process: process
    };
  })();

}).call(this);
