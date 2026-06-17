/* =========================================================
   js/main.js
   화면 전환, 목숨/점수/스테이지 진행을 담당하는 메인 컨트롤러.
   이 파일은 반드시 모든 스테이지 스크립트보다 나중에 로드되어야 합니다.
   ========================================================= */
(function () {
  var TOTAL_LIVES = 3;
  var TRANSITION_DELAY = 700; // 성공/실패 토스트 후 다음 화면으로 넘어가기까지 대기 시간(ms)

  // 결과 화면에서 보여줄 등급. 남은 목숨에 따라 결정됩니다.
  // 레벨 디자인 시 이 값을 조정하면 등급 난이도를 바꿀 수 있습니다.
  var RANK_BY_LIVES = { 3: 'S', 2: 'A', 1: 'B' };

  var els = {
    screens: {
      title: document.getElementById('screen-title'),
      game: document.getElementById('screen-game'),
      result: document.getElementById('screen-result')
    },
    btnStart: document.getElementById('btn-start'),
    btnRetry: document.getElementById('btn-retry'),
    progressTrack: document.getElementById('progress-track'),
    livesTrack: document.getElementById('lives-track'),
    stageLabel: document.getElementById('stage-label'),
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
    score: 0
  };

  var toastTimer = null;

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

    renderProgress();
    renderLives();

    var locked = false; // 이 스테이지 인스턴스 동안 succeed/fail이 한 번만 처리되도록 보호
    var ctx = {
      setInstruction: function (text) {
        els.stageInstruction.textContent = text;
      },
      succeed: function (points) {
        if (locked) return;
        locked = true;
        handleSuccess(typeof points === 'number' ? points : 100);
      },
      fail: function (message) {
        if (locked) return;
        locked = true;
        handleFail(message);
      }
    };

    stage.init(els.stageArea, ctx);
  }

  function handleSuccess(points) {
    state.score += points;
    els.stageArea.classList.add('is-locked');
    showToast('통과!', 'success');
    setTimeout(function () {
      loadStage(state.stageIndex + 1);
    }, TRANSITION_DELAY);
  }

  function handleFail(message) {
    state.lives -= 1;
    renderLives();
    els.stageArea.classList.add('is-locked');
    showToast(message || '다시 확인해주세요.', 'danger');

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

    if (cleared) {
      var rank = RANK_BY_LIVES[state.lives] || 'B';
      els.resultEyebrow.textContent = 'VERIFICATION COMPLETE';
      els.resultHeadline.textContent = '인증 완료';
      els.rankBadge.textContent = rank;
      els.rankBadge.classList.remove('rank-badge--fail');
      els.resultScore.textContent = '점수: ' + state.score + '점';
      els.resultDetail.textContent = '남은 목숨: ' + state.lives + ' / ' + TOTAL_LIVES;
    } else {
      els.resultEyebrow.textContent = 'VERIFICATION FAILED';
      els.resultHeadline.textContent = '인증 실패';
      els.rankBadge.textContent = 'F';
      els.rankBadge.classList.add('rank-badge--fail');
      els.resultScore.textContent = '획득 점수: ' + state.score + '점';
      els.resultDetail.textContent = '아쉽게도 사람임을 증명하지 못했습니다. 다시 시도해보세요.';
    }
  }

  function startGame() {
    state.stageIndex = 0;
    state.lives = TOTAL_LIVES;
    state.score = 0;
    showScreen('game');
    loadStage(0);
  }

  els.btnStart.addEventListener('click', startGame);
  els.btnRetry.addEventListener('click', startGame);
  els.brandMark.innerHTML = window.GameIcons.shieldCheck();
})();
