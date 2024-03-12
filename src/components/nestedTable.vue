<script setup lang="ts">
import { VDataTableServer } from 'vuetify/lib/components/VDataTable/VDataTableServer.mjs'
import { ref,computed,onMounted } from 'vue';
 import NestedTable from './nestedTable.vue'
// Headers
const headers = [
  { title: '', key: 'data-table-expand' },
  { title: 'name', key: 'id' },
  { title: 'title', key: 'title' },
  { title: 'url', key: 'url' },
  { title: 'thumbnailUrl', key: 'thumbnailUrl' },

]

var veri=ref([])



const itemsPerPage=ref(5)
const search= ''
const      serverItems=ref([])
const    loading=ref(false)
const   totalItems= ref(0)

  const FakeAPI = {
    async fetch ({ page, itemsPerPage, sortBy }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage
          const end = start + itemsPerPage
          const items = veri.value.slice()

          if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            items.sort((a, b) => {
              const aValue = a[sortKey]
              const bValue = b[sortKey]
              return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
            })
          }

          const paginated = items.slice(start, end)

          resolve({ items: paginated, total: items.length })
        }, 500)
      })
    },
  }

const loadItems=({ page, itemsPerPage, sortBy })=>{
       loading.value = true
        FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
           serverItems.value = items
          totalItems.value = total
          loading.value = false
        })

}


</script>

<template>


  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-key="url"
    @update:options="loadItems"

  >



    <template #item.url="{ item }">
       <a :href="item.url">Ürün Bağlantısı</a>
        </template>

        <template #item.thumbnailUrl="{ item }">
      <img :src="item.thumbnailUrl"/>
        </template>
  </v-data-table-server>
</template>
