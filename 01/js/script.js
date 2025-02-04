import { genHex } from "./utils.js";
import { MAXIMUM_POINTS } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
   
   var cg = {
      wrapperEl: document.querySelector('.cg__wrapper'),

      infoModal: {
         isOpen: true,
         wrapperEl: document.querySelector('.cg__infoModal'),

         heading:  {
            el: document.querySelector('.cg__infoModal__head'),
            text: {
               default: `
                  guess the right color and score points. 
                  <br /> 
                  <br /> 
                  ${MAXIMUM_POINTS} straight points to win or loose 
               `,
               game_won: `${MAXIMUM_POINTS} correct guesses. you won!`,
               game_lost: 'you guessed all wrong! game over.'
            }
         },

         CTA: {
            el: document.querySelector('.cg__infoModal__CTA'),
            text: {
               default: 'start game',
               restart: 'restart game',
               continue: 'continue game'
            }
         },

         toggle: (status) => {

            if (status === 'default') {
               cg.infoModal.heading.el.innerHTML = cg.infoModal.heading.text.default
            }
            
            cg.infoModal.isOpen = !cg.infoModal.isOpen
            cg.infoModal.wrapperEl.classList.toggle('closed')
         }
      },

      game:{
         isTransitioning: false,
         wrapperEl: document.querySelector('.cg__game'),

         status: {
            el: document.querySelector('.cg__status'),
            text: {
               default: 'guess the color on the screen',
               correct: 'you guessed right',
               wrong: 'you guessed wrong'
            },
            toggle: (status) => {
               status === 'correct' 
                  ? cg.game.status.el.textContent = cg.game.status.text.correct
                  : status === 'wrong'
                     ? cg.game.status.el.textContent = cg.game.status.text.wrong
                     : cg.game.status.el.textContent = cg.game.status.text.default
            }
         },

         score: {
            wins: 0,
            losses: 0,
            displayEl: document.getElementById('points'),
            displayElState: document.getElementById('pointsNumber'),

            increaseWins: ()  => {
               cg.game.score.wins++
            },

            increaseLosses: () => {
               cg.game.score.losses++
            },

            updateDisplay: () => {
               cg.game.score.displayEl.textContent = cg.game.score.wins
               
               if (cg.game.score.wins > 0) {
                  cg.game.score.displayElState.textContent = 's'
               }
            }
         },

         colors: {
            guesses: [],
            target: null
         },

         actionBtns: {
            reset: document.querySelector('.cg__resetBtn'),
            info: document.querySelector('.cg__infoBtn'),
         },

         colorBtns: {
            els: Array.from(document.querySelectorAll('.cg__colorBtn')),
            
            showColors: (eventSrc) => {
               if (eventSrc.dataset.color === cg.game.colors.target) {
                  
                  // show correct color
                  eventSrc.classList.add('correct')      
               }
               else {
                  // show correct & wrong color
                  eventSrc.classList.add('wrong')
                    
                  cg.game.colorBtns.els
                     .find(el => el.dataset.color === cg.game.colors.target)
                     .classList.add('correct')
               }
            },

            hideColors: () => {
               cg.game.colorBtns.els.forEach(btn => {
                  btn.classList.remove('correct', 'wrong')
               })
            }
         },

         reset: () => {
            cg.game.score.wins = 0
            cg.game.score.losses = 0

            cg.game.score.updateDisplay()
            cg.game.genColors()
         },

         genColors: async () => {

            // iterate over colorBtns, gen random color (in hex) for each. add event too
            cg.game.colors.guesses = cg.game.colorBtns.els.map((btn, idx) => {
               let randomColor = genHex()

               // set color value in data attribute, and css variable
               btn.dataset.color = randomColor
               btn.style.setProperty('--bg-color', randomColor)

               return randomColor
            })

            // randomly select & set one color as target colors and bg css variable 
            cg.game.colors.target = cg.game.colors.guesses[
               Math.floor(Math.random() * cg.game.colors.guesses.length)
            ]

            document.body.style.setProperty('--target-color', cg.game.colors.target)

         },

         handleGuess: (guessedColor, eventSrc) => {

            if (!cg.game.isTransitioning) {

               // change game state
               cg.game.isTransitioning = true

               cg.game.colorBtns.showColors(eventSrc)

               guessedColor === cg.game.colors.target
                     ? cg.game.status.toggle('correct')
                     : cg.game.status.toggle('wrong')
               
               setTimeout(() => {
                  cg.game.colorBtns.hideColors(eventSrc)
               }, 1000);

               setTimeout(() => {
                  guessedColor === cg.game.colors.target
                     ? cg.game.score.increaseWins()
                     : cg.game.score.increaseLosses()

                  cg.game.score.updateDisplay()

                  // end game if max points is hit
                  if (
                     cg.game.score.losses === MAXIMUM_POINTS || 
                     cg.game.score.wins === MAXIMUM_POINTS
                  ) {
                     cg.end()
                  }
                  else {
                     cg.game.status.toggle('default')

                     // regenerate colors for another round
                     cg.game.genColors()
                  }

                  
                  // change game state
                  cg.game.isTransitioning = false

               }, 1200)
            }
         }
         
      },

      init: async () => {
         await cg.game.genColors()
      },

      end: () => {
         // update game status
         cg.game.status.toggle('default')

         // update modal heading text
         cg.game.score.wins > cg.game.score.losses 
            ? cg.infoModal.heading.el.textContent = cg.infoModal.heading.text.game_won
            : cg.infoModal.heading.el.textContent = cg.infoModal.heading.text.game_lost

         // update modal button text
         cg.infoModal.CTA.el.textContent = cg.infoModal.CTA.text.restart

         cg.infoModal.toggle()

         // reset game (in bg)
         cg.game.reset()
      }
   }



   // register events
   cg.infoModal.CTA.el?.addEventListener('click',() => {
      cg.infoModal.toggle('default')
   })
   
   cg.game.colorBtns.els.forEach(btn => {
      btn.addEventListener('click', (e) =>
         cg.game.handleGuess(btn.dataset.color, e.target)
      )
   })

   cg.game.actionBtns.reset
      .addEventListener('click', cg.game.reset)
   cg.game.actionBtns.info
      .addEventListener('click', () => {
         cg.infoModal.CTA.el.textContent = cg.infoModal.CTA.text.continue
         cg.infoModal.toggle()
      })

      

   // esc key listener
   document.body.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && cg.infoModal.isOpen) {
         cg.infoModal.toggle();
      }
   })



   // initialize game
   cg.init()
});
