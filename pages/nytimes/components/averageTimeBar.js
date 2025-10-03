import AddStyle from '../js/Styles.js';

AddStyle(`
    .average-time-bar{
        height: 150px;
        width: 30px;
        display: flex;
        flex-direction: column;
    }

    .average-time-bar .fill{
        flex: 1;
    }

    .average-time-bar .bar{
        background-color: var(--mini-secondary);
        box-shadow: 1px 1px 4px #555 inset;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
    }

    .average-time-bar:hover .bar{
        background-color: var(--mini-primary);
        box-shadow: 2px 2px 3px #555;
    }
`);

export default class AverageTimeBar extends HTMLElement{
    constructor(averageTimeObj, maxTime){
        super();

        this.classList.add('average-time-bar');

        this.innerHTML = `
            <div class="fill"></div>
            <div class="bar"></div>
        `;

        this.querySelector('.bar').style.height = `${(averageTimeObj.averageTime / maxTime) * 150}px`;
    };
};
customElements.define('average-time-bar', AverageTimeBar);