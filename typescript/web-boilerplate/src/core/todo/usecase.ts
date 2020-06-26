import { decode } from '@adapter/codec/decode'
import * as C from './core.adapter'
import * as S from './storage.adapter'

export async function markAsDone(id: number) {
  const todo = await S.get(id).then(decode(C.identified(C.FutureTodo)))
  const newTodo = { ...todo, done: true, duedate: new Date() }
  await S.update(newTodo)
}