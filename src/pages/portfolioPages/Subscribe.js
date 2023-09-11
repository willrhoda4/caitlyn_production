







import   Input           from "../../components/Input.js";
import   Button          from "../../components/Button.js";

import { useState, 
         useEffect   }   from 'react';
import   Axios           from "axios";



// simple page to allow users to subscribe to the newsletter.
export default function Subscribe ({newStatus}) {

    const [ email,          setEmail          ] = useState('');
    const [ emailError,     setEmailError     ] = useState(false);
    const [ errorDisplayed, setErrorDisplayed ] = useState(false);
    const [ status,         setStatus         ] = useState(false);


    // error-handling effect for input.
    useEffect(() => { setEmailError(!(/\S+@\S+\.\S+/.test(email))); }, [email])



    // adds event listener to email field to submit form when you smash the enter key
    useEffect(() => {

        let emailField = document.getElementById('emailInput');
        let submitBtn  = document.getElementById('submitButton');
     
        if (emailField) {    

            const handleKeyPress = e => {

                if (e.key === 'Enter') {

                    e.preventDefault();
                    submitBtn.click();
                }
            };
    
            emailField.addEventListener('keypress', handleKeyPress);
    
            return () => emailField.removeEventListener('keypress', handleKeyPress);
        }

    }, []);

    // sends the email address to the server.
    function subscribe () {

        // activate pink error border after first attempt to submit.
        setErrorDisplayed(true);
        
        // if the email address is invalid, return a status message.
        if (emailError) { return newStatus(setStatus, 'be sure to provide a valid address...'); }

        // otherwise, update the status message and send the email address to the server.
        newStatus(setStatus, 'registering email...', undefined, null)


        return Axios.post(`${process.env.REACT_APP_API_URL}subscribe`,    [email] )
                    .then( res =>   {      
                                            newStatus(setStatus, res.data);
                                    } )
                    .catch( err =>  {
                                            const message = err.response.data ? err.response.data : err.message;
                                            newStatus(setStatus, message);
                                    } );
    }

    const copy1 = `Join my email list.`
    
    const copy2 = `I send out monthly roundups of my stories, and I'll never share your address.`


    return (
    
        <div className={`h-full w-full
                         flex flex-col justify-center items-center
                       `}
        >
            <p className={`px-4 text-center`}>{copy1}</p>
            <p className={`px-4 text-center`}>{copy2}</p>

            <Input
                id='emailInput'
                type='text' 
                state={email}
                setter={setEmail}
                error={emailError && errorDisplayed}
                wrapStyle={'w-[90%] max-w-[500px]'}
            />

            <Button
                id='submitButton'
                name='sign me up'
                onClick={subscribe}
            />
            <p id='statusGraf' className='h-8'>{status}</p>

        </div>
    )
}