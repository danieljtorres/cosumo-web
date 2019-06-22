'use strict'
const Device = use('App/Models/Device')
const Company = use('App/Models/Company')
const Hire = use('App/Models/Hire')
const { validateAll } = use('Validator')
const moment = require('moment')

class DeviceController {
  async index({ view }) {

    const devices = await Device.query()
      .orderBy('id', 'desc')
      .with('hires', (builder) => {
        builder.where('status', 1).with('company')
      })
      .fetch()

    return view.render('devices.index', { devices: devices.toJSON() })
  }

  async create({ view }) {

    const companies = await Company.all()
    return view.render('devices.create', { companies: JSON.stringify(companies.toJSON()) })
  }

  async store({ request, response, session }) {
    console.log(request.all())
    const deviceData = request.only(['internal_id', 'password'])

    const rules = {
      internal_id: 'required|unique:devices,internal_id',
      password: 'required|confirmed',
      name: 'required_if:new_company|unique:companies,name',
      contact_name: 'required_if:new_company|unique:companies,contact_name',
      contact_email: 'required_if:new_company|unique:companies,contact_email',
      contact_phone: 'required_if:new_company|unique:companies,contact_phone',
      start_service: 'required_if:hire',
      end_service: 'required_if:hire'
    }

    const messages = {
      'internal_id.required': 'El ID es obligatorio',
      'internal_id.unique': 'El ID ya existe',
      'password.required': 'La contraseña es obligatoria',
      'password.confirmed': 'La contraseñas no coinciden',
      'name.required_if': 'El nombre de la empresa es obligatorio',
      'name.unique': 'El nombre de la empresa existe',
      'contact_name.required_if': 'El nombre de contacto es obligatorio',
      'contact_name.unique': 'El nombre de contacto ya existe',
      'contact_email.required_if': 'El email de contacto es obligatorio',
      'contact_email.unique': 'El email de contacto ya existe',
      'contact_phone.required_if': 'El telefono de contacto es obligatorio',
      'contact_phone.unique': 'El telefono de contacto ya existe',
      'start_service.required_if': 'El inicio de servicio es obligatorio',
      'end_service.required_if': 'El fin del servicio es obligatorio',
    }

    const validation = await validateAll(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())

      return response.route('devices.create')
    }

    const device = await Device.create(deviceData)

    if (request.input('hire', false)) {
      const hireData = request.only(['start_service', 'end_service'])
      hireData.device_id = device.id
      
      if (request.input('company_id', false)) {
        hireData.company_id = request.input('company_id')
      } else {
        const companyData = request.only(['name', 'contact_name', 'contact_phone', 'contact_email'])
        const company = await Company.create(companyData)
        hireData.company_id = company.id
      }

      await Hire.create(hireData)
    }

    response.route('devices.index')
  }

  async show({ params, view }) {

    const device = await Device.query()
      .with('hires', (builder) => {
        builder.orderBy('id', 'desc').with('company')
      })
      .withCount('hires as active_hire', (builder) => {
        builder.where('status', 1)
      })
      .where('id', params.id)
      .firstOrFail()

    const companies = await Company.all()

    return view.render('devices.show', { device: device.toJSON(), companies: JSON.stringify(companies.toJSON()) , parseDevice: JSON.stringify(device.toJSON())})
  }

  async update({ params, request, response, session }) {

    const device = await Device.findOrFail(params.id)

    const rules = {
      internal_id: 'required|unique:devices,internal_id,id,' + device.id,
      actual_password: 'required_if:password|verify_hash:' + device.password,
      password: 'confirmed'
    }

    const messages = {
      'internal_id.required': 'El ID es obligatorio',
      'internal_id.unique': 'El ID ya existe',
      'actual_password.required_if': 'La contraseña actual es requerida para actualizarla', 
      'actual_password.verify_hash': 'La contraseña actual es incorrecta',
      'password.confirmed': 'La contraseña nueva no coincide con la confirmacion',
    }

    const validation = await validateAll(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
      session
        .flash({ errorDevice: true })

      return response.route('devices.show', { id: device.id })
    }

    const deviceData = request.all()

    device.internal_id = deviceData.internal_id

    if (deviceData.password) {
      device.password = deviceData.password
    }

    await device.save()
    response.route('devices.show', { id: device.id })
  }

  async delete({ params, response }) {
    const device = await Device.find(params.id)
    await device.hires().delete()
    await device.delete()
    return response.route('devices.index')
  }


  //API
  async login ({ auth, request, response }) {
    const deviceData = request.only(['internal_id', 'password'])
    const token = await auth.authenticator('jwt').attempt(deviceData.internal_id, deviceData.password)

    return response.json(token)
  }

  async logout ({ auth, request, response }) {
    let device

    try {
      device = await auth.authenticator('jwt').getUser()
    } catch (error) {
      console.log(error)
      return response.status(error.status).json({ error: error.message })
    }

    const rules = {
      password: 'required|verify_hash:' + device.password
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(401).json({
        validation: validation.messages(),
        valid: false
      })
    }

    return response.json({
      logout: true
    })
  }

  async serviceData ({ auth, response }) {
    moment.locale('es');

    let device

    try {
      device = await auth.authenticator('jwt').getUser()
    } catch (error) {
      console.log(error)
      return response.status(error.status).json({ error: error.message })
    }

    
    const hire = await device.hires().with('company').where('status', 1).first()

    let percentage
    const nowMoment = moment()
    const initDiff = hire.end_service - hire.start_service
    const currentDiff = nowMoment.valueOf() - hire.start_service
    let startDate = moment(hire.start_service).format('LL')
    let endDate = moment(hire.end_service).format('LL')

    if (hire) {
      percentage = (currentDiff / initDiff) * 100
    }

    hire.percentage = percentage
    hire.start_pretty_date = startDate
    hire.end_pretty_date = endDate

    device.hire = hire

    return response.json(device)
  }
}

module.exports = DeviceController