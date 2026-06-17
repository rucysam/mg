/* =========================================================
   js/stages/stage1-signs.js
   "지정된 아이콘이 있는 칸을 모두 선택하세요" 타입 (도로표지판 캡차 패러디)
   ========================================================= */
(function () {
  var TARGET_POOL = ['trafficLight', 'signPost', 'crosswalk'];
  var DISTRACTOR_POOL = ['car', 'tree', 'building', 'bicycle'];
  var LABELS = {
    trafficLight: '신호등',
    signPost: '표지판',
    crosswalk: '횡단보도',
    car: '자동차',
    tree: '나무',
    building: '건물',
    bicycle: '자전거'
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

  window.STAGES.push({
    id: 'signs',
    title: '표지판 인식',
    init: function (container, ctx) {
      var target = TARGET_POOL[Math.floor(Math.random() * TARGET_POOL.length)];
      var tileCount = 9;
      var targetCount = 2 + Math.floor(Math.random() * 3); // 2~4개

      var types = [];
      var i;
      for (i = 0; i < targetCount; i++) types.push(target);
      while (types.length < tileCount) {
        types.push(DISTRACTOR_POOL[Math.floor(Math.random() * DISTRACTOR_POOL.length)]);
      }
      shuffle(types);

      ctx.setInstruction("'" + LABELS[target] + "'이 있는 칸을 모두 선택한 뒤 확인을 누르세요.");

      var grid = document.createElement('div');
      grid.className = 'tile-grid';

      var correctSet = {};
      var selected = {};

      types.forEach(function (type, idx) {
        if (type === target) correctSet[idx] = true;

        var tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'tile';
        tile.innerHTML = window.GameIcons[type]();
        tile.addEventListener('click', function () {
          if (selected[idx]) {
            delete selected[idx];
            tile.classList.remove('selected');
          } else {
            selected[idx] = true;
            tile.classList.add('selected');
          }
        });
        grid.appendChild(tile);
      });

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-confirm';
      confirmBtn.textContent = '확인';
      confirmBtn.addEventListener('click', function () {
        confirmBtn.disabled = true;
        var selectedKeys = Object.keys(selected);
        var correctKeys = Object.keys(correctSet);
        var isCorrect =
          selectedKeys.length === correctKeys.length &&
          selectedKeys.every(function (k) { return correctSet[k]; });

        if (isCorrect) ctx.succeed(100);
        else ctx.fail('선택이 정확하지 않습니다.');
      });

      container.appendChild(grid);
      container.appendChild(confirmBtn);
    }
  });
})();
