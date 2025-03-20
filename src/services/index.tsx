import Api from "./api"
import { Endpoints } from "./endpoints"

export const LoginApi = ({ setIsLoading = (p0: boolean) => { }, body = {} }) => {
    return new Promise<void>(async(resolve, reject) => {
        setIsLoading(true)
        const response = await Api.post(Endpoints.login, body).catch(err => err.response)
        setIsLoading(false)
        if (response.status == 200) {
            resolve(response?.data)
        }
        reject(response?.data?.error?.message)

    })
}