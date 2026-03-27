import AddStyle from '../js/Styles.js';
import leaderboardEntry from './leaderboardEntry.js';
import AverageTimeBar from './averageTimeBar.js';
import './crosswordGamePage.js';
import { formatSecondsToHMS } from '../js/utils.js';

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
        flex: 1;
        max-height: 441px;
        display: flex;
        flex-direction: column;
    }

    .game-page-container .leaderboard-row div.outer{
        overflow-x: hidden;
        overflow-y: auto;
    }

    .game-page-container .average-times-row{
        width: 100%;
        height: 200px;
        max-height: 200px;
        background-color: var(--primary);
        border-radius: 30px;
        padding: 30px;

        display: flex;
        flex-direction: column;
        align-items: start;
    }

    .game-page-container .average-times-row > *{
        width: 100%;
    }
    /***********************************************************************/

    .game-page-container .average-times-row .graph-container{
        display: flex;
        flex: 1;
    }

    .game-page-container .graph-side{
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .game-page-container .graph-side > *{
        width: 100%;
    }

    .game-page-container .bar-graph{
        display: flex;
        flex: 1;
    }

    .game-page-container .hover-line{
        position: absolute;
        top: 0px;
        border-bottom: 1px dashed black;
        pointer-events: none;
    }

    .game-page-container .date-display{
        fill: var(--text);
        white-space: nowrap;
        display: flex;
        align-items: center;
    }

    .game-page-container .date-display > div{
        width: 200px;
        display: flex;
        align-items: end;
        justify-content: end;
    }

    .game-page-container .time-display{
        transform: translateY(-10px);
        width: 50px;
        text-align: center;
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
                    <b>Average Times</b>
                    <div class="graph-container">
                        <div class="graph-side">
                            <div class="bar-graph"></div>
                            <div class="hover-line"></div>
                            <div class="date-display">00-00-0000</div>
                        </div>
                        <div class="time-display">00:00</div>
                    </div>
                </div>
            </div>  
            <crossword-game-page class="hidden" game="${this.game}" game-title="${this.gameTitle}"></crossword-game-page>
        `;

        // Set up play button to close leaderboard page and open game
        const playButton = this.querySelector('.play-button-container');
        const gamePage = this.querySelector('.game-page');

        playButton.addEventListener('click', () => this.switchPages());
        gamePage.addEventListener('close', () => this.switchPages());

        gamePage.addEventListener('reload-leaderboards', () => this.loadGameTimes());

        this.loadGameTimes();
    };

    async loadGameTimes(){
        let leaderboardInfo;
        while (!leaderboardInfo?.success) {
            try{
                const url = `/games/times/get?gameTitle=${this.game}`;
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

        //********************************************************************************************* */

        const timesArray = leaderboardInfo.averageTimes.map((time, index) => Object.assign(time, { index })).reverse();
        const maxTime = Math.max(...leaderboardInfo.averageTimes.map(timeObj => timeObj.averageTime));
        const barGraph = this.querySelector('.bar-graph');

        // set the time and date from the hovered bar
        const hoverLine = this.querySelector('.hover-line');
        const dateDisplay = this.querySelector('.date-display');
        const timeDisplay = this.querySelector('.time-display');
        const setDateTime = (time, date, index) => {
            const distanceFromTop = (1 - (time / maxTime)) * 104;

            timeDisplay.innerHTML = formatSecondsToHMS(time);
            timeDisplay.style.paddingTop = `${distanceFromTop}px`;
            
            hoverLine.style.height = `${distanceFromTop}px`;

            const [year, month, day] = date.split("-").map(Number);
            dateDisplay.innerHTML = `
                <div>
                    ${new Date(Date.UTC(year, month - 1, day + 1)).toDateString()}
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M440-120v-567l-64 63-56-56 160-160 160 160-56 56-64-63v567h-80Z"/></svg>
                </div>
            `;
            dateDisplay.style.left = `${(index * 30) - 175}px`;
        };

        while(barGraph.firstChild){ barGraph.firstChild.remove(); }
        for (const [i, timeObj] of timesArray.entries()) {
            const newBar = new AverageTimeBar(timeObj, maxTime);

            newBar.addEventListener('mouseover', () => setDateTime(timeObj.averageTime, timeObj.dateString, i));

            barGraph.appendChild(newBar);
        }

        const lastEntry = timesArray[timesArray.length-1];
        setDateTime(lastEntry.averageTime, lastEntry.dateString, timesArray.length-1);
    };

    switchPages = () => {
        const pages = this.children;
        for(const page of pages){
            const hidden = page.classList.toggle('hidden');

            if(!page.hide || !page.show){ continue; }
            hidden ? page.hide() : page.show();
        }
    };

    show(){
        this.classList.remove('hidden');
    };

    hide(){
        this.classList.add('hidden');

        const gamePageHidden = this.querySelector('.game-page').classList.contains('hidden');
        if(!gamePageHidden){ this.switchPages(); }
    };
};
customElements.define('game-page-container', GamePageContainer);