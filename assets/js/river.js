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
      "#home-river-gives-you-control"
    ),
    "home-privacy-platform-2": typedTextSection("#home-privacy-platform-2"),
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
    "home-how-business-of-data": typedTextAndVideoPlayerSection(
      "#home-how-business-of-data"
    ),
    streams: sectionStreams(),
    riverbank: sectionRiverbank(),
  };

  let backgroundVideoPlayerContainer;
  let backgroundVideoPlayers = {};
  let videoNamesInOrder = () => Array.from(
      backgroundVideoPlayerContainer.querySelectorAll(`.__video`)
    )
      .map((d) => d.dataset.videoName)
      .reduce((m, v) => (m.includes(v) ? m : [...m, v]), []);

  const initLineDrawings = () => {
    document
      .querySelector(".svg-line-drawing svg path")
      .addEventListener("animationend", (e) => {
        dispatch({ name: "LineDrawingFinished" });
        // setTimeout(() => {
        //   e.target.classList.remove("--active");
        //   setTimeout(() => {
        //     e.target.classList.add("--active");
        //   }, 50);
        // }, 8000);
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

  const showBackgroundVideo = (videoName, immediately) => {
    console.log("SHOW BG VIDEO", videoName);
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

  /* Section Tracking */
  const sectionAppeared = (section) => {
    if (!section) return;

    console.log("APPEAR", section.id);
    if (sections[section.id]?.didAppear) {
      sections[section.id]?.didAppear({
        showBackgroundVideo,
        scrollToNextSection,
      });
    }

    if (section.id !== "home-intro") {
      redrawLineDrawings();
    }

    const { videoName } = section.dataset;

    if (videoName) {
      showBackgroundVideo(videoName);
    } else {
      const visibleVideo =
        backgroundVideoPlayerContainer.querySelector(`.__video.--visible`);
      const visibleVideoName = visibleVideo?.dataset?.videoName;
      backgroundVideoPlayers[visibleVideoName]?.pause();
      hideBackgroundVideo();
    }
  };

  const sectionDisappeared = (section) => {
    if (!section) return;
    console.log("DISAPPEAR", section?.id);
    sections[section.id]?.didDisappear();
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

    document.documentElement.dataset.section = currentlyVisibleSection.id;

    // dispatch({ name: "SectionDidDisappear", section: currentlyVisibleSection })
    sectionDisappeared(document.getElementById(lastVisibleSectionId));
    sectionAppeared(currentlyVisibleSection);
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
    const section = sections[sectionName];
    
    if (section?.dispatch) {
      console.log(`${sectionName} dispatch(${actionName})`);

      if (section?.dispatch({ initBackgroundVideo, loadBackgroundVideo, showBackgroundVideo, videoNamesInOrder }, action) !== 'ignored') {
        return;
      }
    }

    console.log(`default dispatch(${actionName})`);

    switch (actionName) {
      case "DOMContentLoaded":
        initLineDrawings();
        initBackgroundVideo();
        loadBackgroundVideo(videoNamesInOrder()[0]);
        redrawLineDrawings();
        initSectionTracking();
        break;

      case "SectionDidAppear":
        break;
      
      case "SectionDidDisappear":
        break;

      case "LineDrawingFinished":
        showBackgroundVideo(videoNamesInOrder()[0]);
        // setTimeout(() => dispatch({ name: "StartTyping" }), 3000);
        break;

      case "StartTyping":
        // initSectionTracking();
        setTimeout(() => dispatch({ name: "FinishedTyping" }), 2000);
        break;

      case "FinishedTyping":
        loadBackgroundVideo(videoNamesInOrder()[0]);
        break;

      case "LoadedBackgroundVideo":
        const videoNames = videoNamesInOrder();
        const nextVideoIndex = videoNames.indexOf(action.videoName) + 1;
        const nextVideoName = videoNames[nextVideoIndex];
        
        if (nextVideoName) {
          console.log(`Load ${nextVideoName}`);
          loadBackgroundVideo(nextVideoName);
        }

        break;

      default:
        return; // Do nothing
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
