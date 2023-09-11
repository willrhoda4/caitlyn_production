







import   Axios                  from 'axios';

import { useState }            from 'react';    

import   EmailStoryPreview      from './EmailStoryPreview';
import   Button                 from './Button';

import   iconDelete             from '../images/icon_trash.svg';
import   iconAddStory           from '../images/icon_addStory.svg'







// component for building the newsletter.
// it lives in the admin panel, under the email list,
// but it doesn't emerge until it's summoned.
// it displays the archive and stories for the next newsletter.
export default function NewsletterBuilder ({    stories, 
                                                setStories, 
                                                archive, 
                                                setArchive, 
                                                newStatus, 
                                                setStatus, 
                                                styles,
                                                emailList
                                            }) {


    
    // deliveryStatus is a second status message that appears below the newsletter.
    // published is a boolean that determines whether or not the newsletter has been published yet.                                          
    const [ deliveryStatus, setDeliveryStatus ] = useState('');
    const [ published,      setPublished      ] = useState(false);


    // destructures styles from props.
    const { wrap, graf, scroller } = styles;



    // returns a single archive-list item.
    function archiveItem (story, index) {

        // deletes a story from the archive.
        // clicking the trashcan icon triggers a confirmation message.
        function deleteStory () {

            let warning = `Are you sure you want to delete this story from your list?`;
            
            if (window.confirm(warning)) {

                return  Axios.post('http://localhost:3000/deleteData',   ['archive', 'article_id', story.article_id])
                             .then( res => {
                                                const newArchive = archive.filter( item => item.article_id !== story.article_id );

                                                setArchive(newArchive);
                                                newStatus( setStatus, 'story successfully deleted' );
                                           }
                                  )
                            .catch( err =>      newStatus( setStatus, err.message ) );
            }
        }


        // adds a story to the newsletter.
        function addStory () {

            // check if story is already in newsletter before adding it.
            const alreadyIncluded = stories.map(story => story.article_id).includes(story.article_id);

            if (alreadyIncluded) {  return newStatus( setStatus, 'story already in newsletter' ); 
                                 }           
            else                 {  setStories( [...stories, story] );
                                    return newStatus(  setStatus, 'story added to newsletter'  );
                                 }
        }


        return (

            

            // archive item
            <div      key={index}
                className={`
                            w-full h-fit
                            grid grid-cols-5
                            py-2
                        `}
            >

                {/* click  headline to open story in a new browsder window*/}
                <a 
                    target="_blank"
                       rel="noreferrer"
                      href={story.link} 
                 className='col-span-4'
                >
                    <p className={`hover:cursor-pointer`} >{ story.headline }</p>
                </a>

                <div className={    `col-span-1 
                                     flex items-center justify-evenly
                                    `
                               }
                >  

                   
                    {/* click add-file icon to add story to next newsletter */}
                    <img    alt='add file icon' 
                            src={iconAddStory}
                            onClick={addStory}
                            className={` p-2 hover:cursor-pointer`}
                            />

                   
                    {/* click trashcan to delete email from list */}
                    <img    alt='trashcan icon' 
                            src={iconDelete}
                            onClick={deleteStory}
                            className={`p-2 hover:cursor-pointer`}
                            />
                </div>
            </div>
        )
    }







    // signals server to send newsletter.
    // action is either 'Preview' or 'Publish',
    // and it gets woven into the endpoint url.
    function sendNewsletter (action) {
        
        const publishing =  action === 'Publish';

        const warning    = 'Are you sure you want to send this newsletter to your entire email list?'

        const update     = !publishing ? 'delivering draft...' : 'delivering newsletter...';

        const deliver    = () => Axios.post( `${process.env.REACT_APP_API_BASE_URL}newsletter${action}`, [stories, emailList] );

        const send       = () => {
                                                                newStatus( setDeliveryStatus, update,  'deliveryStatus', false  );
                                    deliver().then( res => {    
                                                                newStatus( setDeliveryStatus, res.data, 'deliveryStatus'        ) 
                                                                publishing && setPublished(true);
                                                            });
                                 }

        // if not publishing, you can send without confirmation.
        !publishing ? send() : window.confirm(warning) && send();

    }



    return (
        
        <>


            <div className={wrap}>

                { archive.length > 0 &&
                    <>
                        <p className={graf}>Archive</p>

                        <div className={scroller}>
                            {  archive.map((story, index) => archiveItem(story, index) ) }
                        </div>
                    </>
                }

            </div>


            <div className={wrap+'mt-20'}>


                    {
                        stories.length > 0 && 
                        <>
                            <p className={graf}>Next Newsletter</p>

                            <div className={`flex flex-col items-center`}>
                        
                                { stories.map((story, index) => <EmailStoryPreview 
                                                                    key={index} 
                                                                    data={story} 
                                                                    index={index} 
                                                                    state={stories}
                                                                    loadData={setStories} 
                                                                    setState={setStories}
                                                                    newStatus={newStatus}
                                                                    newsletterLength={stories.length} 
                                                                />
                                            )
                                }

                                { !published &&
                            
                                    <div className='flex justify-center'>

                                        <Button name='send preview'       onClick={() => sendNewsletter('Preview')} />

                                        <Button name='publish newsletter' onClick={() => sendNewsletter('Publish')} />

                                    </div>

                                }

                                <p id='deliveryStatus' className='mt-10 mb-20'>{deliveryStatus}</p>
                            </div>
                        </>
                    }
            </div>                
        </>
    )
}