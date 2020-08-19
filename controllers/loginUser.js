const handleLogin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    db.select('hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            if(data.length){
                const { id, hash } = data[0];
                bcrypt.compare(password, hash).then(result => {
                    if(result === true){
                        //select from user's activity db
                        db.select('id', 'name', 'joined')
                            .from('users')
                            .where('email', '=', email)
                            .then(data => {
                                res.status(200).json(data[0]);
                            })
                            .catch(console.log)
                    }
                    else{
                        res.status(404).json("invalid username or password")
                    }
                });
            }
            else{
                res.status(400).json("bad request");
            }
        })
        .catch(console.log)
}

export default handleLogin;