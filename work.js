import Splitting from "splitting";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import "splitting/dist/splitting.css";
import {ImageHover} from "./imageHover.js";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

class Work{
    constructor(container){
        this.container = container;
        this.heroVideo = this.container.querySelector('#heroVideo');
        this.workPlayWrapper = this.container.querySelector('.work-play-wrapper');
        this.playText = this.workPlayWrapper.querySelector('div');
        this.soundWrapper = this.container.querySelector('.work-sound-wrapper');
        this.soundText = this.soundWrapper.querySelector('div');
        this.otherImages = [...this.container.querySelectorAll('.other-images-item')];
        this.videoDuration = container.querySelector(".work-duration-inner-wrapper");
        this.videoDurationWrapper = container.querySelector(".work-duration-outer-wrapper");
        this.homeVisuals = [...container.querySelectorAll('.home-works-visual')]
        ScrollTrigger.clearScrollMemory()
        this.init();
    }

    init(){
        this.initSplitting()
        this.togglePlayVideo()
        this.toggleMuteVideo()
        this.handleImagesScroll()
        this.handleVideoUpdate()
        this.initWorksHover()
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
        //gsap.set(this.chars, {yPercent: 120});

        if (targets.length !== 0) {
            targets.forEach((title) => {
                if (!title.hasAttribute("no-instance")) {
                    const chars = title.querySelectorAll(".word");
                    gsap.fromTo(
                        chars,
                        {
                            "will-change": "transform",
                            transformOrigin: "0% 50%",
                            yPercent: 120,
                        },
                        {
                            duration: 2,
                            ease: "expo.out",
                            yPercent: 0,
                            scrollTrigger: {
                                trigger: title,
                                start: "top 95%",
                                end: "bottom bottom",
                                //scrub: true,
                                toggleActions: "play resume resume reset",
                                //markers: true
                            },
                        }
                    );
                }
            })
        }
    }

    handlePlay(){
        if(this.heroVideo.paused){
            this.heroVideo.play()
            gsap.to(this.playText, {duration: 1, scrambleText: "PAUSE"});
        }else{
            this.heroVideo.pause()
            gsap.to(this.playText, {duration: 1, scrambleText: "PLAY"});
        }
    }

    togglePlayVideo(){
        this.workPlayWrapper.addEventListener('click', () => {
            this.handlePlay()
        })
    }

    handleMute(){
        if(this.heroVideo.muted){
            this.heroVideo.muted = false
            gsap.to(this.soundText, {duration: 1, scrambleText: "MUTE"});
        }else{
            this.heroVideo.muted = true
            gsap.to(this.soundText, {duration: 1, scrambleText: "UNMUTE"});
        }
    }

    toggleMuteVideo(){
        this.soundWrapper.addEventListener('click', () => {
            this.handleMute()
        })
    }

    handleImagesScroll(){
        if(this.otherImages){
            this.otherImages.forEach((image) => {
                gsap.from(image.querySelector('img'), {scale: 0.5 , duration: 2, ease: "power2.out",
                    scrollTrigger: {
                        trigger: image,
                        start: "top 120%",
                        end: "bottom bottom",
                        scrub: true,
                        invalidateOnRefresh: true,
                    }
                })
            })
        }
    }

    handleVideoUpdate(){
        this.videoDurationWrapper.addEventListener("click", (e) => {
            const rect = this.videoDurationWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = this.videoDurationWrapper.offsetWidth;
            this.heroVideo.currentTime = (x / width) * this.heroVideo.duration;
            const progress = this.heroVideo.currentTime / this.heroVideo.duration;
            gsap.to(this.videoDuration, {
                width: `${progress * 100}%`,
                ease: "linear",
            });
        });

        this.heroVideo.addEventListener("timeupdate", () => {
            const progress = this.heroVideo.currentTime / this.heroVideo.duration;
            gsap.to(this.videoDuration, {
                width: `${progress * 100}%`,
                ease: "linear",
                duration: 0.3,
            });
        });
    }

    initWorksHover(){
        this.container.querySelectorAll('.home-work-image').forEach(el => new ImageHover(el));
        this.homeVisuals.forEach((visual) => {
            visual.addEventListener('mouseenter', () => {
                gsap.to(visual.querySelector('.embed'), {scale: 1, duration: 0.4, delay:0.7,
                    onComplete: () => {visual.querySelector('video').play()}
                })
            })
            visual.addEventListener('mouseleave', () => {
                gsap.to(visual.querySelector('.embed'), {scale: 0, duration: 0.4,
                    onComplete: () => {
                        visual.querySelector('video').currentTime = 0
                        visual.querySelector('video').pause()
                    }
                })

            })
        })
    }

}

export default Work;