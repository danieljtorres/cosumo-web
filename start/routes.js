'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.post('request-restore-password', 'AuthController.sendMailRestorePassword')
    Route.post('restore-password', 'AuthController.restorePassword')
    Route.post('refresh-token', 'AuthController.refreshToken')
    Route.get('report', 'ReportController.get')

    Route.post('device/login', 'DeviceController.login')
    Route.post('device/logout', 'DeviceController.logout')
    Route.get('device/', 'DeviceController.serviceData')

    Route.post('validacionesdispositivos/guardar', 'DeviceController.validateInStore').as('devices.validateInStore')
    Route.post('validaciones/dispositivos/editar', 'DeviceController.validateInUpdate').as('devices.validateInUpdate')
    

    Route.post('validaciones/alquileres/guardar', 'HireController.validateInStore').as('hires.validateInStore')
}).prefix('api/v1')


Route.get('', 'ResumeController.index').as('index')


Route.get('dispositivos', 'DeviceController.index').as('devices.index')
Route.get('dispositivos/crear', 'DeviceController.create').as('devices.create')
Route.post('dispositivos', 'DeviceController.store').as('devices.store')
Route.get('dispositivos/:id', 'DeviceController.show').as('devices.show')
Route.put('dispositivos/:id', 'DeviceController.update').as('devices.update')
Route.delete('dispositivos/:id', 'DeviceController.delete').as('devices.delete')


Route.post('alquileres', 'HireController.store').as('hires.store')
Route.delete('alquileres/:id', 'HireController.delete').as('hires.delete')


Route.get('cuentas', 'UserController.index').as('users.index')