const deleteTasks = (req, res, db) => {
    const { task_ids } = req.body;
    db('tasks')
        .whereIn('task_id', task_ids)
        .del()
        .then(rowsDeleted => {
            res.status(200).json(rowsDeleted);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("something went wrong");
        })
}

export default deleteTasks;