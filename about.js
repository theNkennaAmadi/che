import gsap from 'gsap';
import {Flip} from "gsap/Flip";
import Splitting from "splitting";

gsap.registerPlugin(Flip);

export class About{
    activeItem;
    inactiveItems = []
    activeInfo;
    inactiveInfos = []
    constructor(container, lenisInstance) {
        this.container = container
        this.lenis = lenisInstance;
        this.logos = [...this.container.querySelectorAll('.about-brands-cc-item')];
        this.logosList = this.container.querySelector('.about-brands-cc-list');
        this.brandsHeading = this.container.querySelector('.brands-heading');
        this.teamMembers = [...this.container.querySelectorAll('.team-top-cc-item')];
        this.teamInfos = [...this.container.querySelectorAll('.team-info-cc-item')];
        this.teamInfoButtons = [...this.container.querySelectorAll('.btn')];
        this.serviceItems = [...this.container.querySelectorAll('.about-services-item')];
        this.init();
    }

    init() {
        this.logosList.appendChild(this.brandsHeading)
        this.initSplitting();
        this.updateServiceNumbers();
        this.changeNames();
        this.showInfo();
        //this.moveBoxes();
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
    }

    changeNames(){
        this.teamInfos.forEach((info, index) => {
            info.querySelector('.initial.first-name').textContent = this.teamMembers[index].dataset.firstName.charAt(0);
            info.querySelector('.initial.last-name').textContent = this.teamMembers[index].dataset.lastName.charAt(0);
        })
    }

    showInfo(){
        this.teamMembers.forEach((member, index) => {
            member.addEventListener('click', () => {
                this.tlShowInfo = gsap.timeline();
                this.tlInfo = gsap.timeline();
                this.activeItem = this.teamMembers[index];
                this.inactiveItems = this.teamMembers.filter((item, i) => i !== index);
                this.activeInfo = this.teamInfos[index];
                this.inactiveInfos = this.teamInfos.filter((item, i) => i !== index);

                this.tlShowInfo.to(".about-team-content-wrapper", {display: "block"}, "<");
                this.tlShowInfo.to(this.inactiveInfos, {display: 'none', duration: 0.2}, "<");
                this.tlShowInfo.to(this.activeInfo, {display: 'block', duration: 0.2}, "<")
                this.tlShowInfo.to([this.inactiveItems, ".about-team-heading", this.activeItem.querySelector('.team-title'), ".about-brands-wrapper"], {opacity: 0, duration: 0.2,
                    onComplete: () => {
                        const state = Flip.getState(this.activeItem.querySelector('.team-image'), ".team-info-img", ".about-team-content-wrapper");
                        this.activeInfo.querySelector(".team-info-img").appendChild(this.activeItem.querySelector('.team-image'));
                        Flip.from(state, {
                            duration: 1,
                            absolute: true,
                            willChange: "transform",
                            ease: "power4.inOut",
                            onComplete:()=>{
                                this.tlInfo.to(".about-team-content-wrapper", {backgroundColor: 'black', duration: 0.2});
                                this.tlInfo.to('.team-info-text-content', {opacity: 1, duration: 0.5}, "<")
                                this.tlInfo.fromTo(this.activeInfo.querySelector('.initial.first-name'),{y: '-40vw'}, {y: '-10vw', duration: 0.5})
                                this.tlInfo.fromTo(this.activeInfo.querySelector('.initial.last-name'),{y: '30vw'}, {y: 0, duration: 0.5}, "<")
                                this.tlInfo.fromTo(this.activeInfo.querySelector('.team-info-description').querySelectorAll(".char"),{yPercent: 100}, {yPercent: 0, duration: 0.5}, "<")
                            }
                        });
                    }
                });
                this.lenis.stop();
            })
        })
        this.teamInfoButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.tlInfo.reverse()
                setTimeout(()=>{
                    const state = Flip.getState(this.activeInfo.querySelector(".team-info-img .team-image"), this.activeItem.querySelector('.team-block'), ".about-team-content-wrapper");
                    this.activeItem.querySelector('.team-block').prepend(this.activeInfo.querySelector(".team-image"));
                    Flip.from(state, {
                        duration: 1,
                        absolute: true,
                        willChange: "transform",
                        ease: "power4.inOut",
                        onComplete:()=>{
                            this.lenis.start();
                            this.tlShowInfo.reverse()
                        }
                    });
                }, 1000)

            })
        });
    }

    updateServiceNumbers(){
        this.serviceItems.forEach((item, index) => {
            item.querySelector('.about-service-number').textContent = `[${String(index + 1).padStart(2, '0')}]`;
        })
    }

    moveBoxes(){


       this.logos.forEach((box, index) => {
            // Defining a timeline for each box
            const tl = gsap.timeline({
                repeat: -1,
                repeatDelay: 1,
                defaults: {duration: 2, ease: "power2.inOut"}
            });

            // Assuming box starts in its HTML order (left to right, top to bottom)
            const startCol = (index % 4) + 1;
            const startRow = Math.floor(index / 4) + 1;

            // Animate the box around the perimeter of the grid
            if (startRow === 1) {
                // From top row, move right to the last column
                for (let col = startCol; col <= 4; col++) {
                    tl.to(box, {css: {gridColumn: col, gridRow: 1}});
                }
                // Move down the rightmost column
                for (let row = 2; row <= 3; row++) {
                    tl.to(box, {css: {gridColumn: 4, gridRow: row}});
                }
                // Move left across the bottom
                for (let col = 4; col >= 1; col--) {
                    tl.to(box, { css: {gridColumn: col, gridRow: 3}});
                }
                // Move up the leftmost column
                for (let row = 3; row > 1; row--) {
                    tl.to(box, { css: {gridColumn: 1, gridRow: row}});
                }
            }
            // Other cases for boxes starting from the second and third rows need similar logic with adjustments
        });
    }

}

export default About