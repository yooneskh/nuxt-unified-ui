<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* actions */

function handleAddItem() {
  modelValue.value = [
    ...(Array.isArray(modelValue.value) ? modelValue.value : []),
    JSON.parse(JSON.stringify( props.field.itemBase ?? {} )),
  ];
}

function handleDuplicateItem(index) {
  modelValue.value = [
    ...(modelValue.value.slice(0, index + 1)),
    {
      ...modelValue.value[index],
      _id: undefined,
    },
    ...(modelValue.value.slice(index + 1)),
  ];
}

function handleDeleteItem(index) {
  modelValue.value = modelValue.value.filter((_, i) => i !== index);
}

function handleMoveItem(index, direction) {

  const items = [ ...modelValue.value ];
  const poppedItem = items.splice(index, 1)[0];

  items.splice(index + direction, 0, poppedItem);

  modelValue.value = items;

}

</script>


<template>
  <div class="border border-default rounded">

    <label class="text-sm flex items-center gap-1 px-2 py-1 border-b border-default">

      <span>
        {{ props.field.label }}
      </span>

      <span class="text-xs">
        ({{ (modelValue?.length > 0) ? (`${modelValue.length} Items`) : ('None') }})
      </span>

      <u-button
        variant="subtle"
        size="xs"
        icon="i-lucide-plus"
        label="New Item"
        class="ms-2"
        @click="handleAddItem()"
      />

    </label>

    <template v-if="!modelValue || !(modelValue.length > 0)">
      <p class="text-xs text-center py-6">
        No items added yet. Click on "New Item" to add one.
      </p>
    </template>

    <div
      v-else
      class="p-2 grid gap-2 bg-muted"
      :class="{
        'grid-cols-1': props.field.seriesColumns === 1 || !props.field.seriesColumns,
        'grid-cols-2': props.field.seriesColumns === 2,
        'grid-cols-3': props.field.seriesColumns === 3,
        'grid-cols-4': props.field.seriesColumns === 4,
        'grid-cols-5': props.field.seriesColumns === 5,
        'grid-cols-6': props.field.seriesColumns === 6,
      }">
      <div
        v-for="(item, index) of modelValue" :key="index"
        class="relative group">

        <un-form
          :target="item"
          :fields="props.field.itemFields"
          class="p-2 bg-default border border-default rounded"
        />

        <div
          class="
            absolute top-2 end-2
            hidden pointer-events-none
            group-hover:flex group-hover:gap-1 group-hover:pointer-events-auto
          ">

          <u-tooltip text="Duplicate">
            <u-button
              variant="subtle"
              icon="i-lucide-copy"
              size="xs"
              @click="handleDuplicateItem(index)"
            />
          </u-tooltip>

          <u-tooltip text="Move Back">
            <u-button
              v-if="index > 0"
              variant="subtle"
              icon="i-lucide-chevron-left"
              size="xs"
              @click="handleMoveItem(index, -1)"
            />
          </u-tooltip>

          <u-tooltip text="Move Forward">
            <u-button
              v-if="index < modelValue.length - 1"
              variant="subtle"
              icon="i-lucide-chevron-right"
              size="xs"
              @click="handleMoveItem(index, 1)"
            />
          </u-tooltip>

          <u-tooltip text="Delete">
            <u-button
              variant="subtle"
              color="error"
              icon="i-lucide-trash"
              size="xs"
              @click="handleDeleteItem(index)"
            />
          </u-tooltip>

        </div>

      </div>
    </div>

  </div>
</template>
