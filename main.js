import barba from "@barba/core";
import gsap from "gsap";
import Work from "./work.js";
import Lenis from "@studio-freight/lenis";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import {WorkListing} from "./work-listing.js";
import Home from "./home.js";
import About from "./about.js";
import {Contact} from "./contact.js";

gsap.registerPlugin(ScrollTrigger);

gsap.config({
    nullTargetWarn: false,
});


/**
 * Lenis Initialization
 *
 */


const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);





barba.hooks.enter((data) => {
    gsap.set([data.next.container, data.current.container], { position: "fixed", top: 0, left: 0, width: "100%", height:'100vh' });
});
barba.hooks.after((data) => {
    window.history.scrollRestoration = "manual"
    //gsap.set(data.next.container, { position: "relative", height: "auto", transform: 'none' });
    data.next.container.style='' //needed to remove the inline styles added by barba, transforms affect css positioning like fixed and sticky
    window.Webflow && window.Webflow.require("ix2").init();
});

barba.init({
    preventRunning: true,
    views: [
        {
            namespace: "home",
            afterEnter(data) {
                new Home(data.next.container, lenis)
            }
        },
        {
            namespace: "work-list",
            afterEnter(data) {
                window.sessionStorage.setItem('loaded', 'true')
                new WorkListing(data.next.container);
            },
        },
        {
            namespace: "work",
            afterEnter(data) {
                window.sessionStorage.setItem('loaded', 'true')
                new Work(data.next.container);
            },
        },
        {
            namespace: "about",
            afterEnter(data) {
                window.sessionStorage.setItem('loaded', 'true')
                new About(data.next.container, lenis)
            },
        },
        {
            namespace: "contact",
            afterEnter(data) {
                window.sessionStorage.setItem('loaded', 'true')
                new Contact(data.next.container);
            },
        },
        {
            namespace: "404",
            afterEnter() {
                window.sessionStorage.setItem('loaded', 'true')
            },
        }
    ],
    transitions: [
        {
            sync: true,
            enter(data) {
                let tlTransition = gsap.timeline({defaults: {ease: "power2.out", duration: 1}});
                tlTransition.to(data.current.container, { opacity: 0, scale: 0.9 });
                tlTransition.from(data.next.container, { y: "100vh" }, "<");
                return tlTransition;
            }
        }
    ]
});
