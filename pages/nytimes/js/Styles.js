
const styleNode = document.createElement('style');
document.querySelector('head').appendChild(styleNode);

const AddStyle = styleNode.styleSheet ? style => styleNode.styleSheet.cssText += style : style => styleNode.appendChild(document.createTextNode(style));
export default AddStyle;

AddStyle(`
    /************************** GLOBAL STYLES **************************/
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

    :root{
        --text: #1f1f1f;
        --background-light: #f6f6f6;
        --background-dark: #1f1f3f;
        --highlight-background: #c3d7e6;
        --shadow-background: #afafaf22;
        --hover: #95c3e6;
        --accent: #e19b9b;
        --correct: #3333cc;
        --incorrect: #cc3333;
        --mini-theme:#8bbcf6;
        --daily-theme: #9f9f9f;
    }

    body{
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        background-color: var(--background-light);
        overflow: hidden;

        font-family: "Open Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
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