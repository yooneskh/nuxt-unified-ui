<script setup>

/* interface */

const props = defineProps({

  icon: String,
  title: String,
  subtitle: String,
  text: String,
  iconClasses: String,
  titleClasses: String,
  subtitleClasses: String,
  textClasses: String,

  fluidBody: Boolean,

  actions: Array,
  verticalActions: Boolean,

});

</script>


<template>
  <u-card :ui="{ body: 'p-0' }">

    <un-typography
      :icon="props.icon"
      :title="props.title"
      :subtitle="props.subtitle"
      :icon-classes="props.iconClasses"
      :title-classes="props.titleClasses"
      :subtitle-classes="props.subtitleClasses"
      class="p-3 border-b border-default">
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </un-typography>

    <div
      v-if="$slots.default || props.text"
      :class="{
        'p-3': !props.fluidBody,
      }">

      <p
        v-if="props.text"
        :class="[
          {
            'mb-3': !!$slots.default,
          },
          props.textClasses,
        ]">
        {{ props.text }}
      </p>

      <slot />

    </div>

    <div
      v-if="props.actions?.length"
      class="flex items-end gap-1 p-2 border-t border-default"
      :class="{
        'flex-col': props.verticalActions,
      }">

      <template v-for="(action, index) of props.actions" :key="index">

        <template v-if="!action.actionType || action.actionType === 'button'">
          <u-button
            loading-auto
            :block="props.verticalActions"
            v-bind="radOmit(action, [ 'actionType' ])"
          />
        </template>

        <template v-if="action.actionType === 'spacer'">
          <div class="grow" />
        </template>

      </template>

    </div>

  </u-card>
</template>
