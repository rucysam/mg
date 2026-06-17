/* =========================================================
   js/stages/stage-sort.js
   높이가 다른 막대들을 탭으로 두 개씩 교체해 작은 것부터 큰 순서로 정렬하는 미니게임.
   (연속 드래그 대신 탭-탭 교체 방식을 사용해 모바일에서 더 안정적으로 동작합니다)
   ========================================================= */
(function () {
  // 난이도별 막대 개수와 제한시간(초).
  var DIFF = {
    easy: { count: 4, timeLimit: 14 },
    normal: { count: 5, timeLimit: 12 },
    hard: { count: 6, timeLimit: 10 }
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
      ctx.setInstruction('막대를 작은 것부터 큰 순서로 정렬하세요. 두 막대를 차례로 탭하면 자리가 바뀝니다.');

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
      container.appendChild(row);

      var selectedIdx = null;

      function renderBars() {
        row.innerHTML = '';
        values.forEach(function (val, idx) {
          var bar = document.createElement('button');
          bar.type = 'button';
          bar.className = 'sort-bar';
          bar.style.height = 28 + val * (96 / diff.count) + 'px';
          if (idx === selectedIdx) bar.classList.add('is-selected');
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

        if (isSorted(values)) ctx.succeed(100);
      }

      renderBars();
    }
  });
})();
