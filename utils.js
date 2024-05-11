import gsap from "gsap";
import Splitting from "splitting";

export class Nav{
    constructor(header) {
        this.header = header;
        this.nav = this.header.querySelector('.nav');
        this.navLinks = [...this.header.querySelectorAll('.nav-link')];
        this.navTime = this.header.querySelector('#time');
        this.init();
    }

    init(){
        this.showTime()
        this.initSplitting()
        this.animateLinks()
    }

    showTime(){
        this.navTime.textContent = updateTime();
        setInterval(() => {
            this.navTime.textContent = updateTime();
        }, 1000);
    }

    initSplitting() {
        //Initialize Splitting, split the text into characters and get the results
        const targets = [...this.header.querySelectorAll("[split-text]")];
        const results = Splitting({target: targets, by: "chars"});

        //Get all the words and wrap each word in a span
        this.words = this.header.querySelectorAll(".word");
        this.words.forEach((word) => {
            let wrapper = document.createElement("span");
            wrapper.classList.add("char-wrap");
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });

        //Get all the characters and move them off the screen
        this.chars = results.map((result) => result.chars);
    }

    animateLinks(){
        this.navLinks.forEach((link) => {
            let tl = gsap.timeline({paused:true,defaults: {ease: "power3"}});
            tl.to(link.querySelectorAll('.char'), {y:'1em', stagger: 0.05})
            link.addEventListener('mouseenter', () => {
                tl.timeScale(1)
                tl.play();
            })
            link.addEventListener('mouseleave', () => {
                tl.timeScale(1.5)
                tl.reverse();
            })
        })

    }
}

function updateTime() {
    const options = {
        hour: 'numeric', // "numeric" for no leading zero
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
    };
    // Get current time in New York
    const timeString = new Date().toLocaleTimeString('en-US', options);
    const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'America/New_York' });
    const year = formatter.format(new Date());
    let footerYear = document.querySelector('#footerYear');
    if (footerYear) {
        footerYear.textContent = year;
    }
    // Replace lowercase am/pm with uppercase AM/PM
    return timeString.replace('am', 'AM').replace('pm', 'PM');

}
