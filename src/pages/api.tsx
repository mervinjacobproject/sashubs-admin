import ApiClient from 'src/apiClient/apiClient/apiConfig'

export default async function handler(req: any, res: any) {
    const {
        method,
        body,
    } = req

    try {
        const { limit1, limit2 } = req.query

        let response = '';
        ApiClient.get(`/api.php?moduletype=invoice_mgmt&apitype=list-all&status=complete&limit1=${limit1}&limit2=${limit2}`)
            .then((res1: any) => {
                // response = res1.data[0]['invoice_array'];
                return res.status(200).json({ message: 'Success', response: res1.data })
            })
            .catch((err: any) => {
                response = err;
                console.error('Error fetching data:', err);
                return res.status(200).json({ message: 'error', err })
            });

    } catch (error) {
        return res.status(500).json(error)
    }
}
