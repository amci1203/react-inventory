/*

This module will contain mainly admin routes
such as logging in and out, and CRUD operations for users

*/

module.exports = router => {

    router.get('/:department', (req, res) => {

        res.end();

    });



    return router;
}
