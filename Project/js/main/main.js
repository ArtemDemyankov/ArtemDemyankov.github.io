let $buildingOptions = document.getElementById("buildingOptions");
let $profileOptions = document.getElementById("profileOptions");
let $auditoryOptions = document.getElementById("auditoryOptions");
let $audiencesTable = document.getElementById("audiencesTable");


let apiCorpses = 'https://lyceumexams.herokuapp.com/api/corpses';
let apiDictionary = 'https://lyceumexams.herokuapp.com/api/dictionary';
let apiPupils = 'https://lyceumexams.herokuapp.com/api/pupils?';


let corpsesID = {};
let profilesID = {};
let profilesDict = {};
let audiencesDict = {};
let profilesSelect = [];
let auditoriesSelect = [];
let audiencesCorpses = {};
let audiencesProfiles = {};


function ajax_get(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    let data;
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        data = JSON.parse(xhr.responseText);
      } catch (err) {
        console.log(err.message + " in " + xhr.responseText);
        return;
      }
      callback(data);
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
}


ajax_get(apiCorpses, function (data) {
  for (let i = 0; i < data.length; i++) {
    let name;
    let auditoryCorpses = [];

    name = data[i]["name"];
    corpsesID[data[i]["name"]] = data[i]["alias"];

    buildingsHTML += '<option>' + data[i]["name"] + '</option>';

    let places = data[i]["places"];
    for (let j in places) {
      let audiences;
      if (places.hasOwnProperty(j)) {
        audiences = places[j]["audience"];
        profilesID[places[j]["code"]] = places[j]["_id"];
      }
      let auditoryProfiles = [];
      for (let k in audiences) {
        if (audiences.hasOwnProperty(k)) {
          auditoriesSelect.push({
            key: places[j]["code"],
            value: audiences[k]["name"]
          });
          auditoryProfiles.push({name: audiences[k]["name"], count: audiences[k]["count"], max: audiences[k]["max"]});
          auditoryCorpses.push({name: audiences[k]["name"], count: audiences[k]["count"], max: audiences[k]["max"]});
        }
      }
      audiencesProfiles[places[j]["code"]] = auditoryProfiles;
    }
    audiencesCorpses[name] = auditoryCorpses;
  }

  $buildingOptions.innerHTML += buildingsHTML;
});


ajax_get(apiDictionary, function (data) {
  let places = data["places"];
  let audiences = data["audiences"];
  let profiles = data["profiles"];

  for (let i in places) {
    if (places.hasOwnProperty(i)) {
      profilesSelect.push({
        key: places[i]["name"],
        value: places[i]["code"]
      })
    }
  }

  for (let i in audiences) {
    if (audiences.hasOwnProperty(i)) {
      audiencesDict[i] = audiences[i];
    }
  }

  for (let i in profiles) {
    if (profiles.hasOwnProperty(i)) {
      profilesDict[i] = profiles[i];
    }
  }
});


let buildingsHTML = "";
let profilesAllHTML = '<option value="all" selected="selected">Все</option>';
let auditoriesAllHTML = '<option value="all" selected="selected">Все</option>';


function setProfiles() {
  let selectedIndex = $buildingOptions.options.selectedIndex;
  let selectedBuilding = $buildingOptions.value;
  let profilesHTML = "";
  let auditoriesHTML = "";

  let url = apiPupils + 'corps=' + corpsesID[selectedBuilding] + '&place=';

  // удаляем пустую строку в корпусах
  if ($buildingOptions.options[0].value === "empty") {
    $buildingOptions.innerHTML = buildingsHTML;
    $buildingOptions.options.selectedIndex = selectedIndex - 1;
  }

  // очищаем профили
  $profileOptions.innerHTML = profilesAllHTML;

  // очищаем аудитории
  $auditoryOptions.innerHTML = auditoriesAllHTML;

  // добавляем профили
  for (let i = 0; i < profilesSelect.length; i++) {
    if (selectedBuilding === profilesSelect[i].key) {
      profilesHTML += '<option>' + profilesSelect[i].value + '</option>';
    }
  }

  $profileOptions.innerHTML += profilesHTML;

  // добавляем аудитории
  for (let i = 1; i < $profileOptions.length; i++) {
    for (let j = 0; j < auditoriesSelect.length; j++) {
      if ($profileOptions[i].value === auditoriesSelect[j].key) {
        auditoriesHTML += '<option>' + auditoriesSelect[j].value + '</option>';
      }
    }
  }

  $auditoryOptions.innerHTML += auditoriesHTML;

  loadData(url);

  writeToAudiencesTable(audiencesCorpses[selectedBuilding]);
}

$buildingOptions.addEventListener("change", setProfiles);


function setAuditories() {
  let selectedProfile = $profileOptions.value;
  let selectedBuilding = $buildingOptions.value;
  let auditoriesHTML = "";
  let audiences = [];

  let url = apiPupils + 'corps=' + corpsesID[selectedBuilding] + '&place=';

  // очищаем аудитории
  $auditoryOptions.innerHTML = auditoriesAllHTML;

  // добавляем все аудитории
  if (selectedProfile === "all") {
    for (let i = 1; i < $profileOptions.length; i++) {
      for (let j = 0; j < auditoriesSelect.length; j++) {
        if ($profileOptions[i].value === auditoriesSelect[j].key) {
          auditoriesHTML += '<option>' + auditoriesSelect[j].value + '</option>';
        }
      }
    }

    audiences = audiencesCorpses[selectedBuilding];

    // добавляем профильные аудитории
  } else {
    for (let i = 0; i < auditoriesSelect.length; i++) {
      if (selectedProfile === auditoriesSelect[i].key) {
        auditoriesHTML += '<option>' + auditoriesSelect[i].value + '</option>';
      }
    }

    audiences = audiencesProfiles[selectedProfile];

    url += profilesID[selectedProfile];
  }

  $auditoryOptions.innerHTML += auditoriesHTML;

  loadData(url);

  writeToAudiencesTable(audiences);
}

$profileOptions.addEventListener("change", setAuditories);


function chooseAuditory() {
  let selectedAuditory = $auditoryOptions.value;
  let necessaryStudents = [];
  students = studentsCopy.concat();

  if (selectedAuditory !== "all") {
    for (let i = 0; i < students.length; i++) {
      if (students[i].auditory === selectedAuditory) {
        necessaryStudents.push(students[i]);
      }
    }
    students = necessaryStudents.concat();
  }

  $studentsTable.getElementsByTagName("th")[previousColumn]
    .classList.remove("arrow_up", "arrow_down");

  writeToStudentsTable();
}

$auditoryOptions.addEventListener("change", chooseAuditory);


function loadData(url) {
  ajax_get(url, function (data) {
    let name;
    let audience;
    let profile;

    students.length = 0;
    // students = [];

    for (let i = 0; i < data.length; i++) {
      name = data[i]["firstName"] + " " + data[i]["lastName"] + " " + data[i]["parentName"];
      audience = audiencesDict[data[i]["audience"]];
      profile = profilesDict[data[i]["profile"]];
      students.push({name: name, auditory: audience, profile: profile});

    }

    studentsCopy = students.concat();

    $studentsTable.getElementsByTagName("th")[previousColumn]
      .classList.remove("arrow_up", "arrow_down");

    writeToStudentsTable();
  })
}


function writeToStudentsTable() {
  if ($studentsTable.getElementsByTagName('tbody')[0] !== undefined) {
    $studentsTable.removeChild($studentsTable.getElementsByTagName('tbody')[0]);
  }

  let $studentsHTML = '<tbody>';
  for (let i = 0; i < students.length; i++) {
    $studentsHTML += '<tr class="draggable">' +
      '<td>' + (i + 1) + '</td>' +
      '<td>' + students[i].name + '</td>' +
      '<td>' + students[i].auditory + '</td>' +
      '<td>' + students[i].profile + '</td>' +
      '<td>' + '</td>' +
      '</tr>';
  }
  $studentsHTML += '</tbody>';

  $studentsTable.innerHTML += $studentsHTML;
}


function writeToAudiencesTable(audiences) {
  if ($audiencesTable.getElementsByTagName('tbody')[0] !== undefined) {
    $audiencesTable.removeChild($audiencesTable.getElementsByTagName('tbody')[0]);
  }

  let $audiencesHTML = '<tbody>';
  for (let i = 0; i < audiences.length; i++) {
    $audiencesHTML += '<tr class="droppable">' +
      '<th>' + audiences[i].name + '</th>' +
      '<td>' + audiences[i].count + '</td>' +
      '<td>' + audiences[i].max + '</td>' +
      '<td>' + '</td>' +
      '</tr>';
  }
  $audiencesHTML += '</tbody>';

  $audiencesTable.innerHTML += $audiencesHTML;
}
