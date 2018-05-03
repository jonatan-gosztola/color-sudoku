/*
Gosztola Jonatán
VMO7ER
jonatan.gosztola@gmail.com
WEB2 - BEAD1 - Sudoku
*/

var timer;

/* Méret kiválasztását jeleníti meg */
function sizeOptionsDisplay() {
    var sizeOptions = document.getElementsByName('size');

    for (var i = 0; i < sizeOptions.length; ++i) {
        if (sizeOptions[i].checked) {
            var size = sizeOptions[i].value;
            $('#hard' + size).style.display = 'initial';
            $('#easy' + size).style.display = 'initial';
            sizeOptions[i].parentNode.style.border = '3px solid black';
        } else {
            var size = sizeOptions[i].value;
            sizeOptions[i].parentNode.style.border = 'none';

            $('#hard' + size).style.display = 'none';
            $('#easy' + size).style.display = 'none';
        }
    }
}

/* Nehézség kiválasztását jeleníti meg */
function difficultOptionDisplay() {
    var difficultOptions = document.getElementsByName('difficult');

    for (var i = 0; i < difficultOptions.length; ++i) {
        if (difficultOptions[i].checked) {
            difficultOptions[i].parentNode.style.border = '3px solid black';
        } else {
            difficultOptions[i].parentNode.style.border = 'none';
        }
    }

}

function generateTable(size) {
    var inner = '';
    for (var i = 0; i < size; ++i){
        inner += '<tr>';
        for (var j = 0; j < size; ++j){
            inner += '<td></td>';
        }
        inner += '</tr>';
    }
    return inner;
}

function renderModel(Sudoku, table) {
    for (var i = 0; i < Sudoku.size; ++i) {
        for (var j = 0; j < Sudoku.size; ++j) {
            if (Sudoku.model[i][j] == '') {
                table.rows[i].cells[j].classList.add('clickable');
                table.rows[i].cells[j].style.backgroundColor = 'white';
            } else {
                table.rows[i].cells[j].style.backgroundColor = Sudoku.model[i][j];
            }
        }
    }
    if (Sudoku.size == 3) {
        $('#blue').style.display = 'none';
    } else {
        $('#blue').style.display = 'block';
    }
    colorFooter();
}

function colorFooter() {
    $('#red').style.backgroundColor = 'red';
    $('#green').style.backgroundColor = 'green';
    $('#blue').style.backgroundColor = 'blue';
    $('#yellow').style.backgroundColor = 'yellow';
}


function footerDisplay(display) {
    var footer = $('#flex-footer');
    var style = window.getComputedStyle($('#flex-footer'));
    if (display) {
        if (style.bottom == '-300px'){
            var pos = -300;
            var tim = setInterval(frame, 5);
            
            function frame() {
                if ($('#flex-footer').style.bottom == '0px' || pos >= 0) {
                    clearInterval(tim);
                    $('#flex-footer').style.bottom = '0px';
                } else {
                    pos += 4;
                    $('#flex-footer').style.bottom = pos + 'px'; 
                }
            }
        }
    } else {
        if (style.bottom == '0px') {
            
            var pos = 0;
            var tim = setInterval(frame, 5);

            function frame() {
                if (footer.style.bottom == '-300px' || pos <= -300) {
                    clearInterval(tim);
                    $('#flex-footer').style.bottom = '-300px'; 
                } else {
                    pos -= 4;
                    $('#flex-footer').style.bottom = pos + 'px';
                }
            }
            
        }
    }
}

function overlayOn(){
    $('#overlay').style.display = 'block';
    $('#win').style.display = 'block';
    timer = setTimeout(overlayOff, 15000);
}

function overlayOff(){
    $('#overlay').style.display = 'none';
    $('#win').style.display = 'none';
    newGameView(false);
    clearTimeout(timer);

}

function newGameView(onlyStartButton){
    $('#table').innerHTML = '';

    $('#home').style.display = 'block';
    if(onlyStartButton){
        $('#choseOptions').style.display = 'none';
        $('.startButton').style.display = 'block';
    } else {
        $('#choseOptions').style.display = 'flex';
        $('.startButton').style.display = 'block';
    }
}

function shakeColor(color){
    var colorDiv = $('#'+color);
    var tim = setInterval(frame, 200);
    var i = 0;
    function frame(){
        if ( i >= 4) {
            clearInterval(tim);
            colorDiv.style.backgroundColor = color;
        } else {
            if (colorDiv.style.backgroundColor == color){
                colorDiv.style.backgroundColor = 'black';
            } else {
                colorDiv.style.backgroundColor = color;
            }

            i++;
        }
    }
}