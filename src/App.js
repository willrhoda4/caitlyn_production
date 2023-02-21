




import Portfolio         from './pages/Portfolio.js';
import Editor            from './pages/Editor.js';
import NewsletterEditor  from './pages/landingPages/NewsletterEditor.js';
import PublishNewsletter from './pages/landingPages/PublishNewsletter.js';
import Unsubscribe from './pages/landingPages/Unsubsrcibe.js';

import './index.css'

import {  Route,
          Routes }       from 'react-router-dom';


function App() {


  function newStatus(setter, status, delay, id) {

    const elementId  = !id ? 'statusGraf' : id;

    const animateIn  = 'animate-fadeIn';
    const animateOut = 'animate-fadeOut';

    const element = document.getElementById(elementId);
          element.classList.remove(animateOut);
     void element.offsetWidth;
          element.classList.add(animateIn);

    setter(status);

    if (delay) {
      
      setTimeout(() => {  

            element.classList.remove(animateIn);
       void element.offsetWidth;
            element.classList.add(animateOut);

      }, delay-400);

      setTimeout(() => setter(''), delay);
    }
  }


  return (

    <div id='app'>
      <Routes>
          <Route path='/'                element={<Portfolio         newStatus={newStatus}  />}  />  
          <Route path='/copyeditor'      element={<Editor            newStatus={newStatus}  />}  />
          <Route path='/newsletter'      element={<NewsletterEditor  newStatus={newStatus}  />}  />
          <Route path='/publish'         element={<PublishNewsletter newStatus={newStatus}  />}  />
          <Route path='/unsubscribe'     element={<Unsubscribe       newStatus={newStatus}  />}  />
      </Routes>

    </div>
  );
}

export default App;
