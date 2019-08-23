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
import serviceAccount from "./aux.json";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
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
import * as FunologyControllers from "./controllers/FunologyEvents";
import * as ManagementControllers from "./controllers/ManagementModule";
import * as SchoolModuleControllers from "./controllers/SchoolModule";
import * as SocialControllers from "./controllers/SocialInitiaves";
import * as SportsControllers from "./controllers/Sports";
import * as TechnicalControllers from "./controllers/technicalEvents";
import * as webDevelopersControllers from "./controllers/webDevelopers";
import * as ErrorControllers from "./controllers/Error";
import * as successControllers from "./controllers/Success";




export const defaultApp = firebaseadmin.initializeApp({
    credential: firebaseadmin.credential.cert(serviceAccount as any),
    databaseURL: "https://auxesis-v9.firebaseio.com"
  });


// API keys and Passport configuration
import * as passportConfig from "./config/passport";

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
app.post("/workshop/Robotics", workshopController.roboticsPostSubmit);
app.post("/workshop/ICEngine", workshopController.icEnginePostSubmit);


app.get("/blog", blogController.index);

app.get("/creativity", creativityEventsControllers.index);
app.post("/creativity/candid", creativityEventsControllers.candidPostSubmit);
app.post("/creativity/waste", creativityEventsControllers.wastePostSubmit);
app.post("/creativity/doodling", creativityEventsControllers.doodlingPostSubmit);
app.post("/creativity/mega", creativityEventsControllers.megaPixelPostSubmit);
app.post("/creativity/grafity", creativityEventsControllers.grafityPostSubmit);
app.post("/creativity/treasure", creativityEventsControllers.treasureHuntPostSubmit);


app.get("/cultural", CulturelEventsControllers.index);
app.post("/cultural/ranshak", CulturelEventsControllers.ranshakPostSubmit);
app.post("/cultural/kallestia", CulturelEventsControllers.kallasteiaPostSubmit);
app.post("/cultural/culturalExchange", CulturelEventsControllers.culturalExchangePostSubmit);
app.post("/cultural/xobde", CulturelEventsControllers.xobdePostSubmit);
app.post("/cultural/goStreets", CulturelEventsControllers.goStreetzPostSubmit);
app.post("/cultural/chromaticWaltz", CulturelEventsControllers.chromaticWaltzPostSubmit);
app.post("/cultural/Roots", CulturelEventsControllers.rootsPostSubmit);
app.post("/cultural/euphonics", CulturelEventsControllers.euphonicsPostSubmit);




app.get("/exhibitions", ExhibitionControllers.index);
app.get("/funology", FunologyControllers.index);
app.get("/management", ManagementControllers.index);


app.get("/schoolNmodule", SchoolModuleControllers.index);
app.post("/schoolNmodule/warwords", SchoolModuleControllers.warWordsPostSubmit);
app.post("/schoolNmodule/vibgyor", SchoolModuleControllers.vibgyorPostSubmit);
app.post("/schoolNmodule/blink", SchoolModuleControllers.blinkPostSubmit);
app.post("/schoolNmodule/openMic", SchoolModuleControllers.openMicPostSubmit);
app.post("/schoolNmodule/trivial", SchoolModuleControllers.triavialwarWordsPostSubmit);
app.post("/schoolNmodule/cine", SchoolModuleControllers.cineVisionPostSubmit);




app.get("/socialinitiatives", SocialControllers.index);

app.get("/sports", SportsControllers.index);
app.post("/sports/hatrick", SportsControllers.hatrickPostSubmit);
app.post("/sports/thirdPocket", SportsControllers.thirdPocketPostSubmit);
app.post("/sports/tennis", SportsControllers.tennisPostSubmit);
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
app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  res.redirect(req.session.returnTo || "/");
});

export default app;
