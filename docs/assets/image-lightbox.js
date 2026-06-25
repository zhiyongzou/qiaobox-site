(function () {
  var lightbox = document.querySelector("[data-image-lightbox]");
  var targetImage = lightbox ? lightbox.querySelector("[data-lightbox-target]") : null;
  var closeButtons = lightbox ? Array.prototype.slice.call(lightbox.querySelectorAll("[data-lightbox-close]")) : [];
  var previousFocus = null;

  if (!lightbox || !targetImage) {
    return;
  }

  function openLightbox(link) {
    var previewImage = link.querySelector("img");
    if (!previewImage) {
      return;
    }

    previousFocus = document.activeElement;
    targetImage.src = link.href;
    targetImage.alt = previewImage.alt || "";
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");

    var closeButton = lightbox.querySelector(".image-lightbox-close");
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeLightbox() {
    lightbox.hidden = true;
    targetImage.removeAttribute("src");
    targetImage.alt = "";
    document.body.classList.remove("is-lightbox-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  Array.prototype.slice.call(document.querySelectorAll(".screenshot-zoom")).forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(link);
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();
