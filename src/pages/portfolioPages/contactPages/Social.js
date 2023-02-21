




import iconFacebook from '../../../images/icon_facebook.svg';
import iconMessenger from '../../../images/icon_messenger.svg';
import iconTwitter from '../../../images/icon_twitter.svg';




export default function Social () {

    function socialIcon (name, image, url) {

        return (
            
            <a target="_blank" rel="noreferrer" href={url}>
                 <img className ='h-16 m-5' alt={name+' icon'} src={image} />
            </a>
        )
    }




    return (
        <div className='h-[70%] w-full
                        flex
                        animate-fadeIn
                       '
        >
            <div className='h-full w-[70%]
                          border-r-[10px] border-gray-300
                          p-4
                          font-serif text-xl text-right leading-10
                          flex flex-col justify-between
                         '
            >
                <p className='mt-4'>If your prefer communicating through social media, you can reach me on Facebook or Messenger.</p>
                <p className='mb-6'>My DM's are open on Twitter @caitlyngowriluk.</p>
            </div>



            <div className='h-full w-[30%]
                            flex flex-col
                            py-6
                            items-center justify-between
                           '
            >   <div>

                { socialIcon('facebook',   iconFacebook,  'https://www.facebook.com/caitlyn.gowriluk' ) }
                { socialIcon('messenger',  iconMessenger, 'https://www.facebook.com/caitlyn.gowriluk' ) }
            </div>
                { socialIcon('twitter',    iconTwitter,   'https://twitter.com/caitlyngowriluk'       ) }
            </div>

        </div>
    )
}