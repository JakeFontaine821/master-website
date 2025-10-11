import AddStyle from '../js/Styles.js';

AddStyle(``);

export default class AboutPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('about-page');

        this.innerHTML = `About Page`;
    };
};
customElements.define('about-page', AboutPage);