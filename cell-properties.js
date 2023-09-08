//Storage
let sheetDB = [];

for(let i = 0; i < rows;i++){
    let sheetRow = [];
    for(let j = 0;j < cols;j++){
        let cellProp = {
            bold : false,
            italic : false,
            underline : false,
            alignment : "left",
            fontFamily : "monospace",
            fontSize : "12",
            fontColor : "#000000",
            BGcolor : "#000000",
            value : "", 
            formula : "", 
            children :  [] //Just for indication purpose(default value)
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

//Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centreAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

//Application of two-way binding
//Attach property listeners
bold.addEventListener("click", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
})

italic.addEventListener("click", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
})

underline.addEventListener("click", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
})

fontSize.addEventListener("change", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

BGColor.addEventListener("change", (e) =>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellandCellProp(address);
    cellProp.BGColor = BGColor.value;
    cell.style.backgroundColor = cellProp.BGColor;
    BGColor.value = cellProp.BGColor;
})

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click",(e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellandCellProp(address);
        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment;
        switch(alignValue){
            case "left"  :  leftAlign.style.backgroundColor = activeColorProp;
                            centreAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
            case "center" : leftAlign.style.backgroundColor = inactiveColorProp;
                            centreAlign.style.backgroundColor = activeColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
            case "right" : leftAlign.style.backgroundColor = inactiveColorProp;
                            centreAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = activeColorProp;
                            break;
        }
    })
})

let allCells = document.querySelectorAll(".cell");
for(let i = 0;i < allCells.length; i++){
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell){
    //Work 
    cell.addEventListener("click",(e) => {
        let address = addressBar.value;
        let [rid,cid] = decodeRidCidFromAddress(address);
        let cellProp = sheetDB[rid][cid];
        //Apply cell properties 
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGColor === "#000000" ? "transparent" : cellProp.BGColor;
        cell.style.textAlign = cellProp.alignment;
        //Apply properties UI Props container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        BGColor.value = cellProp.BGColor;
        switch(alignValue){
            case "left"  :  leftAlign.style.backgroundColor = activeColorProp;
                            centreAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
            case "center" : leftAlign.style.backgroundColor = inactiveColorProp;
                            centreAlign.style.backgroundColor = activeColorProp;
                            rightAlign.style.backgroundColor = inactiveColorProp;
                            break;
            case "right" : leftAlign.style.backgroundColor = inactiveColorProp;
                            centreAlign.style.backgroundColor = inactiveColorProp;
                            rightAlign.style.backgroundColor = activeColorProp;
                            break;
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.value = cellProp.value;

    })
}

function getCellandCellProp(address){
    let[rid,cid] = decodeRidCidFromAddress(address);
    //Access cell and storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell,cellProp];
}

function decodeRidCidFromAddress(address){
    //address -> "A1"
    let rowId = Number(address.slice(1)-1);
    let colId = Number(address.charCodeAt(0)) - 65;
    return [rowId,colId];
}