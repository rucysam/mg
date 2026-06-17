/* =========================================================
   js/main.js
   화면 전환, 난이도/타이머/콤보/점수/스테이지 진행을 담당하는 메인 컨트롤러.
   이 파일은 반드시 모든 스테이지 스크립트보다 나중에 로드되어야 합니다.
   ========================================================= */
(function () {
  var TOTAL_LIVES = 3;
  var TRANSITION_DELAY = 700; // 성공/실패 토스트 후 다음 화면으로 넘어가기까지 대기 시간(ms)
  var BASE_POINTS_PER_STAGE = 100;
  var COMBO_BONUS_STEP = 10; // 콤보 1단계 오를 때마다 추가되는 보너스
  var COMBO_BONUS_CAP = 50; // 콤보 보너스 최대치

  // 난이도별 설정. tol/time은 각 스테이지 파일이 자체 DIFF 표에서 참고하는 키이고,
  // scoreMul은 이 파일(main.js)에서 최종 점수에 곱해주는 배율입니다.
  // 레벨 디자인 조정 시 이 값들을 바꾸면 전체 난이도/점수 체감이 달라집니다.
  var DIFFICULTY_PRESETS = {
    easy: { label: '쉬움', scoreMul: 0.8 },
    normal: { label: '보통', scoreMul: 1.0 },
    hard: { label: '어려움', scoreMul: 1.25 }
  };

  var els = {
    screens: {
      title: document.getElementById('screen-title'),
      game: document.getElementById('screen-game'),
      result: document.getElementById('screen-result')
    },
    btnStart: document.getElementById('btn-start'),
    btnRetry: document.getElementById('btn-retry'),
    btnMute: document.getElementById('btn-mute'),
    diffButtons: Array.prototype.slice.call(document.querySelectorAll('.diff-btn')),
    progressTrack: document.getElementById('progress-track'),
    livesTrack: document.getElementById('lives-track'),
    stageLabel: document.getElementById('stage-label'),
    stageTimer: document.getElementById('stage-timer'),
    comboBadge: document.getElementById('combo-badge'),
    stageTitle: document.getElementById('stage-title'),
    stageInstruction: document.getElementById('stage-instruction'),
    stageArea: document.getElementById('stage-area'),
    toast: document.getElementById('toast'),
    resultEyebrow: document.getElementById('result-eyebrow'),
    resultHeadline: document.getElementById('result-headline'),
    rankBadge: document.getElementById('rank-badge'),
    resultScore: document.getElementById('result-score'),
    resultDetail: document.getElementById('result-detail'),
    brandMark: document.getElementById('brand-mark')
  };

  var state = {
    stageIndex: 0,
    lives: TOTAL_LIVES,
    score: 0,
    combo: 0,
    difficultyKey: 'normal'
  };

  var toastTimer = null;

  // 모든 단계의 버튼 클릭에 공통으로 짧은 탭 사운드를 줍니다.
  // stageArea의 내용은 매 단계마다 바뀌지만, 이 리스너는 stageArea 자체에 한 번만 등록되므로
  // 각 단계 파일을 건드리지 않고도 모든 단계에 자동으로 적용됩니다.
  els.stageArea.addEventListener(
    'click',
    function (e) {
      if (e.target.closest('button')) {
        window.GameSound.play('tap');
      }
    },
    true
  );

  function showScreen(name) {
    Object.keys(els.screens).forEach(function (key) {
      els.screens[key].classList.toggle('active', key === name);
    });
  }

  function showToast(message, type) {
    els.toast.textContent = message;
    els.toast.className = 'toast show toast--' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove('show');
    }, TRANSITION_DELAY - 50);
  }

  function renderProgress() {
    els.progressTrack.innerHTML = '';
    window.STAGES.forEach(function (stage, idx) {
      var dot = document.createElement('span');
      dot.className = 'dot';
      if (idx < state.stageIndex) dot.classList.add('done');
      if (idx === state.stageIndex) dot.classList.add('current');
      els.progressTrack.appendChild(dot);
    });
  }

  function renderLives() {
    els.livesTrack.innerHTML = '';
    for (var i = 0; i < TOTAL_LIVES; i++) {
      var life = document.createElement('span');
      life.className = 'life-icon';
      if (i >= state.lives) life.classList.add('lost');
      life.innerHTML = window.GameIcons.shieldCheck();
      els.livesTrack.appendChild(life);
    }
  }

  function renderCombo() {
    if (state.combo >= 2) {
      els.comboBadge.textContent = state.combo + ' COMBO';
      els.comboBadge.classList.add('show');
    } else {
      els.comboBadge.classList.remove('show');
    }
  }

  // 12단계를 모두 콤보 끊김 없이 클리어했을 때 받을 수 있는 콤보 보너스 총합을 계산합니다.
  // (점수 비율 기반 등급 산정을 위해 "이론상 최대 점수"를 알아야 합니다.)
  function maxComboBonus(stageCount) {
    var total = 0;
    for (var i = 1; i <= stageCount; i++) {
      total += Math.min((i - 1) * COMBO_BONUS_STEP, COMBO_BONUS_CAP);
    }
    return total;
  }

  function loadStage(index) {
    if (index >= window.STAGES.length) {
      finishGame(true);
      return;
    }

    state.stageIndex = index;
    var stage = window.STAGES[index];

    els.stageArea.classList.remove('is-locked');
    els.stageArea.innerHTML = '';
    els.stageLabel.textContent = 'STEP ' + (index + 1) + ' / ' + window.STAGES.length;
    els.stageTitle.textContent = stage.title;
    els.stageInstruction.textContent = '';
    els.stageTimer.textContent = '';

    renderProgress();
    renderLives();
    renderCombo();
    window.GameSound.play('stageStart');

    var locked = false; // 이 스테이지 인스턴스 동안 succeed/fail이 한 번만 처리되도록 보호
    var timerInterval = null;

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    var ctx = {
      diffKey: state.difficultyKey,
      setInstruction: function (text) {
        els.stageInstruction.textContent = text;
      },
      // 각 스테이지는 init() 시작 부분에서 반드시 이 함수를 한 번 호출해
      // (난이도별로 정한) 제한시간을 등록해야 합니다. 시간이 다 되면 자동으로 실패 처리됩니다.
      setTimeLimit: function (seconds) {
        stopTimer();
        var deadline = Date.now() + seconds * 1000;
        var lastShown = null;

        function tick() {
          if (locked) {
            stopTimer();
            return;
          }
          var remaining = Math.ceil((deadline - Date.now()) / 1000);
          if (remaining <= 0) {
            els.stageTimer.textContent = '0초';
            stopTimer();
            ctx.fail('시간이 초과되었습니다.');
            return;
          }
          if (remaining !== lastShown) {
            lastShown = remaining;
            els.stageTimer.textContent = remaining + '초';
            if (remaining <= 3) window.GameSound.play('tick');
          }
        }

        tick();
        timerInterval = setInterval(tick, 200);
      },
      succeed: function (points) {
        if (locked) return;
        locked = true;
        stopTimer();
        handleSuccess(typeof points === 'number' ? points : BASE_POINTS_PER_STAGE);
      },
      fail: function (message) {
        if (locked) return;
        locked = true;
        stopTimer();
        handleFail(message);
      }
    };

    stage.init(els.stageArea, ctx);
  }

  function handleSuccess(basePoints) {
    state.combo += 1;
    var comboBonus = Math.min((state.combo - 1) * COMBO_BONUS_STEP, COMBO_BONUS_CAP);
    var scoreMul = DIFFICULTY_PRESETS[state.difficultyKey].scoreMul;
    var gained = Math.round((basePoints + comboBonus) * scoreMul);
    state.score += gained;

    els.stageArea.classList.add('is-locked');
    var message = comboBonus > 0 ? '통과! +' + gained + ' (콤보 +' + comboBonus + ')' : '통과! +' + gained;
    showToast(message, 'success');
    renderCombo();
    window.GameSound.play('success');
    if (comboBonus > 0) {
      setTimeout(function () {
        window.GameSound.play('comboUp');
      }, 90);
    }

    setTimeout(function () {
      loadStage(state.stageIndex + 1);
    }, TRANSITION_DELAY);
  }

  function handleFail(message) {
    state.lives -= 1;
    state.combo = 0;
    renderLives();
    renderCombo();
    els.stageArea.classList.add('is-locked');
    showToast(message || '다시 확인해주세요.', 'danger');
    window.GameSound.play('fail');

    setTimeout(function () {
      if (state.lives <= 0) {
        finishGame(false);
      } else {
        loadStage(state.stageIndex); // 같은 단계를 새 문제로 재출제
      }
    }, TRANSITION_DELAY);
  }

  function finishGame(cleared) {
    showScreen('result');
    var diffPreset = DIFFICULTY_PRESETS[state.difficultyKey];
    var stageCount = window.STAGES.length;
    var maxScore = Math.round(
      (stageCount * BASE_POINTS_PER_STAGE + maxComboBonus(stageCount)) * diffPreset.scoreMul
    );

    if (cleared) {
      var pct = maxScore > 0 ? state.score / maxScore : 0;
      var rank =
        pct >= 0.9 ? 'S' : pct >= 0.75 ? 'A' : pct >= 0.55 ? 'B' : pct >= 0.35 ? 'C' : 'D';

      els.resultEyebrow.textContent = 'VERIFICATION COMPLETE';
      els.resultHeadline.textContent = '인증 완료';
      els.rankBadge.textContent = rank;
      els.rankBadge.classList.remove('rank-badge--fail');
      els.resultScore.textContent = '점수: ' + state.score + ' / ' + maxScore + '점';
      els.resultDetail.textContent =
        '난이도: ' + diffPreset.label + ' · 남은 목숨: ' + state.lives + ' / ' + TOTAL_LIVES;
      window.GameSound.play('gameClear');
    } else {
      els.resultEyebrow.textContent = 'VERIFICATION FAILED';
      els.resultHeadline.textContent = '인증 실패';
      els.rankBadge.textContent = 'F';
      els.rankBadge.classList.add('rank-badge--fail');
      els.resultScore.textContent = '획득 점수: ' + state.score + '점';
      els.resultDetail.textContent =
        '난이도: ' + diffPreset.label + ' · 아쉽게도 사람임을 증명하지 못했습니다. 다시 시도해보세요.';
      window.GameSound.play('gameOver');
    }
  }

  function startGame() {
    window.GameSound.unlock();
    window.GameSound.play('gameStart');
    state.stageIndex = 0;
    state.lives = TOTAL_LIVES;
    state.score = 0;
    state.combo = 0;
    showScreen('game');
    loadStage(0);
  }

  els.diffButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      els.diffButtons.forEach(function (b) {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
      state.difficultyKey = btn.dataset.diff;
      window.GameSound.unlock();
      window.GameSound.play('tap');
    });
  });

  function renderMuteButton() {
    var muted = window.GameSound.isMuted();
    els.btnMute.innerHTML = muted ? window.GameIcons.speakerOff() : window.GameIcons.speakerOn();
    els.btnMute.classList.toggle('is-muted', muted);
  }

  els.btnMute.addEventListener('click', function () {
    window.GameSound.unlock();
    var nowMuted = window.GameSound.toggleMuted();
    renderMuteButton();
    if (!nowMuted) window.GameSound.play('tap');
  });
  renderMuteButton();

  els.btnStart.addEventListener('click', startGame);
  els.btnRetry.addEventListener('click', startGame);
  els.brandMark.innerHTML = window.GameIcons.shieldCheck();
})();
