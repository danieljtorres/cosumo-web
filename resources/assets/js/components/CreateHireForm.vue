<template>
  <div class="dash-tile">
    <div class="dash-tile-header">
      Alquilar
    </div>
    <div class="dash-tile-content">
      <form
        :action="url"
        method="POST"
        class="form-horizontal form-box remove-margin"
      >
        <input type="hidden" name="_csrf" :value="csrf">
        <input type="hidden" name="device_id" v-model="deviceId">
        <input v-if="startService" type="hidden" name="start_service" v-model="startService">
        <input v-if="endService" type="hidden" name="end_service" v-model="endService">

        <div class="form-box-content">
          <div class="row">
            <div class="col-md-12">
              <h6>Empresa</h6>
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-4">
              <select id="company_id" name="company_id" class="form-control" :disabled="newCompany">
                <option v-for="company in companies" :key="company.id" :value="company.id">{{company.name}}</option>
              </select>
            </div>
            <div class="col-md-4">
              <div class="checkbox">
                <label for="new-company">
                  <input type="checkbox" id="new-company" name="new_company" v-model="newCompany"> Es una compañia nueva
                </label>
              </div>
            </div>
          </div>
          <div v-if="newCompany" class="form-group">
            <div class="col-md-3">
              <label for="name">Nombre</label>
              <input
                type="text"
                name="name"
                id="name"
                class="form-control"
                placeholder="Nombre"
              >
            </div>
            <div class="col-md-3">
              <label for="contact_name">Nombre de contacto</label>
              <input
                type="text"
                name="contact_name"
                id="contact_name"
                class="form-control"
                placeholder="Nombre de contacto"
              >
            </div>
            <div class="col-md-3">
              <label for="contact_email">Email de contacto</label>
              <input
                type="text"
                name="contact_email"
                id="contact_email"
                class="form-control"
                placeholder="Nombre"
              >
            </div>
            <div class="col-md-3">
              <label for="contact_phone">Telefono de contacto</label>
              <input
                type="text"
                name="contact_phone"
                id="contact_phone"
                class="form-control"
                placeholder="Nombre"
              >
            </div>
          </div>
        </div>
        <div class="form-box-content">
          <div class="row">
            <div class="col-md-12">
              <h6>Duracion del servicio</h6>
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-4">
              <VueHotelDatepicker 
                :placeholder="'Seleccione un rango de fechas'" 
                :separator="' - '"
                :from-text="'Desde'"
                :to-text="'Hasta'"
                :min-date="'2000/01/01'"
                :confirm-text="'Aceptar'"
                @update="getDateRange"/> 
            </div>
            <div class="col-md-4" style="padding-top: 9px">
              <strong>{{ diffDates }}</strong> dias de servicio
            </div>
          </div>
        </div>
        <div class="form-box-content">
          <div class="form-group">
            <div class="col-md-12">
              <button class="btn btn-sm btn-success" type="submit">Iniciar Servicio</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
 
<script>

import * as moment from 'moment'
import VueHotelDatepicker from './VueHotelDatepicker.vue'

export default {
  props: ['url', 'companies', 'deviceId', 'csrf'],
  data: () => ({
    newCompany: false,
    diffDates: 0,
    startService: 0,
    endService: 0
  }),
  methods: {
    getDateRange(e) {
      if(e.start && e.end) {
        const start = moment(e.start) 
        const end = moment(e.end)

        let diff = end.diff(start, 'days')
        this.diffDates = diff
        this.startService = start.valueOf()
        this.endService = end.valueOf()
      } else {
        this.startService = this.endService = this.diffDates = 0
      }
    }
  },
  components: { VueHotelDatepicker }
};
</script>