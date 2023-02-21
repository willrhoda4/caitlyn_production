



import   Input        from '../../../components/Input.js';
import   Button       from '../../../components/Button.js';

import   Axios        from 'axios';

import { useState, 
         useEffect  } from 'react';


export default function Email ({newStatus}) {



    const [ name,                setName             ] = useState('');
    const [ email,               setEmail            ] = useState('');
    const [ message,             setMessage          ] = useState('');    

    const [ nameError,           setNameError        ] = useState('');
    const [ emailError,          setEmailError       ] = useState('');
    const [ messageError,        setMessageError     ] = useState('');    

    const [ messageStatus,       setMessageStatus    ] = useState('');

    function newStatus(status) {

        const delay      =  3000; 
        const elementId  = 'statusGraf';

        const animateIn  = 'animate-fadeIn';
        const animateOut = 'animate-fadeOut';

        const element = document.getElementById(elementId);
              element.classList.remove(animateOut);
         void element.offsetWidth;
              element.classList.add(animateIn);
 
        setMessageStatus(status);

        setTimeout(() => {  

              element.classList.remove(animateIn);
         void element.offsetWidth;
              element.classList.add(animateOut);

        }, delay-400);

        setTimeout(() => setMessageStatus(''), delay);
    }

    useEffect(() => {

        const element = document.getElementById('statusGraf');
              element.classList.remove('animate-fadeIn');
         void element.offsetWidth;
              element.classList.add('animate-fadeIn');

      }, [messageStatus]);


    useEffect(() =>   { setNameError(name.length === 0);  },             [name]     );
    
    useEffect(() =>   { setMessageError(message.length === 0);  },       [message]  );

    useEffect(() =>   { setEmailError(!(/\S+@\S+\.\S+/.test(email))); }, [email]    );

    

    function sendMessage () {

        if ( nameError      ||
             emailError     ||
             messageError   ){ return newStatus(`Looks like you left a field blank or provided an invalid email address...`);    }
    
        else                 {        newStatus(`Delivering message...`);                                                         }
        
        

        Axios.post('http://localhost:3000/email', {
                                                        type: 'userEmail',
                                                        name: name,
                                                        email: email,
                                                        message: message
                                                  }
                  )
             .then(  res => {   console.log(res); 
                                newStatus(`Message successfully received!`) ;
                                setName('');
                                setEmail('');
                                setMessage('');  
                            })
             .catch( err => {   console.log(err); 
                                newStatus(err.message);                       
                            })

    }


    return (
        <form className='w-full h-full
                         flex flex-col items-center justify-center
                         animate-fadeIn
                        '
        >
             <Input
                type='text' 
                name='name' 
                state={name}
                setter={setName}
                error={nameError}
            /> 

            <Input 
                type='text'
                name='email' 
                state={email}
                setter={setEmail}
                error={emailError}
            />
                    
            
            <Input 
                type='textArea'
                name='message' 
                state={message}
                setter={setMessage}
                error={messageError}
            />

            <Button
                name='send email'
                onClick={sendMessage}
            />

            <p        id='statusGraf' 
               className={`
                            text-sm text-center 
                            px-10
                        `} 
            >{messageStatus}</p>
        </form>
    )
}