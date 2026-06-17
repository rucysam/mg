/* =========================================================
   js/icons.js
   인라인 SVG 아이콘 모음 (이미지 파일 없이 CSS로 색상 제어)
   - currentColor를 사용하므로 부모 요소의 color 값으로 색이 바뀝니다.
   ========================================================= */
(function () {
  function svg(inner, viewBox) {
    return (
      '<svg viewBox="' + (viewBox || '0 0 64 64') +
      '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      inner +
      '</svg>'
    );
  }

  window.GameIcons = {
    trafficLight: function () {
      return svg(
        '<rect x="24" y="6" width="16" height="40" rx="6" fill="currentColor" opacity="0.15"/>' +
        '<circle cx="32" cy="16" r="5" fill="currentColor"/>' +
        '<circle cx="32" cy="26" r="5" fill="currentColor" opacity="0.45"/>' +
        '<circle cx="32" cy="36" r="5" fill="currentColor" opacity="0.45"/>' +
        '<rect x="29" y="46" width="6" height="12" fill="currentColor"/>'
      );
    },
    signPost: function () {
      return svg(
        '<rect x="29" y="20" width="6" height="36" fill="currentColor"/>' +
        '<rect x="10" y="8" width="44" height="16" rx="3" fill="currentColor" opacity="0.85"/>'
      );
    },
    crosswalk: function () {
      return svg(
        '<rect x="8" y="14" width="8" height="36" fill="currentColor"/>' +
        '<rect x="20" y="14" width="8" height="36" fill="currentColor"/>' +
        '<rect x="32" y="14" width="8" height="36" fill="currentColor"/>' +
        '<rect x="44" y="14" width="8" height="36" fill="currentColor"/>'
      );
    },
    car: function () {
      return svg(
        '<rect x="8" y="28" width="48" height="16" rx="6" fill="currentColor"/>' +
        '<rect x="18" y="18" width="28" height="14" rx="5" fill="currentColor" opacity="0.6"/>' +
        '<circle cx="20" cy="46" r="6" fill="currentColor"/>' +
        '<circle cx="44" cy="46" r="6" fill="currentColor"/>'
      );
    },
    tree: function () {
      return svg(
        '<circle cx="32" cy="22" r="16" fill="currentColor" opacity="0.8"/>' +
        '<rect x="28" y="34" width="8" height="22" fill="currentColor"/>'
      );
    },
    building: function () {
      return svg(
        '<rect x="14" y="10" width="36" height="46" rx="2" fill="currentColor" opacity="0.85"/>' +
        '<rect x="20" y="18" width="24" height="4" fill="currentColor" opacity="0.35"/>' +
        '<rect x="20" y="28" width="24" height="4" fill="currentColor" opacity="0.35"/>' +
        '<rect x="20" y="38" width="24" height="4" fill="currentColor" opacity="0.35"/>'
      );
    },
    bicycle: function () {
      return svg(
        '<circle cx="16" cy="44" r="10" fill="none" stroke="currentColor" stroke-width="4"/>' +
        '<circle cx="48" cy="44" r="10" fill="none" stroke="currentColor" stroke-width="4"/>' +
        '<path d="M16 44 L28 24 L40 24 L48 44 M28 24 L34 34 L16 44 M34 34 L48 44" ' +
        'stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    },
    arrowUp: function () {
      return svg('<path d="M32 6 L50 28 H39 V58 H25 V28 H14 Z" fill="currentColor"/>');
    },
    shieldCheck: function () {
      return svg(
        '<path d="M32 6 L54 14 V30 C54 44 44 54 32 58 C20 54 10 44 10 30 V14 Z" fill="currentColor" opacity="0.15"/>' +
        '<path d="M32 6 L54 14 V30 C54 44 44 54 32 58 C20 54 10 44 10 30 V14 Z" stroke="currentColor" stroke-width="3" fill="none"/>' +
        '<path d="M22 32 L29 39 L43 23" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    },
    speakerOn: function () {
      return svg(
        '<path d="M10 24 H20 L34 12 V52 L20 40 H10 Z" fill="currentColor"/>' +
        '<path d="M42 20 C48 26 48 38 42 44" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M48 12 C58 22 58 42 48 52" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>'
      );
    },
    speakerOff: function () {
      return svg(
        '<path d="M10 24 H20 L34 12 V52 L20 40 H10 Z" fill="currentColor"/>' +
        '<path d="M44 22 L58 36 M58 22 L44 36" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>'
      );
    }
  };
})();
