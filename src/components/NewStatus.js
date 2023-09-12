







// This function is passed to the pages that need to display a status message.
// It takes a setter function, a status message, an optional id, and an optional delay.
// To block the status message from fading out, pass a falsy value for delay => newStatus(setter, status, undefined, false).
export default function newStatus(setter, status, id='statusGraf', duration = 4000) {

    
    // These are the CSS classes that animate the status message.
    const animateIn  = 'animate-fadeIn';
    const animateOut = 'animate-fadeOut';
  
    // find the element, force a repaint, add the animateIn class.
    const element    = document.getElementById(id);
  
    if (element) {

        // if the element exists, force a repaint and add the animateIn class.
        void element.offsetWidth;
        element.classList.add(animateIn);
    
        // then set the status message.
        setter(status);
    
        // if duration is falsy, don't fade out.
        if (duration) {

            // after a delay, remove the animateIn class and add the animateOut class.
            setTimeout(() => {
            
                element.classList.remove(animateIn);
                void element.offsetWidth;
                element.classList.add(animateOut);
            
            }, duration - 300);
            
            // finally, after another delay, remove the animateOut class and clear the status message.
            setTimeout(() => {
            
                element.classList.remove(animateOut);
                setter('');
            
            }, duration);

        }
    }
  }