





import Input from "../../components/Input.js";
import Button from "../../components/Button.js";

import { useState, useEffect } from 'react';
import   Axios                 from "axios";




export default function Subscribe ({newStatus}) {

    const [ email,          setEmail        ] = useState('');
    const [ emailError,     setEmailError   ] = useState(false);
    const [ status,         setStatus       ] = useState(false);

    useEffect(() =>   { setEmailError(!(/\S+@\S+\.\S+/.test(email))); }, [email]    );

    function subscribe () {

        if (emailError) { return newStatus(setStatus, 'be sure to provide a valid address...', 4000); }

        newStatus(setStatus, 'registering email...')

        return Axios.post('http://localhost:3000/subscribe',    [email] )
                    .then( res => { 
                                        const duplicate = 'duplicate key value violates unique constraint "unique_email"';
                                            console.log(res);
                                         if (typeof res.data !== 'string'  ) { return newStatus(setStatus, 'successfully subscribed!', 4000);     }
                                    else if (       res.data === duplicate ) { return newStatus(setStatus, 'you\'re already subscribed!', 4000);  }
                                    else {                                     return newStatus(setStatus, `ran into this problem: ${res.data}`); }  

                                  } )
                    .catch( err => newStatus(setStatus, err.message) );
    }



    return (
    
        <div className={`h-full w-full
                         flex flex-col justify-center items-center
                        `}
        >
            <p>Want to stay current with my stories? Subscribe to monthly roundups of my writing. I'll never share your email address.</p>

            <Input 
                type='text' 
                state={email}
                setter={setEmail}
                error={emailError}
            />

            <Button
                name='sign me up'
                onClick={subscribe}
            />
            {status}

        </div>
    )
}