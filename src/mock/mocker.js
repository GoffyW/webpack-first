module.exports = {
    'GET /user': {name: 'guofei'},
    'POST /login/account': (req, res) => {
        const { password, username } = req.body
        if (password === '888888' && username === 'admin') {
            return res.send({
                status: 'ok',
                code: 0,
                token: 'sdfsdfsdfdsf',
                data: { id: 1, name: 'guofei' }
            })
        } else {
            return res.send({ status: 'error', code: 403 })
        }
    }
}
