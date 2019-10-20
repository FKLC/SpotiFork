<template>
  <div class="table-container">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th v-for="(field, index) in fields" :key="index">{{ field }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, itemIndex) in items" :key="itemIndex">
          <th v-for="(field, index) in fields" :key="index">
            <slot :name="index" :item="item" :itemIndex="itemIndex">{{ item[index] }}</slot>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: ["fields", "items"]
};
</script>
