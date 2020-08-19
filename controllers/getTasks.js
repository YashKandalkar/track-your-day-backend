const getTasks = (req, res, db, markAbandonedTasks) => {
    const { id } = req.body;
    db.select('*')
        .from('tasks')
        .where({user_id: id, status: 'pending'})
        .orderBy('created')
        .then(data => {
            if(data.length){
                const formattedData = markAbandonedTasks(data);
                res.status(200).json(formattedData);
            }
            else{
                res.status(404).json("not found");
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("something went wrong");
        })
}

export default getTasks;