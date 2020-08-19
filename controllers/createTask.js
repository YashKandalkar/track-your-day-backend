const createTask = (req, res, db) => {
    const {
        id, title, body, color
    } = req.body;
    const date = new Date();

    db('tasks')
        .insert({
            user_id: id, 
            title, 
            body, 
            last_edited: date, 
            created: date,
            color, 
            status: 'pending'
        })
        .returning(['task_id', 'created'])
        .then(data => {
            res.status(200).json(data[0]);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("something went wrong");
        })
}

export default createTask;