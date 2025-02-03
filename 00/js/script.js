var card = {
   wrapperEl: document.querySelector(".pfc__wrapper"),
   heightWhenClosed: '15.625rem',
   isOpen: false,

   toggleOpenState: (status) => {
      card.wrapperEl.classList.toggle('closed')

      if (status === true) {
         card.wrapperEl.style.maxHeight = card.wrapperEl.scrollHeight + 'px'
         card.isOpen = true;
      }
      else {
         card.wrapperEl.style.maxHeight = card.heightWhenClosed
         card.isOpen = false
      }
   }
}

var clock = {
   hourEl: document.getElementById('__hour'),
   minuteEl: document.getElementById('__minute'),
   secondEl: document.getElementById('__second'),

   startClock: function() {
      const now = new Date();

      this.hourEl.textContent = now.getHours().toString().padStart(2, '0');
      this.minuteEl.textContent = now.getMinutes().toString().padStart(2, '0');
      this.secondEl.textContent = now.getSeconds().toString().padStart(2, '0');

      setTimeout(() => this.startClock(), 1000);
   }
}


document.addEventListener("DOMContentLoaded", (e) => {
   
   // card expand/collapse function
   card.wrapperEl.addEventListener("click", (e) => {
      if (e.target.tagName !== 'A' && !card.isOpen) {
         card.toggleOpenState(true)
      }
   })

   // collapse on click outside
   document.body.addEventListener("click", (e) => {
      if (e.target.tagName === 'BODY' && card.isOpen) {
         card.toggleOpenState(false)
      }
   })

   // start clock
   clock.startClock()
});
