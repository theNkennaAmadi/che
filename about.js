import gsap from 'gsap';

export class About{
    constructor(container) {
        this.container = container
        this.logos = [...this.container.querySelectorAll('.about-brands-cc-item')];
        this.logosList = this.container.querySelector('.about-brands-cc-list');
        this.brandsHeading = this.container.querySelector('.brands-heading');
        this.init();
    }

    init() {
        //console.log(this.logos[5])
        this.logosList.appendChild(this.brandsHeading)
        //this.moveBoxes();
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