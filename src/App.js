



import                        './index.css'

import Portfolio         from './pages/Portfolio.js';
import Editor            from './pages/Editor.js';
import Unsubscribe       from './pages/utilityPages/Unsubsrcibe.js';
import ErrorBoundary     from './pages/utilityPages/ErrorBoundary.js';

import newStatus    from './components/NewStatus.js';

import {  Route,
          Routes }       from 'react-router-dom';

import {  Helmet }       from 'react-helmet';


// the mother component.
function App() {

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
