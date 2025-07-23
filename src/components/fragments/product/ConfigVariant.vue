<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed } from 'vue';
import { useColorStore } from 'src/stores/color-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'ConfigVariant',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const listVariants = defineModel<IVModelProductVariant[]>('listVariants', { required: true });

const { listColor } = storeToRefs(useColorStore());

const getColorStyle = (hexColor: string) => {
  return {
    backgroundColor: hexColor,
    width: '30px',
    height: '20px',
    padding: '4px',
    border: '1px solid grey',
    borderRadius: '5px',
  };
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="width: 800px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Configuração de variantes" icon="arrow_split" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-scroll-area style="height: 500px" class="full-width row justify-center items-center">
          <q-list bordered separator>
            <q-item v-for="(item, index) in listVariants" :key="index">
              <q-form class="q-gutter-y-sm column full-width">
                <q-banner dense class="text-white bg-grey-9 q-px-md" rounded>
                  <div class="row justify-between items-center">
                    <span
                      >Tamanho: <span class="text-bold">{{ item.gridItem.size }}</span></span
                    >
                    <q-toggle
                      v-model="item.active"
                      checked-icon="check"
                      color="green"
                      :label="item.active ? 'Variante ativa' : 'Variante inativa'"
                      unchecked-icon="clear"
                      :true-value="1"
                      :false-value="0"
                    />
                  </div>
                </q-banner>
                <div class="row justify-between items-center">
                  <q-input
                    v-model="item.cost"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="R$ Valor de custo"
                    dense
                    input-class="text-black no-spinners"
                    type="text"
                    mask="#.##"
                    fill-mask="0"
                    reverse-fill-mask
                    class="input-divider"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="item.price"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="R$ Valor de venda"
                    dense
                    input-class="text-black no-spinners"
                    type="text"
                    mask="#.##"
                    fill-mask="0"
                    reverse-fill-mask
                    class="input-divider"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" color="black" size="20px" />
                    </template>
                  </q-input>
                </div>
                <div class="row justify-between items-center">
                  <q-input
                    v-model="item.stockQuantity"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Estoque inicial"
                    dense
                    input-class="text-black no-spinners"
                    mask="###############"
                    class="input-divider"
                  >
                    <template v-slot:prepend>
                      <q-icon name="pin" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="item.minStockAlert"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Alerta minímo"
                    dense
                    input-class="text-black no-spinners"
                    mask="###############"
                    class="input-divider"
                  >
                    <template v-slot:prepend>
                      <q-icon name="pin" color="black" size="20px" />
                    </template>
                  </q-input>
                </div>
                <div class="row justify-between items-center">
                  <q-input
                    v-model="item.offer"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="R$ Valor de oferta"
                    dense
                    input-class="text-black no-spinners"
                    type="text"
                    mask="#.##"
                    fill-mask="0"
                    reverse-fill-mask
                    class="input-divider"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                   v-model="item.location"
                   bg-color="white"
                   label-color="black"
                   outlined
                   label="Localização"
                   dense
                   input-class="text-black"
                   class="input-divider"
                 >
                   <template v-slot:prepend>
                     <q-icon name="location_on" color="black" size="20px" />
                   </template>
                 </q-input>
                </div>
                <q-input
                  v-model="item.sku"
                  bg-color="white"
                  label-color="black"
                  outlined
                  label="SKU"
                  dense
                  input-class="text-black no-resize"
                >
                  <template v-slot:prepend>
                    <q-icon name="dialpad" color="black" size="20px" />
                  </template>
                </q-input>
                <q-select
                  v-model="item.colors"
                  outlined
                  bg-color="white"
                  label-color="black"
                  multiple
                  :options="listColor"
                  option-label="name"
                  option-value="id"
                  label="Cores"
                  dense
                  options-selected-class="bg-green-1 text-black"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="row items-center q-gutter-x-sm">
                          <div
                            class="cursor-pointer"
                            :style="getColorStyle(scope.opt.hex_color_code)"
                          ></div>
                          <div>{{ scope.opt.name }}</div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input
                  v-model="item.description"
                  bg-color="white"
                  label-color="black"
                  outlined
                  label="Descrição"
                  dense
                  input-class="text-black no-resize"
                  type="textarea"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="black" size="20px" />
                  </template>
                </q-input>
                <!-- <div class="row justify-between">
              <q-select
                v-model="model.type"
                :options="optionsType"
                label="Selecione o tipo"
                outlined
                dense
                options-dense
                bg-color="white"
                label-color="black"
                class="input-divider"
              >
                <template v-slot:prepend>
                  <q-icon name="info" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="model.category"
                :options="optionsCategory"
                label="Selecione a categoria"
                outlined
                dense
                options-dense
                bg-color="white"
                label-color="black"
                class="input-divider"
              >
                <template v-slot:prepend>
                  <q-icon name="info" color="black" size="20px" />
                </template>
              </q-select>
            </div> -->
              </q-form>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="open = false" color="red" label="Fechar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
