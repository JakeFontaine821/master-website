import AddStyle from '../js/Styles.js';

AddStyle(``);

export default class LandingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page');

        this.innerHTML = `
            Hello
            <input/>
        `;
    };
};
customElements.define('landing-page', LandingPage);