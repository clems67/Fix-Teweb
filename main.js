console.log("hello from main.js");
document.body.style.border = "10px solid green";

chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  console.log("listener worked ! its response :");
  console.log(response);

  const BuOptionName = getBuOptionName(
    response.activityType,
    response.lineNumber
  );

  document.getElementsByName(BuOptionName)[0].value = response.BuValue; //option selected changed here

  const ProjectOptionName = getProjectOptionName(
    response.activityType,
    response.lineNumber
  );

  document.getElementsByName(ProjectOptionName)[0].value =
    response.ProjectNumber;
});

function getBuOptionName(activityType, lineNumber) {
  const line = 1 + Number(lineNumber);
  if (activityType == "facturable") {
    return (
      "ctl00$cph$a$GridViewActivitesFacturables$ctl0" + line + "$ddlCodeBU"
    );
  } else if (activityType == "nonFacturable") {
    return (
      "ctl00$cph$a$GridViewActivitesNonFacturables$ctl0" + line + "$ddlCodeBU"
    );
  } else if (activityType == "absFormDeleg") {
    return "ctl00$cph$a$GridViewAbsenceFormation$ctl0" + line + "$ddlCodeBU";
  }
}

function getProjectOptionName(activityType, lineNumber) {
  const line = 1 + Number(lineNumber);
  if (activityType == "facturable") {
    return (
      "ctl00$cph$a$GridViewActivitesFacturables$ctl0" + line + "$ddlProjet"
    );
  } else if (activityType == "nonFacturable") {
    return (
      "ctl00$cph$a$GridViewActivitesNonFacturables$ctl0" + line + "$ddlProjet"
    );
  } else if (activityType == "absFormDeleg") {
    return "ctl00$cph$a$GridViewAbsenceFormation$ctl0" + line + "$ddlProjet";
  }
}
