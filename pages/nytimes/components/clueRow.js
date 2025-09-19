import AddStyle from '../js/Styles.js';

AddStyle(`
    .clue-row{
        width: 100%;
        display: flex;
        align-items: center;
        padding: 4px 15px;
        gap: 6px;
        cursor: pointer;
        user-select: none;
    }

    .clue-row:hover{
        background-color: var(--hover);
    }

    .clue-row.highlighted{
        background-color: var(--hover);
    }

    .clue-row.kinda-highlighted{
        background-color: var(--highlight-background);
    }

    .clue-row > div{
        display: flex;
        align-self: center;
    }

    .clue-row .clue-label{
        justify-content: end;
    }

    .clue-row .clue{
        justify-content: start;
        flex: 1;
    }
`);

export default class ClueRow extends HTMLElement{
    constructor(clueObject){
        super();

        this.classList.add('clue-row');

        this.innerHTML = `
            <div class="clue-label">${clueObject.label ?? 0}</div>
            <div class="clue">${clueObject.text[0].plain ?? 'FAILED TO LOAD CLUE'}</div>
        `;

        this.direction = clueObject.direction.slice(0, 1) === 'A' ? 0 : 1;
        this.label = `${clueObject.label}${clueObject.direction.slice(0, 1)}`;
        this.text = clueObject.text[0].plain;
        this.cells = clueObject.cells;
    };
};
customElements.define('clue-row', ClueRow);