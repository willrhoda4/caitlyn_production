





import { useState }   from 'react';

import { Helmet   }   from 'react-helmet';


import Awards         from './editorPages/Awards.js';
import Categories     from './editorPages/Categories.js';
import Stories        from './editorPages/Stories.js'
import Mailer         from './editorPages/Mailer.js';
import Profile        from './editorPages/Profile.js';
import Login          from './editorPages/Login.js';
import PasswordReset  from './utilityPages/PasswordReset.js';

import ButtonBank     from '../components/ButtonBank.js';

import iconAwards     from '../images/icon_awards.svg';
import iconText       from '../images/icon_text.svg';
import iconStories    from '../images/icon_stories.svg';
import iconNewsLetter from '../images/icon_newsletter.svg';
import iconProfile    from '../images/icon_profile.svg';


// container component for copyeditor interface.
export default function Editor ({newStatus}) {   


  const [ currentPage, setPage ] = useState('stories');

  const [ authenticated, setAuthenticated ] = useState(false);

  const token  = new URLSearchParams(window.location.search).get('token'); 

  if (newStatus) throw new Error('This is a test error for the error boundary.');


  return (<>

  
    <Helmet>
          <meta name="robots" content="noindex" />
    </Helmet>
    
    
    
    <div className={` flex flex-col
                              w-full h-full
                  `}
    >
  
      {/* if they aren't authenticated and they don't have a token,  give them a chance to log in.
          if they've got a token, give them a chance to reset that password. */}
      { !authenticated ? !token ? <Login         setAuthenticated={setAuthenticated} newStatus={newStatus} />
                                : <PasswordReset setAuthenticated={setAuthenticated} newStatus={newStatus} />
                                
                                :  <>
                                      {/* simple header  */}

                                        <h1 className='pl-4 pt-8 text-4xl font-serif'>caitlyngowriluk.com</h1>
                                        <h2 className='pl-4 text-2xl font-mono' >the edit suite</h2>

                                        {/* button bank for switching between pages */}
                                        <ButtonBank
                                                names={    [ 'stories',                 'categories',                 'awards',                 'mailer',               'profile'                 ]  }
                                                icons={    [  iconStories,               iconText,                     iconAwards,               iconNewsLetter,         iconProfile              ]  }
                                                onClicks={ [  ()=>setPage('stories'),    ()=>setPage('categories'),    ()=>setPage('awards'),    ()=>setPage('mailer'),  ()=>setPage('profile')   ]  }
                                                wrapStyle={   'pl-4'       }
                                                currentState={ currentPage }
                                                />

                                      {/* page content */}
                                      {   currentPage === 'categories'  ?   <Categories newStatus={newStatus}  />
                                        : currentPage === 'awards'      ?   <Awards     newStatus={newStatus}  />
                                        : currentPage === 'mailer'      ?   <Mailer     newStatus={newStatus}  />
                                        : currentPage === 'profile'     ?   <Profile    newStatus={newStatus}  />
                                        :                                   <Stories    newStatus={newStatus}  />
                                      }

                                  </>
      }

    </div>

  </>);
  }
