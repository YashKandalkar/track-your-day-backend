const markCompleted = (req, res, db) => {
    const { task_id } = req.body;
    db('tasks')
        .update('status', 'completed')
        .where('task_id', task_id)
        .then(() => {
            res.status(200).json("updated");
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("bad request");
        })
}

export default markCompleted;