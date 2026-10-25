import { expect, test } from '@playwright/test'

test('renders the dashboard with mocked sensor API responses', async ({
  page,
}) => {
  await page.route('http://localhost:8080/**', async (route) => {
    const url = new URL(route.request().url())

    if (url.pathname.endsWith('/average')) {
      const isLivingroom = url.pathname.includes('Sensor_1')
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(
          isLivingroom
            ? { averageHumidity: 40.2, averageTemperature: 21.4 }
            : { averageHumidity: 49.8, averageTemperature: 20.1 },
        ),
      })
      return
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          deviceName: 'Sensor_1',
          humidity: 43,
          temperature: 21.5,
          timestamp: new Date().toISOString(),
        },
        {
          deviceName: 'Sensor_2',
          humidity: 51,
          temperature: 20.2,
          timestamp: new Date().toISOString(),
        },
      ]),
    })
  })
  await page.route('http://localhost:9092/**', (route) => route.abort())

  await page.goto('/dashboard')

  await expect(
    page.getByRole('heading', { name: 'Sensor dashboard' }),
  ).toBeVisible()
  await expect(page.getByText('Disconnected')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Live conditions' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: "Today's sensor readings" }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Historical averages' }),
  ).toBeVisible()
  await expect(page.getByText('21.4°C', { exact: true })).toBeVisible()
})
