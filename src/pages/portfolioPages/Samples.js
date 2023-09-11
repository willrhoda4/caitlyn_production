







// portfolio page that displays three work samples below a category blurb.
export default function Samples ({categoryData, sampleData, animation}) {



    // returns a single sample link.
    function sampleLink (sample) {

        return (

            // the entire sample is wrapped in a link to the story.
            // we'll open the story in a new browser tab.
            <a key={sample.sample_id} target="_blank" rel="noreferrer" href={sample.story_url}>
                <div       key={sample.story_id} 
                    className ={`   w-full 
                                    flex 
                                    mt-8 px-2               
                               `}
                >
                    {/* thumbnail image from story */}
                    <img className={`   h-16 md:h-18 lg:h-20
                                        w-auto 
                                        mx-1  md:mx-4  lg:mx-8                          
                                        ${ animation === 'vanishing' ? 'animate-spinOut' : 'animate-spinIn'}
                                   `} 
                               alt={sample.image_alt} 
                               src={sample.image_url} 
                    />

                    {/* headline and date */}
                    <div className={`   flex flex-col justify-center
                                        w-3/4 
                                        overflow-hidden
                                        transition-opacity duration-500
                                        ${ animation === 'vanishing' ? 'opacity-0' : 'opacity-1'}  
                                   `}
                    >
                        <p className='truncate block font-bold'  >{sample.headline}</p>
                        <p className='italic'                    >{sample.date.slice(0,10)}</p>
                    </div>

                </div>
            </a>
        )

    }


    return (

        // fullscreen container
        <div className='w-screen h-full
                        flex flex-col justify-between
                       '
        >
            {/* this div handles everything north of the story links */}
            <div className='flex flex-col'>

                {/* category title displayed in top-right corner */}
                <p className={`
                                text-5xl font-extralight
                                self-end
                                pt-10 pr-[5vw] pb-2
                                origin-bottom
                                ${ animation === 'vanishing' ? 'animate-popDown' : 'animate-popUp'}
                             `}
                >{categoryData.category_name}</p>
                
                {/* category blurb, which includes the horizontal line dividing the title from the page */}
                <p className={` w-[90vw] h-50
                                border-t-2 border-black
                                mx-auto mt-30 
                                pl-4 
                                pt-6     md:pt-8     lg:pt-12
                                pr-[10%] md:pr-[20%] lg:pr-[40%]  
                                font-serif text-lg text-justify
                                first-line:uppercase first-line:font-bold
                                ${ animation === 'vanishing' ? 'animate-slideOutLeft' : 'animate-slideInLeft'}
                             `}
                >{categoryData.blurb}</p>
            </div>

            {/* this div handles the story links */}
            <div className='
                            h-fit w-full max-w-[800px]
                            flex flex-col
                            self-center
                            pb-10
                            '
            >
                {   sampleData && sampleData.slice(0,3).map((sample, index) => <div key={index}>{sampleLink(sample)}</div> )    }
            </div>
                
        </div>
    )
}