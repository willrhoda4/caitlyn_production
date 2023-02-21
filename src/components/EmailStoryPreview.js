





import   Input          from './Input';
import   Button         from './Button';
import   EditorButtons  from './EditorButtons';

import { useState, 
         useEffect  }   from 'react';
import   Axios          from 'axios';



export default function EmailStoryPreview ({data, index, newsletterLength, loadData}) {



    const   articleId                                   =          data.article_id;
    const   rank                                        =          data.rank;

    const [ headline,            setHeadline          ] = useState(data.headline);
    const [ link,                setLink              ] = useState(data.link);
    const [ imageUrl,            setImageUrl          ] = useState(data.image);
    const [ description,         setDescription       ] = useState(data.description);

    const [ headlineError,       setHeadlineError     ] = useState(false);
    const [ linkError,           setLinkError         ] = useState(false);
    const [ imageUrlError,       setImageUrlError     ] = useState(false);
    const [ descriptionError,    setDescriptionError  ] = useState(false);

    const [ updateStatus,        setUpdateStatus      ] = useState(false);


    useEffect(() => { setHeadlineError(headline.length === 0);       }, [headline]);
    
    useEffect(() => { setLinkError(!(new URL(link).host));           }, [link]);
    
    useEffect(() => { setImageUrlError(!(new URL(imageUrl).host));   }, [imageUrl]);
    
    useEffect(() => { setDescriptionError(description.length === 0); }, [description]);



    function updateStoryInfo () {

        if (    headlineError       ||
                imageUrlError       ||
                linkError           ||
                descriptionError    ){  return setUpdateStatus('make sure that your urls are valid and no fields are blank');  }
      
        setUpdateStatus('updating story...')

        const reqBody = [
                              'archive',
                            [ 'headline',  'link', 'image',  'description'   ],
                            [  headline,    link,   imageUrl, description    ],
                            [ 'article_id', articleId                        ]
                        ];
        Axios.put('http://localhost:3000/updateData', reqBody       )
            .then(  res => setUpdateStatus('story updated!')        )
           .catch(  err => console.log(err)                         );
    }



    return (
        
        <form className='
                        w-[80%] max-w-[600px]
                        m-4 p-4
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
                             table={'next_email'}
                            pkName={'article_id'}
                          loadData={loadData}
                          dataSize={newsletterLength}
                    /> 

                <p className='px-4'>{updateStatus}</p>
            </div>

        </form>
    )
}