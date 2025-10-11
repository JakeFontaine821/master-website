import AddStyle from '../js/Styles.js';

AddStyle(``);

export default class ProjectsPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('projects-page');

        this.innerHTML = `Projects Page`;
    };
};
customElements.define('projects-page', ProjectsPage);