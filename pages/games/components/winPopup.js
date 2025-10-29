import AddStyle from '../js/Styles.js';

AddStyle(`
    .win-popup .win-initial-container{
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 10px 0px;
    }

    .win-popup .win-initial-container > div{
        width: 40px;
        height: 60px;
        border: 1px solid var(--shadow-background);
        border-radius: 2px;
        font-size: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

    .win-popup .win-initial-container > div.selected{
        border: 1px solid black;
    }
`);

export default class winPopup extends HTMLElement{
    constructor(){
        super();

        this.classList.add('win-popup', 'popup', 'hidden');

        this.innerHTML = `
            <div class="popup-container">
                <div class="close-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
                <div class="header">You Win!</div>
                <div class="time">00:00</div>
                <div><i>Input initials for scoreboard i.e. 'AAA'</i></div>
                <div class="win-initial-container">
                    <div class="selected"></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="submit-score-button" disabled>
                    Submit Score
                </div>
                <div style="color: #47af55ff" class="saved-text hidden"><i>Saved</i></div>
            </div>
        `;

        this.canInput = true;
        const winInitialContainer = this.querySelector('.win-initial-container');
        const initialContainers = Array.from(winInitialContainer.children);
        let selectedIndex = 0;

        const selectInitialContainer = (index) => {
            for(const initial of initialContainers){ initial.classList.remove('selected'); }
            initialContainers[index].classList.add('selected');
        };

        for(const initialContainer of initialContainers){
            initialContainer.addEventListener('click', () => {
                selectedIndex = initialContainers.findIndex(container => container === initialContainer);
                selectInitialContainer(selectedIndex);
            });
        }

        // Define player input
        const submitScoreButton = this.querySelector('.submit-score-button');
        document.addEventListener('keydown', (e) => {
            if(this.classList.contains('hidden') || !this.canInput){ return; }

            if(/^[a-zA-Z]$/.test(e.key)){
                const key = e.key.toUpperCase();
                winInitialContainer.querySelector('.selected').innerHTML = key;

                if(Array.from(winInitialContainer.children).every(element => element.innerHTML)){ submitScoreButton.removeAttribute('disabled'); }
                if(selectedIndex >= 2){ return; }

                selectedIndex++;
                selectInitialContainer(selectedIndex);
            }

            if(e.key === 'Backspace'){
                if(winInitialContainer.querySelector('.selected').innerHTML || selectedIndex <= 0){
                    winInitialContainer.querySelector('.selected').innerHTML = '';
                    if(Array.from(winInitialContainer.children).some(element => !element.innerHTML)){ submitScoreButton.setAttribute('disabled', ''); }
                    return;
                }

                selectedIndex--;
                selectInitialContainer(selectedIndex);
                initialContainers[selectedIndex].innerHTML = '';
                if(Array.from(winInitialContainer.children).some(element => !element.innerHTML)){ submitScoreButton.setAttribute('disabled', ''); }
                return;
            }
        });

        // close the panel
        this.querySelector('.close-button').addEventListener('click', () => this.classList.add('hidden'));

        // send score too server
        submitScoreButton.addEventListener('click', () => {
            submitScoreButton.classList.add('loading');
            if(initialContainers.some(element => !element.innerHTML)){ return; }
            this.dispatchEvent(Object.assign(new Event('submit'), { name: Array.from(this.querySelector('.win-initial-container').children, element => element.innerHTML).join('') }));
        });
    };

    setTime(time){
        this.querySelector('.time').innerHTML = time;
    };

    showSavedText(){
        const submitButton = this.querySelector('.submit-score-button');
        submitButton.classList.remove('loading');
        submitButton.setAttribute('disabled', '');
        this.querySelector('.saved-text').classList.remove('hidden');
        this.canInput = false;
    };
};
customElements.define('win-popup', winPopup);