





import { useState, useEffect } from 'react';

import Axios from 'axios';

import Button from '../../components/Button';
import Input  from '../../components/Input';




// spartan login page.
export default function Login ({setAuthenticated, newStatus}) {


    const [ password,           setPassword         ] = useState('');
    const [ passwordError,      setPasswordError    ] = useState(false);
    const [ passwordStatus,     setPasswordStatus   ] = useState('');

    // error-handling effect for input.
    useEffect( () => { setPasswordError(password.length === 0); }, [password] );


    // checks the password against the database.
    // if it's a match, set the authenticated state to true.
    // otherwise, display an error message.
    function login () {

        newStatus(setPasswordStatus, 'verifying password...')

        Axios.post(`${process.env.REACT_APP_API_BASE_URL}checkPassword`,  [password]    )
            .then( res => {
                                res.data === 'match' ? setAuthenticated(true)
                                                     : newStatus(   setPasswordStatus,  
                                                                    'invalid password'
                                                                )
                          }                                                             )
           .catch( err => newStatus(setPasswordStatus,  err.message)                    );
    }


    // generates a reset link and sends it to the user's email.
    function resetPassword () {

        newStatus(setPasswordStatus, 'generating reset link...')

        Axios.post(`${process.env.REACT_APP_API_BASE_URL}resetLink`                    )
            .then( res => newStatus(setPasswordStatus, 'Reset link delivered!', 4000)  )
           .catch( err => newStatus(setPasswordStatus,  err.message,            4000)  );

    }


    return (

        <div className='w-[100vw] h-[100vh] flex flex-col items-center justify-center border border-orange-300'>

            <Input
                name='password'
                type='text'
                state={password}
                setter={setPassword}
                error={passwordError}
                 wrapStyle={'w-[90%] max-w-[500px]'}
            />

            <div className='flex'>

                <Button
                    name='login'
                    onClick={login}
                />

                <Button
                    name='reset '
                    onClick={resetPassword}
                />

            </div>
            <p id='statusGraf'>{passwordStatus}</p>
        </div>
    )
}