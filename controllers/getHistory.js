const getHistory = (req, res, db, markAbandonedTasks, days_in_between) => {
    const { id, orderAsc } = req.body;
    
    db('tasks')
        .select('*')
        .where({user_id: id, status: 'pending'})
        .orderBy('created')
        .then(data => {
            if(data.length){
                return markAbandonedTasks(data);
            }
        })
        .then(d => {
            db('tasks')
                .select('*')
                .where('user_id', id)
                .whereNot('status', 'pending')
                .orderBy('created', (orderAsc===true)?'asc':'desc')
                .then(data => {
                    if(data.length){
                        let formattedData = [];
                        let olderThan7Days = [];

                        data.forEach(task => {
                            if(days_in_between(task.created, new Date()) <= 7){
                                formattedData.push(task);
                    
                            } else {
                                olderThan7Days.push(task.task_id);
                            }
                        })
                        res.status(200).json(formattedData);

                        if(olderThan7Days.length){
                            db('tasks')
                                .whereIn('task_id', olderThan7Days)
                                .del()
                                .catch(console.log)
                        }
                    } else {
                        res.status(404).json("no history");
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json("bad request");
                })
        })
        .catch(console.log)
}

export default getHistory;