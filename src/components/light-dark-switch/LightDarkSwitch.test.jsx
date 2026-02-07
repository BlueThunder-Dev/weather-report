import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import LightDarkSwitch from './LightDarkSwitch';

describe('LightDarkSwitch Component', () => {
  const fakeToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Should render with className containing dark with dark icon', () => {
    render(<LightDarkSwitch theme="dark" onToggle={fakeToggle} />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(button.className).toContain('dark');
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

    it('Should render with className containing light with light icon', () => {
    render(<LightDarkSwitch theme="light" onToggle={fakeToggle} />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(button.className).toContain('light');
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('Should execute function correctly when the button is clicked',()=>{
    render(<LightDarkSwitch theme="light" onToggle={fakeToggle} />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
  
    fireEvent.click(button);

    expect(fakeToggle).toHaveBeenCalledTimes(1)
  })
});