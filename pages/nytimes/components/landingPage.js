import AddStyle from '../js/Styles.js';

import leaderboardEntry from './leaderboardEntry.js';
import { getEasternDateString, formatSecondsToHMS } from '../js/utils.js';
import { displayAverageTimes } from '../js/averageTimeCanvas.js';

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

    .landing-page .panel-container > div{
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .landing-page .leaderboard-row{
        display: flex;
        justify-content: center;
        padding: 20px 0px;
        gap: 10px;
    }

    .landing-page .leaderboard-row > div{
        display: flex;
        flex-direction: column;
        align-items; center;
        height: 400px;
        width: 300px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        border-radius: 10px
    }

    .landing-page .leaderboard-row div b{
        display: flex;
        justify-content: center;
    }

    .landing-page .leaderboard-outer{
        overflow-x: hidden;
        overflow-y: auto;
    }

    .landing-page .avg-time-row{
        display: flex;
        justify-content: center;
    }

    .landing-page .avg-time-row > div{
        display: flex;
        flex-direction: column;
    }

    .landing-page .avg-time-row .flex-row{
        display: flex;
    }

    .landing-page .avg-time-row canvas{
        border: 1px solid black;
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
                        <div panel="mini-panel" style="background-color: var(--mini-theme);">MINI</div>
                    </div>
                    <div class="panel-container">
                        <div class="mini-panel" style="background-color: var(--mini-theme)">
                            <div class="leaderboard-row">
                                <div class="daily-board">
                                    <b>Today's Leaderboard</b>
                                    <div class="leaderboard-outer">
                                        <div class="leaderboard-inner"></div>
                                    </div>
                                </div>
                                <div class="all-time-board">
                                    <b>All Time Leaderboard</b>
                                    <div class="leaderboard-outer">
                                        <div class="leaderboard-inner"></div>
                                    </div>
                                </div>
                            </div>
                            <!--<div class="avg-time-row">
                                <div>
                                    <b>Average Times from the last 30 days</b>
                                    <div class="flex-row">
                                        <canvas width="900px" height="125px"></canvas>
                                        <div class="avg-time-display">00:00</div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>-->
                            <div class="filler" style="flex: 1;">
                                More stats to come :)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // setup the panel stuff
        for(const tab of this.querySelectorAll('.tab-row > div')){
            tab.addEventListener('click', () => {
                for(const panel of document.querySelectorAll('.panel-container > div')){
                    panel.classList.toggle('hidden', !panel.classList.contains(tab.getAttribute('panel')));
                }
            });
        }

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
            const dailyboardInner = this.querySelector('.mini-panel .daily-board .leaderboard-inner');
            while(dailyboardInner.firstChild){ dailyboardInner.firstChild.remove(); }
            for(const [i, entry] of sortedTodayTimes.entries()){
                const newEntry = new leaderboardEntry(entry, i+1);
                dailyboardInner.appendChild(newEntry);
            }

            const sortedBestTimes = minileaderboardInfo.allTime.sort((a, b) => a.placing - b.placing);
            const alltimeboardInner = this.querySelector('.mini-panel .all-time-board .leaderboard-inner');
            while(alltimeboardInner.firstChild){ alltimeboardInner.firstChild.remove(); }
            for(const [i, entry] of sortedBestTimes.entries()){
                const newEntry = new leaderboardEntry(entry, i+1);
                alltimeboardInner.appendChild(newEntry);
            }

            // averge times and such
            // const maxTimeFromAvg = Math.max(...minileaderboardInfo.averageTimes);
            // const avgTimeDisplay = this.querySelector('.mini-panel .avg-time-display');
            // avgTimeDisplay.innerHTML = formatSecondsToHMS(maxTimeFromAvg);

            // const miniCanvas = this.querySelector('.mini-panel canvas');
            // displayAverageTimes(miniCanvas, minileaderboardInfo.averageTimes);
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