/*
Gosztola Jonatán
VMO7ER
jonatan.gosztola@gmail.com
WEB2 - BEAD1 - Sudoku
*/

/* Sudoku modell osztálya */ 
class Sudoku {
    constructor(size,difficult){
        this.size = size;
        if (size == 3){
            if (difficult == 1) {
                this.emptyCells = 3;
            } else {
                this.emptyCells = 1;
            }
            this.colors = ['red', 'green', 'yellow'];
        }
        if (size == 4){
            if ( difficult == 1) {
                this.emptyCells = 5;
            } else {
                this.emptyCells = 3;
            }
            this.colors = ['red', 'green', 'yellow', 'blue'];
        }
        this.model = [];
        this.clickable = [];
        this.fullEmpty = [];
    }

    /* random modell-t generál */
    generateModel(){
        for (var i = 0; i < this.size; ++i) {
            this.model[i] = [];
            for (var j = 0; j < this.size; ++j) {
                this.model[i][j] = '';
            }
        }

        /* generating MODEL matrix */
        for (var i = 0; i < this.size; ++i) {
            var ok = true;
            do {
                shuffle(this.colors);
                for (var j = 0; j < this.size; ++j) {
                    this.model[i][j] = this.colors[j];
                }
                ok = true;
                for (var j = 0; j < this.model[i].length; ++j) {
                    ok = ok && this.checkCol2(j, this.model) && this.checkBlock2(i, j, this.model);
                }
            } while (!ok);
        }

        /* creating the FULLEMPTY matrix */
        for (var i = 0; i < this.size; ++i) {
            this.fullEmpty[i] = [];
            for (var j = 0; j < this.size; ++j) {
                this.fullEmpty[i][j] = 'full';
            }
        }

        /* creating the CLICKABLE matrix */
        for (var i = 0; i < this.size; ++i) {
            this.clickable[i] = [];
            for (var j = 0; j < this.size; ++j) {
                this.clickable[i][j] = false;
            }
        }
        
        this.deleteRandom(this.emptyCells, this.size);
    }

    /* kitöröl x db mezőt random helyekről */
    deleteRandom(x) {
        for (var i = 0; i < x; ++i) {
            do {
                var randRow = Math.floor(Math.random() * this.size);
                var randCol = Math.floor(Math.random() * this.size);
            } while (this.model[randRow][randCol] == '')
            this.model[randRow][randCol] = '';
            this.fullEmpty[randRow][randCol] = 'empty';
            this.clickable[randRow][randCol] = true;
        }
    }

    /* Kiválasztott mezőt kezeli */
    selectedCell(i,j){
        if (this.clickable[i][j]) {
            if (this.fullEmpty[i][j] == 'full') {
                this.model[i][j] = '';
                this.fullEmpty[i][j] = 'empty';
                render_Model();
            } else {
                footerDisplay(true);
            }
        } else {
            footerDisplay(false);
        }
    }

    /* Kiválaszott színt próbál berakni a kiválasztott mezőbe */
    colorToCell(color,row,col){
        if (this.checkBlock(row, col, color)
            && this.checkCol(col, color)
            && this.checkRow(row, color))
        {
            this.model[row][col] = color;
            this.fullEmpty[row][col] = 'full';
            
            render_Model();
        } else {
            shakeColor(color);
        }

    }
    
/* ELLENŐRZŐ FÜGGVÉNYEK */

    /* Ellenőrzi, hogy vége-e a játéknak */
    checkWin() {
        var ok = true;
        var i = 0;
        while (ok && i < this.fullEmpty.length) {
            var j = 0;
            while (ok && j < this.fullEmpty[i].length) {
                ok = ok && (this.fullEmpty[i][j] == 'full');
                ++j;
            }
            ++i;
        }
        return ok;
    }

    /* Ellenőrzi, hogy a kiválasztott szín már szerepel-e az i. sorban */
    /* IGAZ: ha még nincs benne */
    checkRow(i, szin) {
        var ok = true;
        var j = 0;
        while (j < this.model[i].length && ok) {
            ok = ok && (this.model[i][j] != szin);
            j++;
        }
        return ok;
}

    /* Ellenőrzi, hogy a modell i. sora helye-e => IGAZ */
    checkRow2(i) {
        var colors = {
            red: 0,
            green: 0,
            blue: 0,
            yellow: 0,
        }

        for (var j = 0; j < this.model[i].length; ++j) {
            if (this.model[i][j] != '') {
                colors[this.model[i][j]] += 1;
            }
        }

        var ok = true;
        for (var key in colors) {
            ok = ok && (colors[key] < 2);
        }
        return ok;
    }

    /* Ellenőrzi, hogy a szin még nincsen-e benne az i-edik oszlopban */
    /* IGAZ: ha még nincs benne */
    checkCol(i, szin) {
        var ok = true;
        var j = 0;
        while (j < this.model.length && ok) {
            ok = ok && this.model[j][i] != szin;
            j++;
        }
        return ok;
    }

    /* Ellenőrzi, hogy a modell k. oszlopa helyes-e => IGAZ */
    checkCol2(k) {
        var colors = {
            red: 0,
            green: 0,
            blue: 0,
            yellow: 0,
        }

        for (var i = 0; i < this.model.length; ++i) {
            if (this.model[i][k] != '') {
                colors[this.model[i][k]] += 1;
            }
        }

        var ok = true;
        for (var key in colors) {
            ok = ok && (colors[key] < 2);
        }
        return ok;
    }
    
    /* Ellenőrzi, hogy a kiválasztott szín a kiválasztott hely blokkjába illik-e => IGAZ */
    /* i,j a jövendőbeli beszúrás helye */
    checkBlock(i, j, szin) {
        if (this.size == 3) {
            return true;
        }
        var startRow;
        var startCol;
        if (i < 2)
            startRow = 0;
        if (i >= 2)
            startRow = 2;
        if (j < 2) startCol = 0;
        if (j >= 2) startCol = 2;

        var ok = true;
        for (var i = startRow; i < (startRow + 2); ++i) {
            for (var j = startCol; j < (startCol + 2); ++j) {
                ok = ok && this.model[i][j] != szin;
            }
        }
        return ok;
        
    }


    /* Ellenőrzi, hogy az i. sor j. oszlopjának blokkja helyes-e => IGAZ */
    checkBlock2(i, j) {
        if (this.model.length == 3) {
            return true;
        }

        var colors = {
            red: 0,
            green: 0,
            blue: 0,
            yellow: 0,
        }
        var startRow;
        var startCol;
        if (i < 2) {
            startRow = 0;
        } else {
            startRow = 2;
        }
        if (j < 2) {
            startCol = 0;
        } else {
            startCol = 2;
        }

        for (var i = startRow; i < (startRow + 2); ++i) {
            for (var j = startCol; j < (startCol + 2); ++j) {
                if (this.model[i][j] != '') {
                    colors[this.model[i][j]] += 1;
                }
            }
        }

        var ok = true;
        for ( var key in colors) {
            ok = ok && colors[key] < 2;
        }
        return ok;
    }
}