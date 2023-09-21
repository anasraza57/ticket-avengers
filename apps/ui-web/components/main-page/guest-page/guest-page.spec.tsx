import { render } from '@testing-library/react'

import GuestPage from './guest-page'

jest.mock('next/navigation')

describe('GuestPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GuestPage />)
    expect(baseElement).toBeTruthy()
  })
})
