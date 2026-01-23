
const styleNode = document.createElement('style');
document.querySelector('head').appendChild(styleNode);

const AddStyle = styleNode.styleSheet ? style => styleNode.styleSheet.cssText += style : style => styleNode.appendChild(document.createTextNode(style));
export default AddStyle;

AddStyle(`
    /************************** GLOBAL STYLES **************************/
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

    :root{
        --text: #ebe9fc;
        --background: #111118;
        --primary: #9e94e1;
        --secondary: #020024;
        --accent: #0600c2;
    }

    body{
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        background-color: var(--background);
        overflow: hidden;

        color: var(--text);
        font-family: "Open Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    }

    body *{
        box-sizing: border-box;
    }

    .center{
        width: 5px;
        height: 5px;
        background-color: red;
        z-index: 998;
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
    }
    .center > *{
        width: 3px;
        height: 3px;
        background-color: black;
        z-index: 999;
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
    }

    canvas{
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
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