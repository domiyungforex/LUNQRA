import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, Input, ErrorState } from '@/design-system/primitives';
test('disabled or busy buttons do not execute actions', async () => {
  const action = jest.fn();
  const { rerender } = await render(<Button label="Publish" onPress={action} disabled />);
  await fireEvent.press(screen.getByRole('button', { name: 'Publish' }));
  await rerender(<Button label="Publish" onPress={action} loading />);
  await fireEvent.press(screen.getByRole('button', { name: 'Publish' }));
  expect(action).not.toHaveBeenCalled();
  await rerender(<Button label="Publish" onPress={action} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Publish' }));
  expect(action).toHaveBeenCalledTimes(1);
});
test('inputs expose labels and actionable errors', async () => {
  await render(<Input label="Username" error="Choose a username." />);
  expect(screen.getByLabelText('Username')).toBeTruthy();
  expect(screen.getByRole('alert')).toHaveTextContent('Choose a username.');
});
test('error state retries only on user action', async () => {
  const retry = jest.fn();
  await render(<ErrorState description="Check your connection." onRetry={retry} />);
  expect(retry).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
  expect(retry).toHaveBeenCalledTimes(1);
});
