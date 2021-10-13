import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Permiso, PermisoRelations, Rol, PermisoRol} from '../models';
import {PermisoRolRepository} from './permiso-rol.repository';
import {RolRepository} from './rol.repository';

export class PermisoRepository extends DefaultCrudRepository<
  Permiso,
  typeof Permiso.prototype._id,
  PermisoRelations
> {

  public readonly roles: HasManyThroughRepositoryFactory<Rol, typeof Rol.prototype._id,
          PermisoRol,
          typeof Permiso.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PermisoRolRepository') protected permisoRolRepositoryGetter: Getter<PermisoRolRepository>, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Permiso, dataSource);
    this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', rolRepositoryGetter, permisoRolRepositoryGetter,);
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
  }
}
