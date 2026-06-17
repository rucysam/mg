/* =========================================================
   js/sound.js
   전자음(디지털 비프 톤) 기반 사운드 이펙트 시스템.
   외부 음원 파일을 전혀 쓰지 않고 Web Audio API의 오실레이터로 모든 소리를 그 자리에서 합성합니다.
   (이미지 없이 SVG로 아이콘을 그리는 것과 같은 방식의 접근입니다.)

   사용법: window.GameSound.play('success') 처럼 이름으로 호출합니다.
   ========================================================= */
(function () {
  var STORAGE_KEY = 'ai-not-robot-sound-muted';
  var audioCtx = null;
  var muted = false;

  try {
    muted = window.localStorage && localStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    muted = false;
  }

  function ensureContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // notes: [{ freq, duration(초), type, gain, delay(초) }] 형태의 배열을 받아 순서대로(또는 겹쳐서) 재생합니다.
  function playTones(notes) {
    if (muted) return;
    var ctx = ensureContext();
    if (!ctx) return;
    var now = ctx.currentTime;

    notes.forEach(function (note) {
      var osc = ctx.createOscillator();
      var gainNode = ctx.createGain();
      osc.type = note.type || 'square';
      osc.frequency.value = note.freq;

      var start = now + (note.delay || 0);
      var dur = note.duration || 0.12;
      var peakGain = note.gain != null ? note.gain : 0.16;

      // 클릭 잡음 없이 부드럽게 커지고 작아지도록 짧은 램프를 줍니다.
      gainNode.gain.setValueAtTime(0.0001, start);
      gainNode.gain.exponentialRampToValueAtTime(peakGain, start + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur + 0.02);
    });
  }

  // 단계/상황별 전자음 정의. 모두 사각파/톱니파 위주로 만들어 "디지털 보안 시스템" 느낌을 줍니다.
  var SOUNDS = {
    tap: function () {
      playTones([{ freq: 760, duration: 0.045, type: 'square', gain: 0.1 }]);
    },
    success: function () {
      playTones([
        { freq: 660, duration: 0.09, type: 'square', gain: 0.16, delay: 0 },
        { freq: 990, duration: 0.12, type: 'square', gain: 0.18, delay: 0.07 }
      ]);
    },
    fail: function () {
      playTones([
        { freq: 220, duration: 0.16, type: 'sawtooth', gain: 0.15, delay: 0 },
        { freq: 160, duration: 0.22, type: 'sawtooth', gain: 0.15, delay: 0.1 }
      ]);
    },
    comboUp: function () {
      playTones([
        { freq: 880, duration: 0.06, type: 'square', gain: 0.11, delay: 0 },
        { freq: 1180, duration: 0.08, type: 'square', gain: 0.13, delay: 0.05 }
      ]);
    },
    tick: function () {
      playTones([{ freq: 1400, duration: 0.04, type: 'square', gain: 0.07 }]);
    },
    stageStart: function () {
      playTones([{ freq: 520, duration: 0.07, type: 'triangle', gain: 0.1 }]);
    },
    gameStart: function () {
      playTones([
        { freq: 440, duration: 0.08, type: 'square', gain: 0.14, delay: 0 },
        { freq: 660, duration: 0.08, type: 'square', gain: 0.14, delay: 0.09 },
        { freq: 880, duration: 0.12, type: 'square', gain: 0.16, delay: 0.18 }
      ]);
    },
    gameClear: function () {
      playTones([
        { freq: 660, duration: 0.1, type: 'square', gain: 0.16, delay: 0 },
        { freq: 880, duration: 0.1, type: 'square', gain: 0.16, delay: 0.1 },
        { freq: 1320, duration: 0.22, type: 'square', gain: 0.18, delay: 0.2 }
      ]);
    },
    gameOver: function () {
      playTones([
        { freq: 300, duration: 0.18, type: 'sawtooth', gain: 0.15, delay: 0 },
        { freq: 220, duration: 0.18, type: 'sawtooth', gain: 0.15, delay: 0.15 },
        { freq: 140, duration: 0.3, type: 'sawtooth', gain: 0.15, delay: 0.3 }
      ]);
    }
  };

  window.GameSound = {
    play: function (name) {
      if (SOUNDS[name]) SOUNDS[name]();
    },
    isMuted: function () {
      return muted;
    },
    setMuted: function (value) {
      muted = !!value;
      try {
        if (window.localStorage) localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
      } catch (e) {
        /* localStorage를 쓸 수 없는 환경이어도 재생/음소거 동작 자체에는 영향이 없습니다. */
      }
    },
    toggleMuted: function () {
      this.setMuted(!muted);
      return muted;
    },
    // 브라우저의 자동재생 정책 때문에, 사용자의 첫 탭/클릭 안에서 한 번 호출해두면
    // 이후 재생이 막히지 않습니다. (예: 시작 버튼 클릭 시 호출)
    unlock: function () {
      ensureContext();
    }
  };
})();
