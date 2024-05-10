import gsap from "gsap";
import scrollTrigger from "gsap/ScrollTrigger";
import {Observer} from "gsap/Observer";
import Splitting from "splitting";
import {ImageHover} from "./imageHover.js";
import { Item } from './item.js'; // Imported Item module
//import OriDomi from 'oridomi';



gsap.registerPlugin(scrollTrigger);

class Marquee {
    constructor(element, direction = "forward", speed = 1) {
        this.element = gsap.utils.toArray(element);
        this.direction = direction;
        this.speed = speed;
        this.tl = null; // Reference to the timeline for later manipulation
        this.init();
    }

    init() {
        // Configure the initial direction of the animation.
        const config = {
            repeat: -1,
            reversed: this.direction === "backward",
            speed: this.speed,
        };

        this.tl = this.horizontalLoop(this.element, config);

        Observer.create({
            /*
            onChangeY: (self) => {
                // Determine the direction of the scroll.
                const scrollingUp = self.deltaY < 0;
                // Reverse the timeline based on scroll direction and the initial direction.
                if (
                    (scrollingUp && this.direction === "forward") ||
                    (!scrollingUp && this.direction === "backward")
                ) {
                    if (!this.tl.reversed()) {
                        this.tl.reverse();
                    }
                } else {
                    if (this.tl.reversed()) {
                        this.tl.play();
                    }
                }
            },

             */
        });
    }

    /*
  This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

  Features:
   - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
   - When each item animates to the left or right enough, it will loop back to the other side
   - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
   - The returned timeline will have the following methods added to it:
     - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
     - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
     - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
     - current() - returns the current index (if an animation is in-progress, it reflects the final index)
     - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
   */

    horizontalLoop(items, config) {
        items = gsap.utils.toArray(items);
        config = config || {};
        let tl = gsap.timeline({
                repeat: config.repeat,
                paused: config.paused,
                defaults: { ease: "none" },
                onReverseComplete: () =>
                    tl.totalTime(tl.rawTime() + tl.duration() * 100),
            }),
            length = items.length,
            startX = items[0].offsetLeft,
            times = [],
            widths = [],
            xPercents = [],
            curIndex = 0,
            pixelsPerSecond = (config.speed || 1) * 100,
            snap =
                config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
            totalWidth,
            curX,
            distanceToStart,
            distanceToLoop,
            item,
            i;
        gsap.set(items, {
            // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
            xPercent: (i, el) => {
                let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
                xPercents[i] = snap(
                    (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
                    gsap.getProperty(el, "xPercent")
                );
                return xPercents[i];
            },
        });
        gsap.set(items, { x: 0 });
        totalWidth =
            items[length - 1].offsetLeft +
            (xPercents[length - 1] / 100) * widths[length - 1] -
            startX +
            items[length - 1].offsetWidth *
            gsap.getProperty(items[length - 1], "scaleX") +
            (parseFloat(config.paddingRight) || 0);
        for (i = 0; i < length; i++) {
            item = items[i];
            curX = (xPercents[i] / 100) * widths[i];
            distanceToStart = item.offsetLeft + curX - startX;
            distanceToLoop =
                distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(
                item,
                {
                    xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                    duration: distanceToLoop / pixelsPerSecond,
                },
                0
            )
                .fromTo(
                    item,
                    {
                        xPercent: snap(
                            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
                        ),
                    },
                    {
                        xPercent: xPercents[i],
                        duration:
                            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                        immediateRender: false,
                    },
                    distanceToLoop / pixelsPerSecond
                )
                .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
        }
        function toIndex(index, vars) {
            vars = vars || {};
            Math.abs(index - curIndex) > length / 2 &&
            (index += index > curIndex ? -length : length); // always go in the shortest direction
            let newIndex = gsap.utils.wrap(0, length, index),
                time = times[newIndex];
            if (time > tl.time() !== index > curIndex) {
                // if we're wrapping the timeline's playhead, make the proper adjustments
                vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
                time += tl.duration() * (index > curIndex ? 1 : -1);
            }
            curIndex = newIndex;
            vars.overwrite = true;
            return tl.tweenTo(time, vars);
        }
        tl.next = (vars) => toIndex(curIndex + 1, vars);
        tl.previous = (vars) => toIndex(curIndex - 1, vars);
        tl.current = () => curIndex;
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.times = times;
        tl.progress(1, true).progress(0, true); // pre-render for performance
        if (config.reversed) {
            tl.vars.onReverseComplete();
            tl.reverse();
        }
        return tl;
    }
}

class Home{
    constructor(container) {
        this.container = container
        this.homeTop = this.container.querySelector('.home-top')
        this.sectionBrands = this.container.querySelector('[data-section="brands"]')
        this.sectionWork = this.container.querySelector('[data-section="work"]')
        this.marqueeContent = [...container.querySelectorAll("[marquee-content]")];
        this.homeCapabilityItems = [...container.querySelectorAll('.home-capabilities-item')]
        this.homeVisuals = [...container.querySelectorAll('.home-works-visual')]
        this.homeTeamBlocks = [...container.querySelectorAll('.home-team-block')]
        this.init()
    }

    init(){
        this.fadeOutTop()
        //this.changeBGColor()
        this.initMarquee()
        this.initSplittingC()
        this.initCapabilities()
        this.initWorksHover()
        this.initTeamMove()
        this.initTitleAnimation()
        //this.initOrdiomi()
    }



    fadeOutTop(){
        gsap.to(this.homeTop, {opacity: 0,
            scrollTrigger:{
                trigger: this.homeTop.parentElement,
                start: "top 0%",
                end: '+=70%',
                scrub: 1,
            }
        })
        /*
        gsap.from('.footer', {backgroundColor: '#012DD4', color: '#F7F4ED', duration: 0.5,
            scrollTrigger:{
                trigger: this.sectionWork,
                start: 'top 0%',
                end: 'top 10%',
                scrub: 1,
                markers: true
            }
        })

         */
    }

    /*
    initOrdiomi(){
        console.log('init')
        var folded = new OriDomi('main');
        console.log(folded)
        document.addEventListener('click', ()=>{
            console.log('click')
            folded.accordion(-75)
        })
    }
    */


    changeBGColor(){

        gsap.to([this.sectionWork, '.case-studies-wrapper'], {backgroundColor: '#012DD4', color: '#F7F4ED', duration: 0.5,
            scrollTrigger:{
                trigger: this.sectionWork,
                start: 'top 0%',
                end: 'top 10%',
                scrub: 1,
                markers: true
            }
        })
        gsap.to([this.sectionWork,  '.case-studies-wrapper'], {backgroundColor: '#000', color: '#F7F4ED', duration: 0.5,
            scrollTrigger:{
                trigger: this.sectionWork,
                start: 'bottom bottom',
                end: 'bottom 90%',
                scrub: 1,
                markers: true
            }
        })
    }

    initMarquee() {
        this.marqueeContent.forEach((content) => {
            let direction = content.dataset.direction;

            if (direction !== "forward" && direction !== "backward") {
                direction = "forward";
            }

            let speed = Number(content.dataset.speed) || 1;
            new Marquee(content.querySelectorAll("[marquee-item]"), direction, speed);
        });
    }

    initSplittingC() {
        //Initialize Splitting, split the text into characters and get the results
        const targets = [...this.container.querySelectorAll("[split-c]")];
        const results = Splitting({target: targets, by: "chars"});

        //Get all the words and wrap each word in a span
        this.wordsC = this.container.querySelectorAll(".word");
        this.wordsC.forEach((word) => {
            let wrapper = document.createElement("span");
            wrapper.classList.add("char-wrap");
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
        });

        //Get all the characters and move them off the screen
        this.charsC = results.map((result) => result.chars);
        //gsap.set(this.chars, {yPercent: 120});
    }

    initCapabilities(){
        this.homeCapabilityItems.forEach((item) => {
            let chars = item.querySelectorAll('.char')
            let img = item.querySelector('.cap-img')
            let midPoint = Math.round((chars.length)/2)
            chars[midPoint].insertAdjacentElement('beforebegin', img)

            let tlCapabilities = gsap.timeline({paused: true})
            tlCapabilities.to(item.querySelector('.cap-img'), {width: '2ch', duration: 0.5, ease: "power2.out"})

            item.addEventListener('mouseenter', () => {
                tlCapabilities.play()
            })
            item.addEventListener('mouseleave', () => {
                tlCapabilities.reverse()
            })
        })
    }

    initWorksHover(){
        this.container.querySelectorAll('.home-work-image').forEach(el => new ImageHover(el));

        this.homeVisuals.forEach((visual) => {
            let tlVisual = gsap.timeline({paused: true})
            tlVisual.to(visual.querySelector('.embed'), {
                scale: 1, duration: 0.4, delay:0.7,
                onComplete: () => {visual.querySelector('video').play()},
                onReverseComplete: () => {
                visual.querySelector('video').currentTime = 0
                visual.querySelector('video').pause()}
            })
            visual.addEventListener('mouseenter', () => {
                tlVisual.restart()
            })
            visual.addEventListener('mouseleave', () => {
                tlVisual.reverse()
            })
        })
    }

    initTeamMove(){
        gsap.from(this.homeTeamBlocks[0], {xPercent: -10, duration: 1, ease: "expo.out",
            scrollTrigger: {
                trigger: this.homeTeamBlocks[0],
                start: 'top bottom',
                end: 'bottom 20%',
                scrub: 1,
            }
        })
        gsap.from(this.homeTeamBlocks[1], {xPercent: 10, duration: 1, ease: "expo.out",
            scrollTrigger: {
                trigger: this.homeTeamBlocks[0],
                start: 'top bottom',
                end: 'bottom 20%',
                scrub: 1,
            }
        })
        gsap.from(this.homeTeamBlocks[2], {xPercent: -10, duration: 1, ease: "expo.out",
            scrollTrigger: {
                trigger: this.homeTeamBlocks[1],
                start: 'top bottom',
                end: 'bottom 20%',
                scrub: 1,
            }
        })
    }

    initTitleAnimation(){
        // Finding elements with 'data-text' attribute which are items in your case
        const items = [...document.querySelectorAll('[data-text]')];
        const ItemsArray = []; // Array to store items

// Function to create items based on 'data-text' attributes
        const createItems = () => {
            items.forEach(item => {
                let totalCells; // Variable to store the totalCells value for an item
                const effect = item.dataset.effect; // Get the data-effect attribute of the item

                // Set different totalCells values based on the effect
                switch (effect) {
                    case '1':
                    case '2':
                    case '3':
                        totalCells = 4;
                        break;
                    case '4':
                        totalCells = 6;
                        break;
                    default:
                        totalCells = 6; // Default value if no effect matches
                        break;
                }

                ItemsArray.push(new Item(item, totalCells)); // Creating an Item instance and storing it in ItemsArray
            });
        }


// Functions defining different timelines/animations based on effect numbers (fx1Timeline, fx2Timeline, etc.)
        const fx1Timeline = item => {
            // Define animations for effectNumber 1
            const itemInner = item.DOM.inner;

            const initialValues = {
                x: 13
            };

            gsap.fromTo(itemInner, {
                xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
            }, {
                ease: 'power1',
                xPercent: 0,
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom',
                    end: 'top top+=10%',
                    scrub: true
                }
            });
        }

        const fx2Timeline = item => {
            const itemInner = item.DOM.inner;
            const itemInnerWrap = item.DOM.innerWrap;

            const initialValues = {
                x: 30
            };

            gsap.timeline({
                defaults: {
                    ease: 'power1'
                },
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom',
                    end: 'top top+=10%',
                    scrub: true
                }
            })
                .fromTo(itemInner, {
                    xPercent: pos => initialValues.x*pos
                }, {
                    xPercent: 0
                }, 0)
                .fromTo(itemInnerWrap, {
                    xPercent: pos => 2*(pos+1)*10
                }, {
                    xPercent: 0
                }, 0);
        }

        const fx3Timeline = item => {
            const itemInner = item.DOM.inner;
            const itemInnerWrap = item.DOM.innerWrap;

            const intervalPixels = 100; // pixel interval
            const totalElements = itemInnerWrap.length;
            // Calculate the total width occupied by all itemInner elements except the last one
            const totalWidth = (totalElements - 1) * intervalPixels;
            // Calculate the offset to center the elements
            const offset = (totalWidth / 2) * -1;

            const initialValues = {
                x: 30,
                y: -15,
                rotation: -5
            };

            gsap.timeline({
                defaults: {
                    ease: 'power1',
                },
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom',
                    end: 'top top+=10%',
                    scrub: true
                }
            })
                .fromTo(itemInner, {
                    xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
                    yPercent: (pos, _, arr) => pos < arr.length/2 ? initialValues.y*(arr.length/2-pos) : initialValues.y*((pos+1)-arr.length/2),
                }, {
                    xPercent: 0,
                    yPercent: 0
                }, 0)

                .fromTo(itemInnerWrap, {
                    xPercent: pos => {
                        const distanceFromCenter = pos * intervalPixels;
                        const xPercent = distanceFromCenter + offset;
                        return xPercent;
                    },
                    rotationZ: (pos, _, arr) => pos < arr.length/2 ? -initialValues.rotation*(arr.length/2-pos)-initialValues.rotation : initialValues.rotation*(pos-arr.length/2)+initialValues.rotation
                }, {
                    xPercent: 0,
                    rotationZ: 0
                }, 0);
        }

        const fx4Timeline = item => {
            const itemInner = item.DOM.inner;
            const itemInnerWrap = item.DOM.innerWrap;

            const intervalPixels = 100; // pixel interval
            const totalElements = itemInnerWrap.length;
            // Calculate the total width occupied by all itemInner elements except the last one
            const totalWidth = (totalElements - 1) * intervalPixels;
            // Calculate the offset to center the elements
            const offset = (totalWidth / 2) * -1;

            const initialValues = {
                x: 50
            };

            gsap.timeline({
                defaults: {
                    ease: 'power1',
                },
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom+=30%',
                    end: 'top top+=10%',
                    scrub: true
                }
            })
                .fromTo(itemInner, {
                    xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
                    //filter: 'blur(15px)'
                }, {
                    xPercent: 0,
                    //filter: 'blur(0px)'
                }, 0)
                .fromTo(itemInner, {
                    scaleX: 1.5,
                    scaleY: 0,
                    transformOrigin: '50% 0%'
                }, {
                    ease: 'power2.inOut',
                    scaleX: 1,
                    scaleY: 1
                }, 0)
                .fromTo(itemInnerWrap, {
                    xPercent: pos => {
                        const distanceFromCenter = pos * intervalPixels;
                        const xPercent = distanceFromCenter + offset;
                        return xPercent;
                    },
                }, {
                    xPercent: 0,
                    stagger: {
                        amount: 0.07,
                        from: 'center'
                    }
                }, 0);
        }

        const fx5Timeline = item => {
            const itemInner = item.DOM.inner;

            const initialValues = {
                x: 20
            };

            gsap.timeline({
                defaults: {
                    ease: 'power1',
                },
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom',
                    end: 'top top+=10%',
                    scrub: true
                }
            })
                .fromTo(itemInner, {
                    xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
                    yPercent: (pos, _, arr) => pos%2 === 0 ? -40 : 40,
                }, {
                    xPercent: 0,
                    yPercent: 0
                }, 0);
        }

        const fx6Timeline = item => {
            // Define animations for effectNumber 1
            const itemInner = item.DOM.inner;
            const itemInnerWrap = item.DOM.innerWrap;

            const initialValues = {
                x: 6
            };

            gsap.timeline({
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true
                }
            })
                .fromTo(itemInner, {
                    xPercent: (pos,_,arr) => (arr.length-pos-1)*-initialValues.x-initialValues.x,
                }, {
                    ease: 'power1',
                    xPercent: 0
                }, 0)
                .fromTo(itemInnerWrap, {
                    yPercent: pos => pos*20
                }, {
                    yPercent: 0
                }, 0);
        }

        const defaultTimeline = item => {
            // Define animations for effectNumber 1
            const itemInner = item.DOM.inner;

            const initialValues = {
                x: 10
            };

            gsap.fromTo(itemInner, {
                xPercent: (pos, _, arr) => pos < arr.length/2 ? pos*-initialValues.x-initialValues.x : (pos-arr.length/2)*initialValues.x+initialValues.x,
            }, {
                ease: 'power1',
                xPercent: 0,
                scrollTrigger: {
                    trigger: item.DOM.el,
                    start: 'top bottom',
                    end: 'top top+=10%',
                    scrub: true
                }
            });
        }

// Function to apply scroll-triggered animations to items
        const scroll = () => {
            for (let i = 0, length = ItemsArray.length; i <= length-1; ++i ) {
                const item = ItemsArray[i];

                // Effect number passed in data-effect
                const effect = item.DOM.el.dataset.effect; // Get the data-effect attribute
                // Apply different timelines based on the effect number using switch statements
                switch ( effect ) {
                    case '1':
                        fx1Timeline(item);
                        break;
                    case '2':
                        fx2Timeline(item);
                        break;
                    case '3':
                        fx3Timeline(item);
                        break;
                    case '4':
                        fx4Timeline(item);
                        break;
                    case '5':
                        fx5Timeline(item);
                        break;
                    case '6':
                        fx6Timeline(item);
                        break;
                    default:
                        // Set a default timeline in case no matching effect is found
                        defaultTimeline(item);
                        break;
                }
            }

        }

// Function to initialize animations
        const init = () => {
            createItems(); // Create items based on data attributes
            scroll(); // Apply scroll-triggered animations to items
        };

        init(); // Initialize animations after preloading fonts and imag
    }


}

export default Home;


