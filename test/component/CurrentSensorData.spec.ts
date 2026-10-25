import { expect, test } from '@playwright/test'

test('shows placeholders until live sensor readings arrive', async ({
  mount,
  page,
}) => {
  await page.route('http://localhost:9092/**', (route) => route.abort())

  const component = await mount(
    'components/current-sensor-data/CurrentSensorData/Default',
  )

  await expect(
    component.getByRole('heading', { name: 'Live conditions' }),
  ).toBeVisible()
  await expect(
    component.getByText('Waiting for first reading').first(),
  ).toBeVisible()
  await expect(component.getByText('--').first()).toBeVisible()
})
