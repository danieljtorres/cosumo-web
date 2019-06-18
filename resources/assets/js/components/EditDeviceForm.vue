<template>
  <div class="dash-tile">
    <div class="dash-tile-header">
      Informacion del dispositivo
    </div>
    <div class="dash-tile-content">
      <form
        :action="url"
        method="POST"
        class="form-horizontal form-box remove-margin"
      >
        <input type="hidden" name="_csrf" :value="csrf">
        
        <div class="form-box-content">
          <div class="form-group">
            <div class="col-md-3">
              <label for="internal_id">ID</label>
              <input
                type="text"
                name="internal_id"
                id="internal_id"
                :value="device.internal_id"
                class="form-control"
                placeholder="ID del dispositivo"
              >
            </div>

            <div class="col-md-3">
              <label for="actual_password">Contraseña actual</label>
              <input
                type="text"
                name="actual_password"
                id="actual_password"
                class="form-control"
                placeholder="Contraseña actual"
              >
            </div>

            <div class="col-md-3">
              <label for="password">Nueva Contraseña</label>
              <input
                type="text"
                name="password"
                id="password"
                class="form-control"
                placeholder="Nueva Contraseña"
              >
            </div>

            <div class="col-md-3">
              <label for="password_confirmation">Repetir la contraseña</label>
              <input
                type="text"
                name="password_confirmation"
                id="password_confirmation"
                class="form-control"
                placeholder="Confirme la contraseña"
              >
            </div>
          </div>
        </div>
        <div class="form-box-content">
          <div class="form-group">
            <div class="col-md-12">
              <button class="btn btn-sm btn-success" type="submit">Editar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
 
<script>

import * as moment from 'moment'
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'

export default {
  props: ['url', 'device', 'csrf']
};
</script>