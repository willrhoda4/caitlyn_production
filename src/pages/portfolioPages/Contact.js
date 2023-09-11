








import Email        from './contactPages/Email.js';
import Social       from './contactPages/Social.js';
import Secure       from './contactPages/Secure.js';


import ButtonBank   from '../../components/ButtonBank.js';



import { useState } from 'react';

// contact page for sending emails, social media links, and secure messaging.
// second-last page in the portfolio.
export default function Contact ({animation, newStatus}) {


    const [ contactMode,    setContactMode ] = useState('email');
   

    return (

    // wrapper div for the entire page.
    <div className={`   w-full h-full 
                        flex flex-col
                        ${ animation === 'vanishing' ? 'animate-slideOutUp' : 'animate-slideInDown'}
                   `}
    >
        {/* top 10% is for navigation */}
        <div className='w-full h-[10%]
                        flex items-center justify-center
                       '
        >
            <ButtonBank
                names={      [                       'email',                       'social',                       'secure'    ]  }
                onClicks={   [  () => setContactMode('email'), () => setContactMode('social'), () => setContactMode('secure')   ]  }
                currentState={  contactMode                                                                                        }
            />
        </div>


        {/* bottom 90% is for the content */}
        <div className='w-full h-[90%] flex items-center justify-center'>
            {
                    contactMode === 'social'    ?   <Social />
                :   contactMode === 'secure'    ?   <Secure />
                :                                   <Email  newStatus={newStatus}/>
            }
        </div>

       
    </div>)
}

