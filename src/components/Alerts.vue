<template>
  <div class="notifications-box">
    <div
      v-for="(item, index) in $store.state.alerts"
      :key="index"
      :class="'notification is-' + item.type"
    >
      <button
        class="delete"
        @click="() => $store.commit('removeFromState', { key: 'alerts', index})"
      ></button>
      <p>{{ item.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alerts"
};
</script>
