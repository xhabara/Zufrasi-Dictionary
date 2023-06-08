let csvData;
let dictionary = {};

let inputBox;
let outputBox;
let customOutputBox;
let submitButton;
let verbButton;
let passiveVerbButton;
let nounButton;
let processNounButton;
let pluralButton;
let customFont;
let customOutputParagraph;

function preload() {
  csvData = loadStrings("/kamuszufrasiv03.csv");
  customFont = loadFont("Zugrafi3.otf");
}

function setup() {
  noCanvas();

  // Process the loaded CSV data
  for (let i = 1; i < csvData.length; i++) {
    let line = csvData[i].split(",");
    let key = line[0].trim().toLowerCase(); // Convert the key to lowercase
    let value = line[1].trim();
    dictionary[key] = value;
  }

  let inputContainer = createDiv();
  inputContainer.addClass("input-container");
  inputContainer.style("width", "90%");
  inputContainer.style("margin", "0 auto");
  inputBox = createInput();
  inputBox.attribute("placeholder", "Enter Indonesian Word...");
  inputBox.input(onInput);
  inputBox.style("width", "100%");
  inputBox.parent(inputContainer);

  outputBox = createInput();
  outputBox.attribute("readonly", "true");
  outputBox.attribute("placeholder", "Zufrasi Translation...");
  outputBox.style("width", "100%");
  outputBox.parent(inputContainer);

  customFontOutputParagraph = createP("");
  customFontOutputParagraph.parent(inputContainer);

  customOutputBox = createDiv();
  customOutputBox.addClass("output-text");
  customOutputBox.parent(inputContainer);

  customOutputParagraph = createP("");
  customOutputParagraph.parent(inputContainer);

  submitButton = createButton("No Data Yet. Submit Word");
  submitButton.mousePressed(submitTranslation);
  submitButton.parent(inputContainer);
  submitButton.hide();

  verbButton = createButton("Active Verb");
  verbButton.mousePressed(convertToVerb);
  verbButton.parent(inputContainer);
  verbButton.style("width", "100%");
  verbButton.style("font-size", "18px");
  verbButton.style("margin-top", "10px");

  passiveVerbButton = createButton("Passive Verb");
  passiveVerbButton.mousePressed(convertToPassiveVerb);
  passiveVerbButton.parent(inputContainer);
  passiveVerbButton.style("width", "100%");
  passiveVerbButton.style("font-size", "18px");
  passiveVerbButton.style("margin-top", "10px");

  nounButton = createButton("Noun-Object");
  nounButton.mousePressed(convertToNoun);
  nounButton.parent(inputContainer);
  nounButton.style("width", "100%");
  nounButton.style("font-size", "18px");
  nounButton.style("margin-top", "10px");

  processNounButton = createButton("Noun-Process");
  processNounButton.mousePressed(convertToProcessNoun);
  processNounButton.parent(inputContainer);
  processNounButton.style("width", "100%");
  processNounButton.style("font-size", "18px");
  processNounButton.style("margin-top", "10px");

  pluralButton = createButton("Plural");
  pluralButton.mousePressed(convertToPlural);
  pluralButton.parent(inputContainer);
  pluralButton.style("width", "100%");
  pluralButton.style("font-size", "18px");
  pluralButton.style("margin-top", "10px");

  customFontButton = createButton("Zugrafi");
customFontButton.mousePressed(applyCustomFont);
customFontButton.parent(inputContainer);
customFontButton.style("width", "100%");
customFontButton.style("font-size", "18px");
customFontButton.style("margin-top", "10px");
}

function drawCustomText(text, x, y) {
let xPos = x;
textSize(32);
textFont(customFont);
textAlign(LEFT, TOP);

for (let i = 0; i < text.length; i++) {
let char = text.charAt(i);
text(char, xPos, y);
  let charWidth = textWidth(char);
if ("aiueoAIUEO".includes(char)) {
  xPos += charWidth - 10; // Adjust this value as needed
} else {
  xPos += charWidth;
}
}
}

function onInput() {
let inputText = inputBox.value().trim().toLowerCase(); // Convert the input text to lowercase
let outputText = dictionary[inputText];
if (outputText) {
outputBox.value(outputText);
submitButton.hide();
  customOutputBox.html(outputText);
customOutputBox.style("font-family", "Helvetica");

customFontOutputParagraph.html(outputText.toUpperCase());
customFontOutputParagraph.addClass("custom-font");
} else {
outputBox.value("");
customOutputBox.html("");
submitButton.show();
}
}


function onInput() {
  let inputText = inputBox.value().trim().toLowerCase(); // Convert the input text to lowercase
  let outputText = dictionary[inputText];
  if (outputText) {
    outputBox.value(outputText);
    submitButton.hide();

    customOutputBox.html(outputText);
    customOutputBox.style("font-family", "Helvetica");

    customFontOutputParagraph.html(outputText.toUpperCase());
    customFontOutputParagraph.addClass("custom-font");
  } else {
    outputBox.value("");
    customOutputBox.html("");
    submitButton.show();
  }
}

async function submitTranslation() {
  let word = inputBox.value().trim();
  let translation = outputBox.value().trim();

  if (word && translation) {
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, translation }),
    });

    if (response.ok) {
      dictionary[word.toLowerCase()] = translation; // Store the word in lowercase
      submitButton.hide();
      alert("Translation submitted successfully!");
    } else {
      alert("Error submitting translation. Please try again.");
    }
  } else {
    alert("Both fields must be filled in to submit a translation.");
  }
}

function convertToVerb() {
  let outputText = outputBox.value().trim();
  if (outputText) {
    let firstChar = outputText.charAt(0).toLowerCase();
    let verbPrefix = "a";
    if ("aeiou".includes(firstChar)) {
      verbPrefix = "al";
    }
    let verbText = verbPrefix + outputText;

    customOutputBox.html(verbText);
    customOutputBox.style("font-family", customFont);
    applyCustomFont(verbText);
  }
}

function convertToPassiveVerb() {
  let outputText = outputBox.value().trim();
  if (outputText) {
    let firstChar = outputText.charAt(0).toLowerCase();
    let passiveVerbPrefix = "ka";
    if ("aeiou".includes(firstChar)) {
      passiveVerbPrefix = "kal";
    }
    let passiveVerbText = passiveVerbPrefix + outputText;

    customOutputBox.html(passiveVerbText);
    customOutputBox.style("font-family", customFont);
    applyCustomFont(passiveVerbText);
  }
}

function convertToNoun() {
  let outputText = outputBox.value().trim();
  if (outputText) {
    let lastChar = outputText.charAt(outputText.length - 1).toLowerCase();
    let nounSuffix = "a";
    if ("aeiou".includes(lastChar)) {
      nounSuffix = "la";
    }
    let nounText = outputText + nounSuffix;
    customOutputBox.html(nounText);
    customOutputBox.style("font-family", customFont);
    applyCustomFont(nounText);
  }
}

function convertToProcessNoun() {
  let outputText = outputBox.value().trim();
  if (outputText) {
    let lastChar = outputText.charAt(outputText.length - 1).toLowerCase();
    let processNounSuffix = "ana";
    if ("aeiou".includes(lastChar)) {
      processNounSuffix = "na";
    }
    let processNounText = outputText + processNounSuffix;
    customOutputBox.html(processNounText);
    customOutputBox.style("font-family", customFont);
    applyCustomFont(processNounText);
  }
}

function convertToPlural() {
  let outputText = outputBox.value().trim();
  if (outputText) {
    let lastChar = outputText.charAt(outputText.length - 1).toLowerCase();
    let pluralSuffix = "aha";
    if ("aeiou".includes(lastChar)) {
      pluralSuffix = "ha";
    }
    let pluralText = outputText + pluralSuffix;
    customOutputBox.html(pluralText);
    customOutputBox.style("font-family", customFont);
    applyCustomFont(pluralText);
  }
}

function applyCustomFont(text) {
  if (text) {
    let customFontText = text.toUpperCase();
    customFontOutputParagraph.html(customFontText);
    customFontOutputParagraph.addClass("custom-font");
  }
}
