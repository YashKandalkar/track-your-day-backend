const updateMultiple = (req, res, db) => {
    const {task_ids, ...data} = req.body;
    
    db('tasks')
        .whereIn('task_id', task_ids)
        .update({...data, last_edited: new Date()})
        .returning('*')
        .then(d => {
            res.status(200).json(d);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("bad request");
        });
}

export default updateMultiple;