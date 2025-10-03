import AddStyle from '../js/Styles.js';
import leaderboardEntry from './leaderboardEntry.js';
import AverageTimeBar from './averageTimeBar.js';
import { formatSecondsToHMS } from '../js/utils.js';

AddStyle(`
    .mini-leaderboard-panel{
        background-color: var(--mini-theme);
    }

    .mini-leaderboard-panel .leaderboard-row{
        display: flex;
        justify-content: center;
        padding: 20px 0px;
        gap: 10px;
    }

    .mini-leaderboard-panel .leaderboard-row > div{
        display: flex;
        flex-direction: column;
        align-items; center;
        height: 400px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        border-radius: 10px
    }

    .mini-leaderboard-panel .leaderboard-row div b{
        display: flex;
        justify-content: center;
    }

    .mini-leaderboard-panel .leaderboard-outer{
        overflow-x: hidden;
        overflow-y: auto;
    }

    .mini-leaderboard-panel .avg-time-row{
        display: flex;
        justify-content: center;
    }

    .mini-leaderboard-panel .avg-time-row > div{
        display: flex;
        flex-direction: column;
    }

    .mini-leaderboard-panel .avg-time-row .flex-row{
        display: flex;
    }

    .mini-leaderboard-panel .avg-time-display{
        display: flex;
    }

    .mini-leaderboard-panel .left-side{
        position: relative;
    }

    .mini-leaderboard-panel .bar-graph{
        display: flex;
    }

    .mini-leaderboard-panel .hover-line{
        position: absolute;
        top: 0px;
        width: 900px;
        border-bottom: 1px dashed black;
        pointer-events: none;
    }

    .mini-leaderboard-panel .date-display{
        transform: translateX(${-83.484 + 30}px);
        width: 900px;
        white-space: nowrap;
    }

    .mini-leaderboard-panel .time-display{
        transform: translateY(-12px);
    }
`);

export default class MiniLeaderboardPanel extends HTMLElement{
    constructor(){
        super();

        this.classList.add('mini-leaderboard-panel');

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
        console.log(minileaderboardInfo)

        // Sort the entries for the day list
        const sortedTodayTimes = minileaderboardInfo.today.sort((a, b) => a.time - b.time);
        const dailyboardInner = this.querySelector('.daily-board .leaderboard-inner');
        while(dailyboardInner.firstChild){ dailyboardInner.firstChild.remove(); }
        for(const [i, entry] of sortedTodayTimes.entries()){
            const newEntry = new leaderboardEntry(entry, i+1);
            dailyboardInner.appendChild(newEntry);
        }

        const sortedBestTimes = minileaderboardInfo.allTime.sort((a, b) => a.placing - b.placing);
        const alltimeboardInner = this.querySelector('.all-time-board .leaderboard-inner');
        while(alltimeboardInner.firstChild){ alltimeboardInner.firstChild.remove(); }
        for(const [i, entry] of sortedBestTimes.entries()){
            const newEntry = new leaderboardEntry(entry, i+1, true);
            alltimeboardInner.appendChild(newEntry);
        }

        // averge times and such
        const timesArray = minileaderboardInfo.averageTimes.map((time, index) => Object.assign(time, { index })).reverse();
        const maxTime = Math.max(...minileaderboardInfo.averageTimes.map(timeObj => timeObj.averageTime));
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
            dateDisplay.innerHTML = new Date(Date.UTC(year, month - 1, day + 1)).toDateString();
            dateDisplay.style.paddingLeft = `${index * 30}px`;
        };

        for (const [i, timeObj] of timesArray.entries()) {
            const newBar = new AverageTimeBar(timeObj, maxTime);

            newBar.addEventListener('mouseover', () => setDateTime(timeObj.averageTime, timeObj.dateString, i));

            barGraph.appendChild(newBar);
        }

        const lastEntry = timesArray[timesArray.length-1];
        setDateTime(lastEntry.averageTime, lastEntry.dateString, timesArray.length-1);
    };
};
customElements.define('mini-leaderboard-panel', MiniLeaderboardPanel);