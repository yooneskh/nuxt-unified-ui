<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'fieldLabel', 'hint' ])">
    <u-checkbox
      class="w-full"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'fieldLabel', 'hint' ])"
      v-model="modelValue"
    />
  </u-form-field>
</template>
