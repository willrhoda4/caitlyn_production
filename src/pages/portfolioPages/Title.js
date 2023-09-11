





import SummonWord from '../../components/SummonWord.js';


// front page for the portfolio.
export default function Title({animation}) {

  return (

    // wrapper div for the entire page.
    <div className='flex flex-col 
                    justify-center
                    h-full
                   '
    >
        {/* wrapper for title elements.
            it's two jobs in life are handling animation page change
            and taking care of padding-left. */}
        < div className={`
                          pl-4 md:pl-6 lg:pl-8
                          w-fit 
                          ${ animation === 'vanishing' && 'animate-slideOutLeft'}
                       `}
        >

            {/* the onload animation for Caitlyn Gowriluk is
                all handled by the SummonWord component*/}
            <SummonWord 
              word='Caitlyn' 
              interval={250}
            />
            <SummonWord
              word='Gowriluk'
              interval={250}
              delay={1000}
            />

            {/* the onload animation for journalist is handled by
                the animate-loadTitle class */}
            <div className={`mt-2 w-full
                             bg-black 
                             flex justify-center
                             animate-loadTitle
                           `}
            >
                <p className={`font-mono 
                               text-white 
                               tracking-widest
                               animate-loadTitle
                             `}
                >journalist</p>
            </div>

        </div>

    </div>

  );
}











