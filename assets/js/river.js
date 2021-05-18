const river = (() => {
  const videoIds = {
    smooth: 552069402,
    choppy: 552093404,
    rough: 552093404,
    flowing: 549498377,
    creek: 549512305,
  };

  let backgroundVideoPlayerContainer;
  let backgroundVideoPlayers = {};

  // Return a { width, height } that will encompass the viewport
  const cramIntoViewport = (
    videoAspectRatio,
    viewportWidth,
    viewportHeight
  ) => {
    const viewportAspectRatio = viewportHeight / viewportWidth;

    if (viewportAspectRatio > videoAspectRatio) {
      return {
        width: viewportHeight / videoAspectRatio,
        height: viewportHeight,
      };
    } else {
      return {
        width: viewportWidth,
        height: viewportWidth * videoAspectRatio,
      };
    }
  };

  const hideBackgroundVideo = () => {
    return new Promise((resolve, reject) => {
      const visibleVideo = backgroundVideoPlayerContainer
        .querySelector(`.__video.--visible`)
        ?.classList.remove("--visible");

      setTimeout(resolve, 300);
    });
  };

  const initBackgroundVideo = () => {
    const videoDimensions = cramIntoViewport(
      9 / 16,
      window.innerWidth,
      window.innerHeight
    );

    backgroundVideoPlayerContainer = document.getElementById(
      "background-video-player"
    );

    for (videoIdName in videoIds) {
      backgroundVideoPlayers[videoIdName] = new Vimeo.Player(
        `background-video-player-${videoIdName}`,
        {
          id: videoIds[videoIdName],
          controls: false,
          loop: true,
          dnt: true,
          muted: true,
          width: videoDimensions.width,
          height: videoDimensions.height,
        }
      );

      if (videoIdName === "smooth") {
        backgroundVideoPlayers[videoIdName].setPlaybackRate(0.5);
      }

      backgroundVideoPlayers[videoIdName].play();
    }
  };

  /* Section Tracking */
  const sectionAppeared = (section) => {
    if (!section) return;

    console.log("APPEAR", section.id);

    const videoName = section.dataset["video-name"];

    console.log("video name", videoName);
    if (videoName) {
      const visibleVideo = backgroundVideoPlayerContainer.querySelector(
        `.__video.--visible`
      );

      const visibleVideoName = visibleVideo?.dataset?.videoName;

      if (visibleVideoName && visibleVideoName !== videoName) {
        visibleVideo.classList.remove("--visible");
      }

      console.log("Present ", videoName);

      backgroundVideoPlayerContainer
        .querySelector(`.--${videoName}`)
        ?.classList?.add("--visible");
    } else {
      hideBackgroundVideo();
    }
  };

  const sectionDisappeared = (section) => {
    if (!section) return;
    console.log("DISAPPEAR", section?.id);
  };

  const findCurrentlyVisibleSection = () => {
    const sections = document.getElementsByClassName("section");
    for (const section of sections) {
      const sectionRect = section.getBoundingClientRect();
      const midY = (sectionRect.top + sectionRect.bottom) / 2;
      if (midY > window.scrollY && midY < window.scrollY + window.innerHeight) {
        return section;
      }
    }
  };

  const updateCurrentlyVisibleSection = () => {
    const lastVisibleSectionId = document.documentElement.dataset.section;

    const currentlyVisibleSection = findCurrentlyVisibleSection();

    if (!currentlyVisibleSection) {
      return;
    }

    if (lastVisibleSectionId === currentlyVisibleSection.id) {
      return;
    }

    sectionAppeared(currentlyVisibleSection);
    sectionDisappeared(document.getElementById(lastVisibleSectionId));

    document.documentElement.dataset.section = currentlyVisibleSection.id;
  };

  const initSectionTracking = () => {
    updateCurrentlyVisibleSection();
    setInterval(updateCurrentlyVisibleSection, 500);
  };

  const scrollToSection = (section) => {
    if (!section) {
      return;
    }

    // Safari apparently has an issue with smooth scrolling; let's punt that for now.
    // https://stackoverflow.com/questions/51229742/javascript-window-scroll-behavior-smooth-not-working-in-safari
    section.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToPreviousSection = () => {
    scrollToSection(findCurrentlyVisibleSection()?.previousElementSibling);
  };

  const scrollToNextSection = () => {
    scrollToSection(findCurrentlyVisibleSection()?.nextElementSibling);
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
          scrollToNextSection();
          break;

        case "Up":
        case "ArrowUp":
        case "Left":
        case "ArrowLeft":
        case "PageUp":
          scrollToPreviousSection();
          break;

        case "Escape":
          hideVideo();

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
    };

    document.addEventListener("scroll", debounce(storeScroll), {
      passive: true,
    });

    storeScroll();
  };

  const initBreakpointTracking = () => {
    const updateBreakpointDebugger = () => {
      const windowWidth = window.innerWidth;
      document.querySelector(
        "#bp-debugger .__w"
      ).textContent = `${windowWidth}px`;
    };
    window.addEventListener("resize", updateBreakpointDebugger);
    updateBreakpointDebugger();
  };

  const initVideoPlayer = () => {};

  const showVideo = (videoName) => {
    const videoPlayerRect = document
      .getElementById("video-player")
      .getBoundingClientRect();
    const videoWidth = videoPlayerRect.width;
    const videoHeight = videoPlayerRect.height;

    document
      .getElementById("video-player-container")
      .classList.remove("--hidden");
  };

  const hideVideo = () => {
    document.getElementById("video-player-container").classList.add("--hidden");
  };

  // Set up the page
  window.addEventListener("DOMContentLoaded", (event) => {
    initKeyboardNavigation();
    initBreakpointTracking();
    initBackgroundVideo();
    initScrollTracking();
    initSectionTracking();
    initVideoPlayer();
  });

  return {
    previousSection: scrollToPreviousSection,
    nextSection: scrollToNextSection,

    showVideo: showVideo,
    hideVideo: hideVideo,
  };
})();
