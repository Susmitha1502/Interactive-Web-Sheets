for(let i = 0;i < rows;i++){
    for(let j = 0;j < cols;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell,cellProp] = getCellandCellProp(address);
            let enteredData = activeCell.innerText;
            if(enteredData === cellProp.value)
                return;
            cellProp.value = enteredData;
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula){
        let address = addressBar.value;
        let [cell,cellProp] = getCellandCellProp(address);
        //If change in formula, break old P-C relation, evaluate new formula, add new P - C relation
        if(inputFormula !== cellProp.formula)
            removeChildFromParent(cellProp.formula);
        addChildToGraphComponent(inputFormula,address);
        let isCyclic = isGraphCyclic();
        if(isCyclic){
            //alert("Your formula is cyclic.");
            let cycleResponse = confirm("Your formula is cyclic.Do you want to trace your path?");
            while(cycleResponse === true){
                await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);
                response = confirm("Your formula is cyclic.Do you want to trace your path?");
            }
            removeChildFromGraphComponent(inputFormula,address);
            return;
        }
        let evaluatedValue = evaluateFormula(inputFormula);

        setCellUIandCellProp(evaluatedValue,inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula,childAddress){
    let [crid,ccid] = decodeRidCidFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [prid,pcid] = decodeRidCidFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
    return [crid,ccid];
}

function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid] = decodeRidCidFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [prid,pcid] = decodeRidCidFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
    return [crid,ccid];
}

function updateChildrenCells(parentAddress){
    let [parentCell,parentCellProp] = getCellandCellProp(parentAddress);
    let children = parentCellProp.children;
    for(let idx = 0;idx < children.length; idx++){
        let childAddress = children[idx];
        let [childCell, childCellProp] = getCellandCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIandCellProp(evaluatedValue,childFormula,childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let idx = 0; idx < encodedFormula.length; idx++){
        let asciiValue = encodedFormula[idx].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let[parentCell,parentCellProp] = getCellandCellProp(encodedFormula[idx]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let idx = 0; idx < encodedFormula.length; idx++){
        let asciiValue = encodedFormula[idx].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let[parentCell,parentCellProp] = getCellandCellProp(encodedFormula[idx]);
            let index = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(index , 1); 
        }
    }
}

function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let idx = 0; idx < encodedFormula.length; idx++){
        let asciiValue = encodedFormula[idx].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let[cell,cellProp] = getCellandCellProp(encodedFormula[idx]);
            encodedFormula[idx] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIandCellProp(evaluatedValue, formula, address){
    let [cell,cellProp] = getCellandCellProp(address);
    cell.innerText = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}