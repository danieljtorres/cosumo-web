'use strict'
const Company = use('App/Models/Company')
const Hire = use('App/Models/Hire')

class HireController {

  async store({ request, response }) {

    const hireData = request.only(['start_service', 'end_service', 'device_id'])

    if (request.input('company_id', false)) {
      hireData.company_id = request.input('company_id')
    } else {
      const companyData = request.only(['name', 'contact_name', 'contact_phone', 'contact_email'])
      const company = await Company.create(companyData)
      hireData.company_id = company.id
    }

    await Hire.create(hireData)

    response.route('devices.show', { id: hireData.device_id })
  }

  async delete ({ params, response }) {

    const hire = await Hire.findOrFail(params.id)

    hire.status = 0
    await hire.save()

    response.route('devices.show', { id: hire.device_id })
  }
}

module.exports = HireController
