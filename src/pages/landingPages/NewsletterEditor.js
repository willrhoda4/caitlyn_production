





import EmailStoryPreview from '../../components/EmailStoryPreview';
import Button from '../../components/Button';

import { useState, useEffect } from 'react';
import   Axios      from 'axios';
import iconAddStory from '../../images/icon_upload.svg';

export default function NewsletterEditor ({newStatus}) {

    const [ data,           setData             ] = useState([]);
    const [ status,         setStatus           ] = useState(false)
    const [ storyList,      setStoryList        ] = useState([])

    
    // function newStatus (status) {

    //     setUpdateStatus(status);
    //     setTimeout(() => setUpdateStatus(false), 3000);
    // }



    function getStoryList () {

        return   Axios.post( 'http://localhost:3000/getData', ['archive', null, { orderBy: 'date' }]    )
                     .then( res => {setStoryList(res.data); console.log(res.data) }                     )
                    .catch( err => console.log(err.message)                                             );
    }
    useEffect(() => { getStoryList() }, [])




    function getScheduledStories () {

        return  Axios.post('http://localhost:3000/scheduledStories'            )
                    .then( res => {console.log(res.data);  setData(res.data)}  )
                   .catch( err =>  console.log(err)                            );
    }
    useEffect(() => { getScheduledStories() }, [])




    function sendPreview () {

        newStatus(setStatus, 'delivering revised preview...')

        return  Axios.get('http://localhost:3000/reviseNewsletter')
                    .then( res => {     console.log(res.data);  
                                        newStatus(setStatus, 'revised preview delivered!', 4000);
                                  }  
                         )
                   .catch( err => newStatus(setStatus, err.message) );
    }




    function archiveStory (story) {

        function addStory () {

            let warning = `Are you sure you want to add ${story.headline} to this month's newsletter?`;
            
            if (window.confirm(warning)) {

                newStatus(setStatus, 'adding story...');

                return  Axios.post('http://localhost:3000/addData',   ['next_email', ['article_id'], [story.article_id] ])
                             .then( res => {
                                                console.log(res.data);
                                                let duplicate = 'duplicate key value violates unique constraint "next_email_pkey"';

                                                if (res.data === duplicate) { return newStatus(setStatus, 'this story is already included', 4000); }
                                              
                                                getStoryList();
                                                getScheduledStories();

                                                newStatus(setStatus, 'story successfully added!', 4000);
                                           }
                                  )
                            .catch( err => newStatus(setStatus, err.message, 4000) );
            }
        }
        return (

            <div
                  className={`
                                w-full h-fit
                                flex items-center justify-between 
                                py-2
                           `}
            >
                <p>{story.headline}</p>
                <img alt='trashcan icon' 
                     src={iconAddStory}
                     onClick={addStory}
                     className={`h-[70%] pl-4 hover:cursor-pointer`}
                />
            </div>
        )

    }
    return (
        <div className='
                        flex flex-col items-center
                        my-10
        
                        '
        >
            {   data.length > 0 && data.map( (story, index) =>  <EmailStoryPreview 
                                                                    key={story.article_id}
                                                                    data={data[index]} 
                                                                    index={index}
                                                                    loadData={getScheduledStories}
                                                                    newsletterLength={data.length}
                                                                />  
                                           )
            }
            <Button name='send new preview' onClick={sendPreview} />
            <p id='statusGraf' className='py-4'>{status}</p>
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
                {storyList.length > 0 && storyList.map(story => <div key={story.article_id}>{archiveStory(story)}</div>)}
            </div>
        </div>
    )


}