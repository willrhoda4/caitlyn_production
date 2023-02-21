






import Email        from './contactPages/Email.js';
import Social       from './contactPages/Social.js';
import Secure       from './contactPages/Secure.js';


import ButtonBank   from '../../components/ButtonBank.js';



import { useState } from 'react';


export default function Contact ({animation, newStatus}) {

    const [ contactMode,    setContactMode ] = useState('email');
   
    

    return (

    <div className={`   w-full h-full 
                        flex flex-col
                        ${ animation === 'vanishing' ? 'animate-slideOutUp' : 'animate-slideInDown'}
                   `}
    >

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


        <div className='w-full h-[90%] flex items-center'>
            {
                    contactMode === 'social'    ?   <Social />
                :   contactMode === 'secure'    ?   <Secure />
                :                                   <Email  newStatus={newStatus}/>
            }
        </div>

       
    </div>)
}

