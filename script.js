// ACCESSING ELEMENTS

let colorCount = document.querySelectorAll(".color").length;
let colorList = document.getElementById("colors-list");
let delBtns = document.querySelectorAll(".deleteBtn");
let addBtn = document.getElementById("add-color-btn");
let hexInput = document.querySelector("#hex-input");
let redInput = document.querySelector("#red");
let greenInput = document.querySelector("#green");
let blueInput = document.querySelector("#blue");
let opacitySlider = document.querySelector("#opacity-slider");
let opacityInput = document.querySelector("#opacity-input");



// FUNCTIONS

const delColor = (event) => {
    if(colorCount > 2)
    {
        event.target.parentElement.remove();
        colorCount--;
        updatePositions();
    }
};

const addNewColor = () => {
    let color = document.querySelector(".color");
    let newColor = color.cloneNode(true);
    colorList.append(newColor);

    let deleteBtn = newColor.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", delColor);
    let colorBox = newColor.querySelector(".color-box");
    colorBox.style.backgroundColor = "#" + hexInput.value;

    colorCount++;
    updatePositions();
};

const updatePositions = () => {
    let colors = colorList.querySelectorAll(".color");
    let count = colorCount - 1;
    for (const element of colors) {
        let positionInput = element.querySelector("#position-input");
        positionInput.value = Math.trunc(100-(100/(colorCount-1))*count);
        count--;
    }
}

const hexInputToRgbInput = (event) => {
    let hexValue = event.target.value;
    
    while(hexValue.length < 6)
        hexValue += "0";

    let redInput = document.querySelector("#red");
    redInput.value = parseInt(`${hexValue.slice(0,2)}`,16);

    let greenInput = document.querySelector("#green");
    greenInput.value = parseInt(`${hexValue.slice(2,4)}`,16);

    let blueInput = document.querySelector("#blue");
    blueInput.value = parseInt(`${hexValue.slice(4,6)}`,16);
}

const redInputToHexInput = (event) => {
    let redValue = event.target.value;
    if(redValue == "") redValue = 0;
    let redHexValue = parseInt(redValue).toString(16);
    if(redHexValue.length < 2) {redHexValue = "0" + redHexValue;}

    let hexInput = document.querySelector("#hex-input");
    hexInput.value = redHexValue + hexInput.value.slice(2,6);
}

const greenInputToHexInput = (event) => {
    let greenValue = event.target.value;
    if(greenValue == "") greenValue = 0;
    let greenHexValue = parseInt(greenValue).toString(16);
    if(greenHexValue.length < 2) greenHexValue = "0" + greenHexValue;

    let hexInput = document.querySelector("#hex-input");
    hexInput.value = hexInput.value.slice(0,2) + greenHexValue + hexInput.value.slice(4,6);
}

const blueInputToHexInput = (event) => {
    let blueValue = event.target.value;
    if(blueValue == "") blueValue = 0;
    let blueHexValue = parseInt(blueValue).toString(16);
    if(blueHexValue.length < 2) blueHexValue = "0" + blueHexValue;

    let hexInput = document.querySelector("#hex-input");
    hexInput.value = hexInput.value.slice(0,4) + blueHexValue;
}

const opacitySliderMatchInput = (event) => {
    let value = event.target.value;
    opacitySlider.value = parseInt(value);
    opacityInput.value = value;
}


// ADDING EVENTS

for (const element of delBtns) {
    element.addEventListener("click", delColor);
}
addBtn.addEventListener("click", addNewColor);
hexInput.addEventListener("input", hexInputToRgbInput);
redInput.addEventListener("input", redInputToHexInput);
greenInput.addEventListener("input", greenInputToHexInput);
blueInput.addEventListener("input", blueInputToHexInput);
opacityInput.addEventListener("input", opacitySliderMatchInput);
opacitySlider.addEventListener("input", opacitySliderMatchInput);





