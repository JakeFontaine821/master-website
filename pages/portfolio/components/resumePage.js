import AddStyle from '../js/Styles.js';

AddStyle(``);

export default class ResumePage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('resume-page');

        this.innerHTML = `Resume Page`;
    };
};
customElements.define('resume-page', ResumePage);