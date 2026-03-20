
const styleNode = document.createElement('style');
document.querySelector('head').appendChild(styleNode);

const AddStyle = styleNode.styleSheet ? style => styleNode.styleSheet.cssText += style : style => styleNode.appendChild(document.createTextNode(style));
export default AddStyle;

AddStyle(`
    /************************** GLOBAL STYLES **************************/
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

    :root{
        --highlight-background: #c3d7e6;
        --shadow-background: #afafaf22;
        --hover: #95c3e6;
        --correct: #3333cc;
        --incorrect: #cc3333;

        --mini-theme:#8bbcf6;
        --mini-primary: #d4bf94;
        --mini-secondary: #7bedcd;

        --daily-theme: #9f9f9f;
        --maze-theme: #B5A5D5;
    }

    body{
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--background);
        color: var(--text);

        /*font-family: "Open Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;*/

        font-family: "Josefin Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;

        --text: #060906;
        --background: #f9fbfa;
        --primary: #74a175;
        --secondary: #acbfc7;
        --accent: #939bb6;

        --text-inverse: #f6f9f6;
        --background-inverse: #040605;
        --primary-inverse: #5f8c60;
        --secondary-inverse: #384a52;
        --accent-inverse: #48506a;
    }

    body.darkmode{
        --text-inverse: #060906;
        --background-inverse: #f9fbfa;
        --primary-inverse: #74a175;
        --secondary-inverse: #acbfc7;
        --accent-inverse: #939bb6;

        --text: #f6f9f6;
        --background: #040605;
        --primary: #5f8c60;
        --secondary: #384a52;
        --accent: #48506a;
    }

    body *{
        box-sizing: border-box;
    }

    .hidden{
        display: none !important;
    }

    *[disabled]{
        pointer-events: none;
        opacity: 30%;
    }

    .loading {
        position: relative;
    }

    .loading::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        height: var(--loading-size, 75%);
        aspect-ratio: 1;
        transform: translate(-50%, -50%) rotate(0deg);
        border-radius: 50%;
        box-sizing: border-box;
        border: var(--loading-thickness, 4px) solid transparent;
        border-top-color: var(--loading-color, black);
        clip-path: inset(0 0 50% 0);
        animation: loading-spin var(--loading-duration, 1s) linear infinite;
        pointer-events: none;
        z-index: 9999;
    }

    @keyframes loading-spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* Width of the scrollbar */
    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track (background of scrollbar) */
    ::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
    }

    /* Thumb (the draggable handle) */
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    /* Thumb on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .header-row{
        display: flex;
        justify-content: center;
        align-items: end;
        padding: 25px;
    }
`);