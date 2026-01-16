import AddStyle from '../js/Styles.js';

AddStyle(`
    .landing-page{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .landing-page .content-container{
        display: flex;
        flex-direction: column;
    }

    .landing-page .header{
        font-size: 40px;
    }
`);

export default class LandingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page');

        this.innerHTML = `
            <div class="content-container">
                <div class="header">Pool Game</div>
                <input class="name-input" placeholder="Name"/>
                <button class="host-game-button">Host New Game</button>
            </div>
            <div class="hosted-games-list">

            </div>
        `;

        const nameInput = this.querySelector('.name-input');
        const hostGameButton = this.querySelector('.host-game-button');
        hostGameButton.addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('host'), {name: nameInput.value})));
    };
};
customElements.define('landing-page', LandingPage);