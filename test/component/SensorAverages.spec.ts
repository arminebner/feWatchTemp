import { expect, test } from '@playwright/test'

test.use({ timezoneId: 'Europe/Paris' })

test('loads averages and updates them for a submitted date range', async ({
  mount,
  page,
}) => {
  await page.clock.setFixedTime(new Date('2024-01-15T12:00:00.000Z'))

  const requestedRanges: {
    sensor: string
    startDate: string | null
    endDate: string | null
  }[] = []
  await page.route('http://localhost:8080/**', async (route) => {
    const url = new URL(route.request().url())
    const startDate = url.searchParams.get('startDate')
    requestedRanges.push({
      sensor: url.pathname.includes('Sensor_1') ? 'Sensor_1' : 'Sensor_2',
      startDate,
      endDate: url.searchParams.get('endDate'),
    })

    const isManualRange = startDate?.startsWith('2024-01-01') ?? false
    const isLivingroom = url.pathname.includes('Sensor_1')
    const average = isManualRange
      ? isLivingroom
        ? { averageHumidity: 45.6, averageTemperature: 19.3 }
        : { averageHumidity: 52.1, averageTemperature: 18.7 }
      : isLivingroom
        ? { averageHumidity: 40.2, averageTemperature: 21.4 }
        : { averageHumidity: 49.8, averageTemperature: 20.1 }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(average),
    })
  })

  const component = await mount(
    'components/sensor-averages/SensorAverages/Default',
  )
  await expect(component.getByText('21.4°C', { exact: true })).toBeVisible()
  await expect(component.getByText('20.1°C', { exact: true })).toBeVisible()

  const defaultRange = {
    startDate: '2024-01-14T23:00:00.000Z',
    endDate: '2024-01-15T22:59:59.999Z',
  }
  expect(requestedRanges).toEqual(
    expect.arrayContaining([
      { sensor: 'Sensor_1', ...defaultRange },
      { sensor: 'Sensor_2', ...defaultRange },
    ]),
  )

  await component.getByLabel('Start date and time').fill('2024-01-01T08:00')
  await component.getByLabel('End date and time').fill('2024-01-01T12:00')
  await component.getByRole('button', { name: 'Update averages' }).click()

  await expect(component.getByText('19.3°C', { exact: true })).toBeVisible()
  await expect(component.getByText('18.7°C', { exact: true })).toBeVisible()
  expect(requestedRanges).toEqual(
    expect.arrayContaining([
      {
        sensor: 'Sensor_1',
        startDate: '2024-01-01T07:00:00.000Z',
        endDate: '2024-01-01T11:00:00.000Z',
      },
      {
        sensor: 'Sensor_2',
        startDate: '2024-01-01T07:00:00.000Z',
        endDate: '2024-01-01T11:00:00.000Z',
      },
    ]),
  )
})
