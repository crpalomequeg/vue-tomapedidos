import BaseButton from '@/components/shared/BaseButton.vue'
import BaseInput from '@/components/shared/BaseInput.vue'
import BaseSelect from '@/components/shared/BaseSelect.vue'
import BaseModal from '@/components/shared/BaseModal.vue'

export const globalRegistration = (app) => {
    app.component('BaseButton', BaseButton)
    app.component('BaseInput', BaseInput)
    app.component('BaseSelect', BaseSelect)
    app.component('BaseModal', BaseModal)
  }