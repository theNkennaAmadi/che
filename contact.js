import Splitting from "splitting";
import gsap from "gsap";

export class Contact {
    constructor(container) {
        this.container = container;
        this.headerWrapper = this.container.querySelector('.contact-heading-wrapper');
        this.headingTop = this.headerWrapper.querySelector('.contact-heading.top');
        this.headingBottom = this.headerWrapper.querySelector('.contact-heading.bottom');
        this.init();
    }

    init() {
        this.initSplitting()
        this.animateHeader();
        setUp3D();
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
    }

    animateHeader(){
        let tlHeader = gsap.timeline({paused: true});
        //tlHeader.to(this.headingTop, {x: '1.82em', duration: 1, ease: 'power2'});
        let elem = [this.headingTop.querySelector(".char-wrap:nth-of-type(3)").querySelectorAll('.char'), this.headingTop.querySelector(".char-wrap:nth-of-type(1)").querySelectorAll('.char')]

      tlHeader.to(this.headingTop.querySelector(".char-wrap:nth-of-type(5)").querySelectorAll('.char'), {y: '2em', duration: 2, ease: 'expo.out', stagger:{
          amount: 0.1,
          from: 'end'
          }}, "<");
        tlHeader.to(this.headingTop, {x: '1.82em', duration: 1, ease: 'power2'}, "<0.1");
        tlHeader.to(elem, {y: '1em', duration: 1, ease: 'expo.out', stagger:{
            amount: 0.1,
            from: 'end'
            }}, "<");
        tlHeader.fromTo(this.headingBottom.querySelector(".char-wrap:last-of-type").querySelectorAll('.char'),{clipPath: 'polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)'}, {clipPath: 'polygon(0% 100%, 0% 80%, 100% 80%, 100% 100%)', duration: 2, ease: 'expo.out', stagger:{
                amount: 0.1,
                from: 'end'
            }}, "<");
        tlHeader.to(".contact-tap", {opacity: 1, duration: 0.5, ease: 'power2'}, "<");
        tlHeader.to(".contact-note", {yPercent: -110, duration: 0.5, ease: 'power2'}, "<");



        this.headerWrapper.addEventListener('mouseenter', () => {
            tlHeader.timeScale(1)
            tlHeader.play();
        });
        this.headerWrapper.addEventListener('mouseleave', () => {
            tlHeader.timeScale(1.5)
            tlHeader.reverse();
        });
    }

}

function setUp3D(){
    window.outputEl = document.querySelector('.contact-globe')

//window.ASCII = " ·:-+=*€%#@" //.split("").reverse().join("")
    window.ASCII = "   ·—+=##";

    function init() {
        window.WIDTH = 48;
        window.HEIGHT = 48;
        window.scene = new THREE.Scene();
        window.camera = new THREE.PerspectiveCamera(
            1,
            WIDTH / HEIGHT,
            0.1,
            1000
        );
        window.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        //scene.background = new THREE.Color( 0xffffff );
        renderer.setSize(WIDTH, HEIGHT);


        let texture = new THREE.TextureLoader().load('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAyAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAIBgYGBgYIBgYIDAgHCAwOCggICg4QDQ0ODQ0QEQwODQ0ODBEPEhMUExIPGBgaGhgYIyIiIiMnJycnJycnJycnAQkICAkKCQsJCQsOCw0LDhEODg4OERMNDQ4NDRMYEQ8PDw8RGBYXFBQUFxYaGhgYGhohISAhIScnJycnJycnJyf/wAARCADIAZADASIAAhEBAxEB/8QAhAAAAQUBAQEAAAAAAAAAAAAAAAECAwQFBgcIAQEAAAAAAAAAAAAAAAAAAAAAEAACAQMDAQYEBAQDBQYGAwABAgMAEQQhEgUxQVFhIhMGcYEyFJGhUgexQiMVwWJy0YIzQyTw4cJTFhfxkqKy0iWzw1URAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOy2jtBppCX0B/Gr6Ywc+a/zp5wRpb59tBmeX9J+ZpP93860mwu0afKkGIAbkX8BQZuv6aLN+m1avogaAWFJ6QJ0NBmBfh+dLsbw+VXnx76hfnSJjNezaCgpmF+3+NHp95qdsnjEf0/VuwsCVDMBfvZRtH401poQd0a3gH15O9PTX42YmgYIl/VTxCp/n/KmzySQsCixOliSWlCdOtiQRpUUmTJJjj0ZAgLASTRFJjGTeysFP50FoQf5ifkaX0GHXT46VjZaZnpkPmBjGRokj7mJP0f0gpue41Wx4M4ziHMjaHHUm88qsVva23c2gv2E0HRbUGhkQHuLD/bTgncwPzrlOQ572txRZM3kI5ZANvo4paeQdw/plUW3i1S4OT7U5JEmindxIQrTSyAHX9cbHyj/AFGg6Yo47Lim6D6k/KqsEPCbhDj8jHKo09CB0H/8DXNSnAwVJZEkuepZpf8AFqB5MC/UVX46U31MM/8AOj+TioP7fgg3GOGP+YsR+DE0r40TXHpKAdCAAL/lQS+tgXschL929f8AbU0YhkJEcm+3Xayn/Gs3+z4BuftUBbVjb5VQyuExYrtBLLBI+p2EMLLqb6XH40HS/bgG3mo9A30v+FYeNNFjYEmflcvNDHEN7STIzIoPl27dwLFtpArAxf3AiHJJLkct6vGqWcQ/ZyxTE28qyFJHTaD0te/bQd59ue/+NPXGYi42n5muKh/eDGXeMjiJGIb+m0UqlWW/U+oqkVHl/u7jem32XDOZf5TPKoX5iNSaDu/tX67AfgaUYzdsRH4f7a8w479yeUys2V+TyvscdrehDjY8cir/AKjLdj8b1sN7riwoFysznpch5D5ceBcawBJ1Yxx7lA7e2g7pcTvW3xp/2ml1UMe4V5NzP7gckipBxmdMJdC2THJE8fW9grY0bXt41gS+9PeE9g3M5Nx0ZCsenwRRQe7/AG7D/l2pDCf0V8/HnPcbsXbl8wsepORIf/FVjE9zc3iCz5M89r2L5E40PX6JBQe6tEP00wx9yivFIPfHP40zTtM8wZi3pyzzFAD2ABwK6LC/cLnpELJw88sZ1WSMSSjXpqVAtQejGM/oFJ6Xev5151yX7ne48KJN/CQYrSfQ07uzW8YwykfOncN+7EToy+44PSdSNj4cJcMO3cHlG0/lQeh7VH8lMYH+VdPG1cnL+7Ps9b7MfOcDo3pRi/4yaVzcH7m5vIZxixoREHZtizSRpEqA+Xcwjd72+PhQelkuOwfgKbvbuH4CqWBnvNGJMqfFBKBikcpYEn9BkWPy9gpF5rDMvpSDaCbK6ksP4CguGR+4fgKT1H7h+FTpLx8tkhyIpHboFcEn4CrC4e7W2lBSEkncD8qX1JP0j8Kt5SYuDiy5uY4hxoEMksrXsFUXJ0vWNxvu32fyryrickoEABkkmDQp5jYWaYICTQXWkc9lqTe57BV9UwpX9KLIid/0q6ltPC9PfAI6a91hegzPP+q3yo8x6sP4VdbECnzAj4037aO1wL/lQVdhP8wo2C31VIYSDYCpBCQNGNBw/N/uvNjZUUXC4UcsSj/qlykcee/SMgo3TvWs/L/d/nJGtx/GY0CkAASF5W3eG0x/haq59zQ5wEXN8XDlRAht6eWS4Nx5u62lqxMhcKTMXITFWPHLC+LA7q1v9T7rH4UHecd799zchjFo/biGQWX15ZzDEWC+Ztrpu+rsH41OvuX3YEIzuHx5ARdRh5TRMGGtm9VHBB8Kq8bBlhl3Y2RBjbf6a5GSJSDpYBbb9e27aVebDkd7AXv2ktagik9385DFvbhJWlt/w1mh2X7PMX3f/TVb/wBw83j1/wCq4DPyOjTSboSEJAuqeiuo+NWBx7MWYEMAbblJt8mAP50px5IQLob9l9D8KBU/cnFmKDH4TkpWcFiuyNLWt0LPrUXJe+OTZ8dcPiMlMeWIPKAL5MT79m26kxtprYU0XdiRHc31NyDULqzXcO0UiA2Ya69Bp0IoKy+8eSkyzg5+BlxQMLKctFZGbrtbRlt861MfmMPb6v2WGQTa5ULuA0IG1yOysyA8jgqJ8rObLRrlwRGqqLfjp3VAkvC5EhGLDj5XrMdxWNWHw3KNDQdHhe48FYpsPM+1SOS4V2CejGBbSSMeZr9pvWXl81KuRFFj52M+ACwlyo0QY7PbasdxGP6gJFuzrUskGA2MqzwJIIwAI2RZGNuwXGtLDBjRMrDEi2IwcDaqgHUb7Ktt1BVTN5MST5nN4qqRKvpZEAaUOLW9SQKfp8CgqdvX4rEk/uHJzq8x2SO8svpg3+lAGsv438arct7w4iJGx4h91IQQyqAY7g6B3uDodfLesb3BycXL4scOLnNMl1JikhRS8tvpVgd4t/p2+NA4+zOH5gepwuYsM4v60chLJcHzWDt6gPzNYHLe1c7h1EuWI2iY2SRGBv8A7psa3eIxpMaPBnmxORy8NQchkhAEO4nVlZLObd166huc4ubGDYvIQmUndIs8YlXv9N4nAe3Zp0oPIzj7CHj8rA3Vl0II7QRXpHtX31PBx8eLya/dGJhGZWdBNtYjbo25nrlOVyYc7KaSHFhxFFxsgvZj2sd3f8Kk4HPj4rOLzIHgmASUkG6jqGG3uPWg9yMLuoYCwIB+RGl6rtEy9RWri5WFlcVjZEMqSq8a2KHd5guo3aXNeWe5ffeXByD4nEBGSMkSSyBt28GxUC9rCg7iT09jbSrOvYbfxYiuU5XksnFDHJzPtY5Fa0JaNgb6AFUO4/Ja4DO5DlOWn+4zshna1gq+RAO4KulLhQ40c6tlxmWH+dQSpt33FA/K5jluQgXFyZ7wpu8qDbfdoQ1uo06GqceKD10rr1j9iQwbgudkTFTaM7Usx7zcAfnWCypvPpghLnaGNzbsuRago/bCkMAFXnXYSrCzA2I8abHDNkyCDHjaWVvpRBcmgzmhFWMbheSzd32mI8gFgSFt18WtXY8L7IyXnXJ5cKkKeYYwa7Of0tY6eNa/K+4uK4FFg27Zdp9HGjWw00Unst8aDil9j85sEkiRRL1O+QC3xqnke3eYxHKyYcjgG2+JS6nt7Bf8q77B5XkEid+aaAO9mSHHudg6ku1yD8hUfIclHJjS5uNmmB0ACOLFI201lS30/Kg83dGiYxyKUcdUYEEfI0ixPI2xELNYkKBrYC5Neg/Z53KwCPnsmDJgFmAx0VWJ6hvWtfae4Wq1FicPC8JOMJXx4xFHJOS9lHSytdb+NqDjeIzeI43DfLSIvzI1xpMqEy46ntKqu4EgdrCquUPdfOBp5Wys5VtuUMzKlxfb6YIC/DbXowzFDFlCgnoQBceFKvJFrgX01vQcL7Z9pYXJCWTlZmidfKMNQUmBvbe4YX291MxPZmNmgMM1Yx60sTxsR6g2PsUDvuBe9h8K7dclpkb1HZJLEEqQGt8wajxYsXHxzDCgZXf1ZHclneT/AMxmY3LaUGNjeyOHxyseZCchVBYZSu63N/paO5F7d2lbsceHiKsEGyEAWUBQhIHiAKc8h81z5fA/jVZTCv8ATYjQkjce+geyrNdQSb/qbS3fpaofs4bFPUEbAbd4JZrfF71KwHcCDrob0FLaKun4UFdcRIG9SPLyBKCCJkexFjfsXaPkKny5M/LK7eaz8XaLf0JFUH4gp1pC9jaxvYHp2HpUYaRydo6Gx3WAoMbJ9ncXmIEORkSvZi8k00jBnP8AM12IvfrYVz8f7dcmAskuTjxSbiFXzPp2MCB213MSywgoRuj3FlFxcA628dasCRW6xspbpqLfKgwOP9q8lHC6clysspI2xem7+VbW0JYG9VT7S5WCKZMPn8mPd/K7sEI/zMG/hXYlCw8p83bu0OlOaEBdnQ/D/sKDhuH4/wB9cPMpw+WRoVO44smTI8UgHYV1IBv2EV1nGe/uTfMkxuc4N1gQWGVx++YBgO1ZLXB8DpVr7aGFfUlCRomnqMAtvm3SmGbCCxyGVGEzbIdpvvY9i7b3oLH/AK9xTmwYkXEZ4WYkCWZFjFl6tt3M1IffTw7jN7fzxGraOuxwU189lO75Wp6QPbctlBPb3eFUs7lePw4yxmx5chQSuOZdrMQP1AMAfjQcJ6YpApVgy/UOmgP5GrWg/lB8TSAst9p23000oLnH8tzGECBPGI2AAOTc7VGvkC+bWpeR9zT5cLQxNJG2wKZU8oc/zDZfyqfiTWSU8Kb6YoGS8jyk0iSNlSI0YtGIj6aqD2KI9otV2D3X7ixwEfMbKgvd8fIAdGv17Nw+RqqYhTGioOp4j3Bg58vpZoGJMxCxyDdsJa4KOLk91iPnV7KggS8e5w97qpv1X/CuBdCoO02v/h0rouJ9yKYYsLPgbKnS6xyD/iFLdP8ANt7uvjQa7x3S7BJFUEmN9b3FrWPWqEkLqo2mSGNdVjhVUJI7rjxrUkMiwGQwl4RoHt9B69a1+PlxczECyld6eVgdD8aDjGy3WQNGC1mUs0t7bTrcN3i1aC5kM0E2HlFo4Z1Ks4bzgOOu61hXQzcdiMGS2h6mx/Oudm4EcSJpse7JIADCxuDYgKbsbDbc/KgwZ/ZOWqPNx2RFkRgkxxElZNt/L9Q23tWNk8dnYO373HeBXbYryDyk9tjreumyeUg491GRKEcMNyC5kCn+ay30rTyIcHn8BFY74SdyTxnUdhtfS9BY9tzTxcXjJlQtAcdiiAE7mTr6hVjcC9T8h7f4vks6PkMlm2pt9RVKhWsdA+nj1pI41jIEdtyqEMjDczKi2G46am1NnycuPcIMb1o1X+ohOxBc3N3NyfgAaDC9ye2vt5/vOIjaXDmuzJH5vTPgBrtrmxHfsrrYvdbzSRw4uLHHISFiaRh6UbE6s1wotVf3Dx8i5T8gJceaGYgA4xFgQLXKL9Nz0oMPGnzcNg2JkSQlbldjEAX66dKiEO5izasxJJPUk9tWdlPVLUECw+FSBLVNakIoI7UscUs8ixQo0kjEBUQXJJ8KU9KlweVyuIyDlYZUTbSgZhusD1IF7fjQaOVwcUfEtm4kkj5uOT97hsBviUm1ytw1gDqbGuew+Sl43LizYbF4jcBuhHaDbvrqPbXK8k+Rkti40GXnZbs80s0ixtr5jYDzFe+wtWvg+1MCDIbkM5I5MlyXGMgH28fgikXb50GOfcefNNBk52QkOJmxGRTjjWCzWBJcHcTYhrDSud53Pk5nKiXBid4PKkU3okMzW8/m1Nh3V6gWhSPaEjRBcBFAAF+thUYAKL6a7l6LsoOag9uyHHeDlMqTIKsphlSSQeQWuHTcB2W+FaEOBhY0zywwKrygLI5F2KjsYm960rB29O5Vv0kdakXBYEbhdT0b49hoMxY9jSEH6iCiWttAFtt6jlQKAXBUaa+J0A0rbOKiliWF0+sAg2/C9RriLMzK6my6qjeHb40GOY3UEHQdd/U6HuojV7syN113C1q12w1lQ9q9LqRbSiPCCoEVdB1NBlmF3ZWI6DpQ0RXX6SSLHxNazRX8qn4io2SK9mIB8D2UFAiXoFBbx0qtNHLq8hCKunl16962q/kxyIV9I33XA0N/+3xrOMM409QpI3aSQD3UEZjcAWlvI9rBNP8AuoTIlAMRB3hiu1uunbWjLx/2RYM5YMLopFwD8jaqWVx82Sqq7yCAizpFpvH6S4G4D4GgMYRTx+sJTOqlkIUWTcpKt262Iqx6ET23Bl/SqmwpMDDnREx4YRFCgCooFgoHdVjIwXW/q3XZYhuwnwoEMGMgHn8xNl6dT0FLIYoUaaaUKsY3M1ibKO8KL1JDGABJJ9PU3AtUqRSauFCRk/V0+FBxPK+8pJHOPxEfpoDrkyKCzeKo2g+dUF9x88V2/dkW7QqA/iFrpean49MzHwyqMgjnfICRgugaNtpUAdSTeuQjiAFuvjQauMvKe7cyLAysgLGil2NrCy212g+Y1o8xi43tvFgx+Ll25p/4sx1l2gdjf8sa/SOtZHH5M3G5Ay8ewlUMq3Fx5ht1qJ98sjSzMXkc3Z2NyT4mgibI5B9wkypjvG1wXY3Hd1qJccDsq0qVJt/OgfRS0UDbUWpaKBLU0qKfSHWgryLT+EiVucwgf/MuLC+oBIpzi9VGMkMizRMUkjIZHHUEG4NB6ymCmThiEsY0AIZFt9Xee2sw4AxMmGJH2MtnLuCA6nsW1/n3VP7f9xYHN+jEZxByMif9Tisps8i6b4rdbjU1oZcPoOy5kbiNk2o4F1ve5GgNjQV8aZZriKX1EiJSRturHs/CpJ4kaMJIdy9A3y7arcfhPA8zowZW2lR0bbqV3dB0PZT8qZgh8t/CgxOX4+aXBzE45VOS0e1CdoJPcWPhVFuAlx8jEfBScokREqJKET1B0aRna5162XUVuxxsxDE2v1FWVsg3ORGgFy57AKCmu7Ax3yuSmiVFKn1FQqq/5fMzXN65nP8AdWZJlyLhMoxA42uoKvIo72P038BUHufk8fksqOPClaTHiFm7ELjtX5VlRx0E82TLlMS6ogbUpGoUadL9p+dCLbTsoVaktagQCn2oGlFAUh6UtI7XGvXvoI3OlGDiryHIQYTOYxM20uo3EaE9KhlewqDDzczFz4ZuPQyZSkiOMKX3Eggjaup0oOyxPZgw87Hzos4uMeQSMNgXRewvust6g5v31BBkejhxjJjAYSOGIUOD0B22YVq46+++VwzDhJh4ccsapkzSFt63HnsD5dKpQ/tErxqH5J5ZL67FVU8bbtdaDDHuWXJgbH5J/s5MhFmw8qJTZRfo9y1wxXU2ra4j3HmRTw8fnxp6jpePIiZXikAF76dL1he8PZ8ntYYUsKz5wfcsu9GkjUL9A3x2Avrp865L7+QzJLH5DGf6KLeya3Cr8zQetSc1x8XrrGwmzcdHkji3nVrHoFBtrXE42L74nfLy0Em7LUrP6zABgw/kUnSw6EdKyTzuRHyP9xsI8tT549pXstZr61uRfuTzPpSY0Mce+XYkC2ZiCbKdviaC57Y5H3RxbLxE3GH7RmJaQIqlWY3Lu2oarvvd+Xz+ICYRkiOKxkyEja2+LbZtV7vjXbxe3YzhpNMztNKgLupuwYrra3jWByPF42Rhz4eZI/oZS7RMp2uF0uh6W1FA79s8/hc3hxj4XHyYkkQ3ZN9zwySrZWZZGv5mtfaeyujxOKx+PmzMlpJJpMqT1f6pB9MbbCNdoHlHW1cv7R9qf+n48xMXkfVizCjMpWzDYG27bDQ+bU10j5DQQOcpvUVCBftN+lwP40EOXlrCHYgOLjyoPMSaw2ysZWlMWEnqzuGyPVs7dNtwtmJsBoBpRyeUuYWlx8VjKDsWRm7u7Sq3H5uRhZZlZTHKL71bzKe7eLg6eFBrx8dyMjPPHjF1ezETlQpKjS6ArVqTE5HNRXy4khKaKoBNh07rfhT19x5E67URQ1vrAJH/AMp6VAmbnmUEt6xPY5sLfAaUDosF1YRu25l0N7hSPC4/wrRhxmjALRxrGPqZdxt8Ao1/CsiXBllkLqAkwFhZtF+Wh/OnS8pkYN8fLlEpPnhYDUi/b32NBtNPxqo2rKw0PlIPzvWHn8px4O/IlEeMpCq72AZibAa6n5VWeeXOc79b6BRoLd9Ynu3iImxByAxWyJ4NBtlKBFOnqFQddp7vnQdNk5OJHEzGRI4k/wCI5I2j51yWX74MqTR4eM25rLFJKwKqB/MEA6/Osb27m4mLjZ2FyYaTCyEusKKCxmJAV9x1G0eNSY3CqoRs/JTDuVOxwxcoRu3WHeOlA/iY4JGyOS5cZE8GscskP1CSQHYzOSLaioD6YY+ipVL+XeQWt4kACtTkMzjF4+PjOGWUQmT1siWXRpSBZLgHotZii1AAU4KKUCloEtS0UUBRRRegKKNO2nMoABBBBvp2i3eKBtFFFA0i9QyJe9WKay3oKMMs+Blw52M22fHcSRnxXsPgelegcZ7jLRRYs2W2R94/qYeSWL+lMw3vgSlwGuvWMnqNK4aSMGoS80cEuOrXglILxnVdy/S47mHYaD2dZZsrGM8ZBYDa6gC+lch7v5k8HDAkURmmyw5jZvKihbam2p69BVn2JzRnxmxs6cPkIxAV9XdLeVu891Zf7g8VlyNiZ8amSCNXjbbc7LtvBt2DW1Bzze7uXkRViCQMOpRdwPyfdWlFy2bz/F52DmOizxRjIiKjZ6ixeaRG7OmtUeO9tTZPG5XK5Ev2uPijQOjFpDa9k+n4VVxXxox/XgMtxY2kKde6wNBEsRQ2brU6C1W548eT0TiytI8lrxSKVkXQAeb6GHjTcnCysKX0ciMq1r2BDafFCwoIwKUUwN2U4GgdS0gNLQJUTmwqU1XlOlBTnkFiL69gAvc16J7Q/bzksDIj5jk5vt5JIv6eIqkyIsnX1T/K1v5RXNexMbj833dgQckhkju8kMehVpo1LoHB/l0v8bV7dlzPdjbr0v1PjQZaxQ4i+jCLAG7EjW9NfMSMnc1j2dpPyFLICp10H51VkTepCXVv1ga0FyHOjZBtbcGNiQe3utWUvtj23JzUfL/25Y+Qgf7gTxkqjyNcH1FB2se3pUqIH80ViVO0nx8aGnyxkJCIysNiTKD3Doe3rQXeS4jguXBPJcdj5LWtvkjUuL2/mFmHSuP5zjfbPtCFeYi4WGRMZlF1VmeFWKqJlJPmtdr316V1gckhidL+bxqHOw4+Rglxp7NDJG8TRHptcDcToflQWMPl8TNhimxpFdZRvRR12kXDfhWf7lx+SbisrI4COM8kg3rHMLpKo/4ibSQNxXpXBeyeRi4Lmsz2vnSSs+PMRxolFgYetiSOzr/CvWsdQx3htwPTXS3Sg8v4z3lxT4fpPM2FmRgK2HOrb4yQN23Q3TX8K7fCyEF5FaNxIg3zKCyA/l1rUPtj2+wz8mfBxoly42HI5LKFLIdW3u3ZpXz9zUXFf3XKXgBLFxga0Cu2psLFtOwnpQe3riLnzNkofTCtdSANth9RA7yetZ3NYGJOoiUXcXIcaEV517O915PtiZ4ZzJLx0gJaFbEq/Xcm/v7a9Fxn/uOJFnILLOiyaa/UN1qDGVM3HuNqzLfRlOxvhapk5J8b/kSFyCdEFtRYXJaruZNi8bA2XmSiKFDZmPX4AdpripPeqz5ig4gjxCxWR7lm2HTcBpr20G3HzOXEf+oj3ndrta4A/TfTUUYySTySZEq6yaKD2Adg/jWicSCXHhaKziVFZWW1jftvVLNyIuJxZMycM8cdgqKNSxNlW/ZQX8SFY91m6gfAfjTebzYOO4yQ5LFy4McajTc7A2HboB1rnMv3bkQxQenhJHNNEJRukEgUEnbdV7xrrWQ/KcjnZf3OQ3rSbHSNNvlQOpUlEHQgdtBQhjub2tfW1XCXkYNIxZgAtzqbKLAfIVGi9KnUUCBbU4Dtop1ACigUUBRRRQFFFFAUUUUBRRRQFFFFA0qDUTJ31PSEUFQxkMGUkEagjQg+FakPuXnseEQR5jMq/SZAHYeG5h21TKd1NKXoOn/9Tcfy2GOP5lJYd5USywkbDY9T2qO01je4cHjuPyYU42QyQyxCS5bcNWK6H/drNZdKkl5F3iWLLQZIiUrA7khkFtBcdVH6TQVk9WZ1iiVpJG0VFBYm/YAKWZcjEYCeNoi1wC2gbabGx6HWu99l4+KvGDPhi25GUWWU3vf0jt2oOwM2tq6eVONx8SPHyIkytoCBJgJbC3Tz3oPGknuNeoNTJKDXonOcHxfOQ/0kXGyIxaGWJQqiw0DqBqtcNle2ecwMdsqSFZYU1doW37V/URobUEIang1RjmB7asI4NBMahk6HS9SA01xcUGj7HmwsP3Ti5OdoEWT0CWCgSldq3J+Jr1fJ5UEsoQg63N68MlivXYe3vdUXoxcfyj+nLGu1MqQ3VwOm8n6Tag7Fsudpd8jELtsI+oHiacmUu309x3+OoIvXOy+6+DXepzF3ICfKGIJHcbWNZ0PvficnITHKSxEg2nkCrHe3xuAfGg7cZkcQYRqCo/lGhJqGTkhtGyPaT39nh21iRZ2Jkp6kDiWM3u6sCO62lOfKQE+bQ9lBtQZqsNVtt+d/x6VHl8kysn29gNd57vG9ZEOajGwYGpZlLxvZgCQevS3Wg5/3Pwbc1PFyuG3o8hheeIdFcKwbaT1F+yry/uhDjwfZcVgy52VGbIVVlVT+lhYt5TpoK1+NhmMkIVdpbUyKQdD+k/Ct3k+WxvbPEZXJlYlmUbcdQoBlmb6RdbX11ag8d5z3L7j56aVOVyHihDbW45GZIkZdLGMm9/8AVWakGnSpQZJ5ZMiY7pZWaSRu9mO4n8TVlY9KCk0HhXpf7f5iZXFScdIwWbEayDtMbag28DcVwTJVrj+QzeHyHyMFwkrxmMsRfRrG48RQR+5czK5HlslJ5fUhx5Xjx1AsoVWt079NTWSMe5sO2tjkThzzpNiI67ok+4D9s220jDwY61U2Cg2fbXOzwZXp5rbsLHxzsjAACiLzXA7WYaV28E3Gc/x5jg2zY8gKuHHT9SsOoIrznEhOOBlzw+phT7seR7/Rv0ubHRl6i/WjMg5D2/PPgerYToAXjJtJGehXtF6ClnYkWJn5ONAweKKRkRwb3AOmtXuGyfscv7gKC3pyIhP8rOhRW8evSs+KJ5JFiiUvIx2oii7E9wFaefxeVxJgjyyqvMgkaNWBZfBx2GggeIxMAfzFjp1uOy1KKsZWTizwRNGjjK3MZ5Ga4sdFUaD41VDCgfS6dKZupQRQOopLi+nSlFAUUtJQFFFFAUUUUBRRRQFLSUooEopaKBLU0i9OooIpFUKCDdv5hb/GmcfhpyPJ4mBJKIUyJFjeU/yg93ieg8ae4peO5F+H5KDkUjWUwE3jboVYFTr2Gx0oPRXOJxMSYuIgjhg8kYHhoXNurMeprHyOUbeSx+Xh8q1clYsuCLJgu2POiywt/lIvY+IPWsWXHIN1AHf2a0FrG5r09yu4QWuNRZu+1Wk5sTRMixNNddhTaQpDAjVjpb4VkRceNxZ1vru6dfjWrAoiZLaC+nxoOS5L2pyMe/LwIxJANfRXSTu8qG9/41kNFl4pAyoJYLmw9VGS5HYNwFes4QUfSNAdL3PjWrInHZ+E2PnxJk4lvOJPpBGt76Wt3ig8WR71L1ozftV5DKXAN8QSuMci9tl9LX7O6hdRQIyXqBoQatWoIvQZ7Y4PZVaXHWxBFaxUVXlTSg6X2Xjwf2mdUO6UzEyoDqtwFW4+VWcuCWKcoOg/mHSuY9t5TYXP4hX6MhxjyrewKyeX4aHWvSp8NTuDAC50X/bQcxFHIsgtoOta2NNyKcji4cWO8uPNG8uRmsbRw7PpQeXUnx76lbGjQh7E7fMQNdBrVjiy2FhLBkkqFb04nb6mUm8aka62O340EudzmBwPFHJylCuPJjxIfNIQPKg/x7q8v5HmeS53IE+fJdUv6MC6Rxg9ij+JOtbv7h4+R6/HzybjG6yAj+QPcH8SP4VzMC6CgsxrYVYFNj0+fWpFoEpGAJvT9L60EAkkaeFAzbTStSWpDQWOMzvsMjdIglx5BsyYDa0iHqpv+IrX91cW/p4udh3mwfTAjkvuKqdQhbrYX0vXOsL1bg5KdMU8dkM8nHuwZ4FIBBHQozK23Wg6v2jDw8WHHlRqi558kpkYFw63BKBtV3X7Kyufj/u3NZKwqt8JFjmZm2l2vaw63IvpburDaLi/TLxzzpOG8iuildvZd0a9/lUMbyRb5IpV3EAs1zuFmDDs/UBQPjKEnam8bSBa5ux6E1OOPlkxBlQMJT6ghkgVW9RGb6bi1rN4VQnLKPVd1vJ5to6kHtt2VHHnvA2+CV1kt5XRipB+R7qDSy+L5TAAfLxJIkNvORdde9luBVVTe1j16V2/A+7eNkwfRz8onLhQtK7KwEvcoGt2A69K57kJOO5Fv7nxkKJrbKxJDtIY9JFVCLqfCgzRS0K4dj6mhPQjoPCw7KcVtY3BB7RQFKbdRTRS0CnqaQ27KW9JQFFFFAoHy7qLWpKKAooooFoooNAUlF6WgYwvVWZbirZqGQUG97W9yYOFitxPMO6RCT1MWcahL/UhPYCda6fJxoQ4mgDTYrC4m0IuRfQr2V5Tkr1r0v2sft/aOGZSCJFlNydVVZWK/wCNBIpjB2mxHUVMkIkYMndaoo4Q0SlxYnW3x1qzGwt6YNiPqPaB30F2BewW1OlYPv3kMjF4mHExpNseVIY5gOpjVb7Qe6/Wr2dz3EcOq/dTWltdYVF3PZew7PjXC+4eZ/vubG8QZcWBdsKvoST9THU9aDMgWwq4g0qGNLCrAFAtJalooENV5RoasmoJRegue0uJi5f3BFHON0GMjZUi3Iv6ZGwaf52Fek5sU6tcix63Ol68lwOUyOE5KDkscndC3nXseM6Oh+Ir3TIj9SQ7bujKpQmx8rDcOnxoOVZipJc216devcKlkgbIhEUqtH54pFfQ6xOJApAN+zWtHKx4o1DKLNfS5rM5UuvGZUqz/bOkUgimuBZwpta9Bg+/uRwZuPx+PjmVstJg7RLYlVCsCXt061n8N7VyHwZOY5NRDgLA0sQJ88hI8psOg7a5CNWa8jks7eZmOpJOpJr1P3HKvGezuN4/HlMgyY41V2PmZAocnwHZQcCh0FTL0qJNOypRQLRQKKAoNFFA0i9MYWqWo3oK8htVSWW1afH8fNy3JY3GQMEkynEau30jQkk/hXomF+3/ALe42ZJMsS52REVcGVtsW5df+Gtri/YSaDjuO9icnyWC+VkSfZyk2hhkQkkXsWftHhXV5HtHi4uM+3gw4p81Yv6csxI3SbbBmYdNRXVT5AbcABcW6dKrmfzBFHTtoPLPafBZh9wTcfyuK0QGNOGLi6gsvpo6kaHU6WrIzsSTi+Qn4+Vt7wNt3gWB7mFe5JawdlO1ha4HT4Vx3ur2vjZ7vk4ovnAA3vYOAPpPj3Gg4GOQta5vVgG4+FU1DRSNGysrKbFXFiCOoNXI2F7kXU9QNKB7C1iDe9KiPJcIL21PcB3mkO3ouo7z1pLlb2Nr6GgWiiigKKKKAopbUUCUtF6SgWkoooClFJQKAqJ6lNQyUGfkmwJr1DjMHbxWJiIPJDjRhiCPqkHqE3F9L15vDinPzYMPcF9eRULHSwJ1r2LGx0SIrGLIqoFHeFFh8qCqccgdDr9Jt2AXuKiyYI8GCXNym2RRi8jEgWH4a1t5E/EY8H/X5kWKCtwZJFRh/mUHX8q8i533JyPNk4UkiPgwysYmjT0zKAbK7j4a0GdyWSOU5PIzlTYsreRSbnao2j+FOiitSRRWqyqigVRT6QUtAUUUUBUbipKRhQZ2RFuBuK9a9j+4xzHHCHKYJmcekcDBf+ZGi7Y5Tc/I+IrzB0vUmByGfxEsk3Hyem8i7XuAbj4Gg9nydhLSPZh1RV63ryv3ry0PJZiYOMA0eM5aSRTdWkIC2Fv02qjke4Ofy42hnz5DG1wyiy3B7LqAbVnxxAUDYorVaG4hVZiQosoJJAHhQq1IBagRVtTqLUtAUUUUC0GiigSo3qSmsL0EWFmNxvIY2eq7vt5FkKntCm5Fe25M0UscWTu3wyKGjkGoIOorw+RL3rYyPeHuGTFgw4p1gixwFT0kUEhRYXvuoPS5pIFj9ZpkijsTukIQWHX6rVFhS4mY+7Gyo8hR9RidXt8dprxfOkyuRnbIzpWnlbqzm/TuHQfKmYMuXxeSuZgyGKZQRuHaCLEEdtB9ASsjX2+UKbWt4dlVCkMgdjoY9Cey/hXHe0fduK+KcTmcoQTQkCGSQ+aRDrcsRbcD1q9zPvLiUwJU46RWmkVmj23O5/pBNunzoOK9zvC/uDKaHoNof/UF1qklV4wzMXclnY3ZjqST1JqyooJKL02tCXi8lcGPlFj24clwGZhcMp2kAGxNz0tQVLUWoovQFJeiigKKKKAooooCiiigKKKKANQydDUxqJxQO4iDIm5SD7ZSZFa9wL7QTtLfIGvV83kcLhuLORmSelFt2x2BuzsDtRbX10rzz2lPDj8t/VS7OjrE2twxVh2EX+FdJ7652QcfBg8YVfCyQVmygL+ZNDANy+U2N++g86zcvM5bIXJzpXmdFEcZkILKg1C3UL391OiiAqTHgVyQ0ix2F7vfXwG0GpEWgVUqSilAoCgUUUC0lF6KAooooGkU0pUlFBF6Y7qcFAp1FAWpaL0l6BelFF6S9AtFOR0VXDIHZgNjXI2nvsOvzptAtFJek3CgWikvRuFA0rTClS3FJcUERiFMaEVY0oNqCmYfCrkr4smJDDHirFkIbzZAJvIALDy9B402wo2igYqWqS1qLUtqDb47hsdMMc3y0yrgow240ZDTTNfRALi1/wCFZmVmvkD0UHpYiyPJDjKSVTf4nU6Cq5APy6UACgdRTN4o3igfRUe8UGQUElF6hMgpDKKCa9FxVczCk9YUFm4ouKreuKPWFBZvRuqqZx3031x30FwtTGNVfuB30hyB30ErGxuDYjoR1qaTleQlg+1kyHeEa7GNxes18gd9WuK47kObnXH42MSuzbNXVbaXJsTewHUgUArC9zU6mur532fF7N4nG5PknOVPkSLEMdXWMK+0udSpcjTst41yDZKSvujQRJ/KgJNh4lidaCyoJvbW2ppVZkYMhKsOhBsRUCyCnbxQSX7aDYVEZBTGmAoJt1JvFVWyAO2oWygO2gv7xSep41nHLA6mk+7HfQaXqCj1KzPvB30feDvoNP1B30eoKzDljvppzV7xQaZlFJ6wrKOZchRqT0A6mr2NxPP5u04vGZUiubK3pMqk23W3MAOygm9cd9HrCttv2194rinKEUDMF3fbrL/V17LFQt/96sGTgvc0DbJuHzVYG1vQkOo8VBFBJ6oo9UVQmTPxVL5WLPAi6M0sToAToLllAqscyxsdD3HrrQa5mFMM476t8V7S9z85inL47DLRq/pkSn0W6X3D1tgZf9JNW8j9uve0MgjGAs113+pFNGUH+UlmXzUGT9wO+j1x310sP7Ve55cGDKebHx55WIlxJmbdGL2B3xiRWv1tUGX+2XuzHUNjCDM67xHJsK2On/GCXuNdKDB9cd9L64rTxv2/935EEkzYqY5jvaGaQB3t+kJvH4kVQT2l7xkdUXhcob/pZk2r8SzEAfOgi9cd9L64760Z/YHveDHTI/tbTK//AC4ZI5JF/wBSK16tH9sveyoHbGgUkA+mcmMMLi+oJoMUTClEwq5N7G96QXvxbyBerRSROPyesHI+8wpBFmQSQSEbgkqMhIvbcNw1HiKDUEgp4e9YyZo0uetWY8kHtoNIEUtVUmBqYSCgo/dDvpPuh316i37Qe3iSV5LNUdg/pH/wUz/2f4L/AP1cz/5Yv/xoPMDljvphyx316tF+0vtyOwlyMvJHaxlWI/gkTfxrUm9hex4kUPxyqEABdnl1/wBTKwoPEvvATtU3buGpp0bZM7bYIZZWHVY0Zj+Cg17viycRxIEHHYOLCiCyvEgUn/e+r8TVk8/Je6WQnrs0vbvoPEY/bfuudQ8XDZjKdQfRYf8A3AVoY/7f+9cnH+5XjTGLkelNIkcmnbtdh1r1v+8trY7Sbm9r6mmf3EsdzSuT2W0AoPJT7C97C/8A+rY27BLCf/7KzOQ4D3JxUfq5/HTQxk2DWDg/D0yxr2370k6sSPGpRyO07lchrWJv2UHhnCcc3K50eLlvNhQyafcDHklG64AWw2jW/aa7qf8AaKT0GbG5yNp1NtksJVevaVdm6eFdu/JSMCPVNvA0w8lHYA3Yjpp/3UHnh/aXn2DCHk8KRl12H1V/MpWRL+3PvGPJXHOPCyMxX7hZkMYA/mb+YD/dr1huRlI8jkdwP/wqr97k2ImlLt2bdB8xQchwXsDL4vkY8jlFwOVxTYSY0rFSuureZD9PWwbWvQcfj+Ewc2TksfHx4Z3VUMqotwi3so7vlVSPOxmH9ckEdhAIP4C9Sw5mKWsDGP0gA3/FhQcd+7GdDPw+JueQSRZJbFXa2xo2UrIx7BbSxNeVw5gI0N6+lY8gFbaMp6jqDWXne3vaWY5kzOGxZpW+plRI2J8SpSg8JXLHfT/ux316hL+23t3KlcjHbDUi6iDJJCj4S+pU3/t17A2CD1MlpV6zCckk+Nl2flQeTNljvqXBxeT5eb7fisSXMlIJ2wqW0HUk9BXrMPs32jx6D0cOPIkTo+UryEnxDPt/KtXGmGPCIMVBBEuohhRY0HjtQWoOB4/9qPcWZjx5HIZMHHb7lsdw0syr2ErH5bnu3V0fH/tP7egT/wDa5mRmSkH6CIEF+nlXc3/1VtnkcwtYO1j36fnR9xksNdjnxbWghw/Y3svjMuLKgwvUlhO5DkSvKt+8xsdrfOlm9jeyJpDIeJQMxLERySqtyb/SHAtUzZLKoLq3iNCKacxL3U7bdQKCMeyPZisjrxECMrXG5pGBt2FWkIPzqTI9le0Mgl24jGDMSSU3RjXwjZQKY3IoAANT40DlV7VNBTj/AG/9pRyFjxaOO55piPkN9bH9l9vR4z4sXE4axNH6ZT0lAZetmIFzr43qr/do+tjTW5NHFtaC9xPB+3uFlfK4vjocbIlAEjpc2t+neW2/KtR+S6hj101Ncucw9F0FJ96/6tO4UG+/MJH5Vt8L1Xk5ycEmNDfs2tWT91CfrhVj304ZkS/RGo/Ggu4vI5000r5cYaJlCxpNZlGt91tanmx+Iy8yLOyMLHlzIR/SyXiUyL8DbTwrL+7U/wAoHzNNOWB0/Kg6ZswW8737qrS5wAurVz7ZDt0v8TSEyP1Y/jQbX90YHzG4/CpByaSAqoJPw0rBCgddfGnhwP59vwoNuK571q4k/prYsSPGudGYi6bibeJqNsvf/OfzoOil5REBBPwqic/1nBN/C9ZDTMPp3nxPSgS5HjY9ooOkh5B0FgoFqkPIM5DuqMw6bgDp3C9cwJZ++1SDJdRrc/AXoN+aHic1dmdgY0ynXbJFGwBPaLjQ1ynOe0fYUcj8hlR/YQgAyCBjHEANL2vtUm/Ttqyc2ZPMibiD0Ygf41Ty+F4r3ZjHH5bIIQMHWGNtpVlH1qfn3UHnHN5HtBdfbs2UzAgFJrGO3awZlDVlLljvr2OD9s/ZCRqrYTyEC28zygn/ADeVgL03I/av2bMtoVysVr/VHOW+VpQ4oNITZd7nLYDuAXT8Vp5yMux2ZWvZvUNb8AKKKBrTZrxlJJo2J7Qrp/8Aa1VhBL3p8QZP/E1FFA0407MP6iBe0ak05sU6WN/jY0UUCfbt0BW3j1/KlEMym5ZD4BSP8TRRQKwm6BvwFNCynQn8Qf8AZRRQKIe15Cfl0p3pL/5rH/UKKKBrRX09TT/RUf2iudZGI7h5aKKBPsQOl/mxpv2cuovp8/8AGiigfHjSRghWOvUbjapIsdk6KNevmP8AjRRQWQNArKCO6gwQt1jHy0/hRRQHoIB5UF/Ek/41G0BJveiiga2Ox0FvHWozisTo1j33/wBtFFAxsB2NzKab/b27XB/GiigT7B+wg/jSfZSDsB+dFFAfZyjoB+IpftZu4fjRRQH2s3eKPtZfCiigb9nJ2kflSjFk8PxoooHDHbw/Gl+3bvFFFAv2z/r/ADpPtW/X+dFFAn2h/XakOI36qKKBDhN+r8DSriyL0P50UUDhFKOtz86UI/6TRRQOCd4Ip+xT2EfGiigX0Yj9Sg/GmNhwMdwOxul1t0+d6KKBkWF6F/SyJV69HsNfDpVpGyU6ZbnwY3oooP/Z');

        let geometry = new THREE.SphereGeometry( 3, 64, 48 );
        let material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
            emissive: 0x000000,
            roughness: 1,
            metalness: 1,
            map: texture
        } );
        window.globe = new THREE.Mesh( geometry, material );
        window.globe.rotation.z = Math.PI;
        window.globe.rotation.y = 1.5;
        scene.add( globe );

        let light = new THREE.PointLight( 0xffffff, 3.33, 0 );
        light.position.set( 150, -150, 1500 );
        scene.add( light );

        let light2 = new THREE.PointLight(0xffffff, 2, 0);
        light2.position.set(-125, 100, -500);
        scene.add(light2);

        camera.position.z = 345;
        document.body.appendChild(renderer.domElement);
        window.gl = window.renderer.context;
        window.pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);

        render();

    }

    init()

    function render() {
        requestAnimationFrame(render);
        window.globe.rotation.y -= 0.01;
        window.renderer.render(window.scene, window.camera);
        window.gl.readPixels(0, 0, window.WIDTH, window.HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        let text = grayscale10(window.pixels).map(asciify).join("");
        text = text.split("\n").map(reverseString).join("\n");
        window.outputEl.innerHTML = text;
    }

    function reverseString(str) {
        return str.split("").reverse().join("");
    }

    function grayscale10(pixels) {
        let length = pixels.length;
        let gsPixels = [];
        for (let i = 0; i < length; i += 4) {
            gsPixels.push(
                Math.floor(
                    (pixels[i] +
                        pixels[i+1] +
                        pixels[i+2]) /
                    768 * window.ASCII.length
                )
            );
        }
        return gsPixels;
    }

    function asciify (val, index) {
        let br = "";
        if(
            index !== 0 && // exclude first row
            index % window.WIDTH === 0
        ) {
            br = "\n";
        }
        return br + window.ASCII[val];
    }

}

