
const styleNode = document.createElement('style');
document.querySelector('head').appendChild(styleNode);

const AddStyle = styleNode.styleSheet ? style => styleNode.styleSheet.cssText += style : style => styleNode.appendChild(document.createTextNode(style));
export default AddStyle;

AddStyle(`
    :root{
        --text: #e1f3f2;
        --background: #0a1918;
        --primary: #9BCFCB;
        --secondary: #242424;
        --accent: #6DFBF5;
    }

    body{
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--background);
    }

    /*************************** Fonts ***************************/


    /*************************** General Classes ***************************/
    .hidden{
        display: none !important;
    }
`);