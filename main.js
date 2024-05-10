import barba from "@barba/core";
import gsap from "gsap";
import {Nav} from "./utils.js";
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




let firstLoad = true;

let navigation = new Nav(document.querySelector('.header'));


barba.hooks.enter((data) => {
    gsap.set([data.next.container, data.current.container], { position: "fixed", top: 0, left: 0, width: "100%", height:'100vh' });
});
barba.hooks.after((data) => {
    window.history.scrollRestoration = "manual"
    gsap.set(data.next.container, { position: "relative", height: "auto" });
    window.Webflow && window.Webflow.require("ix2").init();
});

barba.init({
    preventRunning: true,
    views: [
        {
            namespace: "home",
            afterEnter(data) {
                new Home(data.next.container)
            }
        },
        {
            namespace: "work-list",
            afterEnter(data) {
                new WorkListing(data.next.container);
            },
        },
        {
            namespace: "work",
            afterEnter(data) {
                new Work(data.next.container);
            },
        },
        {
            namespace: "about",
            afterEnter(data) {
                new About(data.next.container)
            },
        },
        {
            namespace: "contact",
            afterEnter(data) {
                new Contact(data.next.container);
            },
        },
        {
            namespace: "404",
            beforeEnter() {},
        }
    ],
    transitions: [
        {
            sync: true,
            enter(data) {
                const currentContainer = data.current.container;
                const nextContainer = data.next.container;
                let tlTransition = gsap.timeline({defaults: {ease: "power2.out", duration: 1}});
                tlTransition.to(data.current.container, { opacity: 0, scale: 0.9 });
                tlTransition.from(data.next.container, { y: "100vh" }, "<");
                return tlTransition;
            }
        }
    ]
});
