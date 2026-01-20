import AddStyle from '../js/Styles.js';

AddStyle(`
    .landing-page{
        width: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .landing-page .content-container{
        
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
            <div class="header">Pool Game</div>
            <input class="name-input" placeholder="Name"/>

            <div class="content-container">
                <button class="host-game-button">Host New Game</button>
                <button class="join-game-button">Join Game</button>
            </div>
        `;

        const nameInput = this.querySelector('.name-input');
        const hostGameButton = this.querySelector('.host-game-button');
        hostGameButton.addEventListener('click', () => this.dispatchEvent(Object.assign(new Event('host'), {name: nameInput.value})));
    };
};
customElements.define('landing-page', LandingPage);