import AddStyle from '../js/Styles.js';
import './leaderboardPanel.js';

AddStyle(`
    .landing-page .header-row{
        font-size: 60px;
        font-weight: 600;    
    }

    .landing-page .content-section{
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
    }

    .landing-page .tab-row{
        display: flex;
    }

    .landing-page .tab-row > div{
        width: 100px;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        cursor: pointer;
        user-select: none;
    }

    .landing-page .panel-container{
        width: 100vw;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .landing-page .panel-container > *{
        display: flex;
        flex-direction: column;
        flex: 1;
    }
`);

export default class landingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page', 'page');

        this.innerHTML = `
            <div class="page-container">
                <div class="header-row">Daily Games</div>
                <div class="content-section">
                    <div class="tab-row">
                        <div game-title="mini" style="background-color: var(--mini-theme);">MINI</div>
                        <div game-title="daily" style="background-color: var(--daily-theme);">DAILY</div>
                    </div>
                    <div class="panel-container">
                        <leaderboard-panel game-title="mini"></leaderboard-panel>
                        <leaderboard-panel game-title="daily" class="hidden"></leaderboard-panel>
                    </div>
                </div>
            </div>
        `;

        // setup the panel stuff
        for(const tab of this.querySelectorAll('.tab-row > div')){
            tab.addEventListener('click', () => {
                for(const panel of document.querySelectorAll('.leaderboard-panel')){
                    panel.classList.toggle('hidden', panel.getAttribute('game-title') !== tab.getAttribute('game-title'));
                }
            });
        }

        this.reloadLeaderboards(['all']);
    };

    async reloadLeaderboards(games=[]){
        if(games.includes('all') || games.includes('mini')){ this.querySelector('.leaderboard-panel[game-title="mini"]').loadPage(); }
        if(games.includes('all') || games.includes('daily')){ this.querySelector('.leaderboard-panel[game-title="daily"]').loadPage(); }
        // if(){} other games
    };

    show(){
        this.classList.remove('hidden');
    };

    hide(){
        this.classList.add('hidden');
    };
};
customElements.define('landing-page', landingPage);