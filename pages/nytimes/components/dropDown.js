import AddStyle from '../js/Styles.js';

AddStyle(`
    .drop-down{
        position: relative;
    }

    .drop-down *:not(.dropdown-container){
        width: 100px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid var(--shadow-background);
    }

    .drop-down *:not(.dropdown-container):hover{
        border-bottom: 1px solid black;
    }

    .drop-down .dropdown-container{
        position: absolute;
        top: 50px;
        background-color: var(--background-light);
        z-index: 999;
    }    
`);

export default class DropDown extends HTMLElement{
    constructor(){
        super();

        this.classList.add('drop-down');

        this.innerHTML = `
            <div class="header">${this.getAttribute('header')}</div>
            <div class="dropdown-container hidden"></div>
        `;

        const header = this.querySelector('.header');
        const dropdownContainer = this.querySelector('.dropdown-container');
        header.addEventListener('click', () => {
            dropdownContainer.classList.remove('hidden');

            window.addEventListener('pointerup', () => {
                dropdownContainer.classList.add('hidden');
            }, { once: true });
        });

        const optionsAttributes = this.getAttribute('options').split(',');
        for(const option of optionsAttributes){
            const newDiv = document.createElement('div');
            newDiv.classList.add('option');
            newDiv.innerHTML = option;

            const eventName = option.toLowerCase();
            newDiv.addEventListener('click', () => this.dispatchEvent(new Event(eventName)));

            dropdownContainer.appendChild(newDiv);
        }
    };
};
customElements.define('drop-down', DropDown);