






import { useState, useEffect } from 'react';
import Axios from 'axios';




export default function PublishNewsletter ({newStatus}) {

    const [ status, setStatus ] = useState('delivering newsletter...');
    
    // function newStatus(status) {

    //     const delay      =  3000; 
    //     const elementId  = 'statusGraf';

    //     const animateIn  = 'animate-fadeIn';
    //     const animateOut = 'animate-fadeOut';

    //     const element = document.getElementById(elementId);
    //           element.classList.remove(animateOut);
    //      void element.offsetWidth;
    //           element.classList.add(animateIn);
 
    //     setStatus(status);

    //     setTimeout(() => {  

    //           element.classList.remove(animateIn);
    //      void element.offsetWidth;
    //           element.classList.add(animateOut);

    //     }, delay-400);

    //     setTimeout(() => setStatus(''), delay);
    // }

    useEffect(() => {
        
        Axios.get('http://localhost:3000/publishNewsletter'       )
            .then(  res => { console.log(res);
                             newStatus(setStatus, res.data);    } )
           .catch(  err => { console.log(err);
                             newStatus(setStatus, err.message); } )
    }, [newStatus])


    return (

        <p        id='statusGraf'
            className={`
                            flex items-center justify-center
                            h-[100vh] w-[100vw]
                      `}
        >{status}</p>
    )
}