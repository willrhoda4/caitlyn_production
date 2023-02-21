




// const nodemailer    = require('nodemailer');
// const crypto        = require('crypto');
// const fs            = require('fs')
const express       = require('express');
const cors          = require('cors');
const bodyParser    = require('body-parser');
                      require('dotenv').config()



                      
const db            = require('./handlers/database.js');
const nl            = require('./handlers/newsletter.js');
const auth          = require('./handlers/auth.js');
const emails        = require('./handlers/emails.js');
const portfolio     = require('./handlers/portfolio.js');


const app = express();
      app.use(cors());
      app.use(bodyParser.json());






//database routes
app.post('/getData',             db.getData                );
app.post('/deleteData',          db.deleteData             );
app.post('/reRankData',          db.reRankData             );
app.post('/addData',             db.addData                );
app.put( '/updateData',          db.updateData             )


//auth routes
app.post('/logPassword',         auth.logPassword          );
app.post('/checkPassword',       auth.checkPassword        );
app.post('/resetPassword',       auth.resetPassword        );
app.post('/newPasswordLogin',    auth.newPasswordLogin     );


//newsletter routes
app.post('/generateNewsletter',  nl.getNewStories,
                                 nl.getScheduledStories,
                                 emails.newsletter         );

app.post('/scheduledStories',    nl.getScheduledStories    );

app.get( '/reviseNewsletter',    nl.getScheduledStories,
                                 emails.newsletter         );

app.get('/publishNewsletter',    nl.getScheduledStories,
                                 nl.getEmails,
                                 emails.newsletter         );

app.post('/subscribe',           nl.subscribe              );
// app.post('/unsubscribe',         nl.unsubscribe            );
app.get( '/getEmailList',        nl.getEmails              );


//email routes
app.post('/email',               emails.formMail           );
                                                        
                                 
//portfolio routes
app.post('/newCategory',         portfolio.newCategory     );
app.post('/deleteCategory',      portfolio.deleteCategory  );
app.post('/getArticle',          portfolio.getArticle      );








const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
  console.log(process.env.EMAIL);
});