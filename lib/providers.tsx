'use client'

/* Core */
import { Provider } from 'react-redux'

/* Instruments */
import { reduxStore } from '@/lib/redux'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={reduxStore}>
        {props.children}
      </Provider>
    </QueryClientProvider>
  )
}
