import { expect, test } from '@playwright/test'

test.use({ timezoneId: 'Europe/Paris' })

test('shows overview and detailed charts after loading readings', async ({
  mount,
  page,
}) => {
  await page.clock.setFixedTime(new Date('2024-01-15T12:00:00.000Z'))

  let requestedRange:
    { startDate: string | null; endDate: string | null } | undefined
  await page.route('http://localhost:8080/**', (route) => {
    const url = new URL(route.request().url())
    requestedRange = {
      startDate: url.searchParams.get('startDate'),
      endDate: url.searchParams.get('endDate'),
    }
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          deviceName: 'Sensor_1',
          humidity: 43,
          temperature: 21.5,
          timestamp: new Date().toISOString(),
        },
      ]),
    })
  })

  const component = await mount(
    'components/current-day-sensor-chart/CurrentDaySensorChart/Default',
  )

  await expect(
    component.getByRole('heading', { name: 'Day overview' }),
  ).toBeVisible()
  await expect(
    component.getByRole('heading', { name: 'Detailed view' }),
  ).toBeVisible()
  expect(requestedRange).toEqual({
    startDate: '2024-01-14T23:00:00.000Z',
    endDate: '2024-01-15T22:59:59.999Z',
  })
})
