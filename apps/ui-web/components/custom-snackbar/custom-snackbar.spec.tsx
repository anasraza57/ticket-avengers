import { render } from '@testing-library/react';

import CustomSnackbar from './custom-snackbar';

describe('CustomSnackbar', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<CustomSnackbar />);
    expect(baseElement).toBeTruthy();
  });
  
});
