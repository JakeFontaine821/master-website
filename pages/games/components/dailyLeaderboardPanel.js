import AddStyle from '../js/Styles.js';
import leaderboardEntry from './leaderboardEntry.js';
import AverageTimeBar from './averageTimeBar.js';
import { formatSecondsToHMS } from '../js/utils.js';

AddStyle(`
    .daily-leaderboard-panel{
        background-color: var(--daily-theme);
    }

    .daily-leaderboard-panel .leaderboard-row{
        display: flex;
        justify-content: center;
        padding: 20px 0px;
        gap: 10px;
    }

    .daily-leaderboard-panel .leaderboard-row > div{
        display: flex;
        flex-direction: column;
        align-items; center;
        height: 400px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        border-radius: 10px
    }

    .daily-leaderboard-panel .leaderboard-row div b{
        display: flex;
        justify-content: center;
    }

    .daily-leaderboard-panel .leaderboard-outer{
        overflow-x: hidden;
        overflow-y: auto;
    }

    .daily-leaderboard-panel .avg-time-row{
        display: flex;
        justify-content: center;
    }

    .daily-leaderboard-panel .avg-time-row > div{
        display: flex;
        flex-direction: column;
    }

    .daily-leaderboard-panel .avg-time-row .flex-row{
        display: flex;
    }

    .daily-leaderboard-panel .avg-time-display{
        display: flex;
    }

    .daily-leaderboard-panel .left-side{
        position: relative;
    }

    .daily-leaderboard-panel .bar-graph{
        display: flex;
    }

    .daily-leaderboard-panel .hover-line{
        position: absolute;
        top: 0px;
        width: 900px;
        border-bottom: 1px dashed black;
        pointer-events: none;
    }

    .daily-leaderboard-panel .date-display{
        fill: var(--text);
        width: 900px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        position: relative;
        height: 30px;
    }

    .daily-leaderboard-panel .date-display > div{
        width: 200px;
        display: flex;
        align-items center;
        justify-content: end;
        position: absolute;
    }

    .daily-leaderboard-panel .time-display{
        transform: translateY(-12px);
    }
`);

export default class DailyLeaderboardPanel extends HTMLElement{
    constructor(){
        super();

        this.classList.add('daily-leaderboard-panel', 'hidden');

        this.innerHTML = `
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
            <div class="avg-time-row">
                <div>
                    <b>Average Times</b>
                    <div class="avg-time-display">
                        <div class="left-side">
                            <div class="bar-graph"></div>
                            <div class="hover-line"></div>
                            <div class="date-display">00-00-0000</div>
                        </div>
                        <div class="time-display">00:00</div>
                    </div>
                </div>
            </div>
            <div class="filler" style="flex: 1;"> 
                More stats to come :)
            </div>
        `;
    };

    async loadPage(){
        let dailyleaderboardInfo;
        while (!dailyleaderboardInfo?.success) {
            try{
                const response = await fetch('/games/daily/times/get');
                if(!response.ok){ throw new Error(`HTTP error, Status: ${response.status}`); };

                dailyleaderboardInfo = await response.json();
                if(!dailyleaderboardInfo.success){ throw new Error(`Failed fetching from server: ${dailyleaderboardInfo.error}`); }
            }
            catch (err){
                console.error('Api call failed, retrying in 5s...', err);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        // Sort the entries for the day list
        const sortedTodayTimes = dailyleaderboardInfo.today.sort((a, b) => a.time - b.time);
        const dailyboardInner = this.querySelector('.daily-board .leaderboard-inner');
        while(dailyboardInner.firstChild){ dailyboardInner.firstChild.remove(); }
        for(const [i, entry] of sortedTodayTimes.entries()){
            const newEntry = new leaderboardEntry(entry, i+1);
            dailyboardInner.appendChild(newEntry);
        }

        const sortedBestTimes = dailyleaderboardInfo.allTime.sort((a, b) => a.placing - b.placing);
        const alltimeboardInner = this.querySelector('.all-time-board .leaderboard-inner');
        while(alltimeboardInner.firstChild){ alltimeboardInner.firstChild.remove(); }
        for(const [i, entry] of sortedBestTimes.entries()){
            const newEntry = new leaderboardEntry(entry, i+1, true);
            alltimeboardInner.appendChild(newEntry);
        }

        // averge times and such
        const timesArray = dailyleaderboardInfo.averageTimes.map((time, index) => Object.assign(time, { index })).reverse();
        const maxTime = Math.max(...dailyleaderboardInfo.averageTimes.map(timeObj => timeObj.averageTime));
        const barGraph = this.querySelector('.bar-graph');

        // set the time and date from the hovered bar
        const hoverLine = this.querySelector('.hover-line');
        const dateDisplay = this.querySelector('.date-display');
        const timeDisplay = this.querySelector('.time-display');
        const setDateTime = (time, date, index) => {
            const distanceFromTop = 150 - ((time / maxTime) * 150);
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
};
customElements.define('daily-leaderboard-panel', DailyLeaderboardPanel);