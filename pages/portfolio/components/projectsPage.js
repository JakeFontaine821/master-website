import AddStyle from '../js/Styles.js';
import Projects from '../js/projectConfig.js';

AddStyle(`
    .projects-page{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
    }

    .projects-page .slideshow-container{
        flex: 1;
        width: 100vw;
    }

    .projects-page .slideshow-container-inner{
        transform: translateX(0vw);
        transition: transform .4s;
        display: flex;
    }

    .projects-page .project-panel{
        width: 100vw;
    }

    .projects-page .project-panel .header-row{
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: end;
        font-size: 50px;
        padding: 25px 22px 18px 0px;
        border-bottom: 1px solid var(--accent);
    }

    .projects-page .project-nav-panel{
        width: 100vw;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 50px;
        padding: 35px;
        border-top: 2px solid var(--accent);
    }

    .projects-page .project-nav-panel > div{
        cursor: pointer;
        user-select: none;
        border-top: 1px solid transparent;
    }

    .projects-page .project-nav-panel > div:hover{
        border-top: 0px solid transparent;
        border-bottom: 1px solid var(--text);
    }

    .projects-page .project-nav-panel > div.selected{
        color: var(--hover-text);
    }
`);

export default class ProjectsPage extends HTMLElement{
    constructor(){
        super();

        this.classList.add('projects-page');

        this.innerHTML = `
            <div class="slideshow-container">
                <div class="slideshow-container-inner"></div>
            </div>
            <div class="project-nav-panel"></div>
        `;

        const templateProjectPanel = `
            <div class="header-row"></div>
            <div class="content-section">
                <div class="info-column"></div>
                <div class="picture-section">
                    <div class="left-button"></div>
                    <div class="right-button"></div>
                </div>
            </div>
        `;

        const slideshowContainer = this.querySelector('.slideshow-container-inner');
        for(const [projectIndex, config] of Projects.entries()){
            /************************ Setup the project panel ************************/
            const newProjectPanel = document.createElement('div');
            newProjectPanel.classList.add('project-panel');
            newProjectPanel.innerHTML = templateProjectPanel;

            // Set the project name/header
            newProjectPanel.querySelector('.header-row').innerHTML = config.name;

            // set the info sections
            const infoColumn = newProjectPanel.querySelector('.info-column');
            for(const infoText of config.info){
                const newInfoSection = document.createElement('div');
                newInfoSection.innerHTML = infoText;
                infoColumn.appendChild(newInfoSection);
            }

            // do the images

            // Append the panel to the slideshow
            slideshowContainer.appendChild(newProjectPanel);

            /************************ Setup the project nav button ************************/
            const projectNavPanel = document.querySelector('.project-nav-panel');
            const newProjectNavButton = document.createElement('div');
            newProjectNavButton.innerHTML = config.name;
            if(!projectIndex){ newProjectNavButton.classList.add('selected'); }

            newProjectNavButton.addEventListener('click', () => {
                for(const projectNavButton of projectNavPanel.children){ projectNavButton.classList.remove('selected'); }
                newProjectNavButton.classList.add('selected');
                
                slideshowContainer.style.transform = `translateX(-${projectIndex * 100}vw)`;
            })

            projectNavPanel.appendChild(newProjectNavButton);
        }
    };
};
customElements.define('projects-page', ProjectsPage);