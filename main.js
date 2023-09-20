chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  console.log("listener worked ! its response :");
  console.log(response);
  switch (response.responseType) {
    case "save_favorite":
      console.log("c'est passé dans le save_favorite");
      GetInfosAndStore(response);
      break;
    case "insertProject":
      insertProject(response.activityType, response.BU, response.project);
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

async function insertProject(activityType, BUtoFill, projectToFill) {
  let htmlValues = getHtmlValues(activityType);
  let nbRowsBeforeClick = document.getElementById(htmlValues.table).rows.length;
  console.log(htmlValues);

  let button = document.getElementById(htmlValues.button);
  button.click();
  loopInsert = setInterval(
    function () {
      let table = document.getElementById(htmlValues.table);
      let selectBU = document.getElementById(
        htmlValues.selectBUname.replace("2", table.rows.length.toString())
      );
      let selectProject = document.getElementById(
        htmlValues.selectProjectName.replace("2", table.rows.length.toString())
      );

      if (table.rows.length > nbRowsBeforeClick) {
        if (selectBU.value !== BUtoFill) {
          let trigger = document.createElement("option");
          trigger.value = "trigger";
          selectProject.add(trigger);
          selectBU.value = BUtoFill;
          selectBU.dispatchEvent(new Event("change"));
        } else if (
          selectProject[selectProject.options.length - 1].value !== "trigger"
        ) {
          var options = Array.from(selectProject.options);
          options.forEach(function (option) {
            if (option.text === projectToFill) {
              selectProject.value = option.value;
            }
          });
          selectProject.dispatchEvent(new Event("change"));
          clearInterval(loopInsert);
          return;
        }
      }
    }.bind(htmlValues, nbRowsBeforeClick),
    50
  );
}

function getHtmlValues(activityType) {
  let table;
  let selectBUname;
  let selectProjectName;
  let button;
  switch (activityType) {
    case "facturable":
      table = "ctl00_cph_a_GridViewActivitesFacturables";
      selectBUname = "ctl00_cph_a_GridViewActivitesFacturables_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewActivitesFacturables_ctl02_ddlProjet";
      button = "ctl00_cph_a_btnAjoutDirect";
      break;
    case "nonFacturable":
      table = "ctl00_cph_a_GridViewActivitesNonFacturables";
      selectBUname =
        "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlProjet";
      button = "ctl00_cph_a_btnAjoutIndirect";
      break;
    case "absFormDeleg":
      table = "ctl00_cph_a_GridViewAbsenceFormation";
      selectBUname = "ctl00_cph_a_GridViewAbsenceFormation_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewAbsenceFormation_ctl02_ddlProjet";
      button = "ctl00_cph_a_btnAjoutAbsences";
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : main.js htmlValues");
  }
  return { table, selectBUname, selectProjectName, button };
}
