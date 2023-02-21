




import   Axios       from 'axios';
import { useState }  from 'react';
import   Button      from '../../components/Button';
import   Input       from '../../components/Input';



export default function Unsubscribe({newStatus}) {

    const [ reasonWhy,       setReasonWhy    ] = useState('');
    const [ status,          setStatus       ] = useState('');
    const [ unsubscribed,    setUnsubscribed ] = useState(false);


    const id    = new URLSearchParams(window.location.search).get('id'); 
    const token = new URLSearchParams(window.location.search).get('token'); 



    function unsubscribe (resubscribing) {  console.log(resubscribing);

        resubscribing = !!resubscribing;  

        const notice          = !resubscribing ? `Removing name from mailing list...`
                                               : `Reinstating email address...`;

        const confirmation    = !resubscribing ? `You're officially unsubscribed`
                                               : `Subscription reinitiated. Welcome Back!`;

        newStatus(setStatus, notice);


        const reqBody = [
                              'emails',
                            [ 'subscribed'     ],
                            [  resubscribing   ],
                            [
                                [ 'id',          id    ],
                                [ 'email_token', token ]
                            ]
                        ];


        if (reasonWhy && !unsubscribed)  {
                                            reqBody[1][1] = 'notes';
                                            reqBody[2][1] = reasonWhy;
                                         }

                                         console.log(reqBody);

        Axios.put('http://localhost:3000/updateData', reqBody      )
            .then(  res => {    newStatus(setStatus, confirmation, 4000);
                                setUnsubscribed(!resubscribing);
                           }
                 )
           .catch(  err => {    newStatus(setStatus, 'Looks like there was a database error. Please try again later.', 4000)
                           }
                 );
    }


    return  (

        <div className={`
                            flex flex-col 
                            items-center justify-center
                            w-[100vw] h-[100vh]
                        `}
        
        >
            <p>Sorry to see you go! Feel free to let me know what the problem was before you check out.</p>

            <Input 
                    type='textArea'
                    state={reasonWhy}
                    setter={setReasonWhy}
                />

            {
                !unsubscribed ?     <Button
                                        name='unsubscribe'
                                        onClick={() => unsubscribe()     }
                                    />

                              :     <Button
                                        name='resubscribe'
                                        onClick={() => unsubscribe(true) }
                                    />
            }
            <p id='statusGraf'>{status}</p>
        </div>
    )
    
}    