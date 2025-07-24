<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataColor } from 'src/composables/CheckData';
import { useColorStore } from 'src/stores/color-store';

defineOptions({
  name: 'FormColor',
});

const props = defineProps<{
  data: {
    open: boolean;
    color: IColor | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingColor } = storeToRefs(useColorStore());

const dataColor = reactive({
  name: '' as string,
  hexColorCode: '' as string,
  active: true as boolean,
});

const clear = (): void => {
  Object.assign(dataColor, {
    name: '',
    hexColorCode: '',
    active: true,
  });
};
const save = async () => {
  const check = checkDataColor(dataColor);
  if (check.status) {
    const response = await useColorStore().createColor(
      dataColor.name,
      dataColor.hexColorCode.trim() === '' ? null : dataColor.hexColorCode,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da cor');
  }
};
const update = async () => {
  const check = checkDataColor(dataColor);
  if (check.status) {
    const response = await useColorStore().updateColor(
      colorID.value ?? 0,
      dataColor.name,
      dataColor.active === true ? 1 : 0,
      dataColor.hexColorCode.trim() === '' ? null : dataColor.hexColorCode,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da cor');
  }
};
const checkDataEdit = () => {
  if (props.data.color) {
    Object.assign(dataColor, {
      name: props.data.color.name,
      hexColorCode: props.data.color.hex_color_code,
      active: props.data.color.active === 1 ? true : false,
    });
  }
};

const colorID = computed(() => props.data.color?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => dataColor.name,
  () => {
    if (dataColor.name.trim().length > 0) {
      dataColor.name = dataColor.name.toUpperCase();
    }
  },
);

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 column justify-between" style="width: 350px; min-height: 350px">
      <q-card-section class="q-pa-none">
        <TitlePage :title="colorID ? 'Atualização de cor' : 'Cadastro de cor'" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingColor" />
      <q-card-section class="q-pa-sm" v-show="!loadingColor">
        <q-form class="q-gutter-y-sm column">
          <q-input
            v-model="dataColor.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da cor"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="colorize" color="black" size="20px" />
            </template>
          </q-input>

          <q-input
            v-model="dataColor.hexColorCode"
            bg-color="white"
            label-color="black"
            outlined
            label="Código da cor"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="tag" color="black" size="20px" />
            </template>
          </q-input>
          <q-color
            v-model="dataColor.hexColorCode"
            no-header-tabs
            no-header
            no-tabs
            style="width: 300px"
            flat
            bordered
          />
          <q-toggle
            v-show="colorID"
            v-model="dataColor.active"
            checked-icon="check"
            color="green"
            :label="dataColor.active ? 'Cor ativa' : 'Cor inativa'"
            unchecked-icon="clear"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingColor">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            v-if="!colorID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingColor"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingColor"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
