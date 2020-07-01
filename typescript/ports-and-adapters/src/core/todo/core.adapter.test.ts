import { expect, factory } from '@test'
import * as core from './core.adapter'
import { decode } from '@adapter/codec/decode'
import { omit } from 'ramda'

suite('todo core adapter')

type UnsafeTodo = { date: string; description: string; done: boolean }
const todoFactory = factory<UnsafeTodo>(faker => ({
  date: faker.date.recent().toISOString(),
  description: faker.lorem.sentence(),
  done: true
}))

test('decode PendingTask', async function () {
  const todo = todoFactory.build({ done: false })
  const decoded = decode(core.PendingTask, todo)
  expect(decoded).to.eql(omit(['date'], todo))
})

test('decode CompletedTask', async function () {
  const todo = todoFactory.build()
  const decoded = decode(core.CompletedTask, todo)
  expect(decoded).to.eql({
    ...todo,
    date: new Date(todo.date)
  })
})

test('decode Todo', async function () {
  const completedtask = todoFactory.build()
  const pendingtask = todoFactory.build({ done: false })

  const completedTaskDecoded = decode(core.Todo, completedtask)
  const pendingTaskDecoded = decode(core.Todo, pendingtask)

  expect(pendingTaskDecoded).to.eql(omit(['date'], pendingtask))
  expect(completedTaskDecoded).to.eql({
    ...completedtask,
    date: new Date(completedtask.date)
  })
})