import { prepare, expect, td, calling } from '@test'
import type * as StorageType from './storage.adapter'
import type * as UsecaseType from './usecase'

const { replace, load } = prepare(__dirname)

suite('todo use cases')

const storage = replace<typeof StorageType>('./storage.adapter')
const usecase = load<typeof UsecaseType>('./usecase')

test('mark pending task as done should update todo', async function () {
  const pendingtask = {
    id: 1,
    description: 'do the dishes',
    done: false,
    date: null
  }

  calling(storage.get(pendingtask.id)).resolves(pendingtask)
  await usecase.markAsDone(pendingtask.id)

  td.verify(
    storage.update({
      ...pendingtask,
      done: true,
      date: td.matchers.isA(Date)
    })
  )
})

// eslint-disable-next-line max-len
test('mark an already completed task as done should fail', async function () {
  const completedtask = {
    id: 1,
    done: true,
    date: new Date(),
    description: 'clean the dishes'
  }

  calling(storage.get(completedtask.id)).resolves(completedtask)

  expect(usecase.markAsDone(completedtask.id)).to.be.rejected
})
