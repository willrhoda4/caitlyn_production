





export default function Samples ({categoryData, sampleData, animation}) {

    function sampleLink (sample) {

        return (
            <a key={sample.sample_id} target="_blank" rel="noreferrer" href={sample.story_url}>
                <div       key={sample.story_id} 
                    className ={`w-full 
                                 flex 
                                 mt-8 px-2
                                `}
                >

                    <img className={`h-16 w-auto p-1                                  
                                     ${ animation === 'vanishing' ? 'animate-spinOut' : 'animate-spinIn'}
                                    `} 
                               alt={sample.image_alt} 
                               src={sample.image_url} 
                    />

                    <div className={`flex flex-col justify-center
                                     w-3/4
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

        <div className='w-screen h-full
                        flex flex-col justify-between
                       '
        >
            <div className='flex flex-col'>
                <p className={`
                                text-5xl font-extralight
                                self-end
                                pt-10 pr-5 pb-2
                                origin-bottom
                                ${ animation === 'vanishing' ? 'animate-popDown' : 'animate-popUp'}
                             `}
                >{categoryData.category_name}</p>
                
                <p className={` w-11/12 h-50
                                border-t-2 border-black
                                mx-auto mt-30 pl-4 pt-6 pr-20  
                                font-serif text-lg text-justify
                                first-line:uppercase first-line:font-bold
                                ${ animation === 'vanishing' ? 'animate-slideOutLeft' : 'animate-slideInLeft'}
                             `}
                >{categoryData.blurb}</p>
            </div>

            <div className='
                            w-full h-fit
                            flex flex-col
                            pb-10
                            '
            >
                {   sampleData && sampleData.map(sample => sampleLink(sample))    }
            </div>
                
        </div>
    )
}