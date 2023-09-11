




import Portfolio         from './pages/Portfolio.js';
import Editor            from './pages/Editor.js';
import Unsubscribe       from './pages/utilityPages/Unsubsrcibe.js';
import ErrorBoundary     from './pages/utilityPages/ErrorBoundary.js';

import                        './index.css'

import {  Route,
          Routes }       from 'react-router-dom';

import {  Helmet }       from 'react-helmet';


// the mother component.
function App() {


  // This function is passed to the pages that need to display a status message.
  // It takes a setter function, a status message, an optional id, and an optional delay.
  // To block the status message from fading out, pass a falsy value for delay => newStatus(setter, status, undefined, false).
  function newStatus(setter, status, id='statusGraf', duration = 4000) {

    
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
  
  
  
  
  
  



  return (
  
  <>
  
    <Helmet>

      <title>Caitlyn Gowriluk - journalist</title>
      <meta name="description" content="Caitlyn Gowriluk is a Canadian digital journalist working as an online reporter for CBC Manitoba." />
      <link rel="canonical"    href="https://www.caitlyngowriluk.com/" />
      <link rel="alternate"    href="https://www.caitlyngowriluk.ca/" hreflang="en-ca" />

    </Helmet>

    <div       id='app' 
        className={`
                    flex justify-center items-center 
                    w-full h-full
                  `}
    >

      <ErrorBoundary>

        <Routes>

          <Route path='/'                element={<Portfolio         newStatus={newStatus}  />}  />  
          <Route path='/copyeditor'      element={<Editor            newStatus={newStatus}  />}  />
          <Route path='/unsubscribe'     element={<Unsubscribe       newStatus={newStatus}  />}  />
        
        </Routes>
        
      </ErrorBoundary>

    </div>

  </>);
}

export default App;
