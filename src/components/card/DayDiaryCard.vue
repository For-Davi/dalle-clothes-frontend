<script setup lang="ts">

defineOptions({
  name: 'DayDiaryCard',
});

const props = defineProps<{
  data: {
    date: string,
    day:string,
    schedule: {
        time: string;
        employees: string[];
    }[]
  }
}>();

</script>
<template>
  <q-card class="full-width  bg-grey-1">
      <q-card-section>
        <div class="text-h6 text-center">{{ props.data.date }}</div>
        <div class="text-subtitle1 text-center ">
            {{ props.data.day }}
        </div>
        <q-separator  />
      </q-card-section>
      <q-card-actions class="column q-gutter-y-sm ">
        <div v-for="(item, index) in props.data.schedule" :key="index" class="full-width">
            <p class="text-blue text-bold text-center">{{ item.time }}</p>
            <div class="rounded-borders border-grey-light">
                <q-list v-for="(subItem, subIndex) in item.employees" dense class="rounded-borders" :key="subIndex">
                    <q-item clickable v-ripple class="row justify-center items-center">
                        <span>{{ subItem }}</span>
                    </q-item>
                </q-list>
            </div>
        </div>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn icon-right="edit" rounded  flat/>
        <q-btn icon-right="delete" rounded color="red"  flat/>
      </q-card-actions>
    </q-card>
</template>
