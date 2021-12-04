import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Credenciales, Rol, Usuario, UsuarioRol} from '../models';
import {UsuarioRepository, UsuarioRolRepository} from '../repositories';
import {Configuracion} from '../llaves/configuracion';
import {identity} from 'lodash';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @repository(UsuarioRolRepository)
    private usuarioRolRepository: UsuarioRolRepository
  ) { }

  /*
   * Add service methods here
   */

  async IdentificarUsuario(credenciales: Credenciales) {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        clave: credenciales.clave
      }
    });
    console.log(usuario?.nombre);
    return usuario
  }

  // async GenerarToken(datos: Usuario): Promise<string> {
  //   let url = `${Configuracion.urlCrearToken}?${Configuracion.nombreArg}=${datos.nombre}&${Configuracion.idArg}=${datos._id}&${Configuracion.id_rolArg}=${Configuracion.rolUser}`;
  //   let token = "";
  //   await fetch(url)
  //     .then(async (res: any) => {
  //       token = await res.text()
  //     })
  //   return token;
  // }

  async GenerarToken(usuario: Usuario): Promise<string> {
    let token = "";
    if (await this.ObtenerAdmin(usuario)) {
      let id_rol = "617b66eb0d8cef28503f2787"
      let url = `${Configuracion.urlCrearToken}?${Configuracion.nombreArg}=${usuario.nombre}&${Configuracion.idArg}=${usuario._id}&${Configuracion.id_rolArg}=${id_rol}`;
      let token = "";
      await fetch(url)
        .then(async (res: any) => {
          token = await res.text()
        })
      return token
    }
    return token
  }

  async ObtenerAdmin(usuario: Usuario): Promise<Boolean> {
    let roles = ""
    await fetch(`http://localhost:3001/usuarios/${usuario._id}/rols`)
      .then(async (res: any) => {
        roles = await res.text()
      })
    let id_admin = "617b66eb0d8cef28503f2787"
    let posicion = roles.indexOf(id_admin);
    if (posicion !== -1)
      return true;
    else
      return false;
  }

  async ValidarToken(tk: string): Promise<boolean> {
    let url = `${Configuracion.urlVerificarToken}?${Configuracion.arg_token}=${tk}`;
    let resp = "";
    await fetch(url)
      .then(async (res: any) => {
        resp = await res.text()
      })
    return resp == "OK";
  }
}
