const setupTypingText = (root, dispatch) => {
  const typeElement = root.querySelector(".__typing-text-target");

  if (!typeElement) {
    dispatch({ name: "RevealHiddenCopy", rootElement: root })
    return;
  }

  if (!typeElement.dataset.typeHasAppeared) {
    new Typed(typeElement, {
      strings: [root.querySelector(".__typing-text-source").textContent],
      showCursor: false,
      typeSpeed: 40,
      onComplete: () => {
        dispatch({ name: "RevealHiddenCopy", rootElement: root })
      },
    });

    typeElement.dataset.typeHasAppeared = true;
  }
};

// "In the online world"
const section1 = () => {
  const rootSelector = "#home-intro";
  const videoName = "flowing";

  return {
    rootSelector,
    element: () => document.querySelector(rootSelector),
    dispatch: ({ dispatch, showBackgroundVideo, scrollToNextSection }, action) => {
      switch(action.name) {
        case "LineDrawingFinished":
          showBackgroundVideo(videoName);

          setTimeout(() => {
            const root = document.querySelector(rootSelector);
            const typeElement = root.querySelector(".__typing-text-target");

            if (!typeElement.dataset.typeHasAppeared) {
              new Typed(typeElement, {
                strings: [root.querySelector(".__typing-text-source").textContent],
                showCursor: false,
                typeSpeed: 30,
                onComplete: () => {
                  dispatch({ name: "FinishedTyping" });
                },
              });

              typeElement.dataset.typeHasAppeared = true;
            }
          }, 2000);
          break;
        
        case "FinishedTyping":
          const root = document.querySelector(rootSelector);
          dispatch({ name: "RevealHiddenCopy", rootElement: root });
          setTimeout(() => { dispatch({ name: "ScrollToNextSection" }) }, 4000);
          break;

        case "ScrollToNextSection":
          scrollToNextSection();
          break;
        
        default:
          break;
      }
      
    },
  };
};

const typedTextSection = (rootSelector, options) => ({
  rootSelector,
  element: () => document.querySelector(rootSelector),
  dispatch: ({ dispatch }, action) => {
    switch(action.name) {
      case "SectionDidAppear":
        setupTypingText(document.querySelector(rootSelector), dispatch);

        if (options?.pauseBackgroundVideo) {
          dispatch({ name: "PauseBackgroundVideo" })
        }

        if (options?.redrawLineDrawings) {
          dispatch({ name: "RedrawLineDrawings" })
        }

        break;

      default:
        break;
    }
  }
});

const typedTextAndVideoPlayerSection = typedTextSection;

const sectionRiverbank = () => ({
  element: () => { document.querySelector("section") },
  dispatch: ({ initBackgroundVideo, loadBackgroundVideo, showBackgroundVideo, videoNamesInOrder }, action) => {
    switch(action.name) {
      case "DOMContentLoaded":
        initBackgroundVideo();
        
        const firstVideoName = videoNamesInOrder()[0];
        loadBackgroundVideo(firstVideoName);
        showBackgroundVideo(firstVideoName, true);
        return 'stop';
        break;

      case "LoadedBackgroundVideo":
        showBackgroundVideo(action.videoName);
        break;

      default:
        break;
    }
  },
});

const sectionStreams = sectionRiverbank;
