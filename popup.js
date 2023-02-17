window.onload = function () {
  document.getElementById("activateButton").addEventListener("click", Activate);
  document.getElementById("disableButton").addEventListener("click", Disable);
  document
    .getElementById("addFavoriteButton")
    .addEventListener("click", OpenAddFavoritePage);
  document
    .getElementById("deleteFavoriteButton")
    .addEventListener("click", DeleteAddFavoritePage);
};

function OpenAddFavoritePage() {
  window.location.href = "add_favorite.html";
}

function DeleteAddFavoritePage() {
  window.location.href = "delete_favorite.html";
}

function Activate() {
  sendInfosToMain("toggle_true");
}

function Disable() {
  sendInfosToMain("toggle_false");
}

function sendInfosToMain(toggleValue) {
  console.log("button hello works");

  chrome.runtime.sendMessage("", function (response) {});

  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: toggleValue,
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
}
