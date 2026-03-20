import AddStyle from '../js/Styles.js';
import leaderboardEntry from './leaderboardEntry.js';
import './crosswordGamePage.js';

AddStyle(`
    .game-page-container{
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
    }

    .game-page-container > div{
        width: 70vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding-top: 50px;
    }

    .game-page-container .header{
        height: 100px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 40px;
        font-weight: 600;
        border-bottom: 1px solid var(--background-inverse);
    }

    .game-page-container .header .play-button-container{
        background-color: var(--secondary);
        border-radius: 6px;
        position: relative;
    }

    .game-page-container .header .play-button-container > .a{
        padding: 10px;
        border-radius: 5px;
        font-size: 25px;
        cursor: pointer;
        user-select: none;
        position: relative;
        top: 0;
        transition: top .2s;
        background-color: var(--background);
        border: 1px solid var(--background-inverse);
    }

    .game-page-container .header .play-button-container:hover > .a{
        top: -10px;
    }

    .game-page-container .leaderboard-row{
        display: flex;
        justify-content: center;
        gap: 30px;
        width: 100%;
    }

    .game-page-container .leaderboard-row .title{
        font-size: 20px;
        border-bottom: 1px solid var(--text);
    }

    .game-page-container .leaderboard-row > div{
        background-color: var(--primary);
        padding: 30px;
        border-radius: 30px;
        width: 350px;
    }
`);

export default class GamePageContainer extends HTMLElement{
    constructor(){
        super();

        this.classList.add('game-page-container');
        this.game = this.getAttribute('gameCode');
        this.gameTitle = this.getAttribute('gameTitle');

        this.innerHTML = `
            <div>
                <div class="header">
                    ${this.gameTitle}
                    <div class="play-button-container">
                        <div class='a'>Play</div>
                    </div>
                </div>
                <div class="leaderboard-row">
                    <div class="daily-leaderboard">
                        <div class="title">Today's Best Times</div>
                        <div class="outer">
                            <div class="inner"></div>
                        </div>
                    </div>
                    <div class="monthly-leaderboard">
                        <div class="title">
                            ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()]}'s
                            Best Times
                        </div>
                        <div class="outer">
                            <div class="inner"></div>
                        </div></div>
                    <div class="all-time-leaderboard">
                        <div class="title">All-Time Rankings</div>
                        <div class="outer">
                            <div class="inner"></div>
                        </div>
                    </div>
                </div>
                <div class="average-times-row">
                </div>
            </div>  
            <div class="hidden">
                <crossword-game-page game-title="${this.game}"></crossword-game-page>
            </div>
        `;

        // Set up play button to close leaderboard page and open game
        const playButton = this.querySelector('.play-button-container');
        const pages = this.children;
        playButton.addEventListener('click', () => {
            for(const page of pages){ page.classList.toggle('hidden'); }
        });

        this.loadGameTimes();
    };

    async loadGameTimes(){
        let leaderboardInfo;
        while (!leaderboardInfo?.success) {
            try{
                const url = `/games/times/get?gameTitle=${this.game}`;
                console.log(url)
                const response = await fetch(url);
                if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`); };

                leaderboardInfo = await response.json();
                if(!leaderboardInfo.success){ throw new Error(`Failed fetching from server: ${leaderboardInfo.error}`); }
            }
            catch (err){
                console.error('Api call failed, retrying in 5s...', err);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        console.log(leaderboardInfo)

        // Sort the entries for the day list
        const dailyboardInner = this.querySelector('.daily-leaderboard .inner');
        while(dailyboardInner.firstChild){ dailyboardInner.firstChild.remove(); }
        for(const [i, entry] of leaderboardInfo.today.entries()){
            const newEntry = new leaderboardEntry(entry, i+1);
            dailyboardInner.appendChild(newEntry);
        }

        const monthlyboardInner = this.querySelector('.monthly-leaderboard .inner');
        while(monthlyboardInner.firstChild){ monthlyboardInner.firstChild.remove(); }
        for(const [i, entry] of leaderboardInfo.monthly.entries()){
            const newEntry = new leaderboardEntry(entry, i+1, true);
            monthlyboardInner.appendChild(newEntry);
        }

        const alltimeboardInner = this.querySelector('.all-time-leaderboard .inner');
        while(alltimeboardInner.firstChild){ alltimeboardInner.firstChild.remove(); }
        for(const [i, entry] of leaderboardInfo.allTime.entries()){
            const newEntry = new leaderboardEntry(entry, i+1, true);
            alltimeboardInner.appendChild(newEntry);
        }
    };
};
customElements.define('game-page-container', GamePageContainer);