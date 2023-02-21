





import SummonWord from '../../components/SummonWord.js';



export default function Title({animation}) {

  return (

    <div className='flex flex-col 
                    justify-center
                    h-full
                   '
    >
        < div className={`pl-4 ${ animation === 'vanishing' && 'animate-slideOutLeft'}`}>

            <SummonWord 
              word='Caitlyn' 
              interval={250}
            />
            <SummonWord
              word='Gowriluk'
              interval={250}
              delay={1000}
            />


            <div className={`mt-2 w-1/2
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











