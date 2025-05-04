const initSaberToast = () => {
  const bottomRightContainer = document.createElement("div");
  bottomRightContainer.classList.add("saber-toasts-container-bottom-right");
  bottomRightContainer.classList.add("saber-toasts-containers");
  document.body.append(bottomRightContainer);
  const topRightContainer = document.createElement("div");
  topRightContainer.classList.add("saber-toasts-container-top-right");
  topRightContainer.classList.add("saber-toasts-containers");
  document.body.append(topRightContainer);
  const bottomLeftContainer = document.createElement("div");
  bottomLeftContainer.classList.add("saber-toasts-container-bottom-left");
  bottomLeftContainer.classList.add("saber-toasts-containers");
  document.body.append(bottomLeftContainer);
  const topLeftContainer = document.createElement("div");
  topLeftContainer.classList.add("saber-toasts-container-top-left");
  topLeftContainer.classList.add("saber-toasts-containers");
  document.body.append(topLeftContainer);
};
initSaberToast();
class SaberToast {
  constructor() {
    this.color = "";
    this.icon = "";
    this.iconBackground = "";
  }
  success(params) {
    var audio = new Audio("modules/toaster/notif_success.wav");
    audio.play();
    this.color = "#198754";
    this.icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#198754" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 400H48V80h352v352zm-35.9-241.7L191.5 361.5c-4.7 4.7-12.3 4.6-17-.1l-90.8-91.5c-4.7-4.7-4.6-12.3 .1-17l22.7-22.5c4.7-4.7 12.3-4.6 17 .1l59.8 60.3 141.4-140.2c4.7-4.7 12.3-4.6 17 .1l22.5 22.7c4.7 4.7 4.6 12.3-.1 17z"/></svg>`;
    this.iconBackground = "#D2FBDF";
    this.fire(params);
  }
  error(params) {
    var audio = new Audio("modules/toaster/notif_error.wav");
    audio.play();
    this.color = "#52BF5A";
    this.icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#dc4c64" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z"/></svg>`;
    this.iconBackground = "#FDE4E1";
    this.fire(params);
  }
  warning(params) {
    var audio = new Audio("modules/toaster/notif_error.wav");
    audio.play();
    this.color = "#E4A11B";
    this.icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#dc4c64" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z"/></svg>`;
    this.iconBackground = "#FEF0C8";
    this.fire(params);
  }
  info(params) {
    var audio = new Audio("modules/toaster/notif_error.wav");
    audio.play();
    this.color = "#0dcaf0";
    this.icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#dc4c64" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z"/></svg>`;
    this.iconBackground = "#C6DFFB";
    this.fire(params);
  }
  fire(params) {
    const { title, text, delay, duration, rtl, position } = {
      title: "",
      text: "",
      delay: 200,
      duration: 2600,
      rtl: false,
      position: "bottom-right",
      ...params,
    };
    const div = document.createElement("div");
    div.classList.add("saber-toast");
    div.style.textAlign = rtl ? "right" : "left";
    div.innerHTML = ` 
            <div class="text-container">
                <div class="title" style="color: white">
                    ${title}
                </div>
                <div class="text">
                    ${text}
                </div>
            </div>
            <div class="state-icon-holder">
                <span class="state-icon" style="color:${this.color}; background-color:${this.iconBackground}">
                    ${this.icon}
                </span>
            </div>
        `;
    let isRight;
    switch (position) {
      case "bottom-right":
        document
          .querySelector(".saber-toasts-container-bottom-right")
          .append(div);
        isRight = true;
        break;
      case "top-right":
        document.querySelector(".saber-toasts-container-top-right").append(div);
        isRight = true;
        break;
      case "bottom-left":
        document
          .querySelector(".saber-toasts-container-bottom-left")
          .append(div);
        isRight = false;
        break;
      case "top-left":
        document.querySelector(".saber-toasts-container-top-left").append(div);
        isRight = false;
        break;
      default:
        document
          .querySelector(".saber-toasts-container-bottom-right")
          .append(div);
        isRight = true;
    }
    if (isRight) {
      div.style.right = "-320px";
    } else {
      div.style.left = "-320px";
    }
    div.style.transitionDuration = `${delay}ms`;
    setTimeout(() => {
      if (isRight) {
        div.style.right = "0px";
      } else {
        div.style.left = "0px";
      }
    }, 10);
    let mySecondTimeout = setTimeout(() => {
      div.style.transitionDuration = `${delay}ms`;
      if (isRight) {
        div.style.right = "-320px";
      } else {
        div.style.left = "-320px";
      }
    }, delay + duration);
    let myThirdTimeout = setTimeout(() => {
      div.remove();
    }, 2 * delay + duration);
    div.addEventListener("mouseover", () => {
      clearTimeout(mySecondTimeout);
      clearTimeout(myThirdTimeout);
    });
    div.addEventListener("mouseout", () => {
      mySecondTimeout = setTimeout(() => {
        div.style.transitionDuration = `${delay}ms`;
        if (isRight) {
          div.style.right = "-320px";
        } else {
          div.style.left = "-320px";
        }
      }, delay + duration);
      myThirdTimeout = setTimeout(() => {
        div.remove();
      }, 2 * delay + duration);
    });
  }
}
const saberToast = new SaberToast();
