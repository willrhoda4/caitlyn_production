





import { useState }   from 'react';


import Awards         from './editorPages/Awards.js';
import Categories     from './editorPages/Categories.js';
import Stories        from './editorPages/Stories.js'
import EmailList      from './editorPages/EmailList.js';
import Profile        from './editorPages/Profile.js';

import ButtonBank     from '../components/ButtonBank.js';

import iconAwards     from '../images/icon_awards.svg';
import iconText       from '../images/icon_text.svg';
import iconStories    from '../images/icon_stories.svg';
import iconNewsLetter from '../images/icon_newsletter.svg';
import iconProfile    from '../images/icon_profile.svg';



export default function Editor ({newStatus}) {    console.log('The EDITOR status =>',newStatus)


  const [ currentPage, setPage ] = useState('stories');
  

  return (
      <>

        <h1 className='pl-4 pt-8 text-4xl font-serif'>caitlyngowriluk.com</h1>
        <h2 className='pl-4 text-2xl font-mono' >the edit suite</h2>

        <ButtonBank
                names={    [ 'stories',                 'categories',                 'awards',                 'emailList',               'profile'                 ]  }
                icons={    [  iconStories,               iconText,                     iconAwards,               iconNewsLetter,            iconProfile              ]  }
                onClicks={ [  ()=>setPage('stories'),    ()=>setPage('categories'),    ()=>setPage('awards'),    ()=>setPage('emailList'),  ()=>setPage('profile')   ]  }
                wrapStyle={   'pl-4'       }
                currentState={ currentPage }
        />

        {   currentPage === 'categories'  ?   <Categories newStatus={newStatus}  />
          : currentPage === 'awards'      ?   <Awards     newStatus={newStatus}  />
          : currentPage === 'emailList'   ?   <EmailList  newStatus={newStatus}  />
          : currentPage === 'profile'     ?   <Profile    newStatus={newStatus}  />
          :                                   <Stories    newStatus={newStatus}  />
        }

       
      </>
    );
  }
