
const styleNode = document.createElement('style');
document.querySelector('head').appendChild(styleNode);

const AddStyle = styleNode.styleSheet ? style => styleNode.styleSheet.cssText += style : style => styleNode.appendChild(document.createTextNode(style));
export default AddStyle;

AddStyle(`
    /************************** GLOBAL STYLES **************************/
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

    :root{
        --text: #FCF3F3;
        --hover-text: #e5b58b;
        --background: #060F19;
        --primary: #1F2D2D;
        --accent: #788CA1;
    }

    body{
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--background);
        color: var(--text);
        font-family: "Josefin Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }

    body *{
        box-sizing: border-box;
    }

    .pages-container{
        transform: translateY(0vh);
        transition: transform 2s;
    }

    .landing-page, .projects-page, .about-page, .resume-page{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        position: relative;
    }

    .hidden{
        display: none !important;
    }
`);