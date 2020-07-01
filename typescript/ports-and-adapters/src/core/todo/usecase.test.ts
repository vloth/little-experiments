import * as t from '@test'
import type * as StorageType from './storage.adapter'
import type * as UsecaseType from './usecase'

const { replace, load } = t.prepare(__dirname)

const todoFactory = t.factory<typeof StorageType['get']>(faker => ({
  id: faker.random.number(),
  description: faker.lorem.sentence(),
  date: faker.date.recent(),
  done: faker.random.boolean()
}))

suite('todo use cases')

const storage = replace<typeof StorageType>('./storage.adapter')
const usecase = load<typeof UsecaseType>('./usecase')

test('mark pending task as done should update todo', async function () {
  const pendingtask = todoFactory.build({ done: false, date: null })

  t.calling(storage.get(pendingtask.id)).resolves(pendingtask)
  await usecase.markAsDone(pendingtask.id)

  t.verify(
    storage.update({
      ...pendingtask,
      done: true,
      date: t.matchers.isA(Date)
    })
  )
})

test('mark an already completed task as done should fail', async function () {
  const completedtask = todoFactory.build({ done: true, date: new Date() })

  t.calling(storage.get(completedtask.id)).resolves(completedtask)

  t.expect(usecase.markAsDone(completedtask.id)).to.be.rejected
})