const cleanup = async (req, res, next) => {
    req.session.pwd_reset_email = undefined
    req.session.email_to_verify = undefined
    await req.session.save()
    next()
}

module.exports = cleanup