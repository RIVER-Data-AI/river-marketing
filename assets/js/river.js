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

  const previousSection = () => {
    const section = currentlyVisibleSection();
    const targetSection = section?.previousElementSibling;
    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView(scrollOptions);
  };

  const nextSection = () => {
    const section = currentlyVisibleSection();
    const targetSection = section?.nextElementSibling;
    if (!targetSection) {
      return;
    }

    // Safari apparently has an issue with smooth scrolling; let's punt that for now.
    // https://stackoverflow.com/questions/51229742/javascript-window-scroll-behavior-smooth-not-working-in-safari
    section.nextElementSibling.scrollIntoView(scrollOptions);
  };

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

  return {
    previousSection,
    nextSection,
  };
})();
