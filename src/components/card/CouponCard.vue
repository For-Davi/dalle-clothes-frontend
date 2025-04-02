<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'CouponCard',
});

const props = defineProps<{
  name: string;
  description: string;
  code: string;
  active: number;
  hasLimit: number;
  used: number;
  limit: number | null;
  dateExpiration: string | null
}>();

const getIconStatus = computed((): string => {
  if(props.active === 1) {
    return 'task_alt'
  } else {
    return 'cancel'
  }
})
const getColorStatus = computed((): string => {
  if(props.active === 1) {
    return 'green'
  } else {
    return 'black'
  }
})
const getColorLinear = computed((): string => {
  if (props.hasLimit === 0) {
    return 'grey'
  } else if (props.hasLimit === 1 && (props.used === props.limit)) {
    return 'red'
  } else {
    return 'blue'
  }
})
const getColorDate = computed((): string => {
  const dateStr = props.dateExpiration ?? '';
  if (!dateStr) return 'text-grey';

  const today = new Date();
  const parts = dateStr.split('/');

  if (parts.length !== 3) {
    return 'text-grey';
  }

  const day = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10);
  const year = parseInt(parts[2]!, 10);

  const dateProp = new Date(year, month - 1, day);

  today.setHours(0, 0, 0, 0);
  dateProp.setHours(0, 0, 0, 0);

  return dateProp <= today ? 'text-grey' : 'text-red';
});
</script>
<template>
  <q-card class="full-width my-card bg-grey-1">
      <q-card-section>
        <div class="text-h6">{{ name }}</div>
        <div class="text-subtitle1 text-blue text-bold">
            {{ code }}
        </div>
        <div :class="getColorDate" class="text-subtitle2 q-mb-sm">
            Validade: {{ dateExpiration ?? 'Sem expiração' }}
        </div>
        <q-separator  />
      </q-card-section>
      <q-card-actions >
        <q-linear-progress 
          size="20px" 
          :value="hasLimit === 0 ? 1 : (used / (limit ?? 1))" 
          :color="getColorLinear" 
          stripe 
          rounded 
        >
          <div div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="hasLimit === 0 ? `${used}/ထ` : `${used}/${limit}`" />
          </div>
        </q-linear-progress>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn :icon-right="getIconStatus" rounded :color="getColorStatus"  flat>
          <q-tooltip>{{ active === 1 ? 'Ativo' : 'Inativo' }}</q-tooltip>
        </q-btn>
        <q-btn icon-right="delete" rounded color="red"  flat/>
      </q-card-actions>
    </q-card>
</template>
