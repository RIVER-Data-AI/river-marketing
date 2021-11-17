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
            dispatch({ name: "PlayBackgroundVideo", videoName: "rough" });
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
            const textContent = root.querySelector(
              ".__typing-text-source"
            )?.textContent;
            if (!textContent) {
              return;
            }

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

        var i = 0;
        setInterval(() => {
          const images = document.querySelector("section .__images");
          const childImages = Array.from(images.children);
          const numImages = childImages.length;

          const currentImage =
            images.querySelector("img.--current") ??
            images.querySelector("img");

          const nextImage =
            currentImage.nextElementSibling ??
            currentImage.parentElement.querySelector("img");
          const nextImageIndex = childImages.indexOf(nextImage);

          currentImage.classList.remove("--current");
          nextImage.classList.add("--current");

          // Manually do this smooth scroll for sake of Safari
          const animationLength = 500;
          const animationStart = new Date();
          const originalScrollPosition = images.scrollLeft;
          const targetScrollPosition =
            nextImageIndex * (currentImage.scrollWidth + 5);

          const animationInterval = setInterval(() => {
            const l = (new Date() - animationStart) / animationLength;

            images.scrollTo({
              left:
                originalScrollPosition +
                (targetScrollPosition - originalScrollPosition) * l,
              top: 0,
              behavior: "smooth",
            });

            if (l > 1) {
              clearInterval(animationInterval);

              if (i === numImages - 1) {
                images.scrollTo({ left: 0, top: 0 });
                images
                  .querySelector("img.--current")
                  .classList.remove("--current");
                images.querySelector("img").classList.add("--current");
                i = 0;
              }
            }
          }, 1);

          i = (i + 1) % numImages;
        }, 3000);

        break;

      case "LoadedBackgroundVideo":
        showBackgroundVideo(action.videoName);
        break;

      default:
        break;
    }
  },
});

const basicSection = (rootSelector) => ({
  rootSelector: rootSelector,
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
        break;

      case "LoadedBackgroundVideo":
        showBackgroundVideo(action.videoName);
        break;

      default:
        break;
    }
  },
});