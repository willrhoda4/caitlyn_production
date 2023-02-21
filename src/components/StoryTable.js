






import EditorButtons from './EditorButtons.js';




export default function StoryTable ({category, storyData, loadData}) {
    


    function storyPreview (story, index) {

        return (
            <div       
                    className='    min-h-16 h-fit w-screen 
                                   border [&:nth-child(n+4)]:border-pink-300 
                                   bg-white-300
                                   shadow-inner
                                   flex items-center
                              '                     
            >   
                <img className='    h-16 w-auto p-1'
                     alt={story.alt}
                     src={story.image_url}
                />

                <div className='flex flex-col w-2/3'>
                    <p className='font-sans truncate block'>{story.headline}</p>
                    <EditorButtons 
                                id={story.id} 
                              rank={story.rank} 
                             index={index}
                             table={category}
                            pkName={'id'}
                          loadData={loadData}
                          category={category}
                          dataSize={storyData.length}
                    />
                </div>

            </div>
        )
    }


    return (
        <div>
            <div className='    w-screen h-16
                                bg-gray-300
                                text-slate-50
                                flex items-center
                           '
            >   
                <p className='pl-4' >{category}</p>
            </div>

            <div className='w-screen h-fit ' >
                {   storyData.length !== 0 && storyData.map((story, index) =>   <div key={story.id} className='border [&:nth-child(n+4)]:border-pink-300'>
                                                                                    {storyPreview(story, index)}
                                                                                </div>
                                                           ) 
                }
            </div>

        </div>
    )
}