/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FilterSupplier } from './Supplier';
import type { CategorySupplier } from './Category';
import type { RenderAuth } from './Auth';
import type {
  DataDepartment,
  Department,
  DepartmentNode,
  TransformedDepartment,
  DepartmentRoot,
} from './Department';
import type { QuasarSelect, QuasarTable } from './Quasar';
import type { RoleSelect } from './Role';
import type { FilterUser, User } from './User';

export {};

declare global {
  type IRenderAuth = RenderAuth;

  type IDataDepartment = DataDepartment;
  type IDepartment = Department;
  type IDepartmentNode = DepartmentNode;
  type ITransformedDepartment = TransformedDepartment;
  type IDepartmentRoot = DepartmentRoot;
  type IDepartmentSelect = DepartmentSelect;

  type IQuasarSelect<T = any> = QuasarSelect<T>;
  type IQuasarTable = QuasarTable;

  type IUser = User;
  type IUserSystem = UserSystem;
  type IFilterUser = FilterUser;

  type ICategorySupplier = CategorySupplier;

  type ISupplier = Supplier;
  type IFilterSupplier = FilterSupplier;

  type IRoleSelect = RoleSelect;
}
