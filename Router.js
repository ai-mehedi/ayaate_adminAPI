var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.use('/users', require('./routes/users'));
router.use('/auth', require('./routes/auth'))
router.use('/categories', require('./routes/category'))
router.use('/subcategories', require('./routes/subcategory'))
router.use('/comments', require('./routes/comment'))
router.use('/reviews', require('./routes/review'))
router.use('/comparisons', require('./routes/comparison'))
router.use('/articles', require('./routes/article'))
router.use('/contacts', require('./routes/contact'))
router.use('/subscriber', require('./routes/subscriber'))

module.exports = router;
