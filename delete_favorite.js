console.log("delete_favorite.js");

window.onload = function () {
  document.getElementById("escape").addEventListener("click", ReturnMainPopup);
};

function ReturnMainPopup() {
  window.location.href = "popup.html";
}
