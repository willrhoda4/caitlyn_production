





const nodemailer    = require('nodemailer');
const db           = require('./database.js');




// helper function to deliver an email via nodemailer.
async function deliverEmail (   response, 
                                options, 
                                successMsg, 
                                errorMsg, 
                                cleanUpSuccess, 
                                cleanUpError
                            ) {


    // create a transporter object using the website's gmail account.
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


        // send the email.
        // whether the email is sent successfully or not, log the result.
        // if a cleanUp function is provided, run it, else send a response.
        // resolve or reject the promise.
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
                                           





// generates the newsletter.
function newsletter (request, response) {   
    
    const stories    = request.body[0];
    const emails     = request.body[1];
    const publishing = request.originalUrl === '/newsletterPublish'

    console.log('preparing newsletter...', );


    // generates the markup for the newsletter.
    // strory elements are created dynamically.
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
                                ${stories.map(story =>  `
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

                            ${ !publishing ? '<p>Preview</p>'
                                           : `<a href="${process.env.URL}/unsubscribe?id=${id}&token=${token}">
                                                <p>Unsubscribe/<p>
                                              </a>`
                             }
                        </body>
                    </html>
                `};
                            
    

    // if the request is not to publish the newsletter, 
    // send a preview to the website's email.
    if (!publishing)    {

        const mailOptions =  {
            from:     process.env.EMAIL,
            to:       process.env.EMAIL,
            subject: 'Monthly Newsletter Preview',
            html:     emailMarkup()
        };



        deliverEmail(   response, 
                        mailOptions, 
                        'Draft delivered.',
                        'Error delivering draft.'
                    );
    }
                    
    // otherwise, send the newsletter to all subscribers.
    else {


        const sendEmails = async () => {        console.log('function ran');    console.log(emails);    

            // counts the number of emails sent and errors encountered.
            // errorCount + readerCount should equal the number of emails in the list.
            let errorCount  = 0;
            let readerCount = 0;

            // send the email to each email address in the list.
            // if there's an error, increment the errorCount.
            // if there's no error, increment the readerCount.
            for (let i = 0; i < emails.length; i++) {      console.log('loop run');

                const email =   emails[i];
        
                const mailOptions = {
                    from:   `"Caitlyn Gowriluk" ${process.env.EMAIL}`,
                    to:       email.email,
                    subject: 'This Month from Caitlyn Gowriluk',
                    html:     emailMarkup(email.id, email.email_token)
                };
        
                try {      console.log('sending email to ', email.email);
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

            // once all emails have been sent, send a report.
            let report = `Newsletter delivered to ${readerCount} readers with ${errorCount} errors.`;
            console.log('\n',report);
            response.send(report);

        };
        // call the function.
        sendEmails();
    }
};

/*

// accepts a query, parameters, and a callback, then 
// executes the query and passes the results to the callback.
function simpleQuery(response, query, parameters, cleanUp, next) {

    const gear = parameters ? [query, parameters] : [query];

    pool.query(...gear, (err, res) => {
        
        if (err) { console.log(err.stack);
                   response.status(400).send(err.message);
                 } 
        else     { cleanUp && cleanUp(res.rows, response);
                   next     ? next() : response.send(res.rows); 
                 }
    });
};

*/

function getAdminEmail (request, response, next) {

    const query = `SELECT value FROM misc WHERE description = 'admin_email'`;

    return db.simpleQuery(   response,
                             query,
                             undefined,
                             res => response.locals.adminEmail = res[0].value,
                             next
                         );

}



// sends a message from the email form
// to the website's gmail account.
function formMail(request, response) { 

    console.log('Delivering message from email form...')


    const {
            name,
            email,
            message,
          } = request.body;


    const mailOptions = {       from:     email,
                                to:       response.locals.adminEmail,
                                subject: `portfolio email from ${name}`,
                                text:    `email from ${name}\nreply to ${email}\n\n${message}`
                        }

    deliverEmail(   response, 
                    mailOptions, 
                    `Message succesfully received from ${email}.`, 
                    `Error receiving message from ${email}`
                );

}





// sends a reset link to the website's gmail account.
function sendResetLink(request, response) {


    console.log('preparing to send reset link...');

    const url = `${process.env.URL}/copyeditor?token=${response.locals.resetToken}`;

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
}



module.exports={ 
                    formMail,
                    newsletter,
                    getAdminEmail,
                    sendResetLink,
                };





