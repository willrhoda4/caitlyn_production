







import   Axios                  from 'axios';
import { useState    }          from 'react';

import   Button                 from '../../components/Button';
import   EmailList              from '../../components/EmailList';
import   NewsletterBuilder      from '../../components/NewsletterBuilder';




// this page allows the user to view and edit the email list.
// it has also evolved to include  newsletter-generation functionality.
export default function Mailer ({newStatus}) {   


    const [ emailList, setEmailList ] = useState([]);
    const [ archive,   setArchive   ] = useState([]);
    const [ stories,   setStories   ] = useState([]);
    
    const [ status,    setStatus    ] = useState(false);










    // this function kicks off the newsletter generation process.
    // it uses story_scraper to check CBC.ca for new stories, and
    // adds them to the archive if necessary.
    // once we have data in state, the builder appears.
    function newNewsletter() {


        // update the status message without fading out.
        newStatus(setStatus, 'preparing newsletter builder...', undefined, false);


        // requests to our Django microservice and our Node.js server.
        const requests =    [
                                Axios.get( `${process.env.REACT_APP_STORY_SCRAPER}getNewStories/`   ),
                                Axios.post(`${process.env.REACT_APP_API_URL}getData`, 
                                
                                                                        [  'archive', 
                                                                            undefined, 
                                                                            { orderBy: 'date' } 
                                                                        ]                           )
                            ];


           Axios.all(   requests   )
               .then(
        Axios.spread( ( recentStories, archive ) => {

            // we'll only need the data from the responses.
            recentStories    = recentStories.data;
            archive          = archive.data;

            // filter out any stories that are already in the archive.
            // then combine the new stories with the archive.
            const newStories = recentStories.filter( story => !archive.map(article => article.article_id).includes(story.article_id) );
            const newArchive = [ ...newStories, ...archive ];

            // optimistically update archive state.
            setArchive(newArchive);

            // if there are no new stories, return a status message.
            if (newStories.length === 0) {  return newStatus( setStatus, 'no new stories to share.' );  }

            // if there's new stories, update state,
            // then send the new stories to the database.
            else {

                // assume that all new stories are going in the newsletter.
                setStories(newStories);

                // update status message.
                newStatus( setStatus, 
                          `found ${newStories.length} new stories. Updating database now...`, 
                           undefined, 
                           false
                         );

                // we need values for these columns.
               const columns =  [ 'article_id', 'date', 'description', 'headline', 'image', 'link' ]

               // we can find it in our newStories objects,
               // and create an array of arrays for our request.
               const newData  = newStories.map( story => [ story.article_id, 
                                                           story.date, 
                                                           story.description, 
                                                           story.headline, 
                                                           story.image, 
                                                           story.link 
                                                         ] 
                                              );  

                // send new stories to the database.
                Axios.post(`${process.env.REACT_APP_API_URL}addData`, ['archive', columns, newData] )
                     .then( res => newStatus( setStatus, 'database successfully updated' )               )
                    .catch( err => newStatus( setStatus, 'there was an error updating the database' )    );
            } 

      



        }  )  )
            .catch( error => { console.error(error); });
    }







    // copies the email list to the clipboard
    // as a comma-separated string.
    function copyList () {

            navigator.clipboard.writeText(emailList.filter(email => email.email).join(', '));
            newStatus(setStatus, 'mailling list successfully copied');
    }







    const scrollingDivStyles = {

        wrap:       `
                        relative                         
                        w-[80%] max-w-[600px]  
                        my-10            
                    `,


        graf:       `
                        text-4xl font-extralight
                        absolute left-0 bottom-full
                        z-10
                    `,


        scroller:   `
                        w-full h-full max-h-[400px]
                        overflow-y-scroll
                        border border-gray-300 
                        bg-white 
                        px-5 py-2.5
                        text-sm font-medium text-gray-700 
                        shadow-sm shadow-inner
                    `    
    }



    

 
    return (
    
        <div className={`
                            h-full w-full
                            flex flex-col justify-center items-center
                            mt-20
                       `}
        >

           <EmailList 
                   emailList={emailList}
                setEmailList={setEmailList}
                      styles={scrollingDivStyles}
                   newStatus={newStatus}
                   setStatus={setStatus}
           />

            <div className='flex items-center'>

                <Button
                    name='build newsletter'
                    onClick={newNewsletter}
                />

                <Button
                    name='copy list'
                    onClick={copyList}
                />

            </div>

            <p id='statusGraf' className='h-6 my-4'>{status}</p>

            <NewsletterBuilder
                   stories={stories}
                setStories={setStories}
                   archive={archive}
                setArchive={setArchive}
                 newStatus={newStatus}
                 setStatus={setStatus}
                    styles={scrollingDivStyles}
                 emailList={emailList}
            /> 

        </div>

        
    )
}


