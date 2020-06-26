import { head } from 'ramda'
import { pool } from '@protocol/pg'
import { Identified } from '@adapter/id'
import * as Q from './sql/todo.queries'
import * as C from '../core.adapter'

export const getAllTodos = () => Q.getTodos.run(undefined, pool())

export const get = (id: Identified<C.Todo>['id']) =>
  Q.get.run({ id }, pool()).then(head)

export const update = (todo: Identified<C.Todo>) =>
  Q.update.run({ duedate: null, ...todo }, pool())

export const addTodo = async (todo: C.FutureTodo): Promise<number> => {
  const result = head(await Q.addTodo.run({ todo }, pool()))
  if (!result) throw ReferenceError('result of #addTodo is empty')
  return result.id
}
