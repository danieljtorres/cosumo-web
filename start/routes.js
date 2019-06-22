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
    
}).prefix('api/v1')


Route.get('login', 'AuthController.index').as('auth.index')
Route.post('login', 'AuthController.login').as('auth.login')
Route.get('logout', 'AuthController.logout').as('auth.logout')


Route.group(() => {

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
    Route.get('cuentas/crear', 'UserController.create').as('users.create')
    Route.post('cuentas', 'UserController.store').as('users.store')
    Route.get('cuentas/:id', 'UserController.show').as('users.show')
    Route.put('cuentas/:id', 'UserController.update').as('users.update')
    Route.delete('cuentas/:id', 'UserController.delete').as('users.delete')

}).middleware('authAdmin')