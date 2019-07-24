'use strict'
const Company = use('App/Models/Company')
const Hire = use('App/Models/Hire')
const { validateAll } = use('Validator')

class HireController {

  async store({ request, response, session }) {

    const hireData = request.only(['start_service', 'end_service', 'device_id'])

    const rules = {
      end_service: 'required',
      name: 'required_if:new_company|unique:companies,name',
      contact_name: 'required_if:new_company|unique:companies,contact_name',
      contact_email: 'required_if:new_company|unique:companies,contact_email',
      contact_phone: 'required_if:new_company|unique:companies,contact_phone',
      device_id: 'required',
      start_service: 'required'
    }

    const messages = {
      'name.required_if': 'El nombre de la empresa es obligatorio',
      'name.unique': 'El nombre de la empresa existe',
      'contact_name.required_if': 'El nombre de contacto es obligatorio',
      'contact_name.unique': 'El nombre de contacto ya existe',
      'contact_email.required_if': 'El email de contacto es obligatorio',
      'contact_email.unique': 'El email de contacto ya existe',
      'contact_phone.required_if': 'El telefono de contacto es obligatorio',
      'contact_phone.unique': 'El telefono de contacto ya existe',
      'internal_id.required': 'El ID es obligatorio',
      'start_service.required': 'El inicio de servicio es obligatorio',
      'end_service.required': 'El fin del servicio es obligatorio',
    }
    
    const validation = await validateAll(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
      session
        .flash({ errorHire: true })

      return response.route('devices.show', { id: hireData.device_id })
    }

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

  async update({ params, request, response, session }) {

    const hireData = request.only(['start_service', 'end_service', 'device_id'])

    const rules = {
      end_service: 'required',
      name: 'required_if:new_company|unique:companies,name',
      contact_name: 'required_if:new_company|unique:companies,contact_name',
      contact_email: 'required_if:new_company|unique:companies,contact_email',
      contact_phone: 'required_if:new_company|unique:companies,contact_phone',
      device_id: 'required',
      start_service: 'required'
    }

    const messages = {
      'name.required_if': 'El nombre de la empresa es obligatorio',
      'name.unique': 'El nombre de la empresa existe',
      'contact_name.required_if': 'El nombre de contacto es obligatorio',
      'contact_name.unique': 'El nombre de contacto ya existe',
      'contact_email.required_if': 'El email de contacto es obligatorio',
      'contact_email.unique': 'El email de contacto ya existe',
      'contact_phone.required_if': 'El telefono de contacto es obligatorio',
      'contact_phone.unique': 'El telefono de contacto ya existe',
      'internal_id.required': 'El ID es obligatorio',
      'start_service.required': 'El inicio de servicio es obligatorio',
      'end_service.required': 'El fin del servicio es obligatorio',
    }
    
    const validation = await validateAll(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
      session
        .flash({ errorHire: true })

      return response.route('hire.show', { id: hireData.device_id, hire_id: params.id })
    }

    const hire = await Hire.findOrFail(params.hire_id)

    if (request.input('company_id', false)) {
      hireData.company_id = request.input('company_id')
    } else {
      const companyData = request.only(['name', 'contact_name', 'contact_phone', 'contact_email'])
      const company = await Company.create(companyData)
      hireData.company_id = company.id
    }

    await hire.merge(hireData)

    await hire.save()

    response.route('hires.show', { id: hireData.device_id, hire_id: hire.id })
  }

  async delete ({ params, response }) {

    const hire = await Hire.findOrFail(params.id)

    hire.status = 0
    await hire.save()

    response.route('devices.show', { id: hire.device_id })
  }
}

module.exports = HireController
