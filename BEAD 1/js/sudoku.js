function $(element) {
    return document.querySelector(element);
}

function $$(element) {
    return document.querySelectorAll(element);
}

function kezelotRegisztral(elem, tipus, kezelo) {
    if (elem.addEventListener) {
        elem.addEventListener(tipus, kezelo, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + tipus, function () {
            return kezelo.call(elem, window.event);
        });
    } else {
        elem['on' + tipus] = kezelo;
    }
}

function delegate(parentSelector, type, selector, fn) {
    function delegatedFunction(e) {
        var target = e.target;

        while (target && !target.matches(selector)) {
            if (target === parent) {
                return;
            }
            target = target.parentNode;
        }
        return fn.call(target, e);
    }
    var parent = $(parentSelector);
    kezelotRegisztral(parent, type, delegatedFunction)
}

function init() {
    home();
    sizeOptionsDisplay();
    difficultOptionDisplay()
    delegate('#table', 'pointerup', 'tr > td', cellClicked);
    delegate('#flex-footer', 'pointerup', 'div', choseColor);
    kezelotRegisztral($('#startButton'),'pointerup',startGame);
    kezelotRegisztral($('#overlay'),'pointerup',overlayOff);
    kezelotRegisztral($('#win'), 'pointerup', overlayOff);
    delegate('header','pointerup','i',home);
    delegate('.choseSize','pointerdown','.col',selectSize);
    delegate('.choseDifficult','pointerdown','.col',selectDifficult);
}

/* array tömb random rendezése */
function shuffle(array) {
    var counter = array.length;
    while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
        --counter;

        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

/* Méret kiválasztását kezeli a kezdőlap beállítófelületén */
function selectSize(e){
    var selected = e.target;
    var col;
    if (selected.classList.contains('col')){
        col = selected;
    } else {
        col = selected.parentNode;
    }
    col.style.border = '3px solid black';
    col.firstElementChild.checked = true;
    
    sizeOptionsDisplay();
}

/* Nehézség kiválasztását kezeli a kezdőlap beállítófelületén */
function selectDifficult(e){
    var selected = e.target;
    var col;

    if (selected.classList.contains('col')) {
        col = selected;
    } else {
        col = selected.parentNode;
    }
    col.firstElementChild.checked = true;
    difficultOptionDisplay();
}

/* Kiválasztott sor, oszlop */
var selectedRow;
var selectedCol;

let Sudokumodell; 
var table;  /* html table tag - játék view */
var onlyTheButton; /* Logikai */

function render_Model(){
    renderModel(Sudokumodell,table);
}

/* Kezdőlapot jeleníti meg */
function home(){
    newGameView(true);
    onlyTheButton = true;
    footerDisplay(false);
}

function startGame(){
    if (onlyTheButton) {
        newGameView(false);
        onlyTheButton = false;
        return;
    }
    var sizeOptions = document.getElementsByName('size');
    for (i = 0; i < sizeOptions.length; ++i){
        if (sizeOptions[i].checked){
            var size = sizeOptions[i].value;
        }
    }
    var difficultOptions = document.getElementsByName('difficult');
    for (i = 0; i < difficultOptions.length; ++i) {
        if (difficultOptions[i].checked) {
            var difficult = difficultOptions[i].value;
        }
    }

    var cl = 'size-' + size;
    
    table = $('#table');
    table.classList.remove('size-4');
    table.classList.remove('size-3');
    table.classList.add(cl);
    table.innerHTML = generateTable(size);
    
    Sudokumodell = new Sudoku(size, difficult);
    Sudokumodell.generateModel();

    $('#home').style.display = 'none';
    renderModel(Sudokumodell, table);
}

/* Cellára kattintást kezeli */
function cellClicked(e) {
    var td = e.target;
    selectedCol = td.cellIndex;
    var tr = td.parentNode;
    selectedRow = tr.sectionRowIndex;
    
    Sudokumodell.selectedCell(selectedRow, selectedCol);
}

/* Footerből színt választ */
function choseColor(e){
    var color = e.target.id;

    Sudokumodell.colorToCell(color,selectedRow,selectedCol);

    if (Sudokumodell.checkWin()){
        overlayOn();
        footerDisplay(false);
    }
}


kezelotRegisztral(window, 'load', init);