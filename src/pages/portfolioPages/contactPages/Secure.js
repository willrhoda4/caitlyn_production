




import iconMessenger  from '../../../images/icon_signal.svg';
import iconSecureDrop from '../../../images/icon_securedrop.svg';
import iconTor        from '../../../images/icon_tor.svg';



// contact component offering secure communication options.
export default function Secure () {


    // returns a div containing an icon, a link, and a blurb.
    function option (name, image, url, blurb) {

        return (

            <div className='h-fit w-full 
                            flex 
                            my-3 pl-4
                           '
            >
                <div className='w-[20%] 
                                flex items-center justify-center
                               '
                >
                    <a  target="_blank" rel="noreferrer"  href={url}>
                        <img className ='h-16' alt={name+' icon'} src={image} />
                    </a>
                </div>
                <p className='w-[80%] h-full
                              flex items-center 
                              px-4
                             '
                >{blurb}</p>
            </div>
        )
    }


    // get your blurbs ready
    const introBlurb      = `Sharing a sensitive story can be a serious risk for sources. If you’re considering contacting me with confidential information, here’s some options to help protect your anonymity.`

    const signalBlurb     = `From a safe number, send me an encrypted message through Signal at 555-555-5555.`

    const securedropBlurb = `Submit a tip through CBC's Securedrop service. Mention my name if you want this story to get my personal attention.`

    const torTailsBlurb   = `For situations that demand maximum discretion, tools like the Tor browser and Tails operating system can be an asset.`;



    return (
        <div className='h-full w-full
                        flex flex-col
                        justify-around border
                       '
        >

            <p className='h-fit w-full max-w-[800px]
                          px-10
                          font-serif text-xl  leading-7
                          flex flex-col justify-between
                         '
            >{introBlurb}</p>

            <div className='h-fit w-full max-w-[800px]
                            flex flex-col 
                            items-center justify-around
                           '
            >
                { option('signal',     iconMessenger,   'https://signal.org/en/',            signalBlurb        ) }
                { option('securedrop', iconSecureDrop,  'https://www.cbc.ca/securedrop/',    securedropBlurb    ) }
                { option('shield',     iconTor,         'https://www.torproject.org/',       torTailsBlurb      ) }
            </div>

        </div>
    )
}