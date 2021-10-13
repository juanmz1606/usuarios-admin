import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, RolRelations, Usuario, UsuarioRol, Permiso, PermisoRol} from '../models';
import {UsuarioRolRepository} from './usuario-rol.repository';
import {UsuarioRepository} from './usuario.repository';
import {PermisoRolRepository} from './permiso-rol.repository';
import {PermisoRepository} from './permiso.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly usuarios: HasManyThroughRepositoryFactory<Usuario, typeof Usuario.prototype._id,
          UsuarioRol,
          typeof Rol.prototype._id
        >;

  public readonly permisos: HasManyThroughRepositoryFactory<Permiso, typeof Permiso.prototype._id,
          PermisoRol,
          typeof Rol.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRolRepository') protected usuarioRolRepositoryGetter: Getter<UsuarioRolRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('PermisoRolRepository') protected permisoRolRepositoryGetter: Getter<PermisoRolRepository>, @repository.getter('PermisoRepository') protected permisoRepositoryGetter: Getter<PermisoRepository>,
  ) {
    super(Rol, dataSource);
    this.permisos = this.createHasManyThroughRepositoryFactoryFor('permisos', permisoRepositoryGetter, permisoRolRepositoryGetter,);
    this.registerInclusionResolver('permisos', this.permisos.inclusionResolver);
    this.usuarios = this.createHasManyThroughRepositoryFactoryFor('usuarios', usuarioRepositoryGetter, usuarioRolRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
