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


const getir=fetch('https://jsonplaceholder.typicode.com/photos').then(response => response.json())
    .then(data => veri.value = data);

// Fetch Reviews
// const { data: ReviewData, execute: fetchReviews } = await useApi<any>(createUrl('https://jsonplaceholder.typicode.com/photos', {
//   query: {
//     q: searchQuery,
//     page,
//     itemsPerPage,
//     sortBy,
//     orderBy,
//   },
// }))

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

const expanded=[]
</script>

<template>
  <!-- <VDataTableServer
    :headers="headers"
    :items="ReviewData"
    :items-per-page="5"
    expand-on-click
      serverItems: [],
      loading: true,
      totalItems: 0,
  >




  </VDataTableServer> -->


  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-key="url"
    @update:options="loadItems"
    :expanded.sync="expanded"
    show-expand
    single-expand
    expand-on-click
  >
   <!-- Expanded Row Data -->
   <!-- <template v-slot:expanded-item="{ headers, item }">
    <td :colspan="headers.length">
      MErhaba

  </td>
        </template> -->

        <template #expanded-row="slotProps">
      <tr class="v-data-table__tr">
        <td :colspan="headers.length">
          <NestedTable :id="slotProps.item.id"></NestedTable>
        </td>
      </tr>
    </template>


    <template #item.url="{ item }">
       <a :href="item.url">Ürün Bağlantısı</a>
        </template>

        <template #item.thumbnailUrl="{ item }">
      <img :src="item.thumbnailUrl"/>
        </template>
  </v-data-table-server>
</template>
