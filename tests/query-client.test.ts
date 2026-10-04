import { createQueryClient } from '@/lib/query-client';
test('failed mutations are never automatically replayed', async () => {
  const client = createQueryClient();
  const mutationFn = jest.fn().mockRejectedValue(new Error('Network lost after submission'));
  const mutation = client.getMutationCache().build(client, { mutationFn });
  await expect(mutation.execute(undefined)).rejects.toThrow('Network lost');
  expect(mutationFn).toHaveBeenCalledTimes(1);
  client.clear();
});
test('client caches remain isolated', () => {
  const first = createQueryClient();
  const second = createQueryClient();
  first.setQueryData(['profile'], { displayName: 'Private profile' });
  expect(second.getQueryData(['profile'])).toBeUndefined();
  first.clear(); second.clear();
});
