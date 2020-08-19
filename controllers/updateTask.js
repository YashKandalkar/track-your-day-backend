const updateTask = (req, res, db) => {
    const {
        task_id
    } = req.body;
    let updateArray = {};
    Object.keys(req.body).forEach(el => {
        if(el !== undefined){
            updateArray[el] = req.body[el];
        }
    })

    db('tasks')
        .where('task_id', '=', task_id)
        .update({...req.body, last_edited: new Date()})
        .returning('*')
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("bad request");
        });
}

export default updateTask;