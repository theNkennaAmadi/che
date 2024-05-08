export class About{
    constructor(container) {
        this.container = container
        this.logos = [...this.container.querySelectorAll('.about-brands-cc-item')];
        this.brandsHeading = this.container.querySelector('.brands-heading');
        this.init();
    }

    init() {
        console.log(this.logos[5])
        this.logos[4].insertAdjacentElement('afterend', this.brandsHeading);
    }

}

export default About