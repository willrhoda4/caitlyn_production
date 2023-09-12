




// construction mode component for portfolio.
// also handles error boundaries.
export default function Construction ({errorBoundary}) {



    const heading      = errorBoundary ? 'Looks like someting went wrong.'
                                       : 'Sorry I missed you.';

    const apology      = errorBoundary ? 'Try refreshing the browser, and if the problem persists please email me.'
                                       : `I'm in the middle of making some changes, but I'll be back online shortly.`;

    const afterThought = errorBoundary ? 'caitlyn.gowriluk.website@gmail.com'
                                       : 'Come back soon!';


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


