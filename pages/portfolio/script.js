const body = document.querySelector('body');

window.addEventListener('resize', () => {
    CloseAllImages();
})

/***** Duration Variables *****/
const page_transition_duration = 1500,
      image_cycle_duration = 5000,
      image_transition_time = 400,
      start_cycle_again = 15000;

const background = body.querySelector('.scrolling-background');
/*****************************************************************************************************************/
/*****                                   Scrolling through articles                                          *****/
/*****************************************************************************************************************/
const project_btns = body.querySelectorAll('.project_btn');

let current_project = 0;

// Run the animation on load of website. First animation always jumps instead of sliding, easy fix is to call first animation on load.
background.animate({left: '0'}, {duration: 1000, fill: 'forwards', easing: 'ease'});

for (let i = 0; i < project_btns.length; i++)
{
    project_btns[i].addEventListener('click', () =>{        

        if(i == current_project){
            return;
        }
        CloseAllImages();

        const distance = i === 0 ? `0px` : `-${i}00vw`;
        background.animate(
            { left: distance },
            { duration: page_transition_duration, fill: 'forwards', easing: 'ease' }
        );

        current_project = i;
        current_image = 0;

        cycle.StopCycle();

        setTimeout(() => {
            cycle.StartCycle();
        }, page_transition_duration);
    })
}

/*****************************************************************************************************************/
/*****                                  Article Image Button Section                                         *****/
/*****************************************************************************************************************/
const image_buttons = background.querySelectorAll('.image-button-front');

function leftbutton(){
    cycle.WaitToStartCycle();

    current_image -= 2;
    ImageCycle();
}

for (let i = 0; i < image_buttons.length; i++) {
    if(i % 2 == 0) {    /***** Left Buttons *****/
        image_buttons[i].addEventListener('click', leftbutton);
    }
    else {              /***** Right Buttons *****/
        image_buttons[i].addEventListener('click', () => {
            cycle.WaitToStartCycle();

            ImageCycle();
        });
    }
}

/*****************************************************************************************************************/
/*****                                  Article Image Cycle Section                                          *****/
/*****************************************************************************************************************/
const articles = background.querySelectorAll('article'),
      image_starting_width = articles[0].querySelector('.project-image').offsetWidth,
      image_area = articles[0].querySelector('.page-image-section')

let current_image = 0;

cycle = new ImageCycleClass();
cycle.StartCycle();

function ImageCycleClass(){
    this.image_cycle = null;
    this.image_cycle_timeout = null;

    this.StartCycle = function(){
        if(this.image_cycle != null) { this.StopCycle(); }

        if(this.image_cycle_timeout != null) {
            window.clearTimeout(this.image_cycle_timeout);
            this.image_cycle_timeout = null;
        }

        ImageCycle();
        this.image_cycle = setInterval(ImageCycle, image_cycle_duration);
    }
    
    this.StopCycle = function(){
        if(this.image_cycle === null) { return; }

        window.clearInterval(this.image_cycle);
        this.image_cycle = null;
    }

    this.WaitToStartCycle = function(){
        if(this.image_cycle != null) { this.StopCycle(); }

        if(this.image_cycle_timeout != null) {
            window.clearTimeout(this.image_cycle_timeout);
            this.image_cycle_timeout = null;
        }

        this.image_cycle_timeout = setTimeout(() => {
            this.StartCycle();
        }, start_cycle_again)
    }
}

function ImageCycle(){
    let project_images = articles[current_project].querySelectorAll('.project-image'),
        usable_area = image_area.offsetWidth - 60; // Because of 20px padding on either side

    usable_area -= (((project_images.length - 1) * image_starting_width) + ((project_images.length - 1) * 5)) // Account for other buttons

    // Adjust for out of bounds
    if(current_image < 0) {
        current_image = project_images.length - 1;
    }
    if(current_image >= project_images.length) {
        current_image = 0;
    }

    // Change Images
    for (let i = 0; i < project_images.length; i++) {
        CloseImage(project_images[i]);        
    }
    OpenImage(project_images[current_image], usable_area);

    // Increment
    current_image += 1;
}

function OpenImage(_projectImage, _useableArea) {
    _projectImage.style.backgroundSize = 'contain';
    _projectImage.animate(
        {
            width: `${_useableArea}px`,
            boxShadow: '-8px 8px 15px black' 
        },
        { duration: image_transition_time, fill: 'forwards', easing: 'ease-out' }
    );
}

function CloseImage(_projectImage) {
    _projectImage.style.backgroundSize = 'cover';
    _projectImage.animate(
        { 
            width: `${image_starting_width}px`,
            boxShadow: '0px 0px 0px black' 
        },
        { duration: image_transition_time, fill: 'forwards', easing: 'ease-out' }
    );
}

function CloseAllImages() {
    const articles = background.querySelectorAll('article');

    for (let i = 0; i < articles.length; i++) {
        project_images = articles[i].querySelectorAll('.project-image');

        for (let j = 0; j < project_images.length; j++) {
            CloseImage(project_images[j]);
        }
    }
}

/*****************************************************************************************************************/
/*****                               Setting Image Background Section                                        *****/
/*****************************************************************************************************************/
for (let j = 0; j < articles.length; j++) {
    const image_frames = articles[j].querySelectorAll('.project-image');
    const projectTitle = articles[j].getAttribute('projecttitle');
    for (let i = 0; i < image_frames.length; i++) {
        image_frames[i].style.backgroundColor = 'black';
        image_frames[i].style.backgroundImage = `url('/portfolio/images/${projectTitle}_img${i}.jpg')`;
        image_frames[i].style.backgroundPosition = 'center';
        image_frames[i].style.backgroundSize = 'cover';
        image_frames[i].style.backgroundRepeat = 'no-repeat';
    }
}