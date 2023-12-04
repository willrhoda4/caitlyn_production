





import { useState, useEffect } from 'react';

import Axios  from 'axios';

import Button from '../../components/Button';
import Input  from '../../components/Input';



// simple page for resetting admin password
export default function PasswordReset ({setAuthenticated, newStatus}) {


    const [ password,           setPassword         ] = useState('');
    const [ passwordError,      setPasswordError    ] = useState(false);
    const [ passwordStatus,     setPasswordStatus   ] = useState('');

    // get the token from the reset url
    const token  = new URLSearchParams(window.location.search).get('token'); 


    useEffect( () => { setPasswordError(password.length < 8); }, [password] );




    function resetPassword () {

        // if the password is invalid, update the status message.
        if (passwordError) { return newStatus( setPasswordStatus, 'Make sure your new password is at least eight characters long.' ); }

        // otherwise, update the status message and send the password and token to the server.
        newStatus( setPasswordStatus, 'Storing new password. You should be redirected shortly...')

        Axios.post(`${process.env.REACT_APP_API_URL}resetPassword`,  [password, token]     )
             .then( res => {
                                // if the server returns an error message, update the status message.
                                if (res.data === 'invalid token'  ||
                                    res.data === 'expired token'  ){ newStatus(  setPasswordStatus,
                                                                                 res.data,
                                                                              )
                                                                   }    // otherwise, let them in
                                else                               { setAuthenticated(true); }
                           }                                                                   )
            .catch( err => newStatus( setPasswordStatus,  'there was an http error' )          );

    }


    return (

        <div className='w-[100vw] h-[100vh] flex flex-col items-center justify-center'>

            <Input
                name='new password'
                type='text'
                state={password}
                setter={setPassword}
                error={passwordError}
                password={true}
            />

            <Button
                name='reset password'
                onClick={resetPassword}
            />
            <p id='statusGraf'>{passwordStatus}</p>
        </div>
    )
}