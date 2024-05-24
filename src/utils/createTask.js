import { https } from './config'

export const createTask = {
    getAllProject: () => {
        return https.get('/api/Project/getAllProject')
    },
    getStatus: () => {
        return https.get('/api/Status/getAll')
    },
    getPriority: () => {
        return https.get('/api/Priority/getAll')
    },
    getTaskType: () => {
        return https.get('/api/TaskType/getAll')
    },
    getUserById: (id) => {
        return https.get(`/api/Users/getUserByProjectId?idProject=${id}`)
    },
    postCreateTask: (data) => {
        return https.post('/api/Project/createTask', data)
    }
}
