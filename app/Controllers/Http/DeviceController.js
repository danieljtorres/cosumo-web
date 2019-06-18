'use strict'
const Device = use('App/Models/Device')
const Company = use('App/Models/Company')
const Hire = use('App/Models/Hire')
const { validate } = use('Validator')

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

  async store({ request, response }) {

    const deviceData = request.only(['internal_id', 'password'])
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

  async update({ params, request, response }) {

    const device = await Device.findOrFail(params.id)
    const deviceData = request.all()

    device.internal_id = deviceData.internal_id

    if (deviceData.password) {
      device.password = deviceData.password
    }

    await device.save()
    response.route('devices.show', { id: device.id })
  }

  async delete({ params }) {


  }


  async validateInStore ({ request, response }) {

    const rules = {
      internal_id: 'required|unique:devices,internal_id',
      password: 'required|confirmed',
      name: 'required_if:company_id|unique:companies,name',
      contact_name: 'required_if:company_id|unique:companies,contact_name',
      contact_email: 'required_if:company_id|unique:companies,contact_email',
      contact_phone: 'required_if:company_id|unique:companies,contact_phone',
      start_service: 'required_if:hire',
      end_service: 'required_if:hire'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return {
        validation: validation.messages(),
        valid: false
      }
    }

    return {
      valid: true
    }
  }

  async validateInUpdate ({ request, response }) {

    const device = await Device.find(request.input('id'))

    const rules = {
      internal_id: 'required|unique:devices,internal_id,id,' + device.id,
      actual_password: 'required_if:password|verify_hash:' + device.password,
      password: 'confirmed'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return {
        validation: validation.messages(),
        valid: false
      }
    }

    return {
      valid: true
    }
  }
}

module.exports = DeviceController