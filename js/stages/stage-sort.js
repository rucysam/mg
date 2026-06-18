/* =========================================================
   js/stages/stage-sort.js
   숫자가 표시된 막대들을 탭으로 두 개씩 교체해 작은 것부터 큰 순서로 정렬하는 미니게임.
   (연속 드래그 대신 탭-탭 교체 방식을 사용해 모바일에서 더 안정적으로 동작합니다)

   * 수정 내역 (2차):
     1차 수정에서는 "확인" 버튼을 눌러야만 채점하는 방식으로 바꿨는데, 이렇게 하면 사용자가
     이미 규칙대로 올바르게 정렬을 끝냈더라도 확인을 누르기 전까지는 끝나지 않는 "끝나는 시점이
     불분명한" 상태가 생기고, 그 사이에 제한시간이 끝나버리면 정작 다 맞췄는데도 실패한 것처럼
     보이는 문제가 있었습니다. 그래서 이번에는 막대 순서가 규칙(작은 수 -> 큰 수)대로 맞는 그 순간
     바로 종료되도록(확인 버튼 없이) 바꿨고, 점수도 고정 100점이 아니라 "몇 번의 교체로 정렬했는지"를
     기준으로 누적/차감되도록 바꿨습니다. 즉 막대 값(사이즈)을 정렬하는 행위 자체가 곧 점수 기준입니다.
   ========================================================= */
(function () {
  // 난이도별 막대 개수와 제한시간(초).
  var DIFF = {
    easy: { count: 4, timeLimit: 14 },
    normal: { count: 5, timeLimit: 12 },
    hard: { count: 6, timeLimit: 10 }
  };

  var BASE_SCORE = 100;
  var PENALTY_PER_EXTRA_SWAP = 10; // 최소 교체 횟수보다 한 번 더 쓸 때마다 깎이는 점수
  var MIN_SCORE = 50; // 아무리 비효율적으로 풀어도 통과만 하면 받는 최소 점수

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

  // 주어진 순서(1~n의 순열)를 정렬하는 데 필요한 "최소 교체 횟수"를 계산합니다.
  // (순열을 순환(cycle)으로 분해해서, 길이가 k인 순환마다 k-1번의 교체가 필요하다는 성질을 이용합니다.)
  function minSwapsToSort(arr) {
    var n = arr.length;
    var visited = [];
    var i;
    for (i = 0; i < n; i++) visited.push(false);

    var swaps = 0;
    for (i = 0; i < n; i++) {
      if (visited[i] || arr[i] - 1 === i) {
        visited[i] = true;
        continue;
      }
      var cycleSize = 0;
      var j = i;
      while (!visited[j]) {
        visited[j] = true;
        j = arr[j] - 1;
        cycleSize++;
      }
      if (cycleSize > 1) swaps += cycleSize - 1;
    }
    return swaps;
  }

  window.STAGES.push({
    id: 'sort',
    title: '크기 순서 맞추기',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);
      ctx.setInstruction(
        '막대 위 숫자가 작은 것부터 큰 순서가 되도록 두 막대를 차례로 탭해 자리를 바꿔주세요. ' +
          '순서가 맞으면 그 즉시 통과되고, 교체 횟수가 적을수록 점수가 높아집니다.'
      );

      var values = [];
      var i;
      for (i = 1; i <= diff.count; i++) values.push(i);

      var attempts = 0;
      do {
        shuffle(values);
        attempts++;
      } while (isSorted(values) && attempts < 10);

      var minSwaps = minSwapsToSort(values.slice()); // 이 시작 배치를 풀기 위한 이론상 최소 교체 횟수
      var swapCount = 0;

      var row = document.createElement('div');
      row.className = 'sort-row';
      container.appendChild(row);

      var selectedIdx = null;
      var resolved = false;

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
        if (resolved) return;

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
        swapCount += 1;
        renderBars();

        // 막대(사이즈) 순서가 규칙대로 맞는 그 순간이 곧 이 단계의 "종료 시점"입니다.
        if (isSorted(values)) {
          resolved = true;
          var extraSwaps = Math.max(0, swapCount - minSwaps);
          var score = Math.max(MIN_SCORE, BASE_SCORE - extraSwaps * PENALTY_PER_EXTRA_SWAP);
          ctx.succeed(score);
        }
      }

      renderBars();
    }
  });
})();
