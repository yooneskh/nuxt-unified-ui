<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* open state */

const openItems = reactive(new Set());

function setItemOpen(item, open) {
  if (open) {
    openItems.add(item);
  }
  else {
    openItems.delete(item);
  }
}


/* actions */

function handleAddItem() {

  const item = JSON.parse(JSON.stringify( props.field.itemBase ?? {} ));

  openItems.add(item);

  modelValue.value = [
    ...(Array.isArray(modelValue.value) ? modelValue.value : []),
    item,
  ];

}

function handleDuplicateItem(index) {

  const item = {
    ...modelValue.value[index],
    _id: undefined,
  };

  openItems.add(item);

  modelValue.value = [
    ...(modelValue.value.slice(0, index + 1)),
    item,
    ...(modelValue.value.slice(index + 1)),
  ];

}

function handleDeleteItem(index) {

  openItems.delete(modelValue.value[index]);

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
        ({{ (modelValue?.length > 0) ? (`${modelValue.length} ${$t('common.items')}`) : ($t('common.none')) }})
      </span>

      <u-button
        variant="subtle"
        size="xs"
        icon="i-lucide-plus"
        :label="$t('common.newItem')"
        class="ms-2"
        @click="handleAddItem()"
      />

    </label>

    <template v-if="!modelValue || !(modelValue.length > 0)">
      <p class="text-xs text-center py-6">
        {{ $t('un.series.noItems') }}
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
        class="bg-default border border-default rounded">

        <div class="flex items-center gap-1 px-2 py-1">

          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-1 text-sm"
            :aria-expanded="openItems.has(item)"
            @click="setItemOpen(item, !openItems.has(item))">

            <u-icon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 transition-transform"
              :class="openItems.has(item) ? 'rotate-90' : 'rtl:rotate-180'"
            />

            <span>
              {{ $t('un.series.item', { n: index + 1 }) }}
            </span>

          </button>

          <div class="flex shrink-0 gap-1">

            <u-tooltip :text="$t('un.series.duplicate')">
              <u-button
                variant="subtle"
                icon="i-lucide-copy"
                size="xs"
                :aria-label="$t('un.series.duplicate')"
                @click="handleDuplicateItem(index)"
              />
            </u-tooltip>

            <u-tooltip :text="$t('un.series.moveBack')">
              <u-button
                v-if="index > 0"
                variant="subtle"
                icon="i-lucide-chevron-left"
                size="xs"
                :aria-label="$t('un.series.moveBack')"
                @click="handleMoveItem(index, -1)"
              />
            </u-tooltip>

            <u-tooltip :text="$t('un.series.moveForward')">
              <u-button
                v-if="index < modelValue.length - 1"
                variant="subtle"
                icon="i-lucide-chevron-right"
                size="xs"
                :aria-label="$t('un.series.moveForward')"
                @click="handleMoveItem(index, 1)"
              />
            </u-tooltip>

            <u-tooltip :text="$t('un.series.delete')">
              <u-button
                variant="subtle"
                color="error"
                icon="i-lucide-trash"
                size="xs"
                :aria-label="$t('un.series.delete')"
                @click="handleDeleteItem(index)"
              />
            </u-tooltip>

          </div>

        </div>

        <u-collapsible
          :open="openItems.has(item)"
          :unmount-on-hide="false"
          @update:open="setItemOpen(item, $event)">
          <template #content>
            <un-form
              :target="item"
              :fields="props.field.itemFields"
              class="border-t border-default p-2"
            />
          </template>
        </u-collapsible>

      </div>
    </div>

  </div>
</template>
