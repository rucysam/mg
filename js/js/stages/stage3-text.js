/* =========================================================
   js/stages/stage3-text.js
   왜곡된 문자(텍스트) 캡차 패러디
   CSS transform(rotate/skew)으로 글자를 비뚤게 만들어 보여주고
   입력받아 비교합니다.
   ========================================================= */
(function () {
  var CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 0/O, 1/I 등 혼동 문자는 제외

  function randomCode(len) {
    var s = '';
    for (var i = 0; i < len; i++) {
      s += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return s;
  }

  // 난이도별 문자 개수와 제한시간(초).
  var DIFF = {
    easy: { length: 4, timeLimit: 14 },
    normal: { length: 5, timeLimit: 12 },
    hard: { length: 6, timeLimit: 10 }
  };

  window.STAGES.push({
    id: 'distorted-text',
    title: '왜곡된 문자 인식',
    init: function (container, ctx) {
      var diff = DIFF[ctx.diffKey] || DIFF.normal;
      ctx.setTimeLimit(diff.timeLimit);

      var code = randomCode(diff.length);
      ctx.setInstruction('아래에 보이는 문자를 그대로 입력하세요. (대소문자 구분 없음)');

      var display = document.createElement('div');
      display.className = 'distorted-text';

      code.split('').forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'distorted-text__char';
        span.textContent = ch;
        var rotate = (Math.random() * 30 - 15).toFixed(1);
        var skew = (Math.random() * 20 - 10).toFixed(1);
        var ty = (Math.random() * 10 - 5).toFixed(1);
        span.style.transform =
          'rotate(' + rotate + 'deg) skewX(' + skew + 'deg) translateY(' + ty + 'px)';
        display.appendChild(span);
      });

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'text-input';
      input.maxLength = diff.length;
      input.autocomplete = 'off';
      input.autocapitalize = 'off';
      input.spellcheck = false;
      input.placeholder = '문자 입력';

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-confirm';
      confirmBtn.textContent = '확인';
      confirmBtn.addEventListener('click', function () {
        confirmBtn.disabled = true;
        var value = input.value.trim().toUpperCase();
        if (value === code) ctx.succeed(100);
        else ctx.fail('문자가 일치하지 않습니다.');
      });

      container.appendChild(display);
      container.appendChild(input);
      container.appendChild(confirmBtn);
    }
  });
})();
