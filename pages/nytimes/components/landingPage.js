import AddStyle from '../js/Styles.js';

import './miniLeaderboardPanel.js';
import './dailyLeaderboardPanel.js';

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
                        <div panel="mini-leaderboard-panel" style="background-color: var(--mini-theme);">MINI</div>
                        <div panel="daily-leaderboard-panel" style="background-color: var(--daily-theme);">DAILY</div>
                    </div>
                    <div class="panel-container">
                        <mini-leaderboard-panel></mini-leaderboard-panel>
                        <daily-leaderboard-panel></daily-leaderboard-panel>
                    </div>
                </div>
            </div>
        `;

        // setup the panel stuff
        for(const tab of this.querySelectorAll('.tab-row > div')){
            tab.addEventListener('click', () => {
                for(const panel of document.querySelectorAll('.panel-container > *')){
                    panel.classList.toggle('hidden', !panel.classList.contains(tab.getAttribute('panel')));
                }
            });
        }

        this.reloadLeaderboards(['all']);
    };

    async reloadLeaderboards(games=[]){
        if(games.includes('all') || games.includes('mini')){ this.querySelector('.mini-leaderboard-panel').loadPage(); }
        if(games.includes('all') || games.includes('daily')){ this.querySelector('.daily-leaderboard-panel').loadPage(); }
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