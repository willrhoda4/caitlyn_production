







//Server code for caitlyngowriluk.com
const express       = require('express'        );
const cors          = require('cors'           );
const bodyParser    = require('body-parser'    );
const path          = require('path'           );
const compression   = require('compression'    );

                      require('dotenv').config()

const app = express();
      app.use(cors());
      app.use(compression());     // sets up gzip
      app.use(bodyParser.json());
      app.use(express.static(path.join(__dirname, 'build')));
      app.use((req, res, next) => {  //  vvv sets up cache control headers for static assets

            const staticAssetExtensions = ['.js', '.css', '.jpg', '.png', '.gif', '.jpeg'];
    
            if (staticAssetExtensions.some(ext => req.url.endsWith(ext))) {
              res.set('Cache-Control', 'public, max-age=86400'); // Cache for one day
            }
          
            next();
          });
    


//Handler functions                   
const db            = require('./handlers/database.js'  );
const nl            = require('./handlers/newsletter.js');
const auth          = require('./handlers/auth.js'      );
const emails        = require('./handlers/emails.js'    );
const portfolio     = require('./handlers/portfolio.js' );







//database routes
app.post('/getData',             db.getData                ); // gets data from database
app.post('/deleteData',          db.deleteData             ); // deletes data from database
app.post('/addData',             db.addData                ); // adds data to database
app.put( '/reRankData',          db.reRankData             ); // re-ranks data in database
app.put( '/updateData',          db.updateData             ); // updates data in database


//auth routes
app.post('/checkPassword',       auth.getPasswordData,
                                 auth.checkPassword        ); // checks password for admin

app.post('/resetLink',           auth.registerReset,
                                 emails.sendResetLink      ); // sends reset link to website email

app.post('/resetPassword',       auth.getTokenData,
                                 auth.verifyTokenData,
                                 auth.resetPassword        ); // resets password for admin


//newsletter routes
app.post('/subscribe',           nl.subscribe              ); // handles email subscription requests

app.get( '/getEmailList',        nl.getEmails              ); // gets list of emails for admin

app.post('/newsletterPreview',   emails.newsletter         ); // sends newsletter preview to admin

app.post('/newsletterPublish',   emails.newsletter         ); // sends newsletter to all subscribers

//email routes
app.post('/email',               emails.getAdminEmail,
                                 emails.formMail           ); // sends email from contact form to admin
                                                        
                                 
//portfolio routes
app.post('/newCategory',         portfolio.newCategory     ); // creates new category for portfolio

app.post('/deleteCategory',      portfolio.deleteCategory  ); // deletes category from portfolio


//serves react app
app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`App listening at http://localhost:${PORT}`);  });