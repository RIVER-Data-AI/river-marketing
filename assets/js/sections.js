const setupTypingText = (root) => {
  console.log("Setup typing text target", root);
  const typeElement = root.querySelector(".__typing-text-target");
  if (!typeElement) { return }

  if (!typeElement.dataset.typeHasAppeared) {
    new Typed(typeElement, {
      strings: [root.querySelector(".__typing-text-source").textContent],
      showCursor: false,
      typeSpeed: 40,
      onComplete: () => {
        Array.from(root.querySelectorAll(".hidden-copy")).forEach((e) => {
          e.classList.remove("--hidden")
          e.classList.remove("--hidden-left")
        });
      },
    });

    typeElement.dataset.typeHasAppeared = true;
  }
};

// "In the online world"
const section1 = () => {
  const videoName = "flowing";

  return {
    didDisappear: () => {
      document
        .querySelector(`#background-video-player .__video.--${videoName}`)
        .classList.remove("--delay-3");

      document.querySelector("#home-intro").dataset.videoName = videoName;
    },

    dispatch: ({ showBackgroundVideo, scrollToNextSection }, action) => {
      switch(action.name) {
        case "LineDrawingFinished":
          showBackgroundVideo(videoName);

          setTimeout(() => {
            const root = document.querySelector("#home-intro");
            const typeElement = root.querySelector(".__typing-text-target");

            if (!typeElement.dataset.typeHasAppeared) {
              new Typed(typeElement, {
                strings: [root.querySelector(".__typing-text-source").textContent],
                showCursor: false,
                typeSpeed: 30,
                onComplete: () => {
                  Array.from(root.querySelectorAll(".hidden-copy")).forEach((e) =>
                    e.classList.remove("--hidden")
                  );

                  setTimeout(scrollToNextSection, 4000);
                },
              });

              typeElement.dataset.typeHasAppeared = true;
            }
          }, 2000)
          break;
        
        default:
          return 'ignored';
          break;
      }
      
    },
  };
};

const typedTextSection = (rootSelector) => ({
  didAppear: () => {
    setupTypingText(document.querySelector(rootSelector));
  },

  didDisappear: () => {
    console.log(rootSelector, "disappeared!");
  },
});

const typedTextAndVideoPlayerSection = (rootSelector) => ({
  didAppear: () => {
    setupTypingText(document.querySelector(rootSelector));
  },

  didDisappear: () => {
    console.log(rootSelector, "disappeared!");
  },
});

const sectionRiverbank = () => {
  return {
    didAppear: () => {},
    didDisappear: () => {},
    dispatch: ({ initBackgroundVideo, loadBackgroundVideo, showBackgroundVideo, videoNamesInOrder }, action) => {
      switch(action.name) {
        case "DOMContentLoaded":
          initBackgroundVideo();
          
          const firstVideoName = videoNamesInOrder()[0];
          loadBackgroundVideo(firstVideoName);
          showBackgroundVideo(firstVideoName, true);
          break;
        case "LoadedBackgroundVideo":
          showBackgroundVideo(action.videoName);
          break;

        default:
          return;
      }
    },
  };
};

const sectionStreams = sectionRiverbank;
