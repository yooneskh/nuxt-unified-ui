<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();

</script>


<template>
  <div>
    {{ props.field }}
  </div>
</template>
