import type { Lesson } from '@/types/lesson'

const helloLesson: Lesson = {
  id: 'aws/fundamentos/hello',
  courseId: 'aws',
  moduleId: 'fundamentos',
  title: 'Hello, AWS',
  icon: '☁️',
  xpReward: 30,
  docUrl: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html',

  theory: [
    {
      tag: 'aws-intro',
      title: 'O que é AWS',
      body: `Amazon Web Services é a plataforma de cloud computing da Amazon.
Mais de 200 serviços sob demanda — computação, storage, banco, rede, ML.
Modelo pay-as-you-go: paga só pelo que usa, sem capex de infra própria.`,
      code: `# AWS CLI — listando buckets S3 da sua conta
$ aws s3 ls
2026-01-12 09:31:24 meu-bucket-prod
2026-02-03 14:02:11 backups-clientes`,
    },
    {
      tag: 'aws-regions',
      title: 'Regiões e Zonas de Disponibilidade',
      body: `AWS é organizada em regiões (us-east-1, sa-east-1, eu-west-1...).
Cada região tem múltiplas Availability Zones (AZs) — datacenters isolados.
Escolha de região afeta latência, custo e compliance (LGPD/GDPR).`,
      code: `# Listando regiões disponíveis
$ aws ec2 describe-regions --query "Regions[].RegionName" --output table
| us-east-1      |
| sa-east-1      |
| eu-west-1      |`,
    },
    {
      tag: 'aws-iam',
      title: 'IAM: identidade e permissões',
      body: `IAM (Identity and Access Management) controla quem pode fazer o quê.
Princípio do menor privilégio: dê só a permissão necessária, nada além.
Nunca use a conta root para o dia-a-dia — crie usuários/roles IAM.`,
      code: `// Política IAM: leitura-apenas em um bucket S3
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::meu-bucket-prod",
      "arn:aws:s3:::meu-bucket-prod/*"
    ]
  }]
}`,
    },
  ],

  flashcards: [
    {
      id: 'aws/fundamentos/hello/fc-1',
      front: 'O que é AWS em uma frase?',
      back: `Plataforma de cloud computing da Amazon com 200+ serviços sob demanda
(compute, storage, banco, rede, ML), com modelo pay-as-you-go.`,
      requires: ['aws-intro'],
    },
    {
      id: 'aws/fundamentos/hello/fc-2',
      front: 'Qual a diferença entre Região e Availability Zone?',
      back: `Região: localização geográfica (ex: us-east-1, sa-east-1).
AZ: datacenter isolado dentro de uma região — uma região tem várias AZs.
Distribuir entre AZs aumenta resiliência; escolha de região afeta latência e compliance.`,
      requires: ['aws-regions'],
    },
    {
      id: 'aws/fundamentos/hello/fc-3',
      front: 'Por que não usar a conta root no dia-a-dia?',
      back: `A root tem poder ilimitado e não pode ter permissões restritas.
Use IAM users/roles com o princípio do menor privilégio.
Reserve a root só para tarefas que exigem (billing inicial, fechar a conta).`,
      requires: ['aws-iam'],
    },
  ],

  challenges: [
    {
      id: 'aws/fundamentos/hello/ch-1',
      type: 'fill-blank',
      title: 'Listando buckets S3',
      description: 'Complete o comando AWS CLI para listar todos os buckets S3 da conta.',
      xpReward: 20,
      requires: ['aws-intro'],
      template: `$ aws ___ ls`,
      blanks: ['s3'],
      solution: `$ aws s3 ls`,
      hint: 'O serviço de object storage da AWS tem três letras.',
    },
    {
      id: 'aws/fundamentos/hello/ch-2',
      type: 'fill-blank',
      title: 'Política IAM mínima',
      description: 'Complete a action e o effect de uma política que permite leitura em um bucket.',
      xpReward: 25,
      requires: ['aws-iam'],
      template: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "___",
    "Action": ["s3:___"],
    "Resource": "arn:aws:s3:::meu-bucket/*"
  }]
}`,
      blanks: ['Allow', 'GetObject'],
      solution: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::meu-bucket/*"
  }]
}`,
      hint: 'Effect é Allow ou Deny. A action de leitura de objeto no S3 começa com "Get".',
    },
  ],
}

export default helloLesson
