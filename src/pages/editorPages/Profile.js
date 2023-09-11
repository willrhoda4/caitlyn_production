







import { useState, 
         useEffect } from 'react';

import   Input       from '../../components/Input';

import   Button      from '../../components/Button';
import   Axios       from 'axios';



// misc page for toggling construction mode and updating the admin email.
// this is the address the contact form will send to.
export default function Profile ({newStatus}) {


    const [ newConstruction,    setNewConstruction    ] = useState(false);
    const [ ogConstruction,     setOgConstruction     ] = useState(false);
    const [ constructionStatus, setConstructionStatus ] = useState('');
    
    const [ email,              setEmail              ] = useState('');
    const [ emailError,         setEmailError         ] = useState(false);
    const [ emailStatus,        setEmailStatus        ] = useState('')

    useEffect(() =>   { setEmailError(!(/\S+@\S+\.\S+/.test(email))); }, [email]    );


    // load state on initial page load
    // we track the original construction state so we can compare it to the new state,
    // and only update the database if the new state is different.
    useEffect(() => {

        Axios.post(`${process.env.REACT_APP_API_BASE_URL}getData`, [      'misc', 
                                                                     [  [ 'description', 'construction','or' ],
                                                                        [ 'description', 'admin_email'       ] 
                                                                     ] 
                                                                   ] 
                  )
             .then( res => {
                                const constructionState = res.data.find(data => data.description === 'construction').active;
                                const emailState        = res.data.find(data => data.description === 'admin_email').value;

                                setOgConstruction(constructionState);
                                setNewConstruction(constructionState);
                                setEmail(emailState);
                           }                                        
                  )
            .catch( err => console.error(err)  );

    }, [])
    

    // update the admin email address.
    function updateEmail () {

        if (emailError) {   return newStatus(   setEmailStatus, 
                                                `Make sure you're providing a valid email addresss.`, 
                                                'emailStatus'
                                            );    
                        }

        else {

            Axios.put(`${process.env.REACT_APP_API_BASE_URL}updateData`, [     'misc',
                                                                            [  'value'  ], 
                                                                            [   email   ], 
                                                                            [ ['description', 'admin_email'] ]
                                                                         ]
                    )
                .then( res => console.log(res) )
               .catch( err => console.error(err) )
        }
    }


    // update the construction mode state.
    function updateConstruction () {

        // if the new state is the same as the old state, don't update the database.
        if (ogConstruction === newConstruction) { return newStatus( setConstructionStatus, 
                                                                    'This state is already engaged.', 
                                                                    'constructionStatus'
                                                                  );   
                                                }

        const warning = !newConstruction ? `Are you sure you want to take your website live by disabling construction mode?`
                                         : `Entering construction mode will take your website offline. Are you sure you want to proceed?`;

        if (window.confirm(warning)) {

            Axios.put(`${process.env.REACT_APP_API_BASE_URL}updateData`, [      'misc', 
                                                                            [   'active'         ], 
                                                                            [    newConstruction ], 
                                                                            [ [ 'description', 'construction' ] ] 
                                                                        ]
                                                                    )
                .then( res => setOgConstruction(newConstruction)    )
               .catch( err => console.error(err)                    )
        }
    }
    


    return (
        <div className='p-10'>

            <Input
                type='toggle'
                name='construction mode'
                state={newConstruction}
                setter={setNewConstruction}
                options={[ 'off', 'on' ]}
            />

            <Button
                name='update state'
                onClick={updateConstruction}
            />

            <p id='constructionStatus' className='h-[2em]'>{constructionStatus}</p>


            <Input
                type='text'
                name='email'
                state={email}
                setter={setEmail}
            />

            <Button
                name='update email'
                onClick={updateEmail}
            />

            <p id='emailStatus' className='h-[2em]'>{emailStatus}</p>

        </div>
    )
}