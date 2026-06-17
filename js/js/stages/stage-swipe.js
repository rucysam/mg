/* =========================================================
   js/stages/stage-swipe.js
   화면에 표시된 화살표 방향대로 정확히 스와이프(드래그 제스처)해야 통과하는 미니게임.
   ========================================================= */
(function () {
  var DIRECTIONS = [
    { key: 'up', angle: 0, label: '위' },
    { key: 'right', angle: 90, label: '오른쪽' },
    { key: 'down', angle: 180, label: '아래' },
    { key: 'left', angle: 270, label: '왼쪽' }
  ];

  // 난이도별 최소 스와이프 거리(px)와 제한시간(초).
  var DIFF = {
    easy: { minDist: 30, timeLimit: 9 },
    normal: { minDist: 45, timeLimit: 7 },
    hard: { minDist: 60, timeLimit: 6 }
  };

  window.STAGES.push({
    id: 'swipe',
    title: '스와이프 방향 인식',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);

      var target = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      ctx.setInstruction('화살표가 가리키는 방향(' + target.label + ')으로 아래 영역을 스와이프하세요.');

      var stage = document.createElement('div');
      stage.className = 'swipe-stage';

      var iconWrap = document.createElement('div');
      iconWrap.className = 'rotate-icon';
      iconWrap.innerHTML = window.GameIcons.arrowUp();
      iconWrap.style.transform = 'rotate(' + target.angle + 'deg)';
      stage.appendChild(iconWrap);

      var zone = document.createElement('div');
      zone.className = 'swipe-zone';
      zone.textContent = '이 영역에서 스와이프하세요';
      stage.appendChild(zone);

      container.appendChild(stage);

      var resolved = false;
      var startX = 0;
      var startY = 0;
      var tracking = false;

      zone.addEventListener('pointerdown', function (e) {
        if (resolved) return;
        tracking = true;
        startX = e.clientX;
        startY = e.clientY;
        // 스와이프 도중 손가락(포인터)이 zone 영역 밖으로 나가도 pointerup을 정상적으로 받기 위해 캡처합니다.
        if (zone.setPointerCapture) {
          try {
            zone.setPointerCapture(e.pointerId);
          } catch (err) {
            /* 캡처 실패는 무시하고 계속 진행 */
          }
        }
      });

      zone.addEventListener('pointerup', function (e) {
        if (resolved || !tracking) return;
        tracking = false;

        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var dist = Math.hypot(dx, dy);

        if (dist < diff.minDist) {
          resolved = true;
          ctx.fail('스와이프 거리가 너무 짧습니다.');
          return;
        }

        var dirKey;
        if (Math.abs(dx) > Math.abs(dy)) {
          dirKey = dx > 0 ? 'right' : 'left';
        } else {
          dirKey = dy > 0 ? 'down' : 'up';
        }

        resolved = true;
        if (dirKey === target.key) ctx.succeed(100);
        else ctx.fail('방향이 일치하지 않습니다.');
      });

      zone.addEventListener('pointercancel', function () {
        tracking = false;
      });
    }
  });
})();
