




// construction mode component for portfolio.
// also handles error boundaries.
// also handles 404s.
export default function Fallback ({type}) {



    const heading      = type === 'error'         ?  'Looks like someting went wrong.'
                       : type === 'construction'  ?  'Sorry I missed you.'
                       :                             'Did you get lost?' 

    const apology      = type === 'error'         ?  'Try refreshing the browser, and if the problem persists please email me.'
                       : type === 'construction'  ?  `I'm in the middle of making some changes, but I'll be back online shortly.`
                       :                             <a href='https://www.caitlyngowriluk.com'>Click here to head back to the homepage.</a>

    const afterThought = type === 'error'         ?  'caitlyn.gowriluk.website@gmail.com'
                       : type === 'construction'  ?  'Come back soon!'
                       :                              null;


    return(
        
        <div className={`   
                            w-[100vw] h-[100vh] 
                            flex flex-col items-center justify-center border border-green-300
                            p-4
                       `}
        >
            <p className='text-center font-serif text-4xl'>{heading}</p>
            <p className='text-center my-4'>{apology}</p>
            <p className='text-center'>{afterThought}</p>
        </div>
    )
}


