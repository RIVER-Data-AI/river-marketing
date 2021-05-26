// "In the online world"
const section1 = () => {
  return {
    didAppear: ({ showBackgroundVideo, scrollToNextSection }) => {
      const root = document.querySelector("#home-intro");
      const typeElement = root.querySelector("#home-intro-p1");

      if (!typeElement.dataset.typeHasAppeared) {
        document
          .querySelector("#background-video-player .__video.--smooth")
          .classList.add("--delay-3");
        new Typed("#home-intro-p1", {
          strings: [root.querySelector("#home-intro-p1-string").textContent],
          typeSpeed: 30,
          onComplete: () => {
            root.querySelector(".typed-cursor").remove();

            Array.from(root.querySelectorAll(".hidden-copy")).forEach((e) =>
              e.classList.remove("--hidden")
            );

            showBackgroundVideo("smooth");

            setTimeout(scrollToNextSection, 7000);
          },
        });

        typeElement.dataset.typeHasAppeared = true;
      }
    },

    didDisappear: () => {
      document
        .querySelector("#background-video-player .__video.--smooth")
        .classList.remove("--delay-3");

      document.querySelector("#home-intro").dataset.videoName = "smooth";
    },
  };
};

const section2 = () => {
  return {
    didAppear: () => {
      const root = document.querySelector("#home-privacy-platform");
      const typeElement = root.querySelector("#home-privacy-platform-p2");

      if (!typeElement.dataset.typeHasAppeared) {
        new Typed("#home-privacy-platform-p2", {
          strings: [
            root.querySelector("#home-privacy-platform-p2-string").textContent,
          ],
          typeSpeed: 30,
          onComplete: () => {
            root.querySelector(".typed-cursor").remove();
            Array.from(root.querySelectorAll(".hidden-copy")).forEach((e) =>
              e.classList.remove("--hidden")
            );
          },
        });

        typeElement.dataset.typeHasAppeared = true;
      }
    },

    didDisappear: () => {
      console.log("section 2 disappeared!");
    },
  };
};
