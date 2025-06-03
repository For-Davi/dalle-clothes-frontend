<script setup lang="ts">
defineOptions({
  name: 'Loading',
});

const props = withDefaults(
  defineProps<{
    show: boolean;
    size?: string;
    color?: string;
    thickness?: number;
  }>(),
  {
    size: '80px',
    color: 'grey',
    thickness: 0.1,
  },
);
</script>

<template>
  <q-circular-progress
    :indeterminate="props.show"
    :size="props.size"
    :color="props.color"
    :thickness="props.thickness"
    class="q-ma-md absolute-center"
    rounded
  />
</template>
