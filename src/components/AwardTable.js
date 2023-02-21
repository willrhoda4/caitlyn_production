






import EditorButtons from './EditorButtons.js';




export default function AwardTable ({category, awardData, loadData, index}) {


    



    function awardPreview (award, index) {


        return (
            <div          key={index}
                    className='    min-h-16 h-fit w-screen
                                   pb-1
                                   bg-white-300
                                   shadow-inner
                                   flex flex-col
                                   pl-4
                              '                     
            >   
                <p className='font-sans truncate block'>{award.award}</p>
                <p className='font-sans truncate block'>{award.institution}</p>
                <EditorButtons 
                            id={award.award_id} 
                          rank={award.rank} 
                         index={index}
                         table={'awards'}
                        pkName={'award_id'}
                      loadData={loadData}
                      category={category}
                      dataSize={awardData.length}
                />
               

            </div>
        )
    }


    return (
        <div key={index}>
            <div className='    w-screen h-16
                                bg-gray-300
                                text-slate-50
                                flex items-center
                           '
            >
                <p className='pl-4' >{category}</p>
            </div>

            <div className='    w-screen h-fit' >
                {   awardData.length !== 0 && awardData.map((award, index) => awardPreview(award, index))     }
            </div>

        </div>
    )
}