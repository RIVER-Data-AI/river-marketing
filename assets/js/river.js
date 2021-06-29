const river = (() => {
  const videoIds = {
    smooth: 552069402,
    choppy: 552596244,
    rough: 552093404,
    flowing: 552596313,
    creek: 552604626,
    jungle: 567652238,
  };

  const sections = {
    "home-intro": section1(),
    "home-privacy-platform": typedTextSection("#home-privacy-platform"),
    "home-video-1": typedTextAndVideoPlayerSection("#home-video-1"),
    "your-data-belongs-to-you": typedTextSection("#your-data-belongs-to-you"),
    "home-river-gives-you-control": typedTextSection(
      "#home-river-gives-you-control",
      { redrawLineDrawings: true, pauseBackgroundVideo: true }
    ),
    "home-privacy-platform-2": typedTextSection("#home-privacy-platform-2", {
      pauseBackgroundVideo: true,
    }),
    "home-who-is-using-your-data": typedTextSection(
      "#home-who-is-using-your-data"
    ),
    "home-who-is-using-your-data-2": typedTextSection(
      "#home-who-is-using-your-data-2"
    ),
    "home-working-with-big-tech": typedTextSection(
      "#home-working-with-big-tech"
    ),
    "home-data-untapped": typedTextAndVideoPlayerSection("#home-data-untapped"),
    "home-how-does-river-work": typedTextSection("#home-how-does-river-work"),
    "home-business-of-data": typedTextAndVideoPlayerSection(
      "#home-business-of-data"
    ),
    streams: sectionStreams(),
    riverbank: sectionRiverbank(),
  };

  let backgroundVideoPlayerContainer;
  let backgroundVideoPlayers = {};
  let videoNamesInOrder = () =>
    Array.from(backgroundVideoPlayerContainer.querySelectorAll(`.__video`))
      .map((d) => d.dataset.videoName)
      .reduce((m, v) => (m.includes(v) ? m : [...m, v]), []);

  const initLineDrawings = () => {
    document
      .querySelector(".svg-line-drawing svg path")
      .addEventListener("animationend", (e) => {
        dispatch({ name: "LineDrawingFinished" });
      });
  };

  const redrawLineDrawings = () => {
    Array.from(document.querySelectorAll(".svg-line-drawing svg path")).forEach(
      (p) => {
        p.classList.remove("--active");
        setTimeout(() => {
          p.classList.add("--active");
        }, 50);
      }
    );
  };

  const initBackgroundVideo = () => {
    backgroundVideoPlayerContainer = document.getElementById(
      "background-video-player"
    );
  };

  const loadBackgroundVideo = (videoName) => {
    if (!videoName || backgroundVideoPlayers[videoName]) {
      return;
    }

    console.log("load", videoName);

    const player = new Vimeo.Player(`background-video-player-${videoName}`, {
      id: videoIds[videoName],
      controls: false,
      loop: true,
      dnt: true,
      muted: true,
    });

    backgroundVideoPlayers[videoName] = player;

    player.on("loaded", (playerId) => {
      dispatch({ name: "LoadedBackgroundVideo", videoName });
      player.off("loaded");
    });
  };

  const pauseBackgroundVideo = () => {
    const visibleVideo =
      backgroundVideoPlayerContainer.querySelector(`.__video.--visible`);
    const visibleVideoName = visibleVideo?.dataset?.videoName;
    if (visibleVideoName) {
      const player = backgroundVideoPlayers[visibleVideoName];
      player.getPaused().then((paused) => {
        if (!paused) player.pause();
      });
    }
  };

  const showBackgroundVideo = (videoName, immediately) => {
    const visibleVideo =
      backgroundVideoPlayerContainer.querySelector(`.__video.--visible`);

    const visibleVideoName = visibleVideo?.dataset?.videoName;
    if (visibleVideoName && visibleVideoName !== videoName) {
      backgroundVideoPlayers[visibleVideoName].pause();
      visibleVideo.classList.remove("--visible");
    }

    const player = backgroundVideoPlayers[videoName];
    player.play();

    if (immediately) {
      backgroundVideoPlayerContainer
        .querySelector(`.--${videoName}`)
        ?.classList?.add("--visible");
    } else {
      player.on("play", () => {
        backgroundVideoPlayerContainer
          .querySelector(`.--${videoName}`)
          ?.classList?.add("--visible");

        player.off("play");
      });
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

  /* Section Tracking */
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

    document.documentElement.dataset.section = currentlyVisibleSection.id;

    dispatch({
      name: "SectionDidDisappear",
      section: sections[lastVisibleSectionId],
    });
    dispatch({
      name: "SectionDidAppear",
      section: sections[currentlyVisibleSection.id],
    });
  };

  const initSectionTracking = () => {
    updateCurrentlyVisibleSection();
    setInterval(updateCurrentlyVisibleSection, 250);
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

  const initVideoPlayer = () => {};

  const showVideo = (videoName) => {
    document
      .getElementById("video-player-container")
      .classList.remove("--hidden");
  };

  const hideVideo = () => {
    document.getElementById("video-player-container").classList.add("--hidden");
  };

  // Set up the page
  initKeyboardNavigation();
  initScrollTracking();
  initVideoPlayer();

  window.addEventListener("DOMContentLoaded", (event) => {
    dispatch({ name: "DOMContentLoaded" });
  });

  const dispatch = (action) => {
    const { name: actionName } = action;
    const sectionName = document.documentElement.dataset.section;
    const section = action.section ?? sections[sectionName];
    const sectionElement = section?.element();

    if (section?.dispatch) {
      console.log(`${sectionName} dispatch(${actionName})`, action);

      if (
        section?.dispatch(
          {
            dispatch,
            initBackgroundVideo,
            loadBackgroundVideo,
            showBackgroundVideo,
            videoNamesInOrder,
            scrollToNextSection,
          },
          action
        ) === "stop"
      ) {
        return;
      }
    }

    console.log(`default dispatch(${actionName})`, action);

    switch (actionName) {
      case "DOMContentLoaded":
        initLineDrawings();
        initBackgroundVideo();

        const firstVideoName = videoNamesInOrder()[0];

        loadBackgroundVideo(firstVideoName);
        redrawLineDrawings();
        initSectionTracking();

        // line drawing animation length = 4s
        setTimeout(() => {
          showBackgroundVideo(firstVideoName);

          if (videoNamesInOrder()[1]) {
            loadBackgroundVideo(videoNamesInOrder()[1]);
          }
        }, 3500);
        break;

      case "SectionDidAppear":
        const videoName = sectionElement.dataset?.videoName;
        const visibleVideo =
          backgroundVideoPlayerContainer.querySelector(`.__video.--visible`);
        const visibleVideoName = visibleVideo?.dataset?.videoName;

        if (videoName) {
          if (videoName !== visibleVideoName) {
            showBackgroundVideo(videoName);
          }
        } else {
          backgroundVideoPlayers[visibleVideoName]?.pause();
          hideBackgroundVideo();
        }
        break;

      case "RedrawLineDrawings":
        redrawLineDrawings();
        break;

      case "PauseBackgroundVideo":
        pauseBackgroundVideo();
        break;

      case "LoadedBackgroundVideo":
        const videoNames = videoNamesInOrder();

        // Allow first video to load and delay retriggering the loading chain.
        if (videoNames.indexOf(action.videoName) == 0) {
          return;
        }

        const nextVideoIndex = videoNames.indexOf(action.videoName) + 1;
        const nextVideoName = videoNames[nextVideoIndex];

        if (nextVideoName) {
          loadBackgroundVideo(nextVideoName);
        }

        break;

      case "RevealHiddenCopy":
        Array.from(action.rootElement.querySelectorAll(".hidden-copy")).forEach(
          (e) => e.classList.add("--visible")
        );
        break;

      default:
        return;
    }
  };

  return {
    backgroundVideoPlayers,
    showVideo,
    hideVideo,

    previousSection: scrollToPreviousSection,
    nextSection: scrollToNextSection,
  };
})();
