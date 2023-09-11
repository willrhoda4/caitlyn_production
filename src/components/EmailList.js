







import   Axios                  from 'axios';
import { useState, 
         useEffect   }          from 'react';


import   iconDelete             from '../images/icon_trash.svg';
import   iconNote               from '../images/icon_note.svg';







// displays the email list in the admin panel.
export default function EmailList ({emailList, setEmailList, styles, newStatus, setStatus}) {


    const [  showTips, setShowTips  ] = useState([]);

    const {  wrap, graf, scroller   } = styles;



    // retrieves the email list from the database.
    // run this function on inital page load and store data in emailList.
    function getEmailList () {

        return   Axios.get( 'http://localhost:3000/getEmailList'    )
                     .then( res => setEmailList(res.data)           )
                    .catch( err => console.log(err.message)         );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { getEmailList() }, [])




    // returns a single email-list item.
    function emailItem (email, index) {

        // delete an email from the email list.
        // clicking the trashcan icon triggers a confirmation message.
        function deleteEmail () {

            let warning = `Are you sure you want to delete ${email.email} from your list?`;
            
            if (window.confirm(warning)) {

                return  Axios.post('http://localhost:3000/deleteData',   ['emails', 'email', email.email])
                             .then( res => {
                                                newStatus( setStatus, 'email successfully deleted' );
                                                getEmailList();
                                           }
                                  )
                            .catch( err => newStatus( setStatus, err.message ) );
            }
        }

        return (

            // email list item
            <div      key={index}
                className={`
                            w-full h-fit
                            flex items-center justify-between 
                            py-2
                        `}
            >

                {/* click  email to copy to clipboard. text appears red for unsubscribed*/}
                <p  className={`
                                    hover:cursor-pointer
                                    ${ email.subscribed ? 'text-black' : 'text-red-300'}
                             `}
                      onClick={ () =>  {
                                            navigator.clipboard.writeText(email);
                                            newStatus(setStatus, 'email copied to clipboard'); 
                                       }
                              }
                >{ email.email}</p>


                <div className='flex'>  

                   {/*  if user has unsubscribed and left a note, display an icon*/}
                    {   !email.subscribed && email.notes &&
                        
                        // hover over note icon to see note.
                        // we make this work by toggling the email's index in the showTips array.
                        <div className='relative'>
                            <img    alt='note icon' 
                                    src={iconNote}
                                    onMouseEnter={ () => {
                                                                  const updatedTooltips        = [...showTips];
                                                                        updatedTooltips[index] = true;
                                                            setShowTips(updatedTooltips);
                                                         } 
                                                 }
                                    onMouseLeave={ () => {
                                                                  const updatedTooltips        = [...showTips];
                                                                        updatedTooltips[index] = false;
                                                            setShowTips(updatedTooltips);
                                                         } 
                                                 }
                                    className={`h-full p-2 hover:cursor-pointer`}
                            />

                            {/* conditonally display note*/}
                            {   showTips[index] && 
                            
                                <p className={` absolute bottom-full right-full 
                                                w-40 z-50
                                                rounded-lg 
                                                border border-gray-300 
                                                bg-white 
                                                px-5 py-2.5
                                                text-center text-sm font-medium text-gray-700 
                                                shadow-sm shadow-inner
                                            `}>{email.notes}</p>
                            }
                        </div>
                    }

                    {/* click trashcan to delete email from list */}
                    <img    alt='trashcan icon' 
                            src={iconDelete}
                            onClick={deleteEmail}
                            className={`h-[70%] p-2 hover:cursor-pointer`}
                            />
                </div>
            </div>
        )
    }



    return  <>
                {   
                    emailList.length > 0 &&   
                    
                        <div className={wrap}>

                            <p className={graf}>Email List</p>
                            
                            <div className={scroller}>
                                    { emailList.length > 0 && emailList.map((email, index) => emailItem(email, index) ) }
                            </div>

                        </div>
                }
            </>
}