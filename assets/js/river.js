const river = (() => {
  const videoIds = {
    SMOOTH: 549508169,
    CHOPPY: 549500913,
    ROUGH: 549506147,
    LESS_SMOOTH: 549498377,
    CREEK: 549512305,
  };

  let videoPlayer;

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

  const loadAndPlayVideo = (videoId) => {
    videoPlayer.getVideoId().then((loadedVideoId) => {
      console.log("compare", loadedVideoId, videoId);
      if (loadedVideoId === videoId) {
        console.log("same - dip out");
        return;
      }

      videoPlayer.loadVideo(videoId).then(() => {
        videoPlayer.play();
      });
    });
  };

  /* Section Tracking */
  const sectionAppeared = (section) => {
    if (!section) return;

    console.log("APPEAR", section.id);

    switch (section.id) {
      case "home-privacy-platform":
        loadAndPlayVideo(videoIds.SMOOTH);
        break;

      case "home-video-1":
        loadAndPlayVideo(videoIds.CHOPPY);
        break;

      case "home-river-gives-you-control":
        loadAndPlayVideo(videoIds.LESS_SMOOTH);
        break;

      case "home-who-owns-your-data":
        loadAndPlayVideo(videoIds.SMOOTH);
        break;

      case "home-who-is-using-your-data":
      case "home-who-is-using-your-data-2":
        loadAndPlayVideo(videoIds.CREEK);
        break;

      case "home-how-does-river-work":
      case "home-business-of-data":
        loadAndPlayVideo(videoIds.ROUGH);
        break;

      default:
        break;
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
    window.addEventListener("DOMContentLoaded", (event) => {
      updateCurrentlyVisibleSection();
    });

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
    window.addEventListener("DOMContentLoaded", updateBreakpointDebugger);
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

  const initBackgroundVideo = () => {
    window.addEventListener("DOMContentLoaded", (event) => {
      const videoDimensions = cramIntoViewport(
        9 / 16,
        window.innerWidth,
        window.innerHeight
      );

      videoPlayer = new Vimeo.Player("background-video-player", {
        id: videoIds.SMOOTH,
        controls: false,
        loop: true,
        dnt: true,
        muted: true,
        width: videoDimensions.width,
        height: videoDimensions.height,
      });
    });
  };

  // Set up the page
  initKeyboardNavigation();
  initBreakpointTracking();
  initScrollTracking();
  initSectionTracking();
  initVideoPlayer();
  initBackgroundVideo();

  return {
    previousSection: scrollToPreviousSection,
    nextSection: scrollToNextSection,

    showVideo: showVideo,
    hideVideo: hideVideo,
  };
})();
