/* =========================================================
   js/stages/stage-sort.js
   숫자가 표시된 막대들을 탭으로 두 개씩 교체해 작은 것부터 큰 순서로 정렬하는 미니게임.
   (연속 드래그 대신 탭-탭 교체 방식을 사용해 모바일에서 더 안정적으로 동작합니다)

   * 수정 내역: 예전에는 스왑할 때마다 몰래 정렬 여부를 검사해서 "자동으로" 통과시켰는데,
     이 방식은 사용자가 의도하지 않은 순간에 갑자기 통과/실패하고, 통과 기준도 화면에 보이지 않아
     혼란스럽다는 피드백을 받았습니다. 그래서 다른 단계들처럼 "확인" 버튼을 직접 눌러서
     그 순간에만 채점하는 방식으로 바꾸고, 막대마다 숫자를 표시해 기준을 명확하게 했습니다.
   ========================================================= */
(function () {
  // 난이도별 막대 개수와 제한시간(초). 확인 버튼을 누르는 동작이 추가되어 기존보다 시간을 약간 늘렸습니다.
  var DIFF = {
    easy: { count: 4, timeLimit: 16 },
    normal: { count: 5, timeLimit: 13 },
    hard: { count: 6, timeLimit: 11 }
  };

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function isSorted(arr) {
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  }

  window.STAGES.push({
    id: 'sort',
    title: '크기 순서 맞추기',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      ctx.setInstruction(
        '막대 위 숫자가 작은 것부터 큰 순서가 되도록 정렬한 뒤 확인을 누르세요. 두 막대를 차례로 탭하면 자리가 바뀝니다.'
      );

      var values = [];
      var i;
      for (i = 1; i <= diff.count; i++) values.push(i);

      var attempts = 0;
      do {
        shuffle(values);
        attempts++;
      } while (isSorted(values) && attempts < 10);

      var row = document.createElement('div');
      row.className = 'sort-row';

      var selectedIdx = null;

      function renderBars() {
        row.innerHTML = '';
        values.forEach(function (val, idx) {
          var bar = document.createElement('button');
          bar.type = 'button';
          bar.className = 'sort-bar';
          bar.style.height = 28 + val * (96 / diff.count) + 'px';
          if (idx === selectedIdx) bar.classList.add('is-selected');

          var label = document.createElement('span');
          label.className = 'sort-bar__label';
          label.textContent = String(val);
          bar.appendChild(label);

          bar.addEventListener('click', function () {
            onBarClick(idx);
          });
          row.appendChild(bar);
        });
      }

      function onBarClick(idx) {
        if (selectedIdx === null) {
          selectedIdx = idx;
          renderBars();
          return;
        }
        if (selectedIdx === idx) {
          selectedIdx = null;
          renderBars();
          return;
        }

        var tmp = values[selectedIdx];
        values[selectedIdx] = values[idx];
        values[idx] = tmp;
        selectedIdx = null;
        renderBars();
        // 주의: 예전과 달리 여기서 자동으로 채점하지 않습니다. 채점은 오직 "확인" 버튼을 눌렀을 때만 일어납니다.
      }

      renderBars();
      container.appendChild(row);

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-confirm';
      confirmBtn.textContent = '확인';
      confirmBtn.addEventListener('click', function () {
        confirmBtn.disabled = true;
        if (isSorted(values)) ctx.succeed(100);
        else ctx.fail('아직 작은 순서대로 정렬되지 않았습니다.');
      });
      container.appendChild(confirmBtn);
    }
  });
})();
