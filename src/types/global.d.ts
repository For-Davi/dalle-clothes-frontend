/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RenderAuth } from './Auth'
import type {
  DataDepartment,
  Department,
  DepartmentNode,
  TransformedDepartment,
  DepartmentRoot
} from './Department'
import type { QuasarSelect, QuasarTable } from './Quasar'
import type { User } from './User'

export {}

declare global {
  type IRenderAuth = RenderAuth

  type IDataDepartment = DataDepartment
  type IDepartment = Department
  type IDepartmentNode = DepartmentNode
  type ITransformedDepartment = TransformedDepartment
  type IDepartmentRoot = DepartmentRoot

  type IQuasarSelect<T = any> = QuasarSelect<T>
  type IQuasarTable = QuasarTable
  type IUser = User
}
