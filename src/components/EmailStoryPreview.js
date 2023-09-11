





import   Input          from './Input';
import   Button         from './Button';
import   EditorButtons  from './EditorButtons';

import { useState, 
         useEffect  }   from 'react';
import   Axios          from 'axios';


// component for editing stories in the newsletter builder.
export default function EmailStoryPreview ({state, setState, data, index, newsletterLength, loadData, newStatus}) {


    // destructure the data object.
    // put editable data in state.
    const   articleId                                   =          data.article_id;
    const   rank                                        =          data.index;

    const [ headline,            setHeadline          ] = useState(data.headline);
    const [ link,                setLink              ] = useState(data.link);
    const [ imageUrl,            setImageUrl          ] = useState(data.image);
    const [ description,         setDescription       ] = useState(data.description);

    const [ headlineError,       setHeadlineError     ] = useState(false);
    const [ linkError,           setLinkError         ] = useState(false);
    const [ imageUrlError,       setImageUrlError     ] = useState(false);
    const [ descriptionError,    setDescriptionError  ] = useState(false);

    const [ status,              setStatus            ] = useState(false);

    // error handling for the input fields.
    useEffect(() => { setHeadlineError(headline.length === 0);       }, [headline]);
    
    useEffect(() => { setLinkError(!(new URL(link).host));           }, [link]);
    
    useEffect(() => { setImageUrlError(!(new URL(imageUrl).host));   }, [imageUrl]);
    
    useEffect(() => { setDescriptionError(description.length === 0); }, [description]);


    // update the story in the database.
    function updateStoryInfo () {

        // if something's wrong, call it off.
        // update your status to say so.
        if (    headlineError       ||
                imageUrlError       ||
                linkError           ||
                descriptionError    ){  return newStatus( setStatus, 'make sure that your urls are valid and no fields are blank');  }
      
        // otherwise, update the status and get started.
        newStatus( setStatus, 'updating story...', undefined, false)

        // make a request body.
        const reqBody = [
                               'archive',
                            [  'headline',  'link',     'image',  'description'   ],
                            [   headline,    link,       imageUrl, description    ],
                            [ ['article_id', articleId ]                          ]
                        ];

        // send the request.
        Axios.put(`${process.env.REACT_APP_API_URL}updateData`  , reqBody       )
            .then(  res => newStatus( setStatus, 'story updated!')              )
           .catch(  err => console.log(err)                                     );
    }



    return (
        
        <form className='
                        w-full max-w-[600px]
                        mb-8 px-4 py-8
                        rounded-lg 
                        border border-gray-300 
                        bg-white
                        shadow-sm shadow-inner 
                        '
        >
            <img className='h-[30vh] w-auto mx-auto'
                     alt={data.description}
                     src={data.image}
            />

            <Input 
                type='text'
                name='headline' 
                state={headline}
                setter={setHeadline}
                error={headlineError}
            />

            <Input 
                type='text'
                name='link' 
                state={link}
                setter={setLink}
                error={linkError}
            />

            <Input 
                type='text'
                name='imageUrl' 
                state={imageUrl}
                setter={setImageUrl}
                error={imageUrlError}
            />

            <Input 
                type='textArea'
                name='description' 
                state={description}
                setter={setDescription}
                error={descriptionError}
            />

            <div className='flex items-center'>

                <Button
                    name='update story'
                    onClick={updateStoryInfo}
                />
                
                <EditorButtons 
                                id={articleId} 
                              rank={rank} 
                             index={index}
                             table={'next_newsletter'}
                             state={state}
                            pkName={'article_id'}
                          loadData={loadData}
                          dataSize={newsletterLength}
                          setState={setState}
                    /> 

                <p id='statusGraf' className='px-4'>{status}</p>
            </div>

        </form>
    )
}