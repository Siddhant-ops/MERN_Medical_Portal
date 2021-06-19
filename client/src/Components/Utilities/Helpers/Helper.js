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

export var diffObject = function (obj1, obj2) {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== "[object Object]") {
    return obj1;
  }

  //
  // Variables
  //

  var diffs = {};
  var key;

  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  var arraysMatch = function (arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  var compare = function (item1, item2, key) {
    // Get the object type
    var type1 = Object.prototype.toString.call(item1);
    var type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === "[object Undefined]") {
      diffs[key] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === "[object Object]") {
      var objDiff = diffObject(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === "[object Array]") {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === "[object Function]") {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }
  };

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
};
