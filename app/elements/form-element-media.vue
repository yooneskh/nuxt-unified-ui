<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* media */

const { data: media, pending } = useUFetch(
  computed(() => `/media/${modelValue.value}`),
  {
    method: computed(() => !modelValue.value ? '' : 'get'),
  },
);


const fieldTitle = computed(() => {
  return media.value?.name;
});


/* upload */

const isUploading = ref(false);


const { open: openFilePicker, onChange, reset: resetFilePicker } = useFileDialog({
  accept: () => props.field.accept,
});


onChange(async files => {

  const file = files?.[0];

  if (!file) {
    return;
  }


  const body = new FormData();
  body.append('file', file);

  const response = await ufetch('/media/upload', {
    loading: isUploading,
    method: 'post',
    body,
  });


  modelValue.value = response?._id;
  resetFilePicker();

  toastSuccess({
    title: 'فایل با موفقیت آپلود شد.',
  });

});

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'label' ])">
    <div class="flex items-start gap-2 ltr">

      <template v-if="media?.type?.startsWith('image')">
        <u-popover mode="hover">

          <img
            :src="makeMediaFullPath(media?.path)"
            class="size-8 rounded object-cover"
          />

          <template #content>
            <img
              :src="makeMediaFullPath(media?.path)"
              class="w-64 rounded"
            />
          </template>

        </u-popover>
      </template>

      <u-input
        class="w-full ltr"
        icon="lucide:file"
        v-bind="radOmit(props.field, [ 'key', 'identifier', 'label' ])"
        readonly
        :loading="pending || isUploading"
        :model-value="fieldTitle"
        @click="openFilePicker()"
      />

    </div>
  </u-form-field>
</template>
