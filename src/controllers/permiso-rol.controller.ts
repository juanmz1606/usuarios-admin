import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Permiso,
PermisoRol,
Rol,
} from '../models';
import {PermisoRepository} from '../repositories';

export class PermisoRolController {
  constructor(
    @repository(PermisoRepository) protected permisoRepository: PermisoRepository,
  ) { }

  @get('/permisos/{id}/rols', {
    responses: {
      '200': {
        description: 'Array of Permiso has many Rol through PermisoRol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rol)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return this.permisoRepository.roles(id).find(filter);
  }

  @post('/permisos/{id}/rols', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rol)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Permiso.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRolInPermiso',
            exclude: ['_id'],
          }),
        },
      },
    }) rol: Omit<Rol, '_id'>,
  ): Promise<Rol> {
    return this.permisoRepository.roles(id).create(rol);
  }

  @patch('/permisos/{id}/rols', {
    responses: {
      '200': {
        description: 'Permiso.Rol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Partial<Rol>,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.permisoRepository.roles(id).patch(rol, where);
  }

  @del('/permisos/{id}/rols', {
    responses: {
      '200': {
        description: 'Permiso.Rol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.permisoRepository.roles(id).delete(where);
  }
}
