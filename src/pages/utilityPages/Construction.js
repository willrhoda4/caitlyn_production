




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


//








// import           './Construction.css';


// import Picture  from                './Picture';


// import logo     from                '../images/logo_error.webp';
// import logoPng  from                '../images/logo_error.png';



// // this component is a placeholder for when the site is down for maintenance.
// // it's a simple page with a logo and a message.
// // and can be summoned through the Director's Chair at the admin's bequest.
// export default function Construction ({errorBoundary}) {


//     const heading = errorBoundary ? 'Looks like someting went wrong...'
//                                   : 'we\'re doing some maintenance...';

//     const apology = errorBoundary ? 'Sorry about this. Try refreshing the browser, and if the problem persists send us an email.'
//                                   : 'Sorry for the inconvenience. We\'re doing our best to keep the downtime short, so be sure to check back soon.';

  
    


//     return(

//         <div className='constructionPage'>
            
//             <h2>{heading}</h2>

//             <Picture
//                          src={logo}
//                     fallback={logoPng}
//                         type='image/webp'
//                          alt='Skene Stunts company logo'
//                           id='errorLogo'
//             />

//             <p className='constructionGraf'>{apology}</p>

//         </div>
//     )
// }