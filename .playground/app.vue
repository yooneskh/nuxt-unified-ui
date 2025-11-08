<script setup>

const counter = ref(0);

</script>


<template>
  <u-app>

    <un-typography
      icon="lucide:package"
      title="Unified Nuxt UI"
      subtitle="A Complete Package"
      text="A reuseable Nuxt layer which integrates Nuxt UI and some other useful libraries into your Nuxt application."
      class="text-2xl max-w-6xl mx-auto mb-6 mt-12 p-3"
    />

    <div class="grid grid-cols-3 gap-3 p-3 max-w-6xl mx-auto">

      <u-card>
        <un-typography
          icon="lucide:component"
          title="Nuxt UI"
          text="Nuxt UI is a component library that provides a set of styled components for your application."
          class="mb-3"
        />
        <u-button
          :label="`Counter: ${counter}`"
          @click="counter++"
        />
      </u-card>

      <u-card>
        <un-typography
          icon="lucide:message-circle"
          title="Unified Toast"
          text="Toast notifications are a simple way to display messages to the user."
          class="mb-3"
        />
        <div class="flex gap-2">
          <u-button 
            label="Launch Success Toast" 
            @click="toastSuccess({ title: 'Success' })" 
          />
          <u-button 
            label="Launch Error Toast" 
            @click="toastError({ title: 'Error' })" 
          />
        </div>
      </u-card>

      <u-card>
        <un-typography
          icon="lucide:wrench"
          title="Radash"
          text="Radash is a library of utility functions for working with arrays, objects, and strings."
          class="mb-3"
        />
        <div class="flex gap-2">
          <u-button 
            label="See Change Case" 
            @click="toast({ title: `Camel case of 'a simple text' is ${radCamel('a simple text')}` })" 
          />
        </div>
      </u-card>

    </div>
  </u-app>
</template>


<style>
  body {
    background-color: #FAFAFA;
  }
</style>
