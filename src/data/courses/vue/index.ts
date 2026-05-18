import type { Course } from '@/types/course'
import refLesson from './lessons/reactivity-ref'

const vueCourse: Course = {
  id: 'vue',
  title: 'Vue.js',
  description: 'Vue 3 essentials — reactivity, directives, components, Pinia e ciclo de vida.',
  icon: '🟢',
  color: '#42b883',
  docUrl: 'https://vuejs.org/guide/',
  modules: [
    {
      id: 'reactivity',
      title: 'Reatividade Central',
      icon: '🧪',
      description: 'ref, reactive, computed, watch, watchEffect e nextTick.',
      color: '#42b883',
      lessons: [refLesson],
    },
    {
      id: 'directives',
      title: 'Diretivas de Template',
      icon: '🛠️',
      description: 'v-if, v-show, v-for, v-bind, v-on e v-model.',
      color: '#3b82f6',
      lessons: [],
    },
    {
      id: 'communication',
      title: 'Comunicação entre Componentes',
      icon: '🧬',
      description: 'props, emits, expose e slots — fluxo entre pai e filho.',
      color: '#8b5cf6',
      lessons: [],
    },
    {
      id: 'pinia',
      title: 'Pinia',
      icon: '🍍',
      description: 'defineStore, state, getters e actions.',
      color: '#f59e0b',
      lessons: [],
    },
    {
      id: 'lifecycle',
      title: 'Ciclo de Vida',
      icon: '🎢',
      description: 'onMounted, onUpdated, onBeforeUnmount e onUnmounted.',
      color: '#10b981',
      lessons: [],
    },
  ],
}

export default vueCourse
