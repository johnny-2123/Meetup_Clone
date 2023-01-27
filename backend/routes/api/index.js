
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const eventsRouter = require('./events.js');
const groupsRouter = require('./groups.js');
const eventImagesRouter = require('./eventImages.js');
const groupImagesRouter = require('./groupImages.js');

const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/events', eventsRouter);

router.use('/groups', groupsRouter);

router.use('/event-Images', eventImagesRouter);

router.use('/group-Images', groupImagesRouter);


router.get('/test', (req, res) => {
    res.json('hello');
});
router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;
