/* =========================================================
   js/howto.js
   타이틀 화면의 "게임 방법" 카드에서 보여줄 12개 미니게임의 미리보기 + 설명 데이터.
   여기 있는 내용은 실제 게임 화면이 아니라, 같은 CSS 클래스를 재사용해 만든
   "정지된 미리보기"입니다(클릭해도 아무 동작도 하지 않습니다). 실제 스테이지 파일
   (js/stages/*.js)과 따로 관리되므로, 게임 규칙이 바뀌면 이 파일의 설명도 함께
   업데이트해주세요.
   ========================================================= */
(function () {
  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  window.HOWTO_ENTRIES = [
    {
      title: '표지판 인식',
      description:
        "제시된 키워드(예: '신호등')와 같은 그림이 그려진 칸을 모두 선택한 뒤 확인을 누르세요. " +
        '정답 칸을 하나라도 빠뜨리거나 다른 칸을 추가로 선택하면 실패합니다.',
      renderPreview: function (container) {
        var grid = el('div', 'tile-grid');
        var types = ['trafficLight', 'car', 'signPost', 'trafficLight', 'tree', 'crosswalk', 'bicycle', 'trafficLight', 'building'];
        var selected = [0, 3, 7];
        types.forEach(function (type, idx) {
          var tile = el('div', 'tile' + (selected.indexOf(idx) !== -1 ? ' selected' : ''));
          tile.innerHTML = window.GameIcons[type]();
          grid.appendChild(tile);
        });
        container.appendChild(grid);
      }
    },
    {
      title: '로봇이 아닙니다 확인',
      description:
        '체크박스를 손가락으로 길게 누르면 게이지가 차오릅니다. 막대의 초록색 구간 안에서 손을 떼야 ' +
        '통과하며, 너무 빨리 떼거나 너무 늦게 떼면 실패합니다.',
      renderPreview: function (container) {
        var wrap = el('div', 'checkbox-stage');
        var box = el('div', 'fake-checkbox is-holding');
        box.innerHTML =
          '<span class="fake-checkbox__mark"></span><span class="fake-checkbox__label">사람입니다</span>';
        var gauge = el('div', 'hold-gauge');
        var zone = el('div', 'hold-gauge__zone');
        zone.style.left = '58%';
        zone.style.width = '18%';
        var fill = el('div', 'hold-gauge__fill');
        fill.style.width = '62%';
        gauge.appendChild(zone);
        gauge.appendChild(fill);
        wrap.appendChild(box);
        wrap.appendChild(gauge);
        container.appendChild(wrap);
      }
    },
    {
      title: '왜곡된 문자 인식',
      description:
        '비뚤어진 문자를 화면에 보이는 그대로 입력하고 확인을 누르세요. 대소문자는 구분하지 않지만 ' +
        '글자가 하나라도 다르면 실패합니다.',
      renderPreview: function (container) {
        var display = el('div', 'distorted-text');
        var sample = '7KQ9X';
        var angles = [-10, 8, -14, 12, -6];
        var skews = [6, -8, 5, -4, 7];
        sample.split('').forEach(function (ch, i) {
          var span = el('span', 'distorted-text__char');
          span.textContent = ch;
          span.style.transform = 'rotate(' + angles[i] + 'deg) skewX(' + skews[i] + 'deg)';
          display.appendChild(span);
        });
        var input = el('input', 'text-input');
        input.type = 'text';
        input.value = sample;
        input.disabled = true;
        container.appendChild(display);
        container.appendChild(input);
      }
    },
    {
      title: '패턴 기억하기',
      description:
        '패드가 순서대로 깜빡이는 패턴을 잘 본 뒤, 재생이 끝나면 같은 순서로 패드를 눌러주세요. ' +
        '순서가 하나라도 틀리면 즉시 실패합니다.',
      renderPreview: function (container) {
        var wrap = el('div', 'pattern-stage');
        var grid = el('div', 'pattern-grid');
        for (var i = 0; i < 4; i++) {
          grid.appendChild(el('div', 'pattern-pad' + (i === 1 ? ' is-flash' : '')));
        }
        var status = el('p', 'pattern-status');
        status.textContent = '패턴 재생 중...';
        wrap.appendChild(grid);
        wrap.appendChild(status);
        container.appendChild(wrap);
      }
    },
    {
      title: '방향 맞추기',
      description:
        '기울어진 화살표가 정확히 위를 향하도록 슬라이더를 움직인 뒤 확인을 누르세요. ' +
        '허용 오차 안에 들어오면 통과합니다.',
      renderPreview: function (container) {
        var stage = el('div', 'rotate-stage');
        var iconWrap = el('div', 'rotate-icon');
        iconWrap.innerHTML = window.GameIcons.arrowUp();
        iconWrap.style.transform = 'rotate(135deg)';
        stage.appendChild(iconWrap);
        var slider = el('input', 'rotate-slider');
        slider.type = 'range';
        slider.value = '135';
        slider.disabled = true;
        container.appendChild(stage);
        container.appendChild(slider);
      }
    },
    {
      title: '스와이프 방향 인식',
      description:
        '화살표가 가리키는 방향으로 아래 영역을 충분한 거리만큼 스와이프하세요. ' +
        '방향이 다르거나 너무 짧게 스와이프하면 실패합니다.',
      renderPreview: function (container) {
        var stage = el('div', 'swipe-stage');
        var iconWrap = el('div', 'rotate-icon');
        iconWrap.innerHTML = window.GameIcons.arrowUp();
        iconWrap.style.transform = 'rotate(90deg)';
        stage.appendChild(iconWrap);
        var zone = el('div', 'swipe-zone');
        zone.textContent = '이 영역에서 스와이프하세요';
        stage.appendChild(zone);
        container.appendChild(stage);
      }
    },
    {
      title: '순서 기억하기',
      description:
        '흩어져 있는 숫자를 1부터 순서대로 탭하세요. 순서보다 앞선 숫자를 먼저 누르면 그 즉시 실패합니다.',
      renderPreview: function (container) {
        var field = el('div', 'number-field');
        var data = [
          { n: 3, x: 16, y: 12 },
          { n: 1, x: 60, y: 8 },
          { n: 5, x: 30, y: 48 },
          { n: 2, x: 78, y: 42 },
          { n: 4, x: 50, y: 72 }
        ];
        data.forEach(function (d) {
          var dot = el('div', 'number-dot' + (d.n === 1 ? ' is-done' : ''));
          dot.textContent = String(d.n);
          dot.style.left = d.x + '%';
          dot.style.top = d.y + '%';
          field.appendChild(dot);
        });
        container.appendChild(field);
      }
    },
    {
      title: '숨은 도형 찾기',
      description:
        '비슷하게 생긴 도형들 사이에 모양이 다른 도형이 하나 숨어 있습니다. 그 도형을 찾아 탭하세요. ' +
        '다른 도형을 누르면 실패합니다.',
      renderPreview: function (container) {
        var grid = el('div', 'shape-grid');
        for (var i = 0; i < 6; i++) {
          var cell = el('div', 'shape-cell');
          cell.appendChild(el('span', 'shape-shape' + (i === 4 ? ' shape-shape--odd' : '')));
          grid.appendChild(cell);
        }
        container.appendChild(grid);
      }
    },
    {
      title: '조각 맞추기',
      description: '슬라이더로 퍼즐 조각을 움직여 점선으로 표시된 자리에 맞춘 뒤 확인을 누르세요.',
      renderPreview: function (container) {
        var track = el('div', 'slide-track');
        var notch = el('div', 'slide-track__notch');
        notch.style.left = 'calc(72% - 18px)';
        var piece = el('div', 'slide-track__piece');
        piece.style.left = 'calc(34% - 18px)';
        track.appendChild(notch);
        track.appendChild(piece);
        var slider = el('input', 'rotate-slider');
        slider.type = 'range';
        slider.value = '34';
        slider.disabled = true;
        container.appendChild(track);
        container.appendChild(slider);
      }
    },
    {
      title: '크기 순서 맞추기',
      description:
        '막대 위 숫자가 작은 것부터 큰 순서가 되도록 두 막대를 차례로 탭해 자리를 바꿔주세요. ' +
        '순서가 맞으면 그 즉시 통과되고, 더 적은 교체 횟수로 정렬할수록 점수가 높아집니다.',
      renderPreview: function (container) {
        var row = el('div', 'sort-row');
        var values = [3, 1, 4, 2, 5];
        values.forEach(function (val, idx) {
          var bar = el('div', 'sort-bar' + (idx === 1 ? ' is-selected' : ''));
          bar.style.height = 28 + val * (96 / 5) + 'px';
          var label = el('span', 'sort-bar__label');
          label.textContent = String(val);
          bar.appendChild(label);
          row.appendChild(bar);
        });
        container.appendChild(row);
      }
    },
    {
      title: '리듬 탭',
      description: '원이 가장 커지는 순간에 맞춰 버튼을 탭하세요. 타이밍이 너무 빠르거나 늦으면 실패합니다.',
      renderPreview: function (container) {
        var stage = el('div', 'rhythm-stage');
        stage.appendChild(el('div', 'rhythm-pulse'));
        var tapBtn = el('div', 'btn btn-confirm');
        tapBtn.textContent = '지금 탭!';
        container.appendChild(stage);
        container.appendChild(tapBtn);
      }
    },
    {
      title: '균형 맞추기',
      description: '슬라이더로 무게추를 옮겨 시소가 수평이 되도록 맞춘 뒤 확인을 누르세요.',
      renderPreview: function (container) {
        var stage = el('div', 'balance-stage');
        var beam = el('div', 'balance-beam');
        beam.style.transform = 'rotate(10deg)';
        beam.innerHTML =
          '<span class="balance-weight balance-weight--left"></span>' +
          '<span class="balance-weight balance-weight--right"></span>';
        stage.appendChild(beam);
        stage.appendChild(el('div', 'balance-pivot'));
        var slider = el('input', 'rotate-slider');
        slider.type = 'range';
        slider.value = '60';
        slider.disabled = true;
        container.appendChild(stage);
        container.appendChild(slider);
      }
    }
  ];
})();
