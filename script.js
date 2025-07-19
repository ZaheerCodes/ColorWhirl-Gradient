// ACCESSING ELEMENTS

let colorCount = document.querySelectorAll(".color").length;
let colorList = document.querySelector("#colors-list");
let randBtns = colorList.querySelectorAll(".random-btn");
let delBtns = colorList.querySelectorAll(".delete-btn");
let addBtn = document.querySelector("#add-color-btn");
let typeInput = document.querySelector("#type-dropdown");
let positionInput = document.querySelector("#position-input");
let angleInput = document.querySelector("#angle-input");
let hexInput = document.querySelector("#hex-input");
let randomHexBtn = document.querySelector("#panel-col-1 .random-btn");
let redInput = document.querySelector("#red");
let greenInput = document.querySelector("#green");
let blueInput = document.querySelector("#blue");
let flipBtn = document.querySelector("#flip-btn");
let opacitySlider = document.querySelector("#opacity-slider");
let opacityInput = document.querySelector("#opacity-input");
let copyCodeBtn = document.querySelector("#copy-css-btn");
let selectedColor = null;


// FUNCTIONS

const selectColor = (event) => {
    if(selectedColor != null) {
        selectedColor.classList.remove("color-selected");
    }
    selectedColor = event.currentTarget;
    selectedColor.classList.add("color-selected");
    let colorBox = selectedColor.querySelector(".color-box");
    let code = getComputedStyle(colorBox).getPropertyValue("background-color");
    let hexValue = getHexFromRgb(code, true);
    updateHexInput(null, hexValue, getOpacityHex(opacityInput.value));
    hexInputToRgbInput(null, hexInput.value);
    let position = selectedColor.querySelector(".position");
    positionInput.value = position.value;
};

const resetSelection = () => {
    if(selectedColor != null)
    {
        selectedColor.classList.remove("color-selected");
        selectedColor = null;
        hexInput.value = "";
        hexInputToRgbInput(null, hexInput.value);
        positionInput.value = "";
        setOpacity("100");
    }
};

const deleteColor = (event) => {
    if(colorCount > 2)
    {
        resetSelection();
        event.target.parentElement.remove();
        colorCount--;
        arrangePositions(event);
    }
    else {
        alert("Cannot Delete!\nGradient must have at least two colors.")
    }
};

const randomizeColor = (event) => {
    hexInput.value = getRandomHex();
    let opacityHex = getOpacityHex(opacityInput.value);
    if(event.currentTarget.classList.contains("color-random-btn")) {
        let colorBox = event.currentTarget.parentElement.querySelector(".color-box");
        colorBox.style.backgroundColor = "#" + hexInput.value + opacityHex;
    }
    else {
        updateHexInput(event, hexInput.value, getOpacityHex(opacityInput.value));
    }
    hexInputToRgbInput(null, hexInput.value);
};

const addNewColor = () => {
    let color = colorList.querySelector(".color");
    color.classList.remove("color-selected");
    let newColor = color.cloneNode(true);
    colorList.append(newColor);
    colorCount++;
    let randBtn = newColor.querySelector(".random-btn");
    let deleteBtn = newColor.querySelector(".delete-btn");
    let colorBox = newColor.querySelector(".color-box");
    let position = newColor.querySelector(".position");
    newColor.addEventListener("click", selectColor);
    randBtn.addEventListener("click", randomizeColor);
    randBtn.addEventListener("click", updateGradientBox);
    deleteBtn.addEventListener("click", deleteColor);
    deleteBtn.addEventListener("click", updateGradientBox);
    position.addEventListener("input", positionInputMatchSelection);
    position.addEventListener("change", arrangePositions);
    position.addEventListener("input", updateGradientBox);
    if(positionInput.value == "")
    {
        positionInput.value = 100;
        position.value = positionInput.value;
        setDefaultPositions();
    }
    position.value = positionInput.value;
    arrangePositions();
    if(hexInput.value == "")
        hexInput.value = getRandomHex();
    colorBox.style.backgroundColor = "#" + hexInput.value + getOpacityHex(opacityInput.value);
    newColor.dispatchEvent(new Event("click"));
};

const setDefaultPositions = () => {
    let count = colorCount - 1;
    let colors = colorList.querySelectorAll(".color");
    for (const element of colors) {
        let positionInput = element.querySelector(".position");
        positionInput.value = Math.floor(100-(100/(colorCount-1))*count);
        count--;
    }
};

const arrangePositions = (event = null) => {
    let colors = colorList.querySelectorAll(".color");
    let colorsArr = Array.from(colors);
    for (let i = 0; i < colorsArr.length; i++) {
        colorList.removeChild(colorsArr[i]);
    }
    if(event != null && event.target == flipBtn)
    {
        for (let i = colorsArr.length - 1; i >= 0; i--) {
            let positionInput = colorsArr[i].querySelector(".position");
            positionInput.value = 100 - positionInput.value;
        }
    }
    colorsArr.sort(sortColorListByPosition);
    for (let i = colorsArr.length - 1; i >= 0; i--) {
        colorList.append(colorsArr[i]);
    }
};

const sortColorListByPosition = (a,b) => {
    let aNum = a.querySelector(".position").value;
    let bNum = b.querySelector(".position").value;
    return bNum-aNum;
};

const getRandomHex = () => {
    let hexStr = "";
    for (let i = 0; i < 6; i++) {
        let randomNum = Math.trunc(Math.random() * 16);
        hexStr += randomNum.toString(16);
    }
    return hexStr;
};

const hexInputToRgbInput = (event = null, hexStr = "") => {
    let hexValue;
    if (event != null)
        hexValue = event.target.value;
    else
        hexValue = hexStr;
    let redInput = document.querySelector("#red");
    let greenInput = document.querySelector("#green");
    let blueInput = document.querySelector("#blue");
    if(hexValue != "")
    {
        redInput.value = parseInt(`${hexValue.slice(0,2)}`,16);
        greenInput.value = parseInt(`${hexValue.slice(2,4)}`,16);
        blueInput.value = parseInt(`${hexValue.slice(4,6)}`,16);
    }
    else {
        redInput.value = "";
        greenInput.value = "";
        blueInput.value = "";
    }
};

const updateHexInput = (event = null, hexStr, opacityStr = "") => {
    hexInput.value = hexStr;
    if (selectedColor != null) {
        let colorBox = selectedColor.querySelector(".color-box");
        colorBox.style.backgroundColor = "#" + hexInput.value + opacityStr;
    }
    hexInput.value = hexInput.value.slice(0,6);
};

const redInputToHexInput = (event) => {
    let redValue = event.target.value;
    if(redValue == "") redValue = 0;
    let redHexValue = parseInt(redValue).toString(16);
    if(redHexValue.length < 2) redHexValue = "0" + redHexValue;
    updateHexInput(null, "" + redHexValue + hexInput.value.slice(2,6));
};

const greenInputToHexInput = (event) => {
    let greenValue = event.target.value;
    if(greenValue == "") greenValue = 0;
    let greenHexValue = parseInt(greenValue).toString(16);
    if(greenHexValue.length < 2) greenHexValue = "0" + greenHexValue;
    updateHexInput(null, "" + hexInput.value.slice(0,2) + greenHexValue + hexInput.value.slice(4,6));
};

const blueInputToHexInput = (event) => {
    let blueValue = event.target.value;
    if(blueValue == "") blueValue = 0;
    let blueHexValue = parseInt(blueValue).toString(16);
    if(blueHexValue.length < 2) blueHexValue = "0" + blueHexValue;
    let hexInput = document.querySelector("#hex-input");
    updateHexInput(null, "" + hexInput.value.slice(0,4) + blueHexValue);
};

const getHexFromRgb = (rgbStr, settingOpacity = false) => {
    // Expected Format:
    //      rgb(255,255,255);
    //      rgba(255,255,255,0.987);
    if (rgbStr == "" || rgbStr == null)
        return "000000";
    let red = "", green = "", blue = "", alpha = "", splitCount = 0;
    for (let i = 0; i < rgbStr.length; i++) {
        if(isNaN(parseInt(rgbStr[i])) && rgbStr[i] != ".") {
            if (rgbStr[i] == ",") splitCount++;
        }
        else {
            if(splitCount == 0) red += rgbStr[i];
            else if (splitCount == 1) green += rgbStr[i];
            else if (splitCount == 2) blue += rgbStr[i];
            else alpha += rgbStr[i];
        }
    }
    red = parseInt(red).toString(16);
    green = parseInt(green).toString(16);
    blue = parseInt(blue).toString(16);
    if(red.length < 2) red = "0" + red;
    if(green.length < 2) green = "0" + green;
    if(blue.length < 2) blue = "0" + blue;
    if(settingOpacity == true) {
        if (alpha != "")
            setOpacity(Math.ceil(alpha*100));
        else
            setOpacity(100);
    }
    return red + green + blue;
};

const handleOpacityInput = (event) => {
    setOpacity(event.target.value);
    if (selectedColor != null) {
        let colorBox = selectedColor.querySelector(".color-box");
        let code = getComputedStyle(colorBox).getPropertyValue("background-color");
        colorBox.style.backgroundColor = "#" + getHexFromRgb(code, false) + getOpacityHex(opacityInput.value);
    }
    updateGradientBox();
};

const getOpacityHex = (value) => {
    value = parseInt((value) * 2.55).toString(16);
    if (value.length < 2) value = "0" + value;
    return value;
};

const getOpacityDec = (value) => {
    return Math.ceil(parseInt(value, 16) / 2.55);
};

const setOpacity = (value) => {
    opacityInput.value = value;
    opacitySlider.value = value;
};

const positionInputMatchSelection = (event) => {
    if(selectedColor != null) {
        let value = event.target.value;
        selectedColor.querySelector(".position").value = value;
        positionInput.value = value;
    }
};

const copyCode = () => {
    let str = `background: ${updateGradientBox()};`;
    navigator.clipboard.writeText(str);
};

const updateGradientBox = () => {
    const type = document.querySelector("#type-dropdown").value;
    const angle = document.querySelector("#angle-input").value;
    const colorsArr = Array.from(colorList.querySelectorAll(".color"));
    let str =`${type}(`;

    if (type == "linear-gradient") {
        str += `${angle}deg, `;
    }
    else if (type == "radial-gradient") {
        str += `circle at center, `;
    }
    else if (type == "conic-gradient") {
        str += `from ${angle}deg at center, `;
    }

    for (let i = 0; i < colorsArr.length; i++) {
        const position = colorsArr[i].querySelector(".position").value;
        const colorBox = colorsArr[i].querySelector(".color-box");
        const colorCode = getComputedStyle(colorBox).getPropertyValue("background-color");
        str += `${colorCode} `;
        if (type == "conic-gradient") {
            let angle = Math.floor(position*3.6);
            str += `${angle}deg`;
        }
        else
            str += `${position}%`;
        if(i < colorsArr.length - 1)
            str += `, `;
        else
            str += `)`;
    }

    document.querySelector("#gradient-box").style.background = str;
    return str;
};

updateGradientBox();

const numInputInRange = (event) => {
    let value = parseInt(event.target.value);
    let min = parseInt(event.target.min);
    let max = parseInt(event.target.max);
    if(value > max)
        event.target.value = max;
    else if(value < min)
        event.target.value = min;
};

const validHex = (hex) => {
    while(hex.length < 6)
        hex += "0";
    return hex;
};

const hexInputIsValid = (event) => {
    let element = event.target;
    if(element.value.toString()[0] == "#")
        element.value = element.value.slice(1);
    for (let i = 0; i < element.value.length && i < 8; i++) {
        if (isNaN(parseInt(element.value[i], 16))) {
            element.value = element.value.slice(0,i) + "F" + element.value.slice(i+1);
        }
    }
    if (element.value.length > 8)
        element.value = element.value.slice(0,8);

    // Handling Opacity

    if (element.value.length > 6)
    {
        let opacity = element.value.slice(6);
        if (opacity.length < 2)
            opacity += "0";
        opacity = (parseInt(opacity, 16) / 2.55) + 0.1;
        opacityInput.value = Math.trunc(opacity);
        opacitySlider.value = opacityInput.value;
    }

    if (selectedColor != null) {
        let colorBox = selectedColor.querySelector(".color-box");
        colorBox.style.backgroundColor = "#" + validHex(hexInput.value) + getOpacityHex(opacityInput.value);
    }
};

const hexChangeIsValid = (event) => {
    let element = event.target;
    while(element.value.length < 6)
        element.value += "0";
    if (element.value.length > 6)
        element.value = element.value.slice(0,6);
    hexInputToRgbInput(null, element.value);
};

const disableInputs = (event) => {
    let angleLabel = document.querySelector(`label[for="angle"]`);
    if (event.target.value == "radial-gradient") {
        angleInput.setAttribute("disabled", "true");
        angleLabel.setAttribute("disabled", "true");
    }
    else {
        angleInput.removeAttribute("disabled");
        angleLabel.removeAttribute("disabled");
    }
};



// ADDING EVENTS

for (const element of randBtns) {
    element.addEventListener("click", randomizeColor);
    element.addEventListener("click", updateGradientBox);
}
for (const element of delBtns) {
    element.addEventListener("click", deleteColor);
    element.addEventListener("click", updateGradientBox);
}
let colors = colorList.querySelectorAll(".color");
for (const element of colors) {
    element.addEventListener("click", selectColor);
    let position = element.querySelector(".position");
    position.addEventListener("input", positionInputMatchSelection);
    position.addEventListener("change", arrangePositions);
    position.addEventListener("input", updateGradientBox);
}

addBtn.addEventListener("click", addNewColor);
addBtn.addEventListener("click", updateGradientBox);
flipBtn.addEventListener("click", arrangePositions);
flipBtn.addEventListener("click", updateGradientBox);
typeInput.addEventListener("change", disableInputs);
typeInput.addEventListener("change", updateGradientBox);

hexInput.addEventListener("input", hexInputIsValid);
hexInput.addEventListener("blur", hexChangeIsValid);
hexInput.addEventListener("input", hexInputToRgbInput);
hexInput.addEventListener("input", updateGradientBox);
randomHexBtn.addEventListener("click", randomizeColor);
randomHexBtn.addEventListener("click", updateGradientBox);

redInput.addEventListener("input", numInputInRange);
redInput.addEventListener("input", redInputToHexInput);
redInput.addEventListener("input", updateGradientBox);
greenInput.addEventListener("input", numInputInRange);
greenInput.addEventListener("input", greenInputToHexInput);
greenInput.addEventListener("input", updateGradientBox);
blueInput.addEventListener("input", numInputInRange);
blueInput.addEventListener("input", blueInputToHexInput);
blueInput.addEventListener("input", updateGradientBox);

angleInput.addEventListener("input", numInputInRange);
angleInput.addEventListener("input", updateGradientBox);
positionInput.addEventListener("input", numInputInRange);
positionInput.addEventListener("input", positionInputMatchSelection);
positionInput.addEventListener("input", updateGradientBox);
opacityInput.addEventListener("input", numInputInRange);
opacityInput.addEventListener("change", handleOpacityInput);
opacitySlider.addEventListener("change", handleOpacityInput);
copyCodeBtn.addEventListener("click", copyCode);

window.addEventListener("click", (event) => {
    let panel = document.querySelector("#panel");
    let panelCol2 = document.querySelector("#panel-col-2");
    if( (!panel.contains(event.target) ||
        (panelCol2.contains(event.target) && !colorList.contains(event.target))) &&
        !addBtn.contains(event.target))
    {
        resetSelection();
    }
});
