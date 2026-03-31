import AddStyle from '../js/Styles.js';

AddStyle(`
    .average-time-bar{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .average-time-bar .bar{
        flex: 1;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .average-time-bar .bar .fill{
        flex: 1;
    }

    .average-time-bar .bar .background{
        background-color: var(--secondary);
        box-shadow: 1px 1px 4px #555 inset;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
    }

    .average-time-bar .arrow{
        height: 20px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        transition: .1s;
        opacity: 0;
    }

    .average-time-bar .date{
        height: 20px;
        width: 150px;
        position: absolute;
        right: calc(50% + 5px);
        bottom: 0;
        transition: .1s;
        opacity: 0;
        display: flex;
        justify-content: end;
        align-items: end;
    }

    .average-time-bar .bar:hover .background{
        background-color: var(--accent);
        box-shadow: 2px 2px 3px #555;
    }

    .average-time-bar.selected .date, .average-time-bar.selected .arrow{
        opacity: 1;
    }
`);

export default class AverageTimeBar extends HTMLElement{
    constructor(averageTimeObj, maxTime){
        super();

        this.classList.add('average-time-bar');

        this.innerHTML = `
            <div class="bar">
                <div class="fill"></div>
                <div class="background"></div>
            </div>
            <div class="arrow">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" viewBox="0 -960 960 960"><path d="M440-120v-567l-64 63-56-56 160-160 160 160-56 56-64-63v567h-80Z"/></svg>
            </div>
            <div class="date"></div>
        `;

        this.time = averageTimeObj.averageTime;
        this.date = averageTimeObj.dateString;

        this.querySelector('.background').style.height = `${(this.time / maxTime) * 100}%`;

        const dateElement = this.querySelector('.date');
        const [year, month, day] = this.date.split("-").map(Number);
        dateElement.innerHTML = `${new Date(Date.UTC(year, month - 1, day + 1)).toDateString()}`;

        this.querySelector('.bar').addEventListener('mouseenter', () => this.dispatchEvent(new Event('select')));
    };
};
customElements.define('average-time-bar', AverageTimeBar);