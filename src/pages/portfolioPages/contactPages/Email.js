



import   Input        from '../../../components/Input.js';
import   Button       from '../../../components/Button.js';

import   Axios        from 'axios';

import { useState, 
         useEffect  } from 'react';


// contact component for sending emails.
export default function Email ({newStatus}) {



    const [ name,                setName             ] = useState('');
    const [ email,               setEmail            ] = useState('');
    const [ message,             setMessage          ] = useState('');    

    const [ nameError,           setNameError        ] = useState(false);
    const [ emailError,          setEmailError       ] = useState(false);
    const [ messageError,        setMessageError     ] = useState(false);    

    const [ errorsDisplayed,     setErrorsDisplayed  ] = useState(false);
    const [ messageStatus,       setMessageStatus    ] = useState('');

 



    // error-handling effects for form inputs.
    useEffect(() => { setNameError(name.length === 0);              }, [name]    );
      
    useEffect(() => { setEmailError(!(/\S+@\S+\.\S+/.test(email))); }, [email]   );
      
    useEffect(() => { setMessageError(message.length === 0);        }, [message] );







    // sends the email.
    function sendMessage () {



        setErrorsDisplayed(true);

        const inputError = `Looks like you left a field blank or provided an invalid email address...`;

        

        // if there are any errors, display the error message.
        // otherwise, make the request.
        if ( nameError      ||
             emailError     ||
             messageError   ){ return newStatus( setMessageStatus, inputError               );  }
    
        else                 {        newStatus( setMessageStatus, `Delivering message...`  );                                                           
        
    
            Axios.post('http://localhost:3000/email', {
                                                            type:   'userEmail',
                                                            name:    name,
                                                            email:   email,
                                                            message: message
                                                    }
                    )
                .then(  res => {    
                                    // if the message was successfully sent, display a success message and clear the form. 
                                    newStatus(setMessageStatus, `Message successfully received!`) ;
                                    setName('');
                                    setEmail('');
                                    setMessage('');  
                                })
                .catch( err => {   
                                    // if the message was not successfully sent, display an error message. 
                                    newStatus(setMessageStatus, err.message);                       
                                })
        }
    }


    return (
        <form className='h-full w-[90%] max-w-[800px] 
                         flex flex-col items-center justify-center
                         animate-fadeIn
                        '
        >
            <Input
                type='text' 
                name='name' 
                state={name}
                setter={setName}
                error={errorsDisplayed && nameError}
            /> 

            <Input 
                type='text'
                name='email' 
                state={email}
                setter={setEmail}
                error={errorsDisplayed && emailError}
            />
                    
            
            <Input 
                type='textArea'
                name='message' 
                state={message}
                setter={setMessage}
                error={errorsDisplayed && messageError}
            />

            <Button
                name='send email'
                onClick={sendMessage}
            />

            <p        id='statusGraf' 
               className={`
                            h-8
                            text-sm text-center 
                            px-10
                         `} 
            >{messageStatus}</p>
        </form>
    )
}