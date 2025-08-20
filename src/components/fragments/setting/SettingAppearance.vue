<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, watch } from 'vue';
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';
import { checkDataAppearance } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import Loading from 'src/components/shared/Loading.vue';

defineOptions({
  name: 'SettingAppearance',
});

const props = defineProps<{
  tab: ISettingModalTabs;
}>();

const { loadingSetting, appearanceSetting } = storeToRefs(useSettingsStore());

const dataAppearance = reactive({
  titlePageColorDefault: 1 as number,
  navbarColorDefault: 1 as number,
  navbarIconColorDefault: 1 as number,
  sideMenuColorDefaultNotSelectedItem: 1 as number,
  sideMenuColorDefaultSelectedItem: 1 as number,
  sideMenuColorDefaultNotSelectedIcon: 1 as number,
  sideMenuColorDefaultSelectedIcon: 1 as number,
  titlePageColorCode: '' as string,
  navbarColorCode: '' as string,
  navbarIconColorCode: '' as string,
  sideMenuColorCodeNotSelectedItem: '' as string,
  sideMenuColorCodeSelectedItem: '' as string,
  sideMenuColorCodeNotSelectedIcon: '' as string,
  sideMenuColorCodeSelectedIcon: '' as string,
});

const update = async () => {
  const check = checkDataAppearance(dataAppearance);
  if (check.status) {
    await useSettingsStore().updateAppearanceSetting({
      titlePageColorDefault: dataAppearance.titlePageColorDefault,
      navbarColorDefault: dataAppearance.navbarColorDefault,
      navbarIconColorDefault: dataAppearance.navbarIconColorDefault,
      sideMenuColorDefaultNotSelectedItem: dataAppearance.sideMenuColorDefaultNotSelectedItem,
      sideMenuColorDefaultSelectedItem: dataAppearance.sideMenuColorDefaultSelectedItem,
      sideMenuColorDefaultNotSelectedIcon: dataAppearance.sideMenuColorDefaultNotSelectedIcon,
      sideMenuColorDefaultSelectedIcon: dataAppearance.sideMenuColorDefaultSelectedIcon,
      titlePageColorCode:
        dataAppearance.titlePageColorCode.trim().length > 0
          ? dataAppearance.titlePageColorCode
          : null,
      navbarColorCode:
        dataAppearance.navbarColorCode.trim().length > 0 ? dataAppearance.navbarColorCode : null,
      navbarIconColorCode:
        dataAppearance.navbarIconColorCode.trim().length > 0
          ? dataAppearance.navbarIconColorCode
          : null,
      sideMenuColorCodeNotSelectedItem:
        dataAppearance.sideMenuColorCodeNotSelectedItem.trim().length > 0
          ? dataAppearance.sideMenuColorCodeNotSelectedItem
          : null,
      sideMenuColorCodeSelectedItem:
        dataAppearance.sideMenuColorCodeSelectedItem.trim().length > 0
          ? dataAppearance.sideMenuColorCodeSelectedItem
          : null,
      sideMenuColorCodeNotSelectedIcon:
        dataAppearance.sideMenuColorCodeNotSelectedIcon.trim().length > 0
          ? dataAppearance.sideMenuColorCodeNotSelectedIcon
          : null,
      sideMenuColorCodeSelectedIcon:
        dataAppearance.sideMenuColorCodeSelectedIcon.trim().length > 0
          ? dataAppearance.sideMenuColorCodeSelectedIcon
          : null,
    });
  } else {
    createErrorData(check.message || 'Erro ao validar os dados');
  }
};

const mountData = () => {
  Object.assign(dataAppearance, {
    titlePageColorDefault: appearanceSetting.value.title_page_color_default,
    navbarColorDefault: appearanceSetting.value.navbar_color_default,
    navbarIconColorDefault: appearanceSetting.value.navbar_icon_color_default,
    sideMenuColorDefaultNotSelectedItem:
      appearanceSetting.value.side_menu_color_default_not_selected_item,
    sideMenuColorDefaultSelectedItem: appearanceSetting.value.side_menu_color_default_selected_item,
    sideMenuColorDefaultNotSelectedIcon:
      appearanceSetting.value.side_menu_color_default_not_selected_icon,
    sideMenuColorDefaultSelectedIcon: appearanceSetting.value.side_menu_color_default_selected_icon,
    titlePageColorCode: appearanceSetting.value.title_page_color_code ?? '',
    navbarColorCode: appearanceSetting.value.navbar_color_code ?? '',
    navbarIconColorCode: appearanceSetting.value.navbar_icon_color_code ?? '',
    sideMenuColorCodeNotSelectedItem:
      appearanceSetting.value.side_menu_color_code_not_selected_item ?? '',
    sideMenuColorCodeSelectedItem: appearanceSetting.value.side_menu_color_code_selected_item ?? '',
    sideMenuColorCodeNotSelectedIcon:
      appearanceSetting.value.side_menu_color_code_not_selected_icon ?? '',
    sideMenuColorCodeSelectedIcon: appearanceSetting.value.side_menu_color_code_selected_icon ?? '',
  });
};

watch(
  () => props.tab,
  async (tab) => {
    if (tab === 'appearance') {
      await useSettingsStore().getAppearanceSetting();
      mountData();
    }
  },
  { immediate: true },
);
</script>
<template>
  <q-card class="bg-grey-1 column justify-between" bordered flat style="min-height: 400px">
    <q-card-section>
      <TitlePage title="Configurações de aparência" icon="design_services" />
    </q-card-section>
    <Loading :show="loadingSetting" />
    <q-card-section v-show="!loadingSetting">
      <q-form class="q-gutter-y-md column">
        <!-- Título -->
        <div class="q-my-md">
          <q-toggle
            v-model="dataAppearance.titlePageColorDefault"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
          >
            <div class="column">
              <span class="text-bold text-body2"> Título </span>
              <span>Utilizar a cor padrão para título das páginas</span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.titlePageColorCode"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.titlePageColorCode" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-separator />
        <!-- Navbar -->
        <div >
          <q-toggle
            v-model="dataAppearance.navbarColorDefault"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
          >
            <div class="column">
              <span class="text-bold text-body2"> Navbar </span>
              <span>Utilizar a cor padrão para fundo da navbar</span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.navbarColorCode"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.navbarColorCode" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-my-md">
          <q-toggle
            v-model="dataAppearance.navbarIconColorDefault"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
            class="q-mr-sm"
          >
            <div class="column">
              <span class="text-bold text-body2"> Ícones da navbar </span>
              <span> Utilizar a cor padrão para ícones da navbar </span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.navbarIconColorCode"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.navbarIconColorCode" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-separator />
        <!-- Menu lateral não selecionado -->
        <div class="q-mt-md">
          <q-toggle
            v-model="dataAppearance.sideMenuColorDefaultNotSelectedItem"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
            class="q-mr-sm"
          >
            <div class="column">
              <span class="text-bold text-body2"> Menu lateral - Itens não selecionados </span>
              <span>
                Utilizar a cor padrão para fundo dos itens não selecionados no menu lateral
              </span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.sideMenuColorCodeNotSelectedItem"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.sideMenuColorCodeNotSelectedItem" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-my-md">
          <q-toggle
            v-model="dataAppearance.sideMenuColorDefaultNotSelectedIcon"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
            class="q-mr-sm"
          >
            <div class="column">
              <span class="text-bold text-body2"> Menu lateral - Ícones não selecionados </span>
              <span> Utilizar a cor padrão para ícones não selecionados do menu lateral. </span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.sideMenuColorCodeNotSelectedIcon"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.sideMenuColorCodeNotSelectedIcon" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-separator />
        <!-- Menu lateral selecionado -->
        <div class="q-mt-md">
          <q-toggle
            v-model="dataAppearance.sideMenuColorDefaultSelectedItem"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
            class="q-mr-sm"
          >
            <div class="column">
              <span class="text-bold text-body2"> Menu lateral - Item selecionado </span>
              <span> Utilizar a cor padrão para fundo do item selecionado no menu lateral </span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.sideMenuColorCodeSelectedItem"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.sideMenuColorCodeSelectedItem" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-mt-md">
          <q-toggle
            v-model="dataAppearance.sideMenuColorDefaultSelectedIcon"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
            class="q-mr-sm"
          >
            <div class="column">
              <span class="text-bold text-body2"> Menu lateral - Ícone selecionado </span>
              <span> Utilizar a cor padrão para ícone selecionado no menu lateral </span>
            </div>
          </q-toggle>
          <q-input
            v-model="dataAppearance.sideMenuColorCodeSelectedIcon"
            bg-color="white"
            label-color="black"
            input-class="text-black"
            style="width: 200px"
            outlined
            dense
            label="Código da cor"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="dataAppearance.sideMenuColorCodeSelectedIcon" no-header />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions align="right" v-show="!loadingSetting">
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn
          @click="update"
          color="primary"
          label="Atualizar"
          size="md"
          :loading="loadingSetting"
          unelevated
          no-caps
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
