<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import TitlePage from '../shared/TitlePage.vue';
import { useMovementStore } from 'src/stores/movement-store';
import { checkExportData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { storeToRefs } from 'pinia';
import { useExportStore } from 'src/stores/export-store';
import Loading from '../shared/Loading.vue';

defineOptions({
    name:'Export'
})

const props = defineProps<{
    open: boolean;
   filters: IFilterMovement;
}>()
const emit = defineEmits<{
    'update:open': [void];
}>()

const { loadingExportExcel, loadingExportPDF } = storeToRefs(useExportStore())

const exportData = reactive({
    data:[] as IMovement[],
})



const exporting = async (type: 'pdf' | 'excel') => {
    const check = checkExportData(exportData)
    if(check.status){
       if(type === 'excel'){
           await useExportStore().exportMovementsExcel(
            formattedPeriod.value,
            onlyOut.value,      
            onlyEntry.value,    
            props.filters.category
         )
       }
    } else {
        createErrorData(check.message || 'Erro ao exportar dados')
    }
}
const clear = () => {
    exportData.data = [];
}

const open = computed({
    get: () => props.open,
    set: () => emit('update:open')
})
const onlyOut = computed(() => props.filters.type === 'out' ? true : false)
const onlyEntry = computed(() => props.filters.type === 'entry' ? true : false)
const formattedPeriod = computed(() => {
  if (!props.filters.period) return '';
  
  const [month, year] = props.filters.period.split('/');
  return `${month.padStart(2,'0')}-${year}`;
});


watch(open,async () => {
  if (open.value === true) {
    const filter: IFilterMovement = {
        period: props.filters.period,
        category: props.filters.category,
        type: props.filters.type
    }
   await useMovementStore().getMovements(filter)
   exportData.data = useMovementStore().listMovement
  } else {
    clear();
  }
});
</script>
<template>
    <q-dialog v-model="open">
        <q-card class="bg-grey-2 sub-page column justify-between">
            <q-card-section class="q-pa-none">
               <TitlePage title="Exportação de dados" icon="file_copy"/>
            </q-card-section>
            <q-card-section>
             <div v-show="!loadingExportExcel || !loadingExportPDF">
                <h6 class="text-red">  Você deseja exportar as movimentações de {{ props.filters.period }}?</h6>
             </div>
             <Loading :show="loadingExportExcel || loadingExportPDF"/>
            </q-card-section>
            <q-card-actions align="right">
                <div class="row justify-end items-center q-gutter-x-sm">
                    <q-btn
                        color="red"
                        label="Fechar"
                        size="md"
                        @click="open = false"
                        unelevated
                        no-caps
                        flat
                    />
                    <q-btn
                        color="green-7"
                        label="Exportar para Excel"
                        @click="exporting('excel')"
                        :loading="loadingExportExcel"
                        size="md"
                        unelevated
                        no-caps
                    />
                    <q-btn
                        color="red-8"
                        label="Exportar em PDF"
                         @click="exporting('pdf')"
                         :loading="loadingExportPDF"
                        size="md"
                        unelevated
                        no-caps
                    />
                </div>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>