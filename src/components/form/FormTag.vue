<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataTag } from 'src/composables/CheckData';
import { useTagStore } from 'src/stores/tag-store';

defineOptions({
  name: 'FormTag',
});

const props = defineProps<{
  data: {
    open: boolean;
    tag: ITag | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingTag } = storeToRefs(useTagStore());

const dataTag = reactive({
  name: '' as string,
  active: true as boolean,
});

const clear = (): void => {
  Object.assign(dataTag, {
    name: '',
    active: true,
  });
};
const save = async () => {
  const check = checkDataTag(dataTag);
  if (check.status) {
    const response = await useTagStore().createTag(dataTag.name);
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da tag');
  }
};
const update = async () => {
  const check = checkDataTag(dataTag);
  if (check.status) {
    const response = await useTagStore().updateTag(
      tagID.value ?? 0,
      dataTag.name,
      dataTag.active === true ? 1 : 0,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da tag');
  }
};
const checkDataEdit = () => {
  if (props.data.tag) {
    Object.assign(dataTag, {
      name: props.data.tag.name,
      active: props.data.tag.active === 1 ? true : false,
    });
  }
};
const transformUppercaseName = (): void => {
  if (dataTag.name.trim().length > 0) {
    dataTag.name = dataTag.name.toUpperCase();
  }
};

const tagID = computed(() => props.data.tag?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => dataTag.name,
  () => {
    transformUppercaseName();
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
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 350px"
      :style="loadingTag ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage :title="tagID ? 'Atualização de tag' : 'Cadastro de tag'" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingTag" />
      <q-card-section class="q-pa-sm" v-show="!loadingTag">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataTag.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome da tag"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="colorize" color="black" size="20px" />
            </template>
          </q-input>
          <q-toggle
            v-model="dataTag.active"
            checked-icon="check"
            color="green"
            :label="dataTag.active ? 'Tag ativa' : 'Tag inativa'"
            unchecked-icon="clear"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingTag">
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
            v-if="!tagID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingTag"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingTag"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
