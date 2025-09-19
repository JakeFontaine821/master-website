import AddStyle from '/pages/nytimes/js/Styles.js';

AddStyle(`
    .page-root{
        height: 100vh;
        width: 100vw;
        background-color: gray;
    }
`);

export default class PageRoot extends HTMLElement{
    constructor(){
        super();

        this.classList.add('page-root');

        this.innerHTML = 'Hello';
    };
};
customElements.define('page-root', PageRoot);