InitiateSearchBars();
RemoveMarginTop();

let oldFilterBU = "";
let oldFilterProject = "";

loopSearchBars = setInterval(() => {
  if(document.getElementById('inputBu')=== null){
    InitiateSearchBars();
  }
  RemoveMarginTop();
  let filter = document.getElementById("inputBu").value;
  if (filter !== oldFilterBU) {
    Filter("ctl00_cph_uc_gvwNewLine_ctl02_ddlCodeBU", filter);
    oldFilterBU = filter;
  }
  filter = document.getElementById("inputProject").value;
  if (filter !== oldFilterProject) {
    Filter("ctl00_cph_uc_gvwNewLine_ctl02_ddlProjet", filter);
    oldFilterProject = filter;
  }
}, 200);

function Filter(selectId, filter) {
  console.log("select id :" + selectId);
  const select = document.getElementById(selectId);
  const selectList = document.getElementById(selectId).options;
  const filterString = ".*" + filter + ".*";
  const filterReg = new RegExp(filterString.toLowerCase());
  console.log("filter :" + filterReg);
  for (let item of selectList) {
    if (item.text.toLowerCase().match(filterReg)) {
      item.style.display = "";
      select.insertBefore(item, select.firstChild);
    } else {
      item.style.display = "none";
    }
  }
}

function InitiateSearchBars() {
  let inputBU = document.createElement("input");
  inputBU.id = "inputBu";
  inputBU.style = "width: 76px";
  inputBU.placeholder = "Filtre BU";
  let inputProject = document.createElement("input");
  inputProject.id = "inputProject";
  inputProject.style = "width:246px";
  inputProject.placeholder = "Filtre Projets";
  let activityNode = document.getElementById("ctl00_cph_uc_gvwNewLine");
  let parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBU, activityNode);
  parentDiv.insertBefore(inputProject, activityNode);
}

function RemoveMarginTop() {
  document.getElementById("ctl00_cph_uc_gvwNewLine").style = "margin-top:0";
}
