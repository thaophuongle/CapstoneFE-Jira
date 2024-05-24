import { https } from './config'

export const updateProject = {
    getProjectDetail: (id) => {
        return https.get(`/api/Project/getProjectDetail?id=${id}`)
    },
    putProjectDetail: (id, data) => {
        return https.put(`/api/Project/updateProject?projectId=${id}`, data)
    }
}