



import   Axios          from 'axios';
import { useState, 
         useEffect   }  from 'react';
import   Button         from '../../components/Button';
import   iconDelete     from '../../images/icon_trash.svg';
import   iconNote       from '../../images/icon_note.svg';




export default function EmailList ({newStatus}) {   console.log('The new status => ',newStatus);


    const [ emailList, setEmailList ] = useState([]);
    const [ showTips,  setShowTips  ] = useState([]);
    const [ status,    setStatus    ] = useState(false);



    function getEmailList () {

        return   Axios.get( 'http://localhost:3000/getEmailList'    )
                     .then( res => setEmailList(res.data)           )
                    .catch( err => console.log(err.message)         );
    }
    useEffect(() => { getEmailList() }, [])


    function sendPreview () {

        newStatus(setStatus, 'generating newsletter...');

        return   Axios.post('http://localhost:3000/generateNewsletter')
                        .then( res => {     
                                            console.log(res.data);
                                            let noStories = 'No new or scheduled stories to promote.';
                                            newStatus(setStatus, res.data === noStories ? noStories : 'preview delivered!', 4000);
                                    }  
                            )
                    .catch( err => newStatus(setStatus, err.message) );
    }


    function emailItem (email, index) {

        function deleteEmail () {

            let warning = `Are you sure you want to delete ${email} from your list?`;
            
            if (window.confirm(warning)) {

                return  Axios.post('http://localhost:3000/deleteData',   ['emails', 'email', email])
                             .then( res => {
                                                newStatus(setStatus, 'email successfully deleted', 4000);
                                                getEmailList();
                                           }
                                  )
                            .catch( err => newStatus(setStatus, err.message, 4000) );
            }
        }

        return (

            <div key={index}
                    className={`
                                w-full h-fit
                                flex items-center justify-between 
                                py-2
                            `}
            >
                <p  className={`
                                    hover:cursor-pointer
                                    ${ email.subscribed ? 'text-black' : 'text-red-300'}
                             `}
                      onClick={() => navigator.clipboard.writeText(email)}
                >{email.email}</p>

                <div className='flex'>  
                    {   !email.subscribed &&
                        
                        <div className='relative'>
                            <img    alt='note icon' 
                                    src={iconNote}
                                    onMouseEnter={() => {
                                        const updatedTooltips = [...showTips];
                                        updatedTooltips[index] = true;
                                        setShowTips(updatedTooltips);
                                    }}
                                    onMouseLeave={() => {
                                        const updatedTooltips = [...showTips];
                                        updatedTooltips[index] = false;
                                        setShowTips(updatedTooltips);
                                    }}
                                    className={`h-full p-2 hover:cursor-pointer`}
                            />
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
                    <img    alt='trashcan icon' 
                            src={iconDelete}
                            onClick={deleteEmail}
                            className={`h-[70%] p-2 hover:cursor-pointer`}
                            />
                </div>
            </div>
        )
    }


    function copyList () {

            navigator.clipboard.writeText(emailList.filter(email => email.email).join(', '));
            newStatus(setStatus, 'mailling list successfully copied', 4000);
    }
 
    return (
    
        <div className={`
                            h-full w-full
                            flex flex-col justify-center items-center
                            mt-10
                       `}
        >
            <div className='flex items-center'>

                <Button
                    name='generate preview'
                    onClick={sendPreview}
                />

                <Button
                    name='copy list'
                    onClick={copyList}
                />

            </div>

            <div className={`
                                 w-[80%] max-w-[600px] max-h-[400px]
                                 overflow-y-scroll
                                 border border-gray-300 
                                 bg-white 
                                 px-5 py-2.5 my-10
                                 text-sm font-medium text-gray-700 
                                 shadow-sm shadow-inner
                            `}
            >
                {emailList.length > 0 && emailList.map((email, index) => emailItem(email, index))}
            </div>
            <p id='statusGraf'>{status}</p>

        </div>
    )
}