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
    }

    showTime(){
        this.navTime.textContent = updateTime();
        setInterval(() => {
            this.navTime.textContent = updateTime();
        }, 1000);
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

    // Replace lowercase am/pm with uppercase AM/PM
    return timeString.replace('am', 'AM').replace('pm', 'PM');

}
