import type { Course } from '@/types/course'
import { VUE_SVG } from '../brandIcons'

// Reactivity
import refLesson from './lessons/reactivity-ref'
import reactiveLesson from './lessons/reactivity-reactive'
import computedLesson from './lessons/reactivity-computed'
import watchLesson from './lessons/reactivity-watch'
import watchEffectLesson from './lessons/reactivity-watch-effect'
import nextTickLesson from './lessons/reactivity-next-tick'

// Directives
import vIfLesson from './lessons/directives-v-if'
import vShowLesson from './lessons/directives-v-show'
import vForLesson from './lessons/directives-v-for'
import vBindLesson from './lessons/directives-v-bind'
import vOnLesson from './lessons/directives-v-on'
import vModelLesson from './lessons/directives-v-model'

// Communication
import emitsLesson from './lessons/communication-emits'
import propsLesson from './lessons/communication-props'
import exposeLesson from './lessons/communication-expose'
import slotLesson from './lessons/communication-slot'

// Pinia
import piniaStateLesson from './lessons/pinia-state'
import piniaGettersLesson from './lessons/pinia-getters'
import piniaActionsLesson from './lessons/pinia-actions'

// Lifecycle
import onMountedLesson from './lessons/lifecycle-on-mounted'
import onUpdatedLesson from './lessons/lifecycle-on-updated'
import onBeforeUnmountLesson from './lessons/lifecycle-on-before-unmount'
import onUnmountedLesson from './lessons/lifecycle-on-unmounted'

const vueCourse: Course = {
  id: 'vue',
  title: 'Vue.js',
  description: 'Vue 3 essentials — reactivity, directives, components, Pinia e ciclo de vida.',
  icon: VUE_SVG,
  color: '#42b883',
  docUrl: 'https://vuejs.org/guide/',
  modules: [
    {
      id: 'reactivity',
      title: 'Reatividade Central',
      icon: '🧪',
      description: 'ref, reactive, computed, watch, watchEffect e nextTick.',
      color: '#42b883',
      lessons: [
        refLesson,
        reactiveLesson,
        computedLesson,
        watchLesson,
        watchEffectLesson,
        nextTickLesson,
      ],
    },
    {
      id: 'directives',
      title: 'Diretivas de Template',
      icon: '🛠️',
      description: 'v-if, v-show, v-for, v-bind, v-on e v-model.',
      color: '#3b82f6',
      lessons: [
        vIfLesson,
        vShowLesson,
        vForLesson,
        vBindLesson,
        vOnLesson,
        vModelLesson,
      ],
    },
    {
      id: 'communication',
      title: 'Comunicação entre Componentes',
      icon: '🧬',
      description: 'props, emits, expose e slots — fluxo entre pai e filho.',
      color: '#8b5cf6',
      lessons: [emitsLesson, propsLesson, exposeLesson, slotLesson],
    },
    {
      id: 'pinia',
      title: 'Pinia',
      icon: '🍍',
      description: 'defineStore, state, getters e actions.',
      color: '#f59e0b',
      lessons: [piniaStateLesson, piniaGettersLesson, piniaActionsLesson],
    },
    {
      id: 'lifecycle',
      title: 'Ciclo de Vida',
      icon: '🎢',
      description: 'onMounted, onUpdated, onBeforeUnmount e onUnmounted.',
      color: '#10b981',
      lessons: [
        onMountedLesson,
        onUpdatedLesson,
        onBeforeUnmountLesson,
        onUnmountedLesson,
      ],
    },
  ],
}

export default vueCourse
