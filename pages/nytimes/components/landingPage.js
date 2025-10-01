import AddStyle from '../js/Styles.js';

import leaderboardEntry from './leaderboardEntry.js';

AddStyle(`
    .landing-page .header-row{
        font-size: 60px;
        font-weight: 600;    
    }

    .leaderboard-section{
        display: flex;
        justify-content: start;
        gap: 5px;
    }

    .leaderboard-section > *{
        flex: 1;
        display: flex;
        border-radius: 5px;
        padding: 5px 0px;
    }

    .mini-leaderboards-container > *{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .landing-page .leaderboard-outer{
        height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .landing-page .mini-leaderboards-container{
        background-color: var(--hover);
    }    
`);

export default class landingPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('landing-page', 'page');

        this.innerHTML = `
            <div class="page-container">
                <div class="header-row">Free NYTimes Games</div>
                <div class="leaderboard-section">
                    <div class="mini-leaderboards-container">
                        <div class="mini-daily-board">
                            <b>Today's Leaderboard</b>
                            <div class=" leaderboard-outer" style="border-right: 1px solid black">
                                <div class="leaderboard-inner"></div>
                            </div>
                        </div>

                        <div class="mini-leaderboard">
                            <b>All Time Leaderboard</b>
                            <div class="leaderboard-outer">
                                <div class="leaderboard-inner"></div>
                            </div>
                        </div>
                    </div>
                    <!-- Other leaderboarders here -->
                </div>
            </div>
        `;

        this.reloadLeaderboards(['mini']);
    };

    async reloadLeaderboards(games=[]){
        if(games.includes('mini')){
            let minileaderboardInfo;
            while (!minileaderboardInfo?.success) {
                try{
                    const response = await fetch('/nytimes/mini/times/get');
                    if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`); };

                    minileaderboardInfo = await response.json();
                    if(!minileaderboardInfo.success){ throw new Error(`Failed fetching from server: ${minileaderboardInfo.error}`); }
                }
                catch (err){
                    console.error('Api call failed, retrying in 5s...', err);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            // Sort the entries for the day list
            const sortedTodayTimes = minileaderboardInfo.today.sort((a, b) => a.time - b.time);
            const dailyboardInner = this.querySelector('.mini-daily-board .leaderboard-inner');
            while(dailyboardInner.firstChild){ dailyboardInner.firstChild.remove(); }
            for(const [i, entry] of sortedTodayTimes.entries()){
                const newEntry = new leaderboardEntry(entry, i+1);
                dailyboardInner.appendChild(newEntry);
            }

            const sortedBestTimes = minileaderboardInfo.allTime.sort((a, b) => a.placing - b.placing);
            const alltimeboardInner = this.querySelector('.mini-leaderboard .leaderboard-inner');
            while(alltimeboardInner.firstChild){ alltimeboardInner.firstChild.remove(); }
            for(const [i, entry] of sortedBestTimes.entries()){
                const newEntry = new leaderboardEntry(entry, i+1);
                alltimeboardInner.appendChild(newEntry);
            }
        }
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