const setupTypingText = (root) => {
  const typeElement = root.querySelector(".__typing-text-target");

  if (!typeElement.dataset.typeHasAppeared) {
    new Typed(typeElement, {
      strings: [root.querySelector(".__typing-text-source").textContent],
      showCursor: false,
      typeSpeed: 40,
      onComplete: () => {
        Array.from(root.querySelectorAll(".hidden-copy")).forEach((e) =>
          e.classList.remove("--hidden")
        );
      },
    });

    typeElement.dataset.typeHasAppeared = true;
  }
};

// "In the online world"
const section1 = () => {
  const videoName = "flowing";
  return {
    didAppear: ({ showBackgroundVideo, scrollToNextSection }) => {
      const root = document.querySelector("#home-intro");
      const typeElement = root.querySelector(".__typing-text-target");

      if (!typeElement.dataset.typeHasAppeared) {
        document
          .querySelector(`#background-video-player .__video.--${videoName}`)
          .classList.add("--delay-2");
        new Typed(typeElement, {
          strings: [root.querySelector(".__typing-text-source").textContent],
          showCursor: false,
          typeSpeed: 30,
          onComplete: () => {
            Array.from(root.querySelectorAll(".hidden-copy")).forEach((e) =>
              e.classList.remove("--hidden")
            );

            showBackgroundVideo(videoName);

            setTimeout(scrollToNextSection, 5000);
          },
        });

        typeElement.dataset.typeHasAppeared = true;
      }
    },

    didDisappear: () => {
      document
        .querySelector(`#background-video-player .__video.--${videoName}`)
        .classList.remove("--delay-3");

      document.querySelector("#home-intro").dataset.videoName = videoName;
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
    dispatch: ({ showBackgroundVideo }, action) => {
      if (action.name === "LoadedBackgroundVideo") {
        showBackgroundVideo(action.videoName);
      }
    },
  };
};

const sectionStreams = () => {
  return {
    didAppear: () => {},
    didDisappear: () => {},
    dispatch: ({ showBackgroundVideo }, action) => {
      if (action.name === "LoadedBackgroundVideo") {
        showBackgroundVideo(action.videoName);
      }
    },
  };
};
