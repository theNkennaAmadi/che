import Swiper from "swiper";
import gsap from "gsap";
import Observer from "gsap/Observer";
import Splitting from "splitting";

export class WorkListing {

    tlActive = gsap.timeline();

    constructor(container) {
        this.container = container;
        this.workItems = [...this.container.querySelectorAll('.work-listing-item')];
        this.workListingNumber = [...this.container.querySelectorAll('.number-btn')];
        this.init();
    }

    async init() {
        this.formatNumbers().then(() => {
            gsap.to('.work-number-list', {opacity: 1, duration: 0.5});
        });
        this.initSplitting();
        this.initSwiper();
        //this.initScroll();
        this.showActiveTitle();
        this.activateSliderButtons();
    }

    initSplitting() {
        //Initialize Splitting, split the text into characters and get the results
        const targets = [...this.container.querySelectorAll("[split-text]")];
        const results = Splitting({target: targets, by: "chars"});

        //Get all the words and wrap each word in a span
        this.words = this.container.querySelectorAll(".word");
        this.words.forEach((word) => {
            let wrapper = document.createElement("span");
            wrapper.classList.add("char-wrap");
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });

        //Get all the characters and move them off the screen
        this.chars = results.map((result) => result.chars);
        gsap.set(this.chars, {yPercent: 120});
    }

    formatNumbers(){
        this.workListingNumber.map((number, index) => {
            let actualIndex = index + 1;
            number.textContent = actualIndex.toString().padStart(2, '0');
        })
        return Promise.resolve();
    }


    initSwiper() {
        this.swiper = new Swiper('.swiper', {
            loop: true,
            slidesPerView: 1.5,
            spaceBetween: 16,
            direction: 'horizontal',
            centeredSlides: true,
            grabCursor: true,
            /*
            mousewheel: {
                enabled: true,
                eventsTarget: this.container,
            },
            simulateTouch: true,

             */
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                }
            }
        });
        this.swiper.on('activeIndexChange', () => {
            this.showActiveTitle();
        });
        gsap.to('.work-listing-list', {opacity: 1, duration: 0.5});
    }

    showActiveTitle() {
        let activeIndex = this.swiper.realIndex;
        let activeItem = this.workItems[activeIndex];
        console.log(activeIndex)
        let inactiveItems = this.workItems.filter((item, i) => {
            return i !== activeIndex;
        });
        let inactiveNumbers = this.workListingNumber.filter((item, i) => {
            return i !== activeIndex;
        });
        this.tlActive.to(inactiveNumbers, {opacity: 0.5, duration: 0.2});
        this.tlActive.to(this.workListingNumber[activeIndex], {opacity: 1, duration: 0.2}, "<");
        this.tlActive.to(activeItem.querySelector('h2'), {opacity: 1, duration: 0.2}, "<")
        this.tlActive.to(activeItem.querySelectorAll('.char'), {yPercent: 0, stagger: {amount: 0.2}}, "<")
        inactiveItems.forEach((item) => {
            this.tlActive.to(item.querySelectorAll('.char'), {yPercent: 120, stagger: {amount: 0.2}}, "<")
            item.querySelector('video').pause()
        })
        activeItem.querySelector('video').play()
        //gsap.to(this.workTitle, {duration: 1, scrambleText: activeTitle});
        //gsap.to('.work-listing-title', {opacity: 1, delay: 0.5});
    }

    activateSliderButtons(){
        console.log(this.swiper.slides)
        this.workListingNumber.map((number, index) => {
            number.addEventListener('click', () => {
                this.swiper.slideToLoop(index, 750, true);
            })
        })
    }

    initScroll() {
        // Initialize GSAP Observer to control Swiper based on scroll interaction
        //console.log(this.swiper.width)
        //console.log(this.swiper.progress)
        gsap.registerPlugin(Observer);
        this.initWidth = this.swiper.width;
        this.currentWidth = 0;

        this.scrollObserver = Observer.create({
            type: "wheel,touch,pointer", // Listen to both wheel and touch events
            onChangeY: (self) => {
                // Update the Swiper's progress based on the scroll direction
                this.currentWidth = this.currentWidth + self.deltaY;
                this.progress = (this.currentWidth % this.initWidth)/this.initWidth;
               // console.log(this.progress)
               // this.actualProgress = 0.5 + this.progress*0.257;
                //console.log(this.actualProgress)
                //this.swiper.setProgress(this.progress, 2);
                //console.log(this.swiper.progress)

            },
            ignore: this.container.querySelector('.swiper-wrapper'), // Optionally ignore the swiper wrapper to prevent conflicts
            debounce: false,
            tolerance: 0.3
        });

    }
}

