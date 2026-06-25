(function () {
  var currentScript = document.currentScript;
  var endpoint = currentScript ? currentScript.dataset.visitCounterEndpoint : "";
  var containers = Array.prototype.slice.call(document.querySelectorAll("[data-visit-counter]"));

  if (!endpoint || containers.length === 0) {
    return;
  }

  if (
    endpoint === "/api/visit" &&
    (window.location.hostname.endsWith(".github.io") ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return;
  }

  function formatCount(value) {
    return new Intl.NumberFormat(document.documentElement.lang || undefined).format(value);
  }

  function showCount(count) {
    var formattedCount = formatCount(count);
    containers.forEach(function (container) {
      var valueNode = container.querySelector("[data-visit-count]");
      if (!valueNode) {
        return;
      }

      valueNode.textContent = formattedCount;
      container.hidden = false;
    });
  }

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      path: window.location.pathname
    }),
    credentials: "omit"
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Visit counter unavailable");
      }

      return response.json();
    })
    .then(function (payload) {
      var count = Number(payload && payload.count);
      if (Number.isFinite(count) && count >= 0) {
        showCount(count);
      }
    })
    .catch(function () {
      containers.forEach(function (container) {
        container.hidden = true;
      });
    });
})();
