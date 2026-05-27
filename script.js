// Desktop timeline wheel scrolling
// This lets the mouse wheel move the timeline left/right when hovered.
document.addEventListener("DOMContentLoaded", function () {
  var timeline = document.querySelector(".timeline");

  if (!timeline) {
    return;
  }

  timeline.addEventListener(
    "wheel",
    function (event) {
      var isDesktop = window.matchMedia("(min-width: 48.01rem)").matches;

      // Keep normal behavior on small screens where the timeline stacks vertically.
      if (!isDesktop) {
        return;
      }

      var canScrollHorizontally = timeline.scrollWidth > timeline.clientWidth;

      if (!canScrollHorizontally) {
        return;
      }

      // Ignore wheel events that do not have vertical motion.
      if (event.deltaY === 0) {
        return;
      }

      // Convert wheel direction to a horizontal step of exactly one card width
      // so each wheel 'notch' moves the user by one milestone card.
      var direction = event.deltaY > 0 ? 1 : -1;
      var firstCard = timeline.querySelector('.milestone');
      var stepSize;
      if (firstCard) {
        // card width (includes padding and border). The flex gap is added separately.
        var cardWidth = Math.round(firstCard.getBoundingClientRect().width);
        var style = window.getComputedStyle(timeline);
        // CSS gap value (fallback to 0 if not supported)
        var gap = parseFloat(style.gap || style.columnGap || 0) || 0;
        stepSize = Math.round(cardWidth + gap);
      } else {
        // Fallback step when no card found: about two-thirds of the container.
        stepSize = Math.max(220, Math.floor(timeline.clientWidth * 0.65));
      }
      var currentLeft = timeline.scrollLeft;
      var maxLeft = timeline.scrollWidth - timeline.clientWidth;
      var atStart = currentLeft <= 1;
      var atEnd = currentLeft >= maxLeft - 1;

      // Let the page scroll normally when the timeline hits either edge.
      if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
        return;
      }

      event.preventDefault();
      timeline.scrollBy({
        left: direction * stepSize,
        behavior: "smooth"
      });
    },
    { passive: false }
  );
});
