import type { Course } from '@/types/course'
import { AWS_SVG } from '../brandIcons'
import helloLesson from './lessons/fundamentos-hello'

const awsCourse: Course = {
  id: 'aws',
  title: 'AWS',
  description: 'Cloud da Amazon — IAM, regiões, S3 e os serviços fundamentais.',
  icon: AWS_SVG,
  color: '#FF9900',
  docUrl: 'https://docs.aws.amazon.com',
  modules: [
    {
      id: 'fundamentos',
      title: 'Fundamentos',
      icon: '☁️',
      description: 'Conceitos-chave: regiões, AZs e IAM com menor privilégio.',
      color: '#FF9900',
      lessons: [helloLesson],
    },
  ],
}

export default awsCourse
