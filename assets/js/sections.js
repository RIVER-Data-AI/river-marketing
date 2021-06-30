// "In the online world"
const section1 = () => {
  const rootSelector = "#home-intro";
  const videoName = "flowing";

  const section = {
    rootSelector,
    element: () => document.querySelector(rootSelector),
    typed: null,
    dispatch: (
      {
        dispatch,
        showBackgroundVideo,
        loadBackgroundVideo,
        scrollToNextSection,
        videoNamesInOrder,
      },
      action
    ) => {
      const root = document.querySelector(rootSelector);
      const typeElement = root.querySelector(".__typing-text-target");
      const typedText = root.querySelector(".__typing-text-source").textContent;

      switch (action.name) {
        case "SectionDidAppear":
          if (!section.typed) {
            const typed = new Typed(typeElement, {
              strings: [typedText],
              showCursor: false,
              typeSpeed: 30,
              onComplete: () => {
                dispatch({ name: "FinishedTyping", typed });
              },
            });
            typed.stop();
            section.typed = typed;
          }
          break;

        case "LineDrawingFinished":
          setTimeout(() => {
            if (!typeElement.dataset.typeHasAppeared) {
              section.typed.start();
              dispatch({ name: "StartedTyping", typed: section.typed });
              typeElement.dataset.typeHasAppeared = true;
            }
          }, 2000);
          break;

        case "FinishedTyping":
          dispatch({ name: "RevealHiddenCopy", rootElement: root });
          setTimeout(() => {
            dispatch({ name: "ScrollToNextSection" });
          }, 4000);
          break;

        case "ScrollToNextSection":
          scrollToNextSection();
          break;

        default:
          break;
      }
    },
  };

  return section;
};

const typedTextSection = (rootSelector, options) => {
  const section = {
    rootSelector,
    typed: null,
    element: () => document.querySelector(rootSelector),
    dispatch: ({ dispatch }, action) => {
      const root = document.querySelector(rootSelector);

      switch (action.name) {
        case "SectionDidAppear":
          const typeElement = root.querySelector(".__typing-text-target");

          if (!typeElement) {
            dispatch({ name: "RevealHiddenCopy", rootElement: root });
          }

          if (!typeElement?.dataset?.typeHasAppeared) {
            section.typed = new Typed(typeElement, {
              strings: [
                root.querySelector(".__typing-text-source").textContent,
              ],
              showCursor: false,
              typeSpeed: 40,
              onComplete: () => {
                dispatch({ name: "FinishedTyping", typed: section.typed });
              },
            });

            typeElement.dataset.typeHasAppeared = true;
          }

          if (options?.pauseBackgroundVideo) {
            dispatch({ name: "PauseBackgroundVideo" });
          }

          if (options?.redrawLineDrawings) {
            dispatch({ name: "RedrawLineDrawings" });
          }

          break;

        case "FinishedTyping":
          dispatch({ name: "RevealHiddenCopy", rootElement: root });
          break;

        default:
          break;
      }
    },
  };

  return section;
};

const typedTextAndVideoPlayerSection = typedTextSection;

const sectionRiverbank = () => ({
  element: () => {
    document.querySelector("section");
  },
  dispatch: (
    {
      initBackgroundVideo,
      loadBackgroundVideo,
      showBackgroundVideo,
      videoNamesInOrder,
    },
    action
  ) => {
    switch (action.name) {
      case "DOMContentLoaded":
        initBackgroundVideo();

        const firstVideoName = videoNamesInOrder()[0];
        loadBackgroundVideo(firstVideoName);
        showBackgroundVideo(firstVideoName, true);
        return "stop";
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
