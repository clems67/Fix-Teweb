window.onload = function () {
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

/*
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const response = await chrome.tabs.sendMessage(tab.id, {
      
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
  */
