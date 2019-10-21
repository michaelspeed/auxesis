import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

import * as firebaseadmin from "firebase-admin";
import serviceAccount from "./fire.json";


// import sgMail from "@sendgrid/mail";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as contactController from "./controllers/contact";
import * as eventController from "./controllers/events";
import * as speakerController from "./controllers/speaker";
import * as adroitVieController from "./controllers/adroitVie";
import * as sponsorController from "./controllers/sponsor";
import * as scheduleController from "./controllers/schedule";
import * as galleryController from "./controllers/gallery";
import * as teamController from "./controllers/team";
import * as workshopController from "./controllers/workshop";
import * as blogController from "./controllers/blog";
import * as creativityEventsControllers from "./controllers/CreativityEvents";
import * as CulturelEventsControllers from "./controllers/CulturelEvents";
import * as ExhibitionControllers from "./controllers/Exhibitions";
import * as ManagementControllers from "./controllers/ManagementModule";
import * as SchoolModuleControllers from "./controllers/SchoolModule";
import * as SportsControllers from "./controllers/Sports";
import * as TechnicalControllers from "./controllers/technicalEvents";
import * as webDevelopersControllers from "./controllers/webDevelopers";
import * as ErrorControllers from "./controllers/Error";
import * as successControllers from "./controllers/Success";

import * as accomodationsController from "./controllers/accomodation";




export const defaultApp = firebaseadmin.initializeApp({
    credential: firebaseadmin.credential.cert(serviceAccount as any),
    databaseURL: "https://auxesis-v9.firebaseio.com"
});

export const MAIN_HTML = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
    "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
    "<head>\n" +
    "\n" +
    "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
    "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1\">\n" +
    "<title>makit </title>\n" +
    "\n" +
    "<link href='http://fonts.googleapis.com/css?family=Montserrat:400,500,300,600,700' rel='stylesheet' type='text/css'>\n" +
    "<link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel=\"stylesheet\">\n" +
    "<link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\">\n" +
    "<link href=\"https://fonts.googleapis.com/css?family=Condiment\" rel=\"stylesheet\">\n" +
    "\n" +
    "<style type=\"text/css\">\n" +
    "\n" +
    "        body{ margin:0; padding:0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; background:#242f35;}\n" +
    "\n" +
    "        span.preheader{display: none; font-size: 1px;}\n" +
    "\n" +
    "        html { width: 100%; }\n" +
    "\n" +
    "        table { border-spacing: 0; border-coll apse: collapse;}\n" +
    "\n" +
    "\t\t.ReadMsgBody { width: 100%; background-color: #FFFFFF; }\n" +
    "\n" +
    "        .ExternalClass { width: 100%; background-color: #FFFFFF; }\n" +
    "\n" +
    "        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalCl ass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }\n" +
    "\n" +
    "\t\ta,a:hover { text-decoration:none; color:#FFF;}\n" +
    "\n" +
    "\t\timg { display: block !important; }\n" +
    "\n" +
    "        table td { border-collapse: collapse; }\n" +
    "\n" +
    "\n" +
    "\t\t@media only screen and (max-width:640px)\n" +
    "\n" +
    "{\n" +
    "\tbody {width:auto!important;}\n" +
    "\ttable [class=main] {width:85% !important;}\n" +
    "\ttable [class=full] {width:100% !important; margin:0px auto;}\n" +
    "\ttable [class=two-left-inner] {width:90% !important; margin:0px auto;}\n" +
    "\ttd[class=\"two-left\"] { display: block; width: 100% !important; }\n" +
    "\ttable [class=menu-icon] { display:none;}\n" +
    "\timg[class=\"image-full\"] { width: 100% !important; }\n" +
    "\ttable[class=menu-icon] { display:none;}\n" +
    "\n" +
    "\t}\n" +
    "\n" +
    "@media only screen and (max-width:479px)\n" +
    "{\n" +
    "\tbody {width:auto!important;}\n" +
    "\ttable [class=main] {width:93% !important;}\n" +
    "\ttable [class=full] {width:100% !important; margin:0px auto;}\n" +
    "\ttd[class=\"two-left\"] { display: block; width: 100% !important; }\n" +
    "\ttable [class=two-left-inner] {width:90% !important; margin:0px auto;}\n" +
    "\ttable [class=menu-icon] { display:none;}\n" +
    "\timg[class=\"image-full\"] { width: 100% !important; }\n" +
    "\ttable[class=menu-icon] { display:none;}\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\t\t</style>\n" +
    "\n" +
    "</head>\n" +
    "\n" +
    "<body yahoo=\"fix\" leftmargin=\"0\" topmargin=\"0\" marginwidth=\"0\" marginheight=\"0\">\n" +
    "\n" +
    "<!--Main Table Start-->\n" +
    "\n" +
    "<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#242f35\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\">\n" +
    "\n" +
    "    <!--Logo Part Start-->\n" +
    "\n" +
    "    <table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\"><table width=\"700\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"main\">\n" +
    "      <tr>\n" +
    "        <td align=\"center\" valign=\"top\" bgcolor=\"#ffffff\"><table width=\"600\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"two-left-inner\">\n" +
    "          <tr>\n" +
    "            <td height=\"25\" align=\"left\" valign=\"top\" style=\"font-size:25px; line-height:25px;\">&nbsp;</td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <td align=\"center\" valign=\"top\"><table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "              <tr>\n" +
    "                <td align=\"center\" valign=\"top\"><a href=\"#\"><img editable=\"true\" mc:edit=\"mm-01\" src=\"http://auxesis.in/images/MainLogo.png\" width=\"92\" height=\"32\" alt=\"\" style=\"object-fit: contain\"/></a></td>\n" +
    "              </tr>\n" +
    "            </table></td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <td height=\"25\" align=\"left\" valign=\"top\" style=\"font-size:25px; line-height:25px;\">&nbsp;</td>\n" +
    "          </tr>\n" +
    "        </table></td>\n" +
    "      </tr>\n" +
    "    </table></td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<!--Logo Part End-->\n" +
    "\n" +
    "<!--Banner Part Start-->\n" +
    "\n" +
    "<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\"><table width=\"700\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"main\">\n" +
    "      <tr>\n" +
    "        <td height=\"485\" align=\"center\" valign=\"top\" bgcolor=\"#d56516\" style=\"background:url(https://s3.amazonaws.com/events.tnw/tech5_2017/uploads/visuals/Tech-5-og-image.jpg) #d56516 center top no-repeat;\"><table width=\"600\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"two-left-inner\">\n" +
    "          <tr>\n" +
    "              <td height=\"150\" align=\"left\" valign=\"top\" style=\"font-size:150px; line-height:150px;\">&nbsp;</td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <td align=\"center\" valign=\"top\"><table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "              <tr>\n" +
    "                <td align=\"left\" valign=\"top\" style=\"font-size:30px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF;\" mc:edit=\"mm-02\"><multiline>Registration</multiline></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td align=\"left\" valign=\"top\" style=\"font-size:30px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:70px;\" mc:edit=\"mm-03\"><multiline><b style=\"font-size:60px;\">Successful</b></multiline></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td align=\"right\" valign=\"top\"><table width=\"150\" border=\"0\" align=\"right\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "                  <tr>\n" +
    "                    <td height=\"40\" align=\"center\" valign=\"middle\" bgcolor=\"#e8a06e\" style=\"font-family:'Open Sans', sans-serif, Verdana; font-size:20px; color:#FFF; font-weight:bold; line-height:12px; -moz-border-radius: 40px; border-radius: 40px;\" mc:edit=\"mm-04\"><multiline><a href=\"http://auxesis.in\" style=\"text-decoration:none; color:#FFF;\">auxesis.in</a></multiline></td>\n" +
    "                  </tr>\n" +
    "                </table></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td align=\"left\" valign=\"top\">&nbsp;</td>\n" +
    "              </tr>\n" +
    "            </table></td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "          <td height=\"150\" align=\"left\" valign=\"top\" style=\"font-size:150px; line-height:150px;\">&nbsp;</td>\n" +
    "          </tr>\n" +
    "        </table></td>\n" +
    "      </tr>\n" +
    "    </table></td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<!--Banner Part End-->\n" +
    "\n" +
    "<!--Menu Part Start-->\n" +
    "\n" +
    "<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\"><table width=\"700\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"main\">\n" +
    "      <tr>\n" +
    "        <td align=\"center\" valign=\"top\" bgcolor=\"#ffffff\"><table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"full\">\n" +
    "          <tr>\n" +
    "            <td width=\"175\" align=\"center\" valign=\"middle\" bgcolor=\"#f76d16\" style=\"font-size:16px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF;text-transform:uppercase; padding:30px 0px 30px 0px;\" class=\"two-left\" mc:edit=\"mm-05\"><multiline><a href=\"http://auxesis.in/technicalevents\" style=\"text-decoration:none; color:#FFF;\">Technical</a></multiline></td>\n" +
    "            <td width=\"175\" align=\"center\" valign=\"middle\" bgcolor=\"#e7620f\" style=\"font-size:16px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:24px; text-transform:uppercase; padding:30px 0px 30px 0px;\" class=\"two-left\" mc:edit=\"mm-06\"><multiline><a href=\"http://auxesis.in/creativity\" style=\"text-decoration:none; color:#FFF;\">Creativity</a></multiline></td>\n" +
    "            <td width=\"175\" align=\"center\" valign=\"middle\" bgcolor=\"#d0560a\" style=\"font-size:16px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:24px; text-transform:uppercase; padding:30px 0px 30px 0px;\" class=\"two-left\" mc:edit=\"mm-07\"><multiline><a href=\"http://auxesis.in/cultural\" style=\"text-decoration:none; color:#FFF;\">Cultural</a></multiline></td>\n" +
    "            <td width=\"175\" align=\"center\" valign=\"middle\" bgcolor=\"#f76d16\" style=\"font-size:16px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:24px; text-transform:uppercase; padding:30px 0px 30px 0px;\" class=\"two-left\" mc:edit=\"mm-08\"><multiline><a href=\"http://auxesis.in/sports\" style=\"text-decoration:none; color:#FFF;\">Sports</a></multiline></td>\n" +
    "          </tr>\n" +
    "        </table></td>\n" +
    "      </tr>\n" +
    "    </table></td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "\n" +
    "<!--Contact Title Part Start-->\n" +
    "\n" +
    "<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\"><table width=\"700\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"main\">\n" +
    "      <tr>\n" +
    "        <td align=\"center\" valign=\"top\" bgcolor=\"#dd5c0b\"><table width=\"500\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"two-left-inner\">\n" +
    "          <tr>\n" +
    "            <td height=\"120\" align=\"left\" valign=\"top\" style=\" font-size:120px;line-height:120px;\">&nbsp;</td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <td align=\"left\" valign=\"top\"><table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "              <tr>\n" +
    "                <td align=\"left\" valign=\"top\" style=\"font-size:14px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; padding-left:25px;\" mc:edit=\"mm-85\"><multiline>Get in touch</multiline></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td align=\"left\" valign=\"top\" style=\"font-size:60px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:60px;\" mc:edit=\"mm-86\"><multiline>Contact Us</multiline></td>\n" +
    "              </tr>\n" +
    "            </table></td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <td height=\"80\" align=\"left\" valign=\"top\" style=\" font-size:60px;line-height:60px;\">&nbsp;</td>\n" +
    "          </tr>\n" +
    "        </table></td>\n" +
    "      </tr>\n" +
    "    </table></td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<!--Contact Title Part End-->\n" +
    "\n" +
    "<!--Contact Text Part Start-->\n" +
    "\n" +
    "<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\"><table width=\"700\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"main\">\n" +
    "      <tr>\n" +
    "        <td align=\"center\" valign=\"top\" bgcolor=\"#dd5c0b\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
    "          <tr>\n" +
    "            <td width=\"425\" align=\"center\" valign=\"top\" class=\"two-left\"><img editable=\"true\" mc:edit=\"mm-87\" src=\"https://www.hollerings.com/wp-content/uploads/2019/07/sk-1024x621.jpg\" width=\"425\" height=\"365\" alt=\"\" style=\"display:block;width:100% !important; height:auto !important; \" /></td>\n" +
    "            <td width=\"275\" align=\"center\" valign=\"middle\" class=\"two-left\"><table width=\"165\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
    "              <tr>\n" +
    "                <td height=\"30\" align=\"center\" valign=\"middle\" style=\"font-size:30px; line-height:30px;\">&nbsp;</td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td align=\"center\" valign=\"middle\"><table width=\"100%\" border=\"0\" align=\"left\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\" style=\"font-size:24px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:30px;\" mc:edit=\"mm-88\"><multiline><b style=\"font-size:14px;\">Get in tuch</b><br />\n" +
    "                      Call us</multiline></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\" style=\"font-size:5px; line-height:5px;\">&nbsp;</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\" style=\"font-size:18px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:30px;\" mc:edit=\"mm-89\"><multiline>+9957552828\n" +
    "                      +9101325597\n" +
    "                    </multiline></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\" style=\"font-size:16px; font-family:'Open Sans', sans-serif, Verdana; font-weight:normal; color:#FFF; line-height:25px;\" mc:edit=\"mm-90\"><multiline>jyotishman.parasar8496@gmail.com</multiline></td>\n" +
    "                  </tr>\n" +
    "\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\" style=\"font-size:10px; line-height:10px;\">&nbsp;</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                   <td align=\"left\" valign=\"top\" style=\"font-size:18px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:30px;\" mc:edit=\"mm-91\"><multiline>Location</multiline></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                  <td align=\"left\" valign=\"top\" style=\"font-size:10px; line-height:10px;\">&nbsp;</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\" style=\"font-size:14px; font-family:'Open Sans', sans-serif, Verdana; font-weight:normal; color:#FFF; line-height:25px;\" mc:edit=\"mm-92\"><multiline>Dibrugarh University Institute of Engineering and Technology\n" +
    "                      Dibrugarh-786004</multiline></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td align=\"left\" valign=\"top\">&nbsp;</td>\n" +
    "                  </tr>\n" +
    "                </table></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td height=\"30\" align=\"center\" valign=\"middle\" style=\"font-size:30px; line-height:30px;\">&nbsp;</td>\n" +
    "              </tr>\n" +
    "            </table></td>\n" +
    "          </tr>\n" +
    "        </table></td>\n" +
    "      </tr>\n" +
    "    </table></td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<!--Contact Text Part End-->\n" +
    "\n" +
    "<!--Copyright Part Start-->\n" +
    "\n" +
    "<table width=\"100%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\n" +
    "  <tr>\n" +
    "    <td align=\"center\" valign=\"top\"><table width=\"700\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"main\">\n" +
    "      <tr>\n" +
    "        <td align=\"center\" valign=\"top\" bgcolor=\"#FFFFFF\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"full\">\n" +
    "          <tr>\n" +
    "            <td width=\"425\" align=\"center\" valign=\"top\" class=\"two-left\"><table width=\"425\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"full\">\n" +
    "              <tr>\n" +
    "                <td height=\"80\" align=\"center\" valign=\"middle\"><table border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"full\">\n" +
    "                  <tr>\n" +
    "                    <td height=\"5\" align=\"left\" valign=\"top\" style=\"font-size:5px; line-height:5px;\">&nbsp;</td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td align=\"center\" valign=\"top\" style=\"font-family:'Open Sans', sans-serif, Verdana; font-size:14px; color:#666; font-weight:normal;\" mc:edit=\"mm-100\"><multiline>Copyright &copy; 2019 auxesis.in</multiline> <b style=\"color:#424141;\"></b></td>\n" +
    "                  </tr>\n" +
    "                  <tr>\n" +
    "                    <td height=\"5\" align=\"left\" valign=\"top\" style=\"font-size:5px; line-height:5px;\">&nbsp;</td>\n" +
    "                  </tr>\n" +
    "                </table></td>\n" +
    "              </tr>\n" +
    "            </table></td>\n" +
    "            <td width=\"275\" align=\"center\" valign=\"middle\" bgcolor=\"#542101\" class=\"two-left\"><table width=\"150\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
    "             <tr>\n" +
    "                <td colspan=\"2\" align=\"left\" valign=\"bottom\" style=\"font-size:14px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:25px;\">&nbsp;</td>\n" +
    "                </tr>\n" +
    "              <tr>\n" +
    "                <td align=\"left\" valign=\"bottom\" style=\"font-size:14px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:25px;\" mc:edit=\"mm-101\"><multiline>Atmiyo <br />Technology <a href=\"https://atmiyo.technology/\" style=\"color:#dd5c0b; text-decoration:none;\">Evolution</a></multiline></td>\n" +
    "                <td width=\"30\" align=\"center\" valign=\"middle\" style=\"padding-top:6px;\"><img editable=\"true\" mc:edit=\"mm-102\" src=\"images/map-icon.png\" width=\"28\" height=\"32\" alt=\"\" /></td>\n" +
    "              </tr>\n" +
    "              <tr>\n" +
    "                <td colspan=\"2\" align=\"left\" valign=\"bottom\" style=\"font-size:14px; font-family:'Open Sans', sans-serif, Verdana; font-weight:bold; color:#FFF; line-height:25px;\">&nbsp;</td>\n" +
    "                </tr>\n" +
    "            </table></td>\n" +
    "          </tr>\n" +
    "        </table></td>\n" +
    "      </tr>\n" +
    "    </table></td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<!--Copyright Part End-->\n" +
    "\n" +
    "    </td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<!--Main Table End-->\n" +
    "\n" +
    "</body>\n" +
    "</html>\n";


// send grid mail config
// export const SENDGRID_API_KEY = "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";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: "dikhitbhuyan@gmail.com",
//   from: "test@example.com",
//   subject: "AuxesisV9.0",
//   text: "welcome to auxesis V9.0",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };
// sgMail.send(msg)

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 9896);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  /*store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })*/
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);
app.post("/sponsor", homeController.sponsorPostSubmit);

app.get("/events", eventController.index);

app.get("/error", ErrorControllers.index);
app.get("/success", successControllers.index);


app.get("/contact", contactController.index);
app.post("/contact/message", contactController.contactPostSubmit);

app.get("/speaker", speakerController.index);
app.get("/adroitvie", adroitVieController.index);
app.get("/sponsor", sponsorController.index);
app.get("/schedule", scheduleController.index);
app.get("/gallery", galleryController.index);
app.get("/team", teamController.index);

app.get("/workshop", workshopController.index);
app.post("/workshop/IOS", workshopController.IOSPostSubmit);
app.post("/workshop/matlab", workshopController.matlabPostSubmit);
app.post("/workshop/ICEngine", workshopController.icEnginePostSubmit);


app.get("/blog", blogController.index);

app.get("/creativity", creativityEventsControllers.index);
app.post("/creativity/canvas", creativityEventsControllers.canvasPostSubmit);
app.post("/creativity/doodling", creativityEventsControllers.doodlingPostSubmit);
app.post("/creativity/artexpo", creativityEventsControllers.artExpoPostSubmit);
app.post("/creativity/talenthunt", creativityEventsControllers.TalentgPostSubmit);
app.post("/creativity/snapshot", creativityEventsControllers.SnapshotPostSubmit);



app.get("/cultural", CulturelEventsControllers.index);
app.post("/cultural/ranshak", CulturelEventsControllers.ranshakPostSubmit);
app.post("/cultural/kallestia", CulturelEventsControllers.kallasteiaPostSubmit);
app.post("/cultural/culturalExchange", CulturelEventsControllers.culturalExchangePostSubmit);
app.post("/cultural/xobde", CulturelEventsControllers.xobdePostSubmit);
app.post("/cultural/goStreets", CulturelEventsControllers.goStreetzPostSubmit);
app.post("/cultural/chromaticWaltz", CulturelEventsControllers.chromaticWaltzPostSubmit);
app.post("/cultural/Roots", CulturelEventsControllers.rootsPostSubmit);
app.post("/cultural/euphonics", CulturelEventsControllers.euphonicsPostSubmit);
app.post("/cultural/TSeries", CulturelEventsControllers.tseriesPostSubmit);





app.get("/exhibitions", ExhibitionControllers.index);
app.get("/management", ManagementControllers.index);


app.get("/schoolNmodule", SchoolModuleControllers.index);
app.post("/schoolNmodule/warwords", SchoolModuleControllers.warWordsPostSubmit);
app.post("/schoolNmodule/vibgyor", SchoolModuleControllers.vibgyorPostSubmit);
app.post("/schoolNmodule/blink", SchoolModuleControllers.blinkPostSubmit);
app.post("/schoolNmodule/openMic", SchoolModuleControllers.openMicPostSubmit);
app.post("/schoolNmodule/trivial", SchoolModuleControllers.triavialwarWordsPostSubmit);
app.post("/schoolNmodule/cine", SchoolModuleControllers.cineVisionPostSubmit);




app.get("/sports", SportsControllers.index);
app.post("/sports/hatrick", SportsControllers.hatrickPostSubmit);
app.post("/sports/thirdPocket", SportsControllers.thirdPocketPostSubmit);
app.post("/sports/badminton", SportsControllers.badmintonPostSubmit);
app.post("/sports/Joga", SportsControllers.JogaPostSubmit);


app.get("/technicalevents", TechnicalControllers.index);
app.post("/technicalevents/addavega", TechnicalControllers.postSubmit);
app.post("/technicalevents/addDevelopers", TechnicalControllers.devPostSubmit);
app.post("/technicalevents/roboAssult", TechnicalControllers.roboAssultPostSubmit);
app.post("/technicalevents/roboSoccer", TechnicalControllers.roboSoccerPostSubmit);
app.post("/technicalevents/survivorbot", TechnicalControllers.SurvivorBotPostSubmit);
app.post("/technicalevents/cubicon", TechnicalControllers.cubiconPostSubmit);
app.post("/technicalevents/techExhibition", TechnicalControllers.techExPostSubmit);



app.get("/webdesigners", webDevelopersControllers.index);

app.get("/accomodation", accomodationsController.index);
app.post("/accomodation/for_boys_processing", accomodationsController.boysPostSubmit);
app.post("/accomodation/for_girls_propcessing", accomodationsController.girlsPostSubmit);






 // unused
/*app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);*/

/**
 * API examples routes.
 */


/**
 * OAuth authentication routes. (Sign in)
 */

export default app;
