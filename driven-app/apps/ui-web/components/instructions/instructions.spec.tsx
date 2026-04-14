import { render } from '@testing-library/react';

import Instructions from './instructions';

describe('Instructions', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<Instructions />);
    expect(baseElement).toBeTruthy();
  });
  
});
