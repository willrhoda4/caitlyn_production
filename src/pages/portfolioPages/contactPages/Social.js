




import iconFacebook  from '../../../images/icon_facebook.svg';
import iconMessenger from '../../../images/icon_signal.svg';
import iconX         from '../../../images/icon_x.svg';



// contact conmponent for social media.
export default function Social () {


    // returns an icon that links to a social media page.
    function socialIcon (name, image, url) {

        return (
            
            <a target="_blank" rel="noreferrer" href={url}>

                {/* add a little  padding to X's icon, to scale it down a touch. */}
                 <img                               
                    className={`h-16 m-5 ${ name === 'x' && 'p-2' }`} 
                          alt={name+' icon'} 
                          src={image} />
            </a>
        )
    }

    // get your blurbs ready
    const metaBlurb = `If you prefer communicating through social media, you can reach me on Facebook or Messenger.`;

    const xBlurb    = `DM me on X @caitlyngowriluk.`;


    return (
        // fullscreen container
        <div className='h-[70%] min-h-[400px] w-full
                        pr-[10vw] pl-6
                        flex justify-end
                        animate-fadeIn
                       '
        >

            <div className='flex w-[500px]'>
                {/* left 70% of window */}
                <div className='    h-full w-[70%]
                                    border-r-[10px] border-gray-300 
                                    pr-8
                                    font-serif text-xl text-right leading-10
                                    flex flex-col justify-between
                            '
                >
                    <p className='mt-4'>{metaBlurb}</p>
                    <p className='mb-6 pb-8'>{xBlurb}</p>
                </div>


                {/* right 30% of window */}
                <div className='h-full w-[30%]
                                flex flex-col
                                py-6
                                items-center justify-between         
                            '
                >   <div>

                    { socialIcon('facebook',   iconFacebook,  'https://www.facebook.com/caitlyn.gowriluk' ) }
                    { socialIcon('messenger',  iconMessenger, 'https://www.facebook.com/caitlyn.gowriluk' ) }
                </div>
                    { socialIcon('x',          iconX,         'https://twitter.com/caitlyngowriluk'       ) }
                </div>
            </div>




        </div>
    )
}