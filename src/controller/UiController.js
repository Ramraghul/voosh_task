exports.home = async (req, res) => {
    try {
        return res.render('home')
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        return res.render('register')
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        return res.render('login')
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};