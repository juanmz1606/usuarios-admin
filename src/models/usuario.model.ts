import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {UsuarioRol} from './usuario-rol.model';

@model()
export class Usuario extends Entity {
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

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  documento: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaNacimiento: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  celular?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  estado: boolean;

  @property({
    type: 'string',
    required: true,
  })
  clave: string;

  @hasMany(() => Rol, {through: {model: () => UsuarioRol, keyFrom: 'id_usuario', keyTo: 'id_rol'}})
  roles: Rol[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
