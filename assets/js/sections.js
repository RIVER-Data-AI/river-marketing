// "In the online world"
const section1 = () => {
  return {
    didAppear: ({ showBackgroundVideo }) => {
      const typeElement = document.querySelector("#home-intro-p1");

      if (!typeElement.dataset.typeHasAppeared) {
        document
          .querySelector("#background-video-player .__video.--smooth")
          .classList.add("--delay-3");
        new Typed("#home-intro-p1", {
          strings: [
            document.querySelector("#home-intro-p1-string").textContent,
          ],
          typeSpeed: 20,
          onComplete: () => {
            Array.from(
              document.querySelectorAll("#home-intro .hidden-copy")
            ).forEach((e) => e.classList.remove("--hidden"));

            showBackgroundVideo("smooth");
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
      console.log("section 2 appeared!");
    },

    didDisappear: () => {
      console.log("section 2 disappeared!");
    },
  };
};
