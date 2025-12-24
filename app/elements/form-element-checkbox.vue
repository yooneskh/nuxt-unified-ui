<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'fieldLabel', 'hint', 'help', 'description' ])">
    <u-checkbox
      class="w-full"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'fieldLabel', 'hint', 'help', 'description' ])"
      v-model="modelValue"
    />
  </u-form-field>
</template>
