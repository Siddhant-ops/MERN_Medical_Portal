// Greets the user
export function greetings() {
  var time = new Date().getHours();
  if (time < 12) {
    return `Good Morning`;
  } else if (time < 17) {
    return `Good Afternoon`;
  } else {
    return `Good Evening`;
  }
}

// Convert Auth token to js obj
export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const diagnosisList = [
  "Hypertension",
  "Hyperlipidemia",
  "Diabetes",
  "Back pain",
  "Anxiety",
  "Obesity",
  "Allergic rhinitis",
  "Reflux esophagitis",
  "Respiratory problems",
  "Hypothyroidism",
  "Visual refractive errors",
  "General medical exam",
  "Osteoarthritis",
  "Fibromyalgia / myositis",
  "Malaise and fatigue",
  "Pain in joint",
  "Acute laryngopharyngitis",
  "Acute maxillary sinusitis",
  "Major depressive disorder",
  "Acute bronchitis",
  "Asthma",
  "Depressive disorder",
  "Nail fungus",
  "Coronary atherosclerosis",
  "Urinary tract infection",
];

export const medPrescribed = [
  "Hydrocodone",
  "Zocor",
  "Lisinopril",
  "Synthroid",
  "Norvasc",
  "Prilosec",
  "Azithromycin",
  "Amoxicillin",
  "Glucophage",
  "Hydrochlorothiazide",
  "Lipitor",
  "Nexium",
  "Plavix",
  "Advair Diskus",
  "Abilify",
  "Seroquel",
  "Singulair",
  "Crestor",
  "Actos",
  "Epogen",
];

export const symptomsList = [
  "Sweating",
  "Chills and shivering",
  "Headache",
  "Muscle aches",
  "Loss of appetite",
  "Irritability",
  "Dehydration",
  "General weakness",
];

// function to create a js obj of required parameter to search patient
export function provideData(
  nameInput = "",
  symptoms = [],
  medPres = [],
  diagnos = []
) {
  // checks if an Array has values
  function hasValues(arrayName = []) {
    if (arrayName !== null && arrayName.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  var data = {};

  if (nameInput !== "") {
    var fname = nameInput.split(" ")[0];
    var lname = nameInput.split(" ")[1];
    data["firstName"] = fname;
    data["lastName"] = lname;
  }
  if (hasValues(symptoms)) {
    data["symptoms"] = symptoms;
  }
  if (hasValues(medPres)) {
    data["medPrescribed"] = medPres;
  }
  if (hasValues(diagnos)) {
    data["diagnosis"] = diagnos;
  }

  return data;
}
