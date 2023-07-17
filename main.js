chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  console.log("listener worked ! its response :");
  console.log(response);
  switch (response.responseType) {
    case "save_favorite":
      console.log("c'est passé dans le save_favorite");
      GetInfosAndStore(response);
      break;
    case "get_favorite":
      console.log("c'et passé dans le get_favorite");
      favorits = JSON.stringify(
        GetAllFavoriteProjectList(response.activityType)
      );
      console.log(favorits);
      sendResponse({ favoritList: favorits });
      break;
    case "delete_favorite":
      console.log("c'est passé dans le delete_favorite");
      DeleteFavorite(response.selectedProject);
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : main.js adListener");
  }
});

function GetAllFavoriteProjectList(activityType) {
  let returnedArray = [];
  for (var i = 0; i < localStorage.length; i++) {
    if (
      localStorage.key(i).substring(0, 2) == "id" &&
      localStorage.key(i).length == 15 &&
      JSON.parse(localStorage.getItem(localStorage.key(i)))[0].activityType ===
        activityType
    ) {
      const jsonValue = JSON.parse(localStorage.getItem(localStorage.key(i)));
      jsonValue[0].id = localStorage.key(i);
      returnedArray.push(jsonValue);
    }
  }
  return returnedArray;
}

function GetInfosAndStore(response) {
  const buOptionName = getBuOptionId(
    response.activityType,
    response.lineNumber
  );
  const projectOptionName = getProjectOptionId(
    response.activityType,
    response.lineNumber
  );
  const buSelected = document.getElementById(buOptionName);
  const projectSelected = document.getElementById(projectOptionName);
  const arrayToStore = [
    {
      buText: buSelected.options[buSelected.selectedIndex].text,
      buValue: buSelected.value,
      projectText: projectSelected.options[projectSelected.selectedIndex].text,
      projectValue: projectSelected.value,
      activityType: response.activityType,
    },
  ];
  const jsonToStore = JSON.stringify(arrayToStore);
  var dialog = confirm(
    "Voulez-vous enregistrer le projet :\n" +
      arrayToStore[0].projectText +
      "\navec le code BU :\n" +
      arrayToStore[0].buText
  );

  if (dialog) {
    localStorage.setItem("id" + new Date().getTime(), jsonToStore);
  }
}

function DeleteFavorite(projectId) {
  localStorage.removeItem(projectId);
}

function getBuOptionId(activityType, lineNumber) {
  //la première ligne est tjrs 102
  const line = 1 + Number(lineNumber);
  if (activityType == "facturable") {
    return (
      "ctl00_cph_a_GridViewActivitesFacturables_ctl0" + line + "_ddlCodeBU"
    );
  } else if (activityType == "nonFacturable") {
    return (
      "ctl00_cph_a_GridViewActivitesNonFacturables_ctl0" + line + "_ddlCodeBU"
    );
  } else if (activityType == "absFormDeleg") {
    return "ctl00_cph_a_GridViewAbsenceFormation_ctl0" + line + "_ddlCodeBU";
  }
}

function getProjectOptionId(activityType, lineNumber) {
  //la première ligne est tjrs 102
  const line = 1 + Number(lineNumber);
  if (activityType == "facturable") {
    return (
      "ctl00_cph_a_GridViewActivitesFacturables_ctl0" + line + "_ddlProjet"
    );
  } else if (activityType == "nonFacturable") {
    return (
      "ctl00_cph_a_GridViewActivitesNonFacturables_ctl0" + line + "_ddlProjet"
    );
  } else if (activityType == "absFormDeleg") {
    return "ctl00_cph_a_GridViewAbsenceFormation_ctl0" + line + "_ddlProjet";
  }
}
