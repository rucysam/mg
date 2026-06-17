/* =========================================================
   js/stages/stage2-checkbox.js
   "로봇이 아닙니다" 체크박스 패러디
   체크박스를 누르고 있으면 게이지가 차오르고, 초록 구간(zone)에서
   손을 떼야 통과합니다. 너무 빠르거나 늦으면 실패합니다.
   ========================================================= */
(function () {
  // 난이도별 게이지 구간 폭(zoneWidth)과 전체 게이지 채움 시간(duration), 단계 제한시간(timeLimit).
  var DIFF = {
    easy: { zoneWidth: 24, duration: 2600, timeLimit: 7 },
    normal: { zoneWidth: 18, duration: 2200, timeLimit: 6 },
    hard: { zoneWidth: 12, duration: 1800, timeLimit: 5 }
  };

  window.STAGES.push({
    id: 'checkbox',
    title: '로봇이 아닙니다 확인',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      ctx.setInstruction('체크박스를 길게 누르세요. 게이지의 초록 구간에서 손을 떼면 통과합니다.');

      var DURATION = diff.duration; // 100%까지 차는 시간(ms)
      var zoneStart = 55 + Math.random() * 10; // 55~65%
      var zoneWidth = diff.zoneWidth; // %
      var zoneEnd = zoneStart + zoneWidth;

      var wrap = document.createElement('div');
      wrap.className = 'checkbox-stage';

      var box = document.createElement('button');
      box.type = 'button';
      box.className = 'fake-checkbox';
      box.innerHTML =
        '<span class="fake-checkbox__mark"></span>' +
        '<span class="fake-checkbox__label">사람입니다</span>';

      var gauge = document.createElement('div');
      gauge.className = 'hold-gauge';

      var zone = document.createElement('div');
      zone.className = 'hold-gauge__zone';
      zone.style.left = zoneStart + '%';
      zone.style.width = zoneWidth + '%';

      var fill = document.createElement('div');
      fill.className = 'hold-gauge__fill';

      gauge.appendChild(zone);
      gauge.appendChild(fill);
      wrap.appendChild(box);
      wrap.appendChild(gauge);
      container.appendChild(wrap);

      var raf = null;
      var startTime = null;
      var resolved = false;
      var currentPct = 0;

      function frame(now) {
        if (resolved) return;
        var elapsed = now - startTime;
        currentPct = Math.min(100, (elapsed / DURATION) * 100);
        fill.style.width = currentPct + '%';
        if (currentPct >= 100) {
          finish(false, '시간이 초과되었습니다.');
          return;
        }
        raf = requestAnimationFrame(frame);
      }

      function finish(success, message) {
        if (resolved) return;
        resolved = true;
        if (raf) cancelAnimationFrame(raf);
        box.classList.remove('is-holding');
        box.classList.toggle('is-success', success);
        if (success) ctx.succeed(100);
        else ctx.fail(message);
      }

      function onDown(e) {
        if (e.cancelable) e.preventDefault();
        if (resolved || startTime !== null) return;
        startTime = performance.now();
        box.classList.add('is-holding');
        raf = requestAnimationFrame(frame);
        // 누르고 있는 동안 손가락이 버튼 밖으로 나가도 pointerup을 정상적으로 받기 위해 캡처합니다.
        if (box.setPointerCapture) {
          try {
            box.setPointerCapture(e.pointerId);
          } catch (err) {
            /* 캡처 실패는 무시하고 계속 진행 */
          }
        }
      }

      function onUp() {
        if (resolved || startTime === null) return;
        if (currentPct < zoneStart) finish(false, '너무 빨리 손을 뗐습니다.');
        else if (currentPct > zoneEnd) finish(false, '너무 늦게 손을 뗐습니다.');
        else finish(true);
      }

      box.addEventListener('pointerdown', onDown);
      box.addEventListener('pointerup', onUp);
      box.addEventListener('pointercancel', onUp);
    }
  });
})();
