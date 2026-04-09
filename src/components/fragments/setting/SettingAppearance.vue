<script setup lang="ts">
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
  <q-card flat bordered class="appearance-card">
    <q-card-section class="q-pb-sm">
      <div class="row items-center q-gutter-x-sm">
        <q-icon name="design_services" color="primary" size="22px" />
        <div>
          <div class="text-subtitle1 text-weight-bold">Aparência</div>
          <div class="text-caption text-grey-6">Personalize as cores da interface do sistema</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <Loading :show="loadingSetting" />

    <q-card-section v-show="!loadingSetting" class="q-pt-md">
      <q-form class="column q-gutter-y-none">
        <!-- Grupo: Título -->
        <div class="settings-group">
          <div class="group-label">
            <q-icon name="title" size="15px" class="q-mr-xs" />
            Título das Páginas
          </div>
          <div class="setting-row row items-center justify-between">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.titlePageColorDefault"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Cor padrão do título</div>
                  <div class="text-caption text-grey-6">Cor padrão para título das páginas</div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.titlePageColorDefault ? 'positive' : 'grey-4'"
                :text-color="dataAppearance.titlePageColorDefault ? 'white' : 'grey-7'"
                dense
                size="sm"
              >
                {{ dataAppearance.titlePageColorDefault ? 'Padrão' : 'Personalizado' }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.titlePageColorCode || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.titlePageColorCode"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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
        </div>

        <q-separator class="q-my-md" />

        <!-- Grupo: Navbar -->
        <div class="settings-group">
          <div class="group-label">
            <q-icon name="web" size="15px" class="q-mr-xs" />
            Navbar
          </div>
          <div class="setting-row row items-center justify-between q-mb-xs">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.navbarColorDefault"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Fundo da navbar</div>
                  <div class="text-caption text-grey-6">Cor de fundo da barra de navegação</div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.navbarColorDefault ? 'positive' : 'grey-4'"
                :text-color="dataAppearance.navbarColorDefault ? 'white' : 'grey-7'"
                dense
                size="sm"
              >
                {{ dataAppearance.navbarColorDefault ? 'Padrão' : 'Personalizado' }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs q-mb-md">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.navbarColorCode || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.navbarColorCode"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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
          <div class="setting-row row items-center justify-between q-mb-xs">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.navbarIconColorDefault"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Ícones da navbar</div>
                  <div class="text-caption text-grey-6">Cor dos ícones da barra de navegação</div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.navbarIconColorDefault ? 'positive' : 'grey-4'"
                :text-color="dataAppearance.navbarIconColorDefault ? 'white' : 'grey-7'"
                dense
                size="sm"
              >
                {{ dataAppearance.navbarIconColorDefault ? 'Padrão' : 'Personalizado' }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.navbarIconColorCode || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.navbarIconColorCode"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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
        </div>

        <q-separator class="q-my-md" />

        <!-- Grupo: Menu Lateral -->
        <div class="settings-group">
          <div class="group-label">
            <q-icon name="menu" size="15px" class="q-mr-xs" />
            Menu Lateral
          </div>

          <div class="sub-group-label q-mb-xs">Itens não selecionados</div>
          <div class="setting-row row items-center justify-between q-mb-xs">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.sideMenuColorDefaultNotSelectedItem"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Fundo dos itens</div>
                  <div class="text-caption text-grey-6">
                    Cor de fundo dos itens não selecionados
                  </div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.sideMenuColorDefaultNotSelectedItem ? 'positive' : 'grey-4'"
                :text-color="
                  dataAppearance.sideMenuColorDefaultNotSelectedItem ? 'white' : 'grey-7'
                "
                dense
                size="sm"
              >
                {{
                  dataAppearance.sideMenuColorDefaultNotSelectedItem ? 'Padrão' : 'Personalizado'
                }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs q-mb-md">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.sideMenuColorCodeNotSelectedItem || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.sideMenuColorCodeNotSelectedItem"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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
          <div class="setting-row row items-center justify-between q-mb-xs">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.sideMenuColorDefaultNotSelectedIcon"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Ícones</div>
                  <div class="text-caption text-grey-6">Cor dos ícones não selecionados</div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.sideMenuColorDefaultNotSelectedIcon ? 'positive' : 'grey-4'"
                :text-color="
                  dataAppearance.sideMenuColorDefaultNotSelectedIcon ? 'white' : 'grey-7'
                "
                dense
                size="sm"
              >
                {{
                  dataAppearance.sideMenuColorDefaultNotSelectedIcon ? 'Padrão' : 'Personalizado'
                }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs q-mb-lg">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.sideMenuColorCodeNotSelectedIcon || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.sideMenuColorCodeNotSelectedIcon"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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

          <div class="sub-group-label q-mb-xs">Item selecionado</div>
          <div class="setting-row row items-center justify-between q-mb-xs">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.sideMenuColorDefaultSelectedItem"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Fundo do item ativo</div>
                  <div class="text-caption text-grey-6">Cor de fundo do item selecionado</div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.sideMenuColorDefaultSelectedItem ? 'positive' : 'grey-4'"
                :text-color="dataAppearance.sideMenuColorDefaultSelectedItem ? 'white' : 'grey-7'"
                dense
                size="sm"
              >
                {{ dataAppearance.sideMenuColorDefaultSelectedItem ? 'Padrão' : 'Personalizado' }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs q-mb-md">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.sideMenuColorCodeSelectedItem || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.sideMenuColorCodeSelectedItem"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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
          <div class="setting-row row items-center justify-between q-mb-xs">
            <div class="col">
              <q-toggle
                v-model="dataAppearance.sideMenuColorDefaultSelectedIcon"
                checked-icon="check"
                color="primary"
                unchecked-icon="clear"
                :true-value="1"
                :false-value="0"
              >
                <div>
                  <div class="text-weight-medium text-body2">Ícone ativo</div>
                  <div class="text-caption text-grey-6">Cor do ícone selecionado</div>
                </div>
              </q-toggle>
            </div>
            <div class="col-auto">
              <q-chip
                :color="dataAppearance.sideMenuColorDefaultSelectedIcon ? 'positive' : 'grey-4'"
                :text-color="dataAppearance.sideMenuColorDefaultSelectedIcon ? 'white' : 'grey-7'"
                dense
                size="sm"
              >
                {{ dataAppearance.sideMenuColorDefaultSelectedIcon ? 'Padrão' : 'Personalizado' }}
              </q-chip>
            </div>
          </div>
          <div class="row items-center q-gutter-x-sm q-pl-sm q-mt-xs">
            <div
              class="color-dot"
              :style="{ background: dataAppearance.sideMenuColorCodeSelectedIcon || '#e0e0e0' }"
            />
            <q-input
              v-model="dataAppearance.sideMenuColorCodeSelectedIcon"
              bg-color="white"
              label-color="black"
              input-class="text-black"
              outlined
              dense
              label="Cor hex"
              style="width: 200px"
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
        </div>
      </q-form>
    </q-card-section>

    <q-separator v-show="!loadingSetting" />

    <q-card-actions align="right" v-show="!loadingSetting" class="q-pa-md">
      <q-btn
        @click="update"
        color="primary"
        label="Salvar alterações"
        size="md"
        :loading="loadingSetting"
        unelevated
        no-caps
        icon-right="save"
      />
    </q-card-actions>
  </q-card>
</template>
<style scoped>
.appearance-card {
  border-radius: 12px !important;
}

.settings-group {
  padding: 4px 0;
}

.group-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #78909c;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.sub-group-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #b0bec5;
  padding-left: 4px;
}

.setting-row {
  padding: 6px 0;
  gap: 12px;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
</style>
