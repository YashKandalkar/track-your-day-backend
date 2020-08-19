const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const saltRounds = 10;

const registerUser = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body;
    if(email.match(emailformat)){
        db.transaction(trx => {
            db.insert({
                    name, 
                    email, 
                    joined: new Date()
                })
                .into('users')
                .transacting(trx)
                .returning(['id', 'name', 'joined'])
                .then(userData => {
                    bcrypt.hash(password, saltRounds)
                        .then(hash => {
                            db('login')
                                .insert({id: userData[0].id, email, hash})
                                .transacting(trx)
                                .then(data => {
                                    return userData[0]
                                })
                                .then(trx.commit)
                                .catch(trx.rollback)
                        }) 
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json("bad request");
                })
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("bad request");
        })
        
    }
    else {
        res.status(400).json("bad request");
    }  
}

export default registerUser;