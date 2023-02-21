





const nodemailer    = require('nodemailer');
const Pool          = require('pg').Pool


// const pool = new Pool({
//                         user: 'postgres',
//                         host: 'localhost',
//                         database: 'caitlyn',
//                         password: 'rootUser',
//                         port: 5432
//                      })





async function deliverEmail (   response, 
                                options, 
                                successMsg, 
                                errorMsg, 
                                cleanUpSuccess, 
                                cleanUpError
                            ) {

    const transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:   {
                    user: process.env.EMAIL,
                    pass: process.env.EMAILPASS
                }
    });

    return new Promise((resolve, reject) => {

        transporter.sendMail(options, (err, info) => {

            if (err) {  console.error(`\n${errorMsg}\n${err.message}`);
                        if (!cleanUpError)   {    return response.status(400).send(errorMsg);   }
                        else                 {    cleanUpError();                               };
                        reject(err);
                     } 
            else     {  console.log(`\n${successMsg}\n${info.response}`);
                        if (!cleanUpSuccess) {    return response.send(successMsg);             }
                        else                 {    cleanUpSuccess();                             };                     
                        resolve(info);
                     }
        });
    });
}
                                           






function newsletter (request, response) {   
    


    if (!response.locals.emailData) { return console.log('no email data'); }

    console.log('preparing newsletter...', );

    const emailMarkup = (id, token) => {
                 
        return `
                    <html>
                        <head>
                            <style>
                                * {
                                    font-family: Arial, sans-serif;
                                    text-decoration: none;
                                }

                                h1 {
                                    margin: 0 auto;                                        
                                }

                                .card-container {
                                    border: 3px lime ridge;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    width: 100%;
                                    height: fit-content;
                                    padding: 20px;
                                }

                                .card {
                                    border: 3px orange ridge;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    background-color: white;
                                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                                    transition: all 0.3s ease;
                                    margin: 16px;
                                    padding: 16px;
                                    width: 90%;
                                    max-width: 800px;
                                    text-align: start;
                                }

                                .card:hover {
                                    transform: translateY(-10px);
                                    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
                                }

                                .card img {
                                    width: 100%;
                                    height: auto;
                                    margin-bottom: 16px;
                                }

                                .card h3 {
                                    color: black;
                                    margin-bottom: 8px;
                                }

                                .card h3:hover {
                                        color: red;
                                }

                                .card p {
                                    color: gray;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>This Month From Caitlyn Gowriluk</h1>
                            <table class="card-container">
                                ${response.locals.emailData.map(story =>  `
                                                                            <a href="${story.link}">
                                                                                <tr class="card">
                                                                                    <table>
                                                                                        <tr>
                                                                                            <img alt="${story.headline}" src="${story.image}">   
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <h3 style="margin: 0;">${story.headline}</h3>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <p style="margin: 0;">${story.description}</p>
                                                                                        </tr>
                                                                                    <table>
                                                                                </tr>
                                                                            </a>
                                                                        `
                                ).join('')}
                            </table>
                            ${ request.originalUrl === '/publishNewsletter' ? `<a href="${process.env.URL}/unsubscribe?id=${id}&token=${token}">Unsubscribe</a>` 
                                                                            : `<a href="${process.env.URL}/newsletter">Edit</a> | <a href="${process.env.URL}/publish">Publish</a>` 
                             }
                        </body>
                    </html>
                `};
                            
    
    if (request.originalUrl !== '/publishNewsletter')    {

        const mailOptions =  {
            from:     process.env.EMAIL,
            to:       process.env.EMAIL,
            subject: 'Monthly Newsletter Preview',
            html:     emailMarkup()
        };

        deliverEmail(   response, 
                        mailOptions, 
                        'Draft delivered.'
                    );


        // transporter.sendMail(mailOptions, (error, info) => {

        //     if (error) { console.log(error);                    
        //                } 
        //     else       { console.log('Email sent: ' + info.response); 
        //                  response.send('revised draft delivered');
        //                }
        // })
    }
                    
    else {



        const sendEmails = async (response) => {

            let errorCount  = 0;
            let readerCount = 0;

            for (let i = 0; i < response.locals.emailList.length; i++) {

                const email = response.locals.emailList[i];
        
                const mailOptions = {
                    from:   `"Caitlyn Gowriluk" ${process.env.EMAIL}`,
                    to:       email.email,
                    subject: 'This Month from Caitlyn Gowriluk',
                    html:     emailMarkup(email.id, email.email_token)
                };
        
                try {
                        await deliverEmail(
                                            response,
                                            mailOptions,
                                            `Email sent to ${email.email}.`,
                                            `Error sending email to ${email.email}`,
                                            // eslint-disable-next-line no-loop-func
                                            () => readerCount++,
                                            // eslint-disable-next-line no-loop-func
                                            () => errorCount++
                                          );
                              } 
                catch (error) { console.log(`Error sending email to ${email.email}: ${error}`);
                                errorCount++;
                              }
            }
            let report = `Newsletter delivered to ${readerCount} readers with ${errorCount} errors.`;
            console.log('\n',report);
            response.send(report);
        };
        sendEmails(response);
    }
};



// let errorCount = 0;

// const sendEmails = async (response) => {

//     for (const [index, email] of response.locals.emailList.entries()) {

//         const mailOptions =  {

//             from:   `"Caitlyn Gowriluk" ${process.env.EMAIL}`,
//             to:       email.email,
//             subject: 'This Month from Caitlyn Gowriluk',
//             html:      emailMarkup(email.email_token)
//         };

//         try {

//         await deliverEmail(   response,
//                                 mailOptions,
//                                 `Email sent to ${email.email}.`,
//                                 `Error sending email to ${email.email}`,
//                                 () => index+1 !== response.locals.emailList.length && console.log('proceeding to next email...'),
//                                 () => errorCount++

//         );
//         } catch (error) {

//         console.log(`Error sending email to ${email.email}: ${error}`);
//         errorCount++;

//         }
//     }
//     response.send(`Newsletter delivered with ${errorCount} errors.`);
// };

// sendEmails(response);




function formMail(request, response) { 

    console.log('Preparing to receive message from email form...')

    const {
            name,
            email,
            message,
          } = request.body;


    const mailOptions = {       from:     email,
                                to:       process.env.EMAIL,
                                subject: `email from ${name}`,
                                text:    `email from ${name}\nreply to ${email}\n\n${message}`
                        }

    deliverEmail(   response, 
                    mailOptions, 
                    `Message succesfully received from ${email}.`, 
                    `Error receiving message from ${email}`
                );

                        
    
    // transporter.sendMail(mailOptions, (error, info) => {

    //     if (error)  {   console.error(`Error receiving message from ${email}: ${error}`);              
    //                     return response.status(400).send('error receiving email');
    //                 }
    //     else        {   console.log(`Message succesfully received from ${email}. ${info.response}`); 
    //                     return response.send('message successfully received!');
    //                 }
    // })
}






function sendResetLink(request, response) {


    console.log('preparing to send reset link...');

    const           resetToken = crypto.randomBytes(32).toString("hex");
    response.locals.resetToken = resetToken;

    const url = `${process.env.URL}/passwordReset?token=${resetToken}`;

    const resetLinkOptions = {      
                                to:       'caitlyn.gowriluk.website@gmail.com',
                                from:    `"CaitlynGowriluk.com" ${process.env.EMAIL}`,
                                subject:  `Password Reset`,
                                text:     `Reset your password here => ${url}`
                            } 
    

    deliverEmail(   response, 
                    resetLinkOptions, 
                    `Reset link successfully sent.`, 
                    `Error resetting password.`
                );

    // transporter.sendMail(resetLinkOptions, (error, info) => {

    //     if (error)  {   return console.log(`Error resetting password: ${error}`);              }

    //     else        {   return console.log(`Reset link successfully sent. ${info.response}`); }
    // })
}



module.exports={ 
                    formMail,
                    newsletter,
                    sendResetLink,
                };










    //========Email Route:========


// app.post('/email', async (req, res, next) => {

//     console.log(req.body);

//     const { cc,
//             name, 
//             type,
//             email, 
//             phone,
//             origin,
//             invite, 
//             subject, 
//             message, 
//             resetId  } = req.body

    
//     const transporter = nodemailer.createTransport({
//             host:       'smtp.gmail.com',
//             port:       465,
//             secure:     true,
//             auth:    { user: process.env.EMAIL, 
//                        pass: process.env.EMAILPASS 
//                      }
             
//     })






  

//     async function formMail() {    

    

//         const userSubject     = `Website email from ${name} subject: ${subject}`;
//         const producerSubject = `PRODUCR MSG FROM: ${name}  subject: ${subject}`;
//         const otherSubject    = `From Website: ${subject}`;
  
//         const mailOptions = {       from: email,
//                                       to: process.env.EMAIL,
//                                  subject: type==='userEmail' ? userSubject : type==='producerEmail' ? producerSubject : otherSubject,
//                                     text: 
//                             `                Name:   ${name}
//                                             Email:   ${email}
//                                             Phone #: ${phone}
//                                             Subject: ${subject}
//                                             Message: ${message}`
//                             }
        
//         try           { const  result = await transporter.sendMail(mailOptions);
//                         return result;
//                       } 
//         catch (error) { return error;   }
//     }

//     async function sendResetLink() {

//         console.log('function ran');

//         const      resetToken = crypto.randomBytes(32).toString("hex");
//         res.locals.resetToken = resetToken;

//         const url = `${process.env.URL}/passwordReset?id=${resetId}&origin=${origin}&invite=${invite}&token=${resetToken}`;

//         const resetLinkOptions = {         to:  email,
//                                          from:  `"Skene Stunts" ${process.env.EMAIL}`,
//                                       subject: invite ? `Welcome to Skene Stunts Director's Chair` : `Password Reset`,
//                                          text: invite ? `Join the revolution => ${url}`            : `Reset your password here => ${url}`
//                                  } 
        
//         try           { const  result = await transporter.sendMail(resetLinkOptions);
//                         return result;
//                       } 
//         catch (error) { return error;   }
//     }

//     async function reachOut() {

//         const reachOutOptions = {   to: email,
//                                     from: `"Skene Stunts" ${process.env.EMAIL}`,
//                                     cc: cc,
//                                     subject: subject,
//                                     text: message
//                                 }
//         try           { const  result = await transporter.sendMail(reachOutOptions);
//                         return result;
//                       } 
//         catch (error) { return error;   } 
//     }





//          if ( type === 'userEmail'  ||
//               type === 'producerEmail' ) {  console.log('trying to mail')

//             formMail().then(  (result) => {     console.log(result);
//                                                  if ( result.response.status &&
//                                                       result.response.status.toString().startsWith('4')) { res.status(400).send('Error 400'); }
//                                             else if ( result.accepted                                  ) { res.status(200).send('msg sent!'); }
//                           })
//                      .catch( (error)  => { console.log('Email error...', error.message);  res.send(error); });     
//     } 
//     else if ( type === 'resetEmail'   ) {

//        sendResetLink().then(  (result) => {       console.log('result came vvv\n',result)
//                                                   if ( result.response.status &&
//                                                        result.response.status.toString().startsWith('4')) { res.status(400).send('Error 400'); }
//                                              else if ( result.accepted                                  ) { next();                            }
//                           })
//                      .catch( (error)  => { console.log('Email error...', error.message);  res.send(error); });   
//     }
//     else if ( type === 'reachingOut'  ) {
//         reachOut().then(  (result) => {            if ( result.response.status &&
//                                                         result.response.status.toString().startsWith('4')) { res.status(400).send('Error 400'); }
//                                               else if ( result.accepted                                  ) { res.status(200).send('msg sent!'); }
//                         })
//                         .catch( (error)  => { console.log('Email error...', error.message);  res.send(error); });     
//     }
//     else  { console.log(`I guess you could call this a 'type' error...`)}
    
// }, db.registerReset)











