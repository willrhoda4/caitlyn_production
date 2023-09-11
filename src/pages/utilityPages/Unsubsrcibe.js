







import   Axios       from 'axios';
import { useState }  from 'react';
import { Helmet   }  from 'react-helmet';

import   Button      from '../../components/Button';
import   Input       from '../../components/Input';



// simple page to allow users to unsubscribe from the newsletter.
export default function Unsubscribe({newStatus}) {

    // state variables.
    // reasonWhy is the user's reason for unsubscribing.
    // status is the status message.
    // unsubscribed is a boolean that determines whether the user is unsubscribed or not.
    const [ reasonWhy,       setReasonWhy    ] = useState('');
    const [ status,          setStatus       ] = useState('');
    const [ unsubscribed,    setUnsubscribed ] = useState(false);


    // retrieves the id and token from the URL.
    const id    = new URLSearchParams(window.location.search).get('id'); 
    const token = new URLSearchParams(window.location.search).get('token'); 


    // unsubscribes the user from the newsletter.
    function unsubscribe(resubscribing) {  console.log(resubscribing);


        // if resubscribing is undefined, set it to false,
        // so we always send a boolean to the server.
        resubscribing = !!resubscribing;  

        // toggle status messsages according to resubscribing.
        const notice          = !resubscribing ? `Removing name from mailing list...`
                                               : `Resubscribing...`;

        const confirmation    = !resubscribing ? `You're officially unsubscribed.`
                                               : `Subscription renewed. Welcome Back!`;

        //update the status message and don't fade it out.
        newStatus(setStatus, notice, undefined, false);


        // set up the request body.
        const reqBody = [
                              'emails',
                            [ 'subscribed'     ],
                            [  resubscribing   ],
                            [
                                [ 'id',          id    ],
                                [ 'email_token', token ]
                            ]
                        ];

        // if the user is resubscribing, we don't need to send a reason why.
        // otherwise, add reasonWhy to the request body if they've included one.
        if (reasonWhy && !unsubscribed)  {
                                            reqBody[1][1] = 'notes';
                                            reqBody[2][1] = reasonWhy;
                                         }

                                         console.log(reqBody);


        // send the request.
        Axios.put('http://localhost:3000/updateData', reqBody      )
            .then(  res => {    
                                // update the status message and toggle unsubscribed.
                                newStatus(setStatus, confirmation);
                                setUnsubscribed(!resubscribing);
                           }
                 )              // if there's an error, update the status message.
           .catch(  err => {    newStatus(setStatus, 'Looks like there was a database error. Please try again later.');         console.log(err.message);
                           }
                 );
    }


    return  (<>
    

        <Helmet>
            <meta name="robots" content="noindex" />
        </Helmet>

        <div className={`
                            flex flex-col 
                            items-center justify-center
                            w-[100vw] max-w-2xl h-[100vh]
                        `}
        
        >
            {/* be gracious and give them a chance to say their piece. */}
            
            <p>Sorry to see you go! Feel free to let me know what the problem was before you check out.</p>

            <Input 
                    type='textArea'
                    state={reasonWhy}
                    setter={setReasonWhy}
            />

            {/* display a button based on unsubscribed */}
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
    </>)
    
}    