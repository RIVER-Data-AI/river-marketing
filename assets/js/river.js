const river = (() => {
  const scrollOptions = {
    behavior: "smooth",
  };

  const currentlyVisibleSection = () => {
    const sections = document.getElementsByClassName("section");
    for (const section of sections) {
      const sectionRect = section.getBoundingClientRect();
      const midY = (sectionRect.top + sectionRect.bottom) / 2;
      if (midY > window.scrollY && midY < window.scrollY + window.innerHeight) {
        return section;
      }
    }
  };

  const scrollToSection = (targetSection) => {
    if (!targetSection) {
      return;
    }

    // Safari apparently has an issue with smooth scrolling; let's punt that for now.
    // https://stackoverflow.com/questions/51229742/javascript-window-scroll-behavior-smooth-not-working-in-safari
    targetSection.scrollIntoView(scrollOptions);
  };

  const previousSection = () => {
    scrollToSection(currentlyVisibleSection()?.previousElementSibling);
  };

  const nextSection = () => {
    scrollToSection(currentlyVisibleSection()?.nextElementSibling);
  };

  const initKeyboardNavigation = () => {
    document.addEventListener("keyup", (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "Down":
        case "ArrowDown":
        case "Right":
        case "ArrowRight":
        case "PageDown":
          nextSection();
          break;

        case "Up":
        case "ArrowUp":
        case "Left":
        case "ArrowLeft":
        case "PageUp":
          previousSection();
          break;

        default:
          return;
      }
    });
  };

  const initScrollTracking = () => {
    // https://pqina.nl/blog/applying-styles-based-on-the-user-scroll-position-with-smart-css/
    const debounce = (fn) => {
      let frame;

      return (...params) => {
        if (frame) {
          cancelAnimationFrame(frame);
        }

        frame = requestAnimationFrame(() => {
          fn(...params);
        });
      };
    };

    const storeScroll = () => {
      const scrollContainer = document.querySelector(".scroll-container");
      if (!scrollContainer) {
        return;
      }

      const scrollPosition = scrollContainer.scrollTop;
      document.documentElement.dataset.scrollPosition = scrollPosition;

      setTimeout(() => {
        const visibleSection = currentlyVisibleSection();
        document.documentElement.dataset.visibleSectionId = visibleSection?.id;
      }, 100);
    };

    document.addEventListener("scroll", debounce(storeScroll), {
      passive: true,
    });

    storeScroll();
  };

  // Set up the page
  initKeyboardNavigation();
  initScrollTracking();

  return {
    previousSection,
    nextSection,
  };
})();
