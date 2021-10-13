import {Entity, model, property, hasMany} from '@loopback/repository';
import {Usuario} from './usuario.model';
import {UsuarioRol} from './usuario-rol.model';
import {Permiso} from './permiso.model';
import {PermisoRol} from './permiso-rol.model';

@model()
export class Rol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @hasMany(() => Usuario, {through: {model: () => UsuarioRol, keyFrom: 'id_rol', keyTo: 'id_usuario'}})
  usuarios: Usuario[];

  @hasMany(() => Permiso, {through: {model: () => PermisoRol, keyFrom: 'id_rol', keyTo: 'id_permiso'}})
  permisos: Permiso[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
