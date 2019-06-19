<template>
  <div class="dash-tile">
    <div class="dash-tile-header">
      Informacion de la cuenta
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
              <label for="username">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                id="username"
                :value="user.username"
                class="form-control"
                placeholder="Nombre de usuario"
              >
            </div>

            <div class="col-md-3">
              <label for="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                :value="user.email"
                class="form-control"
                placeholder="Email"
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

export default {
  props: ['url', 'user', 'csrf']
};
</script>