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
  response,
} from '@loopback/rest';
import {
  Usuario,
  UsuarioRol,
  Rol,
  ArregloRoles,
} from '../models';
import {UsuarioRepository, UsuarioRolRepository} from '../repositories';

export class UsuarioRolController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
    @repository(UsuarioRolRepository) protected usuarioRolRepository: UsuarioRolRepository,
  ) { }

  @get('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Rol through UsuarioRol',
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
    return this.usuarioRepository.roles(id).find(filter);
  }

  @post('/usuario-rol', {
    responses: {
      '200': {
        description: 'create a instance of usuario with a rol',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioRol)}},
      },
    },
  })
  async createRelation(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioRol, {
            title: 'NewUsuarioWithRol',
            exclude: ['_id'],
          }),
        },
      },
    }) datos: Omit<UsuarioRol, '_id'>,
  ): Promise<UsuarioRol | null> {
    let registro = await this.usuarioRolRepository.create(datos);
    return registro;
  }

  @post('/asociar-usuarios-roles/{_id}', {
    responses: {
      '200': {
        description: 'create a instance of usuario with a rol',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioRol)}},
      },
    },
  })
  async createRelations(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ArregloRoles, {}),
        },
      },
    }) datos: ArregloRoles,
    @param.path.string('_id') id_usuario: typeof Usuario.prototype._id
  ): Promise<Boolean> {
    if (datos.roles.length > 0) {
      datos.roles.forEach(async (id_rol: string) => {
        let existe = await this.usuarioRolRepository.findOne({
          where: {
            id_usuario: id_usuario,
            id_rol: id_rol
          }
        });
        if (!existe) {
          this.usuarioRolRepository.create({
            id_usuario: id_usuario,
            id_rol: id_rol
          });
        }
      });
      return true
    }
    return false;
  }

  @patch('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'Usuario.Rol PATCH success count',
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
    return this.usuarioRepository.roles(id).patch(rol, where);
  }

  @del('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'Usuario.Rol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.usuarioRepository.roles(id).delete(where);
  }

  @del('/usuarios/{id_usuario}/{id_rol}')
  @response(204, {
    description: 'Relation DELETE success',
  })
  async EliminarRolDeUsuario(
    @param.path.string('id_usuario') id_usuario: string,
    @param.path.string('id_rol') id_rol: string): Promise<Boolean> {
    let registro = await this.usuarioRolRepository.findOne({
      where: {
        id_usuario: id_usuario,
        id_rol: id_rol
      }
    });
    if (registro) {
      await this.usuarioRolRepository.deleteById(registro._id);
      return true;
    }
    return false;
  }
}
