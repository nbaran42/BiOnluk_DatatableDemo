import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

export const useApi = createFetch({
  // baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {

      // burada ben public bir api'ye request gönderdiğim için yoruma aldum.
      // eğer burada authentication kullanacaksanız aşağıdaji yorumu siliniz.
      // ben token 2 cookie de tutuyorum. isterseniz pinia ile store da tutabilirsiniz.

      // const accessToken = useCookie('accessToken').value

      // if (accessToken) {
      //   options.headers = {
      //     ...options.headers,
      //     Authorization: `Bearer ${accessToken}`,

      //   }
      // }

      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }

      return { data: parsedData, response }
    },
  },
})
