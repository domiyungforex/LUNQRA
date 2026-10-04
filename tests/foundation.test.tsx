import { fireEvent, render, screen } from '@testing-library/react-native';
import { FoundationScreen } from '@/features/foundation/FoundationScreen';
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return { SafeAreaView: View };
});
test('missing credentials show setup state, without fabricating network content', async () => {
  await render(<FoundationScreen />);
  expect(screen.getByText('Setup is not complete')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Check again' }));
  expect(screen.getByText('Setup is not complete')).toBeTruthy();
});
