import AddStyle from '../js/Styles.js';

AddStyle(`
    .grid-row{
        display: flex;
    }

    .grid-cell{
        aspect-ratio: 1;
        position: relative;
        border: 1px solid gray;
        cursor: pointer;
    }

    .grid-cell.blank{
        background-color: black;
        border: 1px solid black;
    }

    .grid-cell.highlighted{
        background-color: var(--hover);
    }

    .grid-cell.selected{
        background-color: #f0df24;
    }

    .grid-cell .label{
        position: absolute;
        left: 2px;
    }

    .grid-cell .value{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: end;
        user-select: none;
        font-weight: 600;
    }

    .grid-cell.checked-correct .value{
        color: var(--correct);
    }

    .grid-cell.checked-incorrect .value{
        color: var(--incorrect);
    }

    .grid-cell .revealed-flag{
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .grid-cell .revealed-flag svg{
        height: 15px;
        width: 15px;
    }
`);

export default class GridCell extends HTMLElement{
    constructor(cellObject){
        super();

        this.classList.add('grid-cell');
        this.classList.toggle('blank', !cellObject.type);

        this.innerHTML = cellObject.type ? `
            <div class="label">${cellObject.label ?? ''}</div>
            <div class="value"></div>
            <div class="revealed-flag hidden"><svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="95" fill="#33c"/><circle cx="100" cy="100" r="50" fill="#000"/></svg></div>
        ` : '';
        
        if(cellObject.type){
            this.answer = cellObject.answer;
            this.clues = cellObject.clues;
        }
    };

    get value(){
        return this.querySelector('.value').innerHTML || '';
    };

    set value(newValue){
        if(!this.classList.contains('checked-correct')){ this.querySelector('.value').innerHTML = newValue; }
        this.dispatchEvent(new Event('input'));
        this.classList.remove('checked-incorrect');
    };

    setTextSize(dimension){
        if(this.classList.contains('blank')){ return; }

        const labelSize = dimension * (1 / 4);
        this.querySelector('.label').style.fontSize = `${labelSize}px`;

        const valueSize = dimension * (3 / 5);
        this.querySelector('.value').style.fontSize = `${valueSize}px`;
    };

    clear(emit=false){
        if(this.value && !this.classList.contains('checked-correct')){
            this.querySelector('.value').innerHTML = '';

            this.classList.remove('checked-correct');
            this.classList.remove('checked-incorrect');
            return;
        }
        
        if(emit){ this.dispatchEvent(new Event('backspace')); }
    };

    checkAnswer(){
        return this.classList.contains('blank') ? true : this.value === this.answer;
    };

    userCheck(){
        if(this.classList.contains('blank') || !this.value){ return; }

        const correct = this.checkAnswer();
        this.classList.toggle('checked-correct', correct);
        this.classList.toggle('checked-incorrect', !correct);
    };

    reveal(){
        if(this.classList.contains('blank')){ return; }

        this.querySelector('.revealed-flag').classList.remove('hidden');
        this.classList.add('checked-correct');
        this.querySelector('.value').innerHTML = this.answer;
        this.dispatchEvent(new Event('input'));
    };
};
customElements.define('grid-cell', GridCell);