import AddStyle from '../js/Styles.js';
import { getEasternDateString, formatSecondsToHMS } from '../js/utils.js';

AddStyle(`
    .leaderboard-entry{
        display: flex;
        align-items: center;
        width: 350px;
        font-weight: 500;
        gap: 5px;
        padding: 2px 10px;
    }

    .leaderboard-entry > div{
        display: flex;
        align-items: center;
    }

    .leaderboard-entry .place-container{
        height: 30px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .leaderboard-entry .name{
        flex: 1;
    }

    .leaderboard-entry .milliseconds{
        font-size: 10px;
        height: 20px;
        display: flex;
        align-items: end;
    }

    .leaderboard-entry .right {
        flex: 1.75;
        display: flex;
        justify-content: end;
    }

    .leaderboard-entry svg{
        height: 30px;
        width: 30px;
    }
`);

export default class leaderboardEntry extends HTMLElement{
    constructor(entryData, place=0, showDate=false){
        super();

        this.classList.add('leaderboard-entry');

        const [year, month, day] = entryData.dateString.split("-").map(Number);
        const parsedDate = new Date(Date.UTC(year, month - 1, day + 1));

        const [_, seconds, milliseconds] = /^([\d]+).?([\d]*)$/.exec(entryData.time);

        this.innerHTML = `
            ${place === 1 ? '<div class="place-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#7db8f7" stroke="#000" stroke-width="4" stroke-linejoin="round" d="m40 63-18 38 18-5 10 18 14-37zm44 1 16 37-14-2-10 15-12-37z"/><circle cx="64" cy="48" r="36" fill="gold" stroke="#000" stroke-width="4"/><circle cx="64" cy="48" r="24" fill="#FFED8A" stroke="#000" stroke-width="4"/><text x="63" y="64" font-size="45" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold">1</text></svg></div>' : ''}
            ${place === 2 ? '<div class="place-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#7db8f7" stroke="#000" stroke-width="4" stroke-linejoin="round" d="m40 63-18 38 18-5 10 18 14-37zm44 1 16 37-14-2-10 15-12-37z"/><circle cx="64" cy="48" r="36" fill="silver" stroke="#000" stroke-width="4"/><circle cx="64" cy="48" r="24" fill="#fffaf8" stroke="#000" stroke-width="4"/><text x="63" y="64" font-size="45" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold">2</text></svg></div>' : ''}
            ${place === 3 ? '<div class="place-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#cc3f3f" stroke="#000" stroke-width="4" stroke-linejoin="round" d="m40 63-18 38 18-5 10 18 14-37zm44 1 16 37-14-2-10 15-12-37z"/><circle cx="64" cy="48" r="36" fill="#CD7F32" stroke="#000" stroke-width="4"/><circle cx="64" cy="48" r="24" fill="#DFAD7C" stroke="#000" stroke-width="4"/><text x="63" y="64" font-size="45" font-family="Arial, sans-serif" text-anchor="middle" font-weight="bold">3</text></svg></div>' : ''}
            ${place < 1 || place > 3 ? `<div class="place-container">${place}</div>` : ''}
            <div class="name">${entryData.name}</div>
            <div class="name">
                <div class="seconds">${formatSecondsToHMS(seconds)}</div>
                <div class="milliseconds">.${milliseconds ? milliseconds : '000'}</div>
            </div>
            ${showDate ? 
                `<div class="date-scored right">${parsedDate.toDateString()}</div>`
                :
                `
                    ${entryData.revealUsed === 'true' ?
                        `<div class="checks-used right" title="Reveal Used">${entryData.checksUsed} checks used*</div>` :
                        `<div class="checks-used right">${entryData.checksUsed} checks used</div>`
                    }
                `
            }
        `;
    };
};
customElements.define('leaderboard-entry', leaderboardEntry);