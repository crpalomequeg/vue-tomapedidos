<script setup>
defineOptions({
  inheritAttrs: false
})

defineProps({
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})
</script>

<template>
    <label class="block text-gray-700 text-sm font-bold mb-2">
        {{ label }}
    </label>
    <select class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
    v-bind="{
        ...$attrs,
        onChange: ($event) => { $emit('update:modelValue', $event.target.value) }
      }"
      :value="modelValue"
    >
        <option value="">Seleccione de la lista</option>
        <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :selected="option === modelValue"
        >
        {{ option.descripcion }}
        </option>
    </select>

</template>